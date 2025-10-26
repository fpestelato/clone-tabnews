import { spawn } from "child_process";

function run(command, args = []) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

async function main() {
  try {
    await run("npm", ["run", "services:up"]);
    await run("npm", ["run", "services:wait:database"]);
    await run("npm", ["run", "migrations:up"]);

    const nextProc = spawn("next", ["dev"], { stdio: "inherit", shell: true });

    const cleanup = async () => {
      await run("npm", ["run", "services:down"]).catch((e) =>
        console.error("Erro ao derrubar serviços:", e.message),
      );
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    nextProc.on("exit", async (code) => {
      await cleanup();
      process.exit(code);
    });
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

main();
