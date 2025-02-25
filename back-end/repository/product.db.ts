import { ProductCatalog } from '@prisma/client';
import { Product } from '../model/product';
import database from './database';

const getAllProducts = async (): Promise<Product[]> => {
    try {
        const productsPrisma = await database.product.findMany();
        return productsPrisma.map((productPrisma) => Product.from(productPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getProductsLimitDesc = async (limit: number): Promise<Product[]> => {
    try {
        const productsPrisma = await database.product.findMany({
            take: limit,
            orderBy: {
                id: 'desc',
            },
        });
        return productsPrisma.map((productPrisma) => Product.from(productPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getProductById = async (productId: number): Promise<Product> => {
    try {
        const productPrisma = await database.product.findUnique({
            where: {
                id: productId,
            },
        });
        if (!productPrisma) {
            throw new Error('Product not found');
        }
        return Product.from(productPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateProductStock = async (productId: number, amount: number): Promise<void> => {
    try {
        const existingProduct = await database.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!existingProduct) {
            throw new Error('Product not found');
        }

        const newAmount = existingProduct.stock - amount;

        await database.product.update({
            where: {
                id: productId,
            },
            data: {
                stock: newAmount,
            },
        });
    } catch (error) {}
};

const createProduct = async (product: any): Promise<Product> => {
    try {
        const userId = product.userId;
        console.log('userId', userId);

        if (!(product instanceof Product)) {
            product = new Product(product);
        }

        const productCatalog = await database.productCatalog.findUnique({
            where: {
                userId: userId,
            },
            include: {
                products: true,
            },
        });

        console.log('productCatalog:', productCatalog);

        if (!productCatalog) {
            throw new Error('Product catalog not found');
        }

        const productCatalogPrisma = await database.productCatalog.update({
            where: {
                id: productCatalog.id,
            },
            data: {
                products: {
                    create: {
                        name: product.name,
                        description: product.description,
                        media: product.media,
                        stock: Number(product.stock),
                        price: Number(product.price),
                        details: product.details,
                    },
                },
            },
            include: {
                products: true,
            },
        });

        console.log('productCatalogPrisma', productCatalogPrisma);
        console.log('productCatalogPrisma.products', productCatalogPrisma.products);

        const createdProduct = productCatalogPrisma.products.find((p) => p.name === product.name);

        if (!createdProduct) {
            throw new Error('Product creation failed');
        }

        console.log('productId:', createdProduct.id);
        return Product.from(createdProduct);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getProductCatalog = async (userId: number): Promise<ProductCatalog | null> => {
    const productCatalog = await database.productCatalog.findUnique({
        where: {
            userId: userId,
        },
        include: {
            products: true,
        },
    });
    if (!productCatalog) {
        return null;
    }
    return productCatalog;
};

const addProductToProductCatalog = async (
    product: Product,
    productCatalog: any
): Promise<Product> => {
    try {
        console.log('productCatalog:', productCatalog);

        if (!productCatalog || !productCatalog.id) {
            throw new Error('Invalid product catalog');
        }

        const existingCatalog = await database.productCatalog.findUnique({
            where: {
                id: productCatalog.id,
            },
            include: {
                products: true,
            },
        });

        if (!existingCatalog) {
            throw new Error('Product catalog not found');
        }

        const productId = product.getId();

        console.log('productId:', productId); // Log the productId

        if (!productId) {
            throw new Error('Invalid product ID');
        }

        const existingProducts = existingCatalog.products.map((p) => ({ ...p }));
        const updatedProducts = [...existingProducts, product];

        await database.productCatalog.update({
            where: {
                id: productCatalog.id,
            },
            data: {
                products: {
                    set: updatedProducts.map((p) => ({
                        id: p instanceof Product ? p.getId() : p.id,
                    })),
                },
            },
        });

        return product;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const productDb = {
    getAllProducts,
    getProductsLimitDesc,
    getProductById,
    updateProductStock,
    createProduct,
    getProductCatalog,
};

export { productDb };
