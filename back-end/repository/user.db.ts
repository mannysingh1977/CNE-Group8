import { Container } from "@azure/cosmos";
import { getContainer } from "./database";
import { User } from "../model/user";
import { Address } from "../model/address";
import { Role } from "../types";
import addressDb  from "./address.db"

const userContainer: Container = getContainer("user");
const addressContainer: Container = getContainer("address");

const mapToUser = async (data: any): Promise<User> => {
  let address;

  if (data.addressId) {
    address = await addressDb.getAddressById(data.addressId);
  }

  return User.fromObject({
    id: data.id,
    name: data.name,
    phoneNumber: data.phoneNumber,
    emailAddress: data.emailAddress,
    password: data.password,
    address: address,
    seller: data.seller,
    newsLetter: data.newsLetter,
    role: data.role as Role,
  });
};
const getAllUsers = async (): Promise<User[]> => {
  try {
    const { resources: users } = await userContainer.items
      .query("SELECT * FROM c")
      .fetchAll();

    const usersWithAddress = await Promise.all(
      users.map(async (user: any) => {
        if (user.addressId) {
          const { resource: address } = await addressContainer.item(user.addressId).read();
          user.address = address;
        }
        return mapToUser(user);
      })
    );
    return usersWithAddress;
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const deleteUser = async (id: string): Promise<void> => {
  try {

    const { resource: user } = await userContainer.item(id, id).read();
    if (!user) return;

    await userContainer.item(id, id).delete();

    if (user.addressId) {
      await addressContainer.item(user.addressId, user.addressId).delete();
    }
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getUserById = async ({ id }: { id: string }): Promise<User | null> => {
  try {
    const { resource: user } = await userContainer.item(id, ).read();
    if (user && user.addressId) {
      const { resource: address } = await addressDb.getAddressById(user.addressId);
      user.address = address;
    }
    const mappedUser = await mapToUser(user);
    return mappedUser
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const addUser = async (user: User): Promise<User> => {
  try {

    const addressData = {
      street: user.getAddress().getStreet(),
      houseNumber: user.getAddress().getHouseNumber(),
      city: user.getAddress().getCity(),
      state: user.getAddress().getState(),
      postalCode: user.getAddress().getPostalCode(),
      country: user.getAddress().getCountry(),
    };
    const { resource: createdAddress } = await addressContainer.items.create(addressData);
    if (!createdAddress) {
      throw new Error("Failed to create address");
    }


    const userDocument = {
      id: user.getId(),
      name: user.getName(),
      phoneNumber: user.getPhoneNumber(),
      emailAddress: user.getEmailAddress(),
      password: user.getPassword(),
      addressId: createdAddress.id,
      seller: user.getSeller(),
      newsLetter: user.getNewsLetter(),
      role: user.getRole(),
    };
    const { resource: createdUser } = await userContainer.items.create(userDocument);


    if (!createdUser) {
      throw new Error("Failed to create user");
    }
    return mapToUser(createdUser);
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getUserByEmail = async ({ emailAddress }: { emailAddress: string }): Promise<User | null> => {
  try {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.emailAddress = @emailAddress",
      parameters: [{ name: "@emailAddress", value: emailAddress }],
    };

    const { resources: users } = await userContainer.items.query(querySpec).fetchAll();
    if (users.length > 0) {
      const user = users[0];
      if (user.addressId) {
        const { resource: address } = await addressContainer.item(user.addressId).read();
        user.address = address;
      }
      return mapToUser(user);
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const getUserByPhoneNumber = async ({ phoneNumber }: { phoneNumber: string }): Promise<User | null> => {
  try {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.phoneNumber = @phoneNumber",
      parameters: [{ name: "@phoneNumber", value: phoneNumber }],
    };

    const { resources: users } = await userContainer.items.query(querySpec).fetchAll();
    if (users.length > 0) {
      const user = users[0];
      if (user.addressId) {
        const { resource: address } = await addressContainer.item(user.addressId).read();
        user.address = address;
      }
      return mapToUser(user);
    }
    return null;
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

const updateUser = async (user: User): Promise<User> => {
  console.log(user)
  try {

    const addressId = user.getAddress().getId();
    if (!addressId) {
      throw new Error("Address ID is undefined");
    }

    const userDocument = {
      id: user.getId(),
      name: user.getName(),
      phoneNumber: user.getPhoneNumber(),
      emailAddress: user.getEmailAddress(),
      password: user.getPassword(),
      addressId: addressId,
      seller: user.getSeller(),
      newsLetter: user.getNewsLetter(),
      role: user.getRole(),
    };
    const userId = user.getId();
    if (!userId) {
      throw new Error("User ID is undefined");
    }
    const { resource: updatedUser } = await userContainer.item(userId, userId).replace(userDocument);


    if (!updatedUser) {
      throw new Error("Failed to update user");
    }
    return mapToUser(updatedUser);
  } catch (error) {
    console.error(error);
    throw new Error("Database error. See server log for details.");
  }
};

export default {
  getAllUsers,
  getUserByEmail,
  getUserById,
  addUser,
  getUserByPhoneNumber,
  updateUser,
  deleteUser,
};
