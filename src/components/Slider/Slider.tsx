'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SliderProps {
  /** The minimum value of the slider */
  min?: number;
  /** The maximum value of the slider */
  max?: number;
  /** The current value of the slider */
  value?: number;
  /** Step interval for the slider */
  step?: number;
  /** Called when the slider value changes */
  onChange?: (value: number) => void;
  /** Label for the slider (for accessibility) */
  label?: string;
  /** Whether to show the current value */
  showValue?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Format function for the displayed value */
  formatValue?: (value: number) => string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom thumb component */
  thumbComponent?: React.ReactNode;
  /** Color for the active track */
  trackColor?: string;
  /** Custom labels for specific values */
  valueLabels?: Record<number, string>;
}

export default function Slider({
  min = 0,
  max = 100,
  value: propValue,
  step = 1,
  onChange,
  label = 'Slider',
  showValue = true,
  className = '',
  formatValue = (value: number) => `${value}`,
  disabled = false,
  thumbComponent,
  trackColor = 'bg-blue-500',
  valueLabels,
}: SliderProps) {
  // Use controlled or uncontrolled state
  const [internalValue, setInternalValue] = useState(propValue !== undefined ? propValue : min);
  const value = propValue !== undefined ? propValue : internalValue;

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Calculate percentage for positioning
  const getPercentage = useCallback(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  // Convert a position to a value
  const positionToValue = useCallback(
    (position: number) => {
      if (!trackRef.current) return min;

      const trackRect = trackRef.current.getBoundingClientRect();
      const trackWidth = trackRect.width;
      const offset = Math.max(0, Math.min(position - trackRect.left, trackWidth));
      const percentage = offset / trackWidth;

      // Calculate raw value
      let newValue = min + percentage * (max - min);

      // Apply step
      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }

      // Constrain to range
      return Math.max(min, Math.min(max, newValue));
    },
    [min, max, step]
  );

  // Handle mouse and touch interactions
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      isDraggingRef.current = true;
      document.body.style.userSelect = 'none';

      // Update value based on initial click position
      const newValue = positionToValue(e.clientX);
      setInternalValue(newValue);
      if (onChange) onChange(newValue);

      e.preventDefault();
    },
    [disabled, onChange, positionToValue]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      isDraggingRef.current = true;
      document.body.style.userSelect = 'none';

      // Update value based on initial touch position
      const touch = e.touches[0];
      const newValue = positionToValue(touch.clientX);
      setInternalValue(newValue);
      if (onChange) onChange(newValue);

      e.preventDefault();
    },
    [disabled, onChange, positionToValue]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = value;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(max, value + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(min, value - step);
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        default:
          return;
      }

      if (newValue !== value) {
        setInternalValue(newValue);
        if (onChange) onChange(newValue);
        e.preventDefault();
      }
    },
    [disabled, value, min, max, step, onChange]
  );

  // Effect to handle move and up events outside the component
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const newValue = positionToValue(e.clientX);
      setInternalValue(newValue);
      if (onChange) onChange(newValue);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;

      const touch = e.touches[0];
      const newValue = positionToValue(touch.clientX);
      setInternalValue(newValue);
      if (onChange) onChange(newValue);
    };

    const handleUp = () => {
      isDraggingRef.current = false;
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [onChange, positionToValue]);

  // Update internal value when prop value changes
  useEffect(() => {
    if (propValue !== undefined) {
      setInternalValue(propValue);
    }
  }, [propValue]);

  // Custom formatted value display
  const formattedValue =
    valueLabels && valueLabels[value] ? valueLabels[value] : formatValue(value);

  return (
    <div className={`w-full ${className}`}>
      {/* Slider label */}
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
        {showValue && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {formattedValue}
          </span>
        )}
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        className={`relative h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="presentation"
      >
        {/* Colored track */}
        <div
          className={`absolute h-full rounded-full ${trackColor}`}
          style={{ width: `${getPercentage()}%` }}
        />

        {/* Thumb */}
        <div
          ref={thumbRef}
          id={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-white border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-grab active:cursor-grabbing ${disabled ? 'cursor-not-allowed' : ''}`}
          style={{
            left: `${getPercentage()}%`,
            touchAction: 'none', // Prevent scrolling on touch devices
          }}
        >
          {thumbComponent}
        </div>
      </div>

      {/* Optional tick marks for values */}
      {valueLabels && (
        <div className="relative flex justify-between mt-2 px-1">
          {Object.entries(valueLabels).map(([valueStr, label]) => {
            const valueNum = parseFloat(valueStr);
            const position = ((valueNum - min) / (max - min)) * 100;
            return (
              <div
                key={valueStr}
                className="flex flex-col items-center"
                style={{
                  position: 'absolute',
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="h-1 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
