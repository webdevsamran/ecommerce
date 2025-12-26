<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\DailySalesReport;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->get('period', 'daily');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // Set date range based on period
        if ($startDate && $endDate) {
            $start = Carbon::parse($startDate)->startOfDay();
            $end = Carbon::parse($endDate)->endOfDay();
        } else {
            switch ($period) {
                case 'weekly':
                    $start = Carbon::now()->startOfWeek();
                    $end = Carbon::now()->endOfWeek();
                    break;
                case 'monthly':
                    $start = Carbon::now()->startOfMonth();
                    $end = Carbon::now()->endOfMonth();
                    break;
                case 'yearly':
                    $start = Carbon::now()->startOfYear();
                    $end = Carbon::now()->endOfYear();
                    break;
                case 'daily':
                default:
                    $start = Carbon::today();
                    $end = Carbon::today()->endOfDay();
                    break;
            }
        }

        // Get orders in date range
        $orders = Order::with('items.product', 'user')
            ->whereBetween('created_at', [$start, $end])
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->latest()
            ->get();

        // Calculate stats
        $totalRevenue = $orders->sum('total');
        $totalOrders = $orders->count();
        $totalItemsSold = $orders->sum(fn($o) => $o->items->sum('quantity'));
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Top selling products
        $topProducts = $orders->flatMap->items
            ->groupBy('product_id')
            ->map(fn($items) => [
                'product' => $items->first()->product,
                'quantity' => $items->sum('quantity'),
                'revenue' => $items->sum(fn($i) => $i->quantity * $i->price),
            ])
            ->sortByDesc('quantity')
            ->take(10)
            ->values();

        // Daily breakdown for charts
        $dailyData = $orders->groupBy(fn($o) => $o->created_at->format('Y-m-d'))
            ->map(fn($dayOrders, $date) => [
                'date' => Carbon::parse($date)->format('M d'),
                'orders' => $dayOrders->count(),
                'revenue' => $dayOrders->sum('total'),
            ])
            ->values();

        return Inertia::render('Admin/Reports', [
            'period' => $period,
            'startDate' => $start->format('Y-m-d'),
            'endDate' => $end->format('Y-m-d'),
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalItemsSold' => $totalItemsSold,
                'averageOrderValue' => round($averageOrderValue, 2),
            ],
            'orders' => $orders,
            'topProducts' => $topProducts,
            'dailyData' => $dailyData,
        ]);
    }

    public function export(Request $request)
    {
        $startDate = Carbon::parse($request->get('start_date', today()));
        $endDate = Carbon::parse($request->get('end_date', today()))->endOfDay();

        $orders = Order::with('items.product', 'user')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $csvData = [];
        $csvData[] = ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Status'];

        foreach ($orders as $order) {
            $csvData[] = [
                $order->id,
                $order->created_at->format('Y-m-d H:i'),
                $order->user->name,
                $order->items->sum('quantity'),
                '$' . number_format($order->total, 2),
                $order->status_label,
            ];
        }

        $filename = "sales_report_{$startDate->format('Y-m-d')}_to_{$endDate->format('Y-m-d')}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function sendEmail(Request $request)
    {
        $period = $request->get('period', 'daily');
        $admin = auth()->user();

        $today = Carbon::today();
        $orders = Order::with('items.product')
            ->whereDate('created_at', $today)
            ->get();

        $totalRevenue = $orders->sum('total');
        $totalItemsSold = $orders->sum(fn($o) => $o->items->sum('quantity'));

        Mail::to($admin->email)->send(new DailySalesReport(
            $orders,
            $totalRevenue,
            $totalItemsSold,
            $today->format('F j, Y')
        ));

        return back()->with('success', 'Report sent to your email!');
    }
}
