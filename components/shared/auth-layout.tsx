'use client';

import Link from 'next/link';
import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/50 relative overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>

            {/* Pattern overlay */}
            <div className="absolute inset-0 pattern-dots opacity-30"></div>

            <div className="min-h-screen w-full flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-6xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 overflow-hidden flex flex-col border border-white/50">
                    <div className="flex-1 flex overflow-hidden min-h-[600px]">
                        {/* Left Column - Form */}
                        <div className="flex-1 overflow-y-auto flex items-center justify-center p-8 lg:p-12">
                            <div className="w-full">
                                <div className="max-w-md mx-auto space-y-8 animate-slideUp">
                                    {/* Logo */}
                                    <div className="flex justify-center">
                                        <Link href="/" className="group">
                                            <div className="relative">
                                                <img
                                                    src="/AslasChat.jpg"
                                                    alt="AslasChat"
                                                    className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute -inset-4 bg-linear-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Header */}
                                    <div className="text-center">
                                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                                            {title}
                                        </h2>
                                        <p className="text-gray-500 font-medium">
                                            {subtitle}
                                        </p>
                                    </div>

                                    {children}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Decorative */}
                        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 m-4 rounded-2xl items-center justify-center relative overflow-hidden">
                            {/* Animated background elements */}
                            <div className="absolute inset-0">
                                <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-2xl rotate-12 animate-float"></div>
                                <div className="absolute top-40 right-10 w-16 h-16 border border-white/20 rounded-xl -rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
                                <div className="absolute bottom-20 left-20 w-24 h-24 border border-white/10 rounded-3xl rotate-45 animate-float" style={{ animationDelay: '4s' }}></div>
                            </div>

                            {/* Gradient orbs */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

                            {/* Main illustration */}
                            <div className="relative z-10 text-center p-8">
                                <div className="w-32 h-32 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center animate-float">
                                    <Bot className="w-16 h-16 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    AI-Powered Chatbots
                                </h3>
                                <p className="text-white/80 max-w-xs mx-auto">
                                    Build intelligent chatbots that understand your customers and deliver real value.
                                </p>

                                {/* Feature badges */}
                                <div className="flex flex-wrap justify-center gap-2 mt-8">
                                    {['Smart AI', '24/7 Support', 'Easy Setup'].map((feature) => (
                                        <span
                                            key={feature}
                                            className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium flex items-center gap-1.5"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
