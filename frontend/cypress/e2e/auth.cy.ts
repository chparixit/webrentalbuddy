// === Authentication E2E Tests ===

describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should navigate to login page", () => {
    cy.contains("Login").click();
    cy.contains("Welcome Back").should("be.visible");
    cy.contains("Login →").should("be.visible");
  });

  it("should show validation error on empty login", () => {
    cy.contains("Login").click();
    cy.contains("Login →").click();
    cy.contains("Please enter email and password").should("be.visible");
  });

  it("should navigate to register page", () => {
    cy.contains("Register").click();
    cy.contains("Create Account").should("be.visible");
  });

  it("should navigate between login and register", () => {
    cy.contains("Login").click();
    cy.contains("Create an account").click();
    cy.contains("Find Your Perfect Sanctuary").should("be.visible");
    cy.contains("Log in").click();
    cy.contains("Welcome Back").should("be.visible");
  });
});