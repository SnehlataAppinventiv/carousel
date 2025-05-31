"use client";

import React, { useState } from "react";
import Carousel from "@/components/Carousel";
import ImageWithLoader from "@/components/Carousel/ImageWithLoader";
import CircularCarouselExample from "./circular-carousel";

// Define program type
interface Program {
  id: number;
  title: string;
  schedule: string;
  host: string;
  logo: string;
}

// Sample data for TV programs
const programs: Program[] = [
  {
    id: 1,
    title: "En Punto",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/3949ab/ffffff?text=Host+1",
    logo: "https://placehold.co/30x30/3949ab/ffffff?text=N+",
  },
  {
    id: 2,
    title: "Despierta",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/e91e63/ffffff?text=Host+2",
    logo: "https://placehold.co/30x30/e91e63/ffffff?text=N+",
  },
  {
    id: 3,
    title: "En Punto",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/3949ab/ffffff?text=Host+3",
    logo: "https://placehold.co/30x30/3949ab/ffffff?text=N+",
  },
  {
    id: 4,
    title: "Despierta",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/e91e63/ffffff?text=Host+4",
    logo: "https://placehold.co/30x30/e91e63/ffffff?text=N+",
  },
  {
    id: 5,
    title: "En Punto",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/3949ab/ffffff?text=Host+5",
    logo: "https://placehold.co/30x30/3949ab/ffffff?text=N+",
  },
  {
    id: 6,
    title: "Despierta",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/e91e63/ffffff?text=Host+6",
    logo: "https://placehold.co/30x30/e91e63/ffffff?text=N+",
  },
  {
    id: 7,
    title: "En Punto",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/3949ab/ffffff?text=Host+7",
    logo: "https://placehold.co/30x30/3949ab/ffffff?text=N+",
  },
  {
    id: 8,
    title: "Despierta",
    schedule: "Lunes a Viernes 22:30 CST",
    host: "https://placehold.co/300x400/e91e63/ffffff?text=Host+8",
    logo: "https://placehold.co/30x30/e91e63/ffffff?text=N+",
  },
];

// Create balanced program card groups (ensure all slides have the same number of cards)
const createProgramGroups = (
  programsArray: Program[],
  cardsPerGroup = 3
): Program[][] => {
  const groups: Program[][] = [];

  // Calculate total number of slides needed
  const totalSlides = Math.ceil(programsArray.length / cardsPerGroup);

  for (let i = 0; i < totalSlides; i++) {
    // For each slide, take the next cardsPerGroup items
    const startIdx = i * cardsPerGroup;
    const endIdx = startIdx + cardsPerGroup;

    // For the last slide, if we don't have enough cards, wrap around to the beginning
    let slideCards = programsArray.slice(startIdx, endIdx);

    // If this is the last slide and we don't have enough cards, borrow from the beginning
    if (i === totalSlides - 1 && slideCards.length < cardsPerGroup) {
      const remaining = cardsPerGroup - slideCards.length;
      const borrowedCards = programsArray.slice(0, remaining);
      slideCards = [...slideCards, ...borrowedCards];
    }

    groups.push(slideCards);
  }

  return groups;
};

export default function ProgramsCarouselExample() {
  const [activeSlide, setActiveSlide] = useState(0);
  const programGroups = createProgramGroups(programs);

  // Create slides for each group of programs
  const programSlides = programGroups.map((group, groupIndex) => (
    <div
      key={groupIndex}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full"
    >
      {group.map((program) => (
        <div key={program.id} className="p-2">
          <div className="flex flex-col">
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* Logo in top-left corner */}
              <div className="absolute top-2 left-2 z-10">
                <img
                  src={program.logo}
                  alt="Channel logo"
                  className="w-6 h-6"
                />
              </div>

              <ImageWithLoader
                src={program.host}
                alt={`Host of ${program.title}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2">
              <h3 className="text-xl font-bold">{program.title}</h3>
              <p className="text-sm text-gray-600">{program.schedule}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ));

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h1 className="text-5xl font-bold uppercase mb-8">PROGRAMAS</h1>

          {/* Filter buttons */}
          <div className="flex gap-2 mb-6">
            <button className="px-3 py-1 bg-gray-200 rounded-full text-gray-800 text-sm font-medium border border-gray-300">
              N+
            </button>
            <button className="px-3 py-1 bg-white rounded-full text-gray-800 text-sm font-medium border border-gray-300">
              N+ Foro
            </button>
            <button className="px-3 py-1 bg-white rounded-full text-gray-800 text-sm font-medium border border-gray-300">
              N+ Local
            </button>
          </div>

          {/* Programs carousel */}
          <div className="relative">
            <Carousel
              items={programSlides}
              showDots={false}
              onSlideChange={setActiveSlide}
              className="h-auto"
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              This carousel wraps cards from the beginning when the last slide
              doesn't have enough cards to fill a complete row, ensuring
              consistent layout across all slides.
            </p>
          </div>

          <div className="flex justify-start mt-4">
            <button className="text-sm text-gray-600 flex items-center gap-1">
              Más programas
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Include the circular carousel example */}
        <CircularCarouselExample />
      </div>
    </div>
  );
}
