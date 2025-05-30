'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChevronLeftIcon from './ChevronLeftIcon';
import ChevronRightIcon from './ChevronRightIcon';
import CarouselDots from './CarouselDots';
import texts from '@/messages/en.json';

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
}

export default function Carousel({
  items,
  autoPlayInterval = 0,
  showArrows = true,
  showDots = true,
  className = '',
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const initialRenderRef = useRef(true);
  const t = texts.common.ui.carousel;

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
        setCurrentIndex(prevIndex => {
          const newIndex = (prevIndex + 1) % items.length;
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
  }, [autoPlayInterval, items.length, onSlideChange]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (isTransitioning || items.length <= 1) return;

    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? items.length - 1 : prevIndex - 1;
      if (onSlideChange) {
        // Use a timeout to ensure this happens after render cycle
        setTimeout(() => onSlideChange(newIndex), 0);
      }
      return newIndex;
    });

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, items.length, onSlideChange]);

  const goToNext = useCallback(() => {
    if (isTransitioning || items.length <= 1) return;

    setIsTransitioning(true);
    setCurrentIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % items.length;
      if (onSlideChange) {
        // Use a timeout to ensure this happens after render cycle
        setTimeout(() => onSlideChange(newIndex), 0);
      }
      return newIndex;
    });

    // Reset transition state after animation completes
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, items.length, onSlideChange]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex || items.length <= 1) return;

      setIsTransitioning(true);
      setCurrentIndex(index);

      // Use a timeout to ensure this happens after render cycle
      if (onSlideChange) {
        setTimeout(() => onSlideChange(index), 0);
      }

      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [currentIndex, isTransitioning, items.length, onSlideChange]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNext, goToPrevious]);

  // If there are no items or only one item, render simplified view
  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return (
      <div className={`relative overflow-hidden rounded-lg ${className}`}>
        <div className="w-full h-full">{items[0]}</div>
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
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              aria-hidden={index !== currentIndex}
              role="group"
              aria-roledescription="slide"
              aria-label={`${t.slideLabel} ${index + 1} of ${items.length}`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {showArrows && items.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              onClick={goToPrevious}
              disabled={isTransitioning}
              aria-label={t.prevSlide}
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              onClick={goToNext}
              disabled={isTransitioning}
              aria-label={t.nextSlide}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {/* Pagination dots */}
      {showDots && items.length > 1 && (
        <CarouselDots itemCount={items.length} activeIndex={currentIndex} onDotClick={goToSlide} />
      )}
    </div>
  );
}
