import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
    content: string;
    isUser?: boolean;
    className?: string;
}

export function ChatBubble({ content, isUser = false, className }: ChatBubbleProps) {
    return (
        <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
            <div
                className={cn(
                    'px-3 py-2 rounded-lg max-w-xs text-sm',
                    isUser ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-900',
                    className
                )}
            >
                {content}
            </div>
        </div>
    );
}

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    placeholder?: string;
}

export function ChatInput({ value, onChange, onSend, placeholder = 'Type your message...' }: ChatInputProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="flex gap-2 p-3 flex-shrink-0">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
                onClick={onSend}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors flex-shrink-0"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </button>
        </div>
    );
}
