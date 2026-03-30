<?php

namespace Database\Seeders;

use App\Models\Specialization;
use Illuminate\Database\Seeder;

class SpecializationSeeder extends Seeder
{
    public function run(): void
    {
        $specializations = [
            ['name' => 'Терапевт', 'description' => 'Общая терапия и первичная медицинская помощь'],
            ['name' => 'Хирург', 'description' => 'Хирургические операции и послеоперационное наблюдение'],
            ['name' => 'Кардиолог', 'description' => 'Диагностика и лечение заболеваний сердца и сосудов'],
            ['name' => 'Невролог', 'description' => 'Заболевания нервной системы, мозга и позвоночника'],
            ['name' => 'Офтальмолог', 'description' => 'Диагностика и лечение заболеваний глаз'],
            ['name' => 'Дерматолог', 'description' => 'Заболевания кожи, волос и ногтей'],
            ['name' => 'Ортопед', 'description' => 'Заболевания костно-мышечной системы и суставов'],
            ['name' => 'Педиатр', 'description' => 'Медицинская помощь детям и подросткам'],
            ['name' => 'Гинеколог', 'description' => 'Женское репродуктивное здоровье'],
            ['name' => 'Уролог', 'description' => 'Заболевания мочевыделительной системы'],
            ['name' => 'Эндокринолог', 'description' => 'Заболевания эндокринной системы и нарушения обмена веществ'],
            ['name' => 'Психиатр', 'description' => 'Диагностика и лечение психических расстройств'],
            ['name' => 'Пульмонолог', 'description' => 'Заболевания органов дыхания'],
            ['name' => 'Гастроэнтеролог', 'description' => 'Заболевания пищеварительной системы'],
            ['name' => 'Онколог', 'description' => 'Диагностика и лечение онкологических заболеваний'],
        ];

        foreach ($specializations as $specialization) {
            Specialization::firstOrCreate(['name' => $specialization['name']], $specialization);
        }
    }
}
