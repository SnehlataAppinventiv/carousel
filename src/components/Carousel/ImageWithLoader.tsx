"use client";

import React, { useState } from "react";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImageWithLoader({
  src,
  alt,
  className = "",
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <span>Failed to load image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${
            isLoading
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-300"
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
