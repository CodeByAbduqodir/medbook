<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateDoctorProfileRequest;
use App\Http\Resources\DoctorDetailResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'doctorProfile.specialization',
            'profile',
            'schedules',
        ]);

        return response()->json(['data' => DoctorDetailResource::make($user)]);
    }

    public function update(UpdateDoctorProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $doctorProfile = $user->doctorProfile;

        $this->authorize('update', $doctorProfile);

        $doctorProfile->update($request->validated());

        $user->load(['doctorProfile.specialization', 'profile', 'schedules']);

        return response()->json(['data' => DoctorDetailResource::make($user)]);
    }
}
