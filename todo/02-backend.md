# MedBook — Backend (Laravel API)

## Фаза 1: Аутентификация и авторизация ✅

### 1.1 Sanctum + Auth
- [x] Laravel Sanctum установлен и настроен
- [x] Sanctum для SPA (stateful domains) + API tokens
- [x] Эндпоинты:
  - `POST /api/v1/auth/register` — регистрация (name, email, password, role=patient)
  - `POST /api/v1/auth/login` — логин, возврат токена
  - `POST /api/v1/auth/logout` — отзыв токена
  - `GET  /api/v1/auth/user` — текущий пользователь

### 1.2 Middleware
- [x] `EnsureRole` middleware — проверка роли (`role:doctor`, `role:admin`, `role:patient`)
- [x] Зарегистрирован в `bootstrap/app.php`

### 1.3 Policies
- [x] `AppointmentPolicy` — create (patient), update (doctor/owner), cancel (patient-owner или doctor-owner)
- [x] `PrescriptionPolicy` — create (doctor, appointment.status = completed), view (patient-owner или doctor-owner)
- [x] `ReviewPolicy` — create (patient, appointment.status = completed, ещё нет review)
- [x] `DoctorProfilePolicy` — update (только свой профиль)
- [x] `SchedulePolicy` — manage (только свой)

---

## Фаза 2: API эндпоинты (v1) ✅

### 2.1 Публичные (без auth)
- [x] `GET /api/v1/doctors` — список врачей с фильтрами (specialization_id, date, rating_min, search), пагинация
- [x] `GET /api/v1/doctors/{id}` — профиль врача + специализация + отзывы (approved)
- [x] `GET /api/v1/doctors/{id}/slots?date=` — свободные слоты на конкретную дату
- [x] `GET /api/v1/specializations` — справочник специальностей

### 2.2 Пациент (auth + role:patient)
- [x] `POST /api/v1/appointments` — создание записи (doctor_id, start_time)
- [x] `GET  /api/v1/appointments` — мои записи (пагинация, фильтр по статусу)
- [x] `GET  /api/v1/appointments/{id}` — детали записи
- [x] `PATCH /api/v1/appointments/{id}/cancel` — отмена записи
- [x] `POST /api/v1/appointments/{id}/review` — оставить отзыв
- [x] `GET  /api/v1/prescriptions` — мои рецепты
- [x] `GET  /api/v1/prescriptions/{id}` — детали рецепта

### 2.3 Врач (auth + role:doctor)
- [x] `GET  /api/v1/doctor/appointments` — записи ко мне (фильтр: today, week, status)
- [x] `PATCH /api/v1/doctor/appointments/{id}/confirm` — подтвердить
- [x] `PATCH /api/v1/doctor/appointments/{id}/complete` — завершить + диагноз
- [x] `PATCH /api/v1/doctor/appointments/{id}/cancel` — отменить
- [x] `POST /api/v1/doctor/appointments/{id}/prescriptions` — создать рецепт
- [x] `GET  /api/v1/doctor/schedule` — моё расписание
- [x] `PUT  /api/v1/doctor/schedule` — обновить расписание (массив дней)
- [x] `GET  /api/v1/doctor/patients` — мои пациенты (история)
- [x] `GET  /api/v1/doctor/profile` — мой профиль врача
- [x] `PUT  /api/v1/doctor/profile` — обновить профиль

### 2.4 Профиль пациента (auth)
- [x] `GET  /api/v1/profile` — мой профиль
- [x] `PUT  /api/v1/profile` — обновить (phone, birth_date, address, avatar)

---

## Фаза 3: Form Requests (валидация) ✅

