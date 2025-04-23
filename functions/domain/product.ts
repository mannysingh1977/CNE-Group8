export interface IProduct {
  id?: string;
  name: string;
  description: string;
  media: string;
  stock: number;
  price: number;
  details: string;
}

export class Product {
  public id?: string;
  public name: string;
  public description: string;
  public media: string;
  public stock: number;
  public price: number;
  public details: string;

  constructor(
    name: string,
    description: string,
    media: string,
    stock: number,
    price: number,
    details: string,
    id?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.media = media;
    this.stock = stock;
    this.price = price;
    this.details = details;
  }

  public static fromDB(dbProduct: any): Product {
    return new Product(
      dbProduct.name,
      dbProduct.description,
      dbProduct.media,
      dbProduct.stock,
      dbProduct.price,
      dbProduct.details,
      dbProduct.id
    );
  }

  public validate(): void {
    if (!this.name) {
      throw new Error("Name is required");
    }
    if (!this.description) {
      throw new Error("Description is required");
    }
    if (!this.media) {
      throw new Error("Media is required");
    }
    if (this.stock === undefined || this.stock < 0) {
      throw new Error("Stock is required and must be a positive number");
    }
    if (this.price === undefined || this.price < 0) {
      throw new Error("Price is required and must be a positive number");
    }
    if (!this.details) {
      throw new Error("Details are required");
    }
  }

  public update(updates: Partial<IProduct>): void {
    if (updates.name) this.name = updates.name;
    if (updates.description) this.description = updates.description;
    if (updates.media) this.media = updates.media;
    if (updates.stock !== undefined) this.stock = updates.stock;
    if (updates.price !== undefined) this.price = updates.price;
    if (updates.details) this.details = updates.details;
  }

  public toJSON(): IProduct {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      media: this.media,
      stock: this.stock,
      price: this.price,
      details: this.details,
    };
  }
}
