import { z } from 'zod';

const adicionalBaseSchema = z.object({
  name: z.string().min(1, 'El nombre del adicional es obligatorio').optional(),
  title: z.string().min(1, 'El titulo del adicional es obligatorio').optional(),
  price: z.number({ message: 'El precio debe ser un numero' }).min(0, 'El precio no puede ser negativo'),
  category: z.string().min(1, 'La categoria del adicional es obligatoria').optional(),
  active: z.boolean().optional(),
});

export const createAdicionalSchema = adicionalBaseSchema.refine((data) => data.name || data.title, {
  message: 'El nombre del adicional es obligatorio',
  path: ['name'],
});

export const updateAdicionalSchema = adicionalBaseSchema.partial();
