import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { authenticatedRouteWrapper } from "../helpers/function-wrapper";
import { CustomError } from "../domain/custom-error";
import { CosmosUserRepository } from "../repository/cosmos-user-repository";
import { Address } from "../domain/address";
import { User } from "../domain/user";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  await authenticatedRouteWrapper(async (authenticatedUser) => {
    // First retrieve the full user object from the database using the authenticated user's ID
    const userRepository = CosmosUserRepository.getInstance();
    const user = await userRepository.getUserById(authenticatedUser.id);

    if (req.method === "GET") {
      // Simply return the current user profile
      context.res = {
        status: 200,
        body: user.toJSON(),
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else if (req.method === "PUT") {
      // Update user profile
      const updates = req.body;

      if (!updates) {
        throw CustomError.validation("Update data is required");
      }

      // Create updates object with only valid fields
      const profileUpdates: {
        firstName?: string;
        lastName?: string;
        address?: Address;
      } = {};

      if (updates.firstName) {
        profileUpdates.firstName = updates.firstName;
      }

      if (updates.lastName) {
        profileUpdates.lastName = updates.lastName;
      }

      if (updates.address) {
        // Create new address object
        profileUpdates.address = new Address(
          updates.address.street,
          updates.address.number,
          updates.address.city,
          updates.address.zipCode,
          updates.address.country
        );
      }

      // Update the user
      const updatedUser = await userRepository.updateUser(
        user.getId(),
        profileUpdates
      );

      context.res = {
        status: 200,
        body: updatedUser.toJSON(),
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      // Method not allowed error
      context.res = {
        status: 405,
        body: {
          error: `Method ${req.method} not allowed for this endpoint`,
        },
        headers: {
          "Content-Type": "application/json",
          Allow: "GET, PUT",
        },
      };
    }
  }, context);
};

export default httpTrigger;
