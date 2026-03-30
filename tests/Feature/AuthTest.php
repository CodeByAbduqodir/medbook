<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_register(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'John Patient',
            'email' => 'patient@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'name', 'email', 'role'], 'token'])
            ->assertJsonPath('data.role', 'patient');

        $this->assertDatabaseHas('users', ['email' => 'patient@test.com']);
    }

    public function test_doctor_can_register_with_role(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Dr. Smith',
            'email' => 'doctor@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'doctor',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.role', 'doctor');
    }

    public function test_register_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'exists@test.com']);

        $this->postJson('/api/v1/auth/register', [
            'name' => 'Another',
            'email' => 'exists@test.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create(['password' => bcrypt('secret123')]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data', 'token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'wrongpassword',
        ])->assertStatus(422);
    }

    public function test_authenticated_user_can_get_their_info(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson('/api/v1/auth/user')
            ->assertOk()
            ->assertJsonPath('data.id', $user->id);
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->getJson('/api/v1/auth/user')->assertUnauthorized();
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('api')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/v1/auth/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
