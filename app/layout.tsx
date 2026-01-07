import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Database, MessageSquare, Table } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Supabase SQL Agent",
    description: "Natural Language to SQL for Supabase",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, "h-screen flex overflow-hidden bg-background text-foreground tracking-wide antialiased")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    {/* Floating Sidebar Container */}
                    <div className="p-4 hidden md:flex h-full w-80 shrink-0">
                        <aside className="flex flex-col w-full h-full bg-secondary/50 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                            {/* Sidebar Header */}
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <Database className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className="font-bold text-lg tracking-tight">My Chats</span>
                                </div>
                                <ModeToggle />
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 space-y-4 overflow-y-auto">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground px-4 uppercase tracking-wider">Apps</p>
                                    <Link href="/" className="group flex items-center gap-3 px-4 py-4 bg-background/40 hover:bg-background/80 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/5 relative overflow-hidden">
                                        <div className="w-1 absolute left-0 top-3 bottom-3 bg-blue-500 rounded-r-full opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">Chat Interface</span>
                                            <span className="text-[10px] text-muted-foreground truncate">Query your databse</span>
                                        </div>
                                    </Link>
                                    <Link href="/schema" className="group flex items-center gap-3 px-4 py-4 bg-background/40 hover:bg-background/80 rounded-2xl transition-all duration-200 border border-transparent hover:border-white/5 relative overflow-hidden">
                                        <div className="w-1 absolute left-0 top-3 bottom-3 bg-purple-500 rounded-r-full opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <Table className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">Schema View</span>
                                            <span className="text-[10px] text-muted-foreground truncate">Explore tables & columns</span>
                                        </div>
                                    </Link>
                                </div>
                            </nav>

                            {/* New Chat Button */}
                            <div className="p-4 mt-auto">
                                <button className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                                    <span className="text-xl">+</span> New chat
                                </button>
                            </div>
                        </aside>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
