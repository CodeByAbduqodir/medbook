"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Heart, ArrowRight, Eye, EyeOff, Stethoscope } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Kamida 2 ta belgi"),
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(8, "Kamida 8 ta belgi"),
  password_confirmation: z.string(),
  role: z.enum(["patient", "doctor"]),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Parollar mos kelmadi",
  path: ["password_confirmation"],
});
type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 8 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;

  const labels = ["", "Zaif", "O'rtacha", "Yaxshi", "A'lo"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-teal-400", "bg-green-500"];

  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= strength ? colors[strength] : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs", strength <= 1 ? "text-red-500" : strength <= 2 ? "text-amber-500" : "text-green-600 dark:text-green-400")}>
        {labels[strength]}
      </p>
    </div>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: authRegister, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: searchParams.get("role") === "doctor" ? "doctor" : "patient" },
  });

  const role = watch("role");
  const password = watch("password") ?? "";

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    try {
      await authRegister(data);
      router.push(data.role === "doctor" ? "/doctor" : "/dashboard");
    } catch {
      toast.error("Ro'yxatdan o'tishda xatolik. Qayta urinib ko'ring.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      {/* Left: Decoration */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-teal-500 via-teal-600 to-primary-600 relative overflow-hidden order-last lg:order-first">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots2" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots2)" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 rounded-full bg-primary-300/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative text-center text-white px-8 max-w-sm"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Stethoscope size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">MedBook'ga qo'shiling</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            1200 dan ortiq bemorlar allaqachon MedBook orqali shifokorlarga onlayn yozilmoqda. Siz ham qo'shiling!
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: "50+", label: "Shifokorlar" },
              { value: "4.9★", label: "Reyting" },
              { value: "2 daq", label: "Yozilish" },
              { value: "24/7", label: "Doim ochiq" },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 rounded-xl py-3 px-4 text-center">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 bg-white dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary shadow-sm">
              <Heart size={18} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-primary">MedBook</span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Akkaunt yaratish
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Formani to'ldiring va xizmatdan foydalanishni boshlang
          </p>

          {/* Role tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
            {(["patient", "doctor"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setValue("role", r)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  role === r
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                )}
              >
                {r === "patient" ? <User size={15} /> : <Stethoscope size={15} />}
                {r === "patient" ? "Bemor" : "Shifokor"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Ism va familiya"
              placeholder="Ali Valiyev"
              leftIcon={<User size={16} />}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              {...register("email")}
            />
            <div>
              <Input
                label="Parol"
                type={showPassword ? "text" : "password"}
                placeholder="Kamida 8 ta belgi"
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={errors.password?.message}
                {...register("password")}
              />
              <PasswordStrength password={password} />
            </div>
            <Input
              label="Parolni tasdiqlash"
              type="password"
              placeholder="Parolni qayta kiriting"
              leftIcon={<Lock size={16} />}
              error={errors.password_confirmation?.message}
              {...register("password_confirmation")}
            />

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight size={18} />}
              className="mt-2"
            >
              Ro'yxatdan o'tish
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Akkauntingiz bormi?{" "}
            <Link href="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:underline">
              Kirish
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
