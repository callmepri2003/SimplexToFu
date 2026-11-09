# Website leads → Enquiries tab

Every website form submission is written into the **Enquiries** tab of *Simplex Billing v3*, with the Channel dropdown already set and the details in Notes, e.g.

> Website form · 0412 345 678 · Year 5 · "The school said something" · via Google Business Profile · hero form

What it writes: **Date (B), Name (C), Channel (D), Notes (J)** in the first row whose Date is empty. Column A's ID formula, the Lost checkboxes and every other tab are never touched. Formspree still emails every lead, so if this ever fails you lose nothing.

## One-time setup (about 10 minutes)

1. Open **Simplex Billing v3** → **Extensions → Apps Script**.
2. Delete the placeholder code, paste the whole of [`Code.gs`](./Code.gs), and save. Name the project "Website enquiries".
3. **Project Settings** (gear icon):
   - Time zone → **(GMT+10:00) Sydney**.
   - Script Properties → **Add script property**: `ENQUIRIES_TOKEN` = the token you were given (any long random string works).
4. **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click Deploy, approve the Google permissions prompt, then copy the **Web app URL** (ends in `/exec`).
5. In **Vercel → simplex-tuition-web → Settings → Environment Variables**, add:
   - `VITE_ENQUIRIES_WEBHOOK_URL` = the `/exec` URL
   - `VITE_ENQUIRIES_TOKEN` = the same token as step 3
   Then redeploy.
6. Test: submit the form on the live site with name "TEST" and check the Enquiries tab. Delete that row's Date, Name, Channel and Notes afterwards (leave column A alone).

"Anyone" access is needed because parents' browsers aren't signed in to your Google account. The script only accepts requests carrying the token, rate-limits to 10 per minute, and neutralises spreadsheet formulas in anything typed into the form.

**Changing the script later:** Deploy → Manage deployments → edit → Version: *New version*. That keeps the same URL. A *new* deployment makes a new URL, which you'd have to paste into Vercel again.

## Channel values

The site only ever writes `Google`, `Facebook` or `Other`, matching the sheet's dropdown. `Referral` (word of mouth) can't be seen by a website: a link sent on WhatsApp arrives with no source. Those leads show as `Other` with **"ASK how they heard about us"** in Notes, so ask on the callback and change it to `Referral`.

## Tagged links (use these, or the source is invisible)

| Where | URL |
|---|---|
| Google Business Profile → Website | `https://simplextuition.com.au/?utm_source=google&utm_medium=organic&utm_campaign=gbp` |
| Google Business Profile → Appointment link | `https://simplextuition.com.au/?utm_source=google&utm_medium=organic&utm_campaign=gbp&utm_content=appointment#book` |
| Door sign / flyer QR code | `https://simplextuition.com.au/?utm_source=qr&utm_medium=print&utm_campaign=door-sign` (change `door-sign` to `flyer`, `stall`…) |
| Facebook / Instagram ad | `https://simplextuition.com.au/?utm_source=facebook&utm_medium=paid&utm_campaign=<campaign-name>` |

## Groundwork bookings → Google Calendar (added Oct 2026)

The `/groundwork` page lets a parent pick her own day and time. The same script handles it:

- **POST** with `slotStart` (ISO, Sydney offset) also fills **Trial Date (F)** on the Enquiries row and creates a **one-hour event in the default Google Calendar** of the account the script runs as, titled `Groundwork diagnostic · <child> (<year>)`, located at the parent's address or at 27 Carnamah Rd, with phone, email and source in the description. Nothing is confirmed by phone or text afterwards: the booking on the page is the booking in the diary.
- **Double bookings:** the script checks the calendar for an overlapping Groundwork event *inside its lock* before writing anything, and answers `{ ok: false, error: 'slot_taken' }`; the page then redraws the calendar and asks her to pick again. The page also re-reads taken slots right before submitting.
- **Confirmation:** when the parent gives an email she is added as a guest with `sendInvites`, so Google emails her the invite (time, address, add-to-calendar) and its own reminders. No separate email tool is needed. SMS is not wired: see the brain's Groundwork project note for the recommendation.
- **GET** (no token) returns `{ taken: [ISO starts] }` for Groundwork events in the next 21 days, so the page greys out slots already booked. Set `VITE_BOOKINGS_URL` in Vercel to the same `/exec` URL. Leave it blank and every slot shows (clashes then show up in the calendar, not on the page).

**Redeploy after pasting the new `Code.gs`** (Deploy → Manage deployments → edit → New version). The first run asks for a Calendar permission: approve it. The calendar used is the default calendar of whoever deploys the script, so deploy from the Simplex Google account whose calendar Pri actually checks.

Hours the page offers are in `src/utils/slots.js` (weekdays 4–7pm, Saturdays 9–11am and 1–3pm, from tomorrow, two weeks ahead, no Sundays). Change them there; the unit test pins them.
