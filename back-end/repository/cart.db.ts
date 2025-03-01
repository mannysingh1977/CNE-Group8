import { ShoppingCart, CartItem, Order } from '@prisma/client';
import database from './database';
import { productDb } from './product.db';

const addToCart = async (
    userId: string,
    productId: string,
    quantity: number
): Promise<ShoppingCart> => {
    try {
        let cart = await database.shoppingCart.findFirst({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            cart = await database.shoppingCart.create({
                data: { userId },
                include: { items: { include: { product: true } } },
            });
        }

        const product = await productDb.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const existingItem = cart.items.find((item) => item.productId === productId);
        if (existingItem) {
            await database.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        } else {
            await database.cartItem.create({
                data: {
                    quantity,
                    productId,
                    shoppingCartId: cart.id,
                },
            });
        }

        const updatedCart = await database.shoppingCart.findFirst({
            where: { id: cart.id },
            include: { items: { include: { product: true } } },
        });

        if (!updatedCart) {
            throw new Error('Failed to update cart');
        }

        return updatedCart;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const removeFromCart = async (userId: string, itemId: string) => {
    try {
        const cartItem = await database.cartItem.findUnique({
            where: { id: itemId },
        });

        if (!cartItem) {
            console.error(`Cart item not found: ${itemId}`);
            return null;
        }

        const cart = await database.shoppingCart.findFirst({
            where: { id: cartItem.shoppingCartId!, userId },
        });

        if (!cart) {
            console.error(`Cart item not found or does not belong to user: ${itemId}`);
            return null;
        }

        return await database.cartItem.delete({
            where: { id: itemId },
        });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        throw new Error('Failed to remove item from cart.');
    }
};

const createShoppingCart = async (userId: string): Promise<ShoppingCart> => {
    try {
        const cart = await database.shoppingCart.create({
            data: {
                userId: userId,
            },
        });
        return cart;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getCartItems = async (userId: string): Promise<ShoppingCart> => {
    try {
        const cart = await database.shoppingCart.findFirst({
            where: {
                userId: userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart) {
            const cart = await createShoppingCart(userId);
            return cart;
        }
        return cart;
    } catch (error) {
        console.error(`Error in getCartItems for userId: ${userId}`, error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateCart = async (
    userId: string,
    itemId: string,
    productId: string,
    quantity: number
): Promise<ShoppingCart> => {
    try {
        const cart = await database.shoppingCart.findFirst({
            where: { userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart) {
            throw new Error('Cart not found');
        }

        console.log(`Cart found for user ${userId}:`, cart);
        console.log(`productId: ${cart.items[0].product.id}`);

        const existingItem = cart.items.find(
            (item) => item.id === itemId && item.productId === productId
        );
        if (!existingItem) {
            console.error(`Product with ID ${productId} not found in cart for user ${userId}`);
            console.log(
                `Available product IDs in cart: ${cart.items
                    .map((item) => item.productId)
                    .join(', ')}`
            );
            throw new Error('Product not found in cart');
        }

        console.log(`Updating quantity for product ${productId} to ${quantity}`);

        await database.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity },
        });

        const updatedCart = await database.shoppingCart.findFirst({
            where: { id: cart.id },
            include: { items: { include: { product: true } } },
        });

        if (!updatedCart) {
            throw new Error('Failed to update cart');
        }

        console.log(`Cart updated for user ${userId}:`, updatedCart);

        return updatedCart;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export const createOrder = async (userId: string, items: any[]) => {
    console.log('Creating order for user:', userId);
    console.log('Items to be added to order:', items);

    const newOrder = await database.order.create({
        data: {
            userId: userId,
            items: {
                create: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                })),
            },
        },
    });

    return newOrder;
};

const addItemToOrder = async (
    orderId: string,
    productId: string,
    quantity: number,
    shoppingCartId: string
) => {
    const newItem = await database.cartItem.create({
        data: {
            orderId: orderId,
            productId: productId,
            quantity: quantity,
            shoppingCartId: shoppingCartId,
        },
    });

    await database.order.update({
        where: { id: orderId },
        data: {
            items: {
                connect: { id: newItem.id },
            },
        },
    });

    return newItem;
};

const getOrdersByUserId = async (userId: string) => {
    return await database.order.findMany({
        where: {
            userId: userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
};

const getCartByUserId = async (userId: string) => {
    return await database.shoppingCart.findFirst({
        where: { userId },
        include: { items: { include: { product: true } } },
    });
};

const clearCart = async (userId: string) => {
    const cart = await database.shoppingCart.findFirst({
        where: { userId },
        include: { items: true },
    });
    if (!cart) {
        throw new Error('Cart not found');
    }
    await database.cartItem.deleteMany({
        where: {
            shoppingCartId: cart.id,
        },
    });

    return cart;
};
export default {
    addToCart,
    removeFromCart,
    getCartItems,
    createShoppingCart,
    updateCart,
    createOrder,
    addItemToOrder,
    getOrdersByUserId,
    clearCart,
    getCartByUserId,
};
