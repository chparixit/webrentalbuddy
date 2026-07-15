// === Booking API Tests ===
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bookingRoutes from "../src/routes/bookingRoutes";
import User from "../src/models/User";
import Property from "../src/models/Property";
import { connectTestDB, disconnectTestDB, clearDatabase } from "./helpers/setup";

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/bookings", bookingRoutes);
  return app;
};

describe("Bookings API", () => {
  let app: express.Application;
  let tenantToken: string;
  let tenantId: string;
  let adminToken: string;
  let propertyId: string;

  beforeAll(async () => {
    app = createTestApp();
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    // 1. Create a Landlord/Admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin"
    });
    adminToken = jwt.sign(
      { id: adminUser._id, email: adminUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // 2. Create a Tenant user
    const tenantUser = await User.create({
      name: "Tenant User",
      email: "tenant@example.com",
      password: "password123",
      role: "user"
    });
    tenantId = tenantUser._id.toString();
    tenantToken = jwt.sign(
      { id: tenantUser._id, email: tenantUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // 3. Create a Property
    const property = await Property.create({
      title: "Nice Cozy Studio",
      description: "Cozy studio in Kathmandu near Durbar Square",
      propertyType: "studio",
      location: "Basantapur",
      city: "Kathmandu",
      price: 3000,
      bedrooms: 1,
      bathrooms: 1,
      area: 400,
      landlord: adminUser._id,
      status: "available"
    });
    propertyId = property._id.toString();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  describe("GET /api/v1/bookings", () => {
    it("should return 401 without JWT token", async () => {
      const res = await request(app).get("/api/v1/bookings");
      expect(res.status).toBe(401);
    });

    it("should return 200 with empty list when no bookings exist", async () => {
      const res = await request(app)
        .get("/api/v1/bookings")
        .set("Authorization", `Bearer ${tenantToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe("POST /api/v1/bookings", () => {
    it("should return 400 with invalid body", async () => {
      const res = await request(app)
        .post("/api/v1/bookings")
        .set("Authorization", `Bearer ${tenantToken}`)
        .send({});
      expect(res.status).toBe(400);
    });

    it("should successfully create a new booking with correct total price", async () => {
      const res = await request(app)
        .post("/api/v1/bookings")
        .set("Authorization", `Bearer ${tenantToken}`)
        .send({
          property: propertyId,
          startDate: "2026-08-01",
          endDate: "2026-08-05", // 4 nights
          guests: 2,
          message: "Looking forward to staying!"
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty("totalPrice", 12000); // 4 nights * 3000 price
      expect(res.body.data.user).toHaveProperty("email", "tenant@example.com");
    });
  });

  describe("GET & DELETE /api/v1/bookings/:id", () => {
    let bookingId: string;

    beforeEach(async () => {
      // Create a booking
      const res = await request(app)
        .post("/api/v1/bookings")
        .set("Authorization", `Bearer ${tenantToken}`)
        .send({
          property: propertyId,
          startDate: "2026-08-01",
          endDate: "2026-08-03", // 2 nights
          guests: 1
        });
      bookingId = res.body.data._id;
    });

    it("should retrieve a booking by ID", async () => {
      const res = await request(app)
        .get(`/api/v1/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${tenantToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("totalPrice", 6000);
    });

    it("should allow admin to delete a booking", async () => {
      const res = await request(app)
        .delete(`/api/v1/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Booking deleted successfully");
    });

    it("should reject non-admin users from deleting a booking", async () => {
      const res = await request(app)
        .delete(`/api/v1/bookings/${bookingId}`)
        .set("Authorization", `Bearer ${tenantToken}`);

      expect(res.status).toBe(403);
    });
  });
});