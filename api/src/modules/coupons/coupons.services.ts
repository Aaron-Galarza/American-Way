import { iCoupon, CouponModel } from './coupons.model';

const normalizeCouponData = (data: Partial<iCoupon> & { Code?: string }) => ({
  ...data,
  code: data.code ?? data.Code,
  discountPercent: data.discountPercent ?? data.Percent,
  Percent: data.Percent ?? data.discountPercent,
});

export const viewAll = async (): Promise<iCoupon[]> => {
  return await CouponModel.find();
};

export const create = async (data: Partial<iCoupon> & { Code?: string }): Promise<iCoupon> => {
  const newCoupon = new CouponModel(normalizeCouponData(data));
  return await newCoupon.save();
};

export const modify = async (id: string, data: Partial<iCoupon> & { Code?: string }): Promise<iCoupon | null> => {
  return await CouponModel.findByIdAndUpdate(
    id,
    { $set: normalizeCouponData(data) },
    { new: true, runValidators: true },
  );
};

export const search = async (code: string): Promise<iCoupon | null> => {
  return await CouponModel.findOne({ code: code.toUpperCase(), active: { $ne: false } });
};

export const deleteById = async (id: string): Promise<iCoupon | null> => {
  return await CouponModel.findByIdAndDelete(id);
};
