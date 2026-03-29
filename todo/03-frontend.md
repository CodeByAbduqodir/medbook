# MedBook — Frontend (Next.js)

> **Архитектура:** Next.js (App Router) как отдельное SPA-приложение,
> взаимодействует с Laravel API через Sanctum (cookie-based SPA auth или Bearer tokens).

---

## Фаза 0: Инициализация проекта

- [ ] Создать Next.js приложение: `npx create-next-app@latest frontend --typescript --tailwind --app --src-dir`
- [ ] Установить зависимости:
  - `axios` — HTTP клиент
  - `@tanstack/react-query` — кэширование и синхронизация данных
  - `react-hook-form` + `zod` — формы и валидация
  - `framer-motion` — анимации и вау-эффекты
  - `lucide-react` — иконки
  - `date-fns` — работа с датами
  - `react-hot-toast` — уведомления
  - `tailwind-merge` + `clsx` — утилиты для классов
  - `nuqs` — типобезопасные search params
- [ ] Настроить API клиент (axios instance с baseURL, interceptors для токена и ошибок)
- [ ] Настроить CORS в Laravel для Next.js домена

---

## Фаза 1: Дизайн-система и UI Kit

### Концепция дизайна
> **Стиль:** Современный медицинский — чистый, спокойный, доверительный.
> Основные цвета: глубокий синий (#1E40AF) + бирюзовый (#0D9488) + белый.
> Акцент: мятный (#34D399) для успешных действий.
> Скругления, мягкие тени, градиенты на ключевых элементах.

### 1.1 Базовые компоненты
- [ ] `Button` — варианты: primary, secondary, outline, ghost, danger; размеры: sm, md, lg; состояния: loading с spinner
- [ ] `Input` — с label, error message, иконкой; варианты: text, email, password, phone, date
- [ ] `Select` — кастомный dropdown с поиском
- [ ] `Card` — с hover-анимацией (подъём + тень), варианты: default, interactive, glass
- [ ] `Badge` — для статусов (pending=yellow, confirmed=blue, completed=green, cancelled=red)
- [ ] `Avatar` — с fallback на инициалы, индикатор онлайн
- [ ] `Modal` — с анимацией появления (scale + fade), backdrop blur
- [ ] `Skeleton` — компоненты загрузки для каждого блока
- [ ] `StarRating` — интерактивный + display-only с половинками
- [ ] `EmptyState` — красивая иллюстрация + текст + CTA

### 1.2 Layout компоненты
- [ ] `Navbar` — sticky, прозрачность при скролле → заливка; лого, навигация, user menu dropdown
- [ ] `Sidebar` — для dashboard (desktop: fixed, mobile: slide-in drawer)
- [ ] `Footer` — контакты, ссылки, copyright
- [ ] `PageTransition` — анимация перехода между страницами (framer-motion)
- [ ] `Container` — max-width wrapper

---

## Фаза 2: Публичные страницы

### 2.1 Главная страница `/`
- [ ] **Hero секция:**
  - Большой заголовок с градиентным текстом: "Ваше здоровье — наш приоритет"
  - Анимированный поиск врача (typewriter effect в placeholder)
  - Floating карточки врачей на фоне (parallax при скролле)
  - CTA кнопка "Найти врача" с pulse анимацией
- [ ] **Как это работает** — 3 шага с иконками, анимация появления при скролле (stagger)
- [ ] **Популярные специальности** — горизонтальный scroll с карточками, иконки для каждой
- [ ] **Лучшие врачи** — карусель с рейтингом, отзывами, кнопкой записи
- [ ] **Статистика** — counter animation (1000+ пациентов, 50+ врачей и т.д.)
- [ ] **Отзывы пациентов** — карусель с цитатами

### 2.2 Каталог врачей `/doctors`
- [ ] **Фильтры (sidebar или top bar):**
  - Специализация (multi-select с чипсами)
  - Дата (date picker) — показать только врачей со свободными слотами
  - Рейтинг (slider или звёзды)
  - Поиск по имени (debounced input)
- [ ] **Список врачей** — grid карточек (3 колонки desktop, 1 mobile)
  - Фото, имя, специальность, рейтинг (звёзды), стаж, краткое bio
  - Hover: подъём карточки + показ кнопки "Записаться"
  - Skeleton при загрузке
- [ ] **Пагинация** — infinite scroll или numbered
- [ ] **Анимация:** stagger появление карточек, smooth filter transitions

### 2.3 Профиль врача `/doctors/[id]`
- [ ] **Шапка:** большое фото, имя, специальность, рейтинг, стаж, bio
- [ ] **Табы** (с анимацией underline):
  - **Расписание** — календарь на неделю, кликабельные слоты (свободные зелёные, занятые серые)
  - **Отзывы** — список с рейтингом, комментариями, пагинация
  - **О враче** — подробное описание, образование
- [ ] **Запись** — модальное окно при выборе слота: подтверждение даты/времени, кнопка "Записаться"
- [ ] **Анимация:** smooth tab transition, slot selection (scale + color change)

### 2.4 Регистрация `/register` и Вход `/login`
- [ ] **Split layout:** форма слева, иллюстрация/градиент справа
- [ ] **Форма регистрации:** имя, email, пароль, подтверждение пароля
  - Real-time валидация (zod)
  - Password strength indicator (animated bar)
  - Animated focus states на inputs
- [ ] **Форма входа:** email, пароль, "Забыли пароль?", "Нет аккаунта?"
- [ ] **Переход** между login ↔ register: slide анимация

---

## Фаза 3: Личный кабинет пациента

### 3.1 Dashboard `/dashboard`
- [ ] **Приветствие** с именем + время суток ("Доброе утро, Анна!")
- [ ] **Ближайшая запись** — большая карточка с обратным отсчётом (countdown timer)
- [ ] **Быстрые действия** — карточки: "Найти врача", "Мои записи", "Мои рецепты"
- [ ] **Последние уведомления** — список с иконками

### 3.2 Мои записи `/dashboard/appointments`
- [ ] **Табы:** Предстоящие / Прошедшие / Отменённые
- [ ] **Карточки записей:**
  - Врач (фото, имя, специальность), дата, время, статус (badge)
  - Действия: "Отменить" (для pending/confirmed), "Оставить отзыв" (для completed)
  - Expand → детали: диагноз, рецепты
- [ ] **Модалка отмены** с причиной (необязательная)
- [ ] **Анимация:** list stagger, status badge pulse при смене

### 3.3 Мои рецепты `/dashboard/prescriptions`
- [ ] **Список рецептов** — карточки: препарат, дозировка, врач, дата
- [ ] **Expand** — полная информация: инструкция, курс, дозировка

### 3.4 Профиль `/dashboard/profile`
- [ ] **Форма редактирования:** телефон, дата рождения, адрес
- [ ] **Аватар** — upload с preview и crop
- [ ] **Смена пароля** — отдельная секция

### 3.5 Форма отзыва
- [ ] **Модальное окно** после completed записи:
  - Интерактивные звёзды (hover + click анимация, scale bounce)
  - Textarea для комментария
  - Анимация отправки (confetti или checkmark animation)

---

## Фаза 4: Личный кабинет врача

### 4.1 Dashboard `/doctor`
- [ ] **Сводка дня:** количество записей сегодня, следующий пациент (карточка)
- [ ] **Мини-расписание** на сегодня (timeline view)
- [ ] **Статистика:** пациентов за неделю/месяц, средний рейтинг (animated counter)

### 4.2 Расписание `/doctor/schedule`
- [ ] **Недельная сетка** — drag & drop или toggle для каждого дня
- [ ] **Настройка часов:** start_time / end_time для каждого дня
- [ ] **Toggle** активации дня
- [ ] **Preview** сгенерированных слотов
- [ ] **Save** с toast уведомлением

### 4.3 Записи `/doctor/appointments`
- [ ] **Фильтры:** Сегодня / Эта неделя / Все; по статусу
- [ ] **Timeline view** (вертикальная линия + карточки) для сегодня
- [ ] **Действия:** Подтвердить (pending → confirmed), Завершить (→ form для диагноза), Отменить
- [ ] **Модалка завершения:** textarea диагноз + кнопка "Завершить приём"

### 4.4 Создание рецепта
- [ ] **Форма** (в модалке или отдельной странице):
  - Dynamic fields: добавить несколько препаратов (кнопка "+")
  - Для каждого: название, дозировка, инструкция, длительность
  - Preview перед сохранением
- [ ] **Автокомплит** названия препарата (из справочника, если есть)

### 4.5 Мои пациенты `/doctor/patients`
- [ ] **Список пациентов** с историей посещений
- [ ] **Поиск** по имени
- [ ] **Expand** — история записей к этому врачу, рецепты

### 4.6 Профиль врача `/doctor/profile`
- [ ] **Редактирование:** специализация, стаж, bio, фото
- [ ] **Preview** как видят пациенты

---

## Фаза 5: Вау-эффекты и анимации

### 5.1 Глобальные
- [ ] **Page transitions** — плавные переходы между страницами (framer-motion AnimatePresence)
- [ ] **Scroll animations** — элементы появляются при скролле (fade-up, slide-in)
- [ ] **Micro-interactions** — кнопки (press scale), hover effects, focus rings
- [ ] **Loading states** — skeleton screens + shimmer эффект повсюду
- [ ] **Toast notifications** — slide-in справа с иконками и progress bar

### 5.2 Специфичные
- [ ] **Hero:** градиентный текст с анимацией, floating элементы (pulse + float)
- [ ] **Календарь слотов:** слоты появляются с stagger, выбранный — bounce + glow
- [ ] **Статусы записей:** animated transitions при смене статуса (color morph)
- [ ] **Звёзды рейтинга:** fill анимация при hover, bounce при клике
- [ ] **Countdown** до ближайшей записи — flip-clock стиль
- [ ] **Success states** — checkmark анимация (draw SVG path)
- [ ] **Empty states** — мягкие иллюстрации с bounce-in анимацией

### 5.3 Responsive
- [ ] Mobile-first подход
- [ ] Hamburger menu → slide-in drawer с backdrop blur
- [ ] Bottom navigation на мобильных (dashboard)
- [ ] Touch-friendly элементы (мин. 44px tap targets)
- [ ] Swipe для действий на карточках записей (мобильные)

---

## Фаза 6: Тёмная тема

- [ ] CSS переменные для цветов через Tailwind
- [ ] Toggle в навбаре (sun/moon иконка с rotation анимацией)
- [ ] Сохранение выбора в localStorage
- [ ] Тёмные варианты всех компонентов
- [ ] `prefers-color-scheme` по умолчанию

---

## Фаза 7: SEO и производительность

- [ ] Metadata для каждой страницы (title, description, og:image)
- [ ] Structured data (JSON-LD) для врачей (MedicalBusiness schema)
- [ ] Image optimization через Next.js Image
- [ ] Lazy loading для тяжёлых компонентов
- [ ] React Query — stale-while-revalidate для данных
- [ ] Bundle analysis и code splitting
