// === Property API Tests ===
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import propertyRoutes from "../src/routes/propertyRoutes";
import User from "../src/models/User";
import { connectTestDB, disconnectTestDB, clearDatabase } from "./helpers/setup";

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/properties", propertyRoutes);
  return app;
};

describe("Properties API", () => {
  let app: express.Application;

  beforeAll(async () => {
    app = createTestApp();
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  // Helpers to get tokens
  const getAdminToken = async () => {
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin"
    });
    return jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  };

  const getUserToken = async () => {
    const user = await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
      role: "user"
    });
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  };

  describe("GET /api/v1/properties", () => {
    it("should return 200 with empty list when no properties exist", async () => {
      const res = await request(app).get("/api/v1/properties");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBe(0);
    });
  });

  describe("POST /api/v1/properties", () => {
    it("should fail to create property without auth token", async () => {
      const res = await request(app)
        .post("/api/v1/properties")
        .send({
          title: "New House",
          description: "Test House description",
          propertyType: "house",
          location: "Baneshwor",
          city: "Kathmandu",
          price: 50000,
          bedrooms: 3,
          bathrooms: 2,
          area: 1200
        });

      expect(res.status).toBe(401);
    });

    it("should fail if user is not an admin", async () => {
      const token = await getUserToken();
      const res = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "New House",
          description: "Test House description",
          propertyType: "house",
          location: "Baneshwor",
          city: "Kathmandu",
          price: 50000,
          bedrooms: 3,
          bathrooms: 2,
          area: 1200
        });

      expect(res.status).toBe(403);
    });

    it("should successfully create property when user is admin", async () => {
      const token = await getAdminToken();
      const res = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Beautiful Penthouse",
          description: "Stunning views of the Kathmandu Valley",
          propertyType: "penthouse",
          location: "Sanepa",
          city: "Lalitpur",
          price: 150000,
          bedrooms: 4,
          bathrooms: 4,
          area: 2500
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("title", "Beautiful Penthouse");
    });
  });

  describe("PUT & DELETE /api/v1/properties/:id", () => {
    let propertyId: string;
    let adminToken: string;

    beforeEach(async () => {
      adminToken = await getAdminToken();
      const createRes = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Beautiful Penthouse",
          description: "Stunning views",
          propertyType: "penthouse",
          location: "Sanepa",
          city: "Lalitpur",
          price: 150000,
          bedrooms: 4,
          bathrooms: 4,
          area: 2500
        });
      propertyId = createRes.body.data._id;
    });

    it("should successfully retrieve property by ID", async () => {
      const res = await request(app).get(`/api/v1/properties/${propertyId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("title", "Beautiful Penthouse");
    });

    it("should successfully update property", async () => {
      const res = await request(app)
        .put(`/api/v1/properties/${propertyId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Updated Penthouse Title",
          description: "Stunning views",
          propertyType: "penthouse",
          location: "Sanepa",
          city: "Lalitpur",
          price: 180000,
          bedrooms: 4,
          bathrooms: 4,
          area: 2500
        });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("title", "Updated Penthouse Title");
      expect(res.body.data).toHaveProperty("price", 180000);
    });

    it("should successfully delete property", async () => {
      const deleteRes = await request(app)
        .delete(`/api/v1/properties/${propertyId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(deleteRes.status).toBe(200);

      const checkRes = await request(app).get(`/api/v1/properties/${propertyId}`);
      expect(checkRes.status).toBe(404);
    });
  });
});
