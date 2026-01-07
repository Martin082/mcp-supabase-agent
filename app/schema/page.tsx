import { createClient } from '@supabase/supabase-js';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table as TableIcon, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SchemaPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // Check credentials
    if (!supabaseUrl || !supabaseKey) {
        return (
            <div className="p-8 text-destructive flex flex-col items-center gap-4">
                <Database className="w-12 h-12" />
                <h2 className="text-xl font-semibold">Configuration Error</h2>
                <p>Missing Supabase credentials. Please check your environment variables.</p>
            </div>
        );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch tables and columns using RPC to bypass PostgREST limitations on information_schema
    const { data: result, error } = await supabase.rpc('exec_sql', {
        query: `SELECT table_name, column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position`
    });

    // Parse the result - exec_sql returns a JSON array of rows directly
    const columns = result as any[] || [];

    if (error) {
        return (
            <div className="p-8 text-destructive">
                <h2 className="text-xl font-bold mb-2">Error Loading Schema</h2>
                <p>{error.message}</p>
                <p className="text-sm mt-4 text-muted-foreground">Ensure your environment variables are set correctly and the database is accessible.</p>
            </div>
        );
    }

    // Group by table
    const tables: Record<string, typeof columns> = {};
    columns?.forEach(col => {
        if (!tables[col.table_name]) {
            tables[col.table_name] = [];
        }
        tables[col.table_name].push(col);
    });

    const tableNames = Object.keys(tables).sort();

    return (
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto h-full bg-background/50">
            <header className="flex items-center gap-3 pb-4 border-b">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <TableIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Database Schema</h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                        This is the schema of the database of this app. Here you can see what type of info it contains so you know what type of questions it can answer.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Exploring <span className="font-mono text-primary">{tableNames.length}</span> public tables
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tableNames.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/20">
                        <Database className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-lg font-medium">No tables found</p>
                        <p className="text-sm text-muted-foreground">Your public schema appears to be empty.</p>
                    </div>
                ) : (
                    tableNames.map(tableName => (
                        <Card key={tableName} className="flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 border-muted/50 overflow-hidden">
                            <CardHeader className="py-3 px-4 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="font-mono text-sm font-semibold truncate text-primary" title={tableName}>
                                    {tableName}
                                </CardTitle>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground px-1.5 py-0.5 rounded bg-background border">Table</span>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left text-xs">
                                        <thead className="sticky top-0 bg-background border-b z-10">
                                            <tr>
                                                <th className="px-4 py-2 font-medium text-muted-foreground w-1/2">Column</th>
                                                <th className="px-4 py-2 font-medium text-muted-foreground w-1/2">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-muted/30">
                                            {tables[tableName].map((col: any) => (
                                                <tr key={col.column_name} className="hover:bg-muted/10 transition-colors group">
                                                    <td className="px-4 py-2 font-mono text-foreground/80 group-hover:text-primary transition-colors flex items-center gap-1.5">
                                                        {col.column_name}
                                                        {col.is_nullable === 'NO' && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" title="Required" />
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-muted-foreground font-mono opacity-80">
                                                        {col.data_type}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                            <div className="px-4 py-2 bg-muted/10 border-t text-[10px] text-muted-foreground flex justify-between">
                                <span>{tables[tableName].length} columns</span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
