# Studio Status Report

Generate a complete status report of the AI Game Studio and Project Valhalla.

## Steps

1. Read `package.json` for current version
2. Read `DEVLOG.md` for recent activity
3. Read `docs/roadmap.md` and compare against what's been implemented
4. Read ALL `src/config/*.json` files and summarize current game content
5. Read `docs/vision.md` and check KPI alignment
6. List all files in `docs/`, `src/config/`, and `client-web/src/`

## Report Format

```markdown
# 📊 Studio Status Report — [Date]

## Project: [Name] v[Version]

### 🎮 Game Content

- Buildings: [count] ([list with max levels])
- Resources: [count] ([list])
- Troops: [count or "Not yet implemented"]
- Combat: [status]
- Clans: [status]

### 📋 Roadmap Progress

| Phase  | Target        | Status | % Complete |
| ------ | ------------- | ------ | ---------- |
| v0.1.0 | Prototype     | ...    | ...%       |
| v0.5.0 | Soft Launch   | ...    | ...%       |
| v1.0.0 | Global Launch | ...    | ...%       |

### 📖 Documentation Health

- Files in docs/: [count]
- Mismatches between docs and configs: [count]
- Last DEVLOG entry: [date]

### 🔧 Technical Health

- CI Status: [passing/failing]
- Test coverage: [status]
- Tech debt: [issues]

### 🎯 Recommended Next Actions

1. [Highest priority task]
2. [Second priority]
3. [Third priority]
```