- [x] `RegisterRequest` — name, email (unique), password (min:8, confirmed), role
- [x] `LoginRequest` — email, password
- [x] `StoreAppointmentRequest` — doctor_id (exists), start_time (after:now)
- [x] `CancelAppointmentRequest` — reason (nullable)
- [x] `CompleteAppointmentRequest` — diagnosis (required, string)
- [x] `StorePrescriptionRequest` — medicine_name, dosage, instructions, duration
- [x] `StoreReviewRequest` — rating (1-5), comment (nullable, max:1000)
- [x] `UpdateScheduleRequest` — массив: day_of_week, start_time, end_time, is_active
- [x] `UpdateDoctorProfileRequest` — experience_years, bio, specialization_id
- [x] `UpdateProfileRequest` — phone, birth_date, address, avatar (image)

---

## Фаза 4: Services (бизнес-логика) ✅

### 4.1 AppointmentService
- [x] `bookSlot(doctor, patient, startTime)` — с транзакцией + lockForUpdate
- [x] `cancelAppointment(appointment, cancelledBy)` — смена статуса + уведомление
- [x] `confirmAppointment(appointment)` — pending → confirmed
- [x] `completeAppointment(appointment, diagnosis)` — confirmed → completed

### 4.2 SlotService
- [x] `getAvailableSlots(doctor, date)` — генерация слотов на основе расписания минус занятые
- [x] `isSlotAvailable(doctor, startTime, endTime)` — проверка доступности

### 4.3 PrescriptionService
- [x] `createPrescription(appointment, data)` — создание рецепта

### 4.4 ReviewService
- [x] `createReview(appointment, data)` — создание отзыва (рейтинг пересчитывается через ReviewObserver)

---

## Фаза 5: API Resources ✅

- [x] `UserResource` — id, name, email, role
- [x] `DoctorResource` — id, name, specialization, experience, bio, rating, avatar
- [x] `DoctorDetailResource` — + расписание, отзывы
- [x] `AppointmentResource` — id, doctor, patient, start_time, end_time, status, diagnosis
- [x] `PrescriptionResource` — id, medicine_name, dosage, instructions, duration
- [x] `ReviewResource` — id, rating, comment, patient_name, created_at
- [x] `SlotResource` — start_time, end_time, is_available
- [x] `SpecializationResource` — id, name, description
- [x] `ProfileResource` — id, phone, birth_date, address, avatar_url
- [x] `ScheduleResource` — day_of_week, start_time, end_time, is_active

---

## Фаза 6: Уведомления ✅

- [x] `AppointmentCreatedNotification` — email + database для врача и пациента
- [x] `AppointmentCancelledNotification` — email + database
- [x] `AppointmentConfirmedNotification` — database для пациента
- [x] `AppointmentCompletedNotification` — database для пациента
- [x] Настроить `database` канал уведомлений (миграция `notifications` таблицы)

---

## Фаза 7: Тесты (Feature Tests) ✅

- [x] `AuthTest` — регистрация, логин, logout, доступ без токена (8 тестов)
- [x] `RoleAccessTest` — пациент не может создать рецепт, врач не может записаться и т.д. (8 тестов)
- [x] `BookAppointmentTest` — успешная запись, конфликт времени, запись в прошлом, двойная бронь (6 тестов)
- [x] `CancelAppointmentTest` — отмена пациентом, отмена врачом, отмена чужой записи (403) (6 тестов)
- [x] `AppointmentStatusFlowTest` — pending → confirmed → completed, нельзя перескочить статус (6 тестов)
- [x] `PrescriptionTest` — создание только для completed, просмотр, доступ только владельцу (6 тестов)
- [x] `ReviewTest` — один отзыв на запись, только для completed, рейтинг пересчитывается (7 тестов)
- [x] `SlotAvailabilityTest` — генерация слотов, занятый слот не показывается (5 тестов)
- [x] Pint форматирование всего кода
- [x] Прогон всего test suite: **55 passed, 115 assertions** ✅

---

## Фаза 8: Orchid Admin Panel

### 8.1 Установка
- [ ] `composer require orchid/platform`
- [ ] `php artisan orchid:install`
- [ ] Создать admin пользователя

### 8.2 Экраны
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
