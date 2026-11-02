# Search Console owner handoff — 2026-11-01

Access observation as of 2026-11-01: target-site access was unavailable. The
signed-in browser's Search Console property selector was inspected that day; it did not list
`https://hanyingyilan.github.io/` or a matching domain property. No property was
created, no token was generated, and no indexing data for this site was available.
This is an access observation for one account, not proof nobody has verified it.
No unrelated property names, account identifiers or private metrics are recorded.

The production URL remains `https://hanyingyilan.github.io/`, even while review
work is merged into the fork. Fork `main` is not evidence of upstream deployment.
The responsible role is the authorized production-site owner; a named person and
review deadline have not been assigned.

## Verification preparation

Ask the existing owner for appropriate access before making another property.
If none exists, the owner can create a URL-prefix property for the exact HTTPS
root. On GitHub Pages this avoids assuming control of `github.io` DNS. Use the
actual HTML tag or file supplied by Search Console; never invent a placeholder
verification token in production. Keep credentials and account details private.
[Google ownership guidance](https://support.google.com/webmasters/answer/9008080)
describes the supported methods and periodic re-verification.

For a meta tag, edit `src/index.template.html` inside `head` and regenerate. For an
HTML verification file, preserve Google's exact filename/content and add that path
to `content/publishing.json` public files. Follow the
[validation and release procedure](CONTRIBUTING.md) for generation, browser checks
and publication-output verification. Verify the actual production response
contains the supplied token before the owner presses Verify. Retain the token
while ownership is needed; do not overwrite other owners' tokens or change Pages
settings. Owner approval and the real public verification artifact remain pending.

## Baseline and follow-up record

Use the [URL Inspection tool](https://support.google.com/webmasters/answer/9012289)
on `/`, `/index.html` and `/?v=6`. Inspect the clean root for hash
links because fragments are not separate server resources. Record the inspected
URL, date, last crawl, indexing status, user-declared and Google-selected canonical,
crawl errors and rendered HTML coverage. Confirm all 23 policies, sources, dates,
and status text after upstream deployment. Confirm retired preview URLs return 404
after the cleanup is deployed. The root canonical is a declaration, not Google's selection.

Submit the actual production `/sitemap.xml` and record its processing status after
checking the response. Follow the [sitemaps report](https://support.google.com/webmasters/answer/7451001).

Record an aggregate, completed 28-day window: dates/time zone, search type/country
filters, clicks, impressions, CTR, indexed-page count and exclusions. Keep query
and user-level exports private. If data is absent, record “insufficient data”;
do not turn unavailable metrics into zeros. Use the same filters and comparable
28-day window after deployment, noting deployment date and seasonal/election
changes. See [Performance report guidance](https://support.google.com/webmasters/answer/7576553).

| Acceptance | Current evidence | Owner action still needed |
| --- | --- | --- |
| Ownership | No matching property in available account | Identify owner; verify or grant access |
| Indexing/canonical | No target-site report access | Inspect representative URLs |
| 28-day baseline | Unavailable | Export only appropriate aggregates privately |
| Post-deployment comparison | No upstream deployment in this task | Record release date and repeat observation |

This handoff records no verification success, sitemap submission, indexing, clicks,
impressions or ranking improvement. Fork integration evidence belongs in PR and
Git history, separately from these owner observations.
