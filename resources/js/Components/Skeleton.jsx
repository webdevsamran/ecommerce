export default function Skeleton({ className = '', variant = 'text' }) {
    const baseClasses = 'animate-pulse bg-white/10 rounded';

    const variants = {
        text: 'h-4 w-full',
        title: 'h-6 w-3/4',
        avatar: 'w-12 h-12 rounded-full',
        thumbnail: 'w-full aspect-square',
        button: 'h-12 w-32',
        card: 'h-64 w-full rounded-2xl',
    };

    return (
        <div className={`${baseClasses} ${variants[variant]} ${className}`} />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10">
            <Skeleton variant="thumbnail" />
            <div className="p-5 space-y-3">
                <Skeleton variant="title" />
                <Skeleton variant="text" className="w-full" />
                <Skeleton variant="text" className="w-2/3" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton variant="button" className="w-full" />
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }) {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-3">
                    <Skeleton variant="text" />
                </td>
            ))}
        </tr>
    );
}
