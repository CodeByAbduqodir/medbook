<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Enums\AppointmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorPatientController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $doctorId = $request->user()->id;

        $query = User::query()
            ->whereHas('patientAppointments', fn ($q) => $q->where('doctor_id', $doctorId)
                ->where('status', AppointmentStatus::Completed))
            ->with('profile');

        if ($request->filled('search')) {
            $query->where('name', 'ilike', '%'.$request->input('search').'%');
        }

        $patients = $query->paginate(20);

        return response()->json([
            'data' => UserResource::collection($patients->items()),
            'meta' => [
                'page' => $patients->currentPage(),
                'per_page' => $patients->perPage(),
                'total' => $patients->total(),
            ],
        ]);
    }
}
