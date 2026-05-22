import mongoose, { Schema, Document } from 'mongoose';

export interface iProducto extends Document {
  title: string;
  price: number;
  description?: string;
  image?: string;
  category: mongoose.Types.ObjectId;
  available: boolean;
  active: boolean;
  featured: boolean;
  order: number;
}

const ProductoSchema = new Schema<iProducto>({
  title: {
    type: String,
    required: [true, 'El titulo es obligatorio'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0,
  },
  description: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: [true, 'La categoria es obligatoria'],
    index: true,
  },
  image: {
    type: String,
  },
  available: {
    type: Boolean,
    default: true,
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
    index: true,
  },
}, {
  timestamps: true,
});

export const ProductModel = mongoose.model<iProducto>('Producto', ProductoSchema);
