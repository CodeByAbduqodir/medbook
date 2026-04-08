import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientApi, doctorApi } from "@/lib/api";
import type { Prescription } from "@/lib/types";
import toast from "react-hot-toast";

export function usePatientPrescriptions(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["patient-prescriptions", params],
    queryFn: async () => {
      const res = await patientApi.getPrescriptions(params);
      return res.data.data as Prescription[];
    },
  });
}

export function usePrescription(id: number | null) {
  return useQuery({
    queryKey: ["prescription", id],
    queryFn: async () => {
      const res = await patientApi.getPrescription(id!);
      return res.data.data as Prescription;
    },
    enabled: !!id,
  });
}

export function useStorePrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      data,
    }: {
      appointmentId: number;
      data: {
        medicine_name: string;
        dosage: string;
        instructions: string;
        duration: string;
      };
    }) => doctorApi.storePrescription(appointmentId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Retsept yozildi");
    },
    onError: () => toast.error("Retsept yozib bo'lmadi"),
  });
}
