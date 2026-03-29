# MedBook — Backend (Laravel API)

## Фаза 1: Аутентификация и авторизация

### 1.1 Sanctum + Auth
- [ ] Установить Laravel Sanctum (`composer require laravel/sanctum`)
- [ ] Настроить Sanctum для SPA (stateful domains) или API tokens
- [ ] Эндпоинты:
  - `POST /api/v1/auth/register` — регистрация (name, email, password, role=patient)
  - `POST /api/v1/auth/login` — логин, возврат токена
  - `POST /api/v1/auth/logout` — отзыв токена
  - `GET  /api/v1/auth/user` — текущий пользователь

### 1.2 Middleware
- [ ] `EnsureRole` middleware — проверка роли (`role:doctor`, `role:admin`, `role:patient`)
- [ ] Зарегистрировать в `bootstrap/app.php`

### 1.3 Policies
- [ ] `AppointmentPolicy` — create (patient), update (doctor/owner), cancel (patient-owner или doctor-owner)
- [ ] `PrescriptionPolicy` — create (doctor, appointment.status = completed), view (patient-owner или doctor-owner)
- [ ] `ReviewPolicy` — create (patient, appointment.status = completed, ещё нет review)
- [ ] `DoctorProfilePolicy` — update (только свой профиль)
- [ ] `SchedulePolicy` — manage (только свой)

---

## Фаза 2: API эндпоинты (v1)

### 2.1 Публичные (без auth)
- [ ] `GET /api/v1/doctors` — список врачей с фильтрами:
  - `?specialization_id=` — по специальности
  - `?date=` — по наличию свободных слотов на дату
  - `?rating_min=` — минимальный рейтинг
  - `?search=` — по имени
  - Пагинация, сортировка
- [ ] `GET /api/v1/doctors/{id}` — профиль врача + специализация + отзывы (approved)
- [ ] `GET /api/v1/doctors/{id}/slots?date=` — свободные слоты на конкретную дату
- [ ] `GET /api/v1/specializations` — справочник специальностей

### 2.2 Пациент (auth + role:patient)
- [ ] `POST /api/v1/appointments` — создание записи (doctor_id, start_time)
  - Валидация: слот в будущем, слот свободен, lockForUpdate() для предотвращения race condition
  - end_time рассчитывается автоматически по настройке длительности слота
  - Уведомление врачу и пациенту
- [ ] `GET  /api/v1/appointments` — мои записи (пагинация, фильтр по статусу)
- [ ] `GET  /api/v1/appointments/{id}` — детали записи
- [ ] `PATCH /api/v1/appointments/{id}/cancel` — отмена записи
- [ ] `POST /api/v1/appointments/{id}/review` — оставить отзыв
- [ ] `GET  /api/v1/prescriptions` — мои рецепты
- [ ] `GET  /api/v1/prescriptions/{id}` — детали рецепта

### 2.3 Врач (auth + role:doctor)
- [ ] `GET  /api/v1/doctor/appointments` — записи ко мне (фильтр: today, week, status)
- [ ] `PATCH /api/v1/doctor/appointments/{id}/confirm` — подтвердить
- [ ] `PATCH /api/v1/doctor/appointments/{id}/complete` — завершить + диагноз
- [ ] `PATCH /api/v1/doctor/appointments/{id}/cancel` — отменить
- [ ] `POST /api/v1/doctor/appointments/{id}/prescriptions` — создать рецепт
- [ ] `GET  /api/v1/doctor/schedule` — моё расписание
- [ ] `PUT  /api/v1/doctor/schedule` — обновить расписание (массив дней)
- [ ] `GET  /api/v1/doctor/patients` — мои пациенты (история)
- [ ] `GET  /api/v1/doctor/profile` — мой профиль врача
- [ ] `PUT  /api/v1/doctor/profile` — обновить профиль

### 2.4 Профиль пациента (auth)
- [ ] `GET  /api/v1/profile` — мой профиль
- [ ] `PUT  /api/v1/profile` — обновить (phone, birth_date, address, avatar)

---

## Фаза 3: Form Requests (валидация)

