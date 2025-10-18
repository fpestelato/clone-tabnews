import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  database.query("drop schema if exists public cascade; create schema public;");
}

test("get api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBeTruthy();
  expect(responseBody.length).toBeGreaterThan(0);
});
