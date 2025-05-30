'use client';

import React, { useState, useCallback } from 'react';
import Carousel from '@/components/Carousel';

// Sample data for carousel slides
const slides = [
  {
    id: 1,
    title: 'Dashboard Overview',
    description: 'Monitor your system performance at a glance',
    bgColor: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'User Management',
    description: 'Easily manage user roles and permissions',
    bgColor: 'bg-purple-500',
  },
  {
    id: 3,
    title: 'System Analytics',
    description: 'Track performance metrics and user activity',
    bgColor: 'bg-teal-500',
  },
  {
    id: 4,
    title: 'Security Settings',
    description: 'Configure your system security preferences',
    bgColor: 'bg-amber-500',
  },
];

// Image slides with remote images
const imageSlides = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    alt: 'Coding on laptop',
    caption: 'Modern development environment',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67',
    alt: 'Server racks',
    caption: 'Robust server infrastructure',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    alt: 'Data visualization',
    caption: 'Insightful analytics dashboard',
  },
];

export default function CarouselTestPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Memoize slide change handler to prevent unnecessary re-renders
  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  // Memoize slide renderers to prevent unnecessary re-renders
  const renderColorSlide = useCallback(
    (slide: (typeof slides)[0]) => (
      <div
        key={slide.id}
        className={`flex flex-col items-center justify-center w-full h-72 ${slide.bgColor} text-white p-6`}
      >
        <h2 className="text-2xl font-bold mb-3">{slide.title}</h2>
        <p className="text-center">{slide.description}</p>
      </div>
    ),
    []
  );

  const renderImageSlide = useCallback(
    (slide: (typeof imageSlides)[0]) => (
      <div key={slide.id} className="relative w-full h-72">
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>

        {/* Image */}
        <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
          <p className="font-medium text-lg">{slide.caption}</p>
        </div>
      </div>
    ),
    []
  );

  // Pre-render slides once instead of on each render
  const colorSlides = React.useMemo(() => slides.map(renderColorSlide), [renderColorSlide]);
  const imageCarouselSlides = React.useMemo(
    () => imageSlides.map(renderImageSlide),
    [renderImageSlide]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Carousel Component Test</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Basic Carousel</h2>
        <Carousel items={colorSlides} onSlideChange={handleSlideChange} />
        <p className="mt-3 text-sm text-gray-600">
          Current slide: {activeSlide + 1} of {slides.length}
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Image Carousel with Autoplay</h2>
        <Carousel items={imageCarouselSlides} autoPlayInterval={5000} className="shadow-lg" />
        <p className="mt-2 text-sm text-gray-600">
          This carousel will automatically transition every 5 seconds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Without Arrows</h2>
          <Carousel items={colorSlides} showArrows={false} />
          <p className="mt-2 text-sm text-gray-600">Navigation using only pagination dots</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Without Dots</h2>
          <Carousel items={colorSlides} showDots={false} />
          <p className="mt-2 text-sm text-gray-600">Navigation using only arrows</p>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Testing Instructions</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Try navigating using the arrow buttons</li>
          <li>Click on the pagination dots to jump to a specific slide</li>
          <li>Use keyboard arrow keys (left/right) to navigate</li>
          <li>Test responsiveness by resizing your browser window</li>
          <li>Verify autoplay functionality on the image carousel</li>
          <li>Check that the carousel works in both light and dark mode</li>
          <li>Use a screen reader to test accessibility features</li>
        </ul>
      </div>
    </div>
  );
}
