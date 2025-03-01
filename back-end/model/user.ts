import { Role } from '../types';
import { Address } from './address';
import { User as UserPrisma, Address as AddressPrisma } from '@prisma/client';

export class User {
    private id?: string | undefined;
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
            throw new Error('User seller is required');
        }
        if (user.newsLetter === undefined) {
            throw new Error('User newsLetter is required');
        }
        if (!user.role) {
            throw new Error('User role is required');
        }
    }
    /*
    //setters
    setName = (name: string) => {
        this.name = name;
    };

    setPhoneNumber = (phoneNumber: string) => {
        this.phoneNumber = phoneNumber;
    };

    setEmailAddress = (emailAddress: string) => {
        this.emailAddress = emailAddress;
    };

    setPassword = (password: string) => {
        this.password = password;
    };

    setAddress = (address: string) => {
        this.address = address;
    };


    setNewsLetter = (newsLetter: boolean) => {
        this.newsLetter = newsLetter;
        };


        */

    setSeller = (seller: boolean) => {
        this.seller = seller;
    };
    setRole = (role: Role) => {
        this.role = role;
    };

    //getters
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

    equals(user: User): boolean {
        return (
            this.id == user.id &&
            this.name == user.name &&
            this.phoneNumber == user.phoneNumber &&
            this.emailAddress == user.emailAddress &&
            this.password == user.password &&
            this.address == user.address &&
            this.seller == user.seller &&
            this.newsLetter == user.newsLetter &&
            this.role == user.role
        );
    }

    static from({
        id,
        name,
        phoneNumber,
        emailAddress,
        password,
        address,
        seller,
        newsLetter,
        role,
    }: UserPrisma & { address: AddressPrisma }) {
        return new User({
            id,
            name,
            phoneNumber,
            emailAddress,
            password,
            address: Address.from(address),
            seller,
            newsLetter,
            role: role as Role,
        });
    }
}
