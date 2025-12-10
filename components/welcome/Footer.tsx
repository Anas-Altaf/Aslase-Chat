'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Github, Linkedin, Twitter, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const pageLinks = [
    { href: '/', label: 'Home' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ];

  const quickLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/support', label: 'Contact Support' },
  ];

  const socialLinks = [
    { href: '#', icon: Github, label: 'GitHub' },
    { href: '#', icon: Linkedin, label: 'LinkedIn' },
    { href: '#', icon: Twitter, label: 'Twitter' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Wave divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none">
        <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="text-gray-50"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 relative z-10">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <img
                src="/footer-aslasChat-logo.png"
                alt="AslasChat"
                className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Aslaschat is an AI-Powered Chatbot app that allows users to have intelligent conversations with a virtual assistant that truly understands.
            </p>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/20 focus:border-green-500 transition-all duration-300"
                />
                <Button
                  type="submit"
                  variant="gradient"
                  size="default"
                  className="shrink-0"
                >
                  {subscribed ? '✓' : <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
              {subscribed && (
                <p className="absolute -bottom-6 left-0 text-green-400 text-sm font-medium animate-fadeIn">
                  Thanks for subscribing!
                </p>
              )}
            </form>
          </div>

          {/* Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-linear-to-br from-green-500 to-emerald-500 rounded-full"></div>
              Pages
            </h4>
            <ul className="space-y-4">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-linear-to-br from-green-500 to-emerald-500 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-500 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <div className="w-8 h-0.5 bg-linear-to-br from-green-500 to-emerald-500 rounded-full"></div>
              Contact
            </h4>
            <div className="space-y-4">
              <a href="tel:+14086413010" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">+1 408 641 3010</span>
              </a>
              <a href="mailto:sales@aslaschat.ai" className="flex items-center gap-4 text-gray-400 hover:text-white transition-colors duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">sales@aslaschat.ai</span>
              </a>
              <div className="flex items-start gap-4 text-gray-400">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">DDP, Dubai Silicon Oasis, Dubai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-br from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> by AslasChat Team
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-500 hover:border-transparent transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AslasChat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
