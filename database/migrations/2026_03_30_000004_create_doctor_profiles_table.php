<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('specialization_id')->constrained()->restrictOnDelete();
            $table->smallInteger('experience_years')->default(0);
            $table->text('bio')->nullable();
            $table->decimal('rating_avg', 3, 2)->default(0);
            $table->timestamps();

            $table->index('specialization_id');
            $table->index('rating_avg');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_profiles');
    }
};
