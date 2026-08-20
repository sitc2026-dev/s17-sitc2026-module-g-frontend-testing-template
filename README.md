# SwapLoop Rider — Cypress (Module G)

Multi-page Module D–style rider UI (B&W mobile shell + bottom nav) + Module C–compatible mock API. Competitors implement Cypress specs only — do **not** change `public/` or `server.js`.

Stack mirrors [ws26-cypress](https://github.com/Skill17-WebTechnologies/ws26-cypress) (Node 22 + Cypress 15.10.0).

Wireframes: `public/wireframes/`. QR emulator: `public/vendor/swaploop-qr-emulator.js`.

## Pages

| Page | Role |
| ---- | ---- |
| `login.html` | Sign in |
| `register.html` | Two-step register + mock Alipay |
| `stations.html` | Station list / filters |
| `station.html?id=` | Station hub + reserve |
| `activity.html` | Active / recent services |
| `receipt.html` | PAYG receipt after confirm/collect |
| `scan.html` | `<swaploop-qr-emulator>` |
| `profile.html` | Rider profile |
| `qr-code-emulator.html` | Set active poster (`GET/PUT /api/qr/current`) |

Prefer `data-testid` selectors.

## Seed accounts

| Email | Password | Profile |
| ----- | -------- | ------- |
| `lin.xiaoyu@swaploop.test` | `password123` | Swappable `SL-48` |
| `chen.wei@swaploop.test` | `password123` | Integrated `GB-AC-48` (display: Chen Hao) |
| `sun.hao@swaploop.test` | `password123` | Suspended |

Stations include `station-001` (Jing’an HYBRID), `station-003` (Xuhui charging), `station-005` (swap 409 fixture).

`DELETE /api/v1/__reset` · `POST /api/v1/__force-conflict`

## Run

```bash
node server.js
# if port 3000 busy: PORT=3080 node server.js
```

Open http://127.0.0.1:PORT/login.html

Docker:

```bash
docker compose up web --build
docker compose up --abort-on-container-exit --exit-code-from cypress
```
