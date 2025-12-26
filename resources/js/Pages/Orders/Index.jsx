import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Pagination from '@/Components/Pagination';

export default function Index({ orders }) {
    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        processing: 'bg-blue-500/20 text-blue-400',
        shipped: 'bg-purple-500/20 text-purple-400',
        delivered: 'bg-green-500/20 text-green-400',
        cancelled: 'bg-red-500/20 text-red-400',
    };

    return (
        <>
            <Head title="My Orders" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

                    {orders.data.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <svg className="w-20 h-20 mx-auto text-white/30 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h2 className="text-2xl font-semibold text-white mb-4">No orders yet</h2>
                            <p className="text-white/50 mb-8">Start shopping to see your orders here.</p>
                            <Link
                                href="/"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.data.map((order) => (
                                <Link
                                    key={order.id}
                                    href={route('orders.show', order.id)}
                                    className="block bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            {/* Order Images */}
                                            <div className="flex -space-x-3">
                                                {order.items.slice(0, 3).map((item, index) => (
                                                    <img
                                                        key={item.id}
                                                        src={item.product.image || 'https://via.placeholder.com/50'}
                                                        alt={item.product.name}
                                                        className="w-12 h-12 rounded-lg object-cover border-2 border-gray-800"
                                                        style={{ zIndex: 3 - index }}
                                                    />
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-12 h-12 rounded-lg bg-white/10 border-2 border-gray-800 flex items-center justify-center text-white/70 text-xs font-bold">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="text-white font-semibold">
                                                    Order #{order.id}
                                                </h3>
                                                <p className="text-white/50 text-sm">
                                                    {new Date(order.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-white/50 text-sm">{order.items.length} items</p>
                                                <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                    ${parseFloat(order.total).toFixed(2)}
                                                </p>
                                            </div>

                                            <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>

                                            <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Pagination links={orders.links} />
                </div>
            </div>
        </>
    );
}
