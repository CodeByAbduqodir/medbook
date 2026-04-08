"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, FileText, UserCircle, Clock, ArrowRight, Star, Timer } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { usePatientAppointments } from "@/hooks/useAppointments";
import { usePatientPrescriptions } from "@/hooks/usePrescriptions";
import { PageTransition } from "@/components/layout/PageTransition";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { AppointmentCardSkeleton } from "@/components/ui/Skeleton";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

function CountdownTimer({ targetTime }: { targetTime: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg px-2.5 py-1.5 min-w-[48px] text-center shadow-sm">
      <p className="text-lg font-bold text-primary-600 dark:text-primary-400 font-mono">{String(value).padStart(2, '0')}</p>
      <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );

  return (
    <div className="flex items-center gap-2 mt-3">
      <Timer size={14} className="text-primary-500" />
      <div className="flex gap-1.5">
        {timeLeft.days > 0 && <TimeBlock value={timeLeft.days} label="kun" />}
        <TimeBlock value={timeLeft.hours} label="soat" />
        <TimeBlock value={timeLeft.minutes} label="daq" />
        <TimeBlock value={timeLeft.seconds} label="son" />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Xayrli tun";
  if (h < 12) return "Xayrli tong";
  if (h < 18) return "Xayrli kun";
  return "Xayrli kech";
}

function QuickCard({
  icon, label, description, href, color,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className="group flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        </div>
        <ArrowRight size={16} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" />
      </div>
    </Link>
  );
}

function UpcomingCard({ appointment, showCountdown }: { appointment: Appointment; showCountdown?: boolean }) {
  const doctor = appointment.doctor;
  const spec = doctor?.doctor_profile?.specialization;
  return (
    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary-50 to-teal-50 dark:from-primary-950/30 dark:to-teal-950/30 rounded-2xl border border-primary-100 dark:border-primary-900">
      <Avatar name={doctor?.name ?? "?"} size="lg" src={doctor?.profile?.avatar_url} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{doctor?.name}</p>
        <p className="text-xs text-teal-600 dark:text-teal-400">{spec?.name}</p>
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={12} />
          <span>{formatDateTime(appointment.start_time)}</span>
        </div>
        {showCountdown && <CountdownTimer targetTime={appointment.start_time} />}
      </div>
      <StatusBadge status={appointment.status} />
    </div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: appointments, isLoading: apptLoading } = usePatientAppointments({ status: "confirmed,pending" });
  const { data: prescriptions } = usePatientPrescriptions();

  const upcoming = useMemo(
    () => appointments?.filter((a) => a.status === "confirmed" || a.status === "pending")
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 3) ?? [],
    [appointments]
  );

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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{getGreeting()},</p>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
            {user?.name?.split(" ")[0]} 👋
          </h1>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Kutilayotgan qabul", value: upcoming.length, color: "text-primary-600 dark:text-primary-400" },
            { label: "Retseptlar", value: prescriptions?.length ?? 0, color: "text-teal-600 dark:text-teal-400" },
            { label: "Jami qabul", value: appointments?.length ?? 0, color: "text-gray-700 dark:text-gray-300" },
          ].map(({ label, value, color }) => (
            <motion.div key={label} variants={item}>
              <Card padding="md" className="text-center">
                <p className={`text-3xl font-display font-bold ${color} mb-1`}>{value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Upcoming appointments */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-gray-900 dark:text-white">Kelgusi qabullar</h2>
            <Link href="/dashboard/appointments" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              Barchasi <ArrowRight size={12} />
            </Link>
          </div>
          {apptLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 2 }).map((_, i) => <AppointmentCardSkeleton key={i} />)}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
              <Calendar size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Kelgusi qabul yo'q</p>
              <Link href="/doctors">
                <Button variant="primary" size="sm">Shifokor topish</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {upcoming.map((a, i) => (
                <UpcomingCard key={a.id} appointment={a} showCountdown={i === 0 && (a.status === "confirmed" || a.status === "pending")} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-4">Tezkor amallar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <QuickCard icon={<Calendar size={22} />} label="Shifokor topish" description="Qabulga yozilish" href="/doctors" color="bg-gradient-to-br from-primary-500 to-primary-600" />
            <QuickCard icon={<FileText size={22} />} label="Retseptlarim" description="Tayinlovlarni ko'rish" href="/dashboard/prescriptions" color="bg-gradient-to-br from-teal-500 to-teal-600" />
            <QuickCard icon={<Star size={22} />} label="Qabullar tarixi" description="O'tgan qabullar" href="/dashboard/appointments" color="bg-gradient-to-br from-amber-500 to-amber-600" />
            <QuickCard icon={<UserCircle size={22} />} label="Mening profilim" description="Akkaunt sozlamalari" href="/dashboard/profile" color="bg-gradient-to-br from-purple-500 to-purple-600" />
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
