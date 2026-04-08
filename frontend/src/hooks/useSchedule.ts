import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorApi } from "@/lib/api";
import type { Schedule } from "@/lib/types";
import toast from "react-hot-toast";

export function useSchedule() {
  return useQuery({
    queryKey: ["doctor-schedule"],
    queryFn: async () => {
      const res = await doctorApi.getSchedule();
      return res.data.data as Schedule[];
    },
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      schedules: {
        day_of_week: number;
        start_time: string;
        end_time: string;
        is_active: boolean;
      }[]
    ) => doctorApi.updateSchedule(schedules),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-schedule"] });
      toast.success("Jadval saqlandi");
    },
    onError: () => toast.error("Jadvalni saqlab bo'lmadi"),
  });
}
