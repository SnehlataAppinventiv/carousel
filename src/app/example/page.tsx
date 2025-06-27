"use client";
import Carousel from "@/components/Carousel";
import Image from "next/image";
import { memo, useMemo } from "react";
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
interface CardProps {
  id: number;
  title: string;
  content: string;
  color?: string;
}

// Memoized card component to prevent unnecessary re-renders
const Card = memo(({ id, title, content }: CardProps) => (
  <div
    className={`${
      colors[id % colors.length]
    } size-fit shadow-md p-4 flex flex-col justify-between`}
  >
    <div>
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-white/80">{content}</p>
    </div>
    <Image
      src={id % 2 ? "/images/img1.png" : "/images/img2.png"}
      alt="img1"
      width={309}
      height={550}
    />
    <div className="mt-4 bg-white/20 text-white text-center py-1 px-2 rounded">
      Item #{id}
    </div>
  </div>
));

Card.displayName = "Card";

export default function Example() {
  // Generate cards for the example - memoize to prevent recreating on every render
  const cards = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Card ${i + 1}`,
        content: `This is card number ${i + 1} content`,
      })),
    []
  );
  // Create array of card components - memoize to prevent recreating on every render
  const cardItems = useMemo(
    () => cards.map((card) => <Card key={card.id} {...card} />),
    [cards]
  );
  return (
    <Carousel
      items={cardItems}
      autoPlayInterval={4000}
      showArrows={true}
      showDots={true}
      onSlideChange={(index) => console.log(index)}
      itemsPerView={5}
      itemsToScroll={1}
      itemGap={2}
      multiView={true}
      responsive={[
        {
          breakpoint: 640,
          itemsPerView: 3,
          itemsToScroll: 1,
        },
        {
          breakpoint: 1024,
          itemsPerView: 4,
          itemsToScroll: 1,
        },
        {
          breakpoint: 2055,
          itemsPerView: 5,
          itemsToScroll: 1,
        },
      ]}
    />
  );
}
