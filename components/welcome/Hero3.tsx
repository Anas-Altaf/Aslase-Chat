'use client';

import Link from 'next/link';

export default function Hero3() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-900 h-150 flex items-center justify-center relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-gray-400 rounded-full"></div>
        <div className="absolute top-32 right-20 w-12 h-12 border border-gray-400"></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 border border-gray-400 opacity-50"></div>
        <div className="absolute bottom-20 right-1/3 w-10 h-10 border border-gray-400 opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Green circle with dollar icon */}
        <div className="flex justify-center mb-12">
          <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-8">
          Turn Conversations into Potential Customers
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal mb-8">
          Your visitors deserve more than robotic replies. Create an AI chatbot that speaks your brand's language and delivers real value.
        </p>

        {/* CTA text */}
        <p className="text-base sm:text-lg text-gray-400 font-medium mb-12">
          Start Building Now • No Credit Card Required
        </p>

        {/* CTA Button */}
        <Link
          href="/sign-up"
          className="inline-block px-8 py-4 text-lg font-semibold text-white border-2 border-gray-400 rounded-lg hover:bg-gray-800 transition-colors duration-300"
        >
          Try AslasChat for Free
        </Link>
      </div>
    </section>
  );
}
