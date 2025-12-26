<?php

namespace App\Http\Controllers;

use App\Jobs\CheckLowStockJob;
use App\Models\Address;
use App\Models\Order;
use App\Services\GuestCartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected GuestCartService $guestCart;

    public function __construct(GuestCartService $guestCart)
    {
        $this->guestCart = $guestCart;
    }

    public function index()
    {
        $isGuest = !auth()->check();
        $items = [];
        $total = 0;
        $addresses = [];
        $defaultAddress = null;

        if ($isGuest) {
            // Guest checkout
            $cartData = $this->guestCart->getCartWithProducts();
            $items = $cartData['items'];
            $total = $cartData['total'];

            if (empty($items)) {
                return redirect()->route('cart.index')
                    ->withErrors(['cart' => 'Your cart is empty.']);
            }
        } else {
            // Authenticated user
            $user = auth()->user();
            $cart = $user->cart;

            if (!$cart || $cart->items->isEmpty()) {
                return redirect()->route('cart.index')
                    ->withErrors(['cart' => 'Your cart is empty.']);
            }

            $cart->load('items.product');
            $items = $cart->items;
            $total = $cart->getTotal();
            $addresses = $user->addresses()->where('type', 'shipping')->get();
            $defaultAddress = $user->getDefaultShippingAddress();
        }

        return Inertia::render('Checkout/Index', [
            'items' => $items,
            'total' => $total,
            'addresses' => $addresses,
            'defaultAddress' => $defaultAddress,
            'paymentMethods' => config('shop.payment_methods'),
            'isGuest' => $isGuest,
        ]);
    }

    public function store(Request $request)
    {
        $isGuest = !auth()->check();

        // Validation rules
        $rules = [
            'payment_method' => 'required|string',
            'notes' => 'nullable|string|max:500',
        ];

        // Guest-specific validation
        if ($isGuest) {
            $rules['guest_email'] = 'required|email';
            $rules['guest_name'] = 'required|string|max:255';
            $rules['shipping_name'] = 'required|string|max:255';
            $rules['shipping_street'] = 'required|string|max:255';
            $rules['shipping_city'] = 'required|string|max:100';
            $rules['shipping_state'] = 'nullable|string|max:100';
            $rules['shipping_zip'] = 'required|string|max:20';
            $rules['shipping_country'] = 'required|string|max:100';
            $rules['shipping_phone'] = 'nullable|string|max:20';
        } else {
            $rules['shipping_address_id'] = 'nullable|exists:addresses,id';
        }

        $request->validate($rules);

        // Get cart items
        if ($isGuest) {
            $cartData = $this->guestCart->getCartWithProducts();
            $items = $cartData['items'];
            $total = $cartData['total'];
        } else {
            $user = auth()->user();
            $cart = $user->cart;

            if (!$cart || $cart->items->isEmpty()) {
                return back()->withErrors(['cart' => 'Your cart is empty.']);
            }

            $cart->load('items.product');
            $items = $cart->items;
            $total = $cart->getTotal();
        }

        // Validate stock for all items
        foreach ($items as $item) {
            $product = $isGuest ? $item['product'] : $item->product;
            $quantity = $isGuest ? $item['quantity'] : $item->quantity;
            
            if ($product->stock_quantity < $quantity) {
                return back()->withErrors([
                    'stock' => "Not enough stock for {$product->name}. Only {$product->stock_quantity} available."
                ]);
            }
        }

        try {
            DB::beginTransaction();

            // Create shipping address for guests
            $shippingAddressId = null;
            
            if ($isGuest) {
                // Store address in session for guest order (we'll create it inline)
                $guestAddress = [
                    'name' => $request->shipping_name,
                    'street' => $request->shipping_street,
                    'city' => $request->shipping_city,
                    'state' => $request->shipping_state,
                    'zip' => $request->shipping_zip,
                    'country' => $request->shipping_country,
                    'phone' => $request->shipping_phone,
                ];
            } else {
                $shippingAddressId = $request->shipping_address_id;
            }

            // Create order
            $order = Order::create([
                'user_id' => $isGuest ? null : auth()->id(),
                'guest_email' => $isGuest ? $request->guest_email : null,
                'guest_name' => $isGuest ? $request->guest_name : null,
                'total' => $total,
                'status' => Order::STATUS_PENDING,
                'shipping_address_id' => $shippingAddressId,
                'guest_shipping_address' => $isGuest ? json_encode($guestAddress) : null,
                'payment_method' => $request->payment_method,
                'notes' => $request->notes,
            ]);

            // Create order items and update stock
            foreach ($items as $item) {
                $product = $isGuest ? $item['product'] : $item->product;
                $quantity = $isGuest ? $item['quantity'] : $item->quantity;
                
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                ]);

                // Decrement stock
                $product->decrement('stock_quantity', $quantity);
            }

            // Clear cart
            if ($isGuest) {
                $this->guestCart->clear();
            } else {
                $cart->items()->delete();
            }

            DB::commit();

            // Dispatch job to check for low stock items
            CheckLowStockJob::dispatch();

            return Inertia::render('Orders/Confirmation', [
                'order' => $order->load('items.product'),
                'isGuest' => $isGuest,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['checkout' => 'An error occurred during checkout. Please try again.']);
        }
    }
}
