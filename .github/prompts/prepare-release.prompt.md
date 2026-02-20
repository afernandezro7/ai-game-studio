# Prepare Release

Coordinate a release from `develop` to `main`.

## Steps

1. **@release**: Read `DEVLOG.md` and `docs/roadmap.md`. Determine what version this should be (patch/minor/major).

2. **@qa**: Run a final balance audit on current `src/config/*.json` files. Verify no blockers.

3. **@archivist**: Verify all docs are up to date and no `[MISMATCH]` warnings exist between docs and JSON configs.

4. **@release**:
   - Write player-facing release notes using the Release Notes Template
   - Update `DEVLOG.md` with the release entry
   - Create a PR from `develop` → `main`
   - Add the appropriate `release:*` label
   - Verify CI passes

5. **@artdirector**: If there are new visual elements, ensure art prompts are documented.

## Pre-Release Checklist

Go through each item and verify:

- [ ] All planned features for this version are implemented
- [ ] Documentation matches implementation (no mismatches)
- [ ] QA has approved the current balance
- [ ] DEVLOG.md is complete and up to date
- [ ] CI pipeline passes on develop branch
- [ ] No open critical/blocker issues

## Output

Provide the complete release notes and a GO/NO-GO recommendation.
