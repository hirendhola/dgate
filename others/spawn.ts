const proc = Bun.spawn(["ls", "-a"], {
  cwd: process.cwd(), // run in current directory
  stdout: "inherit", // pipe directly to YOUR terminal
  stderr: "inherit", // same for errors
  stdin: "inherit", // pass through keyboard input too
});

// Handle CTRL+C cleanly
process.on("SIGINT", () => {
  proc.kill();
  process.exit(0);
});

await proc.exited;
