import { existsSync, readFileSync } from "fs";
import { join } from "path";

export type Framework =
  | "vite"
  | "next"
  | "nuxt"
  | "sveltekit"
  | "remix"
  | "angular"
  | "unknown";

export interface DetectResult {
  framework: Framework;
  defaultPort: number;
  packageManager: "bun" | "pnpm" | "yarn" | "npm";
}

function detectPackageManager(cwd: string): DetectResult["packageManager"] {
  if (existsSync(join(cwd, "bun.lockb"))) return "bun";
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function detect(cwd: string = process.cwd()): DetectResult {
  const pkgPath = join(cwd, "package.json");
  const packageManager = detectPackageManager(cwd);

  if (!existsSync(pkgPath)) {
    return { framework: "unknown", defaultPort: 3000, packageManager };
  }

  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch {
    return { framework: "unknown", defaultPort: 3000, packageManager };
  }

  const deps = {
    ...pkg.dependencies,
    ...pkg.devDependencies,
  };

  // Order matters
  if (deps["@sveltejs/kit"])
    return { framework: "sveltekit", defaultPort: 5173, packageManager };
  if (deps["@remix-run/dev"])
    return { framework: "remix", defaultPort: 3000, packageManager };
  if (deps["@angular/core"])
    return { framework: "angular", defaultPort: 4200, packageManager };
  if (deps["next"])
    return { framework: "next", defaultPort: 3000, packageManager };
  if (deps["nuxt"])
    return { framework: "nuxt", defaultPort: 3000, packageManager };
  if (deps["vite"])
    return { framework: "vite", defaultPort: 5173, packageManager };

  return { framework: "unknown", defaultPort: 3000, packageManager };
}
