'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Image as ImageIcon,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

interface FeaturedBannerProps {
  products: Product[];
  isStoreOpen: boolean;
}

export const FeaturedBanner = ({ products, isStoreOpen }: FeaturedBannerProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured && product.available),
    [products]
  );

  if (featuredProducts.length === 0) return null;

  const safeIndex = currentIndex % featuredProducts.length;
  const currentProduct = featuredProducts[safeIndex];
  const hasImageError = brokenImages[currentProduct.id];
  const canNavigate = featuredProducts.length > 1;
  const isButtonDisabled = !isStoreOpen || !currentProduct.available;
  const hasAddons = currentProduct.category === 'hamburguesas';

  const handleImageError = (productId: string) => {
    setBrokenImages((prev) => ({ ...prev, [productId]: true }));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const handleAddClick = () => {
    if (hasAddons) {
      alert('Aqui se abrira el AddonsModal para personalizar tu: ' + currentProduct.title);
      return;
    }
    addItem(currentProduct, 1, []);
  };

  const scrollToMenu = () => {
    const target = document.getElementById('product-list-top');
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section className="mb-6 animate-in rounded-3xl border border-secondary/20 bg-gradient-to-br from-[#1a0f10] via-primary/80 to-[#171717] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.35)] fade-in duration-500 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-secondary">
            <Flame className="h-3.5 w-3.5" />
            Hot & Fast Delivery
          </span>

          <h2 className="max-w-[14ch] font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
            Autenticas Artesanales directo a tu puerta.
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-white/80">
            {currentProduct.description}. Preparado al momento, con ingredientes frescos y despacho
            rapido para que llegue en su punto.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleAddClick}
              disabled={isButtonDisabled}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all ${
                isButtonDisabled
                  ? 'cursor-not-allowed border border-white/15 bg-white/10 text-white/50'
                  : 'bg-secondary text-primary shadow-lg hover:bg-secondary/90 active:scale-95'
              }`}
            >
              <Plus className="h-4 w-4" />
              Pedir Destacada
            </button>

            <button
              onClick={scrollToMenu}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-secondary/40 hover:text-secondary"
            >
              <ShoppingBag className="h-4 w-4" />
              Ver Menu
            </button>
          </div>

          <div className="flex flex-wrap gap-5 border-t border-white/10 pt-4 text-sm text-secondary/90">
            <span>35-50 min</span>
            <span>Efectivo / MPago</span>
            <span>Delivery & Take Away</span>
          </div>
        </div>

        <div className="relative">
          <article className="relative h-[320px] overflow-hidden rounded-3xl border border-secondary/25 bg-black/30 sm:h-[360px]">
            {!hasImageError && currentProduct.image ? (
              <>
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                  onError={() => handleImageError(currentProduct.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/45 text-secondary/35">
                <ImageIcon className="h-12 w-12" />
              </div>
            )}

            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-secondary/55 bg-secondary/90 px-2.5 py-1 text-xs font-bold text-primary">
              <Star className="h-3.5 w-3.5 fill-current" />
              La mas nueva
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
              <div>
                <h3 className="font-heading text-2xl font-bold text-white">{currentProduct.title}</h3>
                <p className="text-lg font-black text-secondary">{formatPrice(currentProduct.price)}</p>
              </div>
            </div>
          </article>

          {canNavigate && (
            <>
              <button
                onClick={handlePrev}
                className="absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-secondary/35 bg-primary/90 text-secondary transition-all hover:bg-primary"
                aria-label="Producto anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-secondary/35 bg-primary/90 text-secondary transition-all hover:bg-primary"
                aria-label="Producto siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {canNavigate && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {featuredProducts.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir al destacado ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    index === safeIndex ? 'w-6 bg-secondary' : 'w-2.5 bg-white/35 hover:bg-white/55'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
