'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Carousel from '@/components/Carousel';
import Slider from '@/components/Slider';

export default function ComponentsTestPage() {
  // State for the carousel
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000);
  const [showArrows, setShowArrows] = useState(true);
  const [showDots, setShowDots] = useState(true);

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

  // Render a basic text/color slide
  const renderSlide = useCallback(
    (slide: (typeof slides)[0]) => (
      <div
        key={slide.id}
        className={`flex flex-col items-center justify-center w-full h-64 ${slide.bgColor} text-white p-6`}
      >
        <h2 className="text-2xl font-bold mb-3">{slide.title}</h2>
        <p className="text-center">{slide.description}</p>
      </div>
    ),
    []
  );

  // Pre-render slides once
  const carouselSlides = useMemo(() => slides.map(renderSlide), [renderSlide]);

  // Toggle handlers
  const toggleArrows = useCallback(() => setShowArrows(prev => !prev), []);
  const toggleDots = useCallback(() => setShowDots(prev => !prev), []);

  // Format functions for sliders
  const formatTime = useCallback((value: number) => `${value / 1000}s`, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">UI Components Test</h1>

      <div className="max-w-3xl mx-auto">
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Interactive Carousel</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Carousel
              items={carouselSlides}
              onSlideChange={setActiveSlide}
              autoPlayInterval={autoPlaySpeed}
              showArrows={showArrows}
              showDots={showDots}
            />

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Carousel Controls</h3>

              <div className="space-y-4">
                <div>
                  <Slider
                    label="Autoplay Speed"
                    min={0}
                    max={10000}
                    step={500}
                    value={autoPlaySpeed}
                    onChange={setAutoPlaySpeed}
                    formatValue={formatTime}
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {autoPlaySpeed === 0
                      ? 'Autoplay disabled'
                      : `Slides will automatically change every ${autoPlaySpeed / 1000} seconds`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={toggleArrows}
                    className={`px-4 py-2 rounded-lg ${
                      showArrows
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {showArrows ? 'Hide Arrows' : 'Show Arrows'}
                  </button>

                  <button
                    onClick={toggleDots}
                    className={`px-4 py-2 rounded-lg ${
                      showDots
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {showDots ? 'Hide Dots' : 'Show Dots'}
                  </button>
                </div>

                <div className="text-sm">
                  <p>
                    Current slide: {activeSlide + 1} of {slides.length}
                  </p>
                  <p>Content: {slides[activeSlide].title}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Slider Component Examples</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Slider label="Basic Slider" min={0} max={100} value={50} />
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Slider
                label="Volume Control"
                trackColor="bg-green-500"
                formatValue={value => `${value}%`}
                value={75}
              />
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Slider
                label="Price Range"
                min={10}
                max={200}
                step={10}
                trackColor="bg-purple-500"
                formatValue={value => `$${value}`}
                value={60}
              />
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <Slider label="Disabled Slider" value={30} disabled />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Component Integration</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              This demo shows how the Slider and Carousel components can work together, with the
              sliders controlling the behavior of the carousel.
            </p>

            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Try adjusting the autoplay speed</li>
              <li>Toggle the visibility of navigation arrows and dots</li>
              <li>Observe how the carousel responds to your settings</li>
              <li>Test keyboard navigation on both components</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
