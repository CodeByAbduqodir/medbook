<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Orchid\Filters\Types\Like;
use Orchid\Filters\Types\Where;
use Orchid\Filters\Types\WhereDateStartEnd;
use Orchid\Platform\Models\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /** @var list<string> */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'permissions',
    ];

    /** @var list<string> */
    protected $hidden = [
        'password',
        'remember_token',
        'permissions',
    ];

    /** @var array<string, class-string> */
    protected $allowedFilters = [
        'id' => Where::class,
        'name' => Like::class,
        'email' => Like::class,
        'role' => Where::class,
        'updated_at' => WhereDateStartEnd::class,
        'created_at' => WhereDateStartEnd::class,
    ];

    /** @var list<string> */
    protected $allowedSorts = [
        'id',
        'name',
        'email',
        'role',
        'updated_at',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'permissions' => 'array',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function doctorProfile(): HasOne
    {
        return $this->hasOne(DoctorProfile::class);
    }

    public function patientAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }

    public function doctorAppointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'doctor_id');
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'doctor_id');
    }

    public function scopePatients(Builder $query): void
    {
        $query->where('role', UserRole::Patient);
    }

    public function scopeDoctors(Builder $query): void
    {
        $query->where('role', UserRole::Doctor);
    }

    public function scopeAdmins(Builder $query): void
    {
        $query->where('role', UserRole::Admin);
    }

    public function isPatient(): bool
    {
        return $this->role === UserRole::Patient;
    }

    public function isDoctor(): bool
    {
        return $this->role === UserRole::Doctor;
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }
}
