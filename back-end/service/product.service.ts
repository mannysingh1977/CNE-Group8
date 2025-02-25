import { productDb } from '../repository/product.db';

const getAllProducts = async () => {
    const products = await productDb.getAllProducts();
    return products;
};

const getProductsLimitDesc = async (limit: number) => {
    const products = await productDb.getProductsLimitDesc(limit);
    return products;
};

const getProductById = async (productId: number) => {
    const product = await productDb.getProductById(productId);
    return product;
};

const createProduct = async (product: any) => {
    const newProduct = await productDb.createProduct(product);
    return newProduct;
};

const getProductCatalog = async (userId: number) => {
    const productCatalog = await productDb.getProductCatalog(userId);
    return productCatalog;
};

export default {
    getAllProducts,
    getProductsLimitDesc,
    getProductById,
    createProduct,
    getProductCatalog,
};
