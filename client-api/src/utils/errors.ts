
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    // 👇 Required when extending a built-in class in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this);
  }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request: The request was malformed or invalid.') {
        super(message, 400);
    }
}

export class InvalidCredentialsError extends AppError {
    constructor(message = 'Invalid Username or Password.') {
        super(message, 401); // 401 Unauthorized
    }
}

export class UnauthenticatedError extends InvalidCredentialsError{}

export class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(message, 404);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden: You do not have permission to access this resource.') {
        super(message, 403);
    }
}