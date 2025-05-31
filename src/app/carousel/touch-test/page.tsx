"use client";

import React, { useState, useEffect, useRef } from "react";
import Carousel from "@/components/Carousel";

// Define our own simpler touch point interface to avoid TypeScript errors
interface TouchPoint {
  clientX: number;
  clientY: number;
}

export default function TouchTestPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStatus, setTouchStatus] = useState("No touch detected");
  const [isMobile, setIsMobile] = useState(false);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchCurrentRef = useRef<TouchPoint | null>(null);
  const swipeDiffRef = useRef(0);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Create example slides
  const slides = [
    // Red slide
    <div
      key="slide1"
      className="h-64 md:h-96 w-full bg-red-500 flex items-center justify-center"
    >
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Slide 1</h2>
        <p>Swipe left or right to navigate</p>
      </div>
    </div>,

    // Blue slide
    <div
      key="slide2"
      className="h-64 md:h-96 w-full bg-blue-500 flex items-center justify-center"
    >
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Slide 2</h2>
        <p>Testing touch events</p>
      </div>
    </div>,

    // Green slide
    <div
      key="slide3"
      className="h-64 md:h-96 w-full bg-green-500 flex items-center justify-center"
    >
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Slide 3</h2>
        <p>Try swiping faster or slower</p>
      </div>
    </div>,

    // Purple slide
    <div
      key="slide4"
      className="h-64 md:h-96 w-full bg-purple-500 flex items-center justify-center"
    >
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Slide 4</h2>
        <p>Observe the touch indicators below</p>
      </div>
    </div>,
  ];

  // Custom touch event handlers for the test area
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
    touchCurrentRef.current = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };
    swipeDiffRef.current = 0;
    setTouchStatus("Touch started");
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    touchCurrentRef.current = {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY,
    };

    if (touchStartRef.current && touchCurrentRef.current) {
      swipeDiffRef.current =
        touchStartRef.current.clientX - touchCurrentRef.current.clientX;
      setTouchStatus(
        `Swiping: ${swipeDiffRef.current > 0 ? "left" : "right"} (${Math.abs(
          swipeDiffRef.current
        )}px)`
      );
    }
  };

  const handleTouchEnd = () => {
    const direction = swipeDiffRef.current > 0 ? "left" : "right";
    const distance = Math.abs(swipeDiffRef.current);

    setTouchStatus(`Swipe ended: ${direction} swipe of ${distance}px`);

    touchStartRef.current = null;
    touchCurrentRef.current = null;
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Touch Support Test
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Test the carousel's touch events on mobile devices or with touch
          simulation
        </p>

        {/* Device detection */}
        <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded-lg text-center">
          <p>
            <span className="font-bold">Device type:</span>{" "}
            {isMobile ? "Mobile/Touch Device" : "Desktop/Non-touch Device"}
          </p>
          {!isMobile && (
            <p className="text-sm mt-1">
              Tip: Use Chrome DevTools device emulation (Ctrl+Shift+M) to test
              touch events
            </p>
          )}
        </div>

        {/* Main carousel */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Carousel with Touch Support
          </h2>
          <Carousel
            items={slides}
            onSlideChange={setActiveSlide}
            className="rounded-lg overflow-hidden shadow-lg"
          />
          <p className="mt-3 text-gray-600 text-center">
            Current slide: {activeSlide + 1} of {slides.length}
          </p>
        </div>

        {/* Touch test area */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Touch Test Area</h2>
          <div
            className="h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-4 touch-manipulation"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <p className="text-gray-600">Touch and swipe here to test</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="font-medium mb-2">Touch Event Data:</h3>
            <p className="text-gray-800 font-mono bg-gray-100 p-2 rounded">
              {touchStatus}
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">How to Test Touch Support</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>On mobile devices:</strong> Simply swipe left and right on
              the carousel to navigate between slides.
            </li>
            <li>
              <strong>On desktop with Chrome:</strong> Open DevTools (F12),
              click the "Toggle device toolbar" button (Ctrl+Shift+M), select a
              mobile device, and then use your mouse to simulate touch events.
            </li>
            <li>
              <strong>Watch the indicators:</strong> The touch test area will
              display information about your swipe gestures.
            </li>
            <li>
              <strong>Test responsiveness:</strong> The carousel should respond
              to swipes with a threshold - short swipes won't trigger
              navigation, but longer swipes will change slides.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
