import migrationRunner from "node-pg-migrate";
import path from "path";
import database from "infra/database";

async function status(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient,
    dir: path.join("infra", "migrations"),
    migrationsTable: "pgmigrations",
    direction: "up",
    verbose: true,
  };

  const { method } = request;

  if (method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: true,
    });
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (method === "POST") {
    const migratedMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();

    if (migratedMigrations.length) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }
}

export default status;
