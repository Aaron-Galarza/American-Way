'use client';

import { useMenu } from '@/features/menu/hooks/useMenu';
import { useStoreStatus } from '@/features/menu/hooks/useStoreStatus';
import { StoreClosed } from '@/features/menu/components/StoreClosed';
import { FeaturedBanner } from '@/features/menu/components/FeaturedBanner';
import { SearchBar } from '@/features/menu/components/SearchBar';
import { CategoryFilter } from '@/features/menu/components/CategoryFilter';
import { ProductList } from '@/features/menu/components/ProductList';

export default function HomePage() {
  const { isOpen, message, loading: statusLoading } = useStoreStatus();
  const {
    products,
    categories,
    loading: menuLoading,
    error: menuError,
    selectedCategory,
    searchQuery,
    filteredProducts,
    selectCategory,
    setSearch,
  } = useMenu();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-8 pt-5 sm:px-5">
      {!statusLoading && !isOpen && <StoreClosed message={message} />}

      {!menuLoading && !menuError && <FeaturedBanner products={products} isStoreOpen={isOpen} />}

      <div className="sticky top-16 z-30 mt-4 space-y-3 rounded-2xl border border-white/10 bg-background/85 p-3 backdrop-blur-xl">
        <SearchBar searchQuery={searchQuery} onSearch={setSearch} />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={selectCategory}
        />
      </div>

      <section id="product-list-top" className="mt-6">
        <ProductList
          products={filteredProducts}
          loading={menuLoading}
          error={menuError}
          isStoreOpen={isOpen}
          onRetry={() => window.location.reload()}
        />
      </section>
    </main>
  );
}
