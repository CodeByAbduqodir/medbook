<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;

class AdminLogin extends Command
{
    protected $signature = 'admin:login';

    protected $description = 'Create admin session for testing';

    public function handle()
    {
        $user = User::where('email', 'admin@medbook.test')->first();

        if (! $user) {
            $this->error('Admin user not found');

            return 1;
        }

        Auth::login($user);
        $this->info('Admin logged in successfully');
        $this->info('Visit: http://medbook.test/admin');
    }
}
