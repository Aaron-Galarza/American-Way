'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/lib/format';
import { Stepper } from '@/components/ui/Stepper';
import type { Product, Addon, CartAddon } from '@/types';

interface AddonsModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  availableAddons: Addon[];
}

export const AddonsModal = ({ product, isOpen, onClose, availableAddons }: AddonsModalProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const updateAddonQty = (id: string, delta: number) => {
    setAddonQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
  };

  const addonsTotal = availableAddons.reduce((sum, addon) => sum + addon.price * (addonQuantities[addon.id] || 0), 0);
  const finalPrice = (product.price + addonsTotal) * quantity;

  const handleAddToCart = () => {
    const selectedAddons: CartAddon[] = availableAddons
      .filter(addon => (addonQuantities[addon.id] || 0) > 0)
      .map(addon => ({ addon, quantity: addonQuantities[addon.id] }));

    addItem(product, quantity, selectedAddons);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
      setQuantity(1);
      setAddonQuantities({});
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center" onClick={onClose}>
      <div className="relative flex h-[88dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-950 shadow-2xl animate-in slide-in-from-bottom duration-300 sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition backdrop-blur-md">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative h-44 w-full shrink-0 bg-zinc-900 sm:h-56">
       {product.image && <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 100vw, 500px" className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-5">
            <h2 className="text-2xl font-black text-white drop-shadow-md">{product.title}</h2>
            <p className="text-white/70 text-sm mt-1 line-clamp-2">{product.description}</p>
          </div>
        </div>

        {/* Body */}
        <div className="scrollbar-none flex-1 overflow-y-auto p-4 pb-5 sm:p-5">
          <h3 className="text-sm font-bold text-white/90 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
            Personalizá tu pedido
          </h3>
          <div className="space-y-4">
            {availableAddons.filter(a => a.active).map(addon => (
              <div key={addon.id} className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-white">{addon.name}</p>
                  <p className="text-sm text-primary font-bold">+{formatPrice(addon.price)}</p>
                </div>
                <Stepper 
                  value={addonQuantities[addon.id] || 0} 
                  onIncrease={() => updateAddonQty(addon.id, 1)} 
                  onDecrease={() => updateAddonQty(addon.id, -1)} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto shrink-0 border-t border-white/10 bg-zinc-950/90 p-4 pb-[calc(env(safe-area-inset-bottom)+16px)] backdrop-blur-lg sm:p-5">
          <div className="flex items-center gap-4">
            <Stepper 
              value={quantity} 
              onIncrease={() => setQuantity(q => q + 1)} 
              onDecrease={() => setQuantity(q => Math.max(1, q - 1))} 
              minValue={1} 
              size="lg" 
            />
            <button
              onClick={handleAddToCart}
              disabled={showSuccess}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base transition-all duration-300 ${showSuccess ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-primary hover:bg-primary/90 text-white shadow-lg active:scale-95'}`}
            >
              {showSuccess ? (
                <><CheckCircle2 className="w-5 h-5 animate-in zoom-in" /><span>¡Agregado!</span></>
              ) : (
                <><ShoppingBag className="w-5 h-5" /><span>Agregar • {formatPrice(finalPrice)}</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
