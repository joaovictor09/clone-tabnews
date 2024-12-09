import migrationsRunner from "node-pg-migrate";
import { join } from "node:path";

async function migrations(request, response) {
  if (request.method === "GET") {
    const migrations = await migrationsRunner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      dryRun: true,
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    return response.status(200).json(migrations);
  }

  if (request.method === "POST") {
    const migrations = await migrationsRunner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      dryRun: false,
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    return response.status(200).json(migrations);
  }

  return response.status(405).end();
}

export default migrations;
