<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\DoctorDetailResource;
use App\Http\Resources\DoctorResource;
use App\Models\User;
use App\Services\SlotService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function __construct(private SlotService $slotService) {}

    public function index(Request $request): JsonResponse
    {
        $query = User::doctors()
            ->with(['doctorProfile.specialization', 'profile'])
            ->whereHas('doctorProfile');

        if ($request->filled('specialization_id')) {
            $query->whereHas('doctorProfile', fn ($q) => $q->where('specialization_id', $request->integer('specialization_id')));
        }

        if ($request->filled('rating_min')) {
            $query->whereHas('doctorProfile', fn ($q) => $q->where('rating_avg', '>=', (float) $request->input('rating_min')));
        }

        if ($request->filled('search')) {
            $query->where('name', 'ilike', '%'.$request->input('search').'%');
        }

        if ($request->filled('date')) {
            $date = Carbon::parse($request->input('date'));
            $dayOfWeek = (int) $date->dayOfWeek;
            $query->whereHas('schedules', fn ($q) => $q->where('day_of_week', $dayOfWeek)->where('is_active', true));
        }

        $doctors = $query->paginate(15);

        return response()->json([
            'data' => DoctorResource::collection($doctors->items()),
            'meta' => [
                'page' => $doctors->currentPage(),
                'per_page' => $doctors->perPage(),
                'total' => $doctors->total(),
            ],
        ]);
    }

    public function show(User $user): JsonResponse
    {
        abort_if($user->role !== UserRole::Doctor, 404);

        $user->load([
            'doctorProfile.specialization',
            'profile',
            'schedules',
        ]);

        $approvedReviews = $user->doctorAppointments()
            ->with(['review', 'patient'])
            ->get()
            ->pluck('review')
            ->filter(fn ($r) => $r && $r->is_approved)
            ->values();

        $user->setRelation('approvedReviews', $approvedReviews);

        return response()->json(['data' => DoctorDetailResource::make($user)]);
    }

    public function slots(Request $request, User $user): JsonResponse
    {
        abort_if($user->role !== UserRole::Doctor, 404);

        $request->validate(['date' => ['required', 'date', 'after_or_equal:today']]);

        $date = Carbon::parse($request->input('date'));
        $slots = $this->slotService->getAvailableSlots($user, $date);

        return response()->json(['data' => $slots]);
    }
}
