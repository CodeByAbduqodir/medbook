# MedBook — База данных и модели

## Фаза 1: Настройка PostgreSQL ✅

- [x] Установить и настроить PostgreSQL (`.env` — DB_CONNECTION=pgsql)
- [x] Проверить подключение через `php artisan migrate`

---

## Фаза 2: Миграции (в порядке создания) ✅

### 2.1 Расширение таблицы `users`
- [x] Добавить поле `role` (enum: `patient`, `doctor`, `admin`), default = `patient`

### 2.2 Таблица `profiles`
- [x] `id`, `user_id` (FK → users, unique), `phone`, `birth_date`, `address`, `avatar`
- [x] Индекс на `user_id`

### 2.3 Таблица `specializations`
- [x] `id`, `name` (unique), `description` (nullable)

### 2.4 Таблица `doctor_profiles`
- [x] `id`, `user_id` (FK → users, unique), `specialization_id` (FK → specializations)
- [x] `experience_years` (smallint), `bio` (text, nullable), `rating_avg` (decimal 3,2, default 0)
- [x] Индексы: `specialization_id`, `rating_avg`

### 2.5 Таблица `schedules`
- [x] `id`, `doctor_id` (FK → users), `day_of_week` (tinyint 0-6), `start_time` (time), `end_time` (time), `is_active` (bool, default true)
- [x] Уникальный составной индекс: (`doctor_id`, `day_of_week`)

### 2.6 Таблица `appointments`
- [x] `id`, `doctor_id` (FK → users), `patient_id` (FK → users)
- [x] `start_time` (datetime), `end_time` (datetime)
- [x] `status` (enum: `pending`, `confirmed`, `completed`, `cancelled`), default = `pending`
- [x] `diagnosis` (text, nullable)
- [x] `cancelled_by` (FK → users, nullable)
- [x] Индексы: (`doctor_id`, `start_time`), (`patient_id`, `start_time`), `status`

### 2.7 Таблица `prescriptions`
- [x] `id`, `appointment_id` (FK → appointments)
- [x] `medicine_name`, `dosage`, `instructions` (text), `duration` (string)
- [x] Индекс на `appointment_id`

### 2.8 Таблица `reviews`
- [x] `id`, `appointment_id` (FK → appointments, unique)
- [x] `rating` (tinyint 1-5), `comment` (text, nullable), `is_approved` (bool, default false)
- [x] Индексы: `appointment_id`, `is_approved`

---

## Фаза 3: Модели и связи ✅

### 3.1 User
- [x] `role` — cast к enum `UserRole`
- [x] Связи: `hasOne(Profile)`, `hasOne(DoctorProfile)`, `hasMany(Appointment, 'patient_id')`, `hasMany(Appointment, 'doctor_id')`
- [x] Скоупы: `scopePatients()`, `scopeDoctors()`, `scopeAdmins()`
- [x] Helper: `isPatient()`, `isDoctor()`, `isAdmin()`

### 3.2 Profile
- [x] `belongsTo(User)`

### 3.3 Specialization
- [x] `hasMany(DoctorProfile)`

### 3.4 DoctorProfile
- [x] `belongsTo(User)`, `belongsTo(Specialization)`, `hasMany(Schedule, 'doctor_id', 'user_id')`
- [x] Метод `recalculateRating()` — пересчитывает `rating_avg` на основе approved reviews

### 3.5 Schedule
- [x] `belongsTo(User, 'doctor_id')`
- [x] Метод `generateSlots(date, durationMinutes)` — возвращает массив свободных слотов

### 3.6 Appointment
- [x] `belongsTo(User, 'doctor_id')`, `belongsTo(User, 'patient_id')`
- [x] `hasMany(Prescription)`, `hasOne(Review)`
- [x] Cast `status` к enum `AppointmentStatus`

### 3.7 Prescription
- [x] `belongsTo(Appointment)`

### 3.8 Review
- [x] `belongsTo(Appointment)`
- [x] Observer: при создании/обновлении/удалении → пересчитать `rating_avg` врача

---

## Фаза 4: Seeders и Factories ✅

- [x] `SpecializationSeeder` — 15 базовых специальностей (Терапевт, Хирург, Кардиолог и т.д.)
- [x] `UserFactory` — состояния: `patient()`, `doctor()`, `admin()`
- [x] `ProfileFactory`
- [x] `DoctorProfileFactory`
- [x] `ScheduleFactory`
- [x] `AppointmentFactory` — состояния: `pending()`, `confirmed()`, `completed()`, `cancelled()`
- [x] `PrescriptionFactory`
- [x] `ReviewFactory`
- [x] `DatabaseSeeder` — демо данные: 3 врача, 10 пациентов, расписания, записи, рецепты, отзывы

---

## Фаза 5: Индексы и оптимизация ✅

- [x] Проверить, что все FK имеют индексы
- [x] Составной индекс на `appointments` (`doctor_id`, `start_time`, `status`) — для быстрого поиска свободных слотов
- [x] Индекс на `reviews` (`is_approved`) — для расчёта рейтинга
- [x] Проверить нормализацию до 3НФ
