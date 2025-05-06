import { Address } from "../../model/address";
import { Product } from "../../model/product";
import { Review } from "../../model/review";
import { User } from "../../model/user";

const address = new Address({
  street: "Bondgenotenlaan",
  houseNumber: "10",
  city: "Leuven",
  state: "Leuven",
  postalCode: "3000",
  country: "Belgium",
});

const user = new User({
  id: "user-1",
  name: "John Doe",
  phoneNumber: "0612345678",
  emailAddress: "email@gmail.com",
  password: "password",
  address: address,
  seller: false,
  newsLetter: true,
  role: "User",
});

const product = new Product({
  id: "product-1",
  name: "JBL hoofdtelefoon",
  description: "Een jbl hoofdtelefoon met noice canceling",
  media: "/home/media/jbl.png",
  stock: 50,
  price: 90,
  details: "noice canceling, max volume: 120db",
});

test("given: valid review info, when: creating review, then: review is created", () => {
  const review = new Review({
    userId: user.getId(),
    productId: product.getId() ?? "",
    reviewText: "This is a great product",
    stars: 5,
  });

  expect(review.getUserId()).toEqual(user.getId());
  expect(review.getProductId()).toEqual(product.getId());
  expect(review.getReviewText()).toEqual("This is a great product");
  expect(review.getStars()).toEqual(5);
});
