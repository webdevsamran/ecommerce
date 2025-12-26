import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function ProductFilters({ categories, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [sort, setSort] = useState(filters.sort || 'newest');
    const [category, setCategory] = useState(filters.category || '');
    const [inStock, setInStock] = useState(filters.in_stock || false);

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A-Z' },
        { value: 'name_desc', label: 'Name: Z-A' },
        { value: 'popular', label: 'Most Popular' },
    ];

    const applyFilters = () => {
        const params = {};
        if (search) params.search = search;
        if (sort && sort !== 'newest') params.sort = sort;
        if (category) params.category = category;
        if (inStock) params.in_stock = '1';

        router.get(route('home'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSort('newest');
        setCategory('');
        setInStock(false);
        router.get(route('home'));
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search !== filters.search) {
                applyFilters();
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const handleSortChange = (e) => {
        setSort(e.target.value);
        const params = { ...filters, sort: e.target.value };
        if (e.target.value === 'newest') delete params.sort;
        router.get(route('home'), params, { preserveState: true });
    };

    const handleCategoryChange = (slug) => {
        const newCategory = category === slug ? '' : slug;
        setCategory(newCategory);
        const params = { ...filters, category: newCategory };
        if (!newCategory) delete params.category;
        router.get(route('home'), params, { preserveState: true });
    };

    const handleInStockChange = () => {
        const newValue = !inStock;
        setInStock(newValue);
        const params = { ...filters, in_stock: newValue ? '1' : undefined };
        if (!newValue) delete params.in_stock;
        router.get(route('home'), params, { preserveState: true });
    };

    const hasActiveFilters = search || category || inStock || (sort && sort !== 'newest');

    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition"
                        />
                    </div>
                </div>

                {/* Sort */}
                <select
                    value={sort}
                    onChange={handleSortChange}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition cursor-pointer"
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900">
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* In Stock Toggle */}
                <button
                    onClick={handleInStockChange}
                    className={`px-4 py-3 rounded-xl border transition ${inStock
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                        }`}
                >
                    In Stock Only
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl hover:bg-red-500/30 transition"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Category Pills */}
            {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.slug)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${category === cat.slug
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat.name}
                            <span className="ml-1 text-white/50">({cat.products_count})</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
