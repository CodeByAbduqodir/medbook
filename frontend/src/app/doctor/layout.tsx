"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, ClipboardList, Users, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import type { NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { href: "/doctor", label: "Обзор", icon: <LayoutDashboard size={18} /> },
  { href: "/doctor/schedule", label: "Расписание", icon: <Calendar size={18} /> },
  { href: "/doctor/appointments", label: "Записи", icon: <ClipboardList size={18} /> },
  { href: "/doctor/patients", label: "Пациенты", icon: <Users size={18} /> },
  { href: "/doctor/profile", label: "Профиль", icon: <UserCircle size={18} /> },
];

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && user?.role === "patient") router.replace("/dashboard");
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar navItems={NAV_ITEMS} />
      <main className="flex-1 min-w-0 lg:py-8 lg:px-8 pt-16 pb-8 px-4">
        {children}
      </main>
    </div>
  );
}
