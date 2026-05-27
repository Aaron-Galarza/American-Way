'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Image as ImageIcon, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/format';
import { AddonsModal } from './AddonsModal';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  isStoreOpen: boolean;
  hasAddons?: boolean;
  priority?: boolean;
}

export const ProductCard = ({ product, isStoreOpen, hasAddons = false, priority = false }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    if (hasAddons) {
      setIsModalOpen(true);
      return;
    }
    addItem(product, 1, []);
  };

  const isButtonDisabled = !isStoreOpen || !product.available;

  return (
    <>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/90 shadow-[0_16px_34px_rgba(0,0,0,0.36)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_45px_rgba(0,0,0,0.45)]">
        {product.featured && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full border border-secondary/45 bg-secondary/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
            <Star className="h-3 w-3 fill-current" />
            Destacado
          </div>
        )}

        {/* 👇 1. Cambiamos 'aspect-[4/3]' por 'aspect-[16/9]' (más apaisado/corto) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary/25">
          {!imageError && product.image ? (
            <>
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
                priority={priority}
              />
              <div className="absolute inset-0 bg-black/35" />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/35">
              <ImageIcon className="mb-2 h-8 w-8" />
              <span className="text-xs font-medium">Sin imagen</span>
            </div>
          )}
        </div>

        {/* 👇 2. Redujimos el padding general de 'p-5' a 'p-4' */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-heading text-lg font-bold leading-tight text-white">{product.title}</h3>
          {/* 👇 Truncamos la descripción a 1 sola línea o achicamos margen */}
         <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-white/65">{product.description}</p>
          
          <div className="flex-1" />

          {/* 👇 3. Redujimos márgenes arriba del precio (mt-3 pt-3 en vez de mt-5 pt-4) */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <strong className="text-xl font-black text-secondary">{formatPrice(product.price)}</strong>
            <button
              onClick={handleAddClick}
              disabled={isButtonDisabled}
              // Achicamos un poco el padding del botón para ganar espacio
              className={`flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-bold transition-all duration-300 active:scale-95 ${
                isButtonDisabled
                  ? 'cursor-not-allowed border border-white/20 bg-white/10 text-white/50'
                  : 'bg-secondary text-primary shadow-[0_6px_16px_rgba(249,239,188,0.18)] hover:bg-secondary/90'
              }`}
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>
        </div>
      </article>

      <AddonsModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        availableAddons={product.addons || []} 
      />
    </>
  );
};