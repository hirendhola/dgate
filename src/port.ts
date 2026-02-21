async function isPortFree(port: number): Promise<boolean> {
  try {
    const server = Bun.listen({
      port,
      hostname: "localhost",
      socket: {
        open() {},
        close() {},
        data() {},
        error() {},
      },
    });
    server.stop(true);
    return true;
  } catch {
    return false;
  }
}

export async function findFreePort(start: number): Promise<number> {
  let port = start;
  while (!(await isPortFree(port))) {
    port++;
  }
  return port;
}