<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Services\GuestCartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected GuestCartService $guestCart;

    public function __construct(GuestCartService $guestCart)
    {
        $this->guestCart = $guestCart;
    }

    public function index()
    {
        if (auth()->check()) {
            $user = auth()->user();
            $cart = $user->cart;

            if ($cart) {
                $cart->load('items.product');
            }

            return Inertia::render('Cart/Index', [
                'cartData' => $cart,
                'isGuest' => false,
            ]);
        } else {
            // Guest cart
            $cartData = $this->guestCart->getCartWithProducts();

            return Inertia::render('Cart/Index', [
                'cartData' => [
                    'items' => $cartData['items'],
                ],
                'isGuest' => true,
            ]);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'sometimes|integer|min:1|max:100',
        ]);

        $product = Product::findOrFail($request->product_id);
        $quantity = $request->quantity ?? 1;

        // Check stock availability
        if ($product->stock_quantity < $quantity) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        if (auth()->check()) {
            // Authenticated user cart
            $user = auth()->user();
            $cart = $user->getOrCreateCart();

            $existingItem = $cart->items()->where('product_id', $request->product_id)->first();

            if ($existingItem) {
                $newQuantity = $existingItem->quantity + $quantity;
                if ($newQuantity > $product->stock_quantity) {
                    return back()->withErrors(['quantity' => 'Not enough stock available.']);
                }
                $existingItem->update(['quantity' => $newQuantity]);
            } else {
                $cart->items()->create([
                    'product_id' => $request->product_id,
                    'quantity' => $quantity,
                ]);
            }
        } else {
            // Guest cart
            $this->guestCart->addItem($request->product_id, $quantity);
        }

        return back()->with('success', 'Added to cart!');
    }

    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:100',
        ]);

        if (auth()->check()) {
            $cartItem = CartItem::findOrFail($itemId);

            // Ensure item belongs to user's cart
            if ($cartItem->cart->user_id !== auth()->id()) {
                abort(403);
            }

            // Check stock availability
            if ($cartItem->product->stock_quantity < $request->quantity) {
                return back()->withErrors(['quantity' => 'Not enough stock available.']);
            }

            $cartItem->update(['quantity' => $request->quantity]);
        } else {
            // Guest cart - itemId is product_id for guests
            $product = Product::find($itemId);
            if ($product && $product->stock_quantity >= $request->quantity) {
                $this->guestCart->updateItem($itemId, $request->quantity);
            }
        }

        return back()->with('success', 'Cart updated!');
    }

    public function destroy($itemId)
    {
        if (auth()->check()) {
            $cartItem = CartItem::findOrFail($itemId);

            // Ensure item belongs to user's cart
            if ($cartItem->cart->user_id !== auth()->id()) {
                abort(403);
            }

            $cartItem->delete();
        } else {
            // Guest cart - itemId is product_id for guests
            $this->guestCart->removeItem($itemId);
        }

        return back()->with('success', 'Item removed from cart!');
    }
}
