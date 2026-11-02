# Repository guidance for automated contributors

Read [README](README.md), [architecture](docs/ARCHITECTURE.md) and
[principles](docs/PRINCIPLES.md) before changes. README maps the documentation;
follow each topic's maintained guide instead of duplicating its rules here.

## Before editing

- Check `git status` and preserve unrelated work. Use a review branch.
- Inspect current files and the issue's acceptance criteria. Dated audits and
  plans describe their recorded revisions, not proof of a present defect.
- This is a generated static GitHub Pages site. Development commands and required
  tools are in [CONTRIBUTING](docs/CONTRIBUTING.md#local-work); production needs no
  application server. Edit sources, not generated output.
- Use [CONTENT](docs/CONTENT.md) for factual changes, including all affected
  policy fields, rates, copy and references. Keep public copy in Traditional Chinese.
- Find priorities in [ROADMAP](docs/ROADMAP.md). Keep the change scoped to the task.
- Keep temporary experiments, agent plans, review notes, logs and screenshots out
  of commits and merges. Use ignored scratch storage and follow the
  [temporary-file policy](docs/CONTRIBUTING.md#temporary-files-and-repository-hygiene),
  including when an agent skill suggests writing execution plans under `docs/`.

## Verification and reporting

- Follow [the validation guide](docs/CONTRIBUTING.md#validation-by-change-type).
  Report checks actually performed and any missing tools or owner access.
- Separate source inspection, browser observations and external measurements.
  Do not invent policy verification, search outcomes or performance scores.
- Keep commits reviewable. Follow the user's authorization for commits, remote
  branches, issues, PRs and publishing; do not change Pages settings incidentally.
- Never commit credentials, private analytics or personal user data. Follow the
  [data-collection principle](docs/PRINCIPLES.md#7-minimize-data-collection-and-third-party-cost).
- Update the relevant maintained guide with implementation changes. Preserve dated
  evidence that supports a durable decision; keep completed task/review logs in
  PR history rather than adding repository documents. Inspect staged files for
  temporary artifacts before every commit or merge.
