import { CosmosProductRepository } from "../repository/cosmos-product-repository";
import { Product, IProduct } from "../domain/product";
import { CustomError } from "../domain/custom-error";

export class ProductService {
  private static instance: ProductService;
  private repository: CosmosProductRepository;

  private constructor() {
    this.repository = CosmosProductRepository.getInstance();
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  public async getAllProducts(): Promise<Product[]> {
    return this.repository.getAllProducts();
  }

  public async getProductById(id: string): Promise<Product> {
    return this.repository.getProductById(id);
  }

  public async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim() === "") {
      return this.getAllProducts();
    }

    return this.repository.searchProducts(query);
  }

  public async createProduct(product: IProduct): Promise<Product> {
    return this.repository.createProduct(product);
  }

  public async updateProduct(
    id: string,
    updates: Partial<IProduct>
  ): Promise<Product> {
    return this.repository.updateProduct(id, updates);
  }

  public async deleteProduct(id: string): Promise<void> {
    return this.repository.deleteProduct(id);
  }

  public async updateProductStock(
    id: string,
    quantity: number
  ): Promise<Product> {
    try {
      const product = await this.repository.getProductById(id);

      if (product.stock < quantity) {
        throw CustomError.validation(
          `Not enough stock available. Current stock: ${product.stock}`
        );
      }

      const newStock = product.stock - quantity;
      return this.repository.updateProduct(id, { stock: newStock });
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to update product stock");
    }
  }
}
