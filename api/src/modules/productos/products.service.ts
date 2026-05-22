import mongoose from 'mongoose';
import { iProducto, ProductModel } from './products.model';
import { CategoriaModel } from '../categorias/categorias.model';

const isObjectId = (value: unknown): value is mongoose.Types.ObjectId | string =>
  typeof value === 'string'
    ? mongoose.Types.ObjectId.isValid(value)
    : value instanceof mongoose.Types.ObjectId;

const attachCategories = async (products: any[]) => {
  const categoryIds = products
    .map((product) => product.category)
    .filter(isObjectId)
    .map((category) => category.toString());

  const categories = await CategoriaModel.find({ _id: { $in: categoryIds } })
    .select('name active order')
    .lean();

  const categoryMap = new Map(categories.map((category) => [category._id.toString(), category]));

  return products.map((product) => {
    const rawCategory = product.category;
    const category =
      isObjectId(rawCategory)
        ? categoryMap.get(rawCategory.toString()) ?? rawCategory
        : {
            _id: null,
            name: rawCategory,
            active: true,
            order: 0,
          };

    return {
      ...product,
      category,
    };
  });
};

const sortMenuProducts = (products: any[]) =>
  products.sort((a: any, b: any) => {
    const categoryOrderA = a.category?.order ?? 0;
    const categoryOrderB = b.category?.order ?? 0;
    if (categoryOrderA !== categoryOrderB) return categoryOrderA - categoryOrderB;
    return (a.order ?? 0) - (b.order ?? 0);
  });

export const viewAll = async (): Promise<iProducto[]> => {
  const products = await ProductModel.find()
    .select('title description price image category available active featured order createdAt updatedAt')
    .lean();

  return await attachCategories(products) as iProducto[];
};

export const viewActive = async (): Promise<iProducto[]> => {
  const products = await ProductModel.find({
    $and: [
      { active: true },
      { available: { $ne: false } },
    ],
  })
    .select('title description price image category available active featured order')
    .lean();

  const withCategories = await attachCategories(products);
  return sortMenuProducts(withCategories) as iProducto[];
};

export const viewById = async (id: string): Promise<iProducto | null> => {
  return await ProductModel.findById(id);
};

export const create = async (data: Partial<iProducto>): Promise<iProducto> => {
  const newProduct = new ProductModel({
    ...data,
    available: data.available ?? data.active ?? true,
    active: data.active ?? data.available ?? true,
  });
  return await newProduct.save();
};

export const modify = async (id: string, data: Partial<iProducto>): Promise<iProducto | null> => {
  const updateData = {
    ...data,
    ...(data.available !== undefined && data.active === undefined ? { active: data.available } : {}),
    ...(data.active !== undefined && data.available === undefined ? { available: data.active } : {}),
  };

  return await ProductModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );
};

export const toggleActive = async (id: string): Promise<iProducto | null> => {
  const product = await ProductModel.findById(id);

  if (!product) return null;

  const nextStatus = !product.active;
  product.active = nextStatus;
  product.available = nextStatus;
  return await product.save();
};

export const deleteById = async (id: string): Promise<iProducto | null> => {
  return await ProductModel.findByIdAndUpdate(
    id,
    { active: false, available: false },
    { new: true },
  );
};
