"use client";

import Link from "next/link";
import { Database, MessageSquare, Table } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleNewChat = () => {
        // Since useChat state is local to the page, 
        // redirecting to home or refreshing home resets it.
        if (pathname === '/') {
            window.location.reload();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="h-full w-full">
            <aside className="flex flex-col w-full h-full bg-secondary/50 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                {/* Sidebar Header */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Database className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">My Chats</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider">Apps</p>
                        <Link href="/" className={cn(
                            "group flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/5 relative overflow-hidden",
                            pathname === "/" ? "bg-background/80 border-white/5" : "bg-background/40 hover:bg-background/80"
                        )}>
                            <div className={cn(
                                "w-1 absolute left-0 top-3 bottom-3 bg-blue-500 rounded-r-full transition-opacity",
                                pathname === "/" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )} />
                            <MessageSquare className={cn(
                                "w-5 h-5 transition-colors",
                                pathname === "/" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">Chat Interface</span>
                                <span className="text-[10px] text-muted-foreground truncate">Query your database</span>
                            </div>
                        </Link>
                        <Link href="/schema" className={cn(
                            "group flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/5 relative overflow-hidden",
                            pathname === "/schema" ? "bg-background/80 border-white/5" : "bg-background/40 hover:bg-background/80"
                        )}>
                            <div className={cn(
                                "w-1 absolute left-0 top-3 bottom-3 bg-purple-500 rounded-r-full transition-opacity",
                                pathname === "/schema" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )} />
                            <Table className={cn(
                                "w-5 h-5 transition-colors",
                                pathname === "/schema" ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">Schema View</span>
                                <span className="text-[10px] text-muted-foreground truncate">Explore tables & columns</span>
                            </div>
                        </Link>
                    </div>
                </nav>

                {/* Footer Controls */}
                <div className="p-4 mt-auto border-t border-white/5 bg-background/20 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-xs text-muted-foreground">Appearance</span>
                        <ModeToggle />
                    </div>
                    <button
                        onClick={handleNewChat}
                        className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span className="text-xl">+</span> New chat
                    </button>
                </div>
            </aside>
        </div>
    );
}
