'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Image as ImageIcon, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  isStoreOpen: boolean;
  hasAddons?: boolean;
}

export const ProductCard = ({ product, isStoreOpen, hasAddons = false }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [imageError, setImageError] = useState(false);

  const handleAddClick = () => {
    if (hasAddons) {
      alert('Aqui se abrira el AddonsModal para personalizar tu: ' + product.title);
      return;
    }
    addItem(product, 1, []);
  };

  const isButtonDisabled = !isStoreOpen || !product.available;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-primary/72 to-[#1b1b1b] shadow-[0_12px_26px_rgba(0,0,0,0.28)]">
      {product.featured && (
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full border border-secondary/45 bg-secondary/90 px-2.5 py-1 text-[11px] font-bold text-primary">
          <Star className="h-3 w-3 fill-current" />
          Destacado
        </div>
      )}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary/30">
        {!imageError && product.image ? (
          <>
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-secondary/35">
            <ImageIcon className="mb-2 h-10 w-10" />
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-xl font-bold leading-tight text-secondary">{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/78">{product.description}</p>
        <div className="flex-1" />

        <div className="mt-4 flex items-center justify-between border-t border-white/12 pt-3">
          <strong className="text-xl font-black text-secondary">{formatPrice(product.price)}</strong>
          <button
            onClick={handleAddClick}
            disabled={isButtonDisabled}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
              isButtonDisabled
                ? 'cursor-not-allowed border border-white/20 bg-white/10 text-white/50'
                : 'bg-secondary text-primary shadow-lg hover:bg-secondary/90 active:scale-95'
            }`}
          >
            <Plus className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
};
