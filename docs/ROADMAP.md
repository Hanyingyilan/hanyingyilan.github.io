# Roadmap

GitHub issues own live status and acceptance criteria. This snapshot was reconciled
on 2026-11-02 after [PR #32](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/32).
The original P1/P2 implementation sequence is complete; inspect current source
before treating a historical audit finding as a remaining defect.

## Remaining work

| Priority / issue | Next action | Owning guide / dependency |
| --- | --- | --- |
| P1 [#3](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/3) | Recheck report availability after November 3, then compare completed observation windows | [Search Console](SEARCH-CONSOLE.md); authorized owner and available data |
| P1 [#4](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/4) | Recheck unresolved sitemap processing and record Google's result | [Search Console](SEARCH-CONSOLE.md); service processing, not speculative XML edits |
| P2 [#10](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/10) | Complete human audio/subtitle review, verify original publication date and review embedded-video text access | [Content](CONTENT.md#media-provenance-inventory); source material and human review |

These were the only open issues at reconciliation. An unavailable measurement is
not zero, and local tests do not complete owner/service acceptance. Assign the
appropriate owner when scheduling work; this file creates no automatic follow-up.

## Decisions and completed work

- [PR #28](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/28) integrated
  initial HTML, canonical/crawler output, source model, calculator, accessibility,
  performance and publishing checks. The earlier stacked PRs are covered there.
- [PR #29](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/29) added
  ownership verification; [PR #30](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/30)
  records the [Search Console-only analytics choice](ANALYTICS.md).
- [PR #31](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/31) completed
  source/performance review and accessibility corrections.
- [PR #32](https://github.com/Hanyingyilan/hanyingyilan.github.io/pull/32) added
  category pages, metadata/schema, filter validation, optional-feature guards,
  election lifecycle and subtitle text. Full video acceptance remains #10.
- The [architecture decision](ARCHITECTURE-PROPOSAL.md) and
  [public-data decision](CONTENT.md#machine-readable-policy-data-decision) explain
  why no framework migration or separate JSON API is planned.

Use [Contributing](CONTRIBUTING.md) for validation/release, and the dated
[SEO audit](SEO-AUDIT.md) for the original evidence. Completed verification and
rollback records stay in their PRs instead of becoming repository checklists.
