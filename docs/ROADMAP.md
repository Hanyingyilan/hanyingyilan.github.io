# Prioritized improvement roadmap

Created 2026-11-01 from baseline `4259eda6c524b90da846c3acb0ab957642ddd427`.
All 16 implementation tickets below are open at creation. This is a planning
snapshot; GitHub issues are the source of truth for subsequent status changes.
No production changes are included in the initial documentation commit.

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

## Suggested implementation sequence

1. Start owner-led indexing baseline **#3** and performance baseline **#5** while
   implementing canonical consistency **#2** and complete initial HTML **#1**.
2. Coordinate source modeling **#8** with #1; ship crawler artifacts **#4** once
   canonical URLs are settled. Add the relevant regression checks from **#11**.
3. Use measured results for performance changes **#5**. Address calculator consistency
   **#12** and keyboard/focus behavior **#13** alongside the first engineering cycle.
4. Add substantive category pages **#6** only after the content source is settled;
   align their metadata **#7** and update the sitemap. Schema **#9** follows verified
   identity/source information. Video work **#10** depends on available source media.
5. Complete data cleanup **#14**, modularization **#15**, and lifecycle/provenance
   work **#16**. Assign post-election ownership early even if implementation is later.

The site does not need a framework migration before SEO work. No ranking increase,
rich result, indexing deadline, or performance score is promised by these tickets.

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

## Using the tickets

Each issue contains source evidence, bounded work and checkable acceptance criteria.
`SEO-*` and `ENG-*` IDs are stable audit identifiers, not GitHub issue numbers.
Dependencies in older issue text can be resolved through the tables above.

A maintainer should assign a responsible person when scheduling a ticket. Search
Console verification needs an authorized site owner; content/source questions need
someone able to verify the material; code changes need implementation and review.
No named owner or deadline has been invented by this audit.

Use the [SEO audit](SEO-AUDIT.md) for measured/observed evidence and its limitations,
the [principles](PRINCIPLES.md) for design constraints, and the
[contributor guide](CONTRIBUTING.md) for validation and release steps. Close an issue
only after its required checks are complete; record external-access blockers and
split follow-up work explicitly instead of marking unverified outcomes complete.
