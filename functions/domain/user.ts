import * as bcrypt from "bcryptjs";
import { Address, AddressDTO } from "./address";
import { Role } from "../types";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: string;
}

export class User implements IUser {
  public id: string;
  public name: string;
  public email: string;
  public password?: string;
  public createdAt: string;
  private firstName: string;
  private lastName: string;
  private address: Address;
  private role: Role;

  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    address: Address,
    role: Role
  ) {
    this.id = id;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.role = role;
    this.name = `${firstName} ${lastName}`;
    this.createdAt = new Date().toISOString();
  }

  public static fromDB(dbUser: any): User {
    const user = new User(
      dbUser.id,
      dbUser.email,
      dbUser.firstName,
      dbUser.lastName,
      Address.fromObject(dbUser.address),
      dbUser.role
    );
    user.password = dbUser.password;
    user.createdAt = dbUser.createdAt;
    return user;
  }

  public async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
  }

  public async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }

  public toJSON(): Omit<IUser, "password"> {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getAddress(): Address {
    return this.address;
  }

  getRole(): Role {
    return this.role;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setFirstName(firstName: string): void {
    this.firstName = firstName;
  }

  setLastName(lastName: string): void {
    this.lastName = lastName;
  }

  setAddress(address: Address): void {
    this.address = address;
  }

  setRole(role: Role): void {
    this.role = role;
  }

  toObject(): UserDTO {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address.toObject(),
      role: this.role,
    };
  }

  static fromObject(obj: UserDTO): User {
    return new User(
      obj.id,
      obj.email,
      obj.firstName,
      obj.lastName,
      Address.fromObject(obj.address),
      obj.role
    );
  }
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: AddressDTO;
  role: Role;
}
