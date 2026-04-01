import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  isOnline?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string; pixels: number }> = {
  xs: { container: "w-6 h-6", text: "text-[10px]", pixels: 24 },
  sm: { container: "w-8 h-8", text: "text-xs", pixels: 32 },
  md: { container: "w-10 h-10", text: "text-sm", pixels: 40 },
  lg: { container: "w-12 h-12", text: "text-base", pixels: 48 },
  xl: { container: "w-16 h-16", text: "text-lg", pixels: 64 },
  "2xl": { container: "w-24 h-24", text: "text-2xl", pixels: 96 },
};

const onlineSizeMap: Record<AvatarSize, string> = {
  xs: "w-1.5 h-1.5 bottom-0 right-0",
  sm: "w-2 h-2 bottom-0 right-0",
  md: "w-2.5 h-2.5 bottom-0.5 right-0.5",
  lg: "w-3 h-3 bottom-0.5 right-0.5",
  xl: "w-3.5 h-3.5 bottom-1 right-1",
  "2xl": "w-4 h-4 bottom-1 right-1",
};

export function Avatar({ name, src, size = "md", isOnline, className }: AvatarProps) {
  const { container, text, pixels } = sizeMap[size];
  const initials = getInitials(name);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <div
        className={cn(
          container,
          "rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-900 flex items-center justify-center"
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            width={pixels}
            height={pixels}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center font-semibold text-white",
              text
            )}
          >
            {initials}
          </div>
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute rounded-full border-2 border-white dark:border-gray-900",
            onlineSizeMap[size],
            isOnline ? "bg-green-400" : "bg-gray-400"
          )}
        />
      )}
    </div>
  );
}
