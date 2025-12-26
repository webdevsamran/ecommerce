import { Head } from '@inertiajs/react';

export default function SEO({
    title,
    description,
    image,
    url,
    type = 'website',
    product = null
}) {
    const siteName = 'TechStore';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDescription = 'Premium tech products at unbeatable prices. Shop headphones, smart watches, keyboards, and more.';
    const metaDescription = description || defaultDescription;

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:type" content={type} />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}
            <meta property="og:site_name" content={siteName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {image && <meta name="twitter:image" content={image} />}

            {/* Product specific meta */}
            {product && (
                <>
                    <meta property="og:type" content="product" />
                    <meta property="product:price:amount" content={product.price} />
                    <meta property="product:price:currency" content="USD" />
                    {product.stock_quantity > 0
                        ? <meta property="product:availability" content="in stock" />
                        : <meta property="product:availability" content="out of stock" />
                    }
                </>
            )}
        </Head>
    );
}
