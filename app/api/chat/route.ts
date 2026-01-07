import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
    try {
        let { messages } = await req.json();

        // --- Message Sanitization Logic ---
        // Filter out toolInvocations that don't have a result (e.g. if the user stopped the generation mid-call)
        // to prevent "ToolInvocation must have a result" errors on subsequent requests.
        messages = messages.map((m: any) => {
            if (m.toolInvocations) {
                return {
                    ...m,
                    toolInvocations: m.toolInvocations.filter((ti: any) => ti.state === 'result' || 'result' in ti)
                };
            }
            return m;
        });
        // --- End Message Sanitization ---

        // --- Rate Limiting Logic ---
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Log the request
        await supabase.from('api_request_logs').insert({
            ip_address: ip,
            path: '/api/chat'
        });

        // 2. Count requests from this IP in the last minute
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
        const { count, error: countError } = await supabase
            .from('api_request_logs')
            .select('*', { count: 'exact', head: true })
            .eq('ip_address', ip)
            .gte('created_at', oneMinuteAgo);

        if (countError) {
            console.error("Rate limit check error:", countError);
        } else if (count && count > 10) {
            return new Response(
                JSON.stringify({
                    error: "Too Many Requests",
                    message: "You are sending messages too fast. Please wait 1 minute before trying again. In the meantime, you can explore the 'Schema View' page to learn more about the database structure, or read through our documentation."
                }),
                {
                    status: 429,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        // --- End Rate Limiting Logic ---

        const result = streamText({
            model: openai('gpt-4o-mini'),
            messages,
            maxSteps: 15,
            system: `You are a helpful SQL assistant for a Supabase project.
    Your goal is to answer user questions by querying the database.
    
    Current Date and Time: ${new Date().toUTCString()}
    
    CRITICAL RULE: NEVER GUESS schema details. Hallucinations are strictly forbidden.
    1. SCHEMA FIRST: ALWAYS start by calling the 'read_schema_overview' tool. This provides a compact overview of all tables and their columns.
    2. TARGETED DRILL-DOWN: Use 'get_schema' ONLY if 'read_schema_overview' is missing information for a specific table you need to query.
    
    DATABASE RULES:
    1. READ ONLY. You are strictly FORBIDDEN from running INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, or any modification commands.
    2. Only use SELECT statements. NEVER include semicolons (;) at the end of your SQL queries. ALWAYS append "LIMIT 50" to your queries to prevent large data dumps, unless the user explicitly requests a specific count or limit.
    
    RESPONSE FORMAT: 
    - CRITICAL: Use EXACTLY ONE format per response. Either a table OR natural language, NEVER BOTH.
    - FOR MULTIPLE RESULTS (2+ rows): Your message body MUST be completely empty. Provide NO natural language or explanations.
    - FOR SINGLE VALUES OR COUNTS (1 row): Provide ONLY a natural language sentence and skip the table.
    - NEVER repeat tool outputs or database schemas in your message.
    
    If the query returns no results, state that clearly in natural language.
    `,
            tools: {
                list_tables: tool({
                    description: 'List all tables in the database schema',
                    parameters: z.object({}),
                    execute: async () => {
                        console.log("Executing tool: list_tables");
                        if (!supabaseUrl || !supabaseKey) {
                            return "Error: Supabase credentials missing.";
                        }
                        const supabase = createClient(supabaseUrl, supabaseKey);

                        // Try to fetch public tables via REST API introspection
                        const { data, error } = await supabase.from('information_schema.tables')
                            .select('table_name')
                            .eq('table_schema', 'public');

                        if (error) {
                            console.error("List tables error:", error);
                            // Fallback: fetch OpenAPI spec
                            try {
                                const response = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
                                const openApi = await response.json();
                                if (openApi && openApi.definitions) {
                                    return JSON.stringify(Object.keys(openApi.definitions));
                                }
                            } catch (fetchError) {
                                console.error("OpenAPI fetch error:", fetchError);
                            }
                            return `Error listing tables: ${error.message}. (Hint: You may need to grant permissions on information_schema or provide a Service Role Key)`;
                        }

                        return JSON.stringify(data.map((t: any) => t.table_name));
                    },
                }),
                read_schema_overview: tool({
                    description: 'Read the schema_table_overview table to understand the database structure.',
                    parameters: z.object({}),
                    execute: async () => {
                        console.log("Executing tool: read_schema_overview");
                        if (!supabaseUrl || !supabaseKey) return "Error: Credentials missing.";
                        const supabase = createClient(supabaseUrl, supabaseKey);

                        const { data, error } = await supabase.from('schema_table_overview').select('*');

                        if (error) {
                            return `Error reading schema overview: ${error.message}`;
                        }
                        return JSON.stringify(data);
                    },
                }),
                get_schema: tool({
                    description: 'Get the detailed schema definition for a specific table. Use this only if read_schema_overview is insufficient.',
                    parameters: z.object({
                        table: z.string().describe('The table name to get schema for'),
                    }),
                    execute: async ({ table }) => {
                        console.log("Executing tool: get_schema", table);
                        if (!supabaseUrl || !supabaseKey) return "Error: Credentials missing.";
                        const supabase = createClient(supabaseUrl, supabaseKey);

                        const { data, error } = await supabase.from('information_schema.columns')
                            .select('column_name, data_type, is_nullable')
                            .eq('table_schema', 'public')
                            .eq('table_name', table);

                        if (error) {
                            return `Error getting schema: ${error.message}`;
                        }
                        if (!data || data.length === 0) {
                            return `No columns found for table '${table}'. It might not exist or is not accessible.`;
                        }
                        return JSON.stringify(data);
                    },
                }),
                execute_sql: tool({
                    description: 'Execute a read-only SQL query',
                    parameters: z.object({
                        query: z.string().describe('The SQL query to execute. Must be a SELECT statement.'),
                    }),
                    execute: async ({ query }) => {
                        console.log("Executing tool: execute_sql", query);
                        if (!supabaseUrl || !supabaseKey) return "Error: Credentials missing.";

                        // Security Check 1: Must be a read-type statement
                        // Remove comments and leading whitespace for accurate check
                        const cleanQuery = query.replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '').trim().toLowerCase();

                        if (!cleanQuery.startsWith('select') && !cleanQuery.startsWith('with') && !cleanQuery.startsWith('values')) {
                            return "Error: Only SELECT statements are allowed. (Received: " + cleanQuery.substring(0, 20) + "...)";
                        }

                        // Security Check 2: No stacked queries (semicolons)
                        if (query.includes(';')) {
                            return "Error: Semicolons are not allowed to prevent multiple statements.";
                        }

                        // Security Check 3: Forbidden keywords (destructive DDL/DML and resource exhaustion)
                        const forbiddenKeywords = [
                            'drop', 'delete', 'update', 'insert', 'truncate', 'alter', 'create', 'grant', 'revoke',
                            'pg_sleep', 'copy', 'vacuum', 'analyze', 'pg_terminate_backend', 'pg_cancel_backend'
                        ];
                        const foundKeyword = forbiddenKeywords.find(keyword =>
                            new RegExp(`\\b${keyword}\\b`, 'i').test(query)
                        );

                        if (foundKeyword) {
                            return `Error: The keyword '${foundKeyword.toUpperCase()}' is forbidden for security reasons.`;
                        }

                        const supabase = createClient(supabaseUrl, supabaseKey);

                        const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', { query });
                        if (!rpcError) {
                            return JSON.stringify(rpcData);
                        }

                        // Handle missing RPC function error specifically
                        if (rpcError.message.includes('Could not find the function') || rpcError.message.includes('syntax error')) {
                            return `Error: The database helper function 'exec_sql' is missing or broken. 
                        
                        Please run the following SQL in your Supabase SQL Editor to create it with restricted permissions:
                        
                        CREATE OR REPLACE FUNCTION exec_sql(query text)
                        RETURNS jsonb
                        LANGUAGE plpgsql
                        SECURITY DEFINER
                        AS $$
                        DECLARE
                          retval jsonb;
                        BEGIN
                          -- Force the transaction to be read-only for extra safety
                          SET LOCAL TRANSACTION READ ONLY;
                          EXECUTE 'SELECT coalesce(jsonb_agg(t), ''[]''::jsonb) FROM (' || query || ') t' INTO retval;
                          RETURN retval;
                        END;
                        $$;
                        
                        GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;
                        GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;`;
                        }

                        return `Error: execution failed. 
                    
                    To run raw SQL like '${query}', you must create the security-restricted Postgres function:
                    
                    CREATE OR REPLACE FUNCTION exec_sql(query text)
                    RETURNS jsonb
                    LANGUAGE plpgsql
                    SECURITY DEFINER
                    AS $$
                    DECLARE
                      retval jsonb;
                    BEGIN
                      SET LOCAL TRANSACTION READ ONLY;
                      EXECUTE 'SELECT coalesce(jsonb_agg(t), ''[]''::jsonb) FROM (' || query || ') t' INTO retval;
                      RETURN retval;
                    END;
                    $$;
                    
                    RPC Error was: ${rpcError.message}`;
                    },
                }),
            },
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error("Error in chat route:", error);
        return new Response(
            JSON.stringify({
                error: "Server Error",
                message: error.message || "An unknown error occurred"
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
