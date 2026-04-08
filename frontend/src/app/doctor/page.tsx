"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Clock, Users, Star, ArrowRight, ClipboardList } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useDoctorAppointments } from "@/hooks/useAppointments";
import { PageTransition } from "@/components/layout/PageTransition";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AppointmentCardSkeleton } from "@/components/ui/Skeleton";
import { formatTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

function TodayCard({ appointment }: { appointment: Appointment }) {
  const patient = appointment.patient;
  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 card-shadow">
      <Avatar name={patient?.name ?? "?"} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{patient?.name}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          <Clock size={11} />
          <span>{formatTime(appointment.start_time)}</span>
        </div>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: allAppts, isLoading } = useDoctorAppointments();
  const { data: todayAppts, isLoading: todayLoading } = useDoctorAppointments({ date: today });

  const stats = useMemo(() => {
    if (!allAppts) return { pending: 0, confirmed: 0, completed: 0, total: 0 };
    return {
      pending: allAppts.filter((a) => a.status === "pending").length,
      confirmed: allAppts.filter((a) => a.status === "confirmed").length,
      completed: allAppts.filter((a) => a.status === "completed").length,
      total: allAppts.length,
    };
  }, [allAppts]);

  const upcomingToday = todayAppts?.filter(
    (a) => a.status === "confirmed" || a.status === "pending"
  ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()) ?? [];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {new Intl.DateTimeFormat("uz-UZ", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(new Date())}
          </p>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Xush kelibsiz, {user?.name?.split(" ")[0]}! 👨‍⚕️
          </h1>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Kutilmoqda", value: stats.pending, color: "text-amber-600 dark:text-amber-400" },
            { label: "Tasdiqlangan", value: stats.confirmed, color: "text-blue-600 dark:text-blue-400" },
            { label: "Yakunlangan", value: stats.completed, color: "text-green-600 dark:text-green-400" },
            { label: "Jami", value: stats.total, color: "text-gray-700 dark:text-gray-300" },
          ].map(({ label, value, color }) => (
            <motion.div key={label} variants={item}>
              <Card padding="md" className="text-center">
                <p className={`text-3xl font-display font-bold ${color} mb-1`}>{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Today's schedule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900 dark:text-white">Bugungi jadval</h2>
            <Link href="/doctor/appointments" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              Barcha qabul <ArrowRight size={12} />
            </Link>
          </div>

          {todayLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => <AppointmentCardSkeleton key={i} />)}
            </div>
          ) : upcomingToday.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Calendar size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Bugun qabul yo'q</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingToday.map((a) => <TodayCard key={a.id} appointment={a} />)}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Tezkor amallar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/doctor/schedule", icon: <Calendar size={20} />, label: "Jadval", desc: "Qabul vaqtlarini boshqarish", color: "bg-gradient-to-br from-primary-500 to-primary-600" },
              { href: "/doctor/appointments", icon: <ClipboardList size={20} />, label: "Barcha qabullar", desc: "Qabul jarayonini boshqarish", color: "bg-gradient-to-br from-teal-500 to-teal-600" },
              { href: "/doctor/patients", icon: <Users size={20} />, label: "Bemorlar", desc: "Tashriflar tarixi", color: "bg-gradient-to-br from-amber-500 to-amber-600" },
              { href: "/doctor/profile", icon: <Star size={20} />, label: "Mening profilim", desc: "Ma'lumotlar va mutaxassislik", color: "bg-gradient-to-br from-purple-500 to-purple-600" },
            ].map(({ href, icon, label, desc, color }) => (
              <Link key={href} href={href}>
                <div className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <ArrowRight size={15} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
