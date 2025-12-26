import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { useState } from 'react';

export default function Index({ cart = null, items = [], total = 0, addresses = [], defaultAddress = null, paymentMethods, isGuest }) {
    const { auth } = usePage().props;
    const cartItems = cart?.items || items || [];

    const [selectedAddress, setSelectedAddress] = useState(defaultAddress?.id || null);
    const [showNewAddress, setShowNewAddress] = useState(!addresses.length);

    const { data, setData, post, processing, errors } = useForm({
        // Guest fields
        guest_email: '',
        guest_name: '',
        shipping_name: '',
        shipping_street: '',
        shipping_city: '',
        shipping_state: '',
        shipping_zip: '',
        shipping_country: 'US',
        shipping_phone: '',
        // Common fields
        shipping_address_id: defaultAddress?.id || null,
        payment_method: 'card',
        notes: '',
    });

    const { data: addressData, setData: setAddressData, post: postAddress, processing: addressProcessing } = useForm({
        type: 'shipping',
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
        is_default: false,
    });

    const handleCheckout = (e) => {
        e.preventDefault();
        post(route('checkout.store'));
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        postAddress(route('addresses.store'), {
            onSuccess: () => {
                setShowNewAddress(false);
            },
        });
    };

    const subtotal = cartItems.reduce((sum, item) => {
        const product = item.product;
        const quantity = item.quantity;
        return sum + (quantity * parseFloat(product.price));
    }, 0);

    return (
        <>
            <Head title="Checkout" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
                    {isGuest && (
                        <p className="text-white/60 mb-8">
                            Checking out as guest. <Link href={route('login')} className="text-purple-400 hover:underline">Login</Link> for a faster checkout.
                        </p>
                    )}

                    <form onSubmit={handleCheckout}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Guest Info */}
                                {isGuest && (
                                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                        <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Full Name *"
                                                value={data.guest_name}
                                                onChange={(e) => setData('guest_name', e.target.value)}
                                                className="col-span-2 sm:col-span-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                required
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email Address *"
                                                value={data.guest_email}
                                                onChange={(e) => setData('guest_email', e.target.value)}
                                                className="col-span-2 sm:col-span-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                required
                                            />
                                        </div>
                                        {errors.guest_email && <p className="text-red-400 text-sm mt-2">{errors.guest_email}</p>}
                                        {errors.guest_name && <p className="text-red-400 text-sm mt-2">{errors.guest_name}</p>}
                                    </div>
                                )}

                                {/* Shipping Address */}
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Shipping Address</h2>

                                    {!isGuest && addresses.length > 0 && !showNewAddress ? (
                                        <div className="space-y-3">
                                            {addresses.map((address) => (
                                                <label
                                                    key={address.id}
                                                    className={`block p-4 rounded-xl border cursor-pointer transition ${data.shipping_address_id === address.id
                                                            ? 'bg-purple-500/20 border-purple-500'
                                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address"
                                                        value={address.id}
                                                        checked={data.shipping_address_id === address.id}
                                                        onChange={(e) => setData('shipping_address_id', parseInt(e.target.value))}
                                                        className="hidden"
                                                    />
                                                    <p className="text-white font-medium">{address.name}</p>
                                                    <p className="text-white/60 text-sm">{address.street}</p>
                                                    <p className="text-white/60 text-sm">
                                                        {address.city}, {address.state} {address.zip}
                                                    </p>
                                                </label>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setShowNewAddress(true)}
                                                className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/40 transition"
                                            >
                                                + Add New Address
                                            </button>
                                        </div>
                                    ) : (
                                        /* Address form for guests or new address */
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Recipient Name *"
                                                    value={isGuest ? data.shipping_name : addressData.name}
                                                    onChange={(e) => isGuest ? setData('shipping_name', e.target.value) : setAddressData('name', e.target.value)}
                                                    className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                    required={isGuest}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Phone (optional)"
                                                    value={isGuest ? data.shipping_phone : addressData.phone}
                                                    onChange={(e) => isGuest ? setData('shipping_phone', e.target.value) : setAddressData('phone', e.target.value)}
                                                    className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Street Address *"
                                                    value={isGuest ? data.shipping_street : addressData.street}
                                                    onChange={(e) => isGuest ? setData('shipping_street', e.target.value) : setAddressData('street', e.target.value)}
                                                    className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                    required={isGuest}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="City *"
                                                    value={isGuest ? data.shipping_city : addressData.city}
                                                    onChange={(e) => isGuest ? setData('shipping_city', e.target.value) : setAddressData('city', e.target.value)}
                                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                    required={isGuest}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="State"
                                                    value={isGuest ? data.shipping_state : addressData.state}
                                                    onChange={(e) => isGuest ? setData('shipping_state', e.target.value) : setAddressData('state', e.target.value)}
                                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="ZIP Code *"
                                                    value={isGuest ? data.shipping_zip : addressData.zip}
                                                    onChange={(e) => isGuest ? setData('shipping_zip', e.target.value) : setAddressData('zip', e.target.value)}
                                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                    required={isGuest}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Country *"
                                                    value={isGuest ? data.shipping_country : addressData.country}
                                                    onChange={(e) => isGuest ? setData('shipping_country', e.target.value) : setAddressData('country', e.target.value)}
                                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                                    required={isGuest}
                                                />
                                            </div>
                                            {!isGuest && (
                                                <div className="flex gap-4">
                                                    <button
                                                        type="button"
                                                        onClick={handleAddAddress}
                                                        disabled={addressProcessing}
                                                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
                                                    >
                                                        Save Address
                                                    </button>
                                                    {addresses.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewAddress(false)}
                                                            className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(paymentMethods || {}).map(([key, label]) => (
                                            <label
                                                key={key}
                                                className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${data.payment_method === key
                                                        ? 'bg-purple-500/20 border-purple-500'
                                                        : 'bg-white/5 border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    value={key}
                                                    checked={data.payment_method === key}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="hidden"
                                                />
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.payment_method === key ? 'border-purple-500' : 'border-white/30'
                                                    }`}>
                                                    {data.payment_method === key && (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                                                    )}
                                                </div>
                                                <span className="text-white">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                    <h2 className="text-xl font-semibold text-white mb-4">Order Notes (Optional)</h2>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Special instructions for your order..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none"
                                    />
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 sticky top-24">
                                    <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id || item.product_id} className="flex gap-4">
                                                <img
                                                    src={item.product.image || 'https://via.placeholder.com/60'}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-white font-medium text-sm line-clamp-1">{item.product.name}</p>
                                                    <p className="text-white/50 text-sm">Qty: {item.quantity}</p>
                                                    <p className="text-white font-semibold">
                                                        ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-white/10 pt-4 mb-6">
                                        <div className="flex justify-between text-white/70 mb-2">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-white/70 mb-2">
                                            <span>Shipping</span>
                                            <span className="text-green-400">Free</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
                                            <span>Total</span>
                                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                ${subtotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {errors.cart && (
                                        <p className="text-red-400 text-sm mb-4">{errors.cart}</p>
                                    )}
                                    {errors.stock && (
                                        <p className="text-red-400 text-sm mb-4">{errors.stock}</p>
                                    )}
                                    {errors.checkout && (
                                        <p className="text-red-400 text-sm mb-4">{errors.checkout}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {processing ? (
                                            'Processing...'
                                        ) : (
                                            <>
                                                Place Order
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
