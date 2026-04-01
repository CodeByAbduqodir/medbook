"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Star, X, MessageSquare } from "lucide-react";
import { usePatientAppointments, useCancelAppointment, useSubmitReview } from "@/hooks/useAppointments";
import { PageTransition } from "@/components/layout/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { StarRating } from "@/components/ui/StarRating";
import { EmptyState } from "@/components/ui/EmptyState";
import { AppointmentCardSkeleton } from "@/components/ui/Skeleton";
import { formatDateTime, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

type TabKey = "upcoming" | "past" | "cancelled";
const TABS: { key: TabKey; label: string }[] = [
  { key: "upcoming", label: "Предстоящие" },
  { key: "past", label: "Прошедшие" },
  { key: "cancelled", label: "Отменённые" },
];

function AppointmentCard({ appointment, onCancel, onReview }: {
  appointment: Appointment;
  onCancel: (id: number) => void;
  onReview: (appointment: Appointment) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const doctor = appointment.doctor;
  const spec = doctor?.doctor_profile?.specialization;
  const canCancel = appointment.status === "pending" || appointment.status === "confirmed";
  const canReview = appointment.status === "completed" && !appointment.review;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 card-shadow overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={doctor?.name ?? "?"} src={doctor?.profile?.avatar_url} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{doctor?.name}</p>
                <p className="text-xs text-teal-600 dark:text-teal-400">{spec?.name}</p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={12} />
              <span>{formatDateTime(appointment.start_time)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          {canCancel && (
            <Button variant="danger" size="sm" leftIcon={<X size={13} />} onClick={() => onCancel(appointment.id)}>
              Отменить
            </Button>
          )}
          {canReview && (
            <Button variant="secondary" size="sm" leftIcon={<Star size={13} />} onClick={() => onReview(appointment)}>
              Оставить отзыв
            </Button>
          )}
          {appointment.review && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>Отзыв: {appointment.review.rating}/5</span>
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {expanded ? <><ChevronUp size={14} />Скрыть</> : <><ChevronDown size={14} />Детали</>}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-gray-800/40"
          >
            {appointment.diagnosis && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Диагноз</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{appointment.diagnosis}</p>
              </div>
            )}
            {appointment.prescriptions && appointment.prescriptions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Рецепты</p>
                <div className="flex flex-col gap-2">
                  {appointment.prescriptions.map((p) => (
                    <div key={p.id} className="text-sm bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white">{p.medicine_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.dosage} · {p.duration}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{p.instructions}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!appointment.diagnosis && (!appointment.prescriptions || appointment.prescriptions.length === 0) && (
              <p className="text-sm text-gray-400 italic">Нет дополнительных данных</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function PatientAppointmentsPage() {
  const [tab, setTab] = useState<TabKey>("upcoming");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [reviewAppt, setReviewAppt] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { data: appointments, isLoading } = usePatientAppointments();
  const cancelMutation = useCancelAppointment();
  const reviewMutation = useSubmitReview();

  const filtered = appointments?.filter((a) => {
    if (tab === "upcoming") return a.status === "pending" || a.status === "confirmed";
    if (tab === "past") return a.status === "completed";
    return a.status === "cancelled";
  }) ?? [];

  const handleCancel = async () => {
    if (!cancelId) return;
    await cancelMutation.mutateAsync({ id: cancelId });
    setCancelId(null);
  };

  const handleReview = async () => {
    if (!reviewAppt) return;
    await reviewMutation.mutateAsync({ appointmentId: reviewAppt.id, data: { rating: reviewRating, comment: reviewComment } });
    setReviewAppt(null);
    setReviewRating(5);
    setReviewComment("");
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Мои записи</h1>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                tab === key
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => <AppointmentCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="Записей нет"
            description={tab === "upcoming" ? "У вас нет предстоящих записей" : "Нет записей в этом разделе"}
            action={tab === "upcoming" ? { label: "Найти врача", onClick: () => window.location.href = "/doctors" } : undefined}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                onCancel={(id) => setCancelId(id)}
                onReview={(appt) => setReviewAppt(appt)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Отменить запись?" size="sm">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Вы уверены, что хотите отменить эту запись?
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={() => setCancelId(null)}>Назад</Button>
          <Button variant="danger" fullWidth isLoading={cancelMutation.isPending} onClick={handleCancel}>
            Отменить запись
          </Button>
        </div>
      </Modal>

      {/* Review modal */}
      <Modal isOpen={!!reviewAppt} onClose={() => setReviewAppt(null)} title="Оставить отзыв" size="sm">
        <div className="flex flex-col gap-4">
          {reviewAppt?.doctor && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <Avatar name={reviewAppt.doctor.name} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{reviewAppt.doctor.name}</p>
                <p className="text-xs text-gray-500">{formatDate(reviewAppt.start_time)}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Ваша оценка</p>
            <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Комментарий <span className="text-gray-400 font-normal">(необязательно)</span>
            </label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Поделитесь впечатлениями о приёме..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <Button
            variant="gradient"
            fullWidth
            leftIcon={<MessageSquare size={15} />}
            isLoading={reviewMutation.isPending}
            onClick={handleReview}
          >
            Отправить отзыв
          </Button>
        </div>
      </Modal>
    </PageTransition>
  );
}
