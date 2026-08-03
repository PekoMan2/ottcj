# Manual public pledge publication

The Google Form and its Google Sheet are private operational sources. This
repository receives only a deliberately sanitized public projection in
`fe/public/data/pledges.json`.

## Daily update

1. Open the private response Sheet using the approved owner account.
2. For each new response, confirm whether the person consented to publishing
   their name.
3. Add only `displayName` and `baseAmountEur` to the public JSON. Use the exact
   approved display-ready name when consent exists; otherwise use `null`, which
   the website renders as `Anonym`.
4. Set `updatedAt` to the ISO-8601 date and time of the update.
5. Never copy an email address, consent answer, private message, Sheet URL,
   response identifier, or any other source column.
6. Run the frontend tests and production build. Both reject unexpected fields,
   invalid names, timestamps, or amounts before deployment.
7. Review the JSON diff, commit it, and deploy through the normal reviewed
   repository workflow.

The public file starts empty. Do not add sample people or amounts. The minimum
pledge, retention process, Form confirmation behavior, and final payment flow
remain pending inputs in `docs/content-needed.md`.
