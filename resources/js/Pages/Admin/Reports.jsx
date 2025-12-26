import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { useState } from 'react';

export default function Reports({ period, startDate, endDate, stats, orders, topProducts, dailyData }) {
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const [customStart, setCustomStart] = useState(startDate);
    const [customEnd, setCustomEnd] = useState(endDate);

    const periods = [
        { value: 'daily', label: 'Today' },
        { value: 'weekly', label: 'This Week' },
        { value: 'monthly', label: 'This Month' },
        { value: 'yearly', label: 'This Year' },
    ];

    const applyFilter = (newPeriod) => {
        setSelectedPeriod(newPeriod);
        router.get(route('admin.reports.index'), { period: newPeriod }, { preserveState: true });
    };

    const applyCustomRange = () => {
        router.get(route('admin.reports.index'), {
            start_date: customStart,
            end_date: customEnd,
        }, { preserveState: true });
    };

    const exportCSV = () => {
        window.location.href = route('admin.reports.export') + `?start_date=${startDate}&end_date=${endDate}`;
    };

    const sendEmail = () => {
        router.post(route('admin.reports.email'), { period: selectedPeriod });
    };

    return (
        <>
            <Head title="Sales Reports" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Sales Reports</h1>
                            <p className="text-white/50">{startDate} to {endDate}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={exportCSV}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export CSV
                            </button>
                            <button
                                onClick={sendEmail}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Report
                            </button>
                        </div>
                    </div>

                    {/* Period Filters */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex gap-2">
                                {periods.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => applyFilter(p.value)}
                                        className={`px-4 py-2 rounded-xl font-medium transition ${selectedPeriod === p.value
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white/5 text-white/70 hover:bg-white/10'
                                            }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 ml-auto">
                                <input
                                    type="date"
                                    value={customStart}
                                    onChange={(e) => setCustomStart(e.target.value)}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                                />
                                <span className="text-white/50">to</span>
                                <input
                                    type="date"
                                    value={customEnd}
                                    onChange={(e) => setCustomEnd(e.target.value)}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                                />
                                <button
                                    onClick={applyCustomRange}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Total Revenue</p>
                            <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                ${parseFloat(stats.totalRevenue || 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Total Orders</p>
                            <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Items Sold</p>
                            <p className="text-3xl font-bold text-purple-400">{stats.totalItemsSold}</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <p className="text-white/50 text-sm mb-1">Avg. Order Value</p>
                            <p className="text-3xl font-bold text-pink-400">${parseFloat(stats.averageOrderValue || 0).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Daily Chart */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Revenue Trend</h2>
                            {dailyData.length > 0 ? (
                                <div className="flex items-end justify-between gap-2 h-48">
                                    {dailyData.map((day, index) => {
                                        const maxRevenue = Math.max(...dailyData.map(d => parseFloat(d.revenue) || 1));
                                        const height = Math.max(10, (parseFloat(day.revenue) / maxRevenue) * 100);
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div
                                                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg"
                                                    style={{ height: `${height}%` }}
                                                    title={`$${parseFloat(day.revenue).toFixed(2)}`}
                                                />
                                                <p className="text-white/50 text-xs mt-2">{day.date}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-white/50 text-center py-16">No data for this period</p>
                            )}
                        </div>

                        {/* Top Products */}
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Top Selling Products</h2>
                            {topProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {topProducts.map((item, index) => (
                                        <div key={item.product?.id || index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                                            <span className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                                                #{index + 1}
                                            </span>
                                            <img
                                                src={item.product?.image || 'https://via.placeholder.com/50'}
                                                alt={item.product?.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-white font-medium truncate">{item.product?.name}</p>
                                                <p className="text-white/50 text-sm">{item.quantity} sold</p>
                                            </div>
                                            <span className="text-green-400 font-semibold">${parseFloat(item.revenue).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/50 text-center py-16">No sales in this period</p>
                            )}
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                        <h2 className="text-xl font-semibold text-white mb-6">Orders ({orders.length})</h2>
                        {orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-white/50 text-left border-b border-white/10">
                                            <th className="pb-3 font-medium">Order ID</th>
                                            <th className="pb-3 font-medium">Customer</th>
                                            <th className="pb-3 font-medium">Date</th>
                                            <th className="pb-3 font-medium">Items</th>
                                            <th className="pb-3 font-medium">Total</th>
                                            <th className="pb-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 20).map((order) => (
                                            <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="py-3 text-white">#{order.id}</td>
                                                <td className="py-3 text-white">{order.user?.name || 'Guest'}</td>
                                                <td className="py-3 text-white/70">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="py-3 text-white/70">{order.items?.length || 0}</td>
                                                <td className="py-3 text-green-400 font-semibold">${parseFloat(order.total).toFixed(2)}</td>
                                                <td className="py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                                'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-white/50 text-center py-12">No orders in this period</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
