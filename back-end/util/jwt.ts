import jwt from 'jsonwebtoken';
import { Role } from '../types';

const generateJwtToken = (username: string, role: Role, userId: string): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const options = { expiresIn: `${process.env.JWT_EXPIRES_HOURS}h`, issuer: 'Bazaar_app' };

    try {
        return jwt.sign({ username, role, userId }, secret, options);
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT token, see server log for details.');
    }
};

export { generateJwtToken };
