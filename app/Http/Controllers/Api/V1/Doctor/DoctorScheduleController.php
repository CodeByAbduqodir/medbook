<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateScheduleRequest;
use App\Http\Resources\ScheduleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $schedules = $request->user()->schedules()->orderBy('day_of_week')->get();

        return response()->json(['data' => ScheduleResource::collection($schedules)]);
    }

    public function update(UpdateScheduleRequest $request): JsonResponse
    {
        $doctor = $request->user();

        foreach ($request->validated('schedules') as $item) {
            $doctor->schedules()->updateOrCreate(
                ['day_of_week' => $item['day_of_week']],
                [
                    'start_time' => $item['start_time'].':00',
                    'end_time' => $item['end_time'].':00',
                    'is_active' => $item['is_active'],
                ]
            );
        }

        $schedules = $doctor->schedules()->orderBy('day_of_week')->get();

        return response()->json(['data' => ScheduleResource::collection($schedules)]);
    }
}
