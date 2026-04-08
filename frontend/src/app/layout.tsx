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
    default: "MedBook — Shifokorga onlayn yozilish",
    template: "%s | MedBook",
  },
  description:
    "Eng yaxshi shifokorlarga onlayn yoziling. Qulay jadval, tezkor tasdiq va shaxsiy kabinetdagi retseptlar.",
  keywords: ["shifokor", "qabul", "onlayn", "tibbiyot", "sog'liq"],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "MedBook",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} font-sans transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
