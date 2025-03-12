import { User } from './user';
import { Product } from './product';

interface ShoppingCartCosmosDb {
  id?: string;
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
}

export class ShoppingCart {
  private id?: string;
  private userId: string;
  private items: Array<{ productId: string; quantity: number }>;

  constructor(shoppingCart: { id?: string; userId: string }) {
    this.id = shoppingCart.id;
    this.userId = shoppingCart.userId;
    this.items = [];
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getItems(): Array<{ productId: string; quantity: number }> {
    return this.items;
  }

  public getUserId(): string {
    return this.userId;
  }

  public addItem(productId: string, quantity: number): void {
    const existingItem = this.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }
  }

  static fromDocument(data: ShoppingCartCosmosDb): ShoppingCart {
    const shoppingCart = new ShoppingCart({ id: data.id, userId: data.userId });
    shoppingCart.items = data.items;
    return shoppingCart;
  }

  equals(shoppingCart: ShoppingCart): boolean {
    if (this.userId !== shoppingCart.userId) {
      return false;
    }
    if (this.items.length !== shoppingCart.items.length) {
      return false;
    }
    return this.items.every((item, index) =>
      item.productId === shoppingCart.items[index].productId &&
      item.quantity === shoppingCart.items[index].quantity
    );
  }
}
