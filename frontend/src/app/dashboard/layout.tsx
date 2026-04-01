"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Calendar, FileText, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import type { NavItem } from "@/components/layout/Sidebar";

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Обзор", icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/appointments", label: "Мои записи", icon: <Calendar size={18} /> },
  { href: "/dashboard/prescriptions", label: "Рецепты", icon: <FileText size={18} /> },
  { href: "/dashboard/profile", label: "Профиль", icon: <UserCircle size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
    if (!isLoading && isAuthenticated && user?.role === "doctor") router.replace("/doctor");
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
