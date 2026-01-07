'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Runtime Error:', error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-background">
            <Card className="max-w-md w-full p-8 shadow-2xl border-destructive/20 bg-card">
                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-2">
                        <AlertCircle className="w-12 h-12" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                        <p className="text-muted-foreground">
                            An unexpected error occurred. The support team has been notified.
                        </p>
                    </div>

                    {error.message && (
                        <div className="w-full p-4 bg-secondary/50 rounded-lg border border-border text-left overflow-auto max-h-32">
                            <code className="text-xs font-mono text-destructive">{error.message}</code>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="flex-1"
                        >
                            Go Home
                        </Button>
                        <Button
                            onClick={reset}
                            className="flex-1 gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
