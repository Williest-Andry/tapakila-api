import AppError from "../../utils/AppError.js";

export class NotFoundError extends AppError {
  constructor(resource = "Ressource") {
    super(`${resource} not found`, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Invalid Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(resource = "Ressource") {
    super(`${resource} already exists`, 409);
  }
}
