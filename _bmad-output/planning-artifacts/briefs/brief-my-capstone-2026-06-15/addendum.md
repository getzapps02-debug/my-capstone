---
title: "Shortfall Investigator - Product Brief Addendum"
status: final
created: 2026-06-15
updated: 2026-06-15
---

# Product Brief Addendum

The evidence model below is illustrative. Architecture work must validate whether each relationship improves an investigation and whether graph or relational storage is the simpler fit.

## Explanation Guardrails

Preferred language:

- "These transactions contributed to the balance decline."
- "This spending pattern was associated with a reduced buffer."
- "Based on the available records..."
- "The available data is insufficient to determine..."

Avoid:

- "This transaction caused your shortfall."
- "You overspent because..."
- Any statement about motivation without direct user-provided evidence

## Candidate Evidence Model

```text
ShortfallPeriod
  -> BalanceDecline
  -> CategoryChange
  -> Transaction
  -> Merchant

ShortfallPeriod
  -> Obligation
  -> Transaction
  -> Account

Transaction
  -> Trigger
  -> Event | Person | Place | Mood | Emergency
```

Candidate transaction context:

- Event, such as payday or celebration
- Merchant or place
- Person or social group
- Mood
- Need-versus-want classification
- Unexpected emergency
- Custom tags and notes

Context is optional. Missing context must reduce explanation confidence rather than block use.

## Curated Demo Scenario

Example synthetic period:

- Income: $1,000
- Rent and bills: $650
- Groceries and transport: $220
- Small purchases: $60
- Social spending: $40
- Unexpected medicine: $50

The investigation should show that the medical expense appears at the tipping point while earlier essential and discretionary spending had already removed the remaining buffer. The explanation must not blame the final expense or claim a single proven cause.
