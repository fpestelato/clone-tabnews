import database from "infra/database.js";
import { InternalServerError } from "infra/errors.js";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const dbName = process.env.POSTGRES_DB;
    const result = await database.query({
      text: `
      select
        version() as version,
        current_setting('max_connections') as max_connections,
        (select count(*) FROM pg_stat_activity where datname = $1) as opened_connections;
    `,
      values: [dbName],
    });

    const { version, max_connections, opened_connections } =
      result.rows[0] || {};

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: version.split(" ")[1],
          max_connections: parseInt(max_connections),
          opened_connections: parseInt(opened_connections),
        },
      },
    });
  } catch (error) {
    const publicInternalError = new InternalServerError({ cause: error });
    console.error(publicInternalError);
    response.status(publicInternalError.statusCode).json(publicInternalError);
  }
}

export default status;
