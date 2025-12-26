# E-commerce Shopping Cart

A full-featured e-commerce application built with Laravel 11, React (Inertia.js), and Tailwind CSS.

## 🚀 Features

### Customer Features

- **Product Catalog** - Browse products with search, filters, categories, and sorting
- **Product Reviews** - Rate and review purchased products
- **Wishlist** - Save products for later
- **Shopping Cart** - Add items, update quantities, real-time stock validation
- **Checkout** - Multi-step with address selection and payment methods
- **Order Management** - View order history, track status, cancel orders
- **Address Book** - Manage shipping/billing addresses

### Admin Features

- **Dashboard** - Sales overview, low stock alerts, recent orders
- **Sales Reports** - Daily/weekly/monthly reports with charts
- **CSV Export** - Export sales data
- **Email Reports** - Send reports via email

### Technical Features

- **Low Stock Notifications** - Automatic email alerts (configurable thresholds)
- **Daily Sales Reports** - Scheduled at 6 PM
- **Queue Jobs** - Background processing for notifications
- **Form Validation** - Request classes for all inputs

## 📦 Tech Stack

- **Backend:** Laravel 11, PHP 8.2+
- **Frontend:** React 18, Inertia.js
- **Styling:** Tailwind CSS
- **Database:** SQLite (configurable)
- **Queue:** Database driver

## ⚙️ Installation

```bash
# Clone and install
git clone <repository-url>
cd ecommerce-cart
composer install
npm install

# Setup
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate:fresh --seed

# Build assets
npm run build

# Start server
php artisan serve
```

## 👤 Test Accounts

```
Admin: admin@example.com / password
```

Register as a new user to test customer features.

## 🔧 Configuration

Edit `config/shop.php`:

```php
'low_stock_threshold' => 10,    // Warning level
'critical_stock_threshold' => 5, // Critical level
'products_per_page' => 12,
'payment_methods' => [
    'card' => 'Credit/Debit Card',
    'paypal' => 'PayPal',
    'bank_transfer' => 'Bank Transfer',
    'cod' => 'Cash on Delivery',
],
```

## 📧 Test Email Notifications

```bash
# Process queued jobs
php artisan queue:work

# Run daily sales report manually
php artisan report:daily-sales
```

Emails are logged to `storage/logs/laravel.log` in development.

## 🗂️ Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/           # Dashboard, Reports
│   │   ├── AddressController
│   │   ├── CartController
│   │   ├── CheckoutController
│   │   ├── OrderController
│   │   ├── ProductController
│   │   ├── ReviewController
│   │   └── WishlistController
│   ├── Middleware/
│   │   └── AdminMiddleware
│   └── Requests/            # Form validation
├── Jobs/
│   └── CheckLowStockJob
├── Mail/
│   ├── DailySalesReport
│   └── LowStockNotification
└── Models/
    ├── Address, Cart, Category
    ├── Order, Product, Review
    ├── User, Wishlist

resources/js/
├── Components/
│   ├── Navbar, Pagination
│   ├── ProductFilters, Skeleton
│   ├── ErrorBoundary, SEO, Toast
└── Pages/
    ├── Admin/      # Dashboard, Reports
    ├── Cart/
    ├── Checkout/
    ├── Orders/     # Index, Show, Confirmation
    ├── Products/   # Index, Show
    ├── Profile/    # Addresses
    └── Wishlist/
```

## 📝 License

MIT License
