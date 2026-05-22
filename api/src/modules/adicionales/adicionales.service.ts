import { iAdicional, AdicionalModel } from './adicionales.model';

const normalizeAddon = (addon: any) => ({
  ...addon,
  name: addon.name ?? addon.title,
  title: addon.title ?? addon.name,
});

export const viewAll = async (): Promise<iAdicional[]> => {
  return await AdicionalModel.find();
};

export const viewActive = async (): Promise<iAdicional[]> => {
  const addons = await AdicionalModel.find({ active: true })
    .select('name title price category active')
    .lean();

  return addons.map(normalizeAddon) as iAdicional[];
};

export const viewById = async (id: string): Promise<iAdicional | null> => {
  return await AdicionalModel.findById(id);
};

export const create = async (data: Partial<iAdicional>): Promise<iAdicional> => {
  const newAdicional = new AdicionalModel({
    ...data,
    name: data.name ?? data.title,
    title: data.title ?? data.name,
  });
  return await newAdicional.save();
};

export const modify = async (id: string, data: Partial<iAdicional>): Promise<iAdicional | null> => {
  const updateData = {
    ...data,
    ...(data.name !== undefined && data.title === undefined ? { title: data.name } : {}),
    ...(data.title !== undefined && data.name === undefined ? { name: data.title } : {}),
  };

  return await AdicionalModel.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );
};

export const toggleActive = async (id: string): Promise<iAdicional | null> => {
  const adicional = await AdicionalModel.findById(id);
  if (!adicional) return null;

  adicional.active = !adicional.active;
  return await adicional.save();
};

export const deleteById = async (id: string): Promise<iAdicional | null> => {
  return await AdicionalModel.findByIdAndDelete(id);
};
