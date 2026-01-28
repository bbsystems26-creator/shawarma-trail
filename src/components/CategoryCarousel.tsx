"use client";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Carousel from "./Carousel";
import PlaceCard from "./PlaceCard";

interface CategoryCarouselProps {
  tag: string;
  title: string;
  icon?: React.ReactNode;
}

export default function CategoryCarousel({ tag, title, icon }: CategoryCarouselProps) {
  const places = useQuery(api.places.listByTag, { tag });
  
  if (!places || places.length === 0) return null;
  
  return (
    <div className="max-w-7xl mx-auto px-4 mt-12">
      <Carousel title={title}>
        {places.map((place) => (
          <div key={place._id} className="snap-start shrink-0 w-[280px] sm:w-[300px]">
            <PlaceCard place={place} />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
