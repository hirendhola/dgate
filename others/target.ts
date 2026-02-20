// target.ts
Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("hello from 3000");
  },
});
console.log("Target on :3000");
