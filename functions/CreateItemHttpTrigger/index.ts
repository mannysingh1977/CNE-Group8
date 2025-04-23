import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { ItemService } from "../service/item-service";
import { CustomError } from "../domain/custom-error";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async (user) => {
    const itemData = req.body;

    if (!itemData || !itemData.title) {
      throw CustomError.validation("Title is required");
    }

    const newItem = await ItemService.getInstance().createItem(
      itemData,
      user.id
    );

    context.res = {
      status: 201,
      body: newItem,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
