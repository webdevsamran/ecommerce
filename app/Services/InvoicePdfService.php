<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\View;

class InvoicePdfService
{
    /**
     * Generate PDF invoice for an order
     * 
     * Note: This uses a simple HTML approach that can be extended
     * with dompdf or similar library for actual PDF generation.
     */
    public function generate(Order $order): string
    {
        $order->load(['items.product', 'user', 'shippingAddress']);
        
        $shippingAddress = $order->shipping_details;
        $customerName = $order->customer_name;
        $customerEmail = $order->customer_email;

        $html = $this->buildInvoiceHtml($order, $shippingAddress, $customerName, $customerEmail);
        
        return $html;
    }

    /**
     * Build the invoice HTML
     */
    protected function buildInvoiceHtml(Order $order, ?array $shippingAddress, string $customerName, string $customerEmail): string
    {
        $items = $order->items;
        $subtotal = $order->total;
        $currency = config('shop.currency', 'USD');

        $itemsHtml = '';
        foreach ($items as $item) {
            $lineTotal = $item->quantity * $item->price;
            $itemsHtml .= "
                <tr>
                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb;'>{$item->product->name}</td>
                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;'>{$item->quantity}</td>
                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;'>$" . number_format($item->price, 2) . "</td>
                    <td style='padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;'>$" . number_format($lineTotal, 2) . "</td>
                </tr>
            ";
        }

        $addressHtml = '';
        if ($shippingAddress) {
            $addressHtml = "
                <div style='flex: 1;'>
                    <h3 style='margin: 0 0 10px 0; color: #374151;'>Ship To</h3>
                    <p style='margin: 0; color: #6b7280; line-height: 1.6;'>
                        {$shippingAddress['name']}<br>
                        {$shippingAddress['street']}<br>
                        {$shippingAddress['city']}, {$shippingAddress['state']} {$shippingAddress['zip']}<br>
                        {$shippingAddress['country']}
                    </p>
                </div>
            ";
        }

        return "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <title>Invoice #{$order->id}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: #f9fafb; }
        .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; }
        .invoice-info { text-align: right; }
        .invoice-number { font-size: 24px; font-weight: bold; color: #1f2937; }
        .invoice-date { color: #6b7280; margin-top: 5px; }
        .addresses { display: flex; gap: 40px; margin-bottom: 40px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; color: #374151; }
        th:nth-child(2), th:nth-child(3), th:nth-child(4) { text-align: center; }
        th:last-child { text-align: right; }
        .totals { margin-top: 20px; text-align: right; }
        .total-row { display: flex; justify-content: flex-end; padding: 8px 0; }
        .total-label { width: 150px; text-align: right; color: #6b7280; }
        .total-value { width: 100px; text-align: right; font-weight: 600; }
        .grand-total { font-size: 20px; color: #8b5cf6; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 14px; }
        @media print { body { background: white; } .invoice { box-shadow: none; } }
    </style>
</head>
<body>
    <div class='invoice'>
        <div class='header'>
            <div class='logo'>TechStore</div>
            <div class='invoice-info'>
                <div class='invoice-number'>Invoice #{$order->id}</div>
                <div class='invoice-date'>" . date('F j, Y', strtotime($order->created_at)) . "</div>
            </div>
        </div>

        <div class='addresses'>
            <div style='flex: 1;'>
                <h3 style='margin: 0 0 10px 0; color: #374151;'>Bill To</h3>
                <p style='margin: 0; color: #6b7280; line-height: 1.6;'>
                    {$customerName}<br>
                    {$customerEmail}
                </p>
            </div>
            {$addressHtml}
        </div>

        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {$itemsHtml}
            </tbody>
        </table>

        <div class='totals'>
            <div class='total-row'>
                <span class='total-label'>Subtotal:</span>
                <span class='total-value'>$" . number_format($subtotal, 2) . "</span>
            </div>
            <div class='total-row'>
                <span class='total-label'>Shipping:</span>
                <span class='total-value'>Free</span>
            </div>
            <div class='total-row'>
                <span class='total-label grand-total'>Total:</span>
                <span class='total-value grand-total'>$" . number_format($subtotal, 2) . "</span>
            </div>
        </div>

        <div class='footer'>
            <p>Thank you for your purchase!</p>
            <p>Payment Method: " . ucwords(str_replace('_', ' ', $order->payment_method ?? 'Card')) . "</p>
        </div>
    </div>
</body>
</html>
        ";
    }

    /**
     * Generate and stream PDF download
     * For actual PDF, integrate with dompdf:
     * composer require barryvdh/laravel-dompdf
     */
    public function download(Order $order)
    {
        $html = $this->generate($order);
        
        // If dompdf is installed, use it:
        // $pdf = \PDF::loadHTML($html);
        // return $pdf->download("invoice-{$order->id}.pdf");
        
        // For now, return HTML that can be printed to PDF
        return response($html)
            ->header('Content-Type', 'text/html');
    }
}
