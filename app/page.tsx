'use client';

import { useChat } from '@ai-sdk/react';
import { ChatMessage } from '@/components/chat-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Terminal } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-background relative">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <Terminal className="w-12 h-12" />
                        <h2 className="text-xl font-semibold">Supabase SQL Agent</h2>
                        <p className="max-w-md text-sm">
                            Ask questions about your data. The agent will explore your schema and execute safe, read-only SQL queries.
                        </p>
                    </div>
                )}


                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md max-w-3xl mx-auto">
                        <p className="font-bold">Error:</p>
                        <p>{error.message}</p>
                    </div>
                )}

                {messages.map(m => (
                    <ChatMessage
                        key={m.id}
                        role={m.role as any}
                        content={m.content}
                        toolInvocations={m.toolInvocations}
                    />
                ))}

                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        <span>Thinking...</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
                <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask a question about your database..."
                        className="flex-1"
                        autoFocus
                    />
                    <Button type="submit" disabled={isLoading}>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}
