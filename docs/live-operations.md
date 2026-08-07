# Garmin LiveTrack and lifecycle operations

This runbook covers race-day operation of the static website. The site links
to the active Garmin LiveTrack session; it does not ingest, embed or copy
Garmin location or performance data. All lifecycle state is baked into the
frontend bundle from `VITE_*` variables in `fe/.env.production` at build
time, so every change below means: edit `fe/.env.production`, rebuild,
redeploy, verify.

## Notification signups (Google Form)

Run-start notifications are collected in a Google Form linked from the
pre-start tracking panel. Google Forms stores the responses; the website
stores nothing.

Before the start:

1. Open the linked Google Sheet of form responses.
2. Add each contact manually to Garmin Connect following the tested Garmin
   flow for email invitations and phone-number opt-in.
3. Do not copy the responses to any other drive, chat or analytics system.
   Delete local exports immediately after the Garmin transfer.
4. After the run, delete contacts from Garmin and clear the form responses
   according to the approved retention procedure.

## Phase lifecycle

The phase is derived from the clock: before `VITE_EVENT_START_AT`
(`2026-08-13T08:00:00+02:00`) the site is `pre`, from that moment on it is
`live`, with no deploy needed for the flip. Only `post` is set manually.
Production builds refuse a forced `pre` or `live`; that override exists only
for local development.

## Before the start (pre phase)

The deployed default needs no configuration. Override `VITE_EVENT_START_AT`
in `fe/.env.production` only if the official start moves.

## During the run (live phase)

1. Start the Garmin LiveTrack session on the tested device and confirm a
   test recipient received the expected message.
2. Copy the secure `https://...garmin.com/...` session URL from Garmin.
3. In `fe/.env.production` set:

   ```text
   VITE_GARMIN_URL=https://livetrack.garmin.com/...
   ```

4. Rebuild and redeploy (`npm run rebuild`), then open the public website in
   a private browser. Verify that the Garmin buttons open the active session
   and that the donation links remain available. A build with an invalid
   combination of `VITE_*` values fails loudly in the browser, so always
   verify after deploying.
5. If Garmin starts a replacement session after signal, phone or battery
   loss, repeat steps 2-4 with the new URL. If no valid URL exists, clear
   `VITE_GARMIN_URL` and rebuild; the website shows an honest pending
   state.

## Publishing the result (post phase)

Switch to `post` only after the result is official and the public copy is
approved. A finished result requires whole elapsed seconds; DNF must not set
elapsed time. The donation total and result copy are optional until verified.
The bet multiplier is derived from the elapsed time automatically.

```text
VITE_EVENT_PHASE=post
VITE_GARMIN_URL=
VITE_RESULT_STATUS=finished
VITE_RESULT_ELAPSED_SECONDS=208800
VITE_RESULT_FINAL_DONATION_EUR=12500
VITE_RESULT_COPY=<approved result copy>
```

Rebuild, redeploy and verify the result panel on the public website. Do not
publish estimated elapsed time, donation totals or result copy.
