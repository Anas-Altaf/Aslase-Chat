'use client';

import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterBarProps {
    showDateRange?: boolean;
    showFilterButton?: boolean;
    children?: React.ReactNode;
    onFilter?: () => void;
}

export function FilterBar({
    showDateRange = true,
    showFilterButton = true,
    children,
    onFilter
}: FilterBarProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-shrink-0">
            <h3 className="text-gray-900 font-semibold mb-3 text-sm">Filters</h3>
            <div className="flex gap-3 items-end mb-3">
                {showDateRange && (
                    <div className="flex-1">
                        <div className="flex gap-2 items-center">
                            <Input
                                type="text"
                                placeholder="Select a Date Range"
                                className="flex-1"
                            />
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                )}
                {showFilterButton && (
                    <Button onClick={onFilter} size="sm">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                )}
            </div>
            {children}
        </div>
    );
}

interface FilterSelectProps {
    options: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
}

export function FilterSelect({ options, placeholder, className }: FilterSelectProps) {
    return (
        <select className={`px-3 py-2 border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-150 ${className}`}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
