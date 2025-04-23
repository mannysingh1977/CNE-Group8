import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { publicRouteWrapper } from "../helpers/function-wrapper";
import { ProductService } from "../service/product-service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await publicRouteWrapper(async () => {
    const searchQuery = req.query.q || "";
    let products;

    if (searchQuery) {
      products = await ProductService.getInstance().searchProducts(searchQuery);
    } else {
      products = await ProductService.getInstance().getAllProducts();
    }

    context.res = {
      status: 200,
      body: products,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
