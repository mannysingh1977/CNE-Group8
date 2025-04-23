import { CosmosClient, Container, Database } from "@azure/cosmos";
import { Item, IItem } from "../domain/item";
import { CustomError } from "../domain/custom-error";
import { v4 as uuidv4 } from "uuid";

export class CosmosItemRepository {
  private static instance: CosmosItemRepository;
  private client: CosmosClient;
  private database: Database;
  private container: Container;

  private constructor() {
    const endpoint = process.env.COSMOS_DB_ENDPOINT || "";
    const key = process.env.COSMOS_DB_KEY || "";
    const databaseName = process.env.COSMOS_DB_DATABASE_NAME || "";
    const containerName = process.env.COSMOS_DB_CONTAINER_NAME || "";

    if (!endpoint || !key || !databaseName || !containerName) {
      throw CustomError.internalServerError("Missing Cosmos DB configuration");
    }

    this.client = new CosmosClient({ endpoint, key });
    this.database = this.client.database(databaseName);
    this.container = this.database.container(containerName);
  }

  public static getInstance(): CosmosItemRepository {
    if (!CosmosItemRepository.instance) {
      CosmosItemRepository.instance = new CosmosItemRepository();
    }
    return CosmosItemRepository.instance;
  }

  public async getItems(userId: string): Promise<Item[]> {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [
          {
            name: "@userId",
            value: userId,
          },
        ],
      };

      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      return resources.map((item) => Item.fromDB(item));
    } catch (error) {
      console.error("Error getting items:", error);
      throw CustomError.internalServerError("Failed to retrieve items");
    }
  }

  public async getItemById(id: string, userId: string): Promise<Item> {
    try {
      const querySpec = {
        query: "SELECT * FROM c WHERE c.id = @id AND c.userId = @userId",
        parameters: [
          {
            name: "@id",
            value: id,
          },
          {
            name: "@userId",
            value: userId,
          },
        ],
      };

      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();

      if (resources.length === 0) {
        throw CustomError.notFound(`Item with id ${id} not found`);
      }

      return Item.fromDB(resources[0]);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error getting item by ID:", error);
      throw CustomError.internalServerError("Failed to retrieve item");
    }
  }

  public async createItem(item: Partial<IItem>, userId: string): Promise<Item> {
    try {
      if (!item.title) {
        throw CustomError.validation("Title is required");
      }

      const newItem = new Item(
        uuidv4(),
        item.title,
        userId,
        item.completed || false,
        item.description
      );

      const { resource } = await this.container.items.create(newItem);
      return Item.fromDB(resource);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error creating item:", error);
      throw CustomError.internalServerError("Failed to create item");
    }
  }

  public async updateItem(
    id: string,
    updates: Partial<IItem>,
    userId: string
  ): Promise<Item> {
    try {
      const item = await this.getItemById(id, userId);

      item.update(updates);

      const { resource } = await this.container.item(id, userId).replace(item);
      return Item.fromDB(resource);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error updating item:", error);
      throw CustomError.internalServerError("Failed to update item");
    }
  }

  public async deleteItem(id: string, userId: string): Promise<void> {
    try {
      await this.getItemById(id, userId); // Check if item exists and belongs to user
      await this.container.item(id, userId).delete();
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error deleting item:", error);
      throw CustomError.internalServerError("Failed to delete item");
    }
  }
}
