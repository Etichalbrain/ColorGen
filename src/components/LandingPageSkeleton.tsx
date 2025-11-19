import React from 'react';

export function LandingPageSkeleton() {
  return (
    <div className="h-full overflow-y-auto bg-[#1a1a1a]">
      {/* Navbar Skeleton */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#242424]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section Skeleton */}
      <section className="bg-[#242424]">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Product name */}
            <div className="h-12 w-3/4 bg-gray-700 rounded-lg mb-6 animate-pulse" />
            {/* Hero description */}
            <div className="space-y-3 mb-8">
              <div className="h-6 w-full bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-5/6 bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-4/6 bg-gray-700 rounded animate-pulse" />
            </div>
            {/* CTA Button */}
            <div className="h-12 w-40 bg-gray-700 rounded-lg animate-pulse" />
          </div>
          
          {/* Hero Image Placeholder */}
          <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <div className="text-6xl mb-3">📸</div>
              <p className="text-sm">Hero Image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section title */}
          <div className="h-10 w-64 bg-gray-700 rounded-lg mb-12 mx-auto animate-pulse" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div 
                key={index}
                className="bg-[#242424] p-8 rounded-xl shadow-md border border-gray-800"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-gray-700 rounded-lg mb-4 animate-pulse" />
                {/* Feature title */}
                <div className="h-6 w-3/4 bg-gray-700 rounded mb-3 animate-pulse" />
                {/* Feature description */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section Skeleton */}
      <section className="py-20 bg-[#242424]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section title */}
          <div className="h-10 w-48 bg-gray-700 rounded-lg mb-12 mx-auto animate-pulse" />
          
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700"
              >
                {/* Quote */}
                <div className="space-y-3 mb-4">
                  <div className="h-5 w-full bg-gray-700 rounded animate-pulse" />
                  <div className="h-5 w-4/5 bg-gray-700 rounded animate-pulse" />
                  <div className="h-5 w-3/5 bg-gray-700 rounded animate-pulse" />
                </div>
                {/* Author */}
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section Skeleton */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* CTA title */}
          <div className="h-10 w-96 bg-gray-700 rounded-lg mb-6 mx-auto animate-pulse" />
          {/* CTA button */}
          <div className="h-14 w-48 bg-gray-700 rounded-lg mx-auto animate-pulse" />
        </div>
      </section>

      {/* Footer Skeleton */}
      <footer className="py-12 bg-[#242424] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
            <div className="flex gap-6">
              {[1, 2, 3].map((social) => (
                <div key={social} className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
          <div className="h-4 w-64 bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
      </footer>
    </div>
  );
}