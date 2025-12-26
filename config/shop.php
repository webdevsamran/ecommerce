<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Stock Thresholds
    |--------------------------------------------------------------------------
    */
    'low_stock_threshold' => env('SHOP_LOW_STOCK_THRESHOLD', 10),
    'critical_stock_threshold' => env('SHOP_CRITICAL_STOCK_THRESHOLD', 5),

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */
    'products_per_page' => env('SHOP_PRODUCTS_PER_PAGE', 12),
    'orders_per_page' => env('SHOP_ORDERS_PER_PAGE', 10),
    'reviews_per_page' => env('SHOP_REVIEWS_PER_PAGE', 5),

    /*
    |--------------------------------------------------------------------------
    | Payment Methods
    |--------------------------------------------------------------------------
    */
    'payment_methods' => [
        'card' => 'Credit/Debit Card',
        'paypal' => 'PayPal',
        'bank_transfer' => 'Bank Transfer',
        'cod' => 'Cash on Delivery',
    ],

    /*
    |--------------------------------------------------------------------------
    | Admin Email
    |--------------------------------------------------------------------------
    */
    'admin_email' => env('SHOP_ADMIN_EMAIL', 'admin@example.com'),

    /*
    |--------------------------------------------------------------------------
    | Currency
    |--------------------------------------------------------------------------
    */
    'currency' => env('SHOP_CURRENCY', 'USD'),
    'currency_symbol' => env('SHOP_CURRENCY_SYMBOL', '$'),
];
