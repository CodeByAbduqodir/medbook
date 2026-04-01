import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/lib/api";
import type { Doctor, DoctorDetail, DoctorFilters, Specialization, TimeSlot } from "@/lib/types";

export function useDoctors(filters?: DoctorFilters) {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: async () => {
      const res = await publicApi.getDoctors(filters as Record<string, unknown>);
      return res.data.data as Doctor[];
    },
  });
}

export function useDoctor(id: number | string | null) {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const res = await publicApi.getDoctor(id!);
      return res.data.data as DoctorDetail;
    },
    enabled: !!id,
  });
}

export function useDoctorSlots(doctorId: number | string | null, date: string) {
  return useQuery({
    queryKey: ["doctor-slots", doctorId, date],
    queryFn: async () => {
      const res = await publicApi.getDoctorSlots(doctorId!, date);
      return res.data.data as TimeSlot[];
    },
    enabled: !!doctorId && !!date,
  });
}

export function useSpecializations() {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: async () => {
      const res = await publicApi.getSpecializations();
      return res.data.data as Specialization[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
