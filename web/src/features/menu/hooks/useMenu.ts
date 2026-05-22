import { useState, useEffect, useMemo } from 'react';
import { menuService } from '@/services/menu.service';
import type { Product, Category } from '@/types';

export const useMenu = () => {
  // Estado principal
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch inicial (al montar el componente)
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        // Hacemos ambos llamados en paralelo para mayor velocidad
        const [productsData, categoriesData] = await Promise.all([
          menuService.getProducts(),
          menuService.getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        console.error('Error cargando el menú:', err);
        setError('Tuvimos un problema al cargar el menú. Por favor, intentá de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Getter de productos filtrados
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = searchQuery
        ? product.title.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
        
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Acciones
  const selectCategory = (id: string | null) => {
    setSelectedCategory(id);
    if (id) setSearchQuery(''); // Si selecciona categoría, limpia la búsqueda
  };

  const setSearch = (query: string) => {
    setSearchQuery(query);
    if (query) setSelectedCategory(null); // Si busca tipeando, limpia la categoría
  };

  return {
    products,
    categories,
    loading,
    error,
    selectedCategory,
    searchQuery,
    filteredProducts,
    selectCategory,
    setSearch,
  };
};
