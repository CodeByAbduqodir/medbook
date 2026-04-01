import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, pattern = "d MMMM yyyy"): string {
  return format(parseISO(date), pattern, { locale: ru });
}

export function formatDateTime(date: string): string {
  return format(parseISO(date), "d MMMM yyyy, HH:mm", { locale: ru });
}

export function formatTime(date: string): string {
  return format(parseISO(date), "HH:mm");
}

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ru });
}

export const DAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export const DAY_NAMES_SHORT = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function getDayName(dayOfWeek: number, short = false): string {
  return short ? DAY_NAMES_SHORT[dayOfWeek] : DAY_NAMES[dayOfWeek];
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function getAvatarUrl(name: string, size = 80): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=1d4ed8&color=ffffff&bold=true`;
}

export function formatRating(rating: number | string): string {
  return Number(rating).toFixed(1);
}

export function pluralize(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 19) {
    return `${count} ${many}`;
  }
  if (mod10 === 1) {
    return `${count} ${one}`;
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} ${few}`;
  }
  return `${count} ${many}`;
}

export function getStatusColor(
  status: string
): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  const map: Record<
    string,
    { bg: string; text: string; border: string; dot: string }
  > = {
    pending: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      dot: "bg-amber-400",
    },
    confirmed: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      dot: "bg-blue-400",
    },
    completed: {
      bg: "bg-green-50 dark:bg-green-950/30",
      text: "text-green-700 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      dot: "bg-green-400",
    },
    cancelled: {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-700 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      dot: "bg-red-400",
    },
  };
  return (
    map[status] || {
      bg: "bg-gray-50",
      text: "text-gray-700",
      border: "border-gray-200",
      dot: "bg-gray-400",
    }
  );
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Ожидает",
    confirmed: "Подтверждён",
    completed: "Завершён",
    cancelled: "Отменён",
  };
  return labels[status] || status;
}
