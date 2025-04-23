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
    //     throw CustomError.forbidden("Only sellers can update products");
    // }

    const id = context.bindingData.id;
    const updates = req.body;

    if (!id) {
      throw CustomError.validation("Product ID is required");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw CustomError.validation("Update data is required");
    }

    const updatedProduct = await ProductService.getInstance().updateProduct(
      id,
      updates
    );

    context.res = {
      status: 200,
      body: updatedProduct,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
