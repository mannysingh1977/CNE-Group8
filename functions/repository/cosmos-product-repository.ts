import { CosmosClient, Container, Database } from "@azure/cosmos";
import { Product, IProduct } from "../domain/product";
import { CustomError } from "../domain/custom-error";
import { v4 as uuidv4 } from "uuid";

export class CosmosProductRepository {
  private static instance: CosmosProductRepository;
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  private constructor() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT || "";
    const key = process.env.COSMOS_DB_KEY || "";
    const databaseName = process.env.COSMOS_DB_DATABASE_NAME || "";
    const containerName = process.env.PRODUCT_CONTAINER_NAME || "products";

    if (!endpoint || !key || !databaseName) {
      throw CustomError.internalServerError("Missing Cosmos DB configuration");
    }

    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(databaseName);
    this.container = this.database.container(containerName);
  }

  public static getInstance(): CosmosProductRepository {
    if (!CosmosProductRepository.instance) {
      CosmosProductRepository.instance = new CosmosProductRepository();
    }
    return CosmosProductRepository.instance;
  }

  public async getAllProducts(): Promise<Product[]> {
    try {
      const querySpec = {
        query: "SELECT * FROM c",
      };

      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      return resources.map((product) => Product.fromDB(product));
    } catch (error) {
      console.error("Error getting products:", error);
      throw CustomError.internalServerError("Failed to retrieve products");
    }
  }

  public async getProductById(id: string): Promise<Product> {
    try {
      const { resource } = await this.container.item(id, id).read();

      if (!resource) {
        throw CustomError.notFound(`Product with id ${id} not found`);
      }

      return Product.fromDB(resource);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error getting product by ID:", error);
      throw CustomError.internalServerError("Failed to retrieve product");
    }
  }

  public async searchProducts(query: string): Promise<Product[]> {
    try {
      const searchQuery = {
        query:
          "SELECT * FROM c WHERE CONTAINS(LOWER(c.name), @query) OR CONTAINS(LOWER(c.description), @query)",
        parameters: [
          {
            name: "@query",
            value: query.toLowerCase(),
          },
        ],
      };

      const { resources } = await this.container.items
        .query(searchQuery)
        .fetchAll();
      return resources.map((product) => Product.fromDB(product));
    } catch (error) {
      console.error("Error searching products:", error);
      throw CustomError.internalServerError("Failed to search products");
    }
  }

  public async createProduct(product: IProduct): Promise<Product> {
    try {
      const newProduct = new Product(
        product.name,
        product.description,
        product.media,
        product.stock,
        product.price,
        product.details,
        uuidv4()
      );

      newProduct.validate();

      const { resource } = await this.container.items.create(
        newProduct.toJSON()
      );
      return Product.fromDB(resource);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("required")) {
          throw CustomError.validation(error.message);
        }
      }

      console.error("Error creating product:", error);
      throw CustomError.internalServerError("Failed to create product");
    }
  }

  public async updateProduct(
    id: string,
    updates: Partial<IProduct>
  ): Promise<Product> {
    try {
      const existingProduct = await this.getProductById(id);

      existingProduct.update(updates);
      existingProduct.validate();

      const { resource } = await this.container
        .item(id, id)
        .replace(existingProduct.toJSON());
      return Product.fromDB(resource);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.message.includes("required")) {
          throw CustomError.validation(error.message);
        }
      }

      console.error("Error updating product:", error);
      throw CustomError.internalServerError("Failed to update product");
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    try {
      await this.getProductById(id); // Check if product exists
      await this.container.item(id, id).delete();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error deleting product:", error);
      throw CustomError.internalServerError("Failed to delete product");
    }
  }
}
