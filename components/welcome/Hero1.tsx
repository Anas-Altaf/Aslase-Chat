'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, ArrowRight, Bot, Zap } from 'lucide-react';

export default function Hero1() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/50"></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-300/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-teal-300/15 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '4s' }}></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pattern-dots opacity-30"></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br from-green-100 to-emerald-100 border border-green-200/50 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="text-sm font-semibold text-green-700">AI-Powered Chatbot Platform</span>
          </div>

          {/* Main headline */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Build Smart AI Chatbots
            <br />
            <span className="relative">
              <span className="gradient-text-animated">for</span>
              {' '}
              <span className="relative inline-block">
                <span className="gradient-text-animated">Communication</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4C50 0 100 8 150 4C175 2 190 4 200 4" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </span>
          </h1>

          {/* Animated keywords */}
          <div
            className={`mt-8 flex flex-wrap justify-center gap-3 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            {['Support', 'Conversion', 'Retention', 'Growth'].map((word, i) => (
              <span
                key={word}
                className="px-4 py-2 rounded-full bg-linear-to-br from-green-500 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-500/25 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Subtitle */}
          <p
            className={`mt-10 text-lg sm:text-xl text-white-600 max-w-3xl mx-auto font-medium leading-relaxed transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            Give your website, app, or business the power to{' '}
            <span className="text-green-600 font-semibold">chat</span>,{' '}
            <span className="text-emerald-600 font-semibold">guide</span>, and{' '}
            <span className="text-teal-600 font-semibold">convert</span> automatically.
          </p>

          {/* CTA Buttons */}
          <div
            className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            <Button asChild variant="gradient" size="xl" rounded="full" className="group min-w-[220px]">
              <Link href="/sign-up" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" rounded="full" className="min-w-[180px]">
              <Link href="#demo">
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div
            className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-white-600 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
          >
            {[
              { icon: Bot, text: 'Build your ChatBot' },
              { icon: Zap, text: 'No Credit card required' },
              { icon: Check, text: 'Cancel anytime' }
            ].map((item, i) => (
              <div
                key={item.text}
                className="flex items-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-3.5 h-3.5 text-green-600" />
                </div>
                <span className="font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -left-8 top-1/3 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl shadow-green-500/30 flex items-center justify-center rotate-12">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute -right-8 top-1/2 animate-float hidden lg:block" style={{ animationDelay: '3s' }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-xl shadow-emerald-500/30 flex items-center justify-center -rotate-12">
            <Zap className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-soft">
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-gradient-to-b from-green-500 to-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
