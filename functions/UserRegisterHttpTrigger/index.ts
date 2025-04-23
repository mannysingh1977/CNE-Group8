import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { publicRouteWrapper } from "../helpers/function-wrapper";
import { AuthService, RegistrationData } from "../domain/auth";
import { CustomError } from "../domain/custom-error";
import { CosmosUserRepository } from "../repository/cosmos-user-repository";
import { MockCosmosUserRepository } from "../repository/mock-cosmos-repository";

// Determine which repository to use based on environment
const isLocalDevelopment =
  !process.env.COSMOS_DB_ENDPOINT ||
  process.env.COSMOS_DB_ENDPOINT === "https://localhost:8081";
const userRepository = isLocalDevelopment
  ? MockCosmosUserRepository.getInstance()
  : CosmosUserRepository.getInstance();

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await publicRouteWrapper(async () => {
    const registrationData: RegistrationData = req.body;

    // Validate registration data
    try {
      AuthService.validateRegistrationData(registrationData);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.validation("Invalid registration data");
    }

    // Create the user using the appropriate repository
    const user = await userRepository.createUser(registrationData);

    // Generate JWT token
    const token = AuthService.generateToken(user);

    context.res = {
      status: 201,
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
