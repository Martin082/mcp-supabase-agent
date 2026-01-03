import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export interface MessageProps {
    role: 'user' | 'assistant' | 'system' | 'data';
    content: string;
    toolInvocations?: any[];
}

function DynamicTable({ data }: { data: any[] }) {
    if (!Array.isArray(data) || data.length === 0) return null;

    const headers = Object.keys(data[0]);

    return (
        <div className="rounded-md border my-4 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHead key={header} className="capitalize py-2 px-4 whitespace-nowrap bg-muted/50">
                                {header.replace(/_/g, ' ')}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                            {headers.map((header) => (
                                <TableCell key={`${i}-${header}`} className="py-2 px-4">
                                    {String(row[header] ?? '')}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function ChatMessage({ role, content, toolInvocations }: MessageProps) {

    // Handle tool results specifically
    if (role === 'assistant' && toolInvocations && toolInvocations.length > 0) {
        return (
            <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto py-6 px-4">
                {toolInvocations.map((tool, index) => {
                    const isResult = tool.state === 'result';

                    if (isResult) {
                        const toolName = tool.toolName;
                        let resultData = tool.result;

                        try {
                            if (typeof resultData === 'string') {
                                resultData = JSON.parse(resultData);
                            }
                        } catch (e) {
                            // Leave as is
                        }

                        // Special rendering for SQL results (arrays of objects)
                        if (Array.isArray(resultData) && resultData.length > 0 && typeof resultData[0] === 'object') {
                            return (
                                <div key={tool.toolCallId} className="space-y-2">
                                    <div className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
                                        Data Source: {toolName}
                                    </div>
                                    <DynamicTable data={resultData} />
                                </div>
                            );
                        }

                        // Fallback for other tool results (e.g. error messages or simple strings)
                        return (
                            <div key={tool.toolCallId} className="bg-muted/30 border border-border/50 rounded-lg p-3 text-xs font-mono text-muted-foreground overflow-auto whitespace-pre-wrap">
                                <span className="text-primary/70">{toolName}:</span> {typeof resultData === 'string' ? resultData : JSON.stringify(resultData, null, 2)}
                            </div>
                        );
                    }

                    return (
                        <div key={tool.toolCallId} className="flex items-center gap-2 text-xs text-muted-foreground/60 animate-pulse">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                            <span>Processing {tool.toolName}...</span>
                        </div>
                    );
                })}

                {content && (
                    <div className="prose dark:prose-invert prose-p:text-foreground/90 prose-headings:text-foreground max-w-none pt-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            className={cn(
                "flex w-full items-start gap-4 p-6 transition-colors",
                role === "user" ? "bg-muted/30 border-y border-border/20" : "bg-background"
            )}
        >
            <div className={cn(
                "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border text-xs font-bold shadow",
                role === "user" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground"
            )}>
                {role === "user" ? "U" : "AI"}
            </div>
            <div className="flex-1 space-y-2 overflow-hidden min-w-0">
                <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}
