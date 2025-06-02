"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Carousel from "@/components/Carousel";
import ImageWithLoader from "@/components/Carousel/ImageWithLoader";

// Dynamically import with loading fallback
const ResponsiveCarouselExample = dynamic(
  () => import("./responsive-carousel"),
  {
    loading: () => (
      <div className="h-72 bg-gray-100 animate-pulse rounded-lg"></div>
    ),
    ssr: false,
  }
);

// Dynamically import MultiItemCarouselExample with loading fallback
const MultiItemCarouselExample = dynamic(() => import("./multi-item-view"), {
  loading: () => (
    <div className="h-64 bg-gray-100 animate-pulse rounded-lg"></div>
  ),
  ssr: false,
});

// Optimized SVG components
const ChatSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-white/80"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
);

const VideoSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const AudioSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    />
  </svg>
);

const GallerySvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// Video component with lazy loading
interface LazyVideoProps {
  poster: string;
  src: string;
  type: string;
}

const LazyVideo = ({ poster, src, type }: LazyVideoProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load video when component mounts
    setShouldLoad(true);
  }, []);

  return (
    <div className="bg-black h-full flex items-center justify-center">
      <video
        controls
        className="max-h-full max-w-full"
        poster={poster}
        preload="none"
      >
        {shouldLoad && <source src={src} type={type} />}
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// Audio component with lazy loading
interface LazyAudioProps {
  src: string;
  type: string;
}

const LazyAudio = ({ src, type }: LazyAudioProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load audio when component mounts
    setShouldLoad(true);
  }, []);

  return (
    <audio controls className="w-full" preload="none">
      {shouldLoad && <source src={src} type={type} />}
      Your browser does not support the audio element.
    </audio>
  );
};

