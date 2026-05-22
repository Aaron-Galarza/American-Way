import mongoose, { Schema, Document } from 'mongoose';

export interface iCoupon extends Document {
  code: string;
  discountPercent: number;
  Percent: number;
  active: boolean;
  validDays?: string[];
  validPaymentMethods?: string[];
}

const CouponSchema = new Schema<iCoupon>({
  code: {
    type: String,
    required: [true, 'El codigo del cupon es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  discountPercent: {
    type: Number,
    required: [true, 'El porcentaje es obligatorio'],
    min: [1, 'El porcentaje debe ser mayor a 0'],
    max: [100, 'El porcentaje no puede superar 100'],
  },
  Percent: {
    type: Number,
    min: 1,
    max: 100,
  },
  active: {
    type: Boolean,
    default: true,
    index: true,
  },
  validDays: {
    type: [String],
    default: undefined,
  },
  validPaymentMethods: {
    type: [String],
    enum: ['cash', 'transfer', 'mercadopago', 'Efectivo', 'Transferencia'],
    default: undefined,
  },
}, { timestamps: true });

CouponSchema.pre('validate', function () {
  if (!this.discountPercent && this.Percent) this.discountPercent = this.Percent;
  if (!this.Percent && this.discountPercent) this.Percent = this.discountPercent;
});

export const CouponModel = mongoose.model<iCoupon>('Coupon', CouponSchema);
