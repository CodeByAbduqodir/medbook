"use client";

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, FileText, Save, Star } from "lucide-react";
import { doctorApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useSpecializations } from "@/hooks/useDoctors";
import { PageTransition } from "@/components/layout/PageTransition";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import type { DoctorProfile } from "@/lib/types";
import toast from "react-hot-toast";

const schema = z.object({
  specialization_id: z.number().optional(),
  experience_years: z.coerce.number().min(0).max(60).optional(),
  bio: z.string().max(1000).optional(),
});
type FormData = z.infer<typeof schema>;

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: specs } = useSpecializations();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["doctor-profile-edit"],
    queryFn: async () => {
      const res = await doctorApi.getProfile();
      return res.data.data as DoctorProfile & { rating_avg: number };
    },
  });

  const { register, handleSubmit, watch, setValue, formState: { isDirty, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      specialization_id: profile?.specialization_id,
      experience_years: profile?.experience_years,
      bio: profile?.bio ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => doctorApi.updateProfile(data as Record<string, unknown>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-profile-edit"] });
      toast.success("Profil yangilandi");
    },
    onError: () => toast.error("Saqlashda xatolik"),
  });

  const specId = watch("specialization_id");
  const specOptions = (specs ?? []).map((s) => ({ value: s.id, label: s.name }));

  if (!user) return null;

  return (
    <PageTransition>
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Mening profilim</h1>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card padding="lg" className="mb-6">
            <div className="flex items-center gap-5">
              <Avatar name={user.name} size="2xl" />
              <div className="flex-1">
                <p className="text-lg font-display font-semibold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                {profile?.rating_avg !== undefined && profile.rating_avg > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating value={Math.round(profile.rating_avg)} readonly size="sm" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {profile.rating_avg.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
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
              Kasbiy ma'lumotlar
            </h2>
            <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="flex flex-col gap-4">
              <Select
                label="Mutaxassislik"
                options={specOptions}
                value={specId ?? null}
                onChange={(v) => setValue("specialization_id", v ? Number(v) : undefined, { shouldDirty: true })}
                searchable
                placeholder="Mutaxassislikni tanlang"
              />
              <Input
                label="Tajriba (yil)"
                type="number"
                min={0}
                max={60}
                leftIcon={<Briefcase size={16} />}
                {...register("experience_years")}
              />
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                  Bio / O'zingiz haqingizda
                </label>
                <textarea
                  {...register("bio")}
                  placeholder="Mutaxassisligingiz, davolash usullari va tajribangiz haqida yozing..."
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
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
