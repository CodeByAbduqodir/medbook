"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Menu,
  X,
  ChevronDown,
  User,
  Calendar,
  FileText,
  LogOut,
  Settings,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/doctors", label: "Shifokorlar" },
  { href: "/about", label: "Xizmat haqida" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const dashboardHref = user?.role === "doctor" ? "/doctor" : "/dashboard";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm glow-primary">
              <Heart size={18} className="text-white" fill="white" />
            </div>
            <span className="text-lg font-bold text-gradient-primary">MedBook</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
                    >
                      <Avatar name={user.name} size="sm" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[120px] truncate">
                        {user.name}
                      </span>
                      <ChevronDown
                        size={14}
                        className={cn(
                          "text-gray-400 transition-transform duration-200",
                          isUserMenuOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsUserMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden z-20"
                          >
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                            <div className="py-1">
                              <UserMenuItem
                                href={dashboardHref}
                                icon={<Calendar size={15} />}
                                label="Kabinetim"
                                onClick={() => setIsUserMenuOpen(false)}
                              />
                              {user.role === "doctor" && (
                                <UserMenuItem
                                  href="/doctor/profile"
                                  icon={<Stethoscope size={15} />}
                                  label="Shifokor profili"
                                  onClick={() => setIsUserMenuOpen(false)}
                                />
                              )}
                              {user.role === "patient" && (
                                <UserMenuItem
                                  href="/dashboard/prescriptions"
                                  icon={<FileText size={15} />}
                                  label="Retseptlarim"
                                  onClick={() => setIsUserMenuOpen(false)}
                                />
                              )}
                              <UserMenuItem
                                href={user.role === "doctor" ? "/doctor/profile" : "/dashboard/profile"}
                                icon={<Settings size={15} />}
                                label="Sozlamalar"
                                onClick={() => setIsUserMenuOpen(false)}
                              />
                            </div>
                            <div className="py-1 border-t border-gray-100 dark:border-gray-800">
                              <button
                                onClick={() => {
                                  setIsUserMenuOpen(false);
                                  logout();
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-150"
                              >
                                <LogOut size={15} />
                                Chiqish
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Kirish
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="gradient" size="sm">
                        Ro'yxatdan o'tish
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link href={dashboardHref}>
                      <Button variant="outline" fullWidth leftIcon={<User size={15} />}>
                        Kabinetim
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      fullWidth
                      leftIcon={<LogOut size={15} />}
                      onClick={logout}
                      className="text-red-600 dark:text-red-400"
                    >
                      Chiqish
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" fullWidth>
                        Kirish
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="gradient" fullWidth>
                        Ro'yxatdan o'tish
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function UserMenuItem({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
    >
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}
