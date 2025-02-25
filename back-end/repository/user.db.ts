import { Address } from '../model/address';
import { User } from '../model/user';
import { UserInput } from '../types';
import database from './database';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const UserPrisma = await database.user.findMany({
            include: { address: true },
        });
        return UserPrisma.map((UserPrisma) => User.from(UserPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const deleteUser = async (id: number) => {
    try {
        const userPrisma = await database.user.delete({
            where: { id },
            include: { address: true, ShoppingCart: true },
        });
        return userPrisma;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async ({ id }: { id: number }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
            include: { address: true },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const addUser = async (user: User): Promise<User> => {
    try {
        const UserPrisma = await database.user.create({
            data: {
                name: user.getName(),
                phoneNumber: user.getPhoneNumber(),
                emailAddress: user.getEmailAddress(),
                password: user.getPassword(),
                address: {
                    create: {
                        street: user.getAddress().getStreet(),
                        houseNumber: user.getAddress().getHouseNumber(),
                        city: user.getAddress().getCity(),
                        state: user.getAddress().getState(),
                        postalCode: user.getAddress().getPostalCode(),
                        country: user.getAddress().getCountry(),
                    },
                },
                seller: user.getSeller(),
                newsLetter: user.getNewsLetter(),
                role: user.getRole(),
            },
        });
        return User.from({
            ...UserPrisma,
            address: {
                id: UserPrisma.addressId,
                street: user.getAddress().getStreet(),
                houseNumber: user.getAddress().getHouseNumber(),
                city: user.getAddress().getCity(),
                state: user.getAddress().getState(),
                postalCode: user.getAddress().getPostalCode(),
                country: user.getAddress().getCountry(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByEmail = async ({ emailAddress }: { emailAddress: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { emailAddress },
            include: { address: true },
        });
        // console.log(userPrisma);
        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByPhoneNumber = async ({
    phoneNumber,
}: {
    phoneNumber: string;
}): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { phoneNumber },
            include: { address: true },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.update({
            where: { id: user.getId() },
            data: {
                name: user.getName(),
                phoneNumber: user.getPhoneNumber(),
                emailAddress: user.getEmailAddress(),
                password: user.getPassword(),
                seller: user.getSeller(),
                address: {
                    update: {
                        street: user.getAddress().getStreet(),
                        houseNumber: user.getAddress().getHouseNumber(),
                        city: user.getAddress().getCity(),
                        state: user.getAddress().getState(),
                        postalCode: user.getAddress().getPostalCode(),
                        country: user.getAddress().getCountry(),
                    },
                },
                newsLetter: user.getNewsLetter(),
                role: user.getRole(),
            },
        });

        return User.from({
            ...userPrisma,
            address: {
                id: userPrisma.addressId,
                street: user.getAddress().getStreet(),
                houseNumber: user.getAddress().getHouseNumber(),
                city: user.getAddress().getCity(),
                state: user.getAddress().getState(),
                postalCode: user.getAddress().getPostalCode(),
                country: user.getAddress().getCountry(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllUsers,
    getUserByEmail,
    getUserById,
    addUser,
    getUserByPhoneNumber,
    updateUser,
    deleteUser,
};
