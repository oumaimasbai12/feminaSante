<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;
use App\Models\User;

class LogSensitiveDataTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_logs_request_without_sensitive_fields()
    {
        Log::shouldReceive('info')->once()->withArgs(function ($message, $context) {
            return $message === 'Sensitive Data Access' 
                && !array_key_exists('motDePasse', $context['payload'])
                && array_key_exists('nom', $context['payload']);
        });

        $user = User::factory()->create();
        $this->actingAs($user)->putJson('/api/v1/profile', [
            'nom' => 'New Name',
            'motDePasse' => 'secret_password'
        ]);
    }
}
