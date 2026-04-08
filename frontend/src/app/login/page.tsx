"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Heart, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Noto'g'ri email"),
  password: z.string().min(1, "Parolni kiriting"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch {
      toast.error("Email yoki parol noto'g'ri");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      {/* Left: Form */}
      <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 bg-white dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center glow-primary shadow-sm">
              <Heart size={18} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient-primary">MedBook</span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Xush kelibsiz
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Qabul va yozuvlarni boshqarish uchun akkauntga kiring
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                placeholder="Parolni kiriting"
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
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight size={18} />}
              className="mt-2"
            >
              Kirish
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Akkauntingiz yo'qmi?{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              Ro'yxatdan o'tish
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Decoration */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-teal-500 relative overflow-hidden">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Blobs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-teal-300/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative text-center text-white px-8 max-w-sm"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Heart size={36} className="text-white" fill="white" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-4">
            Sog'lig'ingiz uchun to'g'ri tanlov
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Eng yaxshi shifokorlarga yoziling, onlayn maslahat oling va
            barcha retseptlarni bitta joyda saqlang.
          </p>

          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {["AI", "RK", "NX", "MS"].map((init) => (
                <div
                  key={init}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-xs font-semibold"
                >
                  {init}
                </div>
              ))}
            </div>
            <span className="text-sm text-white/80">+1200 bemor</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
