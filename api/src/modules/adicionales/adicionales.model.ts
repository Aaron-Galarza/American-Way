import mongoose, { Schema, Document } from 'mongoose';

export interface iAdicional extends Document {
  name?: string;
  title?: string;
  price: number;
  category?: string;
  active: boolean;
}

const AdicionalSchema = new Schema<iAdicional>({
  name: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0,
  },
  category: {
    type: String,
    default: 'general',
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
}, { timestamps: true });

AdicionalSchema.pre('validate', function () {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;

  if (!this.name && !this.title) {
    this.invalidate('name', 'El nombre del adicional es obligatorio');
  }
});

export const AdicionalModel = mongoose.model<iAdicional>('Adicional', AdicionalSchema);
