test("get api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parsedUpdatedAt).toEqual(responseBody.updated_at);

  const { version, max_connections, opened_connections } =
    responseBody?.dependencies?.database;

  expect(version).toBe("18.0");
  expect(max_connections).toBeDefined();
  expect(opened_connections).toEqual(1);
});
