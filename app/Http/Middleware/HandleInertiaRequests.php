<?php

namespace App\Http\Middleware;

use App\Services\GuestCartService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();
        $cartCount = 0;
        $cartSubtotal = 0;
        $cartItems = [];
        $wishlistCount = 0;

        if ($user) {
            $cart = $user->cart;
            if ($cart) {
                $cart->load('items.product');
                $cartCount = $cart->getTotalItems();
                $cartSubtotal = $cart->getTotal();
                $cartItems = $cart->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'product' => [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'price' => $item->product->price,
                            'image' => $item->product->image,
                        ],
                    ];
                })->toArray();
            }
            $wishlistCount = $user->wishlists()->count();
        } else {
            // Guest cart stats
            $guestCartService = app(GuestCartService::class);
            $stats = $guestCartService->getStats();
            $cartCount = $stats['count'];
            $cartSubtotal = $stats['subtotal'];
            // Get guest cart items with product data
            $guestCartData = $guestCartService->getCartWithProducts();
            $cartItems = $guestCartData['items'];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'cart' => [
                'count' => $cartCount,
                'subtotal' => $cartSubtotal,
                'items' => $cartItems,
            ],
            'wishlist' => [
                'count' => $wishlistCount,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
