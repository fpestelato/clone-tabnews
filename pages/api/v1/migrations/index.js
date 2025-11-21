import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import path from "path";
import database from "infra/database";
import controller from "infra/controller";

const routes = createRouter();

routes.get(getHandler);
routes.post(postHandler);

export default routes.handler(controller.errorHandlers);

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...getDefaultMigrationOptions(dbClient),
      dryRun: true,
    });

    return response.status(200).json(pendingMigrations);
  } finally {
    dbClient?.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationRunner(
      getDefaultMigrationOptions(dbClient),
    );

    if (migratedMigrations.length) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    dbClient?.end();
  }
}

function getDefaultMigrationOptions(dbClient) {
  return {
    dbClient,
    dir: path.resolve("infra", "migrations"),
    migrationsTable: "pgmigrations",
    direction: "up",
    verbose: true,
  };
}
