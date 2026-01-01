import { type NextFunction, type Request, type Response } from "express";
import { error } from "node:console";

type ErrorMessage = string | Record<string, string>;

export const errorMessages = {
  INPUT_VALIDATION_FAILED: "Input validation failed",
  INTERNAL_SERVER_ERROR: "Internal server error",
};

export const httpStatusCodes = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  GONE: 410,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const isString = (arg: unknown) => typeof arg === "string";
const isObject = (arg: unknown) => typeof arg === "object";

export class CustomError extends Error {
  name: string;
  message: string;
  errors: Record<string, string>;
  meta: Record<string, string>;
  constructor(message: string) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = {};
    this.meta = {};
  }
}

export class ClientError extends CustomError {}
export class AuthorizationError extends ClientError {}
export class NotFoundError extends ClientError {}
export class ForbiddenError extends ClientError {}
export class TimeExpiredError extends ClientError {}
export class MaxPayloadError extends ClientError {}
export class NoFilePayloadError extends ClientError {}

export class ValidationError extends ClientError {
  constructor(message: ErrorMessage, meta: Record<string, string> = {}) {
    super(
      isString(message)
        ? (message as string)
        : errorMessages.INPUT_VALIDATION_FAILED
    );
    if (isObject(message)) this.errors = message as Record<string, string>;
    this.meta = meta;
  }
}

export class DbConnectionError extends CustomError {}

//==== error handle

const {
  UNAUTHORIZED,
  NOT_FOUND,
  FORBIDDEN,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  GONE,
} = httpStatusCodes;

export const clientErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AuthorizationError) res.status(UNAUTHORIZED).send(err);
  else if (err instanceof NotFoundError) res.status(NOT_FOUND).send(err);
  else if (err instanceof ForbiddenError) res.status(FORBIDDEN).send(err);
  else if (err instanceof ValidationError) res.status(BAD_REQUEST).send(err);
  else if (err instanceof TimeExpiredError) res.status(GONE).send(err);
  else next(err);
};

export const serverErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // errorHandler.handleError(err)
  console.error(err)
  const message = `${errorMessages.INTERNAL_SERVER_ERROR}${
    process.env.NODE_ENV === process.env.NODE_ENV_PRODUCTION ? "" : err.message
  }`;
  res.status(INTERNAL_SERVER_ERROR).send(message);
};

export default { clientErrorHandler, serverErrorHandler };
