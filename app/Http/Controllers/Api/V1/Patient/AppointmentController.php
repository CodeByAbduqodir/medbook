<?php

namespace App\Http\Controllers\Api\V1\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\CancelAppointmentRequest;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\AppointmentResource;
use App\Http\Resources\ReviewResource;
use App\Models\Appointment;
use App\Models\User;
use App\Services\AppointmentService;
use App\Services\ReviewService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private AppointmentService $appointmentService,
        private ReviewService $reviewService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->patientAppointments()
            ->with(['doctor.doctorProfile.specialization', 'doctor.profile']);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $appointments = $query->orderByDesc('start_time')->paginate(15);

        return response()->json([
            'data' => AppointmentResource::collection($appointments->items()),
            'meta' => [
                'page' => $appointments->currentPage(),
                'per_page' => $appointments->perPage(),
                'total' => $appointments->total(),
            ],
        ]);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $this->authorize('create', Appointment::class);

        $doctor = User::findOrFail($request->validated('doctor_id'));
        $startTime = Carbon::parse($request->validated('start_time'));

        $appointment = $this->appointmentService->bookSlot($doctor, $request->user(), $startTime);
        $appointment->load(['doctor', 'patient']);

        return response()->json(['data' => AppointmentResource::make($appointment)], 201);
    }

    public function show(Appointment $appointment): JsonResponse
    {
        $this->authorize('view', $appointment);

        $appointment->load(['doctor.doctorProfile.specialization', 'patient', 'prescriptions', 'review']);

        return response()->json(['data' => AppointmentResource::make($appointment)]);
    }

    public function cancel(CancelAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('cancel', $appointment);

        $this->appointmentService->cancelAppointment($appointment, $request->user());

        return response()->json(['data' => AppointmentResource::make($appointment->fresh())]);
    }

    public function review(StoreReviewRequest $request, Appointment $appointment): JsonResponse
    {
        $this->authorize('review', $appointment);

        $review = $this->reviewService->createReview($appointment, $request->validated());

        return response()->json(['data' => ReviewResource::make($review)], 201);
    }
}
