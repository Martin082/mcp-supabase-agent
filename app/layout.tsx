import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

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
                    defaultTheme="system"
                    enableSystem={true}
                    disableTransitionOnChange
                >
                    <Sidebar />

                    {/* Main Content */}
                    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
