'use client';
import { useState } from 'react';

// Data hardcodeada
const categories = ['Burgers', 'Sándwiches', 'Ensaladas'];
const products = [
  { id: 1, name: 'American Bacon', price: 8500, cat: 'Burgers' },
  { id: 2, name: 'Lomo Completo', price: 9200, cat: 'Sándwiches' },
  { id: 3, name: 'Caesar Salad', price: 6000, cat: 'Ensaladas' },
];

export default function HomePage() {
  const [activeCat, setActiveCat] = useState('Burgers');
  const filtered = products.filter(p => p.cat === activeCat);

  return (
    <main className="max-w-5xl mx-auto p-4 pt-6">
      {/* Categorías */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeCat === c ? 'bg-primary text-white' : 'bg-white/5'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/10 hover:border-secondary/50 transition-colors">
            <div>
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-sm text-white/60">${p.price}</p>
            </div>
            <button className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95">
              Agregar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}