"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, Brain, Eye, Sun, Baby, Stethoscope, Scissors, Smile, Bone, Wind, ArrowRight } from "lucide-react";
import { useSpecializations } from "@/hooks/useDoctors";
import { cn } from "@/lib/utils";

const FALLBACK_SPECS = [
  { id: 1, name: "Terapevt", icon: <Stethoscope size={24} />, color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { id: 2, name: "Kardiolog", icon: <Heart size={24} />, color: "from-red-500 to-rose-600", bg: "bg-red-50 dark:bg-red-950/40" },
  { id: 3, name: "Nevrolog", icon: <Brain size={24} />, color: "from-purple-500 to-purple-600", bg: "bg-purple-50 dark:bg-purple-950/40" },
  { id: 4, name: "Pediatr", icon: <Baby size={24} />, color: "from-pink-500 to-pink-600", bg: "bg-pink-50 dark:bg-pink-950/40" },
  { id: 5, name: "Oftalmolog", icon: <Eye size={24} />, color: "from-teal-500 to-teal-600", bg: "bg-teal-50 dark:bg-teal-950/40" },
  { id: 6, name: "Dermatolog", icon: <Sun size={24} />, color: "from-amber-500 to-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
  { id: 7, name: "Jarroh", icon: <Scissors size={24} />, color: "from-gray-600 to-gray-700", bg: "bg-gray-100 dark:bg-gray-800/60" },
  { id: 8, name: "Stomatolog", icon: <Smile size={24} />, color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/40" },
  { id: 9, name: "Ortoped", icon: <Bone size={24} />, color: "from-orange-500 to-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40" },
  { id: 10, name: "Pulmonolog", icon: <Wind size={24} />, color: "from-sky-500 to-sky-600", bg: "bg-sky-50 dark:bg-sky-950/40" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

export function SpecializationsSection() {
  const router = useRouter();
  const { data: apiSpecs } = useSpecializations();

  // Map API specs to display items (use icons from fallback for visual matching)
  const specs = apiSpecs && apiSpecs.length > 0
    ? apiSpecs.slice(0, 10).map((s, i) => ({
        ...FALLBACK_SPECS[i % FALLBACK_SPECS.length],
        id: s.id,
        name: s.name,
      }))
    : FALLBACK_SPECS;

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
              Mutaxassisliklar
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Kerakli mutaxassisni toping
            </h2>
          </div>
          <button
            onClick={() => router.push("/doctors")}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            Barcha mutaxassisliklar <ArrowRight size={15} />
          </button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {specs.map((spec) => (
            <motion.button
              key={spec.id}
              variants={itemVariants}
              onClick={() => router.push(`/doctors?specialization_id=${spec.id}`)}
              className={cn(
                "group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300",
                spec.bg,
                "hover:scale-[1.04] hover:shadow-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
              )}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${spec.color} flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow`}
              >
                {spec.icon}
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-center leading-tight">
                {spec.name}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
