'use client';
import { Menu, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  
  // Por ahora hardcodeamos el count en 0 hasta que hagamos el Store de Zustand
  const cartCount = 0; 

  return (
    <header className="sticky top-0 z-50 w-full border-b border-secondary/20 bg-primary/95 backdrop-blur-md shadow-xl">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Botón Menú */}
        <button
          onClick={() => console.log('Abrir menú')}
          className="p-2 -ml-2 text-secondary hover:bg-white/10 rounded-full transition-all active:scale-90"
          aria-label="Abrir menú"
        >
          <Menu size={26} strokeWidth={2.5} />
        </button>

        {/* Branding: Logo + Nombre (Ahora actúa como botón al Inicio) */}
        <button 
          onClick={() => router.push('/')}
          className="flex-1 flex items-center justify-center gap-2 hover:opacity-80 transition-opacity active:scale-95"
          aria-label="Ir al inicio"
        >
          <img
            src="https://res.cloudinary.com/dojwvsefr/image/upload/v1779155504/LOGO-AW_1_s3k9qd.png"
            alt="American Way"
            className="h-8 object-contain"
          />
          <span className="font-heading text-lg font-bold tracking-wide text-secondary uppercase hidden md:block">
            American Way
          </span>
        </button>

        {/* Botón Carrito */}
        <button
          onClick={() => router.push('/cart')}
          className="p-2 -mr-2 text-secondary hover:bg-white/10 rounded-full transition-all relative active:scale-90"
          aria-label="Abrir carrito"
        >
          <ShoppingCart size={24} strokeWidth={2.5} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-0 min-w-[20px] h-[20px] bg-secondary text-primary rounded-full flex items-center justify-center text-[10px] font-black shadow-sm border border-primary animate-in zoom-in duration-300">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}