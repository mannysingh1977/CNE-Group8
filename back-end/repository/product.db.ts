import { Container } from '@azure/cosmos';
import { Product } from '../model/product';
import { getContainer } from './database';

const productContainer: Container = getContainer('product');
const productCatalogContainer: Container = getContainer('productCatalog');

const mapToProduct = (data: any): Product => {
  return Product.fromObject({
    id: data.id,
    name: data.name,
    description: data.description,
    media: data.media,
    stock: data.stock,
    price: data.price,
    details: data.details
  });
};

const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { resources: products } = await productContainer.items
      .query("SELECT * FROM c")
      .fetchAll();
    return products.map(mapToProduct);
  } catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
  }
};

const getProductsLimitDesc = async (limit: number): Promise<Product[]> => {
  try {
    const querySpec = {
      query: "SELECT TOP @limit * FROM c ORDER BY c.id DESC",
      parameters: [{ name: "@limit", value: limit }]
    };
    const { resources: products } = await productContainer.items
      .query(querySpec)
      .fetchAll();
    return products.map((p: any) => Product.fromObject(p));
  } catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
  }
};

const getProductById = async (productId: string): Promise<Product> => {
  try {

    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: productId }]
    };
    const { resources: products } = await productContainer.items.query(querySpec).fetchAll();
    if (products.length === 0) {
      throw new Error('Product not found');
    }
    return Product.fromObject(products[0]);
  } catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
  }
};

const updateProductStock = async (productId: string, amount: number): Promise<void> => {
  try {
    const { resource: existingProduct } = await productContainer.item(productId, productId).read();
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    existingProduct.stock = existingProduct.stock - amount;
    await productContainer.item(productId, productId).replace(existingProduct);
  } catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
  }
};

const createProduct = async (product: any): Promise<Product> => {
  try {
    if (!(product instanceof Product)) {
      product = new Product(product);
    }
    const { resource: createdProduct } = await productContainer.items.create(product.toCosmosDbDocument());
    if (!createdProduct) {
      throw new Error('Product creation failed');
    }
    return Product.fromObject(createdProduct);
  } catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
  }
};

const getProductCatalog = async (userId: string): Promise<any> => {
  try {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId",
      parameters: [{ name: "@userId", value: userId }]
    };
    const { resources: catalogs } = await productCatalogContainer.items.query(querySpec).fetchAll();
    if (catalogs.length === 0) {
      return null;
    }
    return catalogs[0];
  } catch (error) {
    console.error(error);
    throw new Error('Database error. See server log for details.');
  }
};

const addProductToProductCatalog = async (
  product: Product,
  productCatalog: any
): Promise<Product> => {
  try {
    if (!productCatalog || !productCatalog.id) {
      throw new Error('Invalid product catalog');
    }
    const { resource: existingCatalog } = await productCatalogContainer.item(productCatalog.id, productCatalog.id).read();
    if (!existingCatalog) {
      throw new Error('Product catalog not found');
    }
    existingCatalog.products = existingCatalog.products || [];
    existingCatalog.products.push(product.toCosmosDbDocument());
    await productCatalogContainer.item(productCatalog.id, productCatalog.id).replace(existingCatalog);
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
  addProductToProductCatalog,
};

export { productDb };
