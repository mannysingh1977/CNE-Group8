import { Product } from "../../model/product"
import { ShoppingCart } from "../../model/shoppingcart"

test('given: valid shoppingcart info, when: creating shoppingcart, then: shoppingcart is made', () => {
    const user = {
        password: 'password123',
        name: 'John Doe',
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        phoneNumber: '1234567890',
        emailAddress: 'john.doe@example.com',
        seller: false,
        newsLetter: true,
        role: 'User',
        addressId: 1
    };
    const shoppingCart = new ShoppingCart({ user })
    expect(shoppingCart.getItems().length).toEqual(0)
})
