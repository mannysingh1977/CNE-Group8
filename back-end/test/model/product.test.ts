import { Product } from "../../model/product";

const VALID_NAME = 'JBL hoofdtelefoon';
const VALID_DESCRIPTION = 'Een jbl hoofdtelefoon met noice canceling';
const VALID_MEDIA = '/home/media/jbl.png'
const VALID_STOCK = 50;
const VALID_PRICE = 90;
const VALID_DETAILS = 'noice canceling, max volume: 120db'

test('given: valid product info, when: creating product, then: product is created', () => {
    const product = new Product({ name: VALID_NAME, description: VALID_DESCRIPTION, media: VALID_MEDIA, stock: VALID_STOCK, price: VALID_PRICE, details: VALID_DETAILS });

    expect(product.getName()).toEqual(VALID_NAME);
    expect(product.getDescription()).toEqual(VALID_DESCRIPTION);
    expect(product.getMedia()).toEqual(VALID_MEDIA);
    expect(product.getStock()).toEqual(VALID_STOCK);
    expect(product.getPrice()).toEqual(VALID_PRICE);
    expect(product.getDetails()).toEqual(VALID_DETAILS);
});

test('given: to identical products, when: asking if equal, then: true is returned', () => {
    const product1 = new Product({ name: VALID_NAME, description: VALID_DESCRIPTION, media: VALID_MEDIA, stock: VALID_STOCK, price: VALID_PRICE, details: VALID_DETAILS });
    const product2 = new Product({ name: VALID_NAME, description: VALID_DESCRIPTION, media: VALID_MEDIA, stock: VALID_STOCK, price: VALID_PRICE, details: VALID_DETAILS });

    expect(product1.equals(product2)).toBe(true);
})

test('given: two different products, when: asking if equal, then: false is returned', () => {
    const product1 = new Product({ name: VALID_NAME, description: VALID_DESCRIPTION, media: VALID_MEDIA, stock: VALID_STOCK, price: VALID_PRICE, details: VALID_DETAILS });
    const product2 = new Product({ name: 'JBL oortjes', description: 'JBL oortjes met noice canceling', media: '/home/media/jbl.png', stock: 50, price: 90, details: 'noice canceling, max volume: 120db' });

    expect(product1.equals(product2)).toBe(false);
});

test('given: product with empty name, when: creating product, then: error is thrown', () => {
    expect(() => new Product({ name: '', description: VALID_DESCRIPTION, media: VALID_MEDIA, stock: VALID_STOCK, price: VALID_PRICE, details: VALID_DETAILS })).toThrow('Name is required');
});

test('given: product with empty description, when: creating product, then: error is thrown', () => {
    expect(() => new Product({ name: VALID_NAME, description: '', media: VALID_MEDIA, stock: VALID_STOCK, price: VALID_PRICE, details: VALID_DETAILS })).toThrow('Description is required');
});

test('given: product with empty media, when: creating product, then: error is thrown', () => {
    expect(() => new Product({ name: VALID_NAME, description: VALID_DESCRIPTION, media: '', stock: VALID_STOCK, price: VALID_PRICE, details: VALID_DETAILS })).toThrow('Media is required');
});

test('given: product with empty stock, when: creating product, then: error is thrown', () => {
    expect(() => new Product({ name: VALID_NAME, description: VALID_DESCRIPTION, media: VALID_MEDIA, stock: 0, price: VALID_PRICE, details: VALID_DETAILS })).toThrow('Stock is required');
});

test('given: product with empty price, when: creating product, then: error is thrown', () => {
    expect(() => new Product({ name: VALID_NAME, description: VALID_DESCRIPTION, media: VALID_MEDIA, stock: VALID_STOCK, price: 0, details: VALID_DETAILS })).toThrow('Price is required');
});



