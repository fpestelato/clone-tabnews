import database from "infra/database";
import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (!response.ok) throw Error();
    }
  }
}

async function cleanDatabase() {
  database.query("drop schema if exists public cascade; create schema public;");
}
const orchestrator = {
  waitForAllServices,
  cleanDatabase,
};

export default orchestrator;
