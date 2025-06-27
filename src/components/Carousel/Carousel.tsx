"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import ChevronLeftIcon from "./ChevronLeftIcon";
import ChevronRightIcon from "./ChevronRightIcon";
import CarouselDots from "./CarouselDots";
import texts from "@/messages/en.json";

// Type for responsive breakpoints
interface ResponsiveOption {
  breakpoint: number; // Width in pixels where this option applies
  itemsPerView: number;
  itemsToScroll?: number;
}

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
  /** Responsive settings for different breakpoints */
  responsive?: ResponsiveOption[];
}

// Optimize carousel item rendering by only rendering what's visible and nearby
const CarouselItem = memo(
  ({
    item,
    index,
    currentIndex,
    itemsPerView,
    multiView,
    itemGap,
    isVisible,
  }: {
    item: React.ReactNode;
    index: number;
    currentIndex: number;
    itemsPerView: number;
    multiView: boolean;
    itemGap: number;
    isVisible: boolean;
  }) => {
    // Calculate if this item is visible or nearby (for performance)
    const t = texts.common.ui.carousel;

    // If the item is not visible and not within the buffer range, render a placeholder
    if (!isVisible) {
      return (
        <div
          className="flex-shrink-0"
          style={{
            width: multiView
              ? `calc((100% - ${
                  itemGap * (itemsPerView - 1)
                }px) / ${itemsPerView})`
              : "100%",
          }}
          aria-hidden="true"
        />
      );
    }

    return (
      <div
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
        aria-label={`${t.slideLabel} ${index + 1} of ${
          Array.isArray(item) ? item.length : "multiple"
        }`}
      >
        {item}
      </div>
    );
  }
);

