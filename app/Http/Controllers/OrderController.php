<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\InvoicePdfService;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected InvoicePdfService $invoiceService;

    public function __construct(InvoicePdfService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function index()
    {
        $orders = auth()->user()
            ->orders()
            ->with(['items.product'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        // Ensure order belongs to user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product', 'shippingAddress']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'statuses' => Order::statuses(),
        ]);
    }

    public function confirmation(Order $order)
    {
        // For guest orders, we allow viewing confirmation without auth
        // For user orders, verify ownership
        if ($order->user_id && $order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product']);

        return Inertia::render('Orders/Confirmation', [
            'order' => $order,
            'isGuest' => is_null($order->user_id),
        ]);
    }

    public function cancel(Order $order)
    {
        // Ensure order belongs to user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        if (!$order->canBeCancelled()) {
            return back()->withErrors(['cancel' => 'This order cannot be cancelled.']);
        }

        $order->cancel();

        return back()->with('success', 'Order cancelled successfully. Stock has been restored.');
    }

    public function invoice(Order $order)
    {
        // Ensure order belongs to user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        return $this->invoiceService->download($order);
    }
}
