import migrationsRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "@/infra/database";

async function migrations(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dir: join("infra", "migrations"),
    dryRun: true,
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationsRunner(defaultMigrationsOptions);
    await dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationsRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}

export default migrations;
