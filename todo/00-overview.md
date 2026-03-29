# MedBook — Общий план реализации

> Система записи на приём к врачу и получения рецептов.
> Laravel 13 API + Next.js (App Router) + PostgreSQL + Orchid Admin.

---

## Порядок разработки (roadmap)

### Этап 1: Фундамент (Backend) — ~первый
1. Настроить PostgreSQL, `.env`
2. Создать все миграции (см. [01-database.md](01-database.md))
3. Создать модели, связи, enums, casts
4. Factories + Seeders с демо-данными
5. Запустить миграции, проверить схему

### Этап 2: API ядро — ~второй
1. Sanctum аутентификация (register, login, logout)
2. Role middleware
3. Публичные эндпоинты: врачи, специальности, слоты
4. Пациентские эндпоинты: запись, отмена, отзывы
5. Врачебные эндпоинты: расписание, подтверждение, рецепты
6. Form Requests + API Resources
7. Policies для всех ресурсов
8. Services (AppointmentService, SlotService, PrescriptionService)

### Этап 3: Бизнес-логика
1. Логика слотов (генерация, проверка доступности)
2. Транзакции + lockForUpdate при бронировании
3. Уведомления (email + database)
4. Пересчёт рейтинга врача (observer)

### Этап 4: Тесты Backend
1. 8+ Feature Tests (см. [02-backend.md](02-backend.md), фаза 8)
2. Pint форматирование
3. Прогон всего test suite

### Этап 5: Orchid Admin Panel
1. Установка Orchid
2. Dashboard экран со статистикой
3. CRUD: Users, Doctors, Specializations, Appointments, Reviews
4. Модерация отзывов
5. Настройки системы

### Этап 6: Frontend (Next.js) — ~третий
1. Инициализация Next.js проекта
2. Дизайн-система: компоненты UI Kit
3. Layout: Navbar, Sidebar, Footer, Page Transitions
4. Публичные страницы: главная, каталог врачей, профиль врача
5. Auth: регистрация, вход
6. Dashboard пациента: записи, рецепты, профиль
7. Dashboard врача: расписание, записи, рецепты, пациенты
8. Анимации и вау-эффекты (framer-motion)
9. Тёмная тема
10. Mobile responsive

### Этап 7: Интеграция и полировка
1. Связать фронт с бэком (API клиент, обработка ошибок)
2. E2E проверка всех user flows
3. SEO: metadata, structured data
4. Performance: lazy loading, bundle optimization
5. Финальный прогон тестов

### Этап 8: Продакшен
1. Настройка production `.env`
2. `php artisan optimize`, `npm run build`
3. Настройка веб-сервера (Nginx) — Laravel API + Next.js
4. SSL сертификат
5. Cron: `schedule:run` (если есть scheduled tasks)
6. Queue worker для уведомлений
7. Backup стратегия (БД)
8. Мониторинг (Laravel Telescope или аналог)

---

## Детальные планы

| Файл | Содержание |
|---|---|
| [01-database.md](01-database.md) | Миграции, модели, связи, seeders |
| [02-backend.md](02-backend.md) | API, auth, policies, services, tests, Orchid |
| [03-frontend.md](03-frontend.md) | Next.js, дизайн, страницы, анимации |

---

## Ключевые архитектурные решения

| Вопрос | Решение |
|---|---|
| Auth | Sanctum SPA (cookie) для Next.js, API tokens как fallback |
| Архитектура Backend | Controller → Service → Model (не Repository ради простоты) |
| Слоты | Генерируются динамически из schedules, не хранятся в БД |
| Рецепты | Просмотр через API, без PDF генерации |
| Фронт стейт | React Query (серверный стейт) + zustand (клиентский, если нужен) |
| Анимации | Framer Motion для page transitions + scroll animations |
| Стили | Tailwind CSS 4 |
| Формы | react-hook-form + zod |
| Admin | Orchid Platform (отдельно от Next.js, через Laravel routes) |

---

## Критерии готовности (из ТЗ)

- [ ] Пациент записывается без конфликтов времени
- [ ] Врач видит записи в расписании
- [ ] Врач выписывает рецепт после приёма
- [ ] Пациент просматривает рецепты в личном кабинете
- [ ] Админ управляет всем через Orchid
- [ ] Код проходит Pint + тесты
- [ ] БД нормализована до 3НФ
