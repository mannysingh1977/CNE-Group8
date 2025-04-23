import { CosmosClient, Container, Database } from "@azure/cosmos";
import { Cart, ICart, CartItem } from "../domain/cart";
import { CustomError } from "../domain/custom-error";
import { v4 as uuidv4 } from "uuid";

export class CosmosCartRepository {
  private static instance: CosmosCartRepository;
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  private constructor() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT || "";
    const key = process.env.COSMOS_DB_KEY || "";
    const databaseName = process.env.COSMOS_DB_DATABASE_NAME || "";
    const containerName = process.env.CART_CONTAINER_NAME || "carts";

    if (!endpoint || !key || !databaseName) {
      throw CustomError.internalServerError("Missing Cosmos DB configuration");
    }

    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(databaseName);
    this.container = this.database.container(containerName);
  }

  public static getInstance(): CosmosCartRepository {
    if (!CosmosCartRepository.instance) {
      CosmosCartRepository.instance = new CosmosCartRepository();
    }
    return CosmosCartRepository.instance;
  }

  public async getCartByUserId(userId: string): Promise<Cart> {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [
          {
            name: "@userId",
            value: userId,
          },
        ],
      };

      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();

      if (resources.length === 0) {
        // Create a new cart if one doesn't exist
        return this.createCart(userId);
      }

      return Cart.fromDB(resources[0]);
    } catch (error) {
      console.error("Error getting cart:", error);
      throw CustomError.internalServerError("Failed to retrieve cart");
    }
  }

  public async createCart(userId: string): Promise<Cart> {
    try {
      const newCart = new Cart(userId, [], uuidv4());

      const { resource } = await this.container.items.create(newCart.toJSON());
      return Cart.fromDB(resource);
    } catch (error) {
      console.error("Error creating cart:", error);
      throw CustomError.internalServerError("Failed to create cart");
    }
  }

  public async updateCart(cart: Cart): Promise<Cart> {
    try {
      if (!cart.id) {
        throw CustomError.validation("Cart ID is required for update");
      }

      const { resource } = await this.container
        .item(cart.id, cart.userId)
        .replace(cart.toJSON());
      return Cart.fromDB(resource);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error updating cart:", error);
      throw CustomError.internalServerError("Failed to update cart");
    }
  }

  public async addItemToCart(userId: string, item: CartItem): Promise<Cart> {
    try {
      const cart = await this.getCartByUserId(userId);

      cart.addItem(item);

      return this.updateCart(cart);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error adding item to cart:", error);
      throw CustomError.internalServerError("Failed to add item to cart");
    }
  }

  public async updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    try {
      const cart = await this.getCartByUserId(userId);

      cart.updateItemQuantity(productId, quantity);

      return this.updateCart(cart);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("not found in cart")
      ) {
        throw CustomError.validation(error.message);
      }
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error updating cart item quantity:", error);
      throw CustomError.internalServerError(
        "Failed to update cart item quantity"
      );
    }
  }

  public async removeItemFromCart(
    userId: string,
    productId: string
  ): Promise<Cart> {
    try {
      const cart = await this.getCartByUserId(userId);

      cart.removeItem(productId);

      return this.updateCart(cart);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error removing item from cart:", error);
      throw CustomError.internalServerError("Failed to remove item from cart");
    }
  }

  public async clearCart(userId: string): Promise<Cart> {
    try {
      const cart = await this.getCartByUserId(userId);

      cart.clear();

      return this.updateCart(cart);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error clearing cart:", error);
      throw CustomError.internalServerError("Failed to clear cart");
    }
  }
}
