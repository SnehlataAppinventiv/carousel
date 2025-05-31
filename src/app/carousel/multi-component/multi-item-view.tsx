"use client";

import React, { useState } from "react";
import Carousel from "@/components/Carousel";

interface CardProps {
  id: number;
  title: string;
  content: string;
  color: string;
}

export default function MultiItemCarouselExample() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [itemsToScroll, setItemsToScroll] = useState(1);
  const [itemGap, setItemGap] = useState(16);

  // Generate cards for the example
  const cards: CardProps[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Card ${i + 1}`,
    content: `This is card number ${i + 1} content`,
    color: getColorForIndex(i),
  }));

  // Function to get color based on index
  function getColorForIndex(index: number): string {
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
  }

  // Render a card
  const renderCard = (card: CardProps) => (
    <div
      key={card.id}
      className={`${card.color} rounded-lg shadow-md p-4 h-full flex flex-col justify-between`}
    >
      <div>
        <h3 className="font-bold text-white text-lg mb-2">{card.title}</h3>
        <p className="text-white/80">{card.content}</p>
      </div>
      <div className="mt-4 bg-white/20 text-white text-center py-1 px-2 rounded">
        Item #{card.id}
      </div>
    </div>
  );

  // Create array of card components
  const cardItems = cards.map(renderCard);

  // Calculate total number of "slides" based on itemsPerView
  const totalSlides = Math.max(1, cards.length - itemsPerView + 1);

  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Multi-Item Carousel</h2>

        <div className="mb-8">
          <div className="h-64 mb-4">
            <Carousel
              items={cardItems}
              onSlideChange={setActiveSlide}
              multiView={true}
              itemsPerView={itemsPerView}
              itemsToScroll={itemsToScroll}
              itemGap={itemGap}
              className="h-full"
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700 mb-2">
              Showing items {activeSlide + 1} to{" "}
              {Math.min(activeSlide + itemsPerView, cards.length)} of{" "}
              {cards.length}
            </p>
            <p className="text-gray-500 text-sm">
              Current slide: {activeSlide + 1} of {totalSlides}
            </p>
          </div>
        </div>

        {/* Controls for customizing the carousel */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-xl font-bold mb-4">Carousel Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Items Per View: {itemsPerView}
              </label>
              <input
                type="range"
                min="1"
                max="6"
                value={itemsPerView}
                onChange={(e) => setItemsPerView(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Items to Scroll: {itemsToScroll}
              </label>
              <input
                type="range"
                min="1"
                max={itemsPerView}
                value={itemsToScroll}
                onChange={(e) => setItemsToScroll(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
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
                onChange={(e) => setItemGap(parseInt(e.target.value))}
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

        {/* Explanation */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-bold mb-3 text-blue-800">
            About Multi-Item Carousel
          </h3>
          <p className="text-blue-700 mb-4">
            This example demonstrates a carousel that can display multiple items
            per view with configurable settings:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>
              <strong>Items Per View</strong>: Controls how many items are
              visible at once in the carousel.
            </li>
            <li>
              <strong>Items to Scroll</strong>: Determines how many items to
              scroll by when navigating (can't exceed Items Per View).
            </li>
            <li>
              <strong>Gap Between Items</strong>: Sets the spacing between items
              in pixels.
            </li>
            <li>
              <strong>Navigation Limits</strong>: The carousel prevents
              scrolling past the first or last item.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
