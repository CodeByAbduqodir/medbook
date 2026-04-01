"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star, ShieldCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const FLOATING_DOCTORS = [
  { name: "Алия Иманова", specialty: "Кардиолог", rating: 4.9, exp: 12 },
  { name: "Рустам Каримов", specialty: "Невролог", rating: 4.8, exp: 8 },
  { name: "Нилуфар Ходжаева", specialty: "Терапевт", rating: 4.7, exp: 15 },
];

const PLACEHOLDERS = ["Кардиолога...", "Невролога...", "Педиатра...", "Дерматолога..."];

function useTypewriter(words: string[]) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = words[idx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < target.length) {
      timeout = setTimeout(() => setText(target.slice(0, text.length + 1)), 80);
    } else if (!deleting && text.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return text;
}

export function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const placeholder = useTypewriter(PLACEHOLDERS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/doctors${search ? `?search=${encodeURIComponent(search)}` : ""}`);
  };

  return (
    <section className="relative min-h-[calc(100vh-0px)] flex items-center pt-20 pb-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-bg" />

      {/* Blobs */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 dark:opacity-10 animate-blob"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.24 250) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 dark:opacity-10 animate-blob-delayed"
        style={{
          background:
            "radial-gradient(circle, oklch(0.60 0.18 185) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left: content */}
        <div className="max-w-xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            Онлайн-запись к врачу — быстро и удобно
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-display font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white mb-5"
          >
            Ваше здоровье —{" "}
            <span className="text-gradient-primary">наш приоритет</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed"
          >
            Запишитесь к лучшим специалистам за 2 минуты.
            Онлайн-расписание, мгновенное подтверждение, рецепты в кабинете.
          </motion.p>

          {/* Search form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="flex gap-2.5 mb-8"
          >
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Найти ${placeholder}|`}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm text-base transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="h-14 px-7 rounded-2xl shadow-md hover:shadow-xl shrink-0"
              rightIcon={<ArrowRight size={18} />}
            >
              Найти
            </Button>
          </motion.form>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { icon: <Users size={16} className="text-primary-500" />, num: "1000+", label: "пациентов" },
              { icon: <Star size={16} className="text-amber-500 fill-amber-500" />, num: "4.9", label: "средний рейтинг" },
              { icon: <ShieldCheck size={16} className="text-teal-500" />, num: "50+", label: "врачей" },
            ].map(({ icon, num, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                {icon}
                <span>
                  <strong className="text-gray-900 dark:text-white font-semibold">{num}</strong>{" "}
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: floating doctor cards */}
        <div className="hidden lg:block relative h-[520px]">
          {/* Center glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-500/15 to-teal-500/15 blur-3xl" />
          </div>

          {FLOATING_DOCTORS.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
              className={cn(
                "absolute glass rounded-2xl p-4 card-shadow w-60",
                i === 0 && "top-12 right-4 animate-float",
                i === 1 && "top-1/2 -translate-y-1/2 left-8 animate-float-delayed",
                i === 2 && "bottom-12 right-16 animate-float-slow"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar name={doc.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                    {doc.specialty}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {doc.rating}
                    </span>
                    <span className="text-xs text-gray-400">· {doc.exp} лет</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Свободные слоты сегодня</span>
                <span className="text-xs font-semibold text-green-500">●&nbsp;Доступен</span>
              </div>
            </motion.div>
          ))}

          {/* Decorative mini cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute top-6 left-24 glass rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-sm"
          >
            <span className="text-xs">✅</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Запись подтверждена
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="absolute bottom-28 left-4 glass rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-sm"
          >
            <span className="text-xs">⭐</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Новый отзыв 5.0
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          className="w-full h-12 fill-gray-50 dark:fill-gray-900"
        >
          <path d="M0,48 C480,0 960,0 1440,48 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}
