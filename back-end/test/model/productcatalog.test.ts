import { Product } from "../../model/product";
import { ProductCatalog } from "../../model/productcatalog";

test("given: valid shoppingcart info, when: creating shoppingcart, then: shoppingcart is made", () => {
  const productCatalog = new ProductCatalog({});
  expect(productCatalog.getProductIds().length).toEqual(0);
});

test("give: valid product, when: adding product to cart, then: product is added and returned", () => {
  const product = new Product({
    name: "Jbl headset",
    description: "iets",
    media: "path",
    stock: 40,
    price: 90,
    details: "something",
  });
  const productCatalog = new ProductCatalog({});
  const addedProduct = productCatalog.addProduct(product);

  expect(product).toEqual(addedProduct);
  expect(productCatalog.getProductIds().length).toBe(0);
});
