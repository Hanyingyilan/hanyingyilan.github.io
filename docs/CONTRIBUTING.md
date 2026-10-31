# Development, validation, and release

## Local work

Inspect `git status` first and use a review branch for changes. The historical baseline had no tooling. Current development uses Node.js 22+ and
pinned development-only Playwright. Run `npm ci`, `npm run build`, `npm run check`,
`npm test`, then `npx playwright install chromium` and `npm run test:e2e`. CI runs
freshness, native tests, and Chromium smoke checks. Generated public files must be
committed with source changes.
Python 3 provides a sufficient local static server:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000/>. Assets use relative paths. External fonts/players
need network access; core information should tolerate their failure. Clipboard and
sharing depend on browser support and context, so validate their fallback paths too.

## Lightweight checks

Always inspect the diff and whitespace:

```sh
git diff --check
git diff --stat
```

`npm test` includes syntax checks for public scripts and negative checks proving
that duplicate IDs, missing resources/fragments and stale output are rejected.
`npm run test:e2e` starts a Python HTTP server automatically.

For documentation-only changes, verify relative links, filenames, commands and
claims against the source. There is no reason to install an application test stack
for prose alone.

## Browser smoke checks for runtime changes

Run checks relevant to the diff and record browser/device details and failures.

| Area | Check |
| --- | --- |
| Startup | Heading, six categories, four filters and default cards render; no uncaught application errors |
| Categories | All six open; details expand/collapse; direct `#six-welfare` load works |
| Filters | Multi-select, clear and select-all work with documented semantics |
| Calculator | Default 95,200; all zero 0; maximum controls 723,200; months 0 and 24; counts cannot exceed bounds |
| Comparison | All three stops and both states show matching text and graphic |
| Sharing | Clipboard success/failure, LINE URL, image dialog, save and unsupported-share fallback |
| Accessibility | Keyboard focus, modal close/return, slider names, large text, dark/light theme, reduced motion |
| Responsive | Narrow 320px viewport, common mobile width, desktop, 200% browser zoom |
| Media | Portrait cycle, local video/poster, embedded-player fallback links |
| Optional features | Game open/close/restart and no interference with other controls; animations remain optional |

Known gaps are tracked, not waived: the image dialog lacks complete focus
management, and the game has an overly broad Space shortcut
([#13](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/13)). The complete non-JavaScript overview is generated from all 23 policy records.

Calculator values above are regression expectations for the baseline constants,
not benefit advice. Recalculate expectations when reviewed source assumptions change.

## SEO validation for relevant changes

Compare response HTML with the rendered DOM. Check titles, descriptions, canonical
URL, headings, content coverage, source anchors and any JSON-LD. Verify live status
codes for canonical pages, duplicate variants, media and an unknown path. Preserve
preview `noindex` and do not block crawling of pages that must expose that directive.

Use the [SEO audit](SEO-AUDIT.md) and issue acceptance criteria. A private Search
Console owner must verify actual indexing and Google-selected canonical; source
inspection alone cannot establish either. Performance reports must state test
conditions and distinguish lab data from field Core Web Vitals.

## Release and rollback

1. Review the exact diff, source changes and relevant validation evidence. Keep
   documentation, factual changes, and broad refactors easy to assess separately.
2. Commit to the review branch. Record the source commit and the checks actually run.
3. Integrate through the maintainers' review process. The observed Pages source is
   `main` at `/`; merging there may publish the change. Do not change Pages settings
   or assume a feature branch is a private staging site.
4. Check the Pages deployment/build status and then the live page, assets, fragment
   links, metadata and response codes. Record deployment time separately from a
   factual-content review date.
5. If a release must be rolled back, revert the offending commit through the same
   review/release process and verify the resulting deployment. Avoid rewriting
   shared history or assuming a local reset changes the deployed site.

No custom `_config.yml` or publishing exclusion exists at the baseline. Treat new
repository documentation as public and potentially served by Pages; sitemap
exclusion alone is not access control or a guarantee against indexing. The crawler
configuration ticket covers a deliberate documentation publishing policy.

Maintainer roles, media provenance and post-election ownership need to be assigned
by the repository maintainers; see [#16](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/16).
