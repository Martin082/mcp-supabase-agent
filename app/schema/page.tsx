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
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto h-full bg-background/50">
            {/* Header */}
            <header className="flex items-start justify-between pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Database Schema
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        The database contains information about <strong>{tableNames.join(', ')}</strong>.
                        Use this schema to understand the available data points and structure for your queries.
                    </p>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    {tableNames.length} Tables
                </div>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tableNames.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            <Database className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No tables found</p>
                        <p className="text-sm text-muted-foreground mt-1">Your public schema appears to be empty.</p>
                    </div>
                ) : (
                    tableNames.map(tableName => (
                        <Card key={tableName} className="flex flex-col shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-white/5 bg-zinc-900/50 hover:bg-zinc-900/80 group overflow-hidden rounded-3xl backdrop-blur-sm">
                            <CardHeader className="py-4 px-5 border-b border-white/5 bg-white/[0.02] flex flex-row items-center justify-between space-y-0 group-hover:bg-white/[0.04] transition-colors">
                                <CardTitle className="font-mono text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors flex items-center gap-2" title={tableName}>
                                    <TableIcon className="w-4 h-4 opacity-50" />
                                    {tableName}
                                </CardTitle>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 rounded-md bg-white/5 border border-white/5">Table</span>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden relative">
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left text-xs">
                                        <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur z-10 border-b border-white/5">
                                            <tr>
                                                <th className="px-5 py-3 font-medium text-muted-foreground w-1/2">Column</th>
                                                <th className="px-5 py-3 font-medium text-muted-foreground w-1/2 text-right">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {tables[tableName].map((col: any) => (
                                                <tr key={col.column_name} className="hover:bg-white/[0.02] transition-colors group/row">
                                                    <td className="px-5 py-2.5 font-mono text-foreground/80 group-hover/row:text-primary transition-colors flex items-center gap-2">
                                                        {col.is_nullable === 'NO' && (
                                                            <div className="w-1 h-1 rounded-full bg-red-400 shrink-0 shadow-[0_0_8px_rgba(248,113,113,0.5)]" title="Required" />
                                                        )}
                                                        {col.column_name}
                                                    </td>
                                                    <td className="px-5 py-2.5 text-muted-foreground font-mono opacity-60 text-right group-hover/row:opacity-100 transition-opacity">
                                                        {col.data_type}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                            <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 text-[10px] text-muted-foreground flex justify-between items-center group-hover:bg-white/[0.04] transition-colors">
                                <span>{tables[tableName].length} columns</span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
