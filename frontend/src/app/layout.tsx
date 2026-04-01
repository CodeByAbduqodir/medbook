import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MedBook — Запись к врачу онлайн",
    template: "%s | MedBook",
  },
  description:
    "Запишитесь к лучшим врачам онлайн. Удобное расписание, мгновенное подтверждение, рецепты в личном кабинете.",
  keywords: ["врач", "запись к врачу", "онлайн", "медицина", "здоровье"],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "MedBook",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
