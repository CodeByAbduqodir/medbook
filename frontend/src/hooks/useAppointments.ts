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
      toast.success("Запись отменена");
    },
    onError: () => toast.error("Не удалось отменить запись"),
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
      toast.success("Вы записаны!");
    },
    onError: () => toast.error("Не удалось записаться"),
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
      toast.success("Отзыв отправлен!");
    },
    onError: () => toast.error("Не удалось отправить отзыв"),
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
      toast.success("Приём подтверждён");
    },
    onError: () => toast.error("Ошибка подтверждения"),
  });
}

export function useCompleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, diagnosis }: { id: number; diagnosis: string }) =>
      doctorApi.completeAppointment(id, diagnosis),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Приём завершён");
    },
    onError: () => toast.error("Ошибка завершения"),
  });
}

export function useDoctorCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      doctorApi.cancelAppointment(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Запись отменена");
    },
    onError: () => toast.error("Не удалось отменить"),
  });
}
