<?php

namespace Tests\Feature;

use Tests\TestCase;

class CorsTest extends TestCase
{
    public function test_api_allows_requests_from_nextjs_dev_origin(): void
    {
        $response = $this
            ->withHeaders([
                'Origin' => 'http://medbook.test:3000',
                'Access-Control-Request-Method' => 'POST',
            ])
            ->options('/api/v1/auth/register');

        $response->assertNoContent();
        $response->assertHeader('Access-Control-Allow-Origin', 'http://medbook.test:3000');
    }
}
