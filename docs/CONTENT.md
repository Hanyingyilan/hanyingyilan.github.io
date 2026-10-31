# Content maintenance guide

Current structure: inline content in `index.html`; see [architecture](ARCHITECTURE.md).
Public copy uses Traditional Chinese. This guide describes how to maintain the
existing site; it does not validate the underlying political or benefit claims.

## Updating a policy

1. Locate the record in `PL` by its stable `id`. Inspect `p`, `t`, `body`, `ref`,
   `src`, existing `who` mappings, and optional `go` destination.
2. Read the cited source. Record its publication date and the date checked. Keep
   proposal/current-policy distinctions and qualifications intact.
3. Update related static text, `STOPS` comparison copy, calculator assumptions,
   video descriptions or metadata only where the same fact actually appears.
4. Check that `p` exists in `PIL`, links resolve, strings are valid JavaScript,
   and the details appear in the correct category. Preserve IDs unless a migration
   is documented.
5. Review the footer date if substantive public content changed. A documentation
   edit or formatting change does not itself make policy facts newly reviewed.

Cards currently show `ref` as plain text; the linked source list is separate in
`#sources`. A structured source registry is planned in
[#8](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/8). Until then,
check both places manually and identify unavailable sources honestly.

## Updating numerical assumptions

Amounts appear in `calc()`, static control labels, policy records, and sometimes
comparison text. Search for all occurrences before editing. The calculator combines
one-time birth support, nutrition support over selected months, and one annual elder
payment. Preserve the period explanation and avoid describing the total as a
recurring entitlement. Check zero, default, maximum and boundary cases using the
[validation guide](CONTRIBUTING.md).

The constants `ELECTION`, `BALLOT_NO`, the initial HTML badges, canvas footer, and
accessible labels also contain election-specific facts. `BALLOT_NO` alone does not
control every appearance of the number. Review all occurrences when those facts
change, using authoritative material rather than assuming a code constant is proof.

## Sources and media

Preserve descriptive source-link text, publication dates, and publisher attribution.
Some sources may require a login or block automated requests; that is not proof of
a dead link. Record the limitation and review manually when necessary.

For each new image or video, record origin, permission to use, attribution needs,
and a human-readable description. Check file size and dimensions. The portrait cycle
uses a hardcoded `LIST`; the canvas image uses `portrait-cut.png`; the social image
uses `og.png`. Replacing one does not update the others.

Local video is in `v/`; Facebook players and direct links are separate markup.
View counts are snapshots, not live metrics. If retained, date them and update them
deliberately. Do not invent captions or transcripts from a title or description.

## Sharing and dates

`SITE_URL` is the clean HTTPS homepage. Existing category shares use
`#six-intl`, `#six-traffic`, `#six-city`, `#six-tour`, `#six-resil`, and `#six-welfare`.
Keep those links working after navigation changes.

At the baseline, `og:url` includes `?v=6`, while the sharing helper does not. This
inconsistency is tracked in [#2](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2).
Image cache versions can change independently of the canonical page URL. Preview
experiments already have `noindex`; preserve it while they remain test pages.

When reviewing stale material, distinguish source publication, last factual review,
and deployment time. The election countdown currently updates only on page load.
Long-open-tab behavior and post-election maintenance are tracked in
[#16](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/16).
