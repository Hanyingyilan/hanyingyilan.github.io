# Search Console ownership and observation

## Current status — 2026-11-02

The authorized site owner verified the production URL-prefix property using the
HTML tag published by upstream PR #29. Keep that public tag in the generated
homepage. No account identifiers, credentials or user-level reports belong here.

Google's indexed homepage report selected the inspected root as canonical; its
last crawl was October 29, before the latest release. The November 2 live test
successfully fetched the current page and reported that it can be indexed; all
23 policy articles matched the
HTTP response and browser DOM. `/index.html` and `/?v=6` were unknown to Google,
with no crawl or canonical data; this does not establish a crawl failure.

The sitemap was submitted, but the report still says `Couldn't fetch` despite
a successful Google live fetch of `/sitemap.xml`. Issue #4 owns that unresolved
processing result. Do not repeatedly change valid XML or resubmit merely to make
the report appear complete.

Performance reports still show `Processing data, please check again in a day or
so`. Mobile and desktop Core Web Vitals both report insufficient usage data for
the last 90 days. These are unavailable measurements, not zero traffic or passing
field performance. Issue #3 owns the comparable-window follow-up: first recheck
report availability after November 3, then compare completed windows when data
exists, recording the short campaign lifetime and election-related confounding.
No future check or automatic schedule has been performed or created.

## Historical access observation — 2026-11-01

Access observation as of 2026-11-01: target-site access was unavailable. The
signed-in browser's Search Console property selector was inspected that day; it did not list
`https://hanyingyilan.github.io/` or a matching domain property. No property was
created, no token was generated, and no indexing data for this site was available.
This is an access observation for one account, not proof nobody has verified it.
No unrelated property names, account identifiers or private metrics are recorded.

The production URL remains `https://hanyingyilan.github.io/`, even while review
work is merged into the fork. Fork `main` is not evidence of upstream deployment.
The responsible role is the authorized production-site owner; private account
details are intentionally omitted.

## Verification preparation

On 2026-11-02, the site owner confirmed that no property had been created.
A URL-prefix property for `https://hanyingyilan.github.io/` was added and Google's
actual HTML verification tag was placed in `src/index.template.html`. This is a
public ownership-verification artifact, not an account credential. Keep it in the
generated homepage after verification. Publication and the Search Console Verify
step were subsequently completed on November 2; the current status above
supersedes the earlier preparation state.

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
settings. Obtaining a tag alone is not verification; check the owner interface and
production response when repeating this procedure.

## Baseline and follow-up record

Use the [URL Inspection tool](https://support.google.com/webmasters/answer/9012289)
on `/`, `/index.html` and `/?v=6`. Inspect the clean root for hash
links because fragments are not separate server resources. Once category pages
are deployed, inspect each `policies/<key>.html` separately and confirm its
self-canonical and complete category content. Record the inspected
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
| Ownership | Verified production URL-prefix property using the published HTML tag | Retain the tag |
| Indexing/canonical | Root indexed; current live HTML checked; duplicate variants unknown | Recheck after recrawl; #4 tracks sitemap processing |
| 28-day baseline | New property is processing data | Record appropriate aggregates when available |
| Post-deployment comparison | Latest release is deployed; observation window has not elapsed | Repeat with the same filters and comparable completed dates |

Verification and live fetching do not establish that the latest version has been
indexed, or that clicks, impressions or ranking improved. Release evidence belongs
in PR and Git history, separately from these owner observations.
