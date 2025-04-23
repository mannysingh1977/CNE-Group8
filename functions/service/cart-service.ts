import { CosmosCartRepository } from "../repository/cosmos-cart-repository";
import { Cart, CartItem } from "../domain/cart";
import { CustomError } from "../domain/custom-error";
import { ProductService } from "./product-service";

export class CartService {
  private static instance: CartService;
  private repository: CosmosCartRepository;
  private productService: ProductService;

  private constructor() {
    this.repository = CosmosCartRepository.getInstance();
    this.productService = ProductService.getInstance();
  }

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  public async getCart(userId: string): Promise<Cart> {
    return this.repository.getCartByUserId(userId);
  }

  public async addItemToCart(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    try {
      // Validate quantity
      if (quantity <= 0) {
        throw CustomError.validation("Quantity must be greater than zero");
      }

      // Get product details
      const product = await this.productService.getProductById(productId);

      // Check if enough stock is available
      if (product.stock < quantity) {
        throw CustomError.validation(
          `Not enough stock available. Current stock: ${product.stock}`
        );
      }

      // Create cart item
      const item: CartItem = {
        productId,
        quantity,
        name: product.name,
        price: product.price,
      };

      return this.repository.addItemToCart(userId, item);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to add item to cart");
    }
  }

  public async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    try {
      if (quantity < 0) {
        throw CustomError.validation("Quantity cannot be negative");
      }

      if (quantity > 0) {
        // If updating with positive quantity, check stock
        const product = await this.productService.getProductById(productId);

        if (product.stock < quantity) {
          throw CustomError.validation(
            `Not enough stock available. Current stock: ${product.stock}`
          );
        }
      }

      return this.repository.updateCartItemQuantity(
        userId,
        productId,
        quantity
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to update item quantity");
    }
  }

  public async removeItem(userId: string, productId: string): Promise<Cart> {
    return this.repository.removeItemFromCart(userId, productId);
  }

  public async clearCart(userId: string): Promise<Cart> {
    return this.repository.clearCart(userId);
  }

  public async processCartCheckout(userId: string): Promise<void> {
    try {
      const cart = await this.repository.getCartByUserId(userId);

      if (cart.items.length === 0) {
        throw CustomError.validation("Cannot checkout an empty cart");
      }

      // Process each item - reduce stock
      for (const item of cart.items) {
        await this.productService.updateProductStock(
          item.productId,
          item.quantity
        );
      }

      // Clear the cart after successful checkout
      await this.repository.clearCart(userId);

      // Here you would typically create an order, process payment, etc.
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to process checkout");
    }
  }
}
