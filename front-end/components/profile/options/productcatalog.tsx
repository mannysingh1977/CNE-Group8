import { getProductCatalog } from "@/services/productService";
import { Product } from "@/types/cartTypes";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function ProductCatalog() {
  const token = localStorage.getItem("token");
  const [productCatalog, setProductCatalog] = useState<any>();
  if (!token) {
    return <div>Unauthorized</div>;
  }
  const decodedToken = jwtDecode<{ userId: string }>(token);

  const loadProductCatalog = async () => {
    const productCatalog = await getProductCatalog(decodedToken.userId);
    if (productCatalog.ok) {
      const text = await productCatalog.text();
      if (text) {
        const responseJson = JSON.parse(text);
        setProductCatalog(responseJson);
        console.log("Product catalog:", responseJson);
      } else {
        setProductCatalog(null);
      }
    } else {
      console.error(
        "Failed to load product catalog:",
        productCatalog.statusText
      );
    }
  };

  useEffect(() => {
    loadProductCatalog();
  }, []);

  return (
    <div>
      {productCatalog ? (
        <div>
          <h1 className="mb-3">Product Catalog</h1>
          <ul className="flex flex-col gap-4">
            {productCatalog.products.map((product: Product) => (
              <li key={product.id} className="flex flex-row items-center bg-white rounded shadow-md">
                <img
                  src={product.media}
                  alt={product.name}
                  width="100"
                />
                <div className="flex flex-col ml-4 w-full h-full">
                  <p>Product Name: {product.name}</p>
                  <p>Price: ${product.price}</p>
                </div>
                <div className="flex flex-col ml-4 w-full h-full justify-start">
                  <p className="w-full min-h-full">
                    Description: {product.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
