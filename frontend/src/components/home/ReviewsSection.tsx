"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Марина Соколова",
    text: "Очень удобный сервис! Записалась к кардиологу за 2 минуты, пришло подтверждение сразу. Врач отличный, рецепт в личном кабинете — всё как обещали.",
    rating: 5,
    specialty: "Кардиология",
  },
  {
    name: "Александр Петров",
    text: "Наконец-то нашёл нормального невролога через этот сервис. Никаких очередей, всё онлайн. Рекомендую всем, кто ценит своё время.",
    rating: 5,
    specialty: "Неврология",
  },
  {
    name: "Лейла Ахмедова",
    text: "Записывала ребёнка к педиатру. Слоты удобно показаны, можно выбрать точное время. Врач внимательный, приём прошёл отлично. Спасибо!",
    rating: 5,
    specialty: "Педиатрия",
  },
  {
    name: "Дмитрий Козлов",
    text: "Использую MedBook уже полгода. Отличная альтернатива звонкам в регистратуру. Все мои записи и рецепты хранятся в одном месте.",
    rating: 4,
    specialty: "Терапевт",
  },
  {
    name: "Зарина Юсупова",
    text: "Профессиональный сервис. Особенно понравилось, что после приёма можно оставить отзыв и это реально влияет на рейтинг врача.",
    rating: 5,
    specialty: "Дерматология",
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
            Отзывы
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Что говорят пациенты
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
