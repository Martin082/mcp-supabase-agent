import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoadingSpinnerProps {
    className?: string;
    size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
    return (
        <Loader2
            className={cn("animate-spin text-primary", className)}
            width={size}
            height={size}
        />
    );
}

export function LoadingScreen({ className, text = "Loading..." }: { className?: string, text?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-8 space-y-4 h-full", className)}>
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <LoadingSpinner size={48} />
            </div>
            <p className="text-muted-foreground animate-pulse font-medium tracking-wide">
                {text}
            </p>
        </div>
    );
}
