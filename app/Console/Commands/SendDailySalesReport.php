<?php

namespace App\Console\Commands;

use App\Mail\DailySalesReport;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport extends Command
{
    protected $signature = 'report:daily-sales';
    protected $description = 'Send daily sales report to admin';

    public function handle(): void
    {
        $today = Carbon::today();
        
        // Get orders from today
        $orders = Order::with('items.product')
            ->whereDate('created_at', $today)
            ->get();

        // Calculate totals
        $totalRevenue = $orders->sum('total');
        $totalItemsSold = $orders->sum(function ($order) {
            return $order->items->sum('quantity');
        });

        // Get admin user
        $admin = User::where('is_admin', true)->first();

        if (!$admin) {
            $this->error('No admin user found.');
            return;
        }

        // Send email
        Mail::to($admin->email)->send(new DailySalesReport(
            $orders,
            $totalRevenue,
            $totalItemsSold,
            $today->format('F j, Y')
        ));

        $this->info("Daily sales report sent to {$admin->email}");
        $this->info("Orders: {$orders->count()}, Revenue: \${$totalRevenue}, Items Sold: {$totalItemsSold}");
    }
}
