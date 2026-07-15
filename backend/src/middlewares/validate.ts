// === Validation Middleware ===
// Uses express-validator to validate request bodies
import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err) => ({
      field: (err as any).path || (err as any).param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: extractedErrors,
    });
  };
};

// ---- Auth Validation Rules ----

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ---- Property Validation Rules ----

export const createPropertyValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  body("propertyType")
    .isIn(["apartment", "house", "studio", "penthouse"])
    .withMessage("Invalid property type"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),
  body("city")
    .isIn(["Kathmandu", "Lalitpur", "Bhaktapur"])
    .withMessage("Invalid city"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value > 0)
    .withMessage("Price must be positive"),
  body("bedrooms")
    .isInt({ min: 0 })
    .withMessage("Bedrooms must be a non-negative integer"),
  body("bathrooms")
    .isInt({ min: 0 })
    .withMessage("Bathrooms must be a non-negative integer"),
  body("area")
    .isNumeric()
    .withMessage("Area must be a number")
    .custom((value) => value > 0)
    .withMessage("Area must be positive"),
];

// ---- Booking Validation Rules ----

export const createBookingValidation = [
  body("property")
    .isMongoId()
    .withMessage("Valid property ID is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Valid start date is required (ISO 8601)"),
  body("endDate")
    .isISO8601()
    .withMessage("Valid end date is required (ISO 8601)"),
  body("guests")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Guests must be at least 1"),
];