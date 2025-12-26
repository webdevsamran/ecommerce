import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import { useState } from 'react';

export default function Show({ product, relatedProducts, userReview, canReview }) {
    const { auth } = usePage().props;
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { data, setData, post, processing } = useForm({
        rating: 5,
        comment: '',
    });

    const addToCart = () => {
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity,
        });
    };

    const toggleWishlist = () => {
        router.post(route('wishlist.store'), {
            product_id: product.id,
        });
    };

    const submitReview = (e) => {
        e.preventDefault();
        post(route('reviews.store', product.id), {
            onSuccess: () => {
                setData('comment', '');
            },
        });
    };

    return (
        <>
            <Head title={product.name} />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <Link href="/" className="text-white/50 hover:text-white transition">
                            Products
                        </Link>
                        <span className="text-white/30 mx-2">/</span>
                        <span className="text-white">{product.name}</span>
                    </nav>

                    {/* Main Product Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Image */}
                        <div className="space-y-4">
                            <div className="aspect-square overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10">
                                <img
                                    src={product.image || 'https://via.placeholder.com/600'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            {/* Categories */}
                            {product.categories?.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                    {product.categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/?category=${cat.slug}`}
                                            className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full hover:bg-purple-500/30 transition"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

                            {/* Rating */}
                            {product.reviews_count > 0 && (
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                className={`w-5 h-5 ${star <= product.average_rating ? 'text-yellow-400' : 'text-white/20'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-white">{product.average_rating}</span>
                                    <span className="text-white/50">({product.reviews_count} reviews)</span>
                                </div>
                            )}

                            {/* Price */}
                            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                                ${parseFloat(product.price).toFixed(2)}
                            </div>

                            {/* Description */}
                            <p className="text-white/70 text-lg mb-8 leading-relaxed">{product.description}</p>

                            {/* Stock Status */}
                            <div className="mb-8">
                                {product.stock_quantity > 10 ? (
                                    <span className="inline-flex items-center gap-2 text-green-400">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        In Stock ({product.stock_quantity} available)
                                    </span>
                                ) : product.stock_quantity > 0 ? (
                                    <span className="inline-flex items-center gap-2 text-yellow-400">
                                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                                        Low Stock - Only {product.stock_quantity} left!
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2 text-red-400">
                                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            {/* Quantity & Add to Cart */}
                            <div className="flex gap-4 mb-6">
                                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 text-white hover:bg-white/10 transition"
                                    >
                                        −
                                    </button>
                                    <span className="px-4 text-white font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="px-4 py-3 text-white hover:bg-white/10 transition"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={addToCart}
                                    disabled={product.stock_quantity === 0}
                                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Add to Cart
                                </button>

                                {/* Wishlist button - only for authenticated users */}
                                {auth.user && (
                                    <button
                                        onClick={toggleWishlist}
                                        className="px-4 py-4 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* SKU */}
                            {product.sku && (
                                <p className="text-white/40 text-sm">SKU: {product.sku}</p>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">Customer Reviews</h2>

                        {/* Write Review Form */}
                        {canReview && (
                            <form onSubmit={submitReview} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
                                <h3 className="text-white font-semibold mb-4">Write a Review</h3>

                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            className="focus:outline-none"
                                        >
                                            <svg
                                                className={`w-8 h-8 transition ${star <= data.rating ? 'text-yellow-400' : 'text-white/20 hover:text-yellow-400/50'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    placeholder="Share your thoughts about this product..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 resize-none mb-4"
                                />

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
                                >
                                    Submit Review
                                </button>
                            </form>
                        )}

                        {/* Reviews List */}
                        {product.reviews?.length > 0 ? (
                            <div className="space-y-4">
                                {product.reviews.map((review) => (
                                    <div key={review.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="text-white font-semibold">{review.user?.name || 'Anonymous'}</h4>
                                                <p className="text-white/50 text-sm">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-white/20'}`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-white/70">{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                <p className="text-white/50">No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>

                    {/* Related Products */}
                    {relatedProducts?.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {relatedProducts.map((relProd) => (
                                    <Link
                                        key={relProd.id}
                                        href={route('products.show', relProd.id)}
                                        className="group bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                                    >
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={relProd.image || 'https://via.placeholder.com/200'}
                                                alt={relProd.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-white font-medium truncate mb-1">{relProd.name}</h3>
                                            <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                ${parseFloat(relProd.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
