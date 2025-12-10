'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero3() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>

        {/* Decorative shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 border border-white/10 rounded-2xl rotate-12 animate-float hidden lg:block"></div>
        <div className="absolute top-40 right-32 w-12 h-12 border border-white/10 rounded-xl -rotate-12 animate-float hidden lg:block" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20 border border-white/5 rounded-3xl rotate-45 animate-float hidden lg:block" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Floating icon */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500 animate-pulse-glow"></div>
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-8">
          Turn Conversations into
          <br />
          <span className="relative inline-block mt-2">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Potential Customers
            </span>
            <Sparkles className="absolute -top-2 -right-8 w-6 h-6 text-yellow-400 animate-pulse" />
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal mb-8 leading-relaxed">
          Your visitors deserve more than robotic replies. Create an AI chatbot that
          <span className="text-green-400 font-medium"> speaks your brand's language</span> and
          <span className="text-emerald-400 font-medium"> delivers real value</span>.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 font-medium mb-12">
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            Start Building Now
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            No Credit Card Required
          </span>
        </div>

        {/* CTA Button */}
        <Button asChild variant="gradient" size="xl" rounded="full" className="group">
          <Link href="/sign-up" className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Try AslasChat for Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
