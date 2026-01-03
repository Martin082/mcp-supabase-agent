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

    // Handle assistant messages with tool calls
    if (role === 'assistant' && toolInvocations && toolInvocations.length > 0) {
        return (
            <div className="flex flex-col gap-2 w-full max-w-4xl mx-auto py-6 px-4">
                {/* 
                   We hide the tool execution steps to show ONLY the final natural language answer.
                */}
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
