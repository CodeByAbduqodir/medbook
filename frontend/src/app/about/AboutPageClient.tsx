"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  Users,
  Star,
  Clock3,
  HeartPulse,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const stats = [
  { value: "2 min", label: "o'rtacha yozilish vaqti", icon: Clock3 },
  { value: "24/7", label: "platforma mavjudligi", icon: ShieldCheck },
  { value: "3 rol", label: "patient, doctor, admin", icon: Users },
];

const benefits = [
  {
    icon: HeartPulse,
    title: "Bemorlar uchun",
    description:
      "Shifokor topish, bo'sh vaqtni ko'rish, yozilish va tashxislarni bir joyda kuzatish.",
  },
  {
    icon: Stethoscope,
    title: "Shifokorlar uchun",
    description:
      "Qabul jadvali, bemorlar ro'yxati, qabul statuslari va retseptlar ustidan tartibli nazorat.",
  },
  {
    icon: CheckCircle2,
    title: "Administratorlar uchun",
    description:
      "Foydalanuvchilar, mutaxassisliklar va tizim ma'lumotlarini Orchid panelda boshqarish.",
  },
];

const steps = [
  {
    number: "01",
    title: "Shifokorni toping",
    description:
      "Filtrlar, reyting va mutaxassislik bo'yicha sizga mos shifokorni tanlang.",
    icon: Users,
  },
  {
    number: "02",
    title: "Bo'sh vaqtni tanlang",
    description:
      "Jadvaldagi mavjud slotlarni ko'ring va sizga qulay vaqtga yoziling.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Qabulni kuzating",
    description:
      "Tasdiq, tashxis va retseptlar kabinetda saqlanadi, hammasi bir joyda.",
    icon: Star,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

export function AboutPageClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      <main className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 hero-bg pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-32 -right-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <section className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-xl"
              >
                <motion.div variants={itemVariants}>
                  <Badge variant="primary" className="mb-5 px-3 py-1">
                    MedBook haqida
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl font-display font-bold leading-tight text-gray-900 dark:text-white"
                >
                  Tibbiy yozilishni bitta, oddiy va ishonchli joyga jamladik.
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="mt-5 text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  MedBook bemorlar, shifokorlar va administratorlar uchun qulay
                  digital oqim yaratadi: yozilish, jadval, tasdiq, tashxis va
                  retseptlar endi tartibli va tushunarli.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex flex-col sm:flex-row gap-3"
                >
                  <Link href="/doctors">
                    <Button variant="gradient" size="lg" rightIcon={<ArrowRight size={18} />}>
                      Shifokor topish
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="lg">
                      Ro'yxatdan o'tish
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3"
                >
                  {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <Card key={stat.label} variant="glass" padding="md" className="text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-300">
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {stat.value}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {stat.label}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="relative"
              >
                <Card variant="gradient" padding="lg" className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.14),transparent_35%)]" />
                  <div className="relative grid gap-4">
                    <div className="rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-white/40 dark:border-gray-700/40 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Bugungi qabul</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            14 bemor
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-300 flex items-center justify-center">
                          <CheckCircle2 size={20} />
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-primary-500 to-teal-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card variant="glass" padding="md" className="border-white/30 dark:border-gray-700/40">
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                          Tasdiqlangan
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                          92%
                        </p>
                      </Card>
                      <Card variant="glass" padding="md" className="border-white/30 dark:border-gray-700/40">
                        <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
                          O'rtacha reyting
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                          4.9
                        </p>
                      </Card>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="relative py-12 lg:py-20 bg-gray-50 dark:bg-gray-900/60 border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mb-10"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
                Nega MedBook
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                Har bir rol uchun alohida foyda, bitta mahsulot ichida.
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <motion.div key={benefit.title} variants={itemVariants}>
                    <Card variant="interactive" padding="lg" className="h-full">
                      <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center text-primary-600 dark:text-primary-300 mb-5">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                        {benefit.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="relative py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mb-10"
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                Qanday ishlaydi
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                Yozilish jarayoni atigi uch qadamda.
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <motion.div key={step.number} variants={itemVariants}>
                    <Card variant="default" padding="lg" className="h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-primary text-white flex items-center justify-center shadow-sm">
                          <Icon size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-300 dark:text-gray-700">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        <section className="relative py-12 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card variant="gradient" padding="lg" className="relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_35%)]" />
              <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge variant="teal" className="mb-4">
                    MedBook bilan boshlang
                  </Badge>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
                    Bugunoq o'zingizga qulay shifokorni toping.
                  </h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                    Qidiruvdan yozilishga, qabuldan retseptgacha bo'lgan jarayonni
                    soddalashtirdik. Endi sizga faqat mos mutaxassis va qulay vaqtni
                    tanlash qoladi.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
                  <Link href="/doctors">
                    <Button variant="gradient" size="lg" rightIcon={<ArrowRight size={18} />}>
                      Shifokorlar ro'yxati
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="lg">
                      Akkaunt yaratish
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
