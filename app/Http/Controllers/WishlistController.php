<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $wishlists = $user->wishlists()
            ->with('product')
            ->latest()
            ->paginate(config('shop.products_per_page', 12));

        return inertia('Wishlist/Index', [
            'wishlists' => $wishlists,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = auth()->user();
        $productId = $request->product_id;

        // Toggle wishlist
        $existing = $user->wishlists()->where('product_id', $productId)->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Removed from wishlist');
        }

        $user->wishlists()->create([
            'product_id' => $productId,
        ]);

        return back()->with('success', 'Added to wishlist!');
    }

    public function destroy(Product $product)
    {
        $user = auth()->user();
        $user->wishlists()->where('product_id', $product->id)->delete();

        return back()->with('success', 'Removed from wishlist');
    }
}
