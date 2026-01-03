import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 30;

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = streamText({
            model: openai('gpt-4o-mini'),
            messages,
            maxSteps: 5,
            system: `You are a helpful SQL assistant for a Supabase project.
    Your goal is to answer user questions by querying the database.
    
    RULES:
    1. READ ONLY. You are strictly FORBIDDEN from running INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, or any modification commands.
    2. Only use SELECT statements. NEVER include semicolons (;) at the end of your SQL queries.
    3. Always start by reading the 'schema_table_overview' table using the 'read_schema_overview' tool to understand the database structure.
    4. RESPONSE FORMAT: 
       - For MULTIPLE results (lists/tables), provide NO natural language summary at all. Do not include an intro or outro.
       - For SINGLE results (e.g. specific values or counts), provide the answer ONLY in natural language.
       - NEVER include manual markdown tables or raw JSON in your message.
    5. If the query returns no results, state that clearly in natural language.
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
                    description: 'Get the schema definition for a specific table',
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

                        const lowerQuery = query.trim().toLowerCase();
                        if (!lowerQuery.startsWith('select') && !lowerQuery.startsWith('with') && !lowerQuery.startsWith('values')) {
                            return "Error: Only SELECT statements are allowed.";
                        }

                        const supabase = createClient(supabaseUrl, supabaseKey);

                        const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', { query });
                        if (!rpcError) {
                            return JSON.stringify(rpcData);
                        }

                        // Handle missing RPC function error specifically
                        if (rpcError.message.includes('Could not find the function')) {
                            return `Error: The database helper function 'exec_sql' is missing. 
                            
                            Please run the following SQL in your Supabase SQL Editor to create it:
                            
                            CREATE OR REPLACE FUNCTION exec_sql(query text)
                            RETURNS jsonb
                            LANGUAGE plpgsql
                            SECURITY DEFINER
                            AS $$
                            BEGIN
                              RETURN (SELECT jsonb_agg(t) FROM (EXECUTE query) t);
                            END;
                            $$;
                            
                            GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;
                            GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;`;
                        }

                        return `Error: execution failed. The client capabilities are limited to PostgREST. 
                        
                        To run raw SQL like '${query}', you must create a Postgres function in your database:
                        
                        CREATE OR REPLACE FUNCTION exec_sql(query text)
                        RETURNS jsonb
                        LANGUAGE plpgsql
                        SECURITY DEFINER
                        AS $$
                        BEGIN
                          RETURN (SELECT jsonb_agg(t) FROM (EXECUTE query) t);
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
