<?php

namespace Tests\Feature;

use App\Models\Specialization;
use App\Orchid\Screens\Specialization\SpecializationEditScreen;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class SpecializationCacheTest extends TestCase
{
    use RefreshDatabase;

    public function test_saved_specialization_invalidates_cached_api_list(): void
    {
        Cache::put('specializations', collect());

        $screen = app(SpecializationEditScreen::class);
        $request = Request::create('/', 'POST', [
            'specialization' => [
                'name' => 'Cardiology',
                'description' => 'Heart specialist',
            ],
        ]);

        $screen->save($request, new Specialization);

        $response = $this->getJson('/api/v1/specializations');

        $response->assertOk()
            ->assertJsonPath('data.0.name', 'Cardiology');
    }
}
