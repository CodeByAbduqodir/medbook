# MedBook — База данных и модели

## Фаза 1: Настройка PostgreSQL

- [ ] Установить и настроить PostgreSQL (`.env` — DB_CONNECTION=pgsql)
- [ ] Проверить подключение через `php artisan migrate`

---

## Фаза 2: Миграции (в порядке создания)

### 2.1 Расширение таблицы `users`
- [ ] Добавить поле `role` (enum: `patient`, `doctor`, `admin`), default = `patient`

### 2.2 Таблица `profiles`
- [ ] `id`, `user_id` (FK → users, unique), `phone`, `birth_date`, `address`, `avatar`
- [ ] Индекс на `user_id`

### 2.3 Таблица `specializations`
- [ ] `id`, `name` (unique), `description` (nullable)

### 2.4 Таблица `doctor_profiles`
- [ ] `id`, `user_id` (FK → users, unique), `specialization_id` (FK → specializations)
- [ ] `experience_years` (smallint), `bio` (text, nullable), `rating_avg` (decimal 3,2, default 0)
- [ ] Индексы: `specialization_id`, `rating_avg`

### 2.5 Таблица `schedules`
- [ ] `id`, `doctor_id` (FK → users), `day_of_week` (tinyint 0-6), `start_time` (time), `end_time` (time), `is_active` (bool, default true)
- [ ] Уникальный составной индекс: (`doctor_id`, `day_of_week`)

### 2.6 Таблица `appointments`
- [ ] `id`, `doctor_id` (FK → users), `patient_id` (FK → users)
- [ ] `start_time` (datetime), `end_time` (datetime)
- [ ] `status` (enum: `pending`, `confirmed`, `completed`, `cancelled`), default = `pending`
- [ ] `diagnosis` (text, nullable)
- [ ] `cancelled_by` (FK → users, nullable)
- [ ] Индексы: (`doctor_id`, `start_time`), (`patient_id`, `start_time`), `status`

### 2.7 Таблица `prescriptions`
- [ ] `id`, `appointment_id` (FK → appointments)
- [ ] `medicine_name`, `dosage`, `instructions` (text), `duration` (string)
- [ ] Индекс на `appointment_id`

### 2.8 Таблица `reviews`
- [ ] `id`, `appointment_id` (FK → appointments, unique)
- [ ] `rating` (tinyint 1-5), `comment` (text, nullable), `is_approved` (bool, default false)
- [ ] Индексы: `appointment_id`, `is_approved`

---

## Фаза 3: Модели и связи

### 3.1 User
- [ ] `role` — cast к enum `UserRole`
- [ ] Связи: `hasOne(Profile)`, `hasOne(DoctorProfile)`, `hasMany(Appointment, 'patient_id')`, `hasMany(Appointment, 'doctor_id')`
- [ ] Скоупы: `scopePatients()`, `scopeDoctors()`, `scopeAdmins()`
- [ ] Helper: `isPatient()`, `isDoctor()`, `isAdmin()`

### 3.2 Profile
- [ ] `belongsTo(User)`

### 3.3 Specialization
- [ ] `hasMany(DoctorProfile)`

### 3.4 DoctorProfile
- [ ] `belongsTo(User)`, `belongsTo(Specialization)`, `hasMany(Schedule, 'doctor_id', 'user_id')`
- [ ] Метод `recalculateRating()` — пересчитывает `rating_avg` на основе approved reviews

### 3.5 Schedule
- [ ] `belongsTo(User, 'doctor_id')`
- [ ] Метод `generateSlots(date, durationMinutes)` — возвращает массив свободных слотов

### 3.6 Appointment
- [ ] `belongsTo(User, 'doctor_id')`, `belongsTo(User, 'patient_id')`
- [ ] `hasMany(Prescription)`, `hasOne(Review)`
- [ ] Cast `status` к enum `AppointmentStatus`

### 3.7 Prescription
- [ ] `belongsTo(Appointment)`

### 3.8 Review
- [ ] `belongsTo(Appointment)`
- [ ] Observer: при создании/обновлении/удалении → пересчитать `rating_avg` врача

---

## Фаза 4: Seeders и Factories

- [ ] `SpecializationSeeder` — 10-15 базовых специальностей (Терапевт, Хирург, Кардиолог и т.д.)
- [ ] `UserFactory` — состояния: `patient()`, `doctor()`, `admin()`
- [ ] `ProfileFactory`
- [ ] `DoctorProfileFactory`
- [ ] `ScheduleFactory`
- [ ] `AppointmentFactory` — состояния: `pending()`, `confirmed()`, `completed()`, `cancelled()`
- [ ] `PrescriptionFactory`
- [ ] `ReviewFactory`
- [ ] `DatabaseSeeder` — демо данные: 3 врача, 10 пациентов, расписания, записи, рецепты, отзывы

---

## Фаза 5: Индексы и оптимизация

- [ ] Проверить, что все FK имеют индексы
- [ ] Составной индекс на `appointments` (`doctor_id`, `start_time`, `status`) — для быстрого поиска свободных слотов
- [ ] Индекс на `reviews` (`is_approved`) — для расчёта рейтинга
- [ ] Проверить нормализацию до 3НФ
