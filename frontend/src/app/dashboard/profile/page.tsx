"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Phone, MapPin, Calendar, Save } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { patientApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PageTransition } from "@/components/layout/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Profile } from "@/lib/types";
import toast from "react-hot-toast";

const schema = z.object({
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  address: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function PatientProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["patient-profile"],
    queryFn: async () => {
      const res = await patientApi.getProfile();
      return res.data.data as Profile;
    },
  });

  const { register, handleSubmit, formState: { isDirty, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      phone: profile?.phone ?? "",
      birth_date: profile?.birth_date ?? "",
      address: profile?.address ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => patientApi.updateProfile(data as Record<string, unknown>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient-profile"] });
      toast.success("Profil yangilandi");
    },
    onError: () => toast.error("Saqlashda xatolik"),
  });

  const onSubmit = (data: FormData) => updateMutation.mutate(data);

  if (!user) return null;

  return (
    <PageTransition>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Mening profilim</h1>

        {/* Avatar section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card padding="lg" className="mb-6 flex items-center gap-5">
            <Avatar name={user.name} size="2xl" src={profile?.avatar_url} />
            <div>
              <p className="text-lg font-display font-semibold text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              <span className="inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                Bemor
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card padding="lg">
            <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-5">
              Shaxsiy ma'lumotlar
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label="Telefon"
                placeholder="+7 (999) 123-45-67"
                leftIcon={<Phone size={16} />}
                {...register("phone")}
              />
              <Input
                label="Tug'ilgan sana"
                type="date"
                leftIcon={<Calendar size={16} />}
                {...register("birth_date")}
              />
              <Input
                label="Manzil"
                placeholder="Shahar, ko'cha, uy"
                leftIcon={<MapPin size={16} />}
                {...register("address")}
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                leftIcon={<Save size={15} />}
                isLoading={isSubmitting || updateMutation.isPending}
                disabled={!isDirty}
                className="mt-2"
              >
                O'zgarishlarni saqlash
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
