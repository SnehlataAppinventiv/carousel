"use client";

import React from "react";
import Link from "next/link";

export default function HomePage() {
  const examples = [
    {
      title: "Program Cards Carousel",
      description:
        "A carousel displaying TV program cards, similar to the screenshot example. Includes a circular carousel example that demonstrates smooth wrapping at the end.",
      path: "/carousel/example",
      tags: ["Images", "Cards", "Grid", "Circular"],
    },
    {
      title: "Mixed Content Carousel",
      description:
        "Demonstrates the carousel with different content types: images, videos, audio, and text.",
      path: "/carousel/mixed-content",
      tags: ["Images", "Video", "Audio", "Text"],
    },
    {
      title: "Multi-Component Carousel",
      description:
        "Shows how to combine multiple components within a single slide for rich layouts.",
      path: "/carousel/multi-component",
      tags: ["Layouts", "Mixed", "Complex"],
    },
    {
      title: "Touch Support Test",
      description:
        "Test and visualize the carousel's touch event handling for mobile devices.",
      path: "/carousel/touch-test",
      tags: ["Touch", "Mobile", "Testing"],
    },
    {
      title: "Basic Carousel",
      description: "The standard carousel implementation with simple examples.",
      path: "/carousel",
      tags: ["Basic", "Images"],
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">
            Carousel Component Examples
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Explore different implementations of the carousel component with
            various content types
          </p>

          <div className="grid gap-6">
            {examples.map((example, index) => (
              <Link key={index} href={example.path} className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg border border-gray-200">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {example.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{example.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {example.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <span className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors flex items-center">
                      View Example
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
