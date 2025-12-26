import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import ProductFilters from '@/Components/ProductFilters';
import Pagination from '@/Components/Pagination';

export default function Index({ products, categories, filters }) {
    const { auth } = usePage().props;

    const addToCart = (productId) => {
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, { preserveScroll: true });
    };

    const toggleWishlist = (productId) => {
        router.post(route('wishlist.store'), {
            product_id: productId,
        }, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Shop" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                {/* Hero */}
                <div className="text-center py-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Premium Tech <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Essentials</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        Discover our collection of high-quality tech products at unbeatable prices.
                    </p>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    {/* Filters */}
                    <ProductFilters categories={categories} filters={filters} />

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.data.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="aspect-square overflow-hidden relative">
                                    <Link href={route('products.show', product.id)}>
                                        <img
                                            src={product.image || 'https://via.placeholder.com/400'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Badges */}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                                        {product.featured && (
                                            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                                                Featured
                                            </span>
                                        )}
                                        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                                            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                                                Low Stock
                                            </span>
                                        )}
                                        {product.stock_quantity === 0 && (
                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>

                                    {/* Wishlist Button */}
                                    {auth.user && (
                                        <button
                                            onClick={() => toggleWishlist(product.id)}
                                            className="absolute top-3 left-3 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white/70 hover:text-pink-400 transition opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                <div className="p-5">
                                    <Link href={route('products.show', product.id)}>
                                        <h3 className="text-white font-semibold text-lg mb-2 truncate hover:text-purple-400 transition">{product.name}</h3>
                                    </Link>
                                    <p className="text-white/50 text-sm mb-3 line-clamp-2">{product.description}</p>

                                    {/* Rating */}
                                    {product.reviews_count > 0 && (
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= product.average_rating ? 'text-yellow-400' : 'text-white/20'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-white/40 text-xs">({product.reviews_count})</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </span>
                                        <span className="text-white/40 text-sm">
                                            {product.stock_quantity} in stock
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => addToCart(product.id)}
                                        disabled={product.stock_quantity === 0}
                                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {products.data.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-20 h-20 mx-auto text-white/20 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-semibold text-white mb-4">No products found</h2>
                            <p className="text-white/50 mb-8">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination links={products.links} />
                </div>
            </div>
        </>
    );
}
