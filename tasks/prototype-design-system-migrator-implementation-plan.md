# Prototype Design System Migrator — implementation plan

Status: IN PROGRESS

## Scope for the first implementation slice

1. Add one canonical cross-agent skill package under `skills/prototype-design-system-migrator/`.
2. Keep the shared `SKILL.md` inside the portable Codex/Claude subset.
3. Add references for workflow, stack decisions, tokens, layout, spacing, icons, QA, security, and output contracts.
4. Add project-policy templates for `AGENTS.md` and `CLAUDE.md`.
5. Add dependency-free Node.js scripts for stack detection, UI inventory, policy checks, package validation, and installation.
6. Add static eval fixtures and installer idempotence tests.
7. Update root package scripts and installation documentation without changing the Figma bridge runtime.
8. Open a draft pull request. Keep final status `PARTIAL` until clean real runs in both Codex and Claude Code are recorded.

## Implementation order

- [x] Create dedicated implementation branch.
- [ ] Add canonical skill router and references.
- [ ] Add templates and portability documentation.
- [ ] Add analyzers and enforcement scripts.
- [ ] Add cross-platform installer and drift check.
- [ ] Add static eval suite.
- [ ] Update package scripts and repository documentation.
- [ ] Run package validation and static evals.
- [ ] Run existing repository tests when a complete checkout is available.
- [ ] Run one clean Codex fixture and one clean Claude Code fixture.
- [ ] Record evidence and resolve blockers before changing status to READY.

## Risk register

### Cross-agent format drift

Codex and Claude may evolve different skill metadata or invocation behavior. Mitigation: shared frontmatter contains only `name` and `description`; agent-specific behavior stays outside the canonical workflow; package validation rejects known vendor-specific fields.

### False confidence from regex-based audits

Static scanners cannot prove semantic correctness. Mitigation: every scanner labels findings as heuristic, emits file/line evidence, and the skill requires runtime inspection and visual/accessibility checks before READY.

### Uncontrolled redesign

An agent may interpret normalization as permission to restyle the product. Mitigation: `preserve` is the default strategy, rollout is never the default mode, and the decision order prioritizes behavior, brand assets, and dominant existing patterns.

### UI-library mixing

Adding a new component system can increase rather than reduce inconsistency. Mitigation: detect existing systems, prefer the coherent incumbent, expose third-party components only through a local UI boundary, and fail policy checks when multiple full systems leak into product code.

### Unsupported frameworks

A universal prompt cannot safely migrate every stack. Mitigation: explicit support tiers; unknown stacks stop at audit/plan with PARTIAL instead of speculative edits.

### Installer overwriting local work

Installed skills may be edited locally. Mitigation: content-hash marker, idempotent installs, drift detection, dry-run, and refusal to overwrite drift without `--force`.

### Repository regression

This repository contains an existing Figma/MCP product. Mitigation: new work remains under the new skill package plus narrowly scoped documentation/package-script changes; no refactor of Figma bridge code.

### Dependency and license risk

Referenced open-source systems may have different licenses or update independently. Mitigation: do not vendor them; document source/license links; require the target project to record installed dependencies and versions.

### Missing real-agent evidence

Static compatibility is not proof that both agents execute the workflow correctly. Mitigation: status remains PARTIAL until separate clean Codex and Claude Code runs are captured.