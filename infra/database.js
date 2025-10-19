import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    return await client.query(queryObject);
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await client.end();
  }
}

async function getNewClient() {
  const clientOptions = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production",
  };

  const client = new Client(clientOptions);

  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
