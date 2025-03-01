export interface Product {
  updatedAt: string | number | Date;
  createdAt: string | number | Date;
  id: string;
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
  productId: string;
};

export type ShoppingCart = {
  id: string;
  items: CartItem[];
  total: number;
};

export type addProductType = {
  id?: string;
  name: string;
  description: string;
  stock: number;
  media: string;
  price: number;
  details: string;
  userId?: string;
}
