# One-month analytics decision — 2026-11-01

Deployment is pending an owner-selected account and public site configuration.
The optional integration is now present but disabled; no account, real token,
subscription or live collection has been enabled. The generated default page
contains no analytics loader.
The dated evaluation favored Cloudflare's manual beacon for its then-free service
and lack of hosting migration. This records that evaluation, not a fresh quote or
an account/deployment decision. Search measurement has a separate
[Search Console handoff](SEARCH-CONSOLE.md).

## Provider comparison at inspection

Official pricing/docs were inspected on 2026-11-01. Dollar amounts are USD,
before any applicable tax. Claims of “current” offerings in this snapshot refer
to that inspection date; recheck pricing, limits and collection behavior before
selection. No paid service was purchased. Estimates exclude maintainer time.

| Option | One-month service budget | Coverage and maintenance | Retention/export/exit |
| --- | --- | --- | --- |
| Cloudflare Web Analytics, manual beacon | $0 under the current free offering | Page views/visits, referrals, device/browser/country and real-user performance; account plus one snippet; no DNS/proxy migration needed | Previous six months accessible; aggregate GraphQL export available, permission/dataset access must be confirmed with owner; remove snippet and verify no requests on exit |
| Plausible Starter | $9/month at up to 10k monthly pageviews; 30-day trial currently offered without card | One site/solo use; aggregate traffic, referrals/devices; automatic engagement collection requires extra scrutiny under this project's constraints | Pricing page says no retention limit; dashboard CSV/site-settings export; remove snippet and cancel subscription separately |
| Plausible Growth | $14/month at the same tier | Up to 3 sites and 3 team members; use only if team access is needed | Same planned exit; larger traffic tiers cost more |
| Search Console only | $0; no analytics beacon | Google search clicks/impressions/CTR, not total visits or all referrers; authorized property needed | Export suitable aggregate reports; no site analytics script to retire |

Cloudflare describes its free service and non-proxy setup in
[About](https://developers.cloudflare.com/web-analytics/about/) and
[manual installation](https://developers.cloudflare.com/web-analytics/get-started/).
The non-proxied limit is currently 10 sites; rule-based controls are proxy-only
([limits](https://developers.cloudflare.com/web-analytics/limits/)). The
[FAQ](https://developers.cloudflare.com/web-analytics/faq/) states six months of
accessible data, no query-string logging/UTM support, and no custom events.
The [dimensions guide](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/)
includes referrer host in the UI and referrer path through GraphQL. Dashboard
aggregation therefore does not mean no potentially sensitive request context.

Plausible's [live monthly pricing](https://plausible.io/#pricing) was checked with
the 10k slider and Monthly selected: Starter $9, Growth $14, Business $19. The
[subscription guide](https://plausible.io/docs/subscription-plans) confirms the
30-day trial and that pageviews plus custom events determine the usage tier.
A calendar month or a previously used trial may not fit a new 30-day trial;
budget one paid month if needed, with no automatic renewal assumed authorized.

## Collection and privacy constraints

This section specifies the integration requirements under the broader
[data-minimization principle](PRINCIPLES.md#7-minimize-data-collection-and-third-party-cost).

The [Plausible data policy](https://plausible.io/data-policy) describes individual
event/session records behind aggregate dashboards, daily identifiers derived from
IP/User-Agent/site, engagement measurements and retained campaign/referral query
parameters. It states no raw IP/User-Agent storage or persistent cookies. That is
broader than “only page totals”; the default snippet is not automatically a fit.
Disable or avoid engagement, custom properties, outbound/download/form goals and
hash routing if selected, then inspect the actual payload. Do not assume an
aggregate dashboard means only aggregate data was collected.

Cloudflare's [collection documentation](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/)
identifies `static.cloudflareinsights.com/beacon.min.js` and the non-proxy reporting
endpoint `cloudflareinsights.com/cdn-cgi/rum`. Expect script download plus load/leave
performance reports, not exactly one request for a pageview. Cookie-free vendor
claims do not replace review of the site's notice, provider processing and owner
requirements. Exact script bytes/request costs depend on the owner-selected
snippet and version; they have not been measured for this site. Search Console
adds no visitor-side script bytes.

Never send persona/filter selections, policy choices, calculator counts/months,
full query strings, category fragments, free text or personal identifiers. Do not
add event listeners to those controls for analytics. Test payloads using synthetic
inputs and URLs, and check both request body and URL/referrer headers on navigation,
page hide and category hash changes. Reject deployment if prohibited data is sent;
do not silently relax the requirement to fit a provider. AI referrers only count
identifiable referral visits, not total AI citations or recommendations.

## Disabled integration and activation

`content/analytics.json` defaults to `enabled: false`, `siteToken: null`. Missing
configuration also emits no loader. `scripts/build.mjs` calls `src/analytics.mjs`;
an enabled configuration without a 32-character hexadecimal public site token
fails the build. No secret belongs in this file. The independent inline bootstrap
uses the [official manual beacon](https://developers.cloudflare.com/web-analytics/get-started/)
and its `data-cf-beacon` token. It only appends the vendor script when the browser
origin equals `content/site.json`'s production origin, and appends it at most once.
Local/fork origins never initialize it. It adds no control listeners, custom
interaction events or URL rewriting. Provider failure does not block core scripts.

Tests cover disabled/absent/invalid configuration, origin guards, duplicate
initialization and blocked-provider core behavior. These are integration tests,
not vendor dashboard or privacy acceptance. Before enabling, inspect the actual
owner-selected vendor version with synthetic query parameters, fragments, referrer,
calculator values and page-hide/navigation requests. Intercept reporting requests
before transmission. Check payloads AND request URLs/referrer headers; a clean
UI or aggregate dashboard is insufficient. If any forbidden field is present,
leave `enabled: false`; do not implement a custom reporting protocol to bypass it.

## Owner checklist and shutdown

Before deployment record the accountable maintainer, account ownership, approved
public site ID/snippet, planned start, end (start + 30 days), spend cap, retention
choice and export destination. All are pending; no account secrets or private
reports belong in this public repository. Choose an export retention deadline in
the owner's private record. Do not create an unnecessary backend for one month.

At staging, capture a single visit and verify provider dashboard counts, permitted
payload fields, no sensitive interaction telemetry, and degraded-service behavior.
Measure bytes/requests/LCP/CLS/main-thread overhead using the same conditions as
[PERFORMANCE.md](PERFORMANCE.md), then repeat with the provider blocked. Do not
mark acceptance complete from source inspection alone. Exact script size and the
live dashboard are pending the selected account/configuration.

At the agreed end date, export approved aggregates to private storage, set `enabled: false` in
`content/analytics.json` and regenerate, deploy and verify the absence of
beacon requests including on page hide. Disable/remove the provider site as the
owner selects; permanent data deletion requires the owner's deliberate action.
For Plausible, also [cancel the plan](https://plausible.io/docs/cancel-subscription):
cancellation alone does not immediately stop collection. Use the
[export guide](https://plausible.io/docs/export-stats) before deletion. For Cloudflare,
confirm permitted aggregate GraphQL export in the selected account before relying
on it. No automatic future cleanup or subscription cancellation has been scheduled.

The owner may select “no additional analytics”; then only Search Console setup
remains. Keep this issue pending until account choice, privacy/network validation,
measurement and the shutdown owner/date are recorded.
