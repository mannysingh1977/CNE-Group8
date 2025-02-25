export interface Product {
  updatedAt: string | number | Date;
  createdAt: string | number | Date;
  id: number;
  name: string;
  price: number;
  media: string;
  stock: number;
  details: string;
  description: string;
}
export type CartItem = {
  id?: string;
  quantity: number;
  product: Product;
  productId: number;
};

export type ShoppingCart = {
  id: string;
  items: CartItem[];
  total: number;
};

export type addProductType = {
  id?: number;
  name: string;
  description: string;
  stock: number;
  media: string;
  price: number;
  details: string;
  userId?: number;
}
