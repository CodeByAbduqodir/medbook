# 🏥 MedBook

Система записи к врачам онлайн — современное web-приложение для бронирования медицинских консультаций.

## 📋 Описание проекта

MedBook — это full-stack приложение для онлайн-записи к врачам, которое позволяет:

- **Пациентам**: Искать врачей, записываться на приём, отслеживать записи, просматривать рецепты и оставлять отзывы
- **Врачам**: Управлять расписанием, подтверждать записи, завершать приёмы, выписывать рецепты
- **Админам**: Управлять пользователями, специализациями и данными врачей

## 🛠️ Технологический стек

### Backend (Laravel)
- **Laravel 11** — PHP фреймворк
- **MySQL** — База данных
- **JWT Auth** — Аутентификация
- **Laravel Scout** — Поиск (опционально)
- **Queues** — Асинхронные задачи
- **Orchid** — Админ-панель

### Frontend (Next.js 15)
- **Next.js 15** — React фреймворк с App Router
- **TypeScript** — Типизация
- **Tailwind CSS 4** — Стилизация
- **Framer Motion** — Анимации
- **React Query** — Управление состоянием и кэширование
- **Zod** — Валидация форм
- **React Hook Form** — Управление формами
- **Lucide Icons** — Иконки

## 🚀 Быстрый старт

### Требования
- **PHP** >= 8.2
- **Node.js** >= 18
- **Composer**
- **MySQL** >= 5.7 или PostgreSQL

### Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/CodeByAbduqodir/medbook.git
cd medbook
```

2. **Установите зависимости Backend**
```bash
composer install
```

3. **Установите зависимости Frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Настройте окружение**
```bash
cp .env.example .env
```

5. **Сгенерируйте ключ приложения**
```bash
php artisan key:generate
```

6. **Создайте базу данных и выполните миграции**
```bash
php artisan migrate
```

7. **Заполните базу тестовыми данными**
```bash
php artisan db:seed
```

## ▶️ Запуск проекта

### Вариант 1: Раздельный запуск (для разработки)

**Backend (Terminal 1):**
```bash
php artisan serve --host=0.0.0.0 --port=8000
```
Доступно по: `http://localhost:8000`

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
Доступно по: `http://localhost:3000`

### Вариант 2: Единый скрипт (рекомендуется) ⭐

Запускает frontend и backend одновременно с цветным выводом логов:

```bash
npm run dev:full
```

**Или напрямую:**
```bash
./dev.sh
```

**Результат:**
```
[INFO] 🚀 Запуск MedBook Frontend & Backend...

[INFO] Backend: http://localhost:8000
[INFO] Frontend: http://localhost:3000

[INFO] Нажмите Ctrl+C для остановки

===============================================

[BACKEND]  INFO  Server running on [http://127.0.0.1:8000]
[FRONTEND]  ◯ Ready in 1.2s
```

## 📂 Структура проекта

```
medbook/
├── app/                    # Laravel application code
│   ├── Http/              # Controllers, Middleware, Requests
│   ├── Models/            # Eloquent models
│   ├── Services/          # Business logic
│   └── Orchid/           # Admin panel
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/          # Utilities & API
│   │   └── hooks/        # Custom hooks
│   └── public/           # Static assets
├── database/              # Migrations & Seeders
├── routes/               # API routes
├── storage/              # Laravel storage
└── dev.sh               # Unified dev script ⭐
```

## 🎨 Основные фичи

### 📱 Публичные страницы
- Главная страница с hero section
- Каталог врачей с фильтрами и поиском
- Детальная страница врача с расписанием
- Авторизация и регистрация

### 👤 Dashboard пациента
- Личный кабинет со статистикой
- Управление записями (отмена, отзывы)
- Список рецептов с инструкциями
- Редактирование профиля
- **Countdown timer до ближайшей записи** ⏰

### 👨‍⚕️ Dashboard врача
- Расписание пациентов на сегодня
- Управление записями (подтверждение, завершение)
- Настройка рабочего расписания
- Список пациентов с историей визитов
- Выписка рецептов
- **Success animation после завершения приёма** ✅

### 🌙 Тёмная тема
- Полная поддержка тёмной темы
- Переключатель в Navbar
- Сохранение предпочтений в localStorage

### ✨ Анимации и UX
- Page transitions (fade-in, slide)
- Scroll animations (intersection observer)
- Loading skeletons
- Toast notifications
- Hover и micro-interactions
- Float animations для карточек
- Blob animations в hero section

## 📝 API Документация

API доступен по: `http://localhost:8000/api`

Основные эндпоинты:
- `POST /api/auth/login` — Вход
- `POST /api/auth/register` — Регистрация
- `GET /api/doctors` — Список врачей
- `GET /api/doctors/{id}` — Детали врача
- `GET /api/doctors/{id}/slots` — Свободные слоты
- `POST /api/appointments` — Создать запись
- и другие...

## 🧪 Тестирование

**Backend тесты:**
```bash
php artisan test
```

**Frontend тесты:**
```bash
cd frontend
npm test
```

## 📦 Сборка для production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
```

## 🔧 Дополнительные команды

```bash
# Очистка кэша Laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Очистка кэша Frontend
cd frontend
rm -rf .next

# Создать миграцию
php artisan make:migration create_table_name

# Создать контроллер
php artisan make:controller ControllerName
```

## 🤝 Вклад в проект

1. Fork проект
2. Создайте ветку (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензируется под MIT License — подробности в файле LICENSE.

## 👨‍💻 Автор

Разработано с ❤️ для медучреждений

---

**Наслаждайтесь разработкой с MedBook!** 🚀