<?php

namespace App\Http\Controllers\Api\V1\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompleteAppointmentRequest;
use App\Http\Requests\StorePrescriptionRequest;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\PrescriptionResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use App\Services\PrescriptionService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorAppointmentController extends Controller
{
    public function __construct(
        private AppointmentService $appointmentService,
        private PrescriptionService $prescriptionService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->doctorAppointments()
            ->with(['patient.profile']);

        if ($request->input('filter') === 'today') {
            $query->whereDate('start_time', Carbon::today());
        } elseif ($request->input('filter') === 'week') {
            $query->whereBetween('start_time', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $appointments = $query->orderBy('start_time')->paginate(20);

        return response()->json([
            'data' => AppointmentResource::collection($appointments->items()),
            'meta' => [
                'page' => $appointments->currentPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
            ],
        ]);
    }

    public function confirm(Appointment $appointment): JsonResponse
    {
        $this->authorize('confirm', $appointment);

        $this->appointmentService->confirmAppointment($appointment);

        return response()->json(['data' => AppointmentResource::make($appointment->fresh())]);
    }

    public function complete(CompleteAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('complete', $appointment);

        $this->appointmentService->completeAppointment($appointment, $request->validated('diagnosis'));

        return response()->json(['data' => AppointmentResource::make($appointment->fresh())]);
    }

    public function cancel(Request $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('cancel', $appointment);

        $this->appointmentService->cancelAppointment($appointment, $request->user());

        return response()->json(['data' => AppointmentResource::make($appointment->fresh())]);
    }

    public function storePrescription(StorePrescriptionRequest $request, Appointment $appointment): JsonResponse
    {
        abort_if($request->user()->id !== $appointment->doctor_id, 403);

        $prescription = $this->prescriptionService->createPrescription($appointment, $request->validated());

        return response()->json(['data' => PrescriptionResource::make($prescription)], 201);
    }
}
