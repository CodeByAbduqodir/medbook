"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Yorug' mavzuga o'tish" : "Qorong'i mavzuga o'tish"}
      className={cn(
        "relative inline-flex h-11 w-[4.75rem] items-center rounded-full border p-1 transition-all duration-300 overflow-hidden",
        "border-gray-200 bg-gray-100 shadow-sm",
        "dark:border-gray-700 dark:bg-gray-800",
        "hover:border-primary-300 hover:shadow-md dark:hover:border-gray-500",
        className
      )}
    >
      <span
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isDark
            ? "bg-gradient-to-r from-gray-800 to-gray-900 opacity-100"
            : "bg-gradient-to-r from-white to-gray-100 opacity-100"
        )}
      />

      <motion.span
        layout
        className={cn(
          "absolute top-1 left-1 flex h-9 w-9 items-center justify-center rounded-full shadow-lg",
          "bg-white text-primary-600 dark:bg-gray-950 dark:text-amber-400"
        )}
        animate={{ x: isDark ? 36 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={16} />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
