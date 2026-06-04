# 🏦 Banking App E2E Test Suite — Playwright + TypeScript

End-to-end test suite for a banking web application covering login flows, dashboard validation, and REST API testing. Built with Page Object Model and custom fixtures.

## 🧪 Test Coverage

| Suite | Tags | Description |
|---|---|---|
| Login UI | `@smoke` `@regression` | Credentials, edge cases, security |
| Dashboard UI | `@smoke` `@regression` | Balance display, UI integrity |
| Accounts API | `@smoke` | GET/POST account endpoints |
| Transactions API | `@regression` | CRUD, response time, headers |

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
