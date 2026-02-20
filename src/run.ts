import { join } from "path";
import { detect } from "./detect";
import { patch, unpatch } from "./patcher";
import { register, unregister } from "./registry";
import { isRunning } from "./daemon";
import { basename } from "path";

interface RunOptions {
  name?: string;   
  port?: number;  
  cwd?: string;   
}

export async function run(script: string, options: RunOptions = {}) {
  const cwd = options.cwd ?? process.cwd();

  const { framework, defaultPort, packageManager } = detect(cwd);

  const appName = options.name ?? basename(cwd);
  const port = options.port ?? defaultPort;

  if (!isRunning()) {
    console.log("↑ Starting dgate daemon...");
    const proxyPath = join(import.meta.dir, "proxy.ts");
    Bun.spawn(["bun", proxyPath], {
      stdout: "ignore",
      stderr: "ignore",
      stdin: null,
      cwd: import.meta.dir,
    });
    await Bun.sleep(500);
  }

  await register(appName, port);

  const patchResult = patch(framework, appName, cwd);
  if (patchResult.patched) {
    console.log(`✓ Auto-configured ${framework} for dgate`);
  }

  console.log(`\n✓ ${appName} → http://${appName}.localhost:1999\n`);

  const cmd = packageManager === "bun"
    ? ["bun", "run", script]
    : packageManager === "pnpm"
    ? ["pnpm", "run", script]
    : packageManager === "yarn"
    ? ["yarn", script]
    : ["npm", "run", script];

  const proc = Bun.spawn(cmd, {
    cwd,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  });

  const cleanup = async () => {
    console.log("\n↓ Shutting down...");
    proc.kill();
    await unregister(appName);
    unpatch(framework, cwd);
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  await proc.exited;

  await cleanup();
}