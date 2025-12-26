# 🛒 E-commerce Shopping Cart

A full-featured e-commerce shopping cart application built with **Laravel 11**, **React** (Inertia.js), and **Tailwind CSS**.

![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=flat-square&logo=laravel)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Features

### 🛍️ Shopping Experience

- **Product Catalog** - Browse products with search, filters, categories, and sorting
- **Product Details** - View product information, images, stock status, and reviews
- **Shopping Cart** - Add items, update quantities with +/- buttons, remove items
- **Cart Drawer** - Slide-out cart preview from navbar with reactive quantity controls
- **Wishlist** - Save products for later (visible to guests with login redirect)
- **Guest Checkout** - Complete purchases without registration
- **User Checkout** - Saved addresses and order history for registered users

### 👤 User Features

- **Authentication** - Register, login, logout (Laravel Breeze)
- **Order History** - View past orders with status tracking
- **Address Book** - Manage multiple shipping/billing addresses
- **Product Reviews** - Rate and review products
- **Dark/Light Theme** - Toggle between themes with persistence

### 👨‍💼 Admin Features

- **Dashboard** - Sales overview, low stock alerts, recent orders
- **Sales Reports** - Daily/weekly/monthly reports with visual charts
- **CSV Export** - Export sales data for external analysis
- **Email Reports** - Send reports directly via email

### ⚙️ Technical Features

- **Low Stock Notifications** - Laravel Queue/Job sends email to admin when stock runs low
- **Daily Sales Report** - Scheduled cron job runs at 6 PM daily
- **Real-time Cart Updates** - Inertia.js for reactive cart count and subtotal
- **Stock Validation** - Prevent overselling with server-side validation
- **Toast Notifications** - Feedback for user actions (add to cart, updates, etc.)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Laravel 11, PHP 8.2+ |
| **Frontend** | React 18, Inertia.js |
| **Styling** | Tailwind CSS 3 |
| **Database** | SQLite (default), MySQL/PostgreSQL supported |
| **Queue** | Database driver |
| **Authentication** | Laravel Breeze |

---

## 🚀 Installation

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/webdevsamran/ecommerce.git
cd ecommerce

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations and seed
php artisan migrate:fresh --seed

# Build frontend assets
npm run build

# Start the development server
php artisan serve
```

### Development Mode

```bash
# Run Vite dev server for hot reloading
npm run dev

# In a separate terminal, run Laravel
php artisan serve
```

---

## 👤 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | <admin@example.com> | password |

Register as a new user to test customer features, or use guest checkout without registration.

---

## 🔧 Configuration

Edit `config/shop.php` to customize:

```php
return [
    'low_stock_threshold' => 10,      // Warning level
    'critical_stock_threshold' => 5,   // Critical level
    'products_per_page' => 12,
    'payment_methods' => [
        'card' => 'Credit/Debit Card',
        'paypal' => 'PayPal',
        'bank_transfer' => 'Bank Transfer',
        'cod' => 'Cash on Delivery',
    ],
];
```

---

## 📧 Email Notifications

### Low Stock Alerts

Automatically triggered when products fall below the threshold after checkout.

### Daily Sales Report

Scheduled to run at 6 PM daily via Laravel scheduler.

```bash
# Process queued jobs
php artisan queue:work

# Run daily sales report manually
php artisan report:daily-sales

# Start the scheduler (for cron)
php artisan schedule:work
```

> **Note:** In development, emails are logged to `storage/logs/laravel.log`

---

## 🗂️ Project Structure

```
app/
├── Console/Commands/
│   └── SendDailySalesReport.php    # Daily sales cron command
├── Http/
│   ├── Controllers/
│   │   ├── Admin/                  # Dashboard, Reports
│   │   ├── CartController.php      # Cart CRUD operations
│   │   ├── CheckoutController.php  # Checkout flow (guest + user)
│   │   ├── OrderController.php     # Order management
│   │   └── WishlistController.php  # Wishlist operations
│   └── Middleware/
│       └── HandleInertiaRequests.php  # Shared props (cart, wishlist)
├── Jobs/
│   └── CheckLowStockJob.php        # Queue job for low stock emails
├── Mail/
│   ├── DailySalesReport.php        # Daily report mailable
│   └── LowStockNotification.php    # Low stock alert mailable
├── Models/
│   ├── Cart.php, CartItem.php      # Cart with user association
│   ├── Order.php, OrderItem.php    # Orders with guest support
│   ├── Product.php                 # Products with stock tracking
│   └── User.php                    # Users with cart relationship
└── Services/
    └── GuestCartService.php        # Session-based guest cart

resources/js/
├── Components/
│   ├── Navbar.jsx                  # Navigation with cart drawer
│   ├── CartDrawer.jsx              # Slide-out cart with controls
│   ├── Toast.jsx                   # Notification component
│   └── ThemeContext.jsx            # Dark/light theme toggle
└── Pages/
    ├── Cart/Index.jsx              # Full cart page
    ├── Checkout/Index.jsx          # Checkout (guest + user)
    ├── Orders/                     # Order history & confirmation
    ├── Products/                   # Product listing & details
    └── Wishlist/Index.jsx          # User wishlist
```

---

## 🔑 Key Implementation Details

### Cart Association with Users

- Each authenticated user has one cart (`User hasOne Cart`)
- Cart items are stored in the database, not sessions
- Guest cart uses session storage via `GuestCartService`
- Guest cart transfers to user cart upon login

### Low Stock Notification Flow

1. User completes checkout
2. `CheckoutController` decrements product stock
3. `CheckLowStockJob` is dispatched to the queue
4. Job checks products below threshold
5. Email sent to all admin users

### Daily Sales Report Flow

1. Scheduler runs `report:daily-sales` at 6 PM
2. `SendDailySalesReport` command queries today's orders
3. Calculates totals and item counts
4. Sends `DailySalesReport` email to admin

---

## 📝 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Product listing (homepage) |
| GET | `/products/{id}` | Product details |
| GET | `/cart` | View cart |
| POST | `/cart` | Add to cart |
| PATCH | `/cart/{id}` | Update quantity |
| DELETE | `/cart/{id}` | Remove item |
| GET | `/checkout` | Checkout page |
| POST | `/checkout` | Process order |
| GET | `/orders` | Order history |
| GET | `/wishlist` | User wishlist |

---

## � License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## 👨‍💻 Author

**webdevsamran**

- GitHub: [@webdevsamran](https://github.com/webdevsamran)
