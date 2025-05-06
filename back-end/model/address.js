"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    constructor(address) {
        this.validate(address);
        this.id = address.id;
        this.street = address.street;
        this.houseNumber = address.houseNumber;
        this.city = address.city;
        this.state = address.state;
        this.postalCode = address.postalCode;
        this.country = address.country;
    }
    validate(address) {
        if (!address.street) {
            throw new Error('Street is required');
        }
        if (!address.houseNumber) {
            throw new Error('House number is required');
        }
        if (!address.city) {
            throw new Error('City is required');
        }
        if (!address.state) {
            throw new Error('State is required');
        }
        if (!address.postalCode) {
            throw new Error('Postal code is required');
        }
        if (!address.country) {
            throw new Error('Country is required');
        }
    }
    getId() {
        return this.id;
    }
    getStreet() {
        return this.street;
    }
    getHouseNumber() {
        return this.houseNumber;
    }
    getCity() {
        return this.city;
    }
    getState() {
        return this.state;
    }
    getPostalCode() {
        return this.postalCode;
    }
    getCountry() {
        return this.country;
    }
    equals(address) {
        return (this.getStreet() == address.getStreet()
            && this.getHouseNumber() == address.getHouseNumber()
            && this.getPostalCode() == address.getPostalCode()
            && this.getState() == address.getState()
            && this.getCity() == address.getCity()
            && this.getCountry() == address.getCountry());
    }
    toObject() {
        return {
            id: this.id,
            street: this.street,
            houseNumber: this.houseNumber,
            city: this.city,
            state: this.state,
            postalCode: this.postalCode,
            country: this.country,
        };
    }
    static fromObject(address) {
        return new Address(address);
    }
}
exports.Address = Address;
