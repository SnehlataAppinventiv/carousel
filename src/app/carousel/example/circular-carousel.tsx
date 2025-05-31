"use client";

import React, { useState, useCallback } from "react";
import Carousel from "@/components/Carousel";
import ImageWithLoader from "@/components/Carousel/ImageWithLoader";

interface CardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  color: string;
}

// Sample data for cards
const cards: CardProps[] = [
  {
    id: 1,
    title: "Card One",
    description: "First card description",
    image: "https://placehold.co/300x400/3949ab/ffffff?text=Card+1",
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Card Two",
    description: "Second card description",
    image: "https://placehold.co/300x400/e91e63/ffffff?text=Card+2",
    color: "bg-pink-600",
  },
  {
    id: 3,
    title: "Card Three",
    description: "Third card description",
    image: "https://placehold.co/300x400/4caf50/ffffff?text=Card+3",
    color: "bg-green-600",
  },
  {
    id: 4,
    title: "Card Four",
    description: "Fourth card description",
    image: "https://placehold.co/300x400/ff9800/ffffff?text=Card+4",
    color: "bg-orange-600",
  },
  {
    id: 5,
    title: "Card Five",
    description: "Fifth card description",
    image: "https://placehold.co/300x400/9c27b0/ffffff?text=Card+5",
    color: "bg-purple-600",
  },
];

// Create circular groups of cards
const createCircularGroups = (
  cardsArray: CardProps[],
  cardsPerGroup = 3
): CardProps[][] => {
  const groups: CardProps[][] = [];

  // To ensure circular behavior, we duplicate some cards at the end and beginning
  // This creates a smooth transition when scrolling past the end
  const extendedCards = [
    ...cardsArray.slice(cardsArray.length - cardsPerGroup), // Add last cards to beginning
    ...cardsArray, // Original cards
    ...cardsArray.slice(0, cardsPerGroup), // Add first cards to end
  ];

  // Create the groups
  for (let i = 0; i < extendedCards.length - cardsPerGroup + 1; i++) {
    const group = extendedCards.slice(i, i + cardsPerGroup);
    groups.push(group);
  }

  return groups;
};

export default function CircularCarouselExample() {
  const [activeSlide, setActiveSlide] = useState(0);
  const cardsPerGroup = 3;
  const cardGroups = createCircularGroups(cards, cardsPerGroup);

  // Handle slide change with circular logic
  const handleSlideChange = useCallback(
    (index: number) => {
      setActiveSlide(index);

      // Handle wrap-around by updating the index without animation
      // This creates an illusion of infinite scrolling
      if (index === 0) {
        // If at first duplicated slide, jump to the real last slide
        setTimeout(() => {
          setActiveSlide(cardGroups.length - 2);
        }, 300);
      } else if (index === cardGroups.length - 1) {
        // If at last duplicated slide, jump to the real first slide
        setTimeout(() => {
          setActiveSlide(1);
        }, 300);
      }
    },
    [cardGroups.length]
  );

  // Render a card
  const renderCard = (card: CardProps) => (
    <div key={card.id} className="p-3">
      <div
        className={`rounded-lg overflow-hidden shadow-lg h-full flex flex-col`}
      >
        <div className="relative aspect-[3/4]">
          <ImageWithLoader
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute top-0 left-0 right-0 ${card.color} py-1 px-2 text-white text-sm font-bold`}
          >
            Card #{card.id}
          </div>
        </div>
        <div className="p-4 bg-white flex-1">
          <h3 className="text-xl font-bold mb-2">{card.title}</h3>
          <p className="text-gray-600">{card.description}</p>
        </div>
      </div>
    </div>
  );

  // Create carousel slides
  const carouselSlides = cardGroups.map((group, groupIndex) => (
    <div
      key={groupIndex}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full"
    >
      {group.map(renderCard)}
    </div>
  ));

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Circular Carousel</h2>
        <p className="text-gray-600 mb-6">
          This carousel wraps around smoothly when you reach the end, creating
          an infinite scrolling effect.
        </p>

        <div className="relative">
          <Carousel
            items={carouselSlides}
            showDots={true}
            onSlideChange={handleSlideChange}
            className="bg-white p-4 rounded-lg shadow-md"
          />
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow border border-gray-100">
          <h3 className="font-medium text-lg mb-2">How it works:</h3>
          <p className="text-gray-600 mb-2">
            1. We duplicate the first and last sets of cards to create a
            seamless transition.
          </p>
          <p className="text-gray-600 mb-2">
            2. When you reach the duplicated set, we instantly jump to the
            corresponding original set.
          </p>
          <p className="text-gray-600">
            3. This creates the illusion of infinite scrolling while maintaining
            the proper number of cards per slide.
          </p>
        </div>
      </div>
    </div>
  );
}
