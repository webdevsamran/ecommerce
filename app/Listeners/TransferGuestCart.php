<?php

namespace App\Listeners;

use App\Services\GuestCartService;
use Illuminate\Auth\Events\Login;

class TransferGuestCart
{
    protected GuestCartService $guestCart;

    public function __construct(GuestCartService $guestCart)
    {
        $this->guestCart = $guestCart;
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        // Transfer guest cart to user cart after login
        $this->guestCart->transferToUser($event->user);
    }
}
