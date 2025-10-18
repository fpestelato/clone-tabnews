import migrationRunner from "node-pg-migrate";
import path from "path";
import database from "infra/database";

async function status(request, response) {
  const { method } = request;

  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(method)) {
    return response.status(405).end();
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient,
      dir: path.join("infra", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
      verbose: true,
    };

    if (method === "GET") {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: true,
      });
      return response.status(200).json(pendingMigrations);
    }

    if (method === "POST") {
      const migratedMigrations = await migrationRunner(defaultMigrationOptions);

      if (migratedMigrations.length) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.log(error);
  } finally {
    dbClient.end();
  }
}

export default status;
