import React from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileItemProps {
    name: string;
    description?: string;
    onDelete?: () => void;
}

export function FileItem({ name, description, onDelete }: FileItemProps) {
    return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-xs font-medium truncate">{name}</p>
                {description && (
                    <p className="text-gray-500 text-xs">{description}</p>
                )}
            </div>
            {onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            )}
        </div>
    );
}
