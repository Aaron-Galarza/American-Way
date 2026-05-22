'use client';

import type { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  const handleCategoryChange = (id: string | null) => {
    onSelectCategory(id);
    const productListElement = document.getElementById('product-list-top');
    if (productListElement) {
      const y = productListElement.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
            selectedCategory === null
              ? 'border border-secondary/60 bg-secondary text-primary shadow-lg shadow-secondary/20'
              : 'border border-white/10 bg-primary/40 text-secondary/80 hover:border-secondary/35 hover:text-secondary'
          }`}
        >
          Todos
        </button>

        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all ${
                isActive
                  ? 'border border-secondary/60 bg-secondary text-primary shadow-lg shadow-secondary/20'
                  : 'border border-white/10 bg-primary/40 text-secondary/80 hover:border-secondary/35 hover:text-secondary'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
