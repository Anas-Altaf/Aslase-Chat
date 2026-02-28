import React from 'react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && (
                    <p className="text-gray-600 text-sm mt-1">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}

interface ExportButtonProps {
    onClick?: () => void;
}

export function ExportButton({ onClick }: ExportButtonProps) {
    return (
        <Button variant="secondary" size="sm" onClick={onClick}>
            Export
        </Button>
    );
}
