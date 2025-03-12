import { Container } from "@azure/cosmos";
import { getContainer } from "./database";

const addressContainer = getContainer('address')

const getAddressById = async (addressId: string) => {
  const { resource } = await addressContainer.item(addressId, addressId).read();
  return resource;
};

export default { getAddressById };
