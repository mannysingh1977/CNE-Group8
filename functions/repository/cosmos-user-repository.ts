import { CosmosClient, Container, Database } from "@azure/cosmos";
import { User, UserDTO } from "../domain/user";
import { CustomError } from "../domain/custom-error";
import { v4 as uuidv4 } from "uuid";
import { Role } from "../types";
import { Address } from "../domain/address";
import { AuthService, RegistrationData } from "../domain/auth";

export class CosmosUserRepository {
  private static instance: CosmosUserRepository;
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  private constructor() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT || "";
    const key = process.env.COSMOS_DB_KEY || "";
    const databaseName = process.env.COSMOS_DB_DATABASE_NAME || "";
    const containerName = process.env.USER_CONTAINER_NAME || "users";

    if (!endpoint || !key || !databaseName) {
      throw CustomError.internalServerError("Missing Cosmos DB configuration");
    }

    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(databaseName);
    this.container = this.database.container(containerName);
  }

  public static getInstance(): CosmosUserRepository {
    if (!CosmosUserRepository.instance) {
      CosmosUserRepository.instance = new CosmosUserRepository();
    }
    return CosmosUserRepository.instance;
  }

  public async getUserById(id: string): Promise<User> {
    try {
      const { resource } = await this.container.item(id, id).read();

      if (!resource) {
        throw CustomError.notFound(`User with id ${id} not found`);
      }

      return User.fromObject(resource as UserDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error getting user by ID:", error);
      throw CustomError.internalServerError("Failed to retrieve user");
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [
          {
            name: "@email",
            value: email,
          },
        ],
      };

      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();

      if (resources.length === 0) {
        return null;
      }

      return User.fromObject(resources[0] as UserDTO);
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw CustomError.internalServerError("Failed to retrieve user");
    }
  }

  public async createUser(registrationData: RegistrationData): Promise<User> {
    try {
      // First check if email already exists
      const existingUser = await this.getUserByEmail(registrationData.email);

      if (existingUser) {
        throw CustomError.conflict("A user with this email already exists");
      }

      // Hash the password
      const hashedPassword = await AuthService.hashPassword(
        registrationData.password
      );

      // Extract first and last name
      const nameParts = registrationData.name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      // Create the address
      const address = new Address(
        registrationData.address.street,
        registrationData.address.city,
        registrationData.address.state,
        registrationData.address.zipCode,
        registrationData.address.country
      );

      // Create the user
      const user = new User(
        uuidv4(),
        registrationData.email,
        firstName,
        lastName,
        address,
        registrationData.seller ? Role.Seller : Role.Customer
      );

      // Set password
      await user.setPassword(registrationData.password);

      // Save to database
      const { resource } = await this.container.items.create(user.toObject());

      if (!resource) {
        throw CustomError.internalServerError("Failed to create user");
      }

      return User.fromObject(resource as UserDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error creating user:", error);
      throw CustomError.internalServerError("Failed to create user");
    }
  }

  public async updateUser(
    userId: string,
    updates: Partial<{ firstName: string; lastName: string; address: Address }>
  ): Promise<User> {
    try {
      // First get the existing user
      const user = await this.getUserById(userId);

      // Update user properties
      if (updates.firstName) user.setFirstName(updates.firstName);
      if (updates.lastName) user.setLastName(updates.lastName);
      if (updates.address) user.setAddress(updates.address);
      // Don't allow email change for now - would require verification

      // Update the user in the database
      const { resource } = await this.container
        .item(userId, userId)
        .replace(user.toObject());

      if (!resource) {
        throw CustomError.internalServerError("Failed to update user");
      }

      return User.fromObject(resource as UserDTO);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error updating user:", error);
      throw CustomError.internalServerError("Failed to update user");
    }
  }
}
