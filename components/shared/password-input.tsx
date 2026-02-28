'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PasswordInputProps {
    id: string;
    name: string;
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    className?: string;
}

export function PasswordInput({
    id,
    name,
    label,
    value,
    onChange,
    onBlur,
    placeholder = 'Your Password',
    autoComplete = 'current-password',
    required = true,
    className = '',
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div>
            {label && <Label htmlFor={id}>{label}</Label>}
            <div className={label ? "mt-2 relative" : "relative"}>
                <Input
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    required={required}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className={`pr-10 ${className}`}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 hover:bg-transparent"
                >
                    {showPassword ? (
                        <Eye className="h-5 w-5" />
                    ) : (
                        <EyeOff className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
    );
}
