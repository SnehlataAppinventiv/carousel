"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ImageWithLoader({
  src,
  alt,
  className = "",
  width = 600,
  height = 800,
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  // Check if the image is an external URL or internal asset
  const isExternalImage = src.startsWith("http");

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
      ) : isExternalImage ? (
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
          loading="lazy"
          width={width}
          height={height}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          className={`${className} ${
            isLoading
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-300"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          width={width}
          height={height}
          quality={75}
        />
      )}
    </div>
  );
}
