// === Global Error Handler ===
import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/http-Exception";

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}

export const errorHandler = (
  err: Error | HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof HttpException) {
    statusCode = err.status;
    message = err.message;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 400;
    message = "Validation Error";
    const mongooseErr = err as any;
    const errors = Object.keys(mongooseErr.errors || {}).map((key) => ({
      field: key,
      message: mongooseErr.errors[key].message,
    }));
    const response: ErrorResponse = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  } else if ((err as any).code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = "Duplicate entry. This record already exists.";
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  const response: ErrorResponse = {
    success: false,
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};