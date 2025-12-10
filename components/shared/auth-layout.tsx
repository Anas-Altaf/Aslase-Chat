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
        <div className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 w-full animate-gradient">
            <div className="h-screen w-full flex items-center justify-center p-4">
                <div className="w-full max-w-7xl h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left Column - Form */}
                        <div className="flex-1 overflow-y-auto flex items-center justify-center p-8">
                            <div className="w-full">
                                <div className="max-w-md mx-auto space-y-6 animate-slideUp">
                                    {/* Logo */}
                                    <div className="flex justify-center mt-10">
                                        <Link href="/">
                                            <img src="/AslasChat.jpg" alt="AslasChat" className="h-24 w-auto" />
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
                        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 m-6 rounded-2xl items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-teal-400/10 animate-pulse"></div>
                            <img src="/login-signup-img.png" alt="Illustration" className="max-w-full max-h-full object-contain relative z-10 animate-float" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
