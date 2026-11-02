# Search Console ownership and observation

## Current status — 2026-11-02

The authorized owner verified the production URL-prefix property
`https://hanyingyilan.github.io/` using the HTML tag from
[PR #29](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/29). Keep that
public tag in `src/index.template.html` and generated output. Credentials,
account identifiers and user-level reports stay private.

The recorded owner observations are summarized below; detailed verification
history belongs in the linked issues. These are not fresh checks of Google.

| Observation | Remaining action |
| --- | --- |
| Root indexed with the inspected URL selected as canonical, last crawled October 29; November 2 live test fetched the new HTML and all 23 policies | Recheck after recrawl; live fetch is not proof of latest-version indexing |
| `/index.html` and `/?v=6` unknown to Google | Record results without inferring a crawl failure |
| Sitemap submitted; `Couldn't fetch` remains despite successful live fetch | [#4](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/4): recheck processing; do not repeatedly edit valid XML or resubmit without evidence |
| Performance report processing; mobile/desktop CWV lack sufficient usage data | [#3](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/3): recheck after November 3, then compare completed windows when available |

## Ownership maintenance

Ask the existing owner for access before creating another property. If a new
verification is necessary, use Google's actual tag/file for the exact HTTPS root;
a URL-prefix property avoids assuming control of `github.io` DNS. For a meta tag,
edit the template and regenerate. For a verification file, preserve its exact
name/content and add it to `content/publishing.json`.

Follow [release validation](CONTRIBUTING.md#release-and-rollback), check the actual
production response, then verify in the owner interface. Retain the token while
ownership is needed and preserve other owners' tokens. See
[Google ownership guidance](https://support.google.com/webmasters/answer/9008080).

## Baseline and follow-up record

1. Use [URL Inspection](https://support.google.com/webmasters/answer/9012289) on
   `/`, `/index.html`, `/?v=6` and each `policies/<key>.html`. Fragments are not
   separate server resources. Record date, last crawl, indexing/crawl status,
   declared/Google-selected canonical and rendered content coverage against the
   current policy/source data. Canonical declarations do not establish Google's choice.
2. Check production `/sitemap.xml`, submit it if needed and record its
   [processing status](https://support.google.com/webmasters/answer/7451001).
3. Record aggregate completed observation windows: dates/time zone, search type,
   country filters, clicks, impressions, CTR, indexed-page count and exclusions.
   Prefer comparable 28-day windows where available; record insufficient data
   explicitly. Keep query/user exports private. Repeat with identical filters,
   noting release dates, the short campaign lifetime and election-related changes.
   See [Performance report guidance](https://support.google.com/webmasters/answer/7576553).

HTTP checks belong to [Crawlability](CRAWLABILITY.md); deployment evidence belongs
in the release PR. Neither proves indexing, traffic growth or ranking improvement.
