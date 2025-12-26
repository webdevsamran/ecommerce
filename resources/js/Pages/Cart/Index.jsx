import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Index({ cartData = null }) {
    const items = cartData?.items || [];

    const updateQuantity = (itemId, quantity) => {
        router.patch(route('cart.update', itemId), { quantity }, {
            preserveScroll: true,
        });
    };

    const removeItem = (itemId) => {
        router.delete(route('cart.destroy', itemId), {
            preserveScroll: true,
        });
    };

    const subtotal = items.reduce((sum, item) => {
        return sum + (item.quantity * parseFloat(item.product.price));
    }, 0);

    return (
        <>
            <Head title="Shopping Cart" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

                    {items.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <svg className="w-24 h-24 mx-auto text-white/30 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
                            <p className="text-white/50 mb-8">Add some products to get started.</p>
                            <Link
                                href="/"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Cart Items */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 divide-y divide-white/10">
                                {items.map((item) => (
                                    <div key={item.id} className="p-6 flex gap-6">
                                        <Link href={route('products.show', item.product.id)}>
                                            <img
                                                src={item.product.image || 'https://via.placeholder.com/120'}
                                                alt={item.product.name}
                                                className="w-28 h-28 rounded-xl object-cover hover:opacity-80 transition"
                                            />
                                        </Link>

                                        <div className="flex-1">
                                            <Link
                                                href={route('products.show', item.product.id)}
                                                className="text-white font-semibold text-lg hover:text-purple-400 transition"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <p className="text-white/50 text-sm mb-3 line-clamp-1">{item.product.description}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-12 text-center text-white font-semibold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.min(item.product.stock_quantity, item.quantity + 1))}
                                                        disabled={item.quantity >= item.product.stock_quantity}
                                                        className="w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20 transition flex items-center justify-center disabled:opacity-50"
                                                    >
                                                        +
                                                    </button>
                                                    {item.product.stock_quantity <= 5 && (
                                                        <span className="ml-2 text-yellow-400 text-sm">
                                                            Only {item.product.stock_quantity} left
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-400 hover:text-red-300 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-white/50 text-sm">${parseFloat(item.product.price).toFixed(2)} each</p>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-white/70">Subtotal ({items.length} items)</span>
                                    <span className="text-xl font-bold text-white">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-white/70">Shipping</span>
                                    <span className="text-green-400 font-semibold">Free</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10 mb-6">
                                    <span className="text-xl font-semibold text-white">Total</span>
                                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex gap-4">
                                    <Link
                                        href="/"
                                        className="flex-1 py-4 bg-white/10 text-white font-semibold rounded-xl text-center hover:bg-white/20 transition"
                                    >
                                        Continue Shopping
                                    </Link>
                                    <Link
                                        href={route('checkout.index')}
                                        className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl text-center transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Proceed to Checkout
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
