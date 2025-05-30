'use client';

import React, { useState } from 'react';
import Slider from '@/components/Slider';

export default function SliderTestPage() {
  const [basicValue, setBasicValue] = useState(50);
  const [rangeValue, setRangeValue] = useState(25);
  const [volumeValue, setVolumeValue] = useState(75);
  const [disabledValue] = useState(30);
  const [customValue, setCustomValue] = useState(2);

  // Example of custom value labels with proper typing
  const temperatureLabels: Record<number, string> = {
    0: 'Cold',
    25: 'Cool',
    50: 'Mild',
    75: 'Warm',
    100: 'Hot',
  };

  // Example of custom value formatting
  const formatCurrency = (value: number) => `$${value}`;

  // Format percentage with fixed decimal places
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Helper function to get temperature label safely
  const getTemperatureLabel = (value: number): string => {
    return temperatureLabels[value] || value.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Slider Component Test</h1>

      <div className="max-w-2xl mx-auto space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Basic Slider</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Slider value={basicValue} onChange={setBasicValue} label="Basic Slider" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Current value: {basicValue}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Range Slider with Steps</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Slider
              value={rangeValue}
              onChange={setRangeValue}
              min={0}
              max={100}
              step={5}
              label="Range Slider (step: 5)"
              formatValue={formatPercentage}
            />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Selected value: {rangeValue} (steps of 5)
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Volume Control</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Slider
              value={volumeValue}
              onChange={setVolumeValue}
              label="Volume"
              trackColor="bg-green-500"
              formatValue={value => `${value}%`}
            />
            <div className="mt-4 flex items-center">
              <svg
                className="w-5 h-5 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072M12 6a7.39 7.39 0 00-5.323 2.288 6.99 6.99 0 00-2.05 4.962 6.99 6.99 0 002.05 4.962A7.39 7.39 0 0012 18a7.39 7.39 0 005.323-2.288 6.99 6.99 0 002.05-4.962 6.99 6.99 0 00-2.05-4.962A7.39 7.39 0 0012 6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14a2 2 0 100-4 2 2 0 000 4z"
                />
              </svg>
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Volume set to {volumeValue}%
              </span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Disabled Slider</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Slider value={disabledValue} label="Disabled Slider" disabled={true} />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              This slider is disabled and cannot be adjusted
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Price Range Slider</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Slider
              min={10}
              max={200}
              step={10}
              value={customValue * 10}
              onChange={val => setCustomValue(val / 10)}
              label="Price Range"
              trackColor="bg-purple-500"
              formatValue={formatCurrency}
            />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Selected price: {formatCurrency(customValue * 10)}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Slider with Labels</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Slider
              value={basicValue}
              onChange={setBasicValue}
              label="Temperature"
              trackColor="bg-red-500"
              valueLabels={temperatureLabels}
            />
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              Current temperature setting: {getTemperatureLabel(basicValue)}
            </p>
          </div>
        </section>

        <section className="pb-8">
          <h2 className="text-2xl font-semibold mb-6">Accessibility Features</h2>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>All sliders are keyboard accessible (try using arrow keys, Home, and End)</li>
              <li>Proper ARIA attributes for screen readers</li>
              <li>Clear visual focus indicators</li>
              <li>Labels are properly associated with controls</li>
              <li>Custom value formatting for better comprehension</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
