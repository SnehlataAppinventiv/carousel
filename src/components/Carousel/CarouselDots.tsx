interface CarouselDotsProps {
  itemCount: number;
  activeIndex: number;
  onDotClick: (index: number) => void;
}

export default function CarouselDots({ itemCount, activeIndex, onDotClick }: CarouselDotsProps) {
  return (
    <div className="absolute bottom-4 left-0 right-0">
      <div className="flex justify-center gap-2">
        {Array.from({ length: itemCount }).map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              activeIndex === index
                ? 'bg-blue-600 dark:bg-blue-500'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            onClick={() => onDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
}
