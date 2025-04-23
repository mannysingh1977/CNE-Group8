import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { CartService } from "../service/cart-service";
import { CustomError } from "../domain/custom-error";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async (user) => {
    const productId = context.bindingData.productId;
    const quantity = parseInt(req.body?.quantity || "0", 10);

    if (!productId) {
      throw CustomError.validation("Product ID is required");
    }

    if (isNaN(quantity)) {
      throw CustomError.validation("Quantity must be a valid number");
    }

    const updatedCart = await CartService.getInstance().updateItemQuantity(
      user.id,
      productId,
      quantity
    );

    context.res = {
      status: 200,
      body: updatedCart,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
