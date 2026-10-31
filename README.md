# 韓瑩政見一覽

A Traditional Chinese, static policy information site published at
[hanyingyilan.github.io](https://hanyingyilan.github.io/). The page identifies its
publisher as 韓瑩市長候選人辦公室 and presents information for the 2026 宜蘭市長 election.

The site combines six policy categories, a policy filter, a cleaning-service
comparison, a household benefit scenario calculator, videos, source links, and
optional animations and sharing tools.

## Run locally

From the repository root, with Python 3 installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open <http://localhost:8000/>. Stop the server with Ctrl-C. Serving committed output needs no package installation, backend, database, or
environment variables. Source changes use the development commands below. Use HTTP
rather than opening a `file://` URL when checking browser features and assets.

## Repository map

| Path | Purpose |
| --- | --- |
| `index.html` | Generated production page; edit `src/` and `content/` |
| `portrait.jpg`, `portrait2.jpg`, `p4.jpg`–`p14.jpg` | Main portrait and alternate photos |
| `portrait-cut.png` | Cutout used by the canvas image exporter |
| `og.png` | 1200 × 630 social preview image |
| `v/pu.mp4`, `v/pu.jpg` | Locally hosted video and poster |
| `preview-a.html`, `preview-b.html`, `preview-c.html` | Deliberate social-preview experiments; all have `noindex` |
| `docs/` | Contributor documentation and dated audit |
| `AGENTS.md` | Guidance for automated contributors |

## Contributor reading order

1. [Architecture and runtime behavior](docs/ARCHITECTURE.md)
2. [Engineering and content principles](docs/PRINCIPLES.md)
3. [Content maintenance guide](docs/CONTENT.md)
4. [Development, validation, and release guide](docs/CONTRIBUTING.md)
5. [SEO engineering audit](docs/SEO-AUDIT.md)
6. [Prioritized issue roadmap](docs/ROADMAP.md)

The initial documentation describes source commit
`4259eda6c524b90da846c3acb0ab957642ddd427`, inspected on 2026-11-01. The dated audit remains a historical record; current P1 implementation and
validation are recorded in [the local stack review](docs/P1-IMPLEMENTATION.md).

## Deployment and current priorities

The GitHub Pages API reported deployment from `main`, repository root `/`, using
the legacy Pages build, with HTTPS enforced and no custom domain on 2026-11-01.
The audit baseline had no build configuration; P1 adds deterministic development
generation and CI while preserving committed static output and this Pages source.

Start with [complete initial HTML](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/1),
[canonical URLs](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/2), and
[Search Console visibility](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/3).
The [roadmap](docs/ROADMAP.md) lists all ten SEO and six engineering tickets,
dependencies, and acceptance criteria locations.

No license or asset-permission record was present at the audit baseline. Public
availability alone does not establish reuse permission; provenance work is tracked
in [#16](https://github.com/Hanyingyilan/hanyingyilan.github.io/issues/16).

## P1 development tooling

With Node.js 22.22+ (22.x) or 24.8+, run `npm ci`, `npm run build`, `npm run check`, and
`npm test`. Source files are `content/policies.json` and `src/`; commit generated
`index.html` and `assets/` together. The production server still serves static
files and needs no Node runtime. Browser checks: `npx playwright install chromium`
then `npm run test:e2e` (starts a local Python server).
