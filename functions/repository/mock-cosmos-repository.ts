import { User } from "../domain/user";
import { v4 as uuidv4 } from "uuid";
import { CustomError } from "../domain/custom-error";
import { RegistrationData } from "../domain/auth";
import { Address } from "../domain/address";
import { AuthService } from "../domain/auth";
import { Role } from "../types";

// In-memory storage for mock data
const usersStore: { [id: string]: User } = {};
const userEmailIndex: { [email: string]: string } = {}; // Maps email to user ID

export class MockCosmosUserRepository {
  private static instance: MockCosmosUserRepository;

  private constructor() {}

  public static getInstance(): MockCosmosUserRepository {
    if (!MockCosmosUserRepository.instance) {
      MockCosmosUserRepository.instance = new MockCosmosUserRepository();
    }
    return MockCosmosUserRepository.instance;
  }

  public async getUserById(id: string): Promise<User | null> {
    const user = usersStore[id];
    return user || null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const userId = userEmailIndex[email.toLowerCase()];
    if (!userId) {
      return null;
    }
    return usersStore[userId];
  }

  public async createUser(userData: RegistrationData): Promise<User> {
    // Check if email already exists
    const existingUser = await this.getUserByEmail(userData.email);
    if (existingUser) {
      throw CustomError.conflict("Email already exists");
    }

    // Create user with a new UUID
    const userId = uuidv4();

    // Create address
    const address = new Address(
      userData.address.street,
      userData.address.state, // Using state as the number field
      userData.address.city,
      userData.address.zipCode,
      userData.address.country
    );

    // Create user with proper constructor
    const user = new User(
      userId,
      userData.email,
      userData.name.split(" ")[0], // First name
      userData.name.split(" ").slice(1).join(" "), // Last name
      address,
      userData.seller ? Role.Seller : Role.Customer // Role based on seller flag
    );

    // Set password separately (async)
    await user.setPassword(userData.password);

    // Store in our mock database
    usersStore[userId] = user;
    userEmailIndex[userData.email.toLowerCase()] = userId;

    return user;
  }

  public async updateUser(user: User): Promise<User> {
    const userId = user.getId();
    if (!userId || !usersStore[userId]) {
      throw CustomError.notFound("User not found");
    }

    // Update email index if email changed
    const oldEmail = usersStore[userId].getEmail().toLowerCase();
    const newEmail = user.getEmail().toLowerCase();

    if (oldEmail !== newEmail) {
      // Check if new email already exists for another user
      const existingUserWithEmail = userEmailIndex[newEmail];
      if (existingUserWithEmail && existingUserWithEmail !== userId) {
        throw CustomError.conflict("Email already exists");
      }

      // Update email index
      delete userEmailIndex[oldEmail];
      userEmailIndex[newEmail] = userId;
    }

    // Store updated user
    usersStore[userId] = user;
    return user;
  }
}
