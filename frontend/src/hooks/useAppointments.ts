import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientApi, doctorApi } from "@/lib/api";
import type { Appointment } from "@/lib/types";
import toast from "react-hot-toast";

export function usePatientAppointments(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["patient-appointments", params],
    queryFn: async () => {
      const res = await patientApi.getAppointments(params);
      return res.data.data as Appointment[];
    },
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      patientApi.cancelAppointment(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient-appointments"] });
      toast.success("Qabul bekor qilindi");
    },
    onError: () => toast.error("Qabulni bekor qilib bo'lmadi"),
  });
}

export function useBookAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { doctor_id: number; start_time: string }) =>
      patientApi.storeAppointment(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient-appointments"] });
      qc.invalidateQueries({ queryKey: ["doctor-slots"] });
      toast.success("Siz yozildingiz!");
    },
    onError: () => toast.error("Yozib bo'lmadi"),
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: number;
      data: { rating: number; comment?: string };
    }) => patientApi.reviewAppointment(appointmentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["patient-appointments"] });
      toast.success("Fikr yuborildi!");
    },
    onError: () => toast.error("Fikrni yuborib bo'lmadi"),
  });
}

// Doctor-side hooks
export function useDoctorAppointments(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["doctor-appointments", params],
    queryFn: async () => {
      const res = await doctorApi.getAppointments(params);
      return res.data.data as Appointment[];
    },
  });
}

export function useConfirmAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => doctorApi.confirmAppointment(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Qabul tasdiqlandi");
    },
    onError: () => toast.error("Tasdiqlashda xatolik"),
  });
}

export function useCompleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, diagnosis }: { id: number; diagnosis: string }) =>
      doctorApi.completeAppointment(id, diagnosis),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Qabul yakunlandi");
    },
    onError: () => toast.error("Yakunlashda xatolik"),
  });
}

export function useDoctorCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      doctorApi.cancelAppointment(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Qabul bekor qilindi");
    },
    onError: () => toast.error("Bekor qilib bo'lmadi"),
  });
}
