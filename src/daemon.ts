import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import os from "os";

const DGATE_DIR = join(os.homedir(), ".dgate");
export const PID_FILE = join(DGATE_DIR, "daemon.pid");

export const LOG_FILE = join(DGATE_DIR, "daemon.log");
export const DGATE_PORT = 1999;

export function readPid() {
  if (!existsSync(PID_FILE)) return null;
  const pid = parseInt(readFileSync(PID_FILE, "utf-8").trim());
  return isNaN(pid) ? null : pid;
}

export function writePid() {
  if (!existsSync(DGATE_DIR)) mkdirSync(DGATE_DIR, { recursive: true });
  writeFileSync(PID_FILE, process.pid.toString());
}

export function isRunning(): boolean {
  const pid = readPid();
  if (!pid) return false;

  try {
    if (process.platform === "win32") {
      const result = Bun.spawnSync(
        ["tasklist", "/FI", `PID eq ${pid}`, "/NH"],
        {
          stdout: "pipe",
        },
      );
      const output = new TextDecoder().decode(result.stdout);
      return output.includes(pid.toString());
    } else {
      // Mac and Linux
      process.kill(pid, 0);
      return true;
    }
  } catch {
    return false;
  }
}

export function stopDaemon() {
  const pid = readPid();
  if (!pid || !isRunning()) {
    console.log("dgate is not running");
    return;
  }

  if (process.platform === "win32") {
    Bun.spawnSync(["taskkill", "/PID", pid.toString(), "/F"]);
  } else {
    process.kill(pid, "SIGTERM");
  }

  if (existsSync(PID_FILE)) unlinkSync(PID_FILE);
  console.log("✓ dgate stopped");
}

export function status() {
  if (isRunning()) {
    console.log(
      `✓ dgate running (pid ${readPid()}) → http://*.localhost:${DGATE_PORT}`,
    );
  } else {
    console.log("✗ dgate is not running. Run: dgate start");
  }
}
