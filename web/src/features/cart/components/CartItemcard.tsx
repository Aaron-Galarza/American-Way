'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/format';
import { Stepper } from '@/components/ui/Stepper';
import type { CartItem } from '@/types';

interface CartItemCardProps {
  item: CartItem;
  index: number;
}

export const CartItemCard = ({ item, index }: CartItemCardProps) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  
  // Estado para la animación de salida
  const [isRemoving, setIsRemoving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { product, quantity, addons, itemTotal } = item;
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/?$/, '');
  const imageSrc = product.image
    ? product.image.startsWith('http')
      ? product.image
      : `${apiBase}${product.image.startsWith('/') ? '' : '/'}${product.image}`
    : '';

  // Lógica de eliminación con animación
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(index);
    }, 300); // 300ms coincide con la duración de la transición de Tailwind
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      handleRemove();
    } else {
      updateQuantity(index, quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(index, quantity + 1);
  };

  return (
    <div 
      className={`relative flex gap-3 p-3.5 bg-zinc-900/85 border border-white/10 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300 ${
        isRemoving ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'
      }`}
    >
      {/* Thumbnail del producto */}
      <div className="relative shrink-0 w-16 h-16 bg-zinc-950 rounded-xl overflow-hidden border border-white/10 ring-1 ring-white/5">
        {!imageError && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 text-[10px] uppercase font-bold tracking-wider">
            Sin img
          </div>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Cabecera: Título y Botón Eliminar */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[15px] font-bold text-white leading-tight truncate pr-1">
            {product.title}
          </h3>
          <button 
            onClick={handleRemove}
            className="shrink-0 p-1 text-red-300/70 hover:text-red-200 hover:bg-red-500/15 rounded-md transition-colors"
            aria-label={`Eliminar ${product.title} del carrito`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Precio unitario base */}
        <p className="text-xs font-medium text-white/55 mt-0.5">
          {formatPrice(product.price)} c/u
        </p>

        {/* Lista de adicionales seleccionados */}
        {addons.length > 0 && (
          <div className="mt-2 space-y-1 bg-white/5 p-2 rounded-lg border border-white/10">
            {addons.map((a, i) => (
              <div key={i} className="text-xs flex justify-between items-center gap-2 text-white/70">
                <span className="truncate">
                  <span className="text-primary font-bold">{a.quantity}x</span> {a.addon.name}
                </span>
                <span className="shrink-0 font-medium text-white/60">
                  +{formatPrice(a.addon.price * a.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer: Stepper de cantidad y Precio Total del Ítem */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <Stepper 
            value={quantity} 
            onIncrease={handleIncrease} 
            onDecrease={handleDecrease} 
            minValue={0} // Permite llegar a 0 para activar handleRemove visualmente
            size="sm"
          />
          
          <span className="text-xl font-black text-white tracking-tight">
            {formatPrice(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
