import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://medbook.test/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("medbook_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 - clear token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("medbook_token");
        localStorage.removeItem("medbook_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ===== Auth =====

export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
  }) => api.post("/v1/auth/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/v1/auth/login", data),

  logout: () => api.post("/v1/auth/logout"),

  getUser: () => api.get("/v1/auth/user"),
};

// ===== Public =====

export const publicApi = {
  getDoctors: (params?: Record<string, unknown>) =>
    api.get("/v1/doctors", { params }),

  getDoctor: (id: number | string) => api.get(`/v1/doctors/${id}`),

  getDoctorSlots: (id: number | string, date: string) =>
    api.get(`/v1/doctors/${id}/slots`, { params: { date } }),

  getSpecializations: () => api.get("/v1/specializations"),
};

// ===== Patient =====

export const patientApi = {
  getAppointments: (params?: Record<string, unknown>) =>
    api.get("/v1/appointments", { params }),

  getAppointment: (id: number) => api.get(`/v1/appointments/${id}`),

  storeAppointment: (data: { doctor_id: number; start_time: string }) =>
    api.post("/v1/appointments", data),

  cancelAppointment: (id: number, reason?: string) =>
    api.patch(`/v1/appointments/${id}/cancel`, { reason }),

  reviewAppointment: (
    id: number,
    data: { rating: number; comment?: string }
  ) => api.post(`/v1/appointments/${id}/review`, data),

  getPrescriptions: (params?: Record<string, unknown>) =>
    api.get("/v1/prescriptions", { params }),

  getPrescription: (id: number) => api.get(`/v1/prescriptions/${id}`),

  getProfile: () => api.get("/v1/profile"),

  updateProfile: (data: Record<string, unknown>) =>
    api.put("/v1/profile", data),
};

// ===== Doctor =====

export const doctorApi = {
  getAppointments: (params?: Record<string, unknown>) =>
    api.get("/v1/doctor/appointments", { params }),

  confirmAppointment: (id: number) =>
    api.patch(`/v1/doctor/appointments/${id}/confirm`),

  completeAppointment: (id: number, diagnosis: string) =>
    api.patch(`/v1/doctor/appointments/${id}/complete`, { diagnosis }),

  cancelAppointment: (id: number, reason?: string) =>
    api.patch(`/v1/doctor/appointments/${id}/cancel`, { reason }),

  storePrescription: (
    appointmentId: number,
    data: {
      medicine_name: string;
      dosage: string;
      instructions: string;
      duration: string;
    }
  ) => api.post(`/v1/doctor/appointments/${appointmentId}/prescriptions`, data),

  getSchedule: () => api.get("/v1/doctor/schedule"),

  updateSchedule: (
    schedules: {
      day_of_week: number;
      start_time: string;
      end_time: string;
      is_active: boolean;
    }[]
  ) => api.put("/v1/doctor/schedule", { schedules }),

  getPatients: (params?: Record<string, unknown>) =>
    api.get("/v1/doctor/patients", { params }),

  getProfile: () => api.get("/v1/doctor/profile"),

  updateProfile: (data: Record<string, unknown>) =>
    api.put("/v1/doctor/profile", data),
};
