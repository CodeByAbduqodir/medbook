"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showValue = false,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const starSize = sizeMap[size];
  const displayValue = hovered || value;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn(
            "transition-all duration-150",
            !readonly && "hover:scale-125 active:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
        >
          <Star
            size={starSize}
            className={cn(
              "transition-colors duration-150",
              star <= displayValue
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
            )}
          />
        </button>
      ))}
      {showValue && value > 0 && (
        <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
