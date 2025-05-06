import { Product } from "../../model/product";
import { ShoppingCart } from "../../model/shoppingcart";
import { User } from "../../model/user";
import { Address } from "../../model/address";

test("given: valid shoppingcart info, when: creating shoppingcart, then: shoppingcart is made", () => {
  const address = new Address({
    street: "Main Street",
    houseNumber: "42A",
    city: "Testville",
    state: "Testonia",
    postalCode: "12345",
    country: "Testland",
  });

  const user = new User({
    id: "user-1",
    name: "John Doe",
    phoneNumber: "1234567890",
    emailAddress: "john.doe@example.com",
    password: "password123",
    address: address,
    seller: false,
    newsLetter: true,
    role: "User",
  });

  const shoppingCart = new ShoppingCart({ userId: user.getId() });
  expect(shoppingCart.getItems().length).toEqual(0);
});
