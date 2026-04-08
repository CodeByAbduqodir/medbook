// ===== Enums =====

export type UserRole = "patient" | "doctor" | "admin";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

// ===== Models =====

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Profile {
  id: number;
  user_id: number;
  phone: string | null;
  birth_date: string | null;
  address: string | null;
  avatar: string | null;
  avatar_url: string | null;
}

export interface Specialization {
  id: number;
  name: string;
  description: string | null;
}

export interface DoctorProfile {
  id: number;
  user_id: number;
  specialization_id: number;
  experience_years: number;
  bio: string | null;
  rating_avg: number;
  specialization?: Specialization;
}

export interface Schedule {
  day_of_week: number; // 0=Sunday, 1=Monday...6=Saturday
  start_time: string; // "09:00"
  end_time: string; // "17:00"
  is_active: boolean;
}

export interface TimeSlot {
  start_time: string; // ISO datetime
  end_time: string;
  is_available: boolean;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  role: "doctor";
  doctor_profile: DoctorProfile | null;
  profile: Profile | null;
  specialization?: Specialization;
  experience_years?: number;
  bio?: string | null;
  rating_avg?: number;
}

export interface DoctorDetail extends Doctor {
  schedules: Schedule[];
  reviews: Review[];
}

export interface Appointment {
  id: number;
  doctor_id: number;
  patient_id: number;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  diagnosis: string | null;
  cancelled_by: number | null;
  doctor?: Doctor;
  patient?: User;
  prescriptions?: Prescription[];
  review?: Review | null;
  created_at: string;
}

export interface Prescription {
  id: number;
  appointment_id: number;
  medicine_name: string;
  dosage: string;
  instructions: string;
  duration: string;
  appointment?: Appointment;
  created_at: string;
}

export interface Review {
  id: number;
  appointment_id: number;
  rating: number;
  comment: string | null;
  is_approved: boolean;
  patient_name?: string;
  created_at: string;
}

// ===== API Response shapes =====

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

// ===== Auth =====

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: UserRole;
}

export interface AuthResponse {
  data: AuthUser;
  token: string;
}

// ===== Request payloads =====

export interface StoreAppointmentPayload {
  doctor_id: number;
  start_time: string;
}

export interface StoreReviewPayload {
  rating: number;
  comment?: string;
}

export interface StorePrescriptionPayload {
  medicine_name: string;
  dosage: string;
  instructions: string;
  duration: string;
}

export interface UpdateProfilePayload {
  phone?: string;
  birth_date?: string;
  address?: string;
}

export interface UpdateSchedulePayload {
  schedules: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active: boolean;
  }[];
}

export interface DoctorFilters {
  specialization_id?: number;
  rating_min?: number;
  search?: string;
  date?: string;
  page?: number;
}
