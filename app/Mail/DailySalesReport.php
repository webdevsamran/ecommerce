<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class DailySalesReport extends Mailable
{
    use Queueable, SerializesModels;

    public Collection $orders;
    public float $totalRevenue;
    public int $totalItemsSold;
    public string $date;

    public function __construct(Collection $orders, float $totalRevenue, int $totalItemsSold, string $date)
    {
        $this->orders = $orders;
        $this->totalRevenue = $totalRevenue;
        $this->totalItemsSold = $totalItemsSold;
        $this->date = $date;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "📊 Daily Sales Report - {$this->date}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-sales-report',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
