# 韓瑩政見一覽

A Traditional Chinese (`zh-Hant`) policy information site for the 2026 宜蘭市長
election, published at [hanyingyilan.github.io](https://hanyingyilan.github.io/).
The page identifies its publisher as 韓瑩市長候選人辦公室. It presents six policy
categories, filtering, a cleaning-service comparison, a proposal benefit
calculator, videos, citations and optional interactive features.

Production serves committed static files. Development uses a Node.js generator;
see [local preview and development commands](docs/CONTRIBUTING.md#local-work).
Edit maintained sources, then regenerate their public outputs.

## Documentation map

Each topic has one maintained home. Other documents link to it instead of copying
its instructions, values or status. Dated evidence describes its recorded revision,
not necessarily the current checkout or deployed site.

### Maintained guides

| Document | Owns |
| --- | --- |
| [Architecture](docs/ARCHITECTURE.md) | Source/output map, runtime boundaries and publishing design |
| [Principles](docs/PRINCIPLES.md) | Engineering and editorial decision rules |
| [Content](docs/CONTENT.md) | Policy/source/rate/media maintenance and factual-review limits |
| [Contributing](docs/CONTRIBUTING.md) | Setup, validation, release and rollback procedures |
| [Roadmap](docs/ROADMAP.md) | Issue inventory, priorities and dependencies; issues own acceptance/status |
| [Search Console](docs/SEARCH-CONSOLE.md) | Owner access, verification and search-measurement handoff |
| [Analytics](docs/ANALYTICS.md) | Dated provider comparison, collection requirements and shutdown procedure |
| [Crawlability](docs/CRAWLABILITY.md) | HTTP coverage checker, crawler controls and AI-search observation handoff |
| [Agent guidance](AGENTS.md) | Automated-contributor entry point and execution rules |

### Dated evidence and decisions

| Document | Owns |
| --- | --- |
| [Performance](docs/PERFORMANCE.md) | Reproducible experiment, raw reports and measurement limits |
| [Architecture decision](docs/ARCHITECTURE-PROPOSAL.md) | Original alternatives, decision and deferred contracts |
| [SEO audit](docs/SEO-AUDIT.md) | Evidence from baseline `4259eda`, inspected 2026-11-01 |

Start with Architecture and Principles; use the task-specific guide next. Keep
current instructions separate from historical evidence when updating documents.
The maintained service guides also contain explicitly dated observations; their
procedures remain the topic's home, while those observations apply only to the
recorded inspection. Raw performance JSON belongs to its experiment, not a second
guide. See [documentation maintenance](docs/CONTRIBUTING.md#documentation-maintenance)
when changing this map or adding a document.

## Repository and deployment

Maintained code/data live in `src/` and `content/`; generated output is committed at
the root and under `assets/`. Public media is grouped under `assets/images/` and
`assets/videos/` with descriptive filenames. The
[architecture map](docs/ARCHITECTURE.md#maintained-sources-and-generated-output)
identifies each source and its output.

Issues and pull requests record review progress and merge evidence; the
[roadmap](docs/ROADMAP.md) links remaining owner acceptance. The
[baseline audit](docs/SEO-AUDIT.md#http-and-source-evidence) records the observed
deployment configuration; follow the
[release procedure](docs/CONTRIBUTING.md#release-and-rollback) before publishing.

Keep experiments and agent working files outside tracked source; the
[temporary-file policy](docs/CONTRIBUTING.md#temporary-files-and-repository-hygiene)
defines what belongs in the repository and what must be deleted after use.
