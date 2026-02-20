# dgate

> Local dev proxy that turns `localhost:3000` into `myapp.localhost:1999`

No config. No port juggling. Just named URLs for every dev server you run.

---

## What it does

```bash
# instead of this
npm run dev  →  http://localhost:3000

# you get this
dgate run dev  →  http://myapp.localhost:1999
```

dgate auto-detects your framework, auto-configures it, and gives every project a stable named URL. Multiple projects run at the same time without port conflicts.

---

## Install

```bash
# npm
npm install -g dgate

# bun
bun add -g dgate
```

Or download a binary from [Releases](https://github.com/yourusername/dgate/releases) — no Node or Bun required.

---

## Usage

```bash
# Run your dev server through dgate (auto-detects everything)
dgate run dev

# Custom name
dgate run dev --name myapp

# Custom port
dgate run dev --name myapp --port 3000

# Manage the proxy daemon
dgate start     # start proxy in background
dgate stop      # stop proxy
dgate status    # check if running

# Manage apps manually
dgate register myapp 3000    # point myapp.localhost:1999 → localhost:3000
dgate unregister myapp       # remove
dgate list                   # show all registered apps
dgate open myapp             # open in browser
```

---

## Framework support

| Framework  | Auto-detected | Auto-configured | Default port |
|------------|:-------------:|:---------------:|:------------:|
| Vite       | ✓             | ✓               | 5173         |
| Next.js    | ✓             | ✓               | 3000         |
| Nuxt       | ✓             | -               | 3000         |
| SvelteKit  | ✓             | ✓               | 5173         |
| Remix      | ✓             | -               | 3000         |
| Angular    | ✓             | -               | 4200         |
| Any other  | -             | -               | 3000         |

Auto-configured means dgate patches the framework config to allow the dgate hostname. It cleans up after itself when you stop.

---

## How it works

```
Browser → myapp.localhost:1999
  → dgate proxy reads Host header → "myapp"
  → looks up port in ~/.dgate/routes.json → 3000
  → forwards request to localhost:3000
  → returns response
Browser renders your app
```

WebSocket (HMR) is proxied too — live reload works normally.

---

## Why not just use localhost:PORT

- Two projects clash on the same port
- Cookies set on `localhost` bleed across every app
- Browser history is a mess of ports
- Named URLs are easier to remember and share with teammates

---

## License

MIT — free to use in personal and commercial projects. No permission needed.

---

## Contributing

PRs welcome. Open an issue first for big changes.

```bash
git clone https://github.com/yourusername/dgate
cd dgate
bun install
bun index.ts --help
```