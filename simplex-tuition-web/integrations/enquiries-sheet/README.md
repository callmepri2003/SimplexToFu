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
