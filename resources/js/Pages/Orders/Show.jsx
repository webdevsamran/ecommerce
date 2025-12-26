import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

export default function Show({ order, statuses }) {
    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
        processing: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
        shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
        delivered: 'bg-green-500/20 text-green-400 border-green-500/50',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = statusSteps.indexOf(order.status);

    const cancelOrder = () => {
        if (confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
            router.post(route('orders.cancel', order.id));
        }
    };

    return (
        <>
            <Head title={`Order #${order.id}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Link href={route('orders.index')} className="text-white/50 hover:text-white transition mb-2 inline-flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Orders
                            </Link>
                            <h1 className="text-3xl font-bold text-white">Order #{order.id}</h1>
                            <p className="text-white/50">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <span className={`px-6 py-3 rounded-full text-lg font-semibold capitalize border ${statusColors[order.status]}`}>
                            {order.status}
                        </span>
                    </div>

                    {/* Status Timeline */}
                    {order.status !== 'cancelled' && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
                            <h2 className="text-white font-semibold mb-6">Order Progress</h2>
                            <div className="flex items-center justify-between">
                                {statusSteps.map((step, index) => (
                                    <div key={step} className="flex-1 relative">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= currentStepIndex
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-white/10 text-white/30'
                                                }`}>
                                                {index < currentStepIndex ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <span>{index + 1}</span>
                                                )}
                                            </div>
                                            <span className={`mt-2 text-sm capitalize ${index <= currentStepIndex ? 'text-white' : 'text-white/30'
                                                }`}>
                                                {statuses[step]}
                                            </span>
                                        </div>
                                        {index < statusSteps.length - 1 && (
                                            <div className={`absolute top-5 left-1/2 w-full h-0.5 ${index < currentStepIndex ? 'bg-purple-600' : 'bg-white/10'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
                        <h2 className="text-white font-semibold mb-4">Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                                    <img
                                        src={item.product.image || 'https://via.placeholder.com/80'}
                                        alt={item.product.name}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">{item.product.name}</h3>
                                        <p className="text-white/50 text-sm">Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</p>
                                    </div>
                                    <span className="text-lg font-bold text-white">
                                        ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                            <span className="text-white/70 text-lg">Total</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ${parseFloat(order.total).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shipping_address && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-6">
                            <h2 className="text-white font-semibold mb-4">Shipping Address</h2>
                            <p className="text-white/70">
                                {order.shipping_address.name}<br />
                                {order.shipping_address.street}<br />
                                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
                                {order.shipping_address.country}
                            </p>
                        </div>
                    )}

                    {/* Payment & Notes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <h2 className="text-white font-semibold mb-2">Payment Method</h2>
                            <p className="text-white/70 capitalize">{order.payment_method?.replace('_', ' ') || 'Card'}</p>
                        </div>
                        {order.notes && (
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                <h2 className="text-white font-semibold mb-2">Order Notes</h2>
                                <p className="text-white/70">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Cancel Button */}
                    {(order.status === 'pending' || order.status === 'processing') && (
                        <button
                            onClick={cancelOrder}
                            className="w-full py-4 bg-red-500/20 border border-red-500/50 text-red-400 font-semibold rounded-xl hover:bg-red-500/30 transition"
                        >
                            Cancel Order
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
