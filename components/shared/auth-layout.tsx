'use client';

import Link from 'next/link';
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 w-full">
            <div className="h-screen w-full flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Column - Form */}
                        <div className="flex-1 overflow-y-auto">
                            <div>
                                <div className="max-w-md mx-auto space-y-6">
                                    {/* Logo */}
                                    <div className="flex justify-center">
                                        <Link href="/">
                                            <img src="/AslasChat.jpg" alt="AslasChat" className="h-50 w-auto" />
                                        </Link>
                                    </div>

                                    {/* Header */}
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-900 text-center">
                                            {title}
                                        </h2>
                                        <p className="mt-2 text-base text-gray-500 text-center">
                                            {subtitle}
                                        </p>
                                    </div>

                                    {children}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 m-5 items-center justify-center">
                            <img src="/login-signup-img.png" alt="Illustration" className="max-w-full max-h-full object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
