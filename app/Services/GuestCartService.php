<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Session;

class GuestCartService
{
    private const SESSION_KEY = 'guest_cart';

    /**
     * Get guest cart from session
     */
    public function getCart(): array
    {
        return Session::get(self::SESSION_KEY, []);
    }

    /**
     * Add item to guest cart
     */
    public function addItem(int $productId, int $quantity = 1): array
    {
        $cart = $this->getCart();
        
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'product_id' => $productId,
                'quantity' => $quantity,
            ];
        }

        Session::put(self::SESSION_KEY, $cart);
        
        return $cart;
    }

    /**
     * Update item quantity
     */
    public function updateItem(int $productId, int $quantity): array
    {
        $cart = $this->getCart();
        
        if (isset($cart[$productId])) {
            if ($quantity <= 0) {
                unset($cart[$productId]);
            } else {
                $cart[$productId]['quantity'] = $quantity;
            }
        }

        Session::put(self::SESSION_KEY, $cart);
        
        return $cart;
    }

    /**
     * Remove item from cart
     */
    public function removeItem(int $productId): array
    {
        $cart = $this->getCart();
        unset($cart[$productId]);
        Session::put(self::SESSION_KEY, $cart);
        
        return $cart;
    }

    /**
     * Clear cart
     */
    public function clear(): void
    {
        Session::forget(self::SESSION_KEY);
    }

    /**
     * Get cart with product details
     */
    public function getCartWithProducts(): array
    {
        $cart = $this->getCart();
        $productIds = array_keys($cart);
        
        if (empty($productIds)) {
            return ['items' => [], 'total' => 0, 'count' => 0];
        }

        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');
        
        $items = [];
        $total = 0;

        foreach ($cart as $productId => $item) {
            if (isset($products[$productId])) {
                $product = $products[$productId];
                $quantity = min($item['quantity'], $product->stock_quantity);
                $items[] = [
                    'id' => $productId,
                    'product_id' => $productId,
                    'product' => $product,
                    'quantity' => $quantity,
                ];
                $total += $quantity * $product->price;
            }
        }

        return [
            'items' => $items,
            'total' => $total,
            'count' => count($items),
        ];
    }

    /**
     * Transfer guest cart to user cart after login
     */
    public function transferToUser(User $user): void
    {
        $guestCart = $this->getCart();
        
        if (empty($guestCart)) {
            return;
        }

        $cart = $user->getOrCreateCart();

        foreach ($guestCart as $productId => $item) {
            $existingItem = $cart->items()->where('product_id', $productId)->first();
            
            if ($existingItem) {
                $existingItem->increment('quantity', $item['quantity']);
            } else {
                $cart->items()->create([
                    'product_id' => $productId,
                    'quantity' => $item['quantity'],
                ]);
            }
        }

        $this->clear();
    }

    /**
     * Get count and total for navigation
     */
    public function getStats(): array
    {
        $cartData = $this->getCartWithProducts();
        return [
            'count' => $cartData['count'],
            'subtotal' => $cartData['total'],
        ];
    }
}
