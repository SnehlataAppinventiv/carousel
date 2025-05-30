"use client";

import React, { useState } from "react";
import Carousel from "@/components/Carousel";
import ImageWithLoader from "@/components/Carousel/ImageWithLoader";

export default function MixedContentCarouselExample() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Create slides with different content types
  const mixedContentSlides = [
    // Image slide
    <div key="image" className="h-96 w-full">
      <div className="relative h-full">
        <ImageWithLoader
          src="https://placehold.co/800x600/3949ab/ffffff?text=Image+Slide"
          alt="Image slide example"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="text-xl font-bold">Image Content</h3>
          <p>High-quality photos and graphics</p>
        </div>
      </div>
    </div>,

    // Video slide
    <div key="video" className="h-96 w-full bg-black">
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <video
            controls
            className="max-h-full max-w-full"
            poster="https://placehold.co/800x450/111827/ffffff?text=Video+Thumbnail"
          >
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="p-4 bg-gray-900 text-white">
          <h3 className="text-xl font-bold">Video Content</h3>
          <p>Engaging videos from our media library</p>
        </div>
      </div>
    </div>,

    // Audio slide with visualization
    <div
      key="audio"
      className="h-96 w-full bg-gradient-to-r from-purple-700 to-indigo-900 text-white"
    >
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
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
        <h3 className="text-2xl font-bold mb-2">Audio Experience</h3>
        <p className="text-center mb-6">
          High-quality audio tracks with immersive sound
        </p>
        <audio controls className="w-full max-w-md">
          <source
            src="https://www.w3schools.com/html/horse.ogg"
            type="audio/ogg"
          />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>,

    // Blog post slide
    <div key="blog" className="h-96 w-full bg-white overflow-y-auto">
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-4">Latest Article</h3>
        <div className="prose max-w-none">
          <p className="lead text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            facilisi. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam
            nisl, eu aliquam nisl nisl eu nisl.
          </p>
          <p className="mt-4">
            Curabitur at libero ut mauris iaculis commodo. Phasellus nec commodo
            velit. Nulla facilisi. Nam auctor, nisl eget ultricies lacinia, nisl
            nisl aliquam nisl, eu aliquam nisl nisl eu nisl. Nullam euismod,
            nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl
            nisl eu nisl.
          </p>
          <p className="mt-4">
            Vivamus vestibulum quam id semper ultricies. Aenean eget lectus id
            sem vehicula ultricies eget ut massa. Sed non mauris eget mauris
            tincidunt ullamcorper at non diam. Proin bibendum diam quis eros
            molestie, in molestie nisl ultrices.
          </p>
          <p className="mt-4">
            Cras fringilla, nisl vel lacinia cursus, nisl nisl aliquam nisl, eu
            aliquam nisl nisl eu nisl. Nullam euismod, nisl vel ultricies
            lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.
          </p>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Mixed Content Carousel
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
          This example demonstrates how the carousel component can handle
          multiple content types in a single implementation, including images,
          videos, audio players, and text content.
        </p>

        <div className="max-w-4xl mx-auto">
          <Carousel
            items={mixedContentSlides}
            showDots={true}
            onSlideChange={setActiveSlide}
            className="shadow-xl rounded-xl overflow-hidden"
          />

          <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Current Content</h2>
            <p className="text-gray-600">
              Showing slide {activeSlide + 1} of {mixedContentSlides.length}:
              {activeSlide === 0 && "Image Content"}
              {activeSlide === 1 && "Video Content"}
              {activeSlide === 2 && "Audio Experience"}
              {activeSlide === 3 && "Blog Post"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
