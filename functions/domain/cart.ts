export interface CartItem {
  productId: string;
  quantity: number;
  name: string;
  price: number;
}

export interface ICart {
  id?: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt?: string;
}

export class Cart implements ICart {
  public id?: string;
  public userId: string;
  public items: CartItem[];
  public createdAt: string;
  public updatedAt?: string;

  constructor(userId: string, items: CartItem[] = [], id?: string) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.createdAt = new Date().toISOString();
  }

  public static fromDB(dbCart: any): Cart {
    const cart = new Cart(dbCart.userId, dbCart.items || [], dbCart.id);
    cart.createdAt = dbCart.createdAt;
    cart.updatedAt = dbCart.updatedAt;
    return cart;
  }

  public addItem(item: CartItem): void {
    const existingItemIndex = this.items.findIndex(
      (i) => i.productId === item.productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      this.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      this.items.push(item);
    }

    this.updatedAt = new Date().toISOString();
  }

  public updateItemQuantity(productId: string, quantity: number): void {
    const itemIndex = this.items.findIndex((i) => i.productId === productId);

    if (itemIndex < 0) {
      throw new Error(`Item with product ID ${productId} not found in cart`);
    }

    if (quantity <= 0) {
      // Remove item if quantity is zero or negative
      this.items.splice(itemIndex, 1);
    } else {
      // Update quantity
      this.items[itemIndex].quantity = quantity;
    }

    this.updatedAt = new Date().toISOString();
  }

  public removeItem(productId: string): void {
    const itemIndex = this.items.findIndex((i) => i.productId === productId);

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1);
      this.updatedAt = new Date().toISOString();
    }
  }

  public getTotal(): number {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  public clear(): void {
    this.items = [];
    this.updatedAt = new Date().toISOString();
  }

  public toJSON(): ICart {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
