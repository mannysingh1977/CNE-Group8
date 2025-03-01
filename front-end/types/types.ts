export type StatusMessage = {
    message: string;
    type: "error" | "success";
};

export type User = {
    id?: string;
    name?: string;
    phoneNumber?: string;
    emailAddress?: string;
    password?: string;
    address?: Address;
    seller?: boolean;
    newsLetter?: boolean;
    role?: Role;
    createdAt?: Date;
    lastLogin?: Date;
    bio?: string;
};

export type Address = {
    id?: string;
    street?: string;
    houseNumber?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
};

export type Role = 'User' | 'Admin' | 'Owner';