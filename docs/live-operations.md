# Garmin LiveTrack and lifecycle operations

This runbook is the operational contract for Milestone 6. The website links to
the active Garmin LiveTrack session; it does not ingest, embed or copy Garmin
location or performance data.

## Production prerequisites

Do not enable live-alert registration until all of these are complete:

1. Record the exact Garmin device, phone OS, Garmin Connect/Connect+
   subscription and authorized operator in `content-needed.md`.
2. Run a real test activity and verify the LiveTrack link, email invitation,
   SMS opt-in and start notification on the devices that will be used during
   the run.
3. Set `LIVE_ALERT_EMAIL_CAPACITY` and `LIVE_ALERT_SMS_CAPACITY` no higher than
   the limits proven by that test. A zero capacity disables that channel.
4. Obtain the approved consent text/version, GDPR disclosure and retention
   period. Set the same approved display text in
   `VITE_LIVE_ALERT_CONSENT_TEXT` and set the matching version in
   `VITE_LIVE_ALERT_CONSENT_VERSION`. The public form remains disabled if the
   frontend and backend versions differ.
5. Generate `LIVE_ALERT_DATA_KEY` as a cryptographically random 32-byte value,
   base64-encode it, and store it only in the production secret store. Losing
   the key makes stored contacts intentionally unrecoverable.
6. Change `TRACKING_SECRET` to a strong production secret. Never place either
   secret in a browser bundle, repository, screenshot, URL or operator export.
7. Rebuild the frontend after changing the consent display text, then set
   `LIVE_ALERTS_ENABLED=true` on the backend. Runtime phase changes do not
   require another frontend build.

## Before the start

1. Export pending registrations through the authenticated operator endpoint:

   ```text
   GET /api/admin/live-alert-subscriptions/export?status=pending
   Authorization: Bearer <TRACKING_SECRET>
   ```

2. Add each contact manually to Garmin Connect. Follow the tested Garmin flow
   for phone-number opt-in. Never copy the CSV to a shared drive, chat or
   analytics system.
3. Mark a successfully transferred record as `synced`; mark unusable or
   declined contacts as `rejected`:

   ```text
   PATCH /api/admin/live-alert-subscriptions/<id>
   Authorization: Bearer <TRACKING_SECRET>
   Content-Type: application/json

   { "status": "synced" }
   ```

4. Re-export `pending` until it is empty. If a proven Garmin capacity is full,
   lower that channel's configured capacity or set it to zero. The public form
   will stop accepting that channel.

## Starting and running live mode

1. Start the Garmin LiveTrack session on the tested device and confirm that a
   synced email and phone recipient received the expected message.
2. Copy the secure `https://...garmin.com/...` session URL from Garmin.
3. Atomically switch the website to live mode:

   ```text
   PUT /api/admin/event-state
   Authorization: Bearer <TRACKING_SECRET>
   Content-Type: application/json

   { "phase": "live", "liveTrackUrl": "https://livetrack.garmin.com/..." }
   ```

4. Open the public website in a private browser, confirm the `live` label and
   verify that the prominent button opens the active Garmin session. Pledges
   must remain available.
5. If Garmin starts a replacement session after signal, phone or battery loss,
   repeat steps 2–4 with the new URL. If no valid URL exists, update live mode
   with `liveTrackUrl: null`; the website will show an honest pending state.

## Publishing the result

Switch to `post` only after the result is official and the public copy is
approved. A finished result requires integer elapsed seconds; DNF stores no
elapsed time. Donation total and result copy are optional until verified.

```text
PUT /api/admin/event-state
Authorization: Bearer <TRACKING_SECRET>
Content-Type: application/json

{
  "phase": "post",
  "resultStatus": "finished",
  "elapsedSeconds": 208800,
  "resultCopy": "<approved result copy>"
}
```

The backend calculates the public multiplier from the approved boundaries.
Do not publish estimated elapsed time, donation totals or result copy.

## Retention, deletion and recovery

- The database stores encrypted contacts and keyed fingerprints only. Public
  endpoints expose capacity, never contacts or subscription identifiers.
- Operator exports contain personal data and use `Cache-Control: no-store`.
  Delete each local export immediately after the Garmin transfer.
- Purge expired database rows with authenticated
  `DELETE /api/admin/live-alert-subscriptions/expired` and remove the same
  contacts from Garmin according to the approved retention procedure.
- Database backups containing active subscriptions inherit the same retention
  deadline. Document and test deletion from backups before enabling the form.
- If the API is unavailable, do not guess the phase, result or URL. Keep the
  pledge path available, restore the database/API, and verify public state
  before resuming operator changes.
