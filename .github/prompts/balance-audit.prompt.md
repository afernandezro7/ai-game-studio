# Balance Audit

Run a comprehensive QA audit on the current game economy.

## Steps

1. Read ALL config files: `src/config/BuildingsConfig.json`, `src/config/ResourcesConfig.json`
2. Read ALL docs: `docs/economy-and-buildings.md`, `docs/economy.md`, `docs/vision.md`
3. Run the **5-Point Validation Checklist** from @qa agent instructions
4. Simulate these player scenarios:
   - **Speedrunner**: Player who optimizes perfectly for fastest progression
   - **Casual**: Player who logs in once per day for 5 minutes
   - **Whale**: Player who buys 1000 Runes immediately
   - **F2P Grinder**: Player who plays 2 hours daily but spends nothing
5. Compare actual numbers against `docs/vision.md` KPIs (D1, D7, D30 retention targets)
6. Report all findings with mathematical proof
7. If issues found, propose specific number changes to fix them

Produce a full QA Report following the @qa output format.
