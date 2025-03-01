import {Product as ProductPrisma} from '@prisma/client';

export class Product {
    private id: string | undefined;
    private name: string;
    private description: string;
    private media: string;
    private stock: number;
    private price: number;
    private details: string;

    static from({
        id,
        name,
        description,
        media,
        stock,
        price,
        details,
    }: ProductPrisma) {
        return new Product({
            id,
            name,
            description,
            media,
            stock,
            price,
            details,
        });
    }

    constructor(product: {name: string, description: string, media: string, stock: number, price: number, details: string, id?: string | undefined}) {
        this.validate(product);
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.media = product.media;
        this.stock = product.stock;
        this.price = product.price;
        this.details = product.details;
    }

    validate(product: {name: string, description: string, media: string, stock: number, price: number, details: string, id?: string | undefined}) {
        if (!product.name) {
            throw new Error('Name is required');
        }
        if (!product.description) {
            throw new Error('Description is required');
        }
        if (!product.media) {
            throw new Error('Media is required');
        }
        if (!product.stock) {
            throw new Error('Stock is required');
        }
        if (!product.price) {
            throw new Error('Price is required');
        }
        if (!product.details) {
            throw new Error('Details is required');
        }
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
            this.name == product.name &&
            this.description == product.description &&
            this.media == product.media &&
            this.stock == product.stock &&
            this.price == product.price &&
            this.details == product.details
        );
    }
}