"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
// Remove Prisma imports and use our own types
const cart_db_1 = __importDefault(require("../repository/cart.db"));
/**
 * Retrieves the shopping cart (and its items) for a given user.
 */
const getCartItems = async (userId) => {
    const cart = await cart_db_1.default.getCartItems(userId);
    return cart;
};
/**
 * Adds a product with the specified quantity to the user's cart.
 */
const addToCart = async (userId, productId, quantity) => {
    const cart = await cart_db_1.default.addToCart(userId, productId, quantity);
    return cart;
};
/**
 * Removes an item (by productId) from the user's cart.
 */
const removeFromCart = async (userId, productId) => {
    return await cart_db_1.default.removeFromCart(userId, productId);
};
/**
 * Updates a cart item with a new quantity.
 */
const updateCart = async (userId, productId, quantity, itemId) => {
    return await cart_db_1.default.updateCart(userId, itemId, productId, quantity);
};
/**
 * Performs checkout: creates an order from the cart's items and then clears the cart.
 */
const checkout = async (userId, cart) => {
    // Retrieve the existing cart for the user
    const existingCart = await cart_db_1.default.getCartByUserId(userId);
    if (!existingCart) {
        throw new Error('Cart not found');
    }
    // Create a new order document in Cosmos DB based on the cart items
    const newOrder = await cart_db_1.default.createOrder(userId, cart.items);
    // Clear the user's cart
    await cart_db_1.default.clearCart(userId);
    return newOrder;
};
exports.checkout = checkout;
/**
 * Retrieves all orders for the given user.
 */
const getOrdersByUserId = async (userId) => {
    const orders = await cart_db_1.default.getOrdersByUserId(userId);
    return orders;
};
exports.default = {
    addToCart,
    removeFromCart,
    getCartItems,
    updateCart,
    checkout: exports.checkout,
    getOrdersByUserId,
};
