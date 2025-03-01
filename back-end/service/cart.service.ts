import { CartItem, ShoppingCart } from '@prisma/client';
import cartDB from '../repository/cart.db';
import { productDb } from '../repository/product.db';
import cartDb from '../repository/cart.db';

interface ShoppingCartService extends ShoppingCart {
    items: CartItem[];
}

const getCartItems = async (userId: string) => {
    const cartItems = await cartDB.getCartItems(userId);
    return cartItems;
};

const addToCart = async (userId: string, productId: string, quantity: number) => {
    const cart = await cartDB.addToCart(userId, productId, quantity);
    return cart;
};

const removeFromCart = async (userId: string, productId: string) => {
    return await cartDB.removeFromCart(userId, productId);
};

const updateCart = async (userId: string, productId: string, quantity: number, itemId: string) => {
    return await cartDB.updateCart(userId, itemId, productId, quantity);
};

export const checkout = async (userId: string, cart: any) => {
    // console.log('UserId: ' + userId)
    const existingCart = await cartDB.getCartByUserId(userId);

    if (!existingCart) {
        throw new Error('Cart not found');
    }

    console.log('Existing cart items before checkout:', existingCart.items);
    console.log('Cart items received for checkout:', cart.items);

    const newOrder = await cartDB.createOrder(userId, cart.items);

    await cartDB.clearCart(userId);

    console.log('New order created:', newOrder);

    return newOrder;
};

const getOrdersByUserId = async (userId: string) => {
    const response = await cartDB.getOrdersByUserId(userId);
    console.log('Orders fetched:', response);
    return response;
};

export default { addToCart, removeFromCart, getCartItems, updateCart, checkout, getOrdersByUserId };
