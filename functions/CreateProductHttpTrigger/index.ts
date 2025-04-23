import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { ProductService } from "../service/product-service";
import { CustomError } from "../domain/custom-error";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async (user) => {
    // For seller functionality - you could check if user is a seller
    // if (!user.isSeller) {
    //     throw CustomError.forbidden("Only sellers can create products");
    // }

    const productData = req.body;

    if (!productData) {
      throw CustomError.validation("Product data is required");
    }

    const newProduct = await ProductService.getInstance().createProduct(
      productData
    );

    context.res = {
      status: 201,
      body: newProduct,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
