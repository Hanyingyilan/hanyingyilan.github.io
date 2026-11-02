# Prioritized improvement roadmap

Issue inventory and dependency guide, created 2026-11-01 from baseline `4259eda`
and expanded to include #17–#20. GitHub issues own acceptance criteria and live
status. Pull requests and Git history own fork merge/evidence records;
a completed local change does not close an owner/deployment acceptance gap.

## Priority and effort

- **P0:** active outage, sitewide accidental blocking, or similarly urgent confirmed
  failure. None was established in this audit.
- **P1:** first implementation cycle: SEO foundations and important correctness or
  accessibility issues. Sequence SEO work first as requested; do not postpone a
  confirmed harmful regression merely because it is outside SEO.
- **P2:** subsequent improvements after the foundations or required measurements.

Effort estimates assume one contributor familiar with this small site: S is up to
one working day; M is roughly two to three days. They are planning estimates, not
commitments; owner access, source verification and review can add elapsed time.
Priorities are in issue titles and bodies. No priority labels or Project fields
were created because the current account does not have repository triage access.

## Work sequence

The original first-cycle sequence has been implemented in the fork; inspect merged
pull requests and the current source before starting an issue. The tables below
remain an inventory, not a list of untouched defects.

1. Complete review and production release through [CONTRIBUTING](CONTRIBUTING.md#release-and-rollback).
   Owner-led acceptance for #3, #5, #8, #17 and #18 requires external evidence.
2. Evaluate category pages #6 after the shared content model, coordinating metadata
   #7 and sitemap #4. Schema #9 requires verified identity/source information;
   video #10 requires available source media. Machine-readable data #19 needs a
   demonstrated consumer and the source/schema dependencies recorded in its issue.
3. Address remaining data cleanup #14, optional-feature isolation #15 and lifecycle/
   provenance #16. Assign post-election ownership early, even if other work is later.

The site does not need a framework migration before SEO work. These tickets do
not promise ranking increases, rich results, indexing deadlines or performance scores.

## SEO backlog

| ID / issue | Priority | Improvement | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| [SEO-01 / #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1) | P1 | Serve all policy content and the main heading in initial HTML | M | None |
| [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2) | P1 | Align canonical URLs, sharing metadata and duplicate URL handling | S | None |
| [SEO-03 / #3](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/3) | P1 | Establish Search Console ownership and an indexing baseline | S | Owner access; [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2) informs canonical checks |
| [SEO-04 / #4](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/4) | P1 | Add a canonical sitemap and safe crawler configuration | S | [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2); [SEO-03 / #3](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/3) for submission |
| [SEO-05 / #5](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/5) | P1 | Measure mobile performance and remove unnecessary startup work | M | None |
| [SEO-06 / #6](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/6) | P2 | Provide stable crawlable category URLs and preserve existing deep links | M | [SEO-01 / #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1), [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2), [SEO-04 / #4](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/4) |
| [SEO-07 / #7](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/7) | P2 | Keep page titles, descriptions, social metadata and site icon consistent | S | [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2); coordinate H1 with [SEO-01 / #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1) |
| [SEO-08 / #8](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/8) | P1 | Make policy citations, publisher identity and freshness auditable | M | Coordinate source model with [SEO-01 / #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1) and [ENG-02 / #12](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/12) |
| [SEO-09 / #9](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/9) | P2 | Add factual structured data consistent with visible content | S | [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2), [SEO-08 / #8](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/8) |
| [SEO-10 / #10](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/10) | P2 | Make video information accessible and assess video indexing eligibility | M | [SEO-02 / #2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2), [SEO-05 / #5](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/5); [SEO-04 / #4](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/4) if watch pages ship |

## Other engineering improvements

| ID / issue | Priority | Improvement | Effort | Dependencies |
| --- | --- | --- | --- | --- |
| [ENG-01 / #11](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/11) | P1 | Add automated checks for content, SEO and interactive regressions | M | Coordinate checks with [#1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1), [#2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2), and [#4](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/4) |
| [ENG-02 / #12](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/12) | P1 | Centralize calculator assumptions and test numerical boundaries | M | Coordinate with [SEO-08 / #8](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/8) |
| [ENG-03 / #13](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/13) | P1 | Fix dialog focus, keyboard control scope and ambiguous control names | M | None |
| [ENG-04 / #14](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/14) | P2 | Reconcile unused content keys and remove stale implementation remnants | S | [SEO-01 / #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1); [ENG-01 / #11](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/11) for validation |
| [ENG-05 / #15](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/15) | P2 | Separate content and optional features without requiring a framework migration | M | [SEO-01 / #1](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1), [ENG-01 / #11](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/11), [ENG-02 / #12](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/12) |
| [ENG-06 / #16](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/16) | P2 | Document release ownership, media provenance and post-election maintenance | M | None |

## Cross-cutting follow-ups and architecture

These supplement the original ten SEO and six engineering tickets. Their acceptance
criteria reference existing work rather than requesting duplicate implementations.

| Issue | Priority | Scope | Dependencies / coordination |
| --- | --- | --- | --- |
| [#17](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/17) | P1 | One-month analytics choice, minimal integration and shutdown | Owner account/configuration; #3 search metrics and #5 performance; [handoff](ANALYTICS.md) |
| [#18](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/18) | P1 | Crawler access, complete HTTP content and owner observations | #1, #2, #3, #4, #8; coordinate #9; [handoff](CRAWLABILITY.md) |
| [#19](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/19) | P2 | Evaluate useful machine-readable policy data; no format presumed necessary | #1, #8, #9 |
| [#20](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/20) | P1 | Architecture decision and original five-ticket sequence | Coordinates #11 → #1 → #2 → #4 → #12; [decision record](ARCHITECTURE-PROPOSAL.md) |

## Using the tickets

Each issue contains source evidence, bounded work and checkable acceptance criteria.
`SEO-*` and `ENG-*` IDs are stable audit identifiers, not GitHub issue numbers.
Dependencies in older issue text can be resolved through the tables above.

A maintainer should assign a responsible person when scheduling a ticket. Search
Console verification needs an authorized site owner; content/source questions need
someone able to verify the material; code changes need implementation and review.
No named owner or deadline has been invented by this audit.

Use the dated [SEO audit](SEO-AUDIT.md) for baseline evidence and its limitations,
the [principles](PRINCIPLES.md) for design constraints, and the
[contributor guide](CONTRIBUTING.md) for validation and release steps. Close an issue
only after its required checks are complete; record external-access blockers and
split follow-up work explicitly instead of marking unverified outcomes complete.
