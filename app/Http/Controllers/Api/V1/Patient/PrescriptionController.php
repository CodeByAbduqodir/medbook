<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Http\Resources\PrescriptionResource;
use App\Models\Prescription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $prescriptions = Prescription::query()
            ->whereHas('appointment', fn ($q) => $q->where('patient_id', $request->user()->id))
            ->with('appointment.doctor.profile')
            ->orderByDesc('created_at')
            ->paginate(15);

        return response()->json([
            'data' => PrescriptionResource::collection($prescriptions->items()),
            'meta' => [
                'page' => $prescriptions->currentPage(),
                'per_page' => $prescriptions->perPage(),
                'total' => $prescriptions->total(),
            ],
        ]);
    }

    public function show(Prescription $prescription): JsonResponse
    {
        $this->authorize('view', $prescription);

        $prescription->load('appointment.doctor.profile');

        return response()->json(['data' => PrescriptionResource::make($prescription)]);
    }
}
