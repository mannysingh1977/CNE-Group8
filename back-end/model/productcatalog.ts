import { Product } from "./product";

//No validation is needed for this class, because there is no input given to construct the object

export class ProductCatalog {
    private id: number | undefined;
    private products : Array<Product>

    constructor(productCatalog : {id? : number | undefined}) {
        this.id = productCatalog.id;
        this.products = [];
    }

    public getId(): number | undefined {
        return this.id;
    }

    public getProducts() : Array<Product> {
        return this.products;
    }

    public addProduct(product: Product) : Product {
        this.products.push(product)
        console.log(this.products)
        return product;
    }
}