"use client";

import React, { useState, useMemo, useCallback, memo, useEffect } from "react";
import Carousel from "@/components/Carousel";

interface CardProps {
  id: number;
  title: string;
  content: string;
  color: string;
}

// Memoized card component to prevent unnecessary re-renders
const Card = memo(({ id, title, content, color }: CardProps) => (
  <div
    className={`${color} rounded-lg shadow-md p-4 h-full flex flex-col justify-between`}
  >
    <div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-white/80">{content}</p>
    </div>
    <div className="mt-4 bg-white/20 text-white text-center py-1 px-2 rounded">
      Item #{id}
    </div>
  </div>
));

Card.displayName = "Card";

// Configuration controls component
interface ConfigControlsProps {
  itemsPerView: number;
  setItemsPerView: (value: number) => void;
  itemsToScroll: number;
  setItemsToScroll: (value: number) => void;
  itemGap: number;
  setItemGap: (value: number) => void;
  isResponsive: boolean;
  setIsResponsive: (value: boolean) => void;
}

const ConfigControls = memo(
  ({
    itemsPerView,
    setItemsPerView,
    itemsToScroll,
    setItemsToScroll,
    itemGap,
    setItemGap,
    isResponsive,
    setIsResponsive,
  }: ConfigControlsProps) => {
    const handleItemsPerViewChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        setItemsPerView(newValue);
        // Ensure itemsToScroll is not greater than itemsPerView
        if (itemsToScroll > newValue) {
          setItemsToScroll(newValue);
        }
      },
      [itemsToScroll, setItemsPerView, setItemsToScroll]
    );

    const handleItemsToScrollChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setItemsToScroll(parseInt(e.target.value));
      },
      [setItemsToScroll]
    );

    const handleItemGapChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setItemGap(parseInt(e.target.value));
      },
      [setItemGap]
    );

    return (
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-xl font-bold mb-4">Carousel Configuration</h3>

        <div className="flex items-center mb-4">
          <div className="flex items-center">
            <input
              id="responsive-toggle"
              type="checkbox"
              checked={isResponsive}
              onChange={(e) => setIsResponsive(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="responsive-toggle"
              className="ml-2 text-sm font-medium text-gray-900"
            >
              Enable Responsive Mode (1 on mobile, 4 on desktop)
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={isResponsive ? "opacity-50" : ""}>
            <label className="block text-gray-700 font-medium mb-2">
              Items Per View: {itemsPerView}
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={itemsPerView}
              onChange={handleItemsPerViewChange}
              disabled={isResponsive}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
              <span>6</span>
              <span>7</span>
            </div>
          </div>

          <div className={isResponsive ? "opacity-50" : ""}>
            <label className="block text-gray-700 font-medium mb-2">
              Items to Scroll: {itemsToScroll}
            </label>
            <input
              type="range"
              min="1"
              max={itemsPerView}
              value={itemsToScroll}
              onChange={handleItemsToScrollChange}
              disabled={isResponsive}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>{itemsPerView}</span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Gap Between Items: {itemGap}px
            </label>
            <input
              type="range"
              min="0"
              max="32"
              value={itemGap}
              onChange={handleItemGapChange}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>16px</span>
              <span>32px</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConfigControls.displayName = "ConfigControls";

// Function to get color based on index - memoize this so it doesn't recalculate
const getColorForIndex = (index: number): string => {
  const colors = [
    "bg-blue-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];
  return colors[index % colors.length];
};

// Add a debounce utility function at the top, just after imports
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

export default function MultiItemCarouselExample() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [itemsToScroll, setItemsToScroll] = useState(1);
  const [itemGap, setItemGap] = useState(16);
  const [isResponsive, setIsResponsive] = useState(true);
  const [windowInfo, setWindowInfo] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    deviceType: "",
    effectiveItemsPerView: 4,
  });

  // Update window size with debouncing
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Function to determine device type and effective items
    const getDeviceInfo = (width: number) => {
      let deviceType = "";
      let effectiveItemsPerView = itemsPerView;

      if (width < 640) {
        deviceType = "Mobile";
        effectiveItemsPerView = 1;
      } else if (width < 1024) {
        deviceType = "Tablet";
        effectiveItemsPerView = 2;
      } else {
        deviceType = "Desktop";
        effectiveItemsPerView = 4;
      }

      return { deviceType, effectiveItemsPerView };
    };

    // Initialize with current window size
    const width = window.innerWidth;
    const { deviceType, effectiveItemsPerView } = getDeviceInfo(width);
    setWindowInfo({ width, deviceType, effectiveItemsPerView });

    // Create debounced resize handler
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const { deviceType, effectiveItemsPerView } = getDeviceInfo(width);
      setWindowInfo({ width, deviceType, effectiveItemsPerView });
    }, 200); // 200ms debounce

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsPerView]);

  // Memoize the slide change handler
  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  // Memoize the responsive settings
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

  // Generate cards for the example - memoize to prevent recreating on every render
  const cards = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Card ${i + 1}`,
        content: `This is card number ${i + 1} content`,
        color: getColorForIndex(i),
      })),
    []
  );

  // Create array of card components - memoize to prevent recreating on every render
  const cardItems = useMemo(
    () => cards.map((card) => <Card key={card.id} {...card} />),
    [cards]
  );

  // Memoize the effective items per view
  const effectiveItemsPerView = useMemo(() => {
    if (!isResponsive) return itemsPerView;
    return windowInfo.effectiveItemsPerView;
  }, [isResponsive, itemsPerView, windowInfo.effectiveItemsPerView]);

  // Calculate total number of "slides" based on itemsPerView
  const totalSlides = useMemo(
    () => Math.max(1, cards.length - effectiveItemsPerView + 1),
    [cards.length, effectiveItemsPerView]
  );

  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">
          Responsive Multi-Item Carousel
        </h2>

        {isResponsive && (
          <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <p className="text-blue-800">
              <span className="font-bold">Current mode:</span>{" "}
              {windowInfo.deviceType} ({windowInfo.width}px) - Showing{" "}
              {effectiveItemsPerView}{" "}
              {effectiveItemsPerView === 1 ? "card" : "cards"} per view
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Resize your browser window to see responsive behavior in action
            </p>
          </div>
        )}

        <div className="mb-8">
          <div className="h-64 mb-4">
            <Carousel
              items={cardItems}
              onSlideChange={handleSlideChange}
              multiView={true}
              itemsPerView={isResponsive ? undefined : itemsPerView}
              itemsToScroll={isResponsive ? undefined : itemsToScroll}
              itemGap={itemGap}
              className="h-full"
              responsive={isResponsive ? responsiveSettings : undefined}
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              Showing items {activeSlide + 1} to{" "}
              {Math.min(activeSlide + effectiveItemsPerView, cards.length)} of{" "}
              {cards.length}
            </p>
            <p className="text-gray-500 text-sm">
              Current slide: {activeSlide + 1} of {totalSlides}
            </p>
          </div>
        </div>

        {/* Controls for customizing the carousel */}
        <ConfigControls
          itemsPerView={itemsPerView}
          setItemsPerView={setItemsPerView}
          itemsToScroll={itemsToScroll}
          setItemsToScroll={setItemsToScroll}
          itemGap={itemGap}
          setItemGap={setItemGap}
          isResponsive={isResponsive}
          setIsResponsive={setIsResponsive}
        />

        {/* Explanation */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-bold mb-3 text-blue-800">
            About Responsive Multi-Item Carousel
          </h3>
          <p className="text-blue-700 mb-4">
            This example demonstrates a responsive carousel that adapts to
            different screen sizes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>
              <strong>Mobile (below 640px):</strong> Shows 1 card at a time
            </li>
            <li>
              <strong>Tablet (640px-1023px):</strong> Shows 2 cards at a time
            </li>
            <li>
              <strong>Desktop (1024px and above):</strong> Shows 4 cards at a
              time
            </li>
            <li>
              <strong>Toggle Responsive Mode:</strong> Switch between responsive
              behavior and manual configuration
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
