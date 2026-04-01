"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar, Clock, CheckCircle, XCircle, ClipboardCheck, Plus, ChevronDown, ChevronUp } from "lucide-react";
import {
  useDoctorAppointments, useConfirmAppointment,
  useCompleteAppointment, useDoctorCancelAppointment,
} from "@/hooks/useAppointments";
import { useStorePrescription } from "@/hooks/usePrescriptions";
import { PageTransition } from "@/components/layout/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { AppointmentCardSkeleton } from "@/components/ui/Skeleton";
import { SuccessAnimation } from "@/components/ui/SuccessAnimation";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

type FilterKey = "all" | "pending" | "confirmed" | "completed" | "cancelled";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Ожидают" },
  { key: "confirmed", label: "Подтверждены" },
  { key: "completed", label: "Завершены" },
  { key: "cancelled", label: "Отменены" },
];

function AppointmentRow({ appointment, onConfirm, onComplete, onCancel, onPrescription }: {
  appointment: Appointment;
  onConfirm: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onPrescription: () => void;
}) {
  const [open, setOpen] = useState(false);
  const patient = appointment.patient;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 card-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar name={patient?.name ?? "?"} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{patient?.name}</p>
                <p className="text-xs text-gray-400">{patient?.email}</p>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>{formatDateTime(appointment.start_time)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {appointment.status === "pending" && (
            <Button variant="secondary" size="sm" leftIcon={<CheckCircle size={13} />} onClick={onConfirm}>
              Подтвердить
            </Button>
          )}
          {appointment.status === "confirmed" && (
            <Button variant="primary" size="sm" leftIcon={<ClipboardCheck size={13} />} onClick={onComplete}>
              Завершить приём
            </Button>
          )}
          {appointment.status === "completed" && (
            <Button variant="outline" size="sm" leftIcon={<Plus size={13} />} onClick={onPrescription}>
              Выписать рецепт
            </Button>
          )}
          {(appointment.status === "pending" || appointment.status === "confirmed") && (
            <Button variant="ghost" size="sm" leftIcon={<XCircle size={13} />} onClick={onCancel} className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
              Отменить
            </Button>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {open ? <><ChevronUp size={13} />Свернуть</> : <><ChevronDown size={13} />Подробнее</>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-gray-800/40"
          >
            {appointment.diagnosis && (
              <div className="mb-3">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">Диагноз</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{appointment.diagnosis}</p>
              </div>
            )}
            {appointment.prescriptions && appointment.prescriptions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Рецепты ({appointment.prescriptions.length})</p>
                <div className="flex flex-col gap-1.5">
                  {appointment.prescriptions.map((p) => (
                    <div key={p.id} className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 rounded-lg p-2.5 border border-gray-100 dark:border-gray-700">
                      <span className="font-medium">{p.medicine_name}</span>
                      <span className="text-gray-400"> — {p.dosage}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!appointment.diagnosis && !appointment.prescriptions?.length && (
              <p className="text-sm text-gray-400 italic">Нет дополнительных данных</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DoctorAppointmentsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [completeId, setCompleteId] = useState<number | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [prescriptionAppt, setPrescriptionAppt] = useState<Appointment | null>(null);
  const [prescription, setPrescription] = useState({ medicine_name: "", dosage: "", instructions: "", duration: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: appointments, isLoading } = useDoctorAppointments();
  const confirmMutation = useConfirmAppointment();
  const completeMutation = useCompleteAppointment();
  const cancelMutation = useDoctorCancelAppointment();
  const prescriptionMutation = useStorePrescription();

  const filtered = filter === "all" ? (appointments ?? []) : (appointments ?? []).filter((a) => a.status === filter);

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Записи пациентов</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150",
                filter === key
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:text-primary-600"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => <AppointmentCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={<Calendar size={28} />} title="Записей нет" description="Нет записей по выбранному фильтру" />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((a) => (
              <AppointmentRow
                key={a.id}
                appointment={a}
                onConfirm={() => confirmMutation.mutate(a.id)}
                onComplete={() => { setCompleteId(a.id); setDiagnosis(""); }}
                onCancel={() => setCancelId(a.id)}
                onPrescription={() => { setPrescriptionAppt(a); setPrescription({ medicine_name: "", dosage: "", instructions: "", duration: "" }); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Complete modal */}
      <Modal isOpen={!!completeId} onClose={() => setCompleteId(null)} title="Завершить приём" size="sm">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Диагноз</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Введите диагноз..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <Button
            variant="gradient"
            fullWidth
            isLoading={completeMutation.isPending}
            disabled={!diagnosis.trim()}
            onClick={async () => { 
              if (!completeId) return; 
              await completeMutation.mutateAsync({ id: completeId, diagnosis }); 
              setCompleteId(null);
              setShowSuccess(true);
            }}
          >
            Завершить
          </Button>
        </div>
      </Modal>

      {/* Cancel modal */}
      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Отменить запись?" size="sm">
        <div className="flex gap-3 mt-2">
          <Button variant="ghost" fullWidth onClick={() => setCancelId(null)}>Назад</Button>
          <Button variant="danger" fullWidth isLoading={cancelMutation.isPending} onClick={async () => { if (!cancelId) return; await cancelMutation.mutateAsync({ id: cancelId }); setCancelId(null); }}>
            Отменить
          </Button>
        </div>
      </Modal>

      {/* Prescription modal */}
      <Modal isOpen={!!prescriptionAppt} onClose={() => setPrescriptionAppt(null)} title="Выписать рецепт" size="sm">
        <div className="flex flex-col gap-3">
          <Input label="Препарат" placeholder="Название лекарства" value={prescription.medicine_name} onChange={(e) => setPrescription({ ...prescription, medicine_name: e.target.value })} />
          <Input label="Дозировка" placeholder="250мг, 1 таблетка" value={prescription.dosage} onChange={(e) => setPrescription({ ...prescription, dosage: e.target.value })} />
          <Input label="Длительность" placeholder="7 дней, 2 недели" value={prescription.duration} onChange={(e) => setPrescription({ ...prescription, duration: e.target.value })} />
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Инструкция</label>
            <textarea
              value={prescription.instructions}
              onChange={(e) => setPrescription({ ...prescription, instructions: e.target.value })}
              placeholder="Принимать 2 раза в день после еды..."
              rows={2}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <Button
            variant="gradient"
            fullWidth
            isLoading={prescriptionMutation.isPending}
            disabled={!prescription.medicine_name.trim()}
            onClick={async () => {
              if (!prescriptionAppt) return;
              await prescriptionMutation.mutateAsync({ appointmentId: prescriptionAppt.id, data: prescription });
              setPrescriptionAppt(null);
              setShowSuccess(true);
            }}
          >
            Выписать рецепт
          </Button>
        </div>
      </Modal>

      {/* Success animation */}
      <SuccessAnimation show={showSuccess} message="Приём завершён!" />
    </PageTransition>
  );
}