import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  cleanDatabase();
});

async function cleanDatabase() {
  database.query("drop schema if exists public cascade; create schema public;");
}

describe("GET api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("get pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBeTruthy();
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
