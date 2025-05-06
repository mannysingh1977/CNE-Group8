"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const address_1 = require("./address");
class User {
    constructor(user) {
        this.validate(user);
        this.id = user.id;
        this.name = user.name;
        this.phoneNumber = user.phoneNumber;
        this.emailAddress = user.emailAddress;
        this.password = user.password;
        this.address = user.address;
        this.seller = user.seller;
        this.newsLetter = user.newsLetter;
        this.role = user.role;
    }
    validate(user) {
        if (!user.name) {
            throw new Error("User name is required");
        }
        if (!user.phoneNumber) {
            throw new Error("User phone number is required");
        }
        if (!user.emailAddress) {
            throw new Error("User email address is required");
        }
        if (!user.password) {
            throw new Error("User password is required");
        }
        if (!user.address) {
            throw new Error("User address is required");
        }
        if (user.seller === undefined) {
            throw new Error("User seller flag is required");
        }
        if (user.newsLetter === undefined) {
            throw new Error("User newsLetter flag is required");
        }
        if (!user.role) {
            throw new Error("User role is required");
        }
    }
    getId() {
        if (!this.id) {
            throw new Error("User ID is not defined");
        }
        return this.id;
    }
    getName() {
        return this.name;
    }
    getPhoneNumber() {
        return this.phoneNumber;
    }
    getEmailAddress() {
        return this.emailAddress;
    }
    getPassword() {
        return this.password;
    }
    getAddress() {
        return this.address;
    }
    getSeller() {
        return this.seller;
    }
    getNewsLetter() {
        return this.newsLetter;
    }
    getRole() {
        return this.role;
    }
    setRole(role) {
        this.role = role;
    }
    setSeller(boolean) {
        this.seller = boolean;
    }
    equals(other) {
        return this.id === other.getId();
    }
    toObject() {
        return {
            id: this.id,
            name: this.name,
            phoneNumber: this.phoneNumber,
            emailAddress: this.emailAddress,
            password: this.password,
            address: this.address.toObject(),
            seller: this.seller,
            newsLetter: this.newsLetter,
            role: this.role,
        };
    }
    static fromObject(data) {
        return new User({
            id: data.id,
            name: data.name,
            phoneNumber: data.phoneNumber,
            emailAddress: data.emailAddress,
            password: data.password,
            address: address_1.Address.fromObject(data.address),
            seller: data.seller,
            newsLetter: data.newsLetter,
            role: data.role,
        });
    }
}
exports.User = User;
