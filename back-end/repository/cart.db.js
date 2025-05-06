"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.removeFromCart = void 0;
const product_db_1 = require("./product.db");
const database_1 = require("./database");
const shoppingCartContainer = (0, database_1.getContainer)('shoppingCart');
const orderContainer = (0, database_1.getContainer)('order');
const productContainer = (0, database_1.getContainer)('product');
const getShoppingCartByUserId = async (userId) => {
    const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }],
    };
    const { resources: carts } = await shoppingCartContainer.items
        .query(querySpec)
        .fetchAll();
    return carts.length > 0 ? carts[0] : null;
};
const createShoppingCart = async (userId) => {
    const cartDoc = {
        userId,
        items: []
    };
    const { resource: createdCart } = await shoppingCartContainer.items.create(cartDoc);
    return createdCart;
};
const addToCart = async (userId, productId, quantity) => {
    try {
        let cart = await getShoppingCartByUserId(userId);
        if (!cart) {
            cart = await createShoppingCart(userId);
        }
        const product = await product_db_1.productDb.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const existingIndex = cart.items.findIndex((item) => item.productId === productId);
        if (existingIndex !== -1) {
            cart.items[existingIndex].quantity += quantity;
        }
        else {
            const newItem = {
                id: `${new Date().getTime()}-${productId}`,
                productId,
                quantity,
                product: product.toCosmosDbDocument ? product.toCosmosDbDocument() : product,
            };
            cart.items.push(newItem);
        }
        const { resource: updatedCart } = await shoppingCartContainer
            .item(cart.id, userId)
            .replace(cart);
        return updatedCart;
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const removeFromCart = async (userId, itemId) => {
    try {
        const cart = await getShoppingCartByUserId(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const itemIndex = cart.items.findIndex((item) => item.id === itemId);
        if (itemIndex === -1) {
            console.error(`Cart item not found: ${itemId}`);
            return null;
        }
        cart.items.splice(itemIndex, 1);
        const { resource: updatedCart } = await shoppingCartContainer
            .item(cart.id, userId)
            .replace(cart);
        return updatedCart;
    }
    catch (error) {
        console.error('Error in removeFromCart:', error);
        throw new Error('Failed to remove item from cart.');
    }
};
exports.removeFromCart = removeFromCart;
const getCartItems = async (userId) => {
    try {
        let cart = await getShoppingCartByUserId(userId);
        if (!cart) {
            cart = await createShoppingCart(userId);
        }
        return cart;
    }
    catch (error) {
        console.error(`Error in getCartItems for userId: ${userId}`, error);
        throw new Error('Database error. See server log for details.');
    }
};
const updateCart = async (userId, itemId, productId, quantity) => {
    try {
        const cart = await getShoppingCartByUserId(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const itemIndex = cart.items.findIndex((item) => item.id === itemId && item.productId === productId);
        if (itemIndex === -1) {
            console.error(`Product with ID ${productId} not found in cart for user ${userId}`);
            throw new Error('Product not found in cart');
        }
        cart.items[itemIndex].quantity = quantity;
        const { resource: updatedCart } = await shoppingCartContainer
            .item(cart.id, userId)
            .replace(cart);
        return updatedCart;
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const createOrder = async (userId, items) => {
    try {
        const orderDoc = {
            userId,
            items: items.map(item => ({
                // Generate a simple id for the order item.
                id: `${new Date().getTime()}-${item.productId}`,
                productId: item.productId,
                quantity: item.quantity,
            })),
            createdAt: new Date().toISOString(),
        };
        const { resource: newOrder } = await orderContainer.items.create(orderDoc);
        return newOrder;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to create order.');
    }
};
exports.createOrder = createOrder;
const addItemToOrder = async (orderId, productId, quantity) => {
    try {
        const { resource: orderDoc } = await orderContainer
            .item(orderId, orderId)
            .read();
        if (!orderDoc) {
            throw new Error('Order not found');
        }
        const newItem = {
            id: `${new Date().getTime()}-${productId}`,
            productId,
            quantity,
        };
        orderDoc.items.push(newItem);
        await orderContainer.item(orderId, orderId).replace(orderDoc);
        return newItem;
    }
    catch (error) {
        console.error(error);
        throw new Error('Failed to add item to order.');
    }
};
const getOrdersByUserId = async (userId) => {
    try {
        const querySpec = {
            query: "SELECT * FROM c WHERE c.userId = @userId",
            parameters: [{ name: "@userId", value: userId }],
        };
        const { resources: orders } = await orderContainer.items
            .query(querySpec)
            .fetchAll();
        if (!orders.length) {
            return [];
        }
        const populatedOrders = await Promise.all(orders.map(async (order) => {
            const populatedItems = await Promise.all(order.items.map(async (item) => {
                const productQuery = {
                    query: "SELECT * FROM c WHERE c.id = @productId",
                    parameters: [{ name: "@productId", value: item.productId }],
                };
                const { resources: product } = await productContainer.items
                    .query(productQuery)
                    .fetchAll();
                return {
                    ...item,
                    product: product[0] || { id: item.productId, error: "Product not found" },
                };
            }));
            return { ...order, items: populatedItems };
        }));
        return populatedOrders;
    }
    catch (error) {
        console.error("Error fetching orders with product details:", error);
        throw new Error("Database error. See server log for details.");
    }
};
const clearCart = async (userId) => {
    try {
        const cart = await getShoppingCartByUserId(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.items = [];
        const { resource: updatedCart } = await shoppingCartContainer
            .item(cart.id, userId)
            .replace(cart);
        return updatedCart;
    }
    catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};
const getCartByUserId = async (userId) => {
    return await getCartItems(userId);
};
exports.default = {
    addToCart,
    removeFromCart: exports.removeFromCart,
    getCartItems,
    createShoppingCart,
    updateCart,
    createOrder: exports.createOrder,
    addItemToOrder,
    getOrdersByUserId,
    clearCart,
    getCartByUserId,
};
