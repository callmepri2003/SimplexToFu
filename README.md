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

## How pages reach search engines

`npm run build` prerenders every route to its own HTML file (`scripts/prerender.js`), each with its own title, canonical and JSON-LD from `src/seo/pages.js`, then writes `404.html` and `sitemap.xml`. Adding a suburb to `src/data/locations.js` adds its page and sitemap entry. To test the built site the way CI does:

```bash
npm run build && npm run preview                      # http://localhost:4173
CYPRESS_BASE_URL=http://localhost:4173 CYPRESS_PRERENDERED=true npm run test:e2e
```

## The maths skills map (`/maths-map` and `/maths-map/open`)

A lead magnet. Content leads to **`/maths-map`**, which asks for one thing, an email, and then opens **`/maths-map/open`**: all of school maths, Kindergarten to Year 12, as one chain a parent can tap through on a phone. Under the map sits the one booking form, which carries the skill the parent was looking at into the lead.

**Rules, all enforced by tests.** The map never tells a parent where their child's gap is (no quiz, no verdict). The chain component itself sells nothing (no link, no button, no mention of a diagnostic). The landing page has one ask (no booking button, no phone number, no sticky bar). Both were cut down on purpose for a tired parent; resist adding to them. The brand rules these pages bend are written down, with reasons, in `cowork/brand/WEBSITE_GUIDELINES.md` §14.

| What | Where |
|---|---|
| The landing page, its email form and its tap-a-topic preview | `src/pages/SkillsMapLanding.jsx`, `src/components/MapSignup.jsx`, `src/components/sections/MapTeaser.jsx`, `src/styles/map-landing.css` |
| Who may open the map (a note in the browser, set by the email step or a tutor's `?pass=` link) | `src/utils/mapAccess.js`, `src/hooks/useMapAccess.js` |
| The map page, with the booking form under it | `src/pages/SkillsChain.jsx` |
| The chain component (shared with simplexResourcesV4, keep the two copies identical) | `src/chain/ParentView.jsx`, `VerticalChain.jsx`, `verticalLayout.js`, `parent.css` |
| How the chain sits in this site: tokens, header offset, its own chunk | `src/chain/host.css`, `page.css`, `ChainIsland.jsx` |
| Every word on both pages | `src/data/skillsChainCopy.js` (held to the same banned-word and no-dollar tests as `content.js`) |
| The data | `src/data/skillsChain.json` (the map) and `src/data/skillsMapTeaser.json` (the landing page's preview: counts and a few names) |

**Updating the map.** It is authored in the sibling repo `simplexSkillsChain`. Run `npm run render` there, then `npm run sync:chain` here, commit and deploy. That rewrites both data files, so every number on the landing page stays true. Only the parent-safe export may be synced: `src/data/skillsChain.test.js` fails the build if diagnostic test statements, syllabus codes or internal notes ever appear.

**Loading and SEO.** The chain and its data live in their own chunk, fetched on the map page only. `/maths-map` is prerendered, indexed and in the sitemap. `/maths-map/open` is prerendered (every route needs a file on Vercel) but `noindex`, and its HTML holds none of the skills, because the map is what the email is exchanged for.

**Sign-ups arrive** through the same Formspree form as leads, with the subject "Skills map sign-up", `offer: skills-map`, the topic the parent tapped and the usual channel attribution. They fire GA4 `sign_up` and Meta `CompleteRegistration`, never `Lead`.

Background and what is left to decide: [docs/skills-chain-integration-plan.md](docs/skills-chain-integration-plan.md).
