"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const user_1 = require("../model/user");
const address_db_1 = __importDefault(require("./address.db"));
const userContainer = (0, database_1.getContainer)("user");
const addressContainer = (0, database_1.getContainer)("address");
const mapToUser = async (data) => {
    let address;
    if (data.addressId) {
        address = await address_db_1.default.getAddressById(data.addressId);
    }
    return user_1.User.fromObject({
        id: data.id,
        name: data.name,
        phoneNumber: data.phoneNumber,
        emailAddress: data.emailAddress,
        password: data.password,
        address: address,
        seller: data.seller,
        newsLetter: data.newsLetter,
        role: data.role,
    });
};
const getAllUsers = async () => {
    try {
        const { resources: users } = await userContainer.items
            .query("SELECT * FROM c")
            .fetchAll();
        const usersWithAddress = await Promise.all(users.map(async (user) => {
            if (user.addressId) {
                const { resource: address } = await addressContainer.item(user.addressId).read();
                user.address = address;
            }
            return mapToUser(user);
        }));
        return usersWithAddress;
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};
const deleteUser = async (id) => {
    try {
        const { resource: user } = await userContainer.item(id, id).read();
        if (!user)
            return;
        await userContainer.item(id, id).delete();
        if (user.addressId) {
            await addressContainer.item(user.addressId, user.addressId).delete();
        }
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};
const getUserById = async ({ id }) => {
    try {
        const { resource: user } = await userContainer.item(id, id).read();
        if (user && user.addressId) {
            const { resource: address } = await address_db_1.default.getAddressById(user.addressId);
            user.address = address;
        }
        const mappedUser = await mapToUser(user);
        return mappedUser;
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};
const addUser = async (user) => {
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
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};
const getUserByEmail = async ({ emailAddress }) => {
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
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};
const getUserByPhoneNumber = async ({ phoneNumber }) => {
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
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};
const updateUser = async (user) => {
    console.log(user);
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
    }
    catch (error) {
        console.error(error);
        throw new Error("Database error. See server log for details.");
    }
};
exports.default = {
    getAllUsers,
    getUserByEmail,
    getUserById,
    addUser,
    getUserByPhoneNumber,
    updateUser,
    deleteUser,
};
