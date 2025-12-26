<?php

namespace App\Jobs;

use App\Mail\LowStockNotification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class CheckLowStockJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Use configurable threshold from shop config
        $threshold = config('shop.low_stock_threshold', 10);
        $criticalThreshold = config('shop.critical_stock_threshold', 5);
        
        // Get products with low stock
        $lowStockProducts = Product::where('stock_quantity', '<=', $threshold)
            ->where('stock_quantity', '>', 0)
            ->get();

        // Get critical stock products (separate for highlighting)
        $criticalProducts = $lowStockProducts->filter(fn($p) => $p->stock_quantity <= $criticalThreshold);

        if ($lowStockProducts->isEmpty()) {
            return;
        }

        // Batch notifications - only send once per hour max
        $cacheKey = 'low_stock_notification_sent';
        if (Cache::has($cacheKey)) {
            return;
        }

        // Get admin user(s)
        $admins = User::where('is_admin', true)->get();

        if ($admins->isEmpty()) {
            return;
        }

        // Send email notification to all admins
        foreach ($admins as $admin) {
            Mail::to($admin->email)->send(new LowStockNotification(
                $lowStockProducts,
                $criticalProducts->count()
            ));
        }

        // Cache to prevent duplicate emails
        Cache::put($cacheKey, true, now()->addHour());
    }
}
