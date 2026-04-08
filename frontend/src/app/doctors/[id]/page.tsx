"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfDay } from "date-fns";
import { uz } from "date-fns/locale";
import {
  Star, Briefcase, ChevronLeft, ChevronRight, Clock,
  Calendar, CheckCircle2, MessageSquare, Info,
} from "lucide-react";
import { useDoctor, useDoctorSlots } from "@/hooks/useDoctors";
import { useBookAppointment } from "@/hooks/useAppointments";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTime, formatDate, pluralize } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const TABS = ["schedule", "reviews", "about"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  schedule: "Jadval",
  reviews: "Fikrlar",
  about: "Shifokor haqida",
};

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [tab, setTab] = useState<Tab>("schedule");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: doctor, isLoading } = useDoctor(id);
  const { data: slots, isLoading: slotsLoading } = useDoctorSlots(id, selectedDate);
  const bookMutation = useBookAppointment();

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfDay(new Date()), weekOffset * 7 + i)
  );

  const handleBook = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!selectedSlot || !doctor) return;
    await bookMutation.mutateAsync({ doctor_id: doctor.id, start_time: selectedSlot });
    setConfirmOpen(false);
    setSelectedSlot(null);
    router.push("/dashboard/appointments");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex gap-6 mb-8">
            <Skeleton className="w-28 h-28" rounded="full" />
            <div className="flex-1 flex flex-col gap-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <EmptyState title="Shifokor topilmadi" description="Havolani tekshiring yoki katalogga qayting" action={{ label: "Katalogga qaytish", onClick: () => router.push("/doctors") }} className="pt-32" />
        <Footer />
      </div>
    );
  }

  const profile = doctor.doctor_profile;
  const spec = profile?.specialization ?? doctor.specialization;
  const rating = Number(profile?.rating_avg ?? doctor.rating_avg ?? 0);
  const exp = Number(profile?.experience_years ?? doctor.experience_years ?? 0);
  const bio = doctor.bio ?? profile?.bio;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Hero */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start gap-6"
          >
            <Avatar
              name={doctor.name}
              src={doctor.profile?.avatar_url}
              size="2xl"
              isOnline
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
                    {doctor.name}
                  </h1>
                  {spec && <Badge variant="teal">{spec.name}</Badge>}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-gray-900 dark:text-white">
                    {rating > 0 ? rating.toFixed(1) : "Baholar yo'q"}
                  </span>
                  {doctor.reviews && doctor.reviews.length > 0 && (
                    <span className="text-gray-400">({doctor.reviews.length} ta fikr)</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                  <Briefcase size={14} className="text-gray-400" />
                  {pluralize(exp, "yil tajriba", "yil tajriba", "yil tajriba")}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-0 mt-8 border-b border-gray-100 dark:border-gray-800">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative px-5 py-3 text-sm font-medium transition-colors duration-200",
                  tab === t
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                )}
              >
                {TAB_LABELS[t]}
                {tab === t && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {/* --- SCHEDULE TAB --- */}
          {tab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Week navigation */}
              <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Sana va vaqtni tanlang
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                    disabled={weekOffset === 0}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-400 hover:text-primary-600 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[120px] text-center">
                    {format(weekDays[0], "d MMM", { locale: uz })} –{" "}
                    {format(weekDays[6], "d MMM yyyy", { locale: uz })}
                  </span>
                  <button
                    onClick={() => setWeekOffset((w) => w + 1)}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day selector */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {weekDays.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const isSelected = dateStr === selectedDate;
                  const isPast = day < startOfDay(new Date());
                  return (
                    <button
                      key={dateStr}
                      onClick={() => !isPast && setSelectedDate(dateStr)}
                      disabled={isPast}
                      className={cn(
                        "flex flex-col items-center py-3 rounded-xl text-xs font-medium transition-all duration-200",
                        isSelected
                          ? "bg-primary-600 text-white shadow-md"
                          : isPast
                          ? "opacity-35 cursor-not-allowed text-gray-400"
                          : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800 hover:border-primary-300 hover:text-primary-600"
                      )}
                    >
                      <span className={cn("text-[10px] uppercase mb-1", isSelected ? "text-white/80" : "text-gray-400")}>
                        {format(day, "EEE", { locale: uz })}
                      </span>
                      <span className="text-sm font-bold">{format(day, "d")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              {slotsLoading ? (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} className="h-10" rounded="lg" />
                  ))}
                </div>
              ) : !slots?.length ? (
                <EmptyState icon={<Clock size={24} />} title="Bo'sh vaqt yo'q" description="Boshqa kunni tanlang" />
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {slots.map((slot) => {
                    const isSelected = slot.start_time === selectedSlot;
                    return (
                      <motion.button
                        key={slot.start_time}
                        whileTap={{ scale: 0.95 }}
                        disabled={!slot.is_available}
                        onClick={() => {
                          setSelectedSlot(slot.start_time);
                          setConfirmOpen(true);
                        }}
                        className={cn(
                          "py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
                          slot.is_available
                            ? isSelected
                              ? "bg-primary-600 text-white border-primary-600 shadow-md"
                              : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-transparent cursor-not-allowed line-through"
                        )}
                      >
                        {formatTime(slot.start_time)}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* --- REVIEWS TAB --- */}
          {tab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {!doctor.reviews?.length ? (
                <EmptyState icon={<MessageSquare size={24} />} title="Hali fikr yo'q" description="Shifokor haqida birinchi fikr qoldiring" />
              ) : (
                <div className="flex flex-col gap-4">
                  {doctor.reviews.filter((r) => r.is_approved).map((review, i) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 card-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {review.patient_name ?? "Bemor"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(review.created_at)}
                          </p>
                        </div>
                        <StarRating value={review.rating} readonly size="sm" />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* --- ABOUT TAB --- */}
          {tab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 card-shadow"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info size={18} className="text-primary-500" />
                <h2 className="font-display font-semibold text-gray-900 dark:text-white">Mutaxassis haqida</h2>
              </div>
              {bio ? (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{bio}</p>
              ) : (
                <p className="text-gray-400 italic text-sm">Tavsif qo'shilmagan</p>
              )}
              {spec && (
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Mutaxassislik</p>
                  <Badge variant="teal">{spec.name}</Badge>
                  {spec.description && (
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{spec.description}</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Booking confirmation modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedSlot(null); }}
        title="Qabulni tasdiqlash"
        description="Tafsilotlarni tekshiring va qabulni tasdiqlang"
        size="sm"
      >
        {selectedSlot && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Avatar name={doctor.name} size="md" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{doctor.name}</p>
                <p className="text-xs text-teal-600 dark:text-teal-400">{spec?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Calendar size={16} className="text-primary-500" />
              <span>{formatDate(selectedSlot)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Clock size={16} className="text-primary-500" />
              <span>{formatTime(selectedSlot)}</span>
            </div>
            <Button
              variant="gradient"
              fullWidth
              leftIcon={<CheckCircle2 size={16} />}
              isLoading={bookMutation.isPending}
              onClick={handleBook}
            >
              Yozilish
            </Button>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
