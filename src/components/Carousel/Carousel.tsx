"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronRightIcon from "./ChevronRightIcon";
import CarouselDots from "./CarouselDots";
import texts from "@/messages/en.json";

interface CarouselProps {
  /** Array of items to display in the carousel */
  items: React.ReactNode[];
  /** Auto-play interval in milliseconds. Set to 0 to disable auto-play */
  autoPlayInterval?: number;
  /** Whether to show navigation arrows */
  showArrows?: boolean;
  /** Whether to show pagination dots */
  showDots?: boolean;
  /** Custom class name for the carousel container */
  className?: string;
  /** Callback function triggered when slide changes */
  onSlideChange?: (index: number) => void;
  /** Number of items to show at once in the viewport */
  itemsPerView?: number;
  /** Number of items to scroll by when navigating */
  itemsToScroll?: number;
  /** Gap between items in pixels */
  itemGap?: number;
  /** Whether to use multi-item view mode (shows multiple items) */
  multiView?: boolean;
}

export default function Carousel({
  items,
  autoPlayInterval = 0,
  showArrows = true,
  showDots = true,
  className = "",
  onSlideChange,
  itemsPerView = 1,
  itemsToScroll = 1,
  itemGap = 16,
  multiView = false,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const initialRenderRef = useRef(true);
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  // For touch events
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);
  const [touchOffset, setTouchOffset] = useState(0);
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

  const t = texts.common.ui.carousel;

  // Calculate the maximum slide index
  const maxIndex = multiView
    ? Math.max(0, items.length - itemsPerView)
    : items.length - 1;

  // Clear any running interval when component unmounts
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  // Setup auto-play if enabled - this needs to be in useEffect to avoid render cycle issues
  useEffect(() => {
    // Skip the first render to avoid the setState during render issue
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    if (autoPlayInterval > 0 && items.length > 1) {
      // Clear any existing interval
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }

      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          // Don't go beyond the max index
          const newIndex =
            prevIndex >= maxIndex ? maxIndex : prevIndex + itemsToScroll;
          if (onSlideChange) {
            // Use a timeout to ensure this happens after render cycle
            setTimeout(() => onSlideChange(newIndex), 0);
          }
          return newIndex;
        });
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
          autoPlayRef.current = null;
        }
      };
    }
  }, [autoPlayInterval, items.length, onSlideChange, maxIndex, itemsToScroll]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (isTransitioning || items.length <= 1 || currentIndex === 0) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(0, prevIndex - itemsToScroll);
      if (onSlideChange) {
        // Use a timeout to ensure this happens after render cycle
        setTimeout(() => onSlideChange(newIndex), 0);
      }
      return newIndex;
    });

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  }, [
    isTransitioning,
    items.length,
    onSlideChange,
    currentIndex,
    itemsToScroll,
  ]);

  const goToNext = useCallback(() => {
    if (isTransitioning || items.length <= 1 || currentIndex >= maxIndex)
      return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.min(maxIndex, prevIndex + itemsToScroll);
      if (onSlideChange) {
        // Use a timeout to ensure this happens after render cycle
        setTimeout(() => onSlideChange(newIndex), 0);
      }
      return newIndex;
    });

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  }, [
    isTransitioning,
    items.length,
    onSlideChange,
    currentIndex,
    maxIndex,
    itemsToScroll,
  ]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex || items.length <= 1)
        return;

      // Ensure we don't go beyond max index
      const targetIndex = Math.min(maxIndex, Math.max(0, index));

      setIsTransitioning(true);
      setCurrentIndex(targetIndex);

      // Use a timeout to ensure this happens after render cycle
      if (onSlideChange) {
        setTimeout(() => onSlideChange(targetIndex), 0);
      }

      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [currentIndex, isTransitioning, items.length, onSlideChange, maxIndex]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  // Touch event handlers for swipe functionality
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwipeEnabled || items.length <= 1) return;

      touchStartXRef.current = e.touches[0].clientX;
      touchEndXRef.current = e.touches[0].clientX;
      setIsTouching(true);
      setTouchOffset(0);

      // Pause autoplay during touch
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    },
    [isSwipeEnabled, items.length]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isTouching || !touchStartXRef.current || !isSwipeEnabled) return;

      touchEndXRef.current = e.touches[0].clientX;
      const diff = touchStartXRef.current - touchEndXRef.current;

      // Calculate the percentage of the container width for smooth movement
      if (slidesContainerRef.current) {
        const containerWidth = slidesContainerRef.current.offsetWidth;
        const offsetPercentage = (diff / containerWidth) * 100;
        setTouchOffset(offsetPercentage);
      }
    },
    [isTouching, isSwipeEnabled]
  );

  const handleTouchEnd = useCallback(() => {
    if (
      !isTouching ||
      !touchStartXRef.current ||
      !touchEndXRef.current ||
      !isSwipeEnabled
    ) {
      setIsTouching(false);
      setTouchOffset(0);
      return;
    }

    const diff = touchStartXRef.current - touchEndXRef.current;

    // Threshold for swipe (pixels)
    const threshold = 50;

    if (diff > threshold && currentIndex < maxIndex) {
      // Swipe left, go to next slide
      goToNext();
    } else if (diff < -threshold && currentIndex > 0) {
      // Swipe right, go to previous slide
      goToPrevious();
    }

    // Reset touch state
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsTouching(false);
    setTouchOffset(0);

    // Resume autoplay if needed
    if (autoPlayInterval > 0 && items.length > 1 && !autoPlayRef.current) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const newIndex =
            prevIndex >= maxIndex ? maxIndex : prevIndex + itemsToScroll;
          if (onSlideChange) {
            setTimeout(() => onSlideChange(newIndex), 0);
          }
          return newIndex;
        });
      }, autoPlayInterval);
    }
  }, [
    isTouching,
    isSwipeEnabled,
    goToNext,
    goToPrevious,
    autoPlayInterval,
    items.length,
    onSlideChange,
    currentIndex,
    maxIndex,
    itemsToScroll,
  ]);

  // If there are no items or only one item, render simplified view
  if (items.length === 0) {
    return null;
  }

  if (items.length === 1 || (multiView && items.length <= itemsPerView)) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        {multiView ? (
          <div className="flex w-full h-full" style={{ gap: `${itemGap}px` }}>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0"
                style={{
                  width: `calc((100% - ${
                    itemGap * (itemsPerView - 1)
                  }px) / ${itemsPerView})`,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full">{items[0]}</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Content carousel"
    >
      {/* Main carousel container */}
      <div className="relative w-full h-full" aria-live="polite">
        {/* Slides container */}
        <div
          ref={slidesContainerRef}
          className={`flex ${
            isTouching ? "" : "transition-transform duration-300 ease-in-out"
          } h-full`}
          style={{
            transform: isTouching
              ? `translateX(-${
                  currentIndex * (100 / itemsPerView) + touchOffset
                }%)`
              : `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            gap: multiView ? `${itemGap}px` : "0",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                width: multiView
                  ? `calc((100% - ${
                      itemGap * (itemsPerView - 1)
                    }px) / ${itemsPerView})`
                  : "100%",
              }}
              aria-hidden={
                multiView
                  ? index < currentIndex || index >= currentIndex + itemsPerView
                  : index !== currentIndex
              }
              role="group"
              aria-roledescription="slide"
              aria-label={`${t.slideLabel} ${index + 1} of ${items.length}`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {showArrows && items.length > (multiView ? itemsPerView : 1) && (
          <>
            <button
              type="button"
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              onClick={goToPrevious}
              disabled={isTransitioning || currentIndex === 0}
              aria-label={t.prevSlide}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10 ${
                currentIndex >= maxIndex
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              onClick={goToNext}
              disabled={isTransitioning || currentIndex >= maxIndex}
              aria-label={t.nextSlide}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      {showDots && (
        <CarouselDots
          itemCount={multiView ? maxIndex + 1 : items.length}
          activeIndex={currentIndex}
          onDotClick={goToSlide}
        />
      )}

      {/* Touch indicator */}
      <div className="hidden absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 z-50">
        Touch enabled: {isSwipeEnabled ? "Yes" : "No"} | Status:{" "}
        {isTouching ? "Touching" : "Not touching"} | Offset:{" "}
        {touchOffset.toFixed(2)}%
      </div>
    </div>
  );
}
