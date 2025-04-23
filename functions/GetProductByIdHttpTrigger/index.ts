import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { publicRouteWrapper } from "../helpers/function-wrapper";
import { ProductService } from "../service/product-service";
import { CustomError } from "../domain/custom-error";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await publicRouteWrapper(async () => {
    const id = context.bindingData.id;

    if (!id) {
      throw CustomError.validation("Product ID is required");
    }

    const product = await ProductService.getInstance().getProductById(id);

    context.res = {
      status: 200,
      body: product,
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
