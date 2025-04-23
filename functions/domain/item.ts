export interface IItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}

export class Item implements IItem {
  public id: string;
  public title: string;
  public description?: string;
  public completed: boolean;
  public createdAt: string;
  public updatedAt?: string;
  public userId: string;

  constructor(
    id: string,
    title: string,
    userId: string,
    completed: boolean = false,
    description?: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.createdAt = new Date().toISOString();
    this.userId = userId;
  }

  public static fromDB(dbItem: any): Item {
    const item = new Item(
      dbItem.id,
      dbItem.title,
      dbItem.userId,
      dbItem.completed,
      dbItem.description
    );
    item.createdAt = dbItem.createdAt;
    if (dbItem.updatedAt) {
      item.updatedAt = dbItem.updatedAt;
    }
    return item;
  }

  public update(updatedData: Partial<IItem>): void {
    if (updatedData.title) this.title = updatedData.title;
    if (updatedData.description !== undefined)
      this.description = updatedData.description;
    if (updatedData.completed !== undefined)
      this.completed = updatedData.completed;
    this.updatedAt = new Date().toISOString();
  }

  public toJSON(): IItem {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
    };
  }
}
