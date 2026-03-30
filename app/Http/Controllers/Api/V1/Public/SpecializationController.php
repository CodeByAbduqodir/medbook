<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\SpecializationResource;
use App\Models\Specialization;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SpecializationController extends Controller
{
    public function index(): JsonResponse
    {
        $specializations = Cache::rememberForever('specializations', fn () => Specialization::all());

        return response()->json(['data' => SpecializationResource::collection($specializations)]);
    }
}
