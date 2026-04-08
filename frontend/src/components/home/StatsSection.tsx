"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Star, Stethoscope, Clock } from "lucide-react";

interface StatItem {
  icon: React.ReactNode;
  end: number;
  suffix: string;
  label: string;
  color: string;
}

const STATS: StatItem[] = [
  { icon: <Users size={28} />, end: 1240, suffix: "+", label: "Rozi bemorlar", color: "text-primary-600 dark:text-primary-400" },
  { icon: <Stethoscope size={28} />, end: 54, suffix: "+", label: "Mutaxassis shifokorlar", color: "text-teal-600 dark:text-teal-400" },
  { icon: <Star size={28} />, end: 4.9, suffix: "", label: "O'rtacha reyting", color: "text-amber-500" },
  { icon: <Clock size={28} />, end: 2, suffix: " daqiqa", label: "Yozilish vaqti", color: "text-green-600 dark:text-green-400" },
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    const isFloat = end % 1 !== 0;
    const duration = 1800;
    const steps = 60;
    const stepValue = end / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + stepValue, end);
      setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.round(current));
      if (current >= end) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [inView, end]);

  const display = end % 1 !== 0 ? count.toFixed(1) : count.toString();

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 relative overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 tabular-nums">
                <CountUp end={stat.end} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-white/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
