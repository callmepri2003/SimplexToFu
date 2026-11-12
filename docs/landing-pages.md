# Landing pages — the registry

Every page on simplextuition.com.au that a campaign, post, flyer or form sends people to. One row per path. **A unit test (`src/seo/landingPages.test.js`) fails the build if a prerendered route is missing from this table**, so adding a page means adding a row.

| Path | Job (one ask) | Who arrives, from where | Indexed | Status | Copy lives in | Tracking notes |
|---|---|---|---|---|---|---|
| `/` | Phone number for a free first lesson | Google search, GBP, word of mouth | yes | live | `src/data/content.js` | form fires `qualify_lead` + Meta `Lead`; `form_location` hero / final |
| `/tutoring` | Same, for a parent choosing a suburb | Google "tutoring near me" | yes | live | `content.js` | `form_location` hub-hero |
| `/tutoring/<suburb>` | Same, suburb page (one per entry in `locations.js`) | Google local search | yes | live | `src/data/locations.js` | `form_location` suburb-hero / suburb-final |
| `/maths-map` | An email, in exchange for the maths skills map | Instagram posts, flyers (`utm_source=instagram`, `corkboard`) | yes | live | `src/data/skillsChainCopy.js` | sign-up fires GA4 `sign_up` + Meta `CompleteRegistration`, never `Lead` |
| `/maths-map/open` | The map itself (gated by the email, or `?pass=family` from a tutor's text) | From `/maths-map`, or a tutor's link | no | live | `skillsChainCopy.js` | booking form under the map fires `Lead` with `offer: diagnostic` |
| `/groundwork` | Book the free maths diagnostic (in-page calendar) | Groundwork website ads, `utm_campaign=groundwork-t1-2027`, `utm_content=<ad code>` | yes | live | `src/data/groundworkCopy.js` | booking fires `Lead` with `offer: groundwork`; `utm_content` travels into the Enquiries sheet |
| `/what-happens-next` | Explain the whole Groundwork program to a lead who already gave her number (no ask; one WhatsApp line at the end) | The Meta **instant form**'s thank-you button "See how it works" (`utm_medium=lead-form`) | no | live | `src/data/whatHappensNextCopy.js` (skills read from `skillsChain.json`) | fires Meta `ViewContent` on load; WhatsApp/phone taps fire `Contact`, never `Lead` (the form already counted it) |
| `/thank-you` | Confirm a website booking or lead; save our number | After any website form | no | live | `src/pages/ThankYou.jsx` | — |
| `/diagnostic` | Retired. 308 → `/` (`vercel.json`) | Old links only | no | redirect | — | — |

## Adding a page

1. Copy in its own `src/data/<name>Copy.js` with a test next to it (banned words, no prices, h1 not a question, headings end with a full stop).
2. Route in `src/App.jsx`; `<head>` data in `src/seo/pages.js` (`robots: noindex` unless it should rank); add the path to `PRERENDER_PATHS` so Vercel has a file to serve.
3. A `data-cy` on every section and a spec in `cypress/e2e/`: first-screen ask, no sideways scroll at 390px, the brand rules, the analytics events.
4. A row here. Put the UTMs the traffic will carry in the "Who arrives" column so the Enquiries sheet can be read later.
5. If it is a Meta destination, decide which pixel event the page's actions fire (`Lead` only for a parent asking to be called).

## Where the traffic rules live

- Ad concepts, scripts and UTM codes: `cowork/brand/meta-ads/` (not in this repo).
- Brand rules for the web: `cowork/brand/WEBSITE_GUIDELINES.md`.
