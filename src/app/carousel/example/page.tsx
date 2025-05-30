"use client";

import React, { useState } from "react";
import Carousel from "@/components/Carousel";
import ImageWithLoader from "@/components/Carousel/ImageWithLoader";

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

// Create program card groups (4 cards per slide)
const createProgramGroups = (
  programsArray: Program[],
  cardsPerGroup = 3
): Program[][] => {
  const groups: Program[][] = [];
  for (let i = 0; i < programsArray.length; i += cardsPerGroup) {
    groups.push(programsArray.slice(i, i + cardsPerGroup));
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
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${programGroups.length} gap-4 w-full`}
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
        <div className="mb-10">
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
        </div>

        <div className="flex justify-start">
          <button className="text-sm text-gray-600 flex items-center gap-1">
            Más programas
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
