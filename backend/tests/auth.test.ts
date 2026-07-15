// === Authentication Tests ===
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "../src/routes/authRoutes";
import { connectTestDB, disconnectTestDB, clearDatabase } from "./helpers/setup";

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api/v1/auth", authRoutes);
  return app;
};

describe("Authentication API", () => {
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

  describe("POST /api/v1/auth/register", () => {
    it("should return 400 when required fields are missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when email is invalid", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "invalid-email",
          password: "password123",
        });

      expect(res.status).toBe(400);
    });

    it("should return 400 when password is too short", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "12345",
        });

      expect(res.status).toBe(400);
    });

    it("should successfully register a new user", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          preferredBHK: "2BHK",
          preferredLocation: "Kathmandu - Baluwatar"
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "User registered successfully");
    });

    it("should return 400 if email already exists", async () => {
      // Register first user
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        });

      // Register duplicate user
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Jane Doe",
          email: "john@example.com",
          password: "password1234",
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "Email already exists");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Pre-register a user for login tests
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        });
    });

    it("should return 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
    });

    it("should return 400 when password is missing", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "john@example.com" });

      expect(res.status).toBe(400);
    });

    it("should successfully login a registered user and return a JWT token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "john@example.com",
          password: "password123",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("email", "john@example.com");
    });

    it("should return 401 for incorrect password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "john@example.com",
          password: "wrongpassword",
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });

    it("should return 401 for unregistered email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });
  });
});