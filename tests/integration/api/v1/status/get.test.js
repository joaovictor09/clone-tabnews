test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  // Updated at tests

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toBe(parsedUpdatedAt);

  // Database dependencies tests

  const { opened_connections, max_connections, version } =
    responseBody.dependencies.database;

  expect(max_connections).toBe(100);
  expect(version).toBe("16.0");
  expect(opened_connections).toBe(1);
});
