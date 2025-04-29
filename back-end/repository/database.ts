import { CosmosClient } from "@azure/cosmos";
import * as dotenv from "dotenv";

dotenv.config();

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_ID!;

if (!endpoint || !key) {
  throw new Error("Missing Cosmos DB endpoint or key in environment variables");
}

const client = new CosmosClient({
  endpoint,
  key,
});

const getContainer = (containerId: string) => {
  return client.database(databaseId).container(containerId);
};

export { getContainer };
