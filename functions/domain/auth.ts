import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { User } from "./user";
import { CustomError } from "./custom-error";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  seller?: boolean;
  newsLetter?: boolean;
}

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthService {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "your-development-secret-key";
  private static readonly TOKEN_EXPIRATION = "24h";

  public static generateToken(user: User): string {
    if (!this.JWT_SECRET) {
      throw CustomError.internalServerError("JWT secret is not configured");
    }

    const payload: TokenPayload = {
      id: user.getId() || "",
      email: user.getEmail(),
      name: user.getFullName(),
      role: user.getRole(),
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.TOKEN_EXPIRATION,
    });
  }

  public static verifyToken(token: string): TokenPayload {
    try {
      if (!this.JWT_SECRET) {
        throw CustomError.internalServerError("JWT secret is not configured");
      }

      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw CustomError.unauthorized("Invalid token");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw CustomError.unauthorized("Token expired");
      }
      throw error;
    }
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static validateRegistrationData(data: RegistrationData): void {
    if (!data.name) {
      throw CustomError.validation("Name is required");
    }
    if (!data.email) {
      throw CustomError.validation("Email is required");
    }
    if (!this.isValidEmail(data.email)) {
      throw CustomError.validation("Invalid email format");
    }
    if (!data.password) {
      throw CustomError.validation("Password is required");
    }
    if (data.password.length < 8) {
      throw CustomError.validation(
        "Password must be at least 8 characters long"
      );
    }
    if (!data.phoneNumber) {
      throw CustomError.validation("Phone number is required");
    }
    if (!data.address) {
      throw CustomError.validation("Address is required");
    }
    if (!data.address.street) {
      throw CustomError.validation("Street is required");
    }
    if (!data.address.city) {
      throw CustomError.validation("City is required");
    }
    if (!data.address.state) {
      throw CustomError.validation("State is required");
    }
    if (!data.address.zipCode) {
      throw CustomError.validation("Zip code is required");
    }
    if (!data.address.country) {
      throw CustomError.validation("Country is required");
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
