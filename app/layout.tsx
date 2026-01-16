import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MobileShell } from "@/components/mobile-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { ChatResetProvider } from "@/components/chat-reset-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Lumina Agent",
    description: "Natural Language Interface for your Database",
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
                    <ChatResetProvider>
                        <MobileShell>
                            {children}
                        </MobileShell>
                    </ChatResetProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
