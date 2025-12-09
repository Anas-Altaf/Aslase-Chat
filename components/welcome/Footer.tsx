import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Left - Logo and About Section (3 columns) */}
          <div className="md:col-span-3">
            <img src="/footer-aslasChat-logo.png" alt="AslasChat" className="h-16 w-auto mb-6" />
            <div>
              <h3 className="text-lg font-bold mb-3">About AslasChat</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Aslaschat is an A.I Powered Chatbot app that allows users to have conversation with virtual assistant.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-white text-gray-900 rounded text-sm placeholder-gray-500 flex-1"
                />
                <button className="px-5 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition-colors text-sm">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Center-Left - Pages (2.5 columns) */}
          <div className="md:col-span-2 md:col-start-5">
            <h4 className="text-lg font-bold mb-6">Pages</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <span>›</span> <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <span>›</span> <span>Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <span>›</span> <span>Blog</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Center-Right - Quick Links (2.5 columns) */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <span>›</span> <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <span>›</span> <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 text-sm">
                  <span>›</span> <span>Contact Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Right - Icon Space (2 columns) */}
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
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.894.894c.159.635.738 1.58 2.232 3.074 1.494 1.494 2.44 2.073 3.075 2.232l.894-1.894a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2.694a1 1 0 01-.995-.91A24.02 24.02 0 015.91 4.994A1 1 0 015 4V2z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">+14086413010</span>
            </div>
          </div>

          {/* Email Us */}
          <div>
            <h4 className="text-lg font-bold mb-4">Email Us</h4>
            <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">sales@aslaschat.ai</span>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-5 h-5 text-gray-300 hover:text-white transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.834 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.559 8.179-6.086 8.179-11.384 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="w-5 h-5 text-gray-300 hover:text-white transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.436-.103.25-.129.599-.129.948v5.421h-3.554s.05-8.736 0-9.643h3.554v1.366c.43-.664 1.199-1.608 2.928-1.608 2.136 0 3.745 1.393 3.745 4.385v5.5zM5.337 9.433c-1.144 0-1.915-.758-1.915-1.707 0-.955.77-1.708 1.958-1.708 1.187 0 1.914.753 1.939 1.708 0 .949-.752 1.707-1.982 1.707zm1.582 11.019H3.771V9.809h3.148v10.643zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="w-5 h-5 text-gray-300 hover:text-white transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm3.5-10c.828 0 1.5-.672 1.5-1.5S16.328 9 15.5 9 14 9.672 14 10.5s.672 1.5 1.5 1.5zm-7 0c.828 0 1.5-.672 1.5-1.5S9.328 9 8.5 9 7 9.672 7 10.5 7.672 12 8.5 12zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
              </a>
              <a href="#" className="w-5 h-5 text-gray-300 hover:text-white transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              </a>
              <a href="#" className="w-5 h-5 text-gray-300 hover:text-white transition-colors">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
              </a>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-lg font-bold mb-4">Address</h4>
            <div className="flex items-start gap-3 text-gray-300">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-medium">DDP, Dubai Silicon Oasis, Dubai</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
