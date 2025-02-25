"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: React.ReactNode[];
}

export function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalItems = items.length;

  const nextItem = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  }, [totalItems]);

  const prevItem = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  }, [totalItems]);

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 flex justify-center px-4">
              {item}
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md z-10"
        onClick={prevItem}
        aria-label="Previous item"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md z-10"
        onClick={nextItem}
        aria-label="Next item"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}

