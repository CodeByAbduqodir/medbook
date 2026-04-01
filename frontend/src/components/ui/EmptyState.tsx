import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {icon ? (
        <div className="mb-5 w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      ) : (
        <div className="mb-5">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            className="text-gray-300 dark:text-gray-700"
          >
            <rect
              x="8"
              y="16"
              width="48"
              height="36"
              rx="6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M8 24h48"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
            <circle cx="28" cy="20" r="2" fill="currentColor" />
            <circle cx="36" cy="20" r="2" fill="currentColor" />
            <path
              d="M20 36h24M20 44h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
