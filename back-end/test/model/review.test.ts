import { Address } from '../../model/address';
import { Product } from '../../model/product';
import { Review } from '../../model/review';
import { User } from '../../model/user';

const address = new Address({
    street: 'Bondgenotenlaan',
    houseNumber: '10',
    city: 'Leuven',
    state: 'Leuven',
    postalCode: '3000',
    country: 'Belgium',
});
const user = new User({
    name: 'John Doe',
    phoneNumber: '0612345678',
    emailAddress: 'email@gmail.com',
    password: 'password',
    address: address,
    seller: false,
    newsLetter: true,
    role: 'User',
});
let product = new Product({
    name: 'JBL hoofdtelefoon',
    description: 'Een jbl hoofdtelefoon met noice canceling',
    media: '/home/media/jbl.png',
    stock: 50,
    price: 90,
    details: 'noice canceling, max volume: 120db',
});

test('given: valid review info, when: creating review, then: review is created', () => {
    const review = new Review({
        user: user,
        product: product,
        reviewText: 'This is a great product',
    });

    expect(review.getUser()).toEqual(user);
    expect(review.getProduct()).toEqual(product);
    expect(review.getReviewText()).toEqual('This is a great product');
});
