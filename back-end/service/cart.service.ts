// Remove Prisma imports and use our own types
import cartDb from '../repository/cart.db';
import { productDb } from '../repository/product.db';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  // additional properties can be added if needed
}

export interface ShoppingCartService {
  id: string;
  userId: string;
  items: CartItem[];
}

/**
 * Retrieves the shopping cart (and its items) for a given user.
 */
const getCartItems = async (userId: string): Promise<ShoppingCartService> => {
  const cart = await cartDb.getCartItems(userId);
  return cart;
};

/**
 * Adds a product with the specified quantity to the user's cart.
 */
const addToCart = async (userId: string, productId: string, quantity: number) => {
  const cart = await cartDb.addToCart(userId, productId, quantity);
  return cart;
};

/**
 * Removes an item (by productId) from the user's cart.
 */
const removeFromCart = async (userId: string, productId: string) => {
  return await cartDb.removeFromCart(userId, productId);
};

/**
 * Updates a cart item with a new quantity.
 */
const updateCart = async (
  userId: string,
  productId: string,
  quantity: number,
  itemId: string
) => {
  return await cartDb.updateCart(userId, itemId, productId, quantity);
};

/**
 * Performs checkout: creates an order from the cart's items and then clears the cart.
 */
export const checkout = async (userId: string, cart: any) => {
  // Retrieve the existing cart for the user
  const existingCart = await cartDb.getCartByUserId(userId);
  if (!existingCart) {
    throw new Error('Cart not found');
  }

  console.log('Existing cart items before checkout:', existingCart.items);
  console.log('Cart items received for checkout:', cart.items);

  // Create a new order document in Cosmos DB based on the cart items
  const newOrder = await cartDb.createOrder(userId, cart.items);

  // Clear the user's cart
  await cartDb.clearCart(userId);

  console.log('New order created:', newOrder);
  return newOrder;
};

/**
 * Retrieves all orders for the given user.
 */
const getOrdersByUserId = async (userId: string) => {
  const orders = await cartDb.getOrdersByUserId(userId);
  console.log('Orders fetched:', orders);
  return orders;
};

export default {
  addToCart,
  removeFromCart,
  getCartItems,
  updateCart,
  checkout,
  getOrdersByUserId,
};
