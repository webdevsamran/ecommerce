import { Head, useForm } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { useState } from 'react';

export default function Addresses({ addresses }) {
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, patch, delete: destroy, processing, reset } = useForm({
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            patch(route('addresses.update', editingId), {
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post(route('addresses.store'), {
                onSuccess: () => {
                    setShowForm(false);
                    reset();
                },
            });
        }
    };

    const startEdit = (address) => {
        setEditingId(address.id);
        setData({
            type: address.type,
            name: address.name,
            phone: address.phone || '',
            street: address.street,
            city: address.city,
            state: address.state || '',
            zip: address.zip,
            country: address.country,
            is_default: address.is_default,
        });
        setShowForm(true);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setShowForm(false);
        reset();
    };

    const deleteAddress = (id) => {
        if (confirm('Are you sure you want to delete this address?')) {
            destroy(route('addresses.destroy', id));
        }
    };

    const setDefault = (id) => {
        post(route('addresses.default', id));
    };

    return (
        <>
            <Head title="My Addresses" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-white">My Addresses</h1>
                        {!showForm && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition"
                            >
                                Add Address
                            </button>
                        )}
                    </div>

                    {/* Form */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-6">
                                {editingId ? 'Edit Address' : 'New Address'}
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500"
                                >
                                    <option value="shipping" className="bg-gray-900">Shipping Address</option>
                                    <option value="billing" className="bg-gray-900">Billing Address</option>
                                </select>

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="col-span-2 sm:col-span-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Phone (optional)"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="col-span-2 sm:col-span-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                />

                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={data.street}
                                    onChange={(e) => setData('street', e.target.value)}
                                    className="col-span-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="City"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="State"
                                    value={data.state}
                                    onChange={(e) => setData('state', e.target.value)}
                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                />

                                <input
                                    type="text"
                                    placeholder="ZIP Code"
                                    value={data.zip}
                                    onChange={(e) => setData('zip', e.target.value)}
                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                    required
                                />

                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={data.country}
                                    onChange={(e) => setData('country', e.target.value)}
                                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                    required
                                />

                                <label className="col-span-2 flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_default}
                                        onChange={(e) => setData('is_default', e.target.checked)}
                                        className="w-5 h-5 rounded bg-white/5 border-white/20 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-white/70">Set as default address</span>
                                </label>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : (editingId ? 'Update' : 'Save')} Address
                                </button>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Address List */}
                    {addresses.length === 0 && !showForm ? (
                        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <svg className="w-20 h-20 mx-auto text-white/30 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h2 className="text-2xl font-semibold text-white mb-4">No addresses saved</h2>
                            <p className="text-white/50 mb-8">Add an address for faster checkout.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className={`bg-white/5 backdrop-blur-md rounded-2xl border p-6 transition ${address.is_default ? 'border-purple-500/50' : 'border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-white font-semibold">{address.name}</h3>
                                                <span className="px-2 py-1 bg-white/10 text-white/50 text-xs rounded capitalize">
                                                    {address.type}
                                                </span>
                                                {address.is_default && (
                                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white/70">{address.street}</p>
                                            <p className="text-white/70">
                                                {address.city}, {address.state} {address.zip}
                                            </p>
                                            <p className="text-white/70">{address.country}</p>
                                            {address.phone && (
                                                <p className="text-white/50 mt-2">📞 {address.phone}</p>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {!address.is_default && (
                                                <button
                                                    onClick={() => setDefault(address.id)}
                                                    className="p-2 text-white/50 hover:text-purple-400 transition"
                                                    title="Set as default"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => startEdit(address)}
                                                className="p-2 text-white/50 hover:text-blue-400 transition"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => deleteAddress(address.id)}
                                                className="p-2 text-white/50 hover:text-red-400 transition"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
