<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Doctor\DoctorAppointmentController;
use App\Http\Controllers\Api\V1\Doctor\DoctorPatientController;
use App\Http\Controllers\Api\V1\Doctor\DoctorProfileController;
use App\Http\Controllers\Api\V1\Doctor\DoctorScheduleController;
use App\Http\Controllers\Api\V1\Patient\AppointmentController;
use App\Http\Controllers\Api\V1\Patient\PrescriptionController;
use App\Http\Controllers\Api\V1\Patient\ProfileController;
use App\Http\Controllers\Api\V1\Public\DoctorController;
use App\Http\Controllers\Api\V1\Public\SpecializationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('user', [AuthController::class, 'user']);
        });
    });

    // Public
    Route::get('doctors', [DoctorController::class, 'index']);
    Route::get('doctors/{user}', [DoctorController::class, 'show']);
    Route::get('doctors/{user}/slots', [DoctorController::class, 'slots']);
    Route::get('specializations', [SpecializationController::class, 'index']);

    // Patient
    Route::middleware(['auth:sanctum', 'role:patient'])->group(function () {
        Route::get('appointments', [AppointmentController::class, 'index']);
        Route::post('appointments', [AppointmentController::class, 'store']);
        Route::get('appointments/{appointment}', [AppointmentController::class, 'show']);
        Route::patch('appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
        Route::post('appointments/{appointment}/review', [AppointmentController::class, 'review']);
        Route::get('prescriptions', [PrescriptionController::class, 'index']);
        Route::get('prescriptions/{prescription}', [PrescriptionController::class, 'show']);
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
    });

    // Doctor
    Route::middleware(['auth:sanctum', 'role:doctor'])->prefix('doctor')->group(function () {
        Route::get('appointments', [DoctorAppointmentController::class, 'index']);
        Route::patch('appointments/{appointment}/confirm', [DoctorAppointmentController::class, 'confirm']);
        Route::patch('appointments/{appointment}/complete', [DoctorAppointmentController::class, 'complete']);
        Route::patch('appointments/{appointment}/cancel', [DoctorAppointmentController::class, 'cancel']);
        Route::post('appointments/{appointment}/prescriptions', [DoctorAppointmentController::class, 'storePrescription']);
        Route::get('schedule', [DoctorScheduleController::class, 'index']);
        Route::put('schedule', [DoctorScheduleController::class, 'update']);
        Route::get('patients', [DoctorPatientController::class, 'index']);
        Route::get('profile', [DoctorProfileController::class, 'show']);
        Route::put('profile', [DoctorProfileController::class, 'update']);
    });
});
