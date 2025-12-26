<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Today's stats
        $today = Carbon::today();
        $todayOrders = Order::whereDate('created_at', $today)->count();
        $todayRevenue = Order::whereDate('created_at', $today)
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->sum('total');

        // This month stats
        $monthStart = Carbon::now()->startOfMonth();
        $monthOrders = Order::where('created_at', '>=', $monthStart)->count();
        $monthRevenue = Order::where('created_at', '>=', $monthStart)
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->sum('total');

        // Low stock products
        $lowStockProducts = Product::where('stock_quantity', '<=', config('shop.low_stock_threshold', 10))
            ->orderBy('stock_quantity')
            ->take(10)
            ->get();

        // Recent orders
        $recentOrders = Order::with('user', 'items.product')
            ->latest()
            ->take(5)
            ->get();

        // Stats for charts (last 7 days)
        $salesData = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            return [
                'date' => $date->format('M d'),
                'orders' => Order::whereDate('created_at', $date)->count(),
                'revenue' => Order::whereDate('created_at', $date)
                    ->where('status', '!=', Order::STATUS_CANCELLED)
                    ->sum('total'),
            ];
        });

        // Summary counts
        $totalProducts = Product::count();
        $totalUsers = User::where('is_admin', false)->count();
        $pendingOrders = Order::where('status', Order::STATUS_PENDING)->count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'todayOrders' => $todayOrders,
                'todayRevenue' => $todayRevenue,
                'monthOrders' => $monthOrders,
                'monthRevenue' => $monthRevenue,
                'totalProducts' => $totalProducts,
                'totalUsers' => $totalUsers,
                'pendingOrders' => $pendingOrders,
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
            'salesData' => $salesData,
        ]);
    }
}
