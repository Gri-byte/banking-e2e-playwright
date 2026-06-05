# 🏦 Banking App E2E Test Suite — Playwright + TypeScript

End-to-end test suite for a banking web application covering login flows, dashboard validation, and REST API testing. Built with Page Object Model and custom fixtures.

## 🧪 Test Coverage

| Suite | Tags | Description |
|---|---|---|
| Login UI | `@smoke` `@regression` | Credentials, edge cases, security |
| Dashboard UI | `@smoke` `@regression` | Balance display, UI integrity |
| Accounts API | `@smoke` | GET/POST account endpoints |
| Transactions API | `@regression` | CRUD, filtering, response time, headers |

## ⚠️ Notes on Negative Scenarios

The UI tests run against the public demo at `demo.applitools.com`, which **accepts any
credentials** and has no real authentication backend. Because of this, the negative login
cases (empty fields, whitespace-only, SQL-injection-like input, overly long username) assert
defensive behaviour — *"the app does not crash"* and *"does not reach `/index`"* — rather than
a true authentication error.

To exercise **real negative authentication** (e.g. asserting an error message on wrong
credentials), point the suite at an app with server-side validation via `BASE_URL`, or mock
the auth response with Playwright route interception. The Page Objects already expose
`getErrorMessage()` / `errorMessage` for that purpose.

## 🌐 Network Note

Behind a corporate proxy with TLS interception you may see
`unable to verify the first certificate`. Run with the system trust store:

```bash
NODE_OPTIONS=--use-system-ca npm test
```

## 🚀 Quick Start

```bash
git clone https://github.com/Gri-byte/banking-e2e-playwright
cd banking-e2e-playwright
npm install
npx playwright install chromium
cp .env.example .env
npm run test:smoke          # smoke tests only
npm test                    # full suite
npm run report              # open HTML report
```

### 🖥️ Running with a visible browser

```bash
npm run test:headed         # run the UI suite with a visible Chromium window
npm run test:interactive    # open Playwright's interactive UI mode (timeline + watch)
```

> `test:interactive` launches a GUI app that stays open until you close it.

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm test` | Full suite (UI + API) |
| `npm run test:ui` | UI tests on the chromium project |
| `npm run test:api` | API tests only |
| `npm run test:smoke` | Tests tagged `@smoke` |
| `npm run test:regression` | Tests tagged `@regression` |
| `npm run test:headed` | UI suite with a visible browser |
| `npm run test:interactive` | Playwright interactive UI mode |
| `npm run report` | Open the last HTML report |

## 🏗️ Structure

```
src/
  pages/       # Page Object Model classes
  fixtures/    # Custom Playwright fixtures (auth, etc.)
tests/
  ui/          # Browser-based end-to-end tests
  api/         # REST API tests
```

## 🛠️ Stack

`Playwright` · `TypeScript` · `Node.js 20` · `GitHub Actions`
