'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Hero2() {
  const images = [
    '/hero2-img1.png',
    '/hero2-img2.png',
    '/hero2-img3.png',
  ];

  const [showImage, setShowImage] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload images
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  // Initial delay
  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto slide
  useEffect(() => {
    if (!showImage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [showImage]);

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-gray-50 to-white py-24 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-green-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-linear-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-semibold">
            See It In Action
          </span>
        </div>

        {/* Image Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-4xl bg-linear-to-r from-green-400 via-emerald-500 to-teal-400 opacity-20 blur-sm transition-opacity duration-500 group-hover:opacity-40" />

            <div className="relative min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden bg-linear-to-br from-green-50 to-emerald-50 shadow-2xl border border-green-100/50 flex items-center justify-center">
              {showImage ? (
                <>
                  {images.map((src, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ${index === currentIndex
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-105'
                        }`}
                    >
                      <Image
                        src={src}
                        alt={`Hero preview ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  ))}

                  {/* Dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'w-8 bg-white shadow-lg'
                            : 'w-2.5 bg-white/50 hover:bg-white/80'
                          }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                /* Loader */
                <div className="text-center animate-pulse">
                  <div className="mx-auto w-20 h-20 rounded-2xl bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="mt-4 text-gray-500 font-medium">
                    Loading preview...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
