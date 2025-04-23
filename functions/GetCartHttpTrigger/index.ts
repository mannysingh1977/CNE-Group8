import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { CartService } from "../service/cart-service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async (user) => {
    const cart = await CartService.getInstance().getCart(user.id);

    context.res = {
      status: 200,
      body: cart,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
