import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function CartDrawer({ isOpen, onClose, cart }) {
    const drawerRef = useRef(null);
    const [processing, setProcessing] = useState(false);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Close on click outside
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const items = cart?.items || [];
    const subtotal = items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        const qty = item.quantity || 0;
        return sum + (parseFloat(price) * qty);
    }, 0);

    // Update item quantity
    const updateQuantity = (item, newQuantity) => {
        if (processing) return;
        setProcessing(true);
        const itemId = item.id || item.product_id;

        if (newQuantity < 1) {
            router.delete(route('cart.destroy', itemId), {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            });
        } else {
            router.patch(route('cart.update', itemId),
                { quantity: newQuantity },
                {
                    preserveScroll: true,
                    onFinish: () => setProcessing(false),
                }
            );
        }
    };

    // Remove item
    const removeItem = (item) => {
        if (processing) return;
        setProcessing(true);
        const itemId = item.id || item.product_id;
        router.delete(route('cart.destroy', itemId), {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="relative w-full max-w-md bg-gray-900 border-l border-white/10 shadow-2xl flex flex-col animate-slide-in-right"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Your Cart
                        {items.length > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                                {items.length}
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-white/50">Your cart is empty</p>
                            <Link
                                href="/"
                                onClick={onClose}
                                className="inline-block mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id || item.product_id}
                                className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/10"
                            >
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                                    <img
                                        src={item.product?.image || 'https://via.placeholder.com/80'}
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-white font-medium truncate">
                                            {item.product?.name || 'Product'}
                                        </h3>
                                        {/* Delete button */}
                                        <button
                                            onClick={() => removeItem(item)}
                                            disabled={processing}
                                            className="p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition flex-shrink-0"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Quantity controls */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item, item.quantity - 1)}
                                            disabled={processing}
                                            className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span className="w-8 text-center text-white font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item, item.quantity + 1)}
                                            disabled={processing}
                                            className="w-7 h-7 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>

                                    <p className="text-purple-400 font-semibold mt-2">
                                        ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-white/10 space-y-4">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                            <span className="text-white/70">Subtotal</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href={route('cart.index')}
                                onClick={onClose}
                                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-center transition"
                            >
                                View Cart
                            </Link>
                            <Link
                                href={route('checkout.index')}
                                onClick={onClose}
                                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl text-center transition"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

