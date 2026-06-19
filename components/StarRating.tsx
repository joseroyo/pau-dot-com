"use client";

import { useState } from "react";

type StarRatingProps = {
  value: number;
  onChange: (newRating: number) => void;
};

function getStarState(starNumber: number, rating: number): "empty" | "half" | "full" {
  if (rating >= starNumber) return "full";
  if (rating >= starNumber - 0.5) return "half";
  return "empty";
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const displayValue = hovered > 0 ? hovered : value;

  function handleMouseMove(
    e: React.MouseEvent<HTMLButtonElement>,
    starNumber: number
  ) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHovered(isLeftHalf ? starNumber - 0.5 : starNumber);
  }

  function handleClick(
    e: React.MouseEvent<HTMLButtonElement>,
    starNumber: number
  ) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    const newRating = isLeftHalf ? starNumber - 0.5 : starNumber;

    onChange(newRating === value ? 0 : newRating);
  }

  return (
    <div
      className="flex gap-1 mb-2"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((starNumber) => {
        const state = getStarState(starNumber, displayValue);

        return (
          <button
            key={starNumber}
            type="button"
            onMouseMove={(e) => handleMouseMove(e, starNumber)}
            onClick={(e) => handleClick(e, starNumber)}
            className="relative text-[40px] leading-none cursor-pointer"
            aria-label={`Rate ${starNumber} out of 5`}
          >
            <span className="text-lowlight">★</span>
            <span
              className="absolute top-0 left-0 text-primary overflow-hidden"
              style={{
                width: state === "full" ? "100%" : state === "half" ? "50%" : "0%",
              }}
            >
              ★
            </span>
          </button>
        );
      })}
    </div>
  );
}