# Repository guidance for automated contributors

Read `README.md`, `docs/ARCHITECTURE.md`, and `docs/PRINCIPLES.md` before changes.
Use `docs/CONTENT.md` for factual updates and `docs/CONTRIBUTING.md` for validation.

## Scope and conventions

- This is a static GitHub Pages site. There is currently no package manager,
  application server, or build step. Do not assume npm commands exist.
- Keep public copy in Traditional Chinese (`zh-Hant`); preserve source attribution
  and distinguish proposed policy from current public benefits.
- Use the smallest coherent change. A framework migration is not a prerequisite
  for SEO fixes. Keep existing fragment links and relative asset paths working.
- Treat `PL`, `PIL`, `WHO`, calculator constants, public copy, and source references
  as related data. Inspect all affected occurrences before changing a fact.
- Preserve the existing preview pages' `noindex` while they remain experiments.
- Follow the open issue's acceptance criteria. The dated audit is evidence about
  its baseline, not proof that later code still has the same problem.

## Verification and reporting

- Check `git status` before editing and preserve unrelated work.
- For documentation changes, check links, referenced files/symbols, and
  `git diff --check`. Do not add a test framework solely for a prose edit.
- For runtime changes, run the relevant smoke checks in `docs/CONTRIBUTING.md`;
  check syntax and browser behavior. Calculator changes need numerical boundary
  checks. Report missing tools or unperformed checks honestly.
- Separate source inspection, observed browser behavior, and external measurements
  in findings. Do not invent Lighthouse scores, index coverage, rankings, or
  policy verification.
- Keep commits reviewable. Follow the user's authorization for commits, publishing,
  issues, and pull requests; avoid changing Pages settings as an incidental step.
- Keep credentials, private analytics, and personal user data out of this public
  repository. Do not add tracking of policy-filter selections or calculator inputs.

Use `docs/ROADMAP.md` to find issue priorities. Update architecture/content guidance
when the corresponding implementation changes; retain the audit's historical date.
