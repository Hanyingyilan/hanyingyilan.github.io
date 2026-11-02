# 韓瑩政見一覽

Traditional Chinese (`zh-Hant`) policy information for the 2026 宜蘭市長 election,
published at [hanyingyilan.github.io](https://hanyingyilan.github.io/). Publisher:
韓瑩市長候選人辦公室. The site includes six policy categories, filtering,
a cleaning-service comparison, a proposal calculator, videos and citations.

Production serves committed static files; Node.js is development tooling only.
Edit `src/` and `content/`, then regenerate public output with `npm run build`.
See [local setup and validation](docs/CONTRIBUTING.md#local-work).

## Documentation map

Each topic has one maintained home. Link to its guide instead of repeating rules,
values or status; executable values belong in source. Read Architecture and
Principles before changes, then the relevant topic guide.

| Guide | Owns |
| --- | --- |
| [Architecture](docs/ARCHITECTURE.md) | Source/output map, runtime and publishing boundaries |
| [Principles](docs/PRINCIPLES.md) | Engineering and editorial decision rules |
| [Content](docs/CONTENT.md) | Policy, rates, sources, media and election lifecycle |
| [Contributing](docs/CONTRIBUTING.md) | Setup, validation, repository hygiene, release and rollback |
| [Roadmap](docs/ROADMAP.md) | Remaining priorities and links to issue acceptance criteria |
| [Search Console](docs/SEARCH-CONSOLE.md) | Ownership and search observation procedure |
| [Analytics](docs/ANALYTICS.md) | Search Console-only decision and collection constraints |
| [Crawlability](docs/CRAWLABILITY.md) | Crawler policy, HTTP checks and AI-search observations |
| [Performance](docs/PERFORMANCE.md) | Measurement procedure, limits and optimization rationale |
| [Agent guidance](AGENTS.md) | Automated-contributor entry point |

Dated decisions and evidence:

- [Architecture decision](docs/ARCHITECTURE-PROPOSAL.md): why the static generator was chosen.
- [SEO audit](docs/SEO-AUDIT.md): baseline `4259eda`, inspected 2026-11-01; not current defects.

Issues own acceptance/status; PRs and Git history hold completed reviews and
verification results. Keep disposable files out of commits under the
[temporary-file policy](docs/CONTRIBUTING.md#temporary-files-and-repository-hygiene).
