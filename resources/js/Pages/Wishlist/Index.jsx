import { Head, Link, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Pagination from '@/Components/Pagination';

export default function Index({ wishlists }) {
    const removeFromWishlist = (productId) => {
        router.delete(route('wishlist.destroy', productId), {
            preserveScroll: true,
        });
    };

    const addToCart = (productId) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="My Wishlist" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        My Wishlist
                        <span className="text-white/50 text-lg ml-3">({wishlists.total} items)</span>
                    </h1>

                    {wishlists.data.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                            <svg className="w-20 h-20 mx-auto text-white/30 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h2 className="text-2xl font-semibold text-white mb-4">Your wishlist is empty</h2>
                            <p className="text-white/50 mb-8">Save items you love to view them later.</p>
                            <Link
                                href="/"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlists.data.map((wishlist) => (
                                <div
                                    key={wishlist.id}
                                    className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                                >
                                    <div className="aspect-square overflow-hidden relative">
                                        <Link href={route('products.show', wishlist.product.id)}>
                                            <img
                                                src={wishlist.product.image || 'https://via.placeholder.com/400'}
                                                alt={wishlist.product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromWishlist(wishlist.product.id)}
                                            className="absolute top-3 right-3 p-2 bg-red-500/80 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition"
                                            title="Remove from wishlist"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        <Link href={route('products.show', wishlist.product.id)}>
                                            <h3 className="text-white font-semibold text-lg mb-2 truncate hover:text-purple-400 transition">
                                                {wishlist.product.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                ${parseFloat(wishlist.product.price).toFixed(2)}
                                            </span>
                                            <span className={`text-sm ${wishlist.product.stock_quantity > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {wishlist.product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => addToCart(wishlist.product.id)}
                                            disabled={wishlist.product.stock_quantity === 0}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Pagination links={wishlists.links} />
                </div>
            </div>
        </>
    );
}
