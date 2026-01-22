'use client';

import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Download, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
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

function formatValue(value: unknown): string {
    if (value === null || value === undefined) return '';
    const str = String(value);

    // Basic check for ISO-like date patterns (YYYY-MM-DD or YYYY-MM-DDTHH:mm:SS...)
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}(?::?\d{2})?)?)?$/;

    if (typeof value === 'string' && isoDatePattern.test(str)) {
        const date = new Date(str);
        if (!isNaN(date.getTime())) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
    }

    return str;
}

function DynamicTable({ data }: { data: Record<string, unknown>[] }) {
    const tableRef = useRef<HTMLDivElement>(null);

    if (!Array.isArray(data) || data.length === 0) return null;

    const headers = Object.keys(data[0]);
    const MAX_ROWS = 50;
    const displayData = data.slice(0, MAX_ROWS);
    const remainingRows = data.length - MAX_ROWS;

    const downloadCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...data.map(row => headers.map(header => {
                const val = row[header];
                return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
            }).join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const takeScreenshot = async () => {
        if (tableRef.current === null) return;

        try {
            // Get the current background color from the body to ensure correct theme capture
            const bgColor = window.getComputedStyle(document.body).backgroundColor;
            const dataUrl = await toPng(tableRef.current, {
                cacheBust: true,
                backgroundColor: bgColor,
                style: {
                    color: window.getComputedStyle(document.body).color // Ensure text color is also captured correctly
                }
            });
            const link = document.createElement('a');
            link.download = 'table-screenshot.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to take screenshot:', err);
        }
    };

    return (
        <div className="my-4 space-y-2">
            <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={takeScreenshot} className="h-8">
                    <Camera className="w-3.5 h-3.5 mr-2" />
                    Screenshot
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCSV} className="h-8">
                    <Download className="w-3.5 h-3.5 mr-2" />
                    CSV
                </Button>
            </div>

            <div ref={tableRef} className="rounded-md border overflow-hidden bg-background">
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
                        {displayData.map((row, i) => (
                            <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                                {headers.map((header) => (
                                    <TableCell key={`${i}-${header}`} className="py-2 px-4">
                                        {formatValue(row[header])}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {remainingRows > 0 && (
                <div className="text-sm text-muted-foreground text-center italic">
                    The complete table contains {remainingRows} more rows. Download CSV to view complete data.
                </div>
            )}
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
