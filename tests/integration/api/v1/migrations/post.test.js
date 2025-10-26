import database from "infra/database";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  cleanDatabase();
});

async function cleanDatabase() {
  database.query("drop schema if exists public cascade; create schema public;");
}

describe("POST api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("for the first time", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response1.status).toBe(201);

        const response1Body = await response1.json();
        expect(Array.isArray(response1Body)).toBeTruthy();
        expect(response1Body.length).toBeGreaterThan(0);
      });

      test("for the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();
        expect(Array.isArray(response2Body)).toBeTruthy();
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
