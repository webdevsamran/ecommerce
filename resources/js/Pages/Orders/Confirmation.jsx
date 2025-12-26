import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Confirmation({ order, isGuest }) {
    const shippingAddress = order.shipping_details || order.guest_shipping_address;

    return (
        <>
            <Head title="Order Confirmed" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Success Icon */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
                        <p className="text-white/60 text-lg">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>
                    </div>

                    {/* Order Details */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Order #{order.id}</h2>
                                <p className="text-white/50">
                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            <span className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold capitalize">
                                {order.status}
                            </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-4 mb-6">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                    <img
                                        src={item.product.image || 'https://via.placeholder.com/80'}
                                        alt={item.product.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">{item.product.name}</h3>
                                        <p className="text-white/50 text-sm">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                                    </div>
                                    <span className="text-white font-semibold">
                                        ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                            <span className="text-white/70 text-lg">Total</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ${parseFloat(order.total).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {shippingAddress && (
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                <h3 className="text-white font-semibold mb-3">Shipping Address</h3>
                                <p className="text-white/70">
                                    {shippingAddress.name}<br />
                                    {shippingAddress.street}<br />
                                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}<br />
                                    {shippingAddress.country}
                                </p>
                            </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <h3 className="text-white font-semibold mb-3">Payment Method</h3>
                            <p className="text-white/70 capitalize">
                                {order.payment_method?.replace('_', ' ') || 'Card'}
                            </p>
                            {isGuest && order.guest_email && (
                                <>
                                    <h3 className="text-white font-semibold mb-1 mt-4">Confirmation Email</h3>
                                    <p className="text-white/70">{order.guest_email}</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/"
                            className="flex-1 py-4 bg-white/10 text-white font-semibold rounded-xl text-center hover:bg-white/20 transition"
                        >
                            Continue Shopping
                        </Link>
                        {!isGuest && (
                            <Link
                                href={route('orders.show', order.id)}
                                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl text-center transition-all duration-300"
                            >
                                View Order Details
                            </Link>
                        )}
                    </div>

                    {isGuest && (
                        <p className="text-center text-white/50 mt-6">
                            <Link href={route('register')} className="text-purple-400 hover:underline">
                                Create an account
                            </Link>
                            {' '}to track your orders and enjoy faster checkout next time.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
