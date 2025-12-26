<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('categories', 'reviews');

        // Search
        if ($search = $request->get('search')) {
            $query->search($search);
        }

        // Category filter
        if ($categorySlug = $request->get('category')) {
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Price filter
        if ($minPrice = $request->get('min_price')) {
            $query->where('price', '>=', $minPrice);
        }
        if ($maxPrice = $request->get('max_price')) {
            $query->where('price', '<=', $maxPrice);
        }

        // In stock filter
        if ($request->boolean('in_stock')) {
            $query->inStock();
        }

        // Featured filter
        if ($request->boolean('featured')) {
            $query->featured();
        }

        // Sorting
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'popular':
                $query->withCount('orderItems')->orderBy('order_items_count', 'desc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(config('shop.products_per_page', 12))
            ->withQueryString();

        $categories = Category::withCount('products')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->get('search', ''),
                'category' => $request->get('category', ''),
                'min_price' => $request->get('min_price', ''),
                'max_price' => $request->get('max_price', ''),
                'in_stock' => $request->boolean('in_stock'),
                'featured' => $request->boolean('featured'),
                'sort' => $request->get('sort', 'newest'),
            ],
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['categories', 'reviews.user']);
        
        $relatedProducts = Product::whereHas('categories', function ($q) use ($product) {
            $q->whereIn('categories.id', $product->categories->pluck('id'));
        })
            ->where('id', '!=', $product->id)
            ->inStock()
            ->take(4)
            ->get();

        $userReview = null;
        $canReview = false;

        if (auth()->check()) {
            $user = auth()->user();
            $userReview = $user->reviews()->where('product_id', $product->id)->first();
            
            // User can review if they purchased this product and haven't reviewed yet
            $hasPurchased = $user->orders()
                ->whereHas('items', fn($q) => $q->where('product_id', $product->id))
                ->exists();
            $canReview = $hasPurchased && !$userReview;
        }

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'userReview' => $userReview,
            'canReview' => $canReview,
        ]);
    }
}
