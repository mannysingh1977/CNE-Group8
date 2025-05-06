"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("../model/address");
const user_1 = require("../model/user");
const user_db_1 = __importDefault(require("../repository/user.db"));
const jwt_1 = require("../util/jwt");
const bcrypt = __importStar(require("bcrypt"));
const jwt_decode_1 = require("jwt-decode");
const getAllUsers = async () => {
    return [...(await user_db_1.default.getAllUsers())];
};
const getUserById = async (id) => {
    const user = await user_db_1.default.getUserById({ id });
    if (user) {
        return user;
    }
    throw new Error(`User with id ${id} not found`);
};
const getUserByEmail = async (emailAddress) => {
    const user = await user_db_1.default.getUserByEmail({ emailAddress });
    if (user) {
        return user;
    }
};
const getUserByPhoneNumber = async (phoneNumber) => {
    const user = await user_db_1.default.getUserByPhoneNumber({ phoneNumber });
    if (user) {
        return user;
    }
};
const validateUser = async ({ name, phoneNumber, emailAddress, password, address, seller, newsLetter, role, }) => {
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
    const { street, houseNumber, city, state, postalCode, country } = address;
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
    const addressInstance = new address_1.Address({
        street,
        houseNumber,
        city,
        state,
        postalCode,
        country,
    });
    const user = new user_1.User({
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
const addUser = async ({ name, phoneNumber, emailAddress, password, address, seller, newsLetter, role, }) => {
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
    const userInput = new user_1.User({
        name: user.getName(),
        phoneNumber: user.getPhoneNumber(),
        emailAddress: user.getEmailAddress(),
        password: hashedPassword,
        address: user.getAddress(),
        seller: user.getSeller(),
        newsLetter: user.getNewsLetter(),
        role: user.getRole(),
    });
    return await user_db_1.default.addUser(userInput);
};
const authenticate = async ({ emailAddress, password, }) => {
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
    const role = user.getRole();
    const userId = user.getId();
    return {
        message: "Authentication Successful",
        token: (0, jwt_1.generateJwtToken)(email, role, userId),
        userId: userId,
        email: user.getEmailAddress(),
        fullname: `${user.getName()}`,
        role: user.getRole(),
    };
};
const updateUserRole = async (id, role) => {
    const user = await getUserById(id);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    user.setRole(role);
    await user_db_1.default.updateUser(user);
    return user;
};
const grantSellerStatus = async (id, token) => {
    const user = await getUserById(id);
    const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
        return user;
    }
    user.setSeller(true);
    return await user_db_1.default.updateUser(user);
};
const revokeSellerStatus = async (id, token) => {
    const user = await getUserById(id);
    if (!token || token.split(".").length !== 3) {
        throw new Error("Invalid token format");
    }
    const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
    if (!user) {
        throw new Error(`User with id ${id} not found`);
    }
    if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
        return user;
    }
    user.setSeller(false);
    return await user_db_1.default.updateUser(user);
};
const deleteUser = async (userId, token) => {
    if (!token || token.split(".").length !== 3) {
        throw new Error("Invalid token format");
    }
    const decodedToken = (0, jwt_decode_1.jwtDecode)(token);
    if (decodedToken.role !== "Admin" && decodedToken.role !== "Owner") {
        throw new Error("Wrong role!");
    }
    await user_db_1.default.deleteUser(userId);
    return null;
};
exports.default = {
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
