# Simplex Tutoring — Marketing Site

> Top-of-funnel marketing and lead generation site for [Simplex Tutoring](https://simplex-to-fu.vercel.app) — a tutoring business I run.

**[Live →](https://simplex-to-fu.vercel.app)**

---

## What it is

The public-facing website for Simplex Tutoring. Explains the service, showcases offerings, and drives enquiries. Built as a separate concern from the internal [management platform](https://github.com/callmepri2003/simplexManager) so the marketing site can be iterated on independently.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router v7 |
| Unit tests | Vitest + React Testing Library |
| E2E / Component tests | Cypress |
| Linting | ESLint (flat config) |
| Hosting | Vercel |

## Local setup

```bash
cd simplex-tuition-web
npm install
npm run dev            # http://localhost:5173
npm run test:unit      # Vitest unit tests
npm run test:e2e       # Cypress E2E
npm test               # all test suites
```