- [ ] `RegisterRequest` — name, email (unique), password (min:8, confirmed), role
- [ ] `LoginRequest` — email, password
- [ ] `StoreAppointmentRequest` — doctor_id (exists), start_time (after:now)
- [ ] `CancelAppointmentRequest` — reason (nullable)
- [ ] `CompleteAppointmentRequest` — diagnosis (required, string)
- [ ] `StorePrescriptionRequest` — medicine_name, dosage, instructions, duration
- [ ] `StoreReviewRequest` — rating (1-5), comment (nullable, max:1000)
- [ ] `UpdateScheduleRequest` — массив: day_of_week, start_time, end_time, is_active
- [ ] `UpdateDoctorProfileRequest` — experience_years, bio, specialization_id
- [ ] `UpdateProfileRequest` — phone, birth_date, address, avatar (image)

---

## Фаза 4: Services (бизнес-логика)

### 4.1 AppointmentService
- [ ] `bookSlot(doctor, patient, startTime)` — с транзакцией + lockForUpdate
- [ ] `cancelAppointment(appointment, cancelledBy)` — смена статуса + уведомление
- [ ] `confirmAppointment(appointment)` — pending → confirmed
- [ ] `completeAppointment(appointment, diagnosis)` — confirmed → completed

### 4.2 SlotService
- [ ] `getAvailableSlots(doctor, date)` — генерация слотов на основе расписания минус занятые
- [ ] `isSlotAvailable(doctor, startTime, endTime)` — проверка доступности

### 4.3 PrescriptionService
- [ ] `createPrescription(appointment, data)` — создание рецепта

### 4.4 ReviewService
- [ ] `createReview(appointment, data)` — создание + пересчёт рейтинга врача

---

## Фаза 5: API Resources

- [ ] `UserResource` — id, name, email, role
- [ ] `DoctorResource` — id, name, specialization, experience, bio, rating, avatar
- [ ] `DoctorDetailResource` — + расписание, отзывы
- [ ] `AppointmentResource` — id, doctor, patient, start_time, end_time, status, diagnosis
- [ ] `PrescriptionResource` — id, medicine_name, dosage, instructions, duration
- [ ] `ReviewResource` — id, rating, comment, patient_name, created_at
- [ ] `SlotResource` — start_time, end_time, is_available
- [ ] `SpecializationResource` — id, name, description
- [ ] `ProfileResource` — id, phone, birth_date, address, avatar_url
- [ ] `ScheduleResource` — day_of_week, start_time, end_time, is_active

---

## Фаза 6: Уведомления

- [ ] `AppointmentCreatedNotification` — email + database для врача и пациента
- [ ] `AppointmentCancelledNotification` — email + database
- [ ] `AppointmentConfirmedNotification` — database для пациента
- [ ] `AppointmentCompletedNotification` — database для пациента
- [ ] Настроить `database` канал уведомлений (миграция `notifications` таблицы)

---

## Фаза 7: Тесты (Feature Tests)

- [ ] `BookAppointmentTest` — успешная запись, конфликт времени, запись в прошлом, двойная бронь
- [ ] `CancelAppointmentTest` — отмена пациентом, отмена врачом, отмена чужой записи (403)
- [ ] `AppointmentStatusFlowTest` — pending → confirmed → completed, нельзя перескочить статус
- [ ] `PrescriptionTest` — создание только для completed, просмотр, доступ только владельцу
- [ ] `ReviewTest` — один отзыв на запись, только для completed, рейтинг пересчитывается
- [ ] `SlotAvailabilityTest` — генерация слотов, занятый слот не показывается
- [ ] `AuthTest` — регистрация, логин, logout, доступ без токена
- [ ] `RoleAccessTest` — пациент не может создать рецепт, врач не может записаться и т.д.

---

## Фаза 8: Orchid Admin Panel

### 9.1 Установка
- [ ] `composer require orchid/platform`
- [ ] `php artisan orchid:install`
- [ ] Создать admin пользователя

### 9.2 Экраны
- [ ] **DashboardScreen** — графики: записи за неделю, новые пользователи, активные врачи
- [ ] **UserListScreen** — CRUD, фильтры по роли, блокировка
- [ ] **DoctorListScreen** — список врачей, привязка специализации
- [ ] **SpecializationScreen** — CRUD специальностей
- [ ] **AppointmentListScreen** — все записи, фильтры, ручная отмена
- [ ] **ReviewListScreen** — модерация (approve/hide)
- [ ] **SettingsScreen** — длительность слота, праздничные дни

---

## Фаза 9: Кэширование и оптимизация

- [ ] Кэш справочника специальностей (cache forever, сброс при изменении)
- [ ] Eager loading в контроллерах (избежание N+1)
- [ ] Rate limiting на API эндпоинтах (throttle)
- [ ] Индексы проверены (см. 01-database.md)
