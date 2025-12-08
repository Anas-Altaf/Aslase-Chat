'use client';

import Link from 'next/link';

export default function Hero5() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-100 w-full">
      <div className="w-full text-center">
        {/* Main heading - exactly one line */}
        <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-6">
          Get a Free Chatbot for Your Business
        </h2>

        {/* Subheading */}
        <p className="text-lg text-gray-600 font-medium mb-12">
          Start for free today – no credit card required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="px-8 py-3 text-base font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Start for Free
          </Link>

          <button
            className="px-8 py-3 text-base font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors duration-300"
          >
            Contact Us Now
          </button>
        </div>
      </div>
    </section>
  );
}
