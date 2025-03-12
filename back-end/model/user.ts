import { ro } from 'date-fns/locale';
import { Role } from '../types';
import { Address } from './address';

export class User {
  private id?: string;
  private name: string;
  private phoneNumber: string;
  private emailAddress: string;
  private password: string;
  private address: Address;
  private seller: boolean;
  private newsLetter: boolean;
  private role: Role;

  constructor(user: {
    id?: string;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
    address: Address;
    seller: boolean;
    newsLetter: boolean;
    role: Role;
  }) {
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

  validate(user: {
    id?: string;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
    address: Address;
    seller: boolean;
    newsLetter: boolean;
    role: Role;
  }) {
    if (!user.name) {
      throw new Error('User name is required');
    }
    if (!user.phoneNumber) {
      throw new Error('User phone number is required');
    }
    if (!user.emailAddress) {
      throw new Error('User email address is required');
    }
    if (!user.password) {
      throw new Error('User password is required');
    }
    if (!user.address) {
      throw new Error('User address is required');
    }
    if (user.seller === undefined) {
      throw new Error('User seller flag is required');
    }
    if (user.newsLetter === undefined) {
      throw new Error('User newsLetter flag is required');
    }
    if (!user.role) {
      throw new Error('User role is required');
    }
  }

  getId(): string | undefined {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  getPhoneNumber(): string {
    return this.phoneNumber;
  }
  getEmailAddress(): string {
    return this.emailAddress;
  }
  getPassword(): string {
    return this.password;
  }
  getAddress(): Address {
    return this.address;
  }
  getSeller(): boolean {
    return this.seller;
  }
  getNewsLetter(): boolean {
    return this.newsLetter;
  }
  getRole(): Role {
    return this.role;
  }

  setRole(role: Role) {
    this.role = role;
  };

  setSeller(boolean: boolean) {
    this.seller = boolean;
  };

  toObject(): object {
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

  static fromObject(data: {
    id?: string;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    password: string;
    address: any;
    seller: boolean;
    newsLetter: boolean;
    role: Role | string;
  }): User {
    return new User({
      id: data.id,
      name: data.name,
      phoneNumber: data.phoneNumber,
      emailAddress: data.emailAddress,
      password: data.password,
      address: Address.fromObject(data.address),
      seller: data.seller,
      newsLetter: data.newsLetter,
      role: data.role as Role,
    });
  }
}
