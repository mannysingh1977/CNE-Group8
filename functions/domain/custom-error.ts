export enum ErrorType {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  VALIDATION = "VALIDATION",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class CustomError extends Error {
  private constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  static validation(message: string, code?: string): CustomError {
    return new CustomError(400, message, code);
  }

  static unauthorized(message: string, code?: string): CustomError {
    return new CustomError(401, message, code);
  }

  static forbidden(message: string, code?: string): CustomError {
    return new CustomError(403, message, code);
  }

  static notFound(message: string, code?: string): CustomError {
    return new CustomError(404, message, code);
  }

  static methodNotAllowed(message: string, code?: string): CustomError {
    return new CustomError(405, message, code);
  }

  static conflict(message: string, code?: string): CustomError {
    return new CustomError(409, message, code);
  }

  static internalServerError(message: string, code?: string): CustomError {
    return new CustomError(500, message, code);
  }
}
