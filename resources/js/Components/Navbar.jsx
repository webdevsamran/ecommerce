import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ThemeToggle } from './ThemeContext';
import CartDrawer from './CartDrawer';
import Toast from './Toast';

export default function Navbar() {
    const { auth, cart, wishlist } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                TechStore
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/" className="text-white/70 hover:text-white transition">
                                Products
                            </Link>

                            {/* Theme Toggle */}
                            <ThemeToggle className="bg-white/5 hover:bg-white/10" />

                            {/* Cart */}
                            <button
                                onClick={() => setCartDrawerOpen(true)}
                                className="relative p-2 text-white/70 hover:text-white transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cart?.count > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {cart.count}
                                    </span>
                                )}
                            </button>

                            {/* Wishlist - visible to all users */}
                            <Link
                                href={auth.user ? route('wishlist.index') : route('login')}
                                className="relative p-2 text-white/70 hover:text-white transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                {wishlist?.count > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {wishlist.count}
                                    </span>
                                )}
                            </Link>

                            {auth.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white text-sm hidden lg:block">{auth.user.name}</span>
                                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl py-2 z-50">
                                            <Link
                                                href={route('orders.index')}
                                                className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                                            >
                                                My Orders
                                            </Link>
                                            <Link
                                                href={route('addresses.index')}
                                                className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                                            >
                                                Addresses
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                className="block px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                                            >
                                                Profile
                                            </Link>
                                            {auth.user.is_admin && (
                                                <>
                                                    <div className="border-t border-white/10 my-2"></div>
                                                    <Link
                                                        href={route('admin.dashboard')}
                                                        className="block px-4 py-2 text-purple-400 hover:text-purple-300 hover:bg-white/5 transition"
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                </>
                                            )}
                                            <div className="border-t border-white/10 my-2"></div>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 transition"
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-white/70 hover:text-white transition"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-white/70 hover:text-white transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-white/10">
                            <div className="flex flex-col gap-2">
                                <Link href="/" className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                                    Products
                                </Link>
                                <Link href={route('cart.index')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition flex items-center justify-between">
                                    Cart
                                    {cart?.count > 0 && <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{cart.count}</span>}
                                </Link>

                                {auth.user ? (
                                    <>
                                        <Link href={route('wishlist.index')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                                            Wishlist
                                        </Link>
                                        <Link href={route('orders.index')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                                            Orders
                                        </Link>
                                        <Link href={route('addresses.index')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                                            Addresses
                                        </Link>
                                        {auth.user.is_admin && (
                                            <Link href={route('admin.dashboard')} className="px-4 py-2 text-purple-400 hover:bg-white/5 rounded-lg transition">
                                                Admin
                                            </Link>
                                        )}
                                        <div className="border-t border-white/10 my-2"></div>
                                        <Link href={route('logout')} method="post" as="button" className="px-4 py-2 text-red-400 hover:bg-white/5 rounded-lg transition text-left">
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div className="border-t border-white/10 my-2"></div>
                                        <Link href={route('login')} className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition">
                                            Login
                                        </Link>
                                        <Link href={route('register')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg text-center">
                                            Sign Up
                                        </Link>
                                    </>
                                )}

                                {/* Theme Toggle in Mobile */}
                                <div className="px-4 py-2 flex items-center justify-between">
                                    <span className="text-white/70">Theme</span>
                                    <ThemeToggle className="bg-white/5" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav >

            {/* Cart Drawer */}
            < CartDrawer
                isOpen={cartDrawerOpen}
                onClose={() => setCartDrawerOpen(false)
                }
                cart={cart}
            />

            {/* Toast Notifications */}
            < Toast />
        </>
    );
}
