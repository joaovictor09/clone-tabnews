import database from "@/infra/database.js";

// conexoesusadas

async function status(request, response) {
  const updatedAt = new Date();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  );

  const databaseUsedConnectionsActiveResult = await database.query(
    "SELECT count(*) FROM pg_stat_activity WHERE datname = 'local_db' AND state = 'active';",
  );
  const databaseUsedConnectionsActiveValue = parseInt(
    databaseUsedConnectionsActiveResult.rows[0].count,
  );

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: databaseMaxConnectionsValue,
        opened_connections: databaseUsedConnectionsActiveValue,
      },
    },
  });
}

export default status;
