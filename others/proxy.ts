const TARGET_PORT = 3000;

Bun.serve({
  port: 9000,
  async fetch(req) {
    const url = new URL(req.url);
    const target_url = `http://localhost:${TARGET_PORT}${url.pathname}${url.search}`;

    const response = await fetch(target_url, {
      method: req.method,
      headers: req.headers,
      body:
        req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  },
});

console.log("Proxy running on http://localhost:9000 → http://localhost:3000");
