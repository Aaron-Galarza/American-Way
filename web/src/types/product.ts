export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string; // Guardamos el ID de la categoría a la que pertenece
  available: boolean;
  featured: boolean;
  order: number;
}