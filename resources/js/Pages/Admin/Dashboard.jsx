import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Dashboard({ stats, lowStockProducts, recentOrders, salesData }) {
    const statusColors = {
        pending: 'text-yellow-400',
        processing: 'text-blue-400',
        shipped: 'text-purple-400',
        delivered: 'text-green-400',
        cancelled: 'text-red-400',
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <Link
                            href={route('admin.reports.index')}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
                        >
                            View Reports
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Today's Revenue</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                ${parseFloat(stats.todayRevenue || 0).toFixed(2)}
                            </p>
                            <p className="text-white/40 text-sm mt-2">{stats.todayOrders} orders today</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Monthly Revenue</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ${parseFloat(stats.monthRevenue || 0).toFixed(2)}
                            </p>
                            <p className="text-white/40 text-sm mt-2">{stats.monthOrders} orders this month</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Pending Orders</p>
                            <p className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
                            <p className="text-white/40 text-sm mt-2">Awaiting processing</p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Total Customers</p>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                            <p className="text-white/40 text-sm mt-2">{stats.totalProducts} products</p>
                        </div>
                    </div>

                    {/* Chart - Weekly Sales */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Last 7 Days</h2>
                        <div className="flex items-end justify-between gap-2 h-48">
                            {salesData.map((day, index) => {
                                const maxRevenue = Math.max(...salesData.map(d => parseFloat(d.revenue) || 1));
                                const height = Math.max(10, (parseFloat(day.revenue) / maxRevenue) * 100);
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg transition-all duration-500 hover:opacity-80"
                                            style={{ height: `${height}%` }}
                                            title={`$${parseFloat(day.revenue).toFixed(2)}`}
                                        />
                                        <p className="text-white/50 text-xs mt-2">{day.date}</p>
                                        <p className="text-white/30 text-xs">{day.orders} orders</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Low Stock Products */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Low Stock Alert
                            </h2>

                            {lowStockProducts.length === 0 ? (
                                <p className="text-white/50 py-8 text-center">All products have sufficient stock!</p>
                            ) : (
                                <div className="space-y-3">
                                    {lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                                            <img
                                                src={product.image || 'https://via.placeholder.com/50'}
                                                alt={product.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white font-medium truncate">{product.name}</p>
                                                <p className="text-white/50 text-sm">SKU: {product.sku || 'N/A'}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock_quantity <= 5
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {product.stock_quantity} left
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>

                            {recentOrders.length === 0 ? (
                                <p className="text-white/50 py-8 text-center">No orders yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                                            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                                                #{order.id}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                                                <p className="text-white/50 text-sm">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-semibold">${parseFloat(order.total).toFixed(2)}</p>
                                                <p className={`text-sm capitalize ${statusColors[order.status]}`}>
                                                    {order.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
