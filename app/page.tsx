'use client';

import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { ChatMessage } from '@/components/chat-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Terminal } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit, isLoading, error, stop } = useChat();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isAtBottom = useRef(true);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const atBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
        isAtBottom.current = atBottom;
    };

    useEffect(() => {
        if (isAtBottom.current && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full bg-background relative">
            {/* Chat Messages Area */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 pb-32 scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <div className="relative bg-card p-4 rounded-2xl border border-border shadow-xl">
                                <Terminal className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-lg">
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                How can I help you today?
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Ask questions about your data. The agent will explore your schema and execute safe queries.
                            </p>
                        </div>

                        {/* Example chips */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
                            {[
                                { title: "Most Albums", desc: "Which artist has the most albums?" },
                                { title: "Music Lovers", desc: "Which customers bought the most music?" },
                                { title: "Yearly Revenue", desc: "How much money was made last year?" }
                            ].map((item, i) => (
                                <button key={i} onClick={() => handleInputChange({ target: { value: item.desc } } as any)} className="p-4 rounded-2xl bg-secondary hover:bg-muted border border-border text-left transition-all hover:scale-[1.02] group">
                                    <span className="block font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</span>
                                    <span className="block text-xs text-muted-foreground">{item.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-2xl border border-destructive/20 max-w-3xl mx-auto flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                        <div>
                            <p className="font-bold">Error</p>
                            <p className="opacity-90">{error.message}</p>
                        </div>
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

                {isLoading && (
                    <div className="w-full flex flex-col items-center justify-center gap-3 py-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex space-x-1">
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">Thinking</span>
                    </div>
                )}

            </div>

            {/* Input Area */}
            <div className="absolute bottom-6 left-0 right-0 px-4 md:px-8 flex justify-center">
                <div className="w-full max-w-3xl relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                    <form onSubmit={handleSubmit} className="relative flex items-center bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden p-2 pl-6">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your prompt here..."
                            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50 h-12"
                            autoFocus
                        />
                        <Button
                            type={isLoading ? "button" : "submit"}
                            onClick={(e) => {
                                if (isLoading) {
                                    e.preventDefault();
                                    stop();
                                }
                            }}
                            disabled={!isLoading && !input.trim()}
                            className={cn(
                                "h-12 w-12 rounded-full shrink-0 ml-2 transition-all duration-300 hover:scale-105 flex items-center justify-center",
                                isLoading ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:hover:scale-100"
                            )}
                        >
                            {isLoading ? (
                                <div className="h-3 w-3 bg-current rounded-sm animate-in zoom-in duration-200" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </Button>
                    </form>
                    <p className="text-center text-[10px] text-muted-foreground mt-3 opacity-50">
                        Supabase SQL Agent can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
