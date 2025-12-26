<?php

namespace App\Providers;

use App\Listeners\TransferGuestCart;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Transfer guest cart to user cart on login
        Event::listen(Login::class, TransferGuestCart::class);
    }
}