export default function MultiComponentCarouselExample() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showMultiItem, setShowMultiItem] = useState(false);
  const [showResponsive, setShowResponsive] = useState(false);

  // Add intersection observer to load content only when visible
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;

    const mainObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          mainObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const responsiveObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowResponsive(true);
          responsiveObserver.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const multiItemObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowMultiItem(true);
          multiItemObserver.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const carousel = document.getElementById("main-carousel");
    const responsiveSection = document.getElementById("responsive-section");
    const multiSection = document.getElementById("multi-item-section");

    if (carousel) mainObserver.observe(carousel);
    if (responsiveSection) responsiveObserver.observe(responsiveSection);
    if (multiSection) multiItemObserver.observe(multiSection);

    return () => {
      mainObserver.disconnect();
      responsiveObserver.disconnect();
      multiItemObserver.disconnect();
    };
  }, []);

  // Memoized slide change handler
  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  // Create slides with multiple components in each slide - memoized
  const multiComponentSlides = useMemo(
    () => [
      // Slide 1: Image + Text layout
      <div
        key="slide1"
        className="grid grid-cols-1 md:grid-cols-2 h-[500px] w-full"
      >
        <div className="h-full">
          <ImageWithLoader
            src="https://placehold.co/600x800/3949ab/ffffff?text=Featured+Image"
            alt="Featured content"
            className="w-full h-full object-cover"
            width={600}
            height={800}
          />
        </div>
        <div className="bg-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Feature Highlights</h2>
          <p className="text-gray-600 mb-6">
            This slide combines an image with descriptive text content in a
            responsive layout. On smaller screens, the elements stack
            vertically.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>High-quality imagery with automatic loading states</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Responsive design that works on all devices</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-green-500">✓</span>
              <span>Rich text formatting with custom styling</span>
            </li>
          </ul>
        </div>
      </div>,

      // Slide 2: Video + Testimonial layout (only loads video when visible and active)
      <div
        key="slide2"
        className="grid grid-cols-1 md:grid-cols-2 h-[500px] w-full"
      >
        {isVisible && activeSlide === 1 ? (
          <LazyVideo
            poster="https://placehold.co/600x400/111827/ffffff?text=Product+Demo"
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
        ) : (
          <div className="bg-black h-full flex items-center justify-center">
            <img
              src="https://placehold.co/600x400/111827/ffffff?text=Product+Demo"
              alt="Video placeholder"
              className="max-h-full max-w-full"
              loading="lazy"
              width={600}
              height={400}
            />
          </div>
        )}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-8 flex flex-col justify-center">
          <div className="mb-6">
            <ChatSvg />
          </div>
          <blockquote className="text-xl italic mb-6">
            "This carousel solution has transformed how we present content to
            our users. The ability to combine different elements in a single
            slide is incredibly powerful."
          </blockquote>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 mr-4"></div>
            <div>
              <div className="font-bold">Jane Smith</div>
              <div className="text-sm text-white/80">
                Product Manager, Acme Inc.
              </div>
            </div>
          </div>
        </div>
      </div>,

      // Slide 3: Audio + Article preview layout (only loads audio when visible and active)
      <div
        key="slide3"
        className="grid grid-cols-1 md:grid-cols-3 h-[500px] w-full"
      >
        <div className="bg-gray-900 text-white p-8 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4">Featured Podcast</h3>
          <p className="mb-6">
            Listen to our latest episode while browsing the article preview.
          </p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-medium">Episode #42</div>
              <div className="text-sm text-gray-400">24:15</div>
            </div>
            {isVisible && activeSlide === 2 ? (
              <LazyAudio
                src="https://www.w3schools.com/html/horse.ogg"
                type="audio/ogg"
              />
            ) : (
              <div className="w-full h-10 bg-gray-700 rounded"></div>
            )}
          </div>
        </div>
        <div className="col-span-2 bg-white p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-4">Latest Article</h2>
          <div className="prose max-w-none">
            <p className="lead text-gray-700 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Sed euismod, nisl vel ultricies lacinia.
            </p>
            <p className="mb-4">
              Curabitur at libero ut mauris iaculis commodo. Phasellus nec
              commodo velit. Nulla facilisi. Nam auctor, nisl eget ultricies
              lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
            </p>
            <p className="mb-4">
              Vivamus vestibulum quam id semper ultricies. Aenean eget lectus id
              sem vehicula ultricies eget ut massa.
            </p>
            <a
              href="#"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
            >
              Read Full Article
            </a>
          </div>
        </div>
      </div>,

      // Slide 4: Card-based layout with multiple components
      <div
        key="slide4"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px] w-full p-4 bg-gray-100"
      >
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="h-40 bg-red-500 flex items-center justify-center text-white">
            <VideoSvg />
          </div>
          <div className="p-4 flex-1">
            <h3 className="font-bold text-lg mb-2">Video Content</h3>
            <p className="text-gray-600">
              Professional video hosting with advanced analytics and engagement
              metrics.
            </p>
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <a href="#" className="text-red-600 font-medium">
              Learn more →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="h-40 bg-blue-500 flex items-center justify-center text-white">
            <AudioSvg />
          </div>
          <div className="p-4 flex-1">
            <h3 className="font-bold text-lg mb-2">Audio Streaming</h3>
            <p className="text-gray-600">
              High-quality audio streaming with support for multiple formats.
            </p>
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <a href="#" className="text-blue-600 font-medium">
              Learn more →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="h-40 bg-green-500 flex items-center justify-center text-white">
            <GallerySvg />
          </div>
          <div className="p-4 flex-1">
            <h3 className="font-bold text-lg mb-2">Image Gallery</h3>
            <p className="text-gray-600">
              Dynamic image galleries with advanced filtering options.
            </p>
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <a href="#" className="text-green-600 font-medium">
              Learn more →
            </a>
          </div>
        </div>
      </div>,
    ],
    [isVisible, activeSlide]
  );

  return (
    <div className="bg-gray-100">
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Multi-Component Carousel
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            This example demonstrates how the carousel can display multiple
            components within a single slide, creating rich, interactive
            layouts.
          </p>

          <div id="main-carousel" className="max-w-6xl mx-auto mb-16">
            <Carousel
              items={multiComponentSlides}
              showDots={true}
              onSlideChange={handleSlideChange}
              className="shadow-xl rounded-xl overflow-hidden"
              autoPlayInterval={
                0
              } /* Disabled autoplay for better performance */
            />

            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-2">Current Layout</h2>
              <p className="text-gray-600">
                Showing slide {activeSlide + 1} of {multiComponentSlides.length}
                :{activeSlide === 0 && " Image + Text Layout"}
                {activeSlide === 1 && " Video + Testimonial Layout"}
                {activeSlide === 2 && " Audio + Article Preview Layout"}
                {activeSlide === 3 && " Card-based Layout"}
              </p>
            </div>
          </div>

          {/* Responsive Carousel Example */}
          <div
            id="responsive-section"
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Responsive Carousel
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
              This example shows a carousel that automatically adapts to
              different screen sizes, showing 1 card on mobile, 2 on tablet, and
              4 on desktop.
            </p>

            <div className="max-w-6xl mx-auto mb-16">
              {showResponsive ? (
                <ResponsiveCarouselExample />
              ) : (
                <div className="h-72 bg-gray-100 animate-pulse rounded-lg"></div>
              )}
            </div>
          </div>

          {/* Multi-item carousel example - loaded only when scrolled into view */}
          <div
            id="multi-item-section"
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">
              Multi-Item Carousel
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
              This example shows how the carousel can display multiple items per
              view with configurable settings.
            </p>

            {showMultiItem ? (
              <MultiItemCarouselExample />
            ) : (
              <div className="h-64 bg-gray-100 animate-pulse rounded-lg mb-8"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
