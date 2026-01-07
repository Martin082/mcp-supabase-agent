import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bot, ShieldCheck, Zap, BarChart3, Lock, FileOutput } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="h-full overflow-y-auto no-scrollbar p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-24">
            {/* ... hero section omitted for brevity ... */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
                    <Bot className="w-10 h-10" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Your Data Analyst, Available 24/7
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Stop waiting for reports. Just ask questions in plain English and get answers instantly.
                </p>
            </div>

            {/* How it Works / Core Value */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors shadow-lg">
                    <CardHeader>
                        <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                        <CardTitle>Instant Answers</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        No need to learn SQL or wait for the data team. Ask "How were sales last month?" and get the data immediately.
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors shadow-lg">
                    <CardHeader>
                        <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                        <CardTitle>100% Secure</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        The agent has "Read-Only" access. It can see your data to answer questions, but it can never change, delete, or mess up your records.
                    </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors shadow-lg">
                    <CardHeader>
                        <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
                        <CardTitle>Deep Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        It connects the dots across your entire business—Sales, Customers, and Inventory—to find trends you might miss.
                    </CardContent>
                </Card>
            </div>

            {/* Production Capabilities (The Upsell) */}
            <div className="bg-secondary/30 rounded-[2.5rem] p-8 md:p-12 border border-border/50">
                <div className="md:flex items-start gap-12">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">Enterprise-Ready Features</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            This creates a secure bridge between your team and your data.
                            While this is a general demo, a custom version built for your company can do even more.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border">
                                <Bot className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold">Custom Branding</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Your logo, your colors, at your domain.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border">
                                <Lock className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold">Role-Based Access</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Control exactly who can see which tables.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border">
                                <FileOutput className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold">One-Click Exports</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Download answers as CSV, Excel, or PDF reports.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border">
                                <ShieldCheck className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <h3 className="font-semibold">Audit Logs</h3>
                                    <p className="text-xs text-muted-foreground mt-1">Track every single question asked for compliance.</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-muted-foreground font-medium pt-4">
                            ...and anything else your team needs.
                        </p>
                    </div>
                </div>
            </div>

            <div className="text-center pt-8">
                <p className="text-sm text-muted-foreground">
                    Interested in a custom agent for your business? <a href="https://calendly.com/martin-luminastudiomarketing/30min" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">Book a 30-min call</a>.
                </p>
            </div>
        </div>
    );
}
