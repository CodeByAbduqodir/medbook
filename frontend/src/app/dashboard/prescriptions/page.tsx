"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ChevronDown, ChevronUp, Pill, Clock, User } from "lucide-react";
import { usePatientPrescriptions } from "@/hooks/usePrescriptions";
import { PageTransition } from "@/components/layout/PageTransition";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, formatRelative } from "@/lib/utils";
import type { Prescription } from "@/lib/types";

function PrescriptionCard({ prescription, index }: { prescription: Prescription; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const doctor = prescription.appointment?.doctor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 card-shadow overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center shrink-0">
              <Pill size={18} className="text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {prescription.medicine_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {prescription.dosage}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 shrink-0">{formatRelative(prescription.created_at)}</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500 dark:text-gray-400">
          {doctor && (
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span>{doctor.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>Davolash kursi: {prescription.duration}</span>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors mt-3"
        >
          {expanded ? <><ChevronUp size={13} />Yo'riqnomani yashirish</> : <><ChevronDown size={13} />Yo'riqnoma</>}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="border-t border-gray-100 dark:border-gray-800 px-5 py-4 bg-gray-50 dark:bg-gray-800/40"
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Qo'llash bo'yicha yo'riqnoma</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{prescription.instructions}</p>
            {prescription.appointment && (
              <p className="text-xs text-gray-400 mt-3">
                Yozilgan sana: {formatDate(prescription.appointment.start_time)}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function PrescriptionSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10" rounded="lg" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  );
}

export default function PrescriptionsPage() {
  const { data: prescriptions, isLoading } = usePatientPrescriptions();

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Mening retseptlarim</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {prescriptions ? `${prescriptions.length} ta retsept` : "Yuklanmoqda..."}
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => <PrescriptionSkeleton key={i} />)}
          </div>
        ) : !prescriptions?.length ? (
          <EmptyState
            icon={<FileText size={28} />}
            title="Retseptlar yo'q"
            description="Qabul yakunlangach, shifokor retsept yozadi va ular shu yerda ko'rinadi"
          />
        ) : (
          <div className="flex flex-col gap-4">
            {prescriptions.map((p, i) => (
              <PrescriptionCard key={p.id} prescription={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
