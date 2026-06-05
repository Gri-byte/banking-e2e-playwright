import { test, expect } from "@playwright/test";

/**
 * Banking API - Accounts Endpoint Test Suite
 * Tests the REST API layer using JSONPlaceholder as a mock banking API.
 * Validates response structure, status codes, and data integrity.
 */

const API_BASE = "https://jsonplaceholder.typicode.com";

test.describe("@smoke Accounts API", () => {
  test("GET /users - should return list of account holders", async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`);
    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
  });

  test("GET /users/:id - should return single account holder", async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
  });

  test("GET /users/:id - should return 404 for non-existent account", async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/99999`);
    expect(response.status()).toBe(404);
  });

  test("GET /users/:id - should expose contact details for an account holder", async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(user).toHaveProperty("address.city");
    expect(user).toHaveProperty("phone");
  });

  test("GET /users/:id - should return an empty body for a missing account", async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/0`);
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(Object.keys(body)).toHaveLength(0);
  });
});

test.describe("@regression Transactions API", () => {
  test("GET /posts - should return transactions list with correct structure", async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts`);
    expect(response.status()).toBe(200);
    const transactions = await response.json();
    const first = transactions[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("userId");
    expect(first).toHaveProperty("title");
    expect(first).toHaveProperty("body");
  });

  test("POST /posts - should create a new transaction record", async ({ request }) => {
    const payload = {
      userId: 1,
      title: "Transfer to savings",
      body: "Amount: 500.00 USD | From: checking-001 | To: savings-002",
    };
    const response = await request.post(`${API_BASE}/posts`, { data: payload });
    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created).toHaveProperty("id");
    expect(created.title).toBe(payload.title);
  });

  test("Content-Type header should be application/json", async ({ request }) => {
    const response = await request.get(`${API_BASE}/users/1`);
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });

  test("Response time should be under 3 seconds", async ({ request }) => {
    const start = Date.now();
    await request.get(`${API_BASE}/users`);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });

  test("GET /posts?userId - should return only transactions for the given account", async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts`, { params: { userId: 1 } });
    expect(response.status()).toBe(200);
    const transactions = await response.json();
    expect(transactions.length).toBeGreaterThan(0);
    for (const tx of transactions) {
      expect(tx.userId).toBe(1);
    }
  });

  test("PUT /posts/:id - should update an existing transaction record", async ({ request }) => {
    const payload = {
      id: 1,
      userId: 1,
      title: "Adjusted transfer",
      body: "Amount: 750.00 USD",
    };
    const response = await request.put(`${API_BASE}/posts/1`, { data: payload });
    expect(response.status()).toBe(200);
    const updated = await response.json();
    expect(updated.title).toBe(payload.title);
  });

  test("DELETE /posts/:id - should remove a transaction record", async ({ request }) => {
    const response = await request.delete(`${API_BASE}/posts/1`);
    expect(response.ok()).toBeTruthy();
  });

  test("GET /posts/:id - should return 404 for a non-existent transaction", async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts/99999`);
    expect(response.status()).toBe(404);
  });

  test("GET /unknown - should return 404 for an undefined endpoint", async ({ request }) => {
    const response = await request.get(`${API_BASE}/this-endpoint-does-not-exist`);
    expect(response.status()).toBe(404);
  });
});
