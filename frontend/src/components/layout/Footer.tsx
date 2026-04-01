import React from "react";
import Link from "next/link";
import { Heart, Phone, Mail, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm">
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-white">MedBook</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-gray-500">
              Удобная запись к врачу онлайн. Лучшие специалисты, мгновенное
              подтверждение, рецепты в личном кабинете.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-teal-500" />
                <span>+7 (800) 123-45-67</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-teal-500" />
                <span>support@medbook.uz</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-teal-500" />
                <span>Ташкент, Узбекистан</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Пациентам
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                { href: "/doctors", label: "Найти врача" },
                { href: "/register", label: "Регистрация" },
                { href: "/login", label: "Войти" },
                { href: "/dashboard", label: "Личный кабинет" },
                { href: "/dashboard/prescriptions", label: "Мои рецепты" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Врачам
            </h4>
            <ul className="flex flex-col gap-2 text-sm">
              {[
                { href: "/register?role=doctor", label: "Стать врачом" },
                { href: "/doctor", label: "Кабинет врача" },
                { href: "/doctor/schedule", label: "Расписание" },
                { href: "/doctor/appointments", label: "Записи" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} MedBook. Все права защищены.
          </p>
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Facebook, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors duration-150"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
