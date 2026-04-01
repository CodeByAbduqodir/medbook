"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Briefcase, ArrowRight, Calendar } from "lucide-react";
import { useDoctors } from "@/hooks/useDoctors";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { DoctorCardSkeleton } from "@/components/ui/Skeleton";
import { pluralize } from "@/lib/utils";
import type { Doctor } from "@/lib/types";

function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const profile = doctor.doctor_profile;
  const spec = profile?.specialization ?? doctor.specialization;
  const rating = Number(profile?.rating_avg ?? doctor.rating_avg ?? 0);
  const exp = Number(profile?.experience_years ?? doctor.experience_years ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white dark:bg-gray-900 rounded-2xl p-6 card-shadow hover:card-shadow-hover hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col"
    >
      {/* Top row */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar name={doctor.name} size="xl" src={doctor.profile?.avatar_url} />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white text-base leading-tight mb-0.5">
            {doctor.name}
          </h3>
          <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">
            {spec?.name ?? "Специалист"}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {rating > 0 ? rating.toFixed(1) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Briefcase size={14} className="text-gray-400" />
        <span>{pluralize(exp, "год опыта", "года опыта", "лет опыта")}</span>
      </div>

      {/* Bio */}
      {(doctor.bio ?? profile?.bio) && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {doctor.bio ?? profile?.bio}
        </p>
      )}

      {/* Action */}
      <Link href={`/doctors/${doctor.id}`}>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          leftIcon={<Calendar size={14} />}
          className="group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300"
        >
          Записаться
        </Button>
      </Link>
    </motion.div>
  );
}

export function TopDoctorsSection() {
  const { data: doctors, isLoading } = useDoctors({ page: 1 });
  const topDoctors = doctors?.slice(0, 6) ?? [];

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
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
              Наши врачи
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
              Лучшие специалисты
            </h2>
          </div>
          <Link href="/doctors">
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ArrowRight size={14} />}
            >
              Все врачи
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topDoctors.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
