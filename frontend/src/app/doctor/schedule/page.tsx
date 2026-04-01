"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useSchedule, useUpdateSchedule } from "@/hooks/useSchedule";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDayName } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Schedule } from "@/lib/types";

const DAYS = [1, 2, 3, 4, 5, 6, 0]; // Mon→Sun

const DEFAULT_SCHEDULE: Schedule[] = DAYS.map((d) => ({
  day_of_week: d,
  start_time: "09:00",
  end_time: "18:00",
  is_active: d >= 1 && d <= 5,
}));

const SLOT_TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export default function DoctorSchedulePage() {
  const { data: apiSchedule, isLoading } = useSchedule();
  const updateMutation = useUpdateSchedule();
  const [schedule, setSchedule] = useState<Schedule[]>(DEFAULT_SCHEDULE);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (apiSchedule && apiSchedule.length > 0) {
      // Merge API data with defaults for all 7 days
      const merged = DAYS.map((d) => {
        const found = apiSchedule.find((s) => s.day_of_week === d);
        return found ?? DEFAULT_SCHEDULE.find((s) => s.day_of_week === d)!;
      });
      setSchedule(merged);
    }
  }, [apiSchedule]);

  const update = (dayOfWeek: number, field: keyof Schedule, value: string | boolean) => {
    setSchedule((prev) =>
      prev.map((s) => (s.day_of_week === dayOfWeek ? { ...s, [field]: value } : s))
    );
    setIsDirty(true);
  };

  const handleSave = async () => {
    await updateMutation.mutateAsync(schedule);
    setIsDirty(false);
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Расписание</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Настройте рабочие часы для каждого дня</p>
          </div>
          <Button
            variant="gradient"
            size="md"
            leftIcon={<Save size={15} />}
            isLoading={updateMutation.isPending}
            disabled={!isDirty}
            onClick={handleSave}
          >
            Сохранить
          </Button>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-20" rounded="lg" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {schedule.map((day, i) => (
              <motion.div
                key={day.day_of_week}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  padding="md"
                  className={cn(
                    "transition-all duration-300",
                    !day.is_active && "opacity-60"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Day name */}
                    <div className="w-28 shrink-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {getDayName(day.day_of_week)}
                      </p>
                      <p className={cn("text-xs font-medium mt-0.5", day.is_active ? "text-green-600 dark:text-green-400" : "text-gray-400")}>
                        {day.is_active ? "Рабочий" : "Выходной"}
                      </p>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => update(day.day_of_week, "is_active", !day.is_active)}
                      className={cn("shrink-0 transition-colors duration-200", day.is_active ? "text-primary-600 dark:text-primary-400" : "text-gray-300 dark:text-gray-600")}
                    >
                      {day.is_active ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
                    </button>

                    {/* Time pickers */}
                    {day.is_active && (
                      <div className="flex-1 flex items-center gap-3 ml-2">
                        <div className="flex items-center gap-1.5 flex-1">
                          <Clock size={13} className="text-gray-400 shrink-0" />
                          <select
                            value={day.start_time}
                            onChange={(e) => update(day.day_of_week, "start_time", e.target.value)}
                            className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            {SLOT_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <span className="text-gray-400 text-sm">—</span>
                        <div className="flex items-center gap-1.5 flex-1">
                          <select
                            value={day.end_time}
                            onChange={(e) => update(day.day_of_week, "end_time", e.target.value)}
                            className="flex-1 h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 px-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            {SLOT_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
