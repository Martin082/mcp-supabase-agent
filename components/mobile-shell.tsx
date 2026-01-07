"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function MobileShell({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-full w-full overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-80 h-full p-4 shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div className={cn(
                "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} onClick={() => setIsOpen(false)}>
                <div className={cn(
                    "fixed inset-y-0 left-0 z-50 w-80 h-full p-4 transition-transform duration-300 ease-in-out md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )} onClick={(e) => e.stopPropagation()}>
                    <Sidebar />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-8 text-muted-foreground hover:bg-white/5 rounded-full"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
                {/* Mobile Header Trigger */}
                <header className="flex h-16 items-center border-b border-white/5 px-4 md:hidden shrink-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(true)}
                        className="mr-2"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <span className="font-bold text-lg tracking-tight">Supabase Agent</span>
                </header>

                <main className="flex-1 overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
