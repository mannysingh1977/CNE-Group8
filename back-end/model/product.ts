interface ProductCosmosDb {
  id?: string;
  name: string;
  description: string;
  media: string;
  stock: number;
  price: number;
  details: string;
}

export class Product {
  private id: string | undefined;
  private name: string;
  private description: string;
  private media: string;
  private stock: number;
  private price: number;
  private details: string;

  constructor(product: {
    name: string;
    description: string;
    media: string;
    stock: number;
    price: number;
    details: string;
    id?: string | undefined;
  }) {
    this.validate(product);
    this.id = product.id;
    this.name = product.name;
    this.description = product.description;
    this.media = product.media;
    this.stock = product.stock;
    this.price = product.price;
    this.details = product.details;
  }

  validate(product: {
    name: string;
    description: string;
    media: string;
    stock: number;
    price: number;
    details: string;
    id?: string | undefined;
  }) {
    if (!product.name) {
      throw new Error('Name is required');
    }
    if (!product.description) {
      throw new Error('Description is required');
    }
    if (!product.media) {
      throw new Error('Media is required');
    }
    if (product.stock === undefined || product.stock < 0) {
      throw new Error('Stock is required and must be a positive number');
    }
    if (product.price === undefined || product.price < 0) {
      throw new Error('Price is required and must be a positive number');
    }
    if (!product.details) {
      throw new Error('Details are required');
    }
  }

  static fromObject(data: {
    id?: string,
    name: string,
    description: string,
    media: string,
    stock: number,
    price: number,
    details: string,

  }): Product {
    return new Product({
      id: data.id,
      name: data.name,
      description: data.description,
      media: data.media,
      stock: data.stock,
      price: data.price,
      details: data.details,
    });
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getMedia(): string {
    return this.media;
  }

  public getStock(): number {
    return this.stock;
  }

  public getPrice(): number {
    return this.price;
  }

  public getDetails(): string {
    return this.details;
  }

  public equals(product: Product): boolean {
    return (
      this.name === product.name &&
      this.description === product.description &&
      this.media === product.media &&
      this.stock === product.stock &&
      this.price === product.price &&
      this.details === product.details
    );
  }

  public toCosmosDbDocument(): ProductCosmosDb {
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
