import React from "react";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/utils";

type BadgeVariant = "default" | "primary" | "teal" | "success" | "warning" | "danger";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
  primary: "bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300",
  teal: "bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300",
  success: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300",
  warning: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
  danger: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = getStatusColor(status);
  const label = getStatusLabel(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse-slow", colors.dot)} />
      {label}
    </span>
  );
}
