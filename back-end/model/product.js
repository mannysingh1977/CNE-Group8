"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(product) {
        this.validate(product);
        this.id = product.id;
        this.name = product.name;
        this.description = product.description;
        this.media = product.media;
        this.stock = product.stock;
        this.price = product.price;
        this.details = product.details;
    }
    validate(product) {
        if (!product.name) {
            throw new Error("Name is required");
        }
        if (!product.description) {
            throw new Error("Description is required");
        }
        if (!product.media) {
            throw new Error("Media is required");
        }
        if (product.stock === undefined || product.stock <= 0) {
            throw new Error("Stock is required and must be a positive number");
        }
        if (product.price === undefined || product.price <= 0) {
            throw new Error("Price is required and must be a positive number");
        }
        if (!product.details) {
            throw new Error("Details are required");
        }
    }
    static fromObject(data) {
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
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getMedia() {
        return this.media;
    }
    getStock() {
        return this.stock;
    }
    getPrice() {
        return this.price;
    }
    getDetails() {
        return this.details;
    }
    equals(product) {
        return (this.name === product.name &&
            this.description === product.description &&
            this.media === product.media &&
            this.stock === product.stock &&
            this.price === product.price &&
            this.details === product.details);
    }
    toCosmosDbDocument() {
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
exports.Product = Product;
