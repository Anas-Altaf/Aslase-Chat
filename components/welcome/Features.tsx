'use client';

import { Bot, Shield, Smartphone, Sparkles, Users, FileText, Zap, Globe } from 'lucide-react';

interface Feature {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
}

const features: Feature[] = [
    {
        title: 'Real-time Messaging',
        description: 'Experience instant communication with low-latency message delivery.',
        icon: Zap,
        color: 'from-yellow-400 to-orange-500',
    },
    {
        title: 'Secure & Private',
        description: 'End-to-end encryption ensures your conversations stay private.',
        icon: Shield,
        color: 'from-green-400 to-emerald-500',
    },
    {
        title: 'Cross-Platform',
        description: 'Access your chats seamlessly across all your devices.',
        icon: Smartphone,
        color: 'from-blue-400 to-cyan-500',
    },
    {
        title: 'AI-Powered',
        description: 'Smart AI that learns and adapts to your business needs.',
        icon: Bot,
        color: 'from-purple-400 to-pink-500',
    },
    {
        title: 'Team Collaboration',
        description: 'Work together with multiple team members efficiently.',
        icon: Users,
        color: 'from-rose-400 to-red-500',
    },
    {
        title: 'Rich Analytics',
        description: 'Get detailed insights into your chatbot performance.',
        icon: FileText,
        color: 'from-teal-400 to-emerald-500',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br from-green-100 to-emerald-100 border border-green-200/50 mb-6">
                        <Sparkles className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-700">Why Choose Us</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6">
                        Powerful <span className="gradient-text">Features</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Everything you need for seamless AI-powered communication, all in one place.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-50/0 to-emerald-50/0 group-hover:from-green-50/50 group-hover:to-emerald-50/50 transition-all duration-500"></div>

                                {/* Gradient border on hover */}
                                <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-green-400/0 to-emerald-400/0 group-hover:from-green-400/20 group-hover:to-emerald-400/20 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Arrow indicator */}
                                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                    <Globe className="w-5 h-5 text-green-500" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
