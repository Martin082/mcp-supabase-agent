"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatResetContextType {
    resetKey: number;
    triggerReset: () => void;
}

const ChatResetContext = createContext<ChatResetContextType | undefined>(undefined);

export function ChatResetProvider({ children }: { children: ReactNode }) {
    const [resetKey, setResetKey] = useState(0);

    const triggerReset = () => {
        setResetKey((prev) => prev + 1);
    };

    return (
        <ChatResetContext.Provider value={{ resetKey, triggerReset }}>
            {children}
        </ChatResetContext.Provider>
    );
}

export function useChatReset() {
    const context = useContext(ChatResetContext);
    if (context === undefined) {
        throw new Error("useChatReset must be used within a ChatResetProvider");
    }
    return context;
}
