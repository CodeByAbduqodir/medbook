"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: <Search size={28} />,
    color: "from-primary-500 to-primary-600",
    glow: "shadow-primary-500/30",
    step: "01",
    title: "Shifokor toping",
    description:
      "Mutaxassisni yo'nalish, reyting va fikrlar bo'yicha tanlang. Qulay filtrlar mos shifokorni tez topishga yordam beradi.",
  },
  {
    icon: <CalendarCheck size={28} />,
    color: "from-teal-500 to-teal-600",
    glow: "shadow-teal-500/30",
    step: "02",
    title: "Vaqtni tanlang",
    description:
      "Shifokor jadvalidagi bo'sh vaqtlarni ko'ring va o'zingizga qulay vaqtni tanlang. Navbat va qo'ng'iroqlarsiz.",
  },
  {
    icon: <CheckCircle2 size={28} />,
    color: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/30",
    step: "03",
    title: "Siz yozildingiz!",
    description:
      "Qabulingiz darhol tasdiqlanadi. Ko'rikdan so'ng retsept va tashxis shaxsiy kabinetingizda paydo bo'ladi.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
            Qanday ishlaydi
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
            Uchta oddiy qadam
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Shifokorga yozilish ikki daqiqadan kam vaqt oladi
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary-300 via-teal-300 to-green-300 dark:from-primary-700 dark:via-teal-700 dark:to-green-700" />

          {STEPS.map((step) => (
            <motion.div
              key={step.step}
              variants={itemVariants}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Icon bubble */}
              <div
                className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl ${step.glow} mb-6 group-hover:scale-105 transition-transform duration-300`}
              >
                {step.icon}
                {/* Step number */}
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-sm">
                  {step.step}
                </span>
              </div>

              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
