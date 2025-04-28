import { UnauthorizedError } from "express-jwt";
import { Address } from "../model/address";
import { User } from "../model/user";
import userDb from "../repository/user.db";
import {
  AuthenticationResponse,
  UserInput,
  AddressInput,
  Role,
} from "../types";
import { generateJwtToken } from "../util/jwt";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  role: string;
}

const getAllUsers = async (): Promise<User[]> => {
  return [...(await userDb.getAllUsers())];
};

const getUserById = async (id: string): Promise<User | undefined> => {
  const user = await userDb.getUserById({ id });
  if (user) {
    return user;
  }
  throw new Error(`User with id ${id} not found`);
};

const getUserByEmail = async (
  emailAddress: string
): Promise<User | undefined> => {
  const user = await userDb.getUserByEmail({ emailAddress });
  if (user) {
    return user;
  }
};

const getUserByPhoneNumber = async (
  phoneNumber: string
): Promise<User | undefined> => {
  const user = await userDb.getUserByPhoneNumber({ phoneNumber });
  if (user) {
    return user;
  }
};

const validateUser = async ({
  name,
  phoneNumber,
  emailAddress,
  password,
  address,
  seller,
  newsLetter,
  role,
}: UserInput): Promise<User> => {
  if (!name) {
    throw new Error("Name is missing");
  }
  if (!phoneNumber) {
    throw new Error("Phone number is missing");
  }
  if (!emailAddress) {
    throw new Error("Email address is missing");
  }
  if (!password) {
    throw new Error("Password is missing");
  }
  if (seller === undefined) {
    throw new Error("Seller status is missing");
  }
  if (newsLetter === undefined) {
    throw new Error("Newsletter status is missing");
  }
  if (!role) {
    throw new Error("Role is missing");
  }

  const { street, houseNumber, city, state, postalCode, country } =
    address as AddressInput;

  if (!street) {
    throw new Error("Address street is missing");
  }
  if (!houseNumber) {
    throw new Error("Address house number is missing");
  }
  if (!city) {
    throw new Error("Address city is missing");
  }
  if (!state) {
    throw new Error("Address state is missing");
  }
  if (!postalCode) {
    throw new Error("Address postal code is missing");
  }
  if (!country) {
    throw new Error("Address country is missing");
  }

  const existingEmail = await getUserByEmail(emailAddress);
  const existingPhoneNumber = await getUserByPhoneNumber(phoneNumber);

  if (existingEmail || existingPhoneNumber) {
    throw new Error("User already exists");
  }
  const addressInstance = new Address({
    street,
    houseNumber,
    city,
    state,
    postalCode,
    country,
  });

  const user = new User({
    name,
    phoneNumber,
    emailAddress,
    password: password,
    address: addressInstance,
    seller,
    newsLetter,
    role,
  });

  return user;
};

const addUser = async ({
  name,
  phoneNumber,
  emailAddress,
  password,
  address,
  seller,
  newsLetter,
  role,
}: UserInput): Promise<User> => {
  const validateUserInput = await validateUser({
    name,
    phoneNumber,
    emailAddress,
    password,
    address,
    seller,
    newsLetter,
    role,
  });
  const user = validateUserInput;

  let hashedPassword = await bcrypt.hash(validateUserInput.getPassword(), 12);

  const userInput = new User({
    name: user.getName(),
    phoneNumber: user.getPhoneNumber(),
    emailAddress: user.getEmailAddress(),
    password: hashedPassword,
    address: user.getAddress(),
    seller: user.getSeller(),
    newsLetter: user.getNewsLetter(),
    role: user.getRole(),
  });

  return await userDb.addUser(userInput);
};

const authenticate = async ({
  emailAddress,
  password,
}: UserInput): Promise<{
  message: string;
  token: string;
  userId: string;
  email: string;
  fullname: string;
  role: Role;
}> => {
  if (!emailAddress) {
    throw new Error("Email is missing");
  }
  if (!password) {
    throw new Error("Password is missing");
  }

  const user = await getUserByEmail(emailAddress);

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(password, user.getPassword());

  if (!isValidPassword) {
    throw new Error("Incorrect password.");
  }
  const email = user.getName();
  const role: Role = user.getRole();
  const userId: string = user.getId() as string;

  return {
    message: "Authentication Successful",
    token: generateJwtToken(email, role, userId),
    userId: userId,
    email: user.getEmailAddress(),
    fullname: `${user.getName()}`,
    role: user.getRole(),
  };
};

const updateUserRole = async (id: string, role: Role): Promise<User> => {
  const user = await getUserById(id);
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }

  user.setRole(role);
  await userDb.updateUser(user);

  return user;
};

const grantSellerStatus = async (id: string, token: string): Promise<User> => {
  const user = await getUserById(id);
  const decodedToken = jwtDecode<CustomJwtPayload>(token);
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }
  if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
    return user;
  }
  user.setSeller(true);
  return await userDb.updateUser(user);
};

const revokeSellerStatus = async (id: string, token: string): Promise<User> => {
  const user = await getUserById(id);

  if (!token || token.split(".").length !== 3) {
    throw new Error("Invalid token format");
  }

  const decodedToken = jwtDecode<CustomJwtPayload>(token);
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }
  if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
    return user;
  }
  user.setSeller(false);
  return await userDb.updateUser(user);
};

const deleteUser = async (
  userId: string,
  token: string
): Promise<User | null> => {
  if (!token || token.split(".").length !== 3) {
    throw new Error("Invalid token format");
  }

  const decodedToken = jwtDecode<CustomJwtPayload>(token);

  if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
    throw new Error("Wrong role!");
  }
  await userDb.deleteUser(userId);
  return null;
};

export default {
  getAllUsers,
  getUserById,
  addUser,
  getUserByEmail,
  authenticate,
  updateUserRole,
  grantSellerStatus,
  revokeSellerStatus,
  deleteUser,
};
