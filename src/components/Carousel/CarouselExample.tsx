'use client';

import React from 'react';
import Carousel from './Carousel';

const images = [
  {
    src: '/images/slide1.jpg',
    alt: 'Slide 1 description',
    title: 'Welcome to Our Platform',
    description: 'Discover powerful tools for system administration',
  },
  {
    src: '/images/slide2.jpg',
    alt: 'Slide 2 description',
    title: 'Manage User Permissions',
    description: 'Control access with our intuitive role management',
  },
  {
    src: '/images/slide3.jpg',
    alt: 'Slide 3 description',
    title: 'Monitor System Health',
    description: 'Real-time dashboards to keep your system running smoothly',
  },
];

export default function CarouselExample() {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    // You can add additional logic here like analytics tracking
  };

  // Simple slide component
  const renderSlide = (item: (typeof images)[0]) => (
    <div className="relative h-[300px] w-full">
      {/* Image with overlay */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.src})` }}
        aria-hidden="true"
      ></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-20 text-white">
        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
        <p className="text-sm opacity-90">{item.description}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Featured Content</h2>

      {/* Basic usage */}
      <Carousel
        items={images.map(renderSlide)}
        autoPlayInterval={5000}
        onSlideChange={handleSlideChange}
      />

      <div className="mt-4 text-sm text-gray-500">
        Showing slide {currentSlide + 1} of {images.length}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Other Carousel Examples:</h3>

        <h4 className="font-medium mt-4 mb-2">Without navigation arrows</h4>
        <Carousel items={images.map(renderSlide)} showArrows={false} />

        <h4 className="font-medium mt-4 mb-2">Without pagination dots</h4>
        <Carousel items={images.map(renderSlide)} showDots={false} />

        <h4 className="font-medium mt-4 mb-2">Custom styling</h4>
        <Carousel
          items={images.map(renderSlide)}
          className="rounded-none border border-gray-200 dark:border-gray-700 shadow-lg"
        />
      </div>
    </div>
  );
}
