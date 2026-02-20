import { join } from "path";
import { cac } from "cac";
import { register, unregister, list } from "./src/registry";
import { stopDaemon, status, isRunning, LOG_FILE } from "./src/daemon";
import { run } from "./src/run";

const cli = cac("dgate");

cli.command("start", "Start the proxy daemon").action(() => {
  if (isRunning()) {
    console.log("dgate is already running. Use: dgate status");
    process.exit(0);
  }
  const proxyPath = join(import.meta.dir, "src", "proxy.ts");
  const proc = Bun.spawn(["bun", proxyPath], {
    stdout: Bun.file(LOG_FILE),
    stderr: Bun.file(LOG_FILE),
    stdin: null,
    cwd: import.meta.dir,
  });
  console.log(`✓ dgate started (pid ${proc.pid}) → http://*.localhost:1999`);
  console.log(`  logs: ${LOG_FILE}`);
});

cli.command("stop", "Stop the proxy daemon").action(() => stopDaemon());

cli
  .command("status", "Show daemon status and registered apps")
  .action(() => status());

cli
  .command("run <script>", "Run a dev server with dgate proxy")
  .option("--name <name>", "App name (defaults to folder name)")
  .option("--port <port>", "Port override (defaults to framework default)")
  .action(async (script: string, options: { name?: string; port?: string }) => {
    await run(script, {
      name: options.name,
      port: options.port ? parseInt(options.port) : undefined,
    });
  });

cli
  .command("register <name> <port>", "Manually register an app")
  .action(async (name: string, port: string) => {
    const parsed = parseInt(port);
    if (isNaN(parsed)) {
      console.error(`Invalid port: "${port}"`);
      process.exit(1);
    }
    await register(name, parsed);
    console.log(`  Access at: http://${name}.localhost:1999`);
  });

cli
  .command("unregister <name>", "Remove a registered app")
  .action(async (name: string) => await unregister(name));

cli.command("list", "List all registered apps").action(() => list());

cli
  .command("open <name>", "Open an app in the browser")
  .action((name: string) => {
    const url = `http://${name}.localhost:1999`;
    const opener =
      process.platform === "win32"
        ? ["cmd", "/c", "start", url]
        : process.platform === "darwin"
          ? ["open", url]
          : ["xdg-open", url];
    Bun.spawn(opener);
    console.log(`Opening ${url}...`);
  });

cli.help();
cli.version("0.1.0");
cli.parse();
