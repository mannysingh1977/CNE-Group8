"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_db_1 = require("../repository/product.db");
const getAllProducts = async () => {
    const products = await product_db_1.productDb.getAllProducts();
    return products;
};
const getProductsLimitDesc = async (limit) => {
    const products = await product_db_1.productDb.getProductsLimitDesc(limit);
    return products;
};
const getProductById = async (productId) => {
    const product = await product_db_1.productDb.getProductById(productId);
    return product;
};
const createProduct = async (product) => {
    const newProduct = await product_db_1.productDb.createProduct(product);
    return newProduct;
};
const getProductCatalog = async (userId) => {
    const productCatalog = await product_db_1.productDb.getProductCatalog(userId);
    return productCatalog;
};
exports.default = {
    getAllProducts,
    getProductsLimitDesc,
    getProductById,
    createProduct,
    getProductCatalog,
};
