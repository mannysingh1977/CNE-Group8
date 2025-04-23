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
    //     throw CustomError.forbidden("Only sellers can delete products");
    // }

    const id = context.bindingData.id;

    if (!id) {
      throw CustomError.validation("Product ID is required");
    }

    await ProductService.getInstance().deleteProduct(id);

    context.res = {
      status: 204, // No content
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
