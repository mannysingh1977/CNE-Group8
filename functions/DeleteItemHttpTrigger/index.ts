import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { ItemService } from "../service/item-service";
import { CustomError } from "../domain/custom-error";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async (user) => {
    const id = context.bindingData.id;

    if (!id) {
      throw CustomError.validation("Item ID is required");
    }

    await ItemService.getInstance().deleteItem(id, user.id);

    context.res = {
      status: 204, // No content
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
