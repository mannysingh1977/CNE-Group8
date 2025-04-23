import { Context } from "@azure/functions";
import * as jwt from "jsonwebtoken";
import { CustomError } from "../domain/custom-error";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Wrapper for public routes
 * @param handler Function to be executed
 * @param context Azure Function context
 */
export async function publicRouteWrapper(
  handler: () => Promise<void>,
  context: Context
): Promise<void> {
  try {
    await handler();
  } catch (error) {
    handleError(error, context);
  }
}

/**
 * Wrapper for authenticated routes
 * @param handler Function to be executed if authentication is successful
 * @param context Azure Function context
 */
export async function authenticatedRouteWrapper(
  handler: (user: AuthenticatedUser) => Promise<void>,
  context: Context
): Promise<void> {
  try {
    // Extract the Authorization header
    const authHeader = context.req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw CustomError.unauthorized("Authentication token is required");
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw CustomError.unauthorized("Authentication token is required");
    }

    // Verify the token
    const secret = process.env.JWT_SECRET || "your-development-secret-key";

    try {
      // Parse the user from the token
      const user = jwt.verify(token, secret) as AuthenticatedUser;

      // Call the handler with the authenticated user
      await handler(user);
    } catch (jwtError) {
      throw CustomError.unauthorized("Invalid or expired token");
    }
  } catch (error) {
    handleError(error, context);
  }
}

/**
 * Handle errors in a consistent way
 * @param error The error to handle
 * @param context The Azure Function context
 */
function handleError(error: any, context: Context): void {
  if (error instanceof CustomError) {
    context.res = {
      status: error.statusCode,
      body: {
        error: error.message,
        code: error.code,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
    return;
  }

  // If it's not a custom error, return a 500 Internal Server Error
  context.res = {
    status: 500,
    body: {
      error: "Internal Server Error",
      message: error.message || "An unexpected error occurred",
    },
    headers: {
      "Content-Type": "application/json",
    },
  };
}