CarouselItem.displayName = "CarouselItem";

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
  responsive = [],
}: CarouselProps) {
  const [carouselState, setCarouselState] = useState({
    currentIndex: 0,
    isTransitioning: false,
  });
  const { currentIndex, isTransitioning } = carouselState;

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const initialRenderRef = useRef(true);
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  // For responsive settings - consolidate state to reduce renders
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // For touch events - consolidate state to reduce renders
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const [touchState, setTouchState] = useState({
    isTouching: false,
    touchOffset: 0,
    isSwipeEnabled: true,
  });
  const { isTouching, touchOffset, isSwipeEnabled } = touchState;

  const t = texts.common.ui.carousel;

  // Handle responsive settings based on window width with debouncing
  useEffect(() => {
    // Skip on server-side rendering
    if (typeof window === "undefined") return;

    // Debounce function to limit the frequency of resize events
    function debounce<T extends (...args: unknown[]) => void>(
      fn: T,
      ms: number
    ) {
      let timer: NodeJS.Timeout | null = null;
      return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          fn(...args);
        }, ms);
      };
    }

    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, 200); // 200ms debounce

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Memoize responsive settings calculations
  const responsiveSettings = useMemo(() => {
    if (responsive && responsive.length > 0 && windowWidth > 0) {
      // Sort breakpoints from smallest to largest
      const sortedBreakpoints = [...responsive].sort(
        (a, b) => a.breakpoint - b.breakpoint
      );

      // Find the appropriate breakpoint
      let matchedSettings = { itemsPerView, itemsToScroll };

      for (const option of sortedBreakpoints) {
        // If window width is less than this breakpoint, use these settings
        if (windowWidth <= option.breakpoint) {
          matchedSettings = {
            itemsPerView: option.itemsPerView,
            itemsToScroll: option.itemsToScroll ?? option.itemsPerView,
          };
          break;
        }
      }

      // If window width is larger than all breakpoints, use the largest breakpoint
      if (
        windowWidth >
        sortedBreakpoints[sortedBreakpoints.length - 1]?.breakpoint
      ) {
        const largestBreakpoint =
          sortedBreakpoints[sortedBreakpoints.length - 1];
        matchedSettings = {
          itemsPerView: largestBreakpoint.itemsPerView,
          itemsToScroll:
            largestBreakpoint.itemsToScroll ?? largestBreakpoint.itemsPerView,
        };
      }

      return matchedSettings;
    }

    // If no responsive settings provided, use the default props
    return { itemsPerView, itemsToScroll };
  }, [windowWidth, responsive, itemsPerView, itemsToScroll]);

  // Get the current effective itemsPerView and itemsToScroll values
  const effectiveItemsPerView = responsiveSettings.itemsPerView;
  const effectiveItemsToScroll = responsiveSettings.itemsToScroll;

  // Calculate the maximum slide index based on effective items
  const maxIndex = useMemo(
    () =>
      multiView
        ? Math.max(0, items.length - effectiveItemsPerView)
        : items.length - 1,
    [items.length, effectiveItemsPerView, multiView]
  );

  // Ensure currentIndex doesn't exceed maxIndex when responsive settings change
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCarouselState((prev) => ({
        ...prev,
        currentIndex: maxIndex,
        isTransitioning: false,
      }));

      if (onSlideChange) {
        onSlideChange(maxIndex);
      }
    }
  }, [maxIndex, currentIndex, onSlideChange]);

  // Clear any running interval when component unmounts
  useEffect(() => {
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, []);

  // Setup auto-play if enabled
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
        setCarouselState((prev) => {
          // Don't go beyond the max index
          const newIndex =
            prev.currentIndex >= maxIndex
              ? maxIndex
              : prev.currentIndex + effectiveItemsToScroll;

          if (onSlideChange) {
            // Use a timeout to ensure this happens after render cycle
            setTimeout(() => onSlideChange(newIndex), 0);
          }

          return {
            ...prev,
            currentIndex: newIndex,
          };
        });
      }, autoPlayInterval);

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
          autoPlayRef.current = null;
        }
      };
    }
  }, [
    autoPlayInterval,
    items.length,
    onSlideChange,
    maxIndex,
    effectiveItemsToScroll,
  ]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (isTransitioning || items.length <= 1 || currentIndex === 0) return;

    setCarouselState((prev) => ({
      isTransitioning: true,
      currentIndex: Math.max(0, prev.currentIndex - effectiveItemsToScroll),
    }));

    if (onSlideChange) {
      // Use a timeout to ensure this happens after render cycle
      setTimeout(() => {
        const newIndex = Math.max(0, currentIndex - effectiveItemsToScroll);
        onSlideChange(newIndex);
      }, 0);
    }

    // Reset transition state after animation completes
    setTimeout(
      () =>
        setCarouselState((prev) => ({
          ...prev,
          isTransitioning: false,
        })),
      300
    );
  }, [
    isTransitioning,
    items.length,
    onSlideChange,
    currentIndex,
    effectiveItemsToScroll,
  ]);

  const goToNext = useCallback(() => {
    if (isTransitioning || items.length <= 1 || currentIndex >= maxIndex)
      return;

    setCarouselState((prev) => ({
      isTransitioning: true,
      currentIndex: Math.min(
        maxIndex,
        prev.currentIndex + effectiveItemsToScroll
      ),
    }));

    if (onSlideChange) {
      // Use a timeout to ensure this happens after render cycle
      setTimeout(() => {
        const newIndex = Math.min(
          maxIndex,
          currentIndex + effectiveItemsToScroll
        );
        onSlideChange(newIndex);
      }, 0);
    }

    // Reset transition state after animation completes
    setTimeout(
      () =>
        setCarouselState((prev) => ({
          ...prev,
          isTransitioning: false,
        })),
      300
    );
  }, [
    isTransitioning,
    items.length,
    onSlideChange,
    currentIndex,
    maxIndex,
    effectiveItemsToScroll,
  ]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex || items.length <= 1)
        return;

      // Ensure we don't go beyond max index
      const targetIndex = Math.min(maxIndex, Math.max(0, index));

      setCarouselState({
        isTransitioning: true,
        currentIndex: targetIndex,
      });

      // Use a timeout to ensure this happens after render cycle
      if (onSlideChange) {
        setTimeout(() => onSlideChange(targetIndex), 0);
      }

      // Reset transition state after animation completes
      setTimeout(
        () =>
          setCarouselState((prev) => ({
            ...prev,
            isTransitioning: false,
          })),
        300
      );
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

  // Touch event handlers - consolidated for performance
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwipeEnabled || items.length <= 1) return;

      touchStartXRef.current = e.touches[0].clientX;
      touchEndXRef.current = e.touches[0].clientX;

      setTouchState((prev) => ({
        ...prev,
        isTouching: true,
        touchOffset: 0,
      }));

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

        setTouchState((prev) => ({
          ...prev,
          touchOffset: offsetPercentage,
        }));
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
      setTouchState((prev) => ({
        ...prev,
        isTouching: false,
        touchOffset: 0,
      }));
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

    setTouchState((prev) => ({
      ...prev,
      isTouching: false,
      touchOffset: 0,
    }));

    // Resume autoplay if needed
    if (autoPlayInterval > 0 && items.length > 1 && !autoPlayRef.current) {
      autoPlayRef.current = setInterval(() => {
        setCarouselState((prev) => {
          const newIndex =
            prev.currentIndex >= maxIndex
              ? maxIndex
              : prev.currentIndex + effectiveItemsToScroll;

          if (onSlideChange) {
            setTimeout(() => onSlideChange(newIndex), 0);
          }

          return {
            ...prev,
            currentIndex: newIndex,
          };
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
    effectiveItemsToScroll,
  ]);

  // Determine which slides to render (visible + buffer for performance)
  const getIsSlideVisible = useCallback(
    (index: number) => {
      // Calculate which slides are visible or in the buffer zone (1 slide before and after visible range)
      const bufferSize = 1;
      const minVisibleIndex = Math.max(0, currentIndex - bufferSize);
      const maxVisibleIndex = Math.min(
        items.length - 1,
        currentIndex + effectiveItemsPerView - 1 + bufferSize
      );

      return index >= minVisibleIndex && index <= maxVisibleIndex;
    },
    [currentIndex, effectiveItemsPerView, items.length]
  );

  // If there are no items or only one item, render simplified view
  if (items.length === 0) {
    return null;
  }

  if (
    items.length === 1 ||
    (multiView && items.length <= effectiveItemsPerView)
  ) {
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
                    itemGap * (effectiveItemsPerView - 1)
                  }px) / ${effectiveItemsPerView})`,
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
                  currentIndex * (100 / effectiveItemsPerView) + touchOffset
                }%)`
              : `translateX(-${currentIndex * (100 / effectiveItemsPerView)}%)`,
            gap: multiView ? `${itemGap}px` : "0",
            willChange: "transform",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              item={item}
              index={index}
              currentIndex={currentIndex}
              itemsPerView={effectiveItemsPerView}
              multiView={multiView}
              itemGap={itemGap}
              isVisible={getIsSlideVisible(index)}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        {showArrows &&
          items.length > (multiView ? effectiveItemsPerView : 1) && (
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
