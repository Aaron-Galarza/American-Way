import { AlertCircle, RotateCw, SearchX } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { Product } from '@/types';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  isStoreOpen: boolean;
  onRetry?: () => void;
}

export const ProductList = ({ products, loading, error, isStoreOpen, onRetry }: ProductListProps) => {
  if (error) {
    return (
      <div className="flex animate-in flex-col items-center justify-center rounded-2xl border border-secondary/30 bg-primary/70 p-8 text-center fade-in">
        <AlertCircle className="mb-3 h-10 w-10 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-secondary">No pudimos cargar el menu</h3>
        <p className="mb-4 mt-1 text-sm text-white/80">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-bold text-primary transition-all hover:bg-secondary/90 active:scale-95"
          >
            <RotateCw className="h-4 w-4" />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex animate-in flex-col items-center justify-center rounded-2xl border border-white/12 bg-primary/45 p-12 text-center fade-in">
        <div className="mb-3 rounded-full border border-secondary/30 bg-secondary/15 p-3">
          <SearchX className="h-8 w-8 text-secondary/85" />
        </div>
        <h3 className="font-heading text-xl font-bold text-secondary">Sin resultados</h3>
        <p className="mt-1 text-sm text-white/75">
          No encontramos productos en esta categoria o con esa busqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid animate-in grid-cols-1 gap-4 fade-in duration-300 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const hasAddons = product.category === 'hamburguesas';
        return (
          <ProductCard
            key={product.id}
            product={product}
            isStoreOpen={isStoreOpen}
            hasAddons={hasAddons}
          />
        );
      })}
    </div>
  );
};
