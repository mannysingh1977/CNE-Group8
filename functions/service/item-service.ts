import { CosmosItemRepository } from "../repository/cosmos-item-repository";
import { Item, IItem } from "../domain/item";
import { CustomError } from "../domain/custom-error";

export class ItemService {
  private static instance: ItemService;
  private repository: CosmosItemRepository;

  private constructor() {
    this.repository = CosmosItemRepository.getInstance();
  }

  public static getInstance(): ItemService {
    if (!ItemService.instance) {
      ItemService.instance = new ItemService();
    }
    return ItemService.instance;
  }

  public async getItems(userId: string): Promise<Item[]> {
    return this.repository.getItems(userId);
  }

  public async getItemById(id: string, userId: string): Promise<Item> {
    return this.repository.getItemById(id, userId);
  }

  public async createItem(item: Partial<IItem>, userId: string): Promise<Item> {
    return this.repository.createItem(item, userId);
  }

  public async updateItem(
    id: string,
    updates: Partial<IItem>,
    userId: string
  ): Promise<Item> {
    return this.repository.updateItem(id, updates, userId);
  }

  public async deleteItem(id: string, userId: string): Promise<void> {
    return this.repository.deleteItem(id, userId);
  }

  public async toggleItemCompletion(id: string, userId: string): Promise<Item> {
    try {
      const item = await this.repository.getItemById(id, userId);
      return this.repository.updateItem(
        id,
        { completed: !item.completed },
        userId
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServerError("Failed to toggle item completion");
    }
  }
}
