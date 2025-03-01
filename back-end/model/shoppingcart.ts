import { CartItem, User } from "@prisma/client";
import { Product } from "./product";

//No validation is needed for this class, because there is no input given to construct the object
interface ShoppingCartPrisma {
  id?: string;
  user: User;
  items: Array<CartItem>;
}
export class ShoppingCart {
  private id: string | undefined;
  private items: Array<CartItem>;
  private user: User;

  constructor(shoppingCart: { id?: string | undefined; user: User }) {
    this.id = shoppingCart.id;
    this.items = [];
    this.user = shoppingCart.user;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getItems(): Array<CartItem> {
    return this.items;
  }

  public getUser(): User {
    return this.user;
  }

  // public addProduct(item: Product): Product {
  //     this.items.push(item);
  //     console.log(this.items);
  //     return item;
  // }

  static from({ id, items, user }: ShoppingCartPrisma): ShoppingCart {
    const shoppingCart = new ShoppingCart({ id, user });
    shoppingCart.items = items;
    return shoppingCart;
  }
}
