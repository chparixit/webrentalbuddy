// === Swagger/OpenAPI Configuration ===
import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Rental Buddy API",
    version: "1.0.0",
    description: "Full-stack rental management API for properties, bookings, and user management in Kathmandu Valley.",
    contact: {
      name: "Rental Buddy Team",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token",
      },
    },
    schemas: {
      User: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          _id: { type: "string", description: "Auto-generated MongoDB ID" },
          name: { type: "string", description: "User's full name" },
          email: { type: "string", format: "email", description: "User's email address" },
          password: { type: "string", writeOnly: true, description: "User's password (min 6 chars)" },
          profileImage: { type: "string", description: "URL to profile image" },
          role: { type: "string", enum: ["user", "admin"], default: "user" },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
          preferredBHK: { type: "string" },
          preferredLocation: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Property: {
        type: "object",
        required: ["title", "description", "propertyType", "location", "city", "price", "bedrooms", "bathrooms", "area"],
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          propertyType: { type: "string", enum: ["apartment", "house", "studio", "penthouse"] },
          location: { type: "string" },
          city: { type: "string", enum: ["Kathmandu", "Lalitpur", "Bhaktapur"] },
          district: { type: "string" },
          price: { type: "number" },
          bedrooms: { type: "integer" },
          bathrooms: { type: "integer" },
          area: { type: "number" },
          amenities: { type: "array", items: { type: "string" } },
          images: { type: "array", items: { type: "string" } },
          landlord: { type: "string", description: "User ID of the landlord/admin" },
          featured: { type: "boolean", default: false },
          status: { type: "string", enum: ["available", "rented", "maintenance"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Booking: {
        type: "object",
        required: ["property", "startDate", "endDate"],
        properties: {
          _id: { type: "string" },
          user: { type: "string", description: "User ID of the booking tenant" },
          property: { type: "string", description: "Property ID being booked" },
          startDate: { type: "string", format: "date" },
          endDate: { type: "string", format: "date" },
          guests: { type: "integer", default: 1 },
          message: { type: "string" },
          totalPrice: { type: "number" },
          status: { type: "string", enum: ["pending", "confirmed", "cancelled", "completed"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", default: false },
          message: { type: "string" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered successfully" },
          "400": { description: "Validation error or email exists" },
          "503": { description: "Database unavailable" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login with email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful, returns JWT token" },
          "401": { description: "Invalid email or password" },
        },
      },
    },
    "/auth/whoami": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user profile",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": { description: "Current user data" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/properties": {
      get: {
        tags: ["Properties"],
        summary: "Get all properties with pagination, search, and filters",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 12 } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "city", in: "query", schema: { type: "string", enum: ["Kathmandu", "Lalitpur", "Bhaktapur"] } },
          { name: "propertyType", in: "query", schema: { type: "string", enum: ["apartment", "house", "studio", "penthouse"] } },
          { name: "minPrice", in: "query", schema: { type: "number" } },
          { name: "maxPrice", in: "query", schema: { type: "number" } },
          { name: "bedrooms", in: "query", schema: { type: "integer" } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["price_asc", "price_desc", "newest", "oldest"] } },
        ],
        responses: {
          "200": { description: "Paginated list of properties" },
        },
      },
      post: {
        tags: ["Properties"],
        summary: "Create a new property (admin only)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description", "propertyType", "location", "city", "price", "bedrooms", "bathrooms", "area"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  propertyType: { type: "string", enum: ["apartment", "house", "studio", "penthouse"] },
                  location: { type: "string" },
                  city: { type: "string", enum: ["Kathmandu", "Lalitpur", "Bhaktapur"] },
                  price: { type: "number" },
                  bedrooms: { type: "integer" },
                  bathrooms: { type: "integer" },
                  area: { type: "number" },
                  images: { type: "array", items: { type: "string", format: "binary" } },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Property created" },
          "400": { description: "Validation error" },
          "401": { description: "Unauthorized" },
          "403": { description: "Forbidden - admin only" },
        },
      },
    },
    "/properties/featured": {
      get: {
        tags: ["Properties"],
        summary: "Get featured properties",
        responses: {
          "200": { description: "List of featured properties" },
        },
      },
    },
    "/properties/{id}": {
      get: {
        tags: ["Properties"],
        summary: "Get a property by ID",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Property data" },
          "404": { description: "Property not found" },
        },
      },
      put: {
        tags: ["Properties"],
        summary: "Update a property (admin/owner only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Property updated" },
          "403": { description: "Not authorized" },
          "404": { description: "Property not found" },
        },
      },
      delete: {
        tags: ["Properties"],
        summary: "Delete a property (admin/owner only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Property deleted" },
          "403": { description: "Not authorized" },
          "404": { description: "Property not found" },
        },
      },
    },
    "/bookings": {
      get: {
        tags: ["Bookings"],
        summary: "Get all bookings (admin sees all, users see own)",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": { description: "List of bookings" },
          "401": { description: "Unauthorized" },
        },
      },
      post: {
        tags: ["Bookings"],
        summary: "Create a new booking",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["property", "startDate", "endDate"],
                properties: {
                  property: { type: "string", description: "Property ID" },
                  startDate: { type: "string", format: "date" },
                  endDate: { type: "string", format: "date" },
                  guests: { type: "integer", default: 1 },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Booking created" },
          "400": { description: "Validation error or date conflict" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/bookings/{id}": {
      get: {
        tags: ["Bookings"],
        summary: "Get a booking by ID",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Booking data" },
          "403": { description: "Not authorized" },
          "404": { description: "Booking not found" },
        },
      },
      put: {
        tags: ["Bookings"],
        summary: "Update a booking (cancel or change status)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", enum: ["pending", "confirmed", "cancelled", "completed"] },
                  guests: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Booking updated" },
          "403": { description: "Not authorized" },
          "404": { description: "Booking not found" },
        },
      },
      delete: {
        tags: ["Bookings"],
        summary: "Delete a booking (admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Booking deleted" },
          "403": { description: "Forbidden - admin only" },
          "404": { description: "Booking not found" },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [],
});