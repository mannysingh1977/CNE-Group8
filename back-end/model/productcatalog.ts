import { Product } from './product';

interface ProductCatalogCosmosDb {
  id?: string;
  productIds: string[];
}
export class ProductCatalog {
  private id?: string;
  private productIds: string[];

  constructor(productCatalog: { id?: string }) {
    this.id = productCatalog.id;
    this.productIds = [];
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getProductIds(): string[] {
    return this.productIds;
  }

  public addProduct(product: Product): Product {

    this.productIds.push(product.getId()!);
    console.log(this.productIds);
    return product;
  }

  static fromDocument(data: ProductCatalogCosmosDb): ProductCatalog {
    const productCatalog = new ProductCatalog({ id: data.id });
    productCatalog.productIds = data.productIds;
    return productCatalog;
  }

  equals(productCatalog: ProductCatalog): boolean {
    if (this.id !== productCatalog.id) {
      return false;
    }
    if (this.productIds.length !== productCatalog.productIds.length) {
      return false;
    }
    return this.productIds.every((id, index) => id === productCatalog.productIds[index]);
  }

  public toCosmosDbDocument(): ProductCatalogCosmosDb {
    return {
      id: this.id,
      productIds: this.productIds,
    };
  }
}
