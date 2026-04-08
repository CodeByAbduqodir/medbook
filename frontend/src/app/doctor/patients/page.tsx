"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Users } from "lucide-react";
import { doctorApi } from "@/lib/api";
import { PageTransition } from "@/components/layout/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import type { User, Appointment } from "@/lib/types";

interface PatientWithAppointments extends User {
  appointments: Appointment[];
}

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState("");

  const { data: patients, isLoading } = useQuery({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const res = await doctorApi.getPatients();
      return res.data.data as PatientWithAppointments[];
    },
  });

  const filtered = patients?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Bemorlar</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {patients ? `${patients.length} ta bemor` : "Yuklanmoqda..."}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki email bo'yicha qidirish..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 flex gap-4">
                <Skeleton className="w-12 h-12" rounded="full" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Users size={28} />}
            title={search ? "Bemor topilmadi" : "Bemorlar yo'q"}
            description={search ? "Boshqa so'rovni sinab ko'ring" : "Bu yerda sizga yozilgan bemorlar ko'rsatiladi"}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((patient, i) => {
              const lastAppt = patient.appointments?.[patient.appointments.length - 1];
              const apptCount = patient.appointments?.length ?? 0;
              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 card-shadow p-5"
                >
                  <div className="flex items-start gap-4">
                    <Avatar name={patient.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{patient.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{patient.email}</p>
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} />
                          <span>{apptCount} {apptCount === 1 ? "tashrif" : "tashrif"}</span>
                        </div>
                        {lastAppt && (
                          <div className="flex items-center gap-1.5">
                            <span>Oxirgisi: {formatDate(lastAppt.start_time)}</span>
                            <StatusBadge status={lastAppt.status} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
