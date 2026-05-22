import { z } from 'zod';

const CartAddonSchema = z.object({
  addonId: z.string().min(1, 'El ID del adicional es requerido'),
  quantity: z.number({ message: 'La cantidad del adicional debe ser un numero' })
    .int()
    .min(1, 'La cantidad del adicional debe ser al menos 1')
    .max(10, 'La cantidad del adicional no puede superar 10'),
});

const CartItemSchema = z.object({
  productId: z.string().min(1, 'El ID del producto es requerido'),
  quantity: z.number({ message: 'La cantidad debe ser un numero' })
    .int()
    .min(1, 'La cantidad debe ser al menos 1'),
  addons: z.array(CartAddonSchema).optional(),
});

const CoordinatesSchema = z.object({
  lat: z.number({ message: 'lat debe ser un numero' }).min(-90).max(90),
  lng: z.number({ message: 'lng debe ser un numero' }).min(-180).max(180),
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'El nombre del cliente es obligatorio'),
    phone: z.string().min(1, 'El telefono del cliente es obligatorio'),
    address: z.string().optional(),
  }),
  items: z.array(CartItemSchema).min(1, 'El carrito no puede estar vacio'),
  deliveryType: z.enum(['pickup', 'delivery'], {
    message: 'Tipo de entrega invalido. Opciones: pickup, delivery',
  }),
  paymentMethod: z.enum(['cash', 'transfer', 'mercadopago', 'Efectivo', 'Transferencia'], {
    message: 'Metodo de pago invalido',
  }),
  couponCode: z.string().optional(),
  delivery: z.object({
    address: z.string().optional(),
    coordinates: CoordinatesSchema.optional(),
  }).optional(),
});
