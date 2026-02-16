export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
}

export type IProductCreate = Omit<IProduct, 'id'>;
