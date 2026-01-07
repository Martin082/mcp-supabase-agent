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

import { ToolInvocation } from 'ai';

export interface MessageProps {
    role: 'user' | 'assistant' | 'system' | 'data';
    content: string;
    toolInvocations?: ToolInvocation[];
}

function DynamicTable({ data }: { data: Record<string, unknown>[] }) {
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
    const isAssistantWithTools = role === 'assistant' && toolInvocations && toolInvocations.length > 0;

    let renderedTools = null;
    let hasTable = false;

    if (isAssistantWithTools && toolInvocations) {
        // Find all tool indices that represent a valid table result
        const tableIndices = toolInvocations.map((tool, idx) => {
            if (tool.state !== 'result' || tool.toolName !== 'execute_sql') return -1;
            let data = tool.result;
            try { if (typeof data === 'string') data = JSON.parse(data); } catch (e) { return -1; }
            const isTable = Array.isArray(data) && (data.length > 1 || (data.length === 1 && Object.keys(data[0]).length > 3));
            return isTable ? idx : -1;
        }).filter(idx => idx !== -1);

        hasTable = tableIndices.length > 0;
        const lastTableIndex = tableIndices.length > 0 ? tableIndices[tableIndices.length - 1] : -1;

        renderedTools = toolInvocations.map((tool, idx) => {
            // Only render the tool if it's the last qualifying table result
            if (idx !== lastTableIndex) return null;

            let resultData = tool.state === 'result' ? tool.result : null;
            try {
                if (typeof resultData === 'string') resultData = JSON.parse(resultData);
            } catch (e) { }

            return <DynamicTable key={tool.toolCallId} data={resultData} />;
        });
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
                {isAssistantWithTools && renderedTools}
                {(!hasTable || !isAssistantWithTools) && content && (
                    <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
