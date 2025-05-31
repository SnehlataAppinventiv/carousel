"use client";

import React, { useState } from "react";
import Carousel from "@/components/Carousel";
import ImageWithLoader from "@/components/Carousel/ImageWithLoader";
import MultiItemCarouselExample from "./multi-item-view";

export default function MultiComponentCarouselExample() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Create slides with multiple components in each slide
  const multiComponentSlides = [
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
        />
      </div>
      <div className="bg-white p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Feature Highlights</h2>
        <p className="text-gray-600 mb-6">
          This slide combines an image with descriptive text content in a
          responsive layout. On smaller screens, the elements stack vertically.
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

    // Slide 2: Video + Testimonial layout
    <div
      key="slide2"
      className="grid grid-cols-1 md:grid-cols-2 h-[500px] w-full"
    >
      <div className="bg-black h-full flex items-center justify-center">
        <video
          controls
          className="max-h-full max-w-full"
          poster="https://placehold.co/600x400/111827/ffffff?text=Product+Demo"
        >
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white p-8 flex flex-col justify-center">
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <blockquote className="text-xl italic mb-6">
          "This carousel solution has transformed how we present content to our
          users. The ability to combine different elements in a single slide is
          incredibly powerful."
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

    // Slide 3: Audio + Article preview layout
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
          <audio controls className="w-full">
            <source
              src="https://www.w3schools.com/html/horse.ogg"
              type="audio/ogg"
            />
            Your browser does not support the audio element.
          </audio>
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
            Curabitur at libero ut mauris iaculis commodo. Phasellus nec commodo
            velit. Nulla facilisi. Nam auctor, nisl eget ultricies lacinia, nisl
            nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
          </p>
          <p className="mb-4">
            Vivamus vestibulum quam id semper ultricies. Aenean eget lectus id
            sem vehicula ultricies eget ut massa. Sed non mauris eget mauris
            tincidunt ullamcorper at non diam.
          </p>
          <p className="mb-4">
            Cras fringilla, nisl vel lacinia cursus, nisl nisl aliquam nisl, eu
            aliquam nisl nisl eu nisl. Nullam euismod, nisl vel ultricies
            lacinia.
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-bold text-lg mb-2">Audio Streaming</h3>
          <p className="text-gray-600">
            High-quality audio streaming with support for multiple formats and
            devices.
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-bold text-lg mb-2">Image Gallery</h3>
          <p className="text-gray-600">
            Dynamic image galleries with advanced filtering and sorting options.
          </p>
        </div>
        <div className="p-4 bg-gray-50 border-t">
          <a href="#" className="text-green-600 font-medium">
            Learn more →
          </a>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="bg-gray-100">
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Multi-Component Carousel
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            This example demonstrates how the carousel can display multiple
            components within a single slide, creating rich, interactive layouts
            that combine different content types.
          </p>

          <div className="max-w-6xl mx-auto mb-16">
            <Carousel
              items={multiComponentSlides}
              showDots={true}
              onSlideChange={setActiveSlide}
              className="shadow-xl rounded-xl overflow-hidden"
              autoPlayInterval={8000}
            />

            <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-2">Current Layout</h2>
              <p className="text-gray-600">
                Showing slide {activeSlide + 1} of {multiComponentSlides.length}
                :{activeSlide === 0 && "Image + Text Layout"}
                {activeSlide === 1 && "Video + Testimonial Layout"}
                {activeSlide === 2 && "Audio + Article Preview Layout"}
                {activeSlide === 3 && "Card-based Layout"}
              </p>
            </div>
          </div>

          {/* Multi-item carousel example */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Multi-Item Carousel
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
              This example shows how the carousel can display multiple items per
              view with configurable settings.
            </p>

            <MultiItemCarouselExample />
          </div>
        </div>
      </div>
    </div>
  );
}
