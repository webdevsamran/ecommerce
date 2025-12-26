<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class LowStockNotification extends Mailable
{
    use Queueable, SerializesModels;

    public Collection $products;
    public int $criticalCount;
    public int $warningThreshold;
    public int $criticalThreshold;

    /**
     * Create a new message instance.
     */
    public function __construct(Collection $products, int $criticalCount = 0)
    {
        $this->products = $products;
        $this->criticalCount = $criticalCount;
        $this->warningThreshold = config('shop.low_stock_threshold', 10);
        $this->criticalThreshold = config('shop.critical_stock_threshold', 5);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->criticalCount > 0 
            ? "⚠️ Critical: {$this->criticalCount} Products Need Immediate Restocking"
            : "Low Stock Alert: {$this->products->count()} Products Running Low";
            
        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.low-stock',
        );
    }
}
