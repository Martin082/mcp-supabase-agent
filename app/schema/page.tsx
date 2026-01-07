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

    interface ColumnDefinition {
        table_name: string;
        column_name: string;
        data_type: string;
        is_nullable: string;
    }

    // Parse the result - exec_sql returns a JSON array of rows directly
    const columns = (result as unknown as ColumnDefinition[]) || [];

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
    const tables: Record<string, ColumnDefinition[]> = {};
    columns?.forEach((col) => {
        if (!tables[col.table_name]) {
            tables[col.table_name] = [];
        }
        tables[col.table_name].push(col);
    });

    const tableNames = Object.keys(tables).sort();

    return (
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto h-full bg-background animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <header className="flex items-start justify-between pb-6 border-b border-border">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Database Schema
                    </h1>
                    <div className="space-y-4 max-w-3xl">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The Chinook database is a practice database that pretends to be an <strong>online music store 🎵</strong>.
                            It stores fake but realistic data about <strong>Artists</strong> (bands, singers), <strong>Albums</strong>, <strong>Songs</strong> (tracks),
                            <strong>Customers</strong>, <strong>Invoices</strong> (sales / purchases), and <strong>Employees</strong>.
                        </p>
                        <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            <span className="px-2 py-1 bg-secondary rounded-md border border-border">Analyze Sales</span>
                            <span className="px-2 py-1 bg-secondary rounded-md border border-border">Track Popularity</span>
                            <span className="px-2 py-1 bg-secondary rounded-md border border-border">Employee Metrics</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            Try asking: "Which artist has the most albums?", "Which customers bought the most music?", or "How much money was made last year?"
                        </p>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    {tableNames.length} Tables
                </div>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tableNames.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 border border-dashed border-border rounded-3xl bg-secondary/50">
                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                            <Database className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-foreground">No tables found</p>
                        <p className="text-sm text-muted-foreground mt-1">Your public schema appears to be empty.</p>
                    </div>
                ) : (
                    tableNames.map(tableName => (
                        <Card key={tableName} className="flex flex-col shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-border bg-card/50 hover:bg-card group overflow-hidden rounded-3xl backdrop-blur-sm">
                            <CardHeader className="py-4 px-5 border-b border-border bg-muted/30 flex flex-row items-center justify-between space-y-0 group-hover:bg-muted/50 transition-colors">
                                <CardTitle className="font-mono text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors flex items-center gap-2" title={tableName}>
                                    <TableIcon className="w-4 h-4 opacity-50" />
                                    {tableName}
                                </CardTitle>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 rounded-md bg-secondary border border-border">Table</span>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden relative">
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    <table className="w-full text-left text-xs">
                                        <thead className="sticky top-0 bg-card/90 backdrop-blur z-10 border-b border-border">
                                            <tr>
                                                <th className="px-5 py-3 font-medium text-muted-foreground w-1/2">Column</th>
                                                <th className="px-5 py-3 font-medium text-muted-foreground w-1/2 text-right">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
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
                            <div className="px-5 py-3 bg-muted/20 border-t border-border text-[10px] text-muted-foreground flex justify-between items-center group-hover:bg-muted/40 transition-colors">
                                <span>{tables[tableName].length} columns</span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
