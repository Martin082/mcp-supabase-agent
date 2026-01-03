import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Database, MessageSquare } from "lucide-react";
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
            <body className={cn(inter.className, "h-screen flex overflow-hidden bg-background text-foreground transition-colors duration-300")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {/* Sidebar */}
                    <aside className="w-64 border-r bg-muted/20 flex flex-col">
                        <div className="p-6 border-b flex items-center gap-2">
                            <Database className="w-6 h-6 text-primary" />
                            <span className="font-bold text-lg">SQL Agent</span>
                        </div>
                        <nav className="flex-1 p-4 space-y-2">
                            <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
                                <MessageSquare className="w-4 h-4" />
                                Chat
                            </Link>
                            {/* Add more links here if needed */}
                        </nav>
                        <div className="p-4 border-t text-xs text-muted-foreground flex justify-between items-center">
                            <span>Supabase Connected</span>
                            <ModeToggle />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col h-full overflow-hidden">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
