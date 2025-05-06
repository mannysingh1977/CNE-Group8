"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const addressContainer = (0, database_1.getContainer)('address');
const getAddressById = async (addressId) => {
    const { resource } = await addressContainer.item(addressId, addressId).read();
    return resource;
};
exports.default = { getAddressById };
