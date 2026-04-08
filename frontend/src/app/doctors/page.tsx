"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search, Star, Briefcase, Calendar, SlidersHorizontal, X,
} from "lucide-react";
import { useDoctors, useSpecializations } from "@/hooks/useDoctors";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DoctorCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { pluralize, formatRating } from "@/lib/utils";
import type { Doctor } from "@/lib/types";

function DoctorCard({ doctor, index }: { doctor: Doctor; index: number }) {
  const profile = doctor.doctor_profile;
  const spec = profile?.specialization ?? doctor.specialization;
  const rating = Number(profile?.rating_avg ?? doctor.rating_avg ?? 0);
  const exp = Number(profile?.experience_years ?? doctor.experience_years ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group bg-white dark:bg-gray-900 rounded-2xl p-6 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col"
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar
          name={doctor.name}
          src={doctor.profile?.avatar_url}
          size="xl"
          isOnline={Math.random() > 0.4}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white text-base leading-tight mb-1">
            {doctor.name}
          </h3>
          {spec && (
            <Badge variant="teal" className="text-xs mb-2">
              {spec.name}
            </Badge>
          )}
          <div className="flex items-center gap-1.5">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {rating > 0 ? formatRating(rating) : "—"}
            </span>
              <span className="text-xs text-gray-400">reyting</span>
            </div>
          </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <Briefcase size={13} className="text-gray-400 shrink-0" />
        <span>{pluralize(exp, "yil tajriba", "yil tajriba", "yil tajriba")}</span>
      </div>

      {(doctor.bio ?? profile?.bio) && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">
          {doctor.bio ?? profile?.bio}
        </p>
      )}

      <Link href={`/doctors/${doctor.id}`} className="mt-auto">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          leftIcon={<Calendar size={14} />}
          className="group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-300"
        >
          Yozilish
        </Button>
      </Link>
    </motion.div>
  );
}

function DoctorsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [specId, setSpecId] = useState<number | null>(
    searchParams.get("specialization_id") ? Number(searchParams.get("specialization_id")) : null
  );
  const [ratingMin, setRatingMin] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data: specializations } = useSpecializations();
  const { data: doctors, isLoading } = useDoctors({
    search: search || undefined,
    specialization_id: specId ?? undefined,
    rating_min: ratingMin ?? undefined,
  });

  const specOptions = [
    { value: "", label: "Barcha mutaxassisliklar" },
    ...(specializations ?? []).map((s) => ({ value: s.id, label: s.name })),
  ];

  const ratingOptions = [
    { value: "", label: "Istalgan reyting" },
    { value: 4, label: "4.0+" },
    { value: 4.5, label: "4.5+" },
    { value: 4.8, label: "4.8+" },
  ];

  const hasFilters = !!specId || !!ratingMin || !!search;
  const resetFilters = () => { setSearch(""); setSpecId(null); setRatingMin(null); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Page header */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
              Shifokor toping
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {doctors ? `${doctors.length} mutaxassis` : "Mutaxassislar qidirilmoqda..."}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter bar */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism bo'yicha qidirish..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>

          <div className="w-52">
            <Select
              options={specOptions}
              value={specId ?? ""}
              onChange={(v) => setSpecId(v ? Number(v) : null)}
              searchable
              clearable
              placeholder="Mutaxassislik"
            />
          </div>

          <div className="w-40">
            <Select
              options={ratingOptions}
              value={ratingMin ?? ""}
              onChange={(v) => setRatingMin(v ? Number(v) : null)}
              placeholder="Reyting"
            />
          </div>

          {hasFilters && (
            <Button variant="ghost" size="md" leftIcon={<X size={15} />} onClick={resetFilters}>
              Tozalash
            </Button>
          )}
        </div>

        {/* Active filters chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-xs font-medium border border-primary-200 dark:border-primary-800">
                Qidiruv: &ldquo;{search}&rdquo;
                <button onClick={() => setSearch("")}><X size={11} /></button>
              </span>
            )}
            {specId && specializations && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-medium border border-teal-200 dark:border-teal-800">
                {specializations.find((s) => s.id === specId)?.name}
                <button onClick={() => setSpecId(null)}><X size={11} /></button>
              </span>
            )}
            {ratingMin && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-medium border border-amber-200 dark:border-amber-800">
                Reyting {ratingMin}+
                <button onClick={() => setRatingMin(null)}><X size={11} /></button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
          </div>
        ) : !doctors?.length ? (
          <EmptyState
            icon={<Search size={28} />}
            title="Shifokor topilmadi"
            description="Qidiruv parametrlarini o'zgartirib ko'ring yoki filtrlarni tozalang"
            action={{ label: "Filtrlarni tozalash", onClick: resetFilters }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {doctors.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense>
      <DoctorsContent />
    </Suspense>
  );
}
