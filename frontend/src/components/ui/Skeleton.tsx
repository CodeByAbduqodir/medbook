import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className, rounded = "md", ...props }: SkeletonProps) {
  const roundedMap = { sm: "rounded", md: "rounded-lg", lg: "rounded-2xl", full: "rounded-full" };
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] animate-shimmer",
        roundedMap[rounded],
        className
      )}
      {...props}
    />
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 card-shadow">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16" rounded="full" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-9 flex-1" rounded="lg" />
        <Skeleton className="h-9 flex-1" rounded="lg" />
      </div>
    </div>
  );
}

export function AppointmentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 card-shadow flex gap-4">
      <Skeleton className="w-12 h-12" rounded="full" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="w-20 h-6" rounded="full" />
    </div>
  );
}
