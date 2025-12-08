'use client';

import { useState, useEffect } from 'react';

const images = ['/hero2-img1.png', '/hero2-img2.png', '/hero2-img3.png'];

export default function Hero2() {
  const [showImage, setShowImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Initial 3-second delay before showing images
    const initialTimer = setTimeout(() => {
      setShowImage(true);
    }, 1000);

    return () => clearTimeout(initialTimer);
  }, []);

  // Change image every 3 seconds after showing
  useEffect(() => {
    if (!showImage) return;

    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(imageTimer);
  }, [showImage]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Image Container with Border Radius */}
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-linear-to-br from-green-100 to-green-50 min-h-96 flex items-center justify-center">
            {/* Placeholder or Image Container */}
            {showImage ? (
              <div className="w-full h-full relative flex items-center justify-center">
                <img
                  src={images[currentImageIndex]}
                  alt={`Hero image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-block">
                  <svg className="w-16 h-16 text-green-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
