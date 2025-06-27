"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import Carousel from "@/components/Carousel";

// Memoized Card component to prevent unnecessary re-renders
const Card = memo(({ index, color }: { index: number; color: string }) => (
  <div
    className={`${color} rounded-lg shadow-md p-6 h-full flex flex-col justify-between`}
  >
    <div>
      <h3 className="font-bold text-white text-xl mb-3">Card {index + 1}</h3>
      <p className="text-white/90">
        This card automatically adjusts based on screen size.
      </p>
    </div>
    <div className="mt-4 bg-white/20 text-white text-center py-2 px-3 rounded">
      Item #{index + 1}
    </div>
  </div>
));

Card.displayName = "Card";

// Debounce function to limit the frequency of function calls
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Breakpoint info component
const BreakpointInfo = memo(
  ({
    deviceType,
    windowWidth,
    itemsPerView,
  }: {
    deviceType: string;
    windowWidth: number;
    itemsPerView: number;
  }) => (
    <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between">
        <p className="text-blue-800 font-medium">
          <span className="font-bold">Current display:</span> {deviceType} (
          {windowWidth}px)
        </p>
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {itemsPerView} {itemsPerView === 1 ? "card" : "cards"} per view
        </div>
      </div>
      <p className="text-blue-600 text-sm mt-2">
        Resize your browser window to see how the carousel adapts automatically
      </p>
    </div>
  )
);

BreakpointInfo.displayName = "BreakpointInfo";

// Breakpoint legend component
const BreakpointLegend = memo(() => (
  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="font-medium text-lg mb-4">Responsive Breakpoints:</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded border border-gray-200">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span className="font-medium">Mobile</span>
        </div>
        <p className="text-gray-600 text-sm">&lt; 640px: Shows 1 card</p>
      </div>
      <div className="bg-white p-4 rounded border border-gray-200">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="font-medium">Tablet</span>
        </div>
        <p className="text-gray-600 text-sm">640px - 1023px: Shows 2 cards</p>
      </div>
      <div className="bg-white p-4 rounded border border-gray-200">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
          <span className="font-medium">Desktop</span>
        </div>
        <p className="text-gray-600 text-sm">≥ 1024px: Shows 4 cards</p>
      </div>
    </div>
  </div>
));

BreakpointLegend.displayName = "BreakpointLegend";

export default function ResponsiveCarouselExample() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    deviceType: "",
    itemsPerView: 4,
  });

  // Get device info based on window width
  const getDeviceInfo = useCallback((width: number) => {
    if (width < 640) {
      return { deviceType: "Mobile", itemsPerView: 1 };
    } else if (width < 1024) {
      return { deviceType: "Tablet", itemsPerView: 2 };
    } else {
      return { deviceType: "Desktop", itemsPerView: 4 };
    }
  }, []);

  // Handle window resize with debounce to prevent excessive updates
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize with current window size
    const width = window.innerWidth;
    const { deviceType, itemsPerView } = getDeviceInfo(width);
    setWindowSize({ width, deviceType, itemsPerView });

    // Create debounced resize handler
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const { deviceType, itemsPerView } = getDeviceInfo(width);
      setWindowSize({ width, deviceType, itemsPerView });
    }, 200); // 200ms debounce

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getDeviceInfo]);

  // Responsive breakpoints - memoized to prevent recreation
  const responsiveSettings = useMemo(
    () => [
      {
        breakpoint: 640, // Mobile breakpoint
        itemsPerView: 1,
        itemsToScroll: 1,
      },
      {
        breakpoint: 1024, // Tablet breakpoint
        itemsPerView: 2,
        itemsToScroll: 1,
      },
      {
        breakpoint: 10000, // Desktop and above (using a very large number)
        itemsPerView: 4,
        itemsToScroll: 2,
      },
    ],
    []
  );

  // Pre-generate all cards once and memoize
  const colors = useMemo(
    () => [
      "bg-blue-500",
      "bg-pink-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ],
    []
  );

  // Memoize the card components to prevent recreation on each render
  const cards = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const color = colors[index % colors.length];
        return <Card key={index} index={index} color={color} />;
      }),
    [colors]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Responsive Carousel</h2>

      <BreakpointInfo
        deviceType={windowSize.deviceType}
        windowWidth={windowSize.width}
        itemsPerView={windowSize.itemsPerView}
      />

      <div className="h-72 mb-6">
        <Carousel
          items={cards}
          multiView={true}
          itemGap={16}
          className="h-full"
          responsive={responsiveSettings}
        />
      </div>

      <BreakpointLegend />
    </div>
  );
}
