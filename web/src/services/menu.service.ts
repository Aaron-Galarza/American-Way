import axios from 'axios';
import type { Product, Category, Addon, StoreStatus } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Instancia de axios dedicada al menu (publica, sin necesidad de tokens)
const menuApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-burgers', name: 'Hamburguesas', order: 1, active: true },
  { id: 'cat-fries', name: 'Papas', order: 2, active: true },
  { id: 'cat-drinks', name: 'Bebidas', order: 3, active: true },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Classic Burger',
    description: 'Medallon de carne, cheddar, lechuga y salsa clasica.',
    price: 8900,
    image:
      'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?auto=format&fit=crop&w=1400&q=80',
    category: 'cat-burgers',
    available: true,
    featured: true,
    order: 1,
  },
  {
    id: 'prod-2',
    title: 'Bacon Double',
    description: 'Doble carne, bacon crocante, cheddar y cebolla caramelizada.',
    price: 11200,
    image:
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1400&q=80',
    category: 'cat-burgers',
    available: true,
    featured: true,
    order: 2,
  },
  {
    id: 'prod-3',
    title: 'Cheese Fries',
    description: 'Papas fritas con salsa de queso cheddar.',
    price: 5400,
    image:
      'https://images.unsplash.com/photo-1615485290836-4ebcebf44aaf?auto=format&fit=crop&w=1400&q=80',
    category: 'cat-fries',
    available: true,
    featured: false,
    order: 3,
  },
  {
    id: 'prod-4',
    title: 'Papas con Bacon',
    description: 'Papas fritas con bacon en cubos y verdeo.',
    price: 6200,
    image:
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1400&q=80',
    category: 'cat-fries',
    available: true,
    featured: false,
    order: 4,
  },
  {
    id: 'prod-5',
    title: 'Limonada Mint',
    description: 'Limonada fresca con menta y hielo.',
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1513558003720-343f3a99d97b?auto=format&fit=crop&w=1400&q=80',
    category: 'cat-drinks',
    available: true,
    featured: false,
    order: 5,
  },
  {
    id: 'prod-6',
    title: 'Cola 500ml',
    description: 'Gaseosa cola bien fria.',
    price: 2800,
    image:
      'https://images.unsplash.com/photo-1722421459420-32a94bd74975?auto=format&fit=crop&w=1400&q=80',
    category: 'cat-drinks',
    available: true,
    featured: false,
    order: 6,
  },
];

const MOCK_ADDONS: Addon[] = [
  { id: 'add-1', name: 'Queso Extra', price: 900, active: true },
  { id: 'add-2', name: 'Bacon', price: 1200, active: true },
  { id: 'add-3', name: 'Huevo', price: 800, active: true },
];

const MOCK_STATUS: StoreStatus = {
  isOpen: true,
  message: '',
  pricePerKm: 350,
};

const withDelay = <T>(payload: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(payload), 800);
  });

export const menuService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      // const { data } = await menuApi.get<Product[]>('/products');
      return withDelay(MOCK_PRODUCTS);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('No se pudieron cargar los productos');
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      // const { data } = await menuApi.get<Category[]>('/categories');
      return withDelay(MOCK_CATEGORIES);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('No se pudieron cargar las categorias');
    }
  },

  getAddons: async (): Promise<Addon[]> => {
    try {
      // const { data } = await menuApi.get<Addon[]>('/addons');
      return withDelay(MOCK_ADDONS);
    } catch (error) {
      console.error('Error fetching addons:', error);
      throw new Error('No se pudieron cargar los adicionales');
    }
  },

  getStoreStatus: async (): Promise<StoreStatus> => {
    try {
      // const { data } = await menuApi.get<StoreStatus>('/config/status');
      return withDelay(MOCK_STATUS);
    } catch (error) {
      console.error('Error fetching store status:', error);
      throw new Error('No se pudo verificar el estado del local');
    }
  },
};
