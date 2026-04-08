"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Marina Sokolova",
    text: "Juda qulay xizmat! 2 daqiqada kardiologga yozildim, tasdiq darhol keldi. Shifokor a'lo, retsept ham kabinetsda - hammasi va'da qilingandek.",
    rating: 5,
    specialty: "Kardiologiya",
  },
  {
    name: "Aleksandr Petrov",
    text: "Nihoyat shu xizmat orqali yaxshi nevrolog topdim. Navbat yo'q, hammasi onlayn. Vaqtini qadrlaydiganlarga tavsiya qilaman.",
    rating: 5,
    specialty: "Nevrologiya",
  },
  {
    name: "Leyla Axmedova",
    text: "Farzandimni pediatrga yozdim. Bo'sh vaqtlar juda qulay ko'rsatilgan, aniq vaqtni tanlash mumkin. Shifokor e'tiborli, qabul juda yaxshi o'tdi. Rahmat!",
    rating: 5,
    specialty: "Pediatriya",
  },
  {
    name: "Dmitriy Kozlov",
    text: "MedBook'dan yarim yildan beri foydalanaman. Registraturaga qo'ng'iroq qilishga zo'r alternativa. Barcha qabul va retseptlarim bir joyda saqlanadi.",
    rating: 4,
    specialty: "Terapevt",
  },
  {
    name: "Zarina Yusupova",
    text: "Professional xizmat. Ayniqsa qabuldan keyin fikr qoldirish mumkinligi va bu shifokor reytingiga haqiqatan ta'sir qilishi yoqdi.",
    rating: 5,
    specialty: "Dermatologiya",
  },
];

export function ReviewsSection() {
  const [current, setCurrent] = useState(0);
  const count = REVIEWS.length;

  const prev = () => setCurrent((c) => (c - 1 + count) % count);
  const next = () => setCurrent((c) => (c + 1) % count);

  const visible = [
    REVIEWS[(current - 1 + count) % count],
    REVIEWS[current],
    REVIEWS[(current + 1) % count],
  ];

  return (
    <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
            Fikrlar
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Bemorlar nimalar deydi
          </h2>
        </motion.div>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-6 mb-10">
          {visible.map((review, i) => (
            <motion.div
              key={`${current}-${i}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                i === 1
                  ? "bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-950/40 dark:to-teal-950/40 border-primary-200 dark:border-primary-800 shadow-lg"
                  : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800"
              }`}
            >
              <Quote
                size={28}
                className="text-primary-300 dark:text-primary-700 mb-3"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">
                {review.text}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {review.name}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400">
                    {review.specialty}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: single card */}
        <div className="md:hidden mb-8 px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            >
              <Quote size={24} className="text-primary-300 dark:text-primary-700 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {REVIEWS[current].text}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {REVIEWS[current].name}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400">
                    {REVIEWS[current].specialty}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: REVIEWS[current].rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all duration-150"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === current
                    ? "w-6 h-2 bg-primary-600"
                    : "w-2 h-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all duration-150"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
