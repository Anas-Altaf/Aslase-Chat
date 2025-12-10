'use client';

import { useState, useEffect } from 'react';

const images = ['/hero2-img1.png', '/hero2-img2.png', '/hero2-img3.png'];

export default function Hero2() {
  const [showImage, setShowImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowImage(true);
    }, 800);
    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (!showImage) return;
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(imageTimer);
  }, [showImage]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-green-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section label */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1.5 rounded-full bg-linear-to-br from-green-100 to-emerald-100 text-green-700 text-sm font-semibold">
            See It In Action
          </span>
        </div>

        {/* Image Showcase */}
        <div className="max,max-w-5xl mx-auto">
          <div className="relative group">
            {/* Gradient border effect */}
            <div className="absolute -inset-1 bg-linear-to-br from-green-400 via-emerald-500 to-teal-400 rounded-[2rem] opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-500"></div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 min-h-[400px] lg:min-h-[500px] flex items-center justify-center border border-green-100/50">
              {showImage ? (
                <div className="w-full h-full relative">
                  {images.map((img, index) => (
                    <img
                      key={img}
                      src={img}
                      alt={`Product showcase ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${index === currentImageIndex
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 scale-105'
                        }`}
                    />
                  ))}

                  {/* Image indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentImageIndex
                            ? 'bg-white w-8 shadow-lg'
                            : 'bg-white/50 hover:bg-white/80'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center animate-pulse">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="mt-4 text-gray-500 font-medium">Loading preview...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
