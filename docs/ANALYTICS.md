# Analytics decision

On 2026-11-02 the owner chose **Search Console only** for the approximately
one-month maintenance period ([PR #30](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/30)).
It measures Google search visibility, not total visits or complete referral traffic,
and adds no visitor analytics script or service subscription. The unused beacon
loader and configuration have been removed; there is nothing to activate or shut down.

[Search Console](SEARCH-CONSOLE.md) owns access and reporting. This decision does
not schedule deletion of the site or its property. The original provider comparison
is available in [Git history](https://github.com/Hanyingyilan/hanyingyilan.github.io/blob/02dc16331a641c732c4a3877c61436c238c817a2/docs/ANALYTICS.md);
its pricing and provider behavior were inspected on 2026-11-01, not revalidated here.

A future change requires a new owner decision with a demonstrated measurement need,
current provider/cost review, privacy review, accountable maintainer and exit plan.
Under the [data-minimization principle](PRINCIPLES.md#7-minimize-data-collection-and-third-party-cost),
do not send persona/filter selections, policy choices, calculator inputs, full
queries, fragments, free text or personal identifiers. Review actual request
payloads, URLs and referrers with synthetic inputs; dashboard aggregation is not
proof of minimal collection. Retire collection separately from cancelling any
subscription and verify both. No provider acceptance is implied by this decision.
