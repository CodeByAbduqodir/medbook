import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "MedBook haqida: shifokor topish, yozilish va qabul jarayonini bir joyga jamlagan platforma.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
