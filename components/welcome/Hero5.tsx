'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Mail, Bot } from 'lucide-react';

export default function Hero5() {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-900/10 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/20 flex items-center justify-center rotate-12">
          <Bot className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-20 left-20 animate-float hidden lg:block" style={{ animationDelay: '3s' }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center -rotate-12">
          <Mail className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br from-green-100 to-emerald-100 border border-green-200/50 mb-8">
            <Sparkles className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="text-sm font-semibold text-green-700">Limited Time Offer</span>
          </div>

          {/* Main heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            Get a <span className="gradient-text">Free Chatbot</span>
            <br />
            for Your Business
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white font-medium mb-10 max-w-2xl mx-auto">
            Start for free today – <span className="text-green-600 font-semibold">no credit card required</span>.
            Transform your customer experience in minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="gradient" size="xl" rounded="full" className="group min-w-[200px]">
              <Link href="/sign-up" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="xl" rounded="full" className="min-w-[180px]">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10K+', label: 'Chatbots Created' },
              { value: '50M+', label: 'Conversations' },
              { value: '99.9%', label: 'Uptime' }
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="text-3xl sm:text-4xl font-black gradient-text group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
