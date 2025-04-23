import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { publicRouteWrapper } from "../helpers/function-wrapper";
import { AuthService, LoginCredentials } from "../domain/auth";
import { CustomError } from "../domain/custom-error";
import { CosmosUserRepository } from "../repository/cosmos-user-repository";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await publicRouteWrapper(async () => {
    const credentials: LoginCredentials = req.body;

    if (!credentials || !credentials.email || !credentials.password) {
      throw CustomError.validation("Email and password are required");
    }

    // Get the user by email
    const user = await CosmosUserRepository.getInstance().getUserByEmail(
      credentials.email
    );

    if (!user) {
      throw CustomError.unauthorized("Invalid credentials");
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(credentials.password);

    if (!isPasswordValid) {
      throw CustomError.unauthorized("Invalid credentials");
    }

    // Generate JWT token
    const token = AuthService.generateToken(user);

    context.res = {
      status: 200,
      body: {
        token,
        user: user.toJSON(),
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
  }, context);
};

export default httpTrigger;
