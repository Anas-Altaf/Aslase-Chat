import Link from 'next/link';
import { Phone, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
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
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Left - Logo and About Section */}
          <div className="md:col-span-3">
            <img src="/footer-aslasChat-logo.png" alt="AslasChat" className="h-16 w-auto mb-6" />
            <div>
              <h3 className="text-lg font-bold mb-3">About AslasChat</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Aslaschat is an A.I Powered Chatbot app that allows users to have conversation with virtual assistant.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-gray-900 border-0 h-10"
                />
                <Button size="sm" className="h-10">
                  Send
                </Button>
              </div>
            </div>
          </div>

          {/* Center-Left - Pages */}
          <div className="md:col-span-2 md:col-start-5">
            <h4 className="text-lg font-bold mb-6">Pages</h4>
            <ul className="space-y-3">
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                    <span>›</span> <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Center-Right - Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                    <span>›</span> <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Icon Space */}
          <div className="md:col-span-2"></div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-12"></div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">+14086413010</span>
            </div>
          </div>

          {/* Email Us */}
          <div>
            <h4 className="text-lg font-bold mb-4">Email Us</h4>
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">sales@aslaschat.ai</span>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 text-gray-300 hover:text-white transition-colors flex items-center justify-center"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-lg font-bold mb-4">Address</h4>
            <div className="flex items-start gap-3 text-gray-300">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium">DDP, Dubai Silicon Oasis, Dubai</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
