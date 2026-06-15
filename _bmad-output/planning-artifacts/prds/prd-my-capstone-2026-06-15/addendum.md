---
title: "Shortfall Investigator - PRD Addendum"
status: final
created: 2026-06-15
updated: 2026-06-15
---

# PRD Addendum

## Architecture Support

The product brief supplies three architecture inputs: a local browser interface with services packaged through Docker Compose, no cloud dependency for the core workflow, and Neo4j as the candidate graph store, provided that graph relationships improve evidence traceability. These are not Functional Requirements. Architecture must validate whether Neo4j is justified for each relationship and whether a relational representation is simpler for other data.

### Candidate Evidence Paths

```text
Shortfall
  -> Account Balance decline
  -> Category change
  -> Transaction
  -> Merchant

Shortfall
  -> Obligation
  -> Transaction
  -> Account

Transaction
  -> Context
  -> Event | Person | Place | Mood | Emergency
```

### Validation Fixture Set

The project requires synthetic fixtures for:

- Ordinary Shortfall with a clear top Contributor
- Income timing shift
- Irregular expense near threshold crossing
- Refund reducing Contributor impact
- Transfer excluded from spending
- Duplicate import
- Missing or malformed CSV data
- Reconciliation difference
- Missing Comparable Period
- Insufficient Minimum Evidence
- No defensible Contributors

## Portfolio Delivery

The portfolio artifact set includes:

- `README.md`
- `docs/architecture.md`
- `docs/investigation-workflow.md`
- `docs/evidence-model.md`
- `docs/usability-report.md`
- `docs/privacy-and-limitations.md`
- Synthetic fixtures under `samples/`
- Recorded walkthrough of five minutes or less
