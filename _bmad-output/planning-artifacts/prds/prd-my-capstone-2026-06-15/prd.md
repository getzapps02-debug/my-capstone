---
title: "Shortfall Investigator"
status: final
created: 2026-06-15
updated: 2026-06-15
sources:
  - "_bmad-output/planning-artifacts/briefs/brief-my-capstone-2026-06-15/brief.md"
  - "_bmad-output/planning-artifacts/briefs/brief-my-capstone-2026-06-15/addendum.md"
---

# PRD: Shortfall Investigator

## 0. Document Purpose

This PRD defines the product behavior, scope, and measurable completion criteria for the Shortfall Investigator MVP. It is written for UX design, architecture, epic and story creation, implementation, and review. Domain terms are defined in the Glossary; Features contain globally numbered Functional Requirements; cross-cutting quality requirements and guardrails are stated separately. Technical mechanisms and candidate graph structures belong in `addendum.md`.

## 1. Vision

Shortfall Investigator is a local-first financial investigation application for people who know their money fell short but cannot reconstruct which observable changes contributed to the decline. It replaces the burden of manually connecting transactions, obligations, timing, and balance changes with a Guided Investigation that remains traceable to source evidence.

The product does not promise proven causality or financial advice. It earns trust by showing what changed, which Contributors were most significant under disclosed ranking rules, why each Contributor appears, and when the available evidence is insufficient. The MVP is a personal utility and portfolio case study that tests whether graph-backed evidence and time-series views improve financial understanding without sending personal data outside the local environment. Graph evidence supports explanations only when it clarifies a finding; users are never expected to interpret a dense network unaided.

## 2. Target User

The primary user is a financially responsible adult with irregular expenses who can identify a low-balance period but cannot easily explain how the available buffer disappeared. The first implementation serves Denzo as its primary user and technically comfortable portfolio evaluators.

### 2.1 Jobs To Be Done

- When my Account Balance falls below a level I consider safe, help me define the relevant period and inspect what changed.
- Help me identify the largest evidence-supported Contributors without presenting correlation as causation.
- Let me verify every finding against Transactions, Obligations, calculations, and comparison data.
- Let me correct imported evidence and immediately see the Investigation update.
- Keep my financial records private and under my control.
- Help me understand the sequence of events through synchronized charts, evidence, and Transaction Replay.

### 2.2 Non-Users for MVP

- People seeking automated financial advice, budgeting prescriptions, or investment recommendations
- Users who require direct bank synchronization
- Teams, households, or organizations needing shared or multi-user Accounts
- Users requiring cloud access or cross-device synchronization
- Users importing mixed-currency data into one Account

### 2.3 Key User Journey

**UJ-1. Denzo investigates a balance decline and verifies the strongest Contributor.**  
**Persona + context:** Denzo manages essential expenses responsibly but has irregular purchases and cannot explain why the Account Balance fell below the Safety Threshold.  
**Entry state:** Denzo opens the local application with Sample Data already loaded or imports a supported CSV into one Account.  
**Path:** Denzo reviews the reconciliation status, sets a Safety Threshold, selects a qualifying Shortfall, and accepts or adjusts the proposed Investigation Period. The application displays balance and Category changes, ranks Contributors, and states the Comparison Basis. Denzo opens the highest-ranked Contributor, inspects its source Transactions and calculation, then uses Transaction Replay to see how the buffer changed over time.  
**Climax:** Denzo can state which observable Contributor had the greatest supported impact and explain why it is evidence of contribution rather than proof of cause.  
**Resolution:** Denzo returns to the complete Investigation view and may correct evidence, export Transactions, investigate another period, or close the application with data preserved locally.  
**Edge cases:** If evidence is insufficient, reconciliation is unresolved, or no defensible Contributor exists, the application refuses to rank and lists the missing or inconsistent evidence.

## 3. Glossary

- **Account** — A single financial record collection with one Currency. Multiple Accounts may be stored, but one Account is used per Investigation.
- **Account Balance** — The running amount available in an Account, imported from source data when present or reconstructed from an Opening Balance and ordered Transactions.
- **Category** — A user-editable classification assigned to a Transaction for grouping and trend analysis.
- **Comparable Period** — The immediately preceding period with the same number of calendar days as the Investigation Period, or another user-selected comparison range.
- **Context** — A user-provided annotation such as an event, person, place, mood, need-or-want classification, emergency, tag, or note.
- **Contributor** — One or more eligible Transactions or Obligations that reduced the available buffer during an Investigation Period.
- **Investigation** — The evidence-backed analysis of one Account for one Investigation Period.
- **Investigation Period** — The time range examined by an Investigation, beginning at the most recent Account Balance at or above the Safety Threshold and ending at the lowest Account Balance before recovery, or at the latest Transaction when recovery does not occur.
- **Obligation** — A recurring or one-time required payment entered or confirmed by the user and optionally linked to a matching Transaction.
- **Opening Balance** — The user-provided starting Account Balance used when running balances are unavailable.
- **Safety Threshold** — A user-defined Account Balance below which a period qualifies as a Shortfall.
- **Sample Data** — Synthetic financial records stored separately from personal records and reset independently.
- **Shortfall** — A user-selected period during which the Account Balance falls below the Safety Threshold.
- **Transaction** — An imported or manually entered financial record with a Transaction Date, Amount, Description, and Account.
- **Transaction Replay** — A chronological, synchronized walkthrough of Transactions and Investigation evidence.

### Investigation Decision Model

Every Investigation follows the same governing sequence:

1. Validate Minimum Evidence and reconciliation status.
2. Determine eligible Contributors and exclude duplicates and Transfers.
3. Group eligible Transactions, apply linked Refunds, and calculate monetary impact.
4. Compare against the Comparable Period when valid comparison data exists.
5. Rank by monetary impact, deviation, and timing proximity.
6. Present each finding with source evidence, calculation, Comparison Basis, and limitations.
7. Refuse ranking when required evidence is missing or no defensible Contributor exists.

## 4. Features

All Feature groups realize UJ-1.

### 4.1 Local Data Onboarding and Account Management

**Description:** The user can begin with Sample Data, create manual Transactions, or import a CSV into an Account. The application previews mappings, reports accepted and rejected rows, prevents duplicate Transactions, and displays reconciliation status before an Investigation.

#### FR-1: Manage Accounts

The user can create, name, view, and delete Accounts, each using one Currency.

**Consequences:**
- The MVP stores multiple Accounts but does not combine Account Balances or findings across Accounts.
- An Investigation uses exactly one Account.
- Mixed-Currency imports into an Account are rejected with an explanation.
- Deleting an Account requires explicit confirmation and permanently removes its Transactions, Obligations, Context, and derived findings.

#### FR-2: Load and Reset Sample Data

The user can load, use, and independently reset Sample Data.

**Consequences:**
- Sample Data is visibly distinguished from personal data.
- Resetting Sample Data does not modify personal Accounts.
- Sample Data contains at least one complete, reconciled Shortfall scenario and one insufficient-evidence scenario.

#### FR-3: Enter Transactions Manually

The user can create a Transaction by providing Transaction Date, Amount, Description, and Account.

**Consequences:**
- The user may also provide Category, Transaction Type, Merchant, and running Account Balance.
- A saved Transaction immediately updates the Account Balance, charts, and affected Investigations.
- Required-field and invalid-value errors identify the field and corrective action.

#### FR-4: Preview and Map CSV Data

The user can preview a CSV and map source columns before import.

**Consequences:**
- Required mappings are Transaction Date, Amount, Description, and Account.
- Optional mappings are running Account Balance, Category, Transaction Type, Merchant, and Transaction ID.
- The importer accepts common date formats and either signed Amounts or separate debit and credit columns.
- Supported date formats are ISO `YYYY-MM-DD`, `MM/DD/YYYY`, and `DD/MM/YYYY`; ambiguous day/month data requires explicit user selection before import.
- The preview shows interpreted values before the user confirms import.

#### FR-5: Import Valid Rows and Report Rejections

The user can import valid CSV rows while malformed rows are rejected with specific reasons.

**Consequences:**
- The result reports accepted, duplicate, and rejected row counts.
- Each rejected row identifies the source row and reason.
- The user can correct mappings and retry without duplicating accepted Transactions.
- Representative fixtures achieve at least 95% correct interpretation of valid rows.

#### FR-6: Prevent Duplicate Transactions

The system prevents repeat import of the same Transaction.

**Consequences:**
- Transaction ID is the duplicate identity when present.
- Without Transaction ID, duplicate identity uses Account, Transaction Date, Amount, and normalized Description.
- Renaming or reordering an imported file does not create duplicates.
- Re-importing the same statement creates zero new Transactions.

#### FR-7: Establish and Reconcile Account Balance

The user can establish an Account Balance from imported running balances or an Opening Balance plus ordered Transactions.

**Consequences:**
- Imported running balances are preferred when available.
- Reconstructed Account Balances require an Opening Balance.
- The system shows reconciliation differences before Investigation.
- The user must resolve or explicitly accept a reconciliation difference before Contributors can be ranked.

### 4.2 Evidence Correction and Financial Context

**Description:** The user can correct imported records, distinguish source facts from personal annotations, and rerun all derived views without stale findings.

#### FR-8: Correct Transactions

The user can edit Category, Merchant, Description, Transaction Date, Amount, Transaction Type, and transfer status.

**Consequences:**
- Imported values and user corrections remain distinguishable.
- Corrections immediately recompute Account Balance, charts, Contributors, rankings, and Transaction Replay.
- Findings based on changed evidence are invalidated until recomputation completes.

#### FR-9: Exclude, Delete, and Undo Evidence

The user can exclude a Transaction from an Investigation, delete a Transaction, or undo an entire import.

**Consequences:**
- Excluding a Transaction does not delete it from the Account.
- Deletion and import undo require confirmation.
- All affected derived findings update immediately.

#### FR-10: Identify Transfers and Refunds

The user can mark Transfers and relate Refunds to affected Transactions or Contributors.

**Consequences:**
- Transfers between known Accounts are linked and excluded from spending and Contributor calculations.
- Refunds reduce the monetary impact of their related Contributor.
- Unresolved Transfers or Refunds are shown as evidence limitations.

#### FR-11: Record Obligations

The user can create or confirm an Obligation and optionally link it to a Transaction.

**Consequences:**
- User-provided Obligations are visibly labeled.
- An Obligation affects Contributor ranking only through the Amount of its linked Transaction.
- An unlinked Obligation may appear as Context but cannot alter ranking.

#### FR-12: Record Context

The user can attach Context to a Transaction or Investigation.

**Consequences:**
- Context may include event, person, place, mood, need-or-want classification, emergency, tag, or note.
- Context is visibly labeled as user-provided.
- Context supports explanation but does not alter Contributor ranking.
- Missing Context never blocks an Investigation.

### 4.3 Shortfall and Investigation Period Selection

**Description:** The user defines a Safety Threshold, selects a qualifying Shortfall, and accepts or adjusts an Investigation Period.

#### FR-13: Define Safety Threshold

The user can set and update a Safety Threshold for an Account.

**Consequences:**
- A Shortfall does not require a negative Account Balance.
- Changing the Safety Threshold refreshes qualifying Shortfalls and affected Investigations.
- The current Safety Threshold is visible wherever a Shortfall or threshold crossing is shown.

#### FR-14: Identify and Select Shortfalls

The user can view Account Balance periods below the Safety Threshold and select one for Investigation.

**Consequences:**
- Shortfalls are shown on the historical Account Balance chart and in an accessible list.
- If no qualifying Shortfall exists, the system states this without fabricating one.
- The user can select only one Shortfall for an Investigation.

#### FR-15: Propose and Adjust Investigation Period

The system proposes an Investigation Period for the selected Shortfall, and the user can shorten or extend it.

**Consequences:**
- The default start is the most recent point before the Shortfall where Account Balance was at or above the Safety Threshold.
- The default end is the lowest Account Balance before recovery to or above the Safety Threshold.
- If recovery does not occur, the default end is the latest Transaction.
- Period changes immediately refresh eligible evidence and findings.

#### FR-16: Select Comparable Period

The system proposes a Comparable Period, and the user can select another date range.

**Consequences:**
- The default Comparable Period immediately precedes the Investigation Period and has the same number of calendar days.
- The system discloses when comparison data is incomplete or unavailable.
- Without a valid Comparable Period, ranking uses monetary impact and timing proximity only.

### 4.4 Evidence-Calibrated Contributor Analysis

**Description:** The system ranks observable Contributors only when the Minimum Evidence standard is met. Each finding exposes its evidence, calculation, ranking rationale, Comparison Basis, and limitations.

#### FR-17: Enforce Minimum Evidence

The system determines whether an Investigation has enough evidence to rank Contributors.

**Consequences:**
- Required evidence is one Account, an Opening Balance or imported running Account Balance, complete Transaction Dates and Amounts for the Investigation Period, a valid Safety Threshold, and a reconciled Account Balance or accepted reconciliation difference.
- If evidence is insufficient, the system does not rank Contributors.
- The insufficient-evidence state lists every missing or inconsistent input and offers a path to correct it.
- The system never fills evidence gaps with guesses.

#### FR-18: Determine Eligible Contributors

The system groups eligible Transactions and linked Obligations into Contributors that reduced the available buffer.

**Consequences:**
- Duplicate Transactions and Transfers are excluded.
- Refunds reduce related Contributor impact.
- Context and unlinked Obligations do not alter eligibility or rank.
- Every Contributor links to the source Transactions and any linked Obligation.
- Transactions linked to the same Obligation form one Contributor.
- Remaining eligible Transactions are grouped by Category; Transactions without a Category form an `Uncategorized` Contributor.

#### FR-19: Rank Contributors

The system ranks Contributors using disclosed criteria.

**Consequences:**
- **Total monetary impact** is the sum of eligible debit Amounts minus linked Refund Amounts during the Investigation Period.
- **Deviation** is the Contributor's total monetary impact in the Investigation Period minus the matching Contributor's total monetary impact in the Comparable Period.
- **Timing proximity** is the elapsed local-calendar time between the Contributor's latest eligible Transaction and the first downward crossing of the Safety Threshold.
- Ranking compares total monetary impact first, then deviation, then the shortest timing proximity.
- Contributors receive the same rank when all three values are equal after Currency rounding and local-calendar normalization.
- When comparison is unavailable, the system omits deviation and states the limitation.
- Every rank exposes the calculation and Comparison Basis.

#### FR-20: Explain Findings Without Causal Overclaiming

The system describes findings as observable contribution or association.

**Consequences:**
- Product-generated text does not state or imply that a Transaction, Obligation, person, mood, or Context caused a Shortfall.
- Product-generated text does not provide financial advice.
- Explanations distinguish imported facts, user-provided information, calculations, and derived findings.
- When no defensible Contributor exists, the system states this and identifies the limiting evidence.

#### FR-21: Inspect Contributor Evidence

The user can open a Contributor and inspect why it appears and how it is ranked.

**Consequences:**
- Evidence includes source Transactions, linked Obligations, monetary impact, Comparable Period values when available, timing relative to the Safety Threshold crossing, and ranking rationale.
- Selecting evidence synchronizes the relevant chart point, Transaction, and graph evidence.
- Graph evidence is shown only when it clarifies the finding and is accompanied by a plain-language explanation.
- The user is never required to interpret a dense graph to understand or verify a Contributor.
- The user can return to the ranked Contributor list without losing Investigation context.

### 4.5 Historical Trends and Transaction Replay

**Description:** The user can inspect historical Account Balance and Category trends, then replay the Investigation Period while all evidence surfaces remain synchronized.

#### FR-22: View Historical Trends

The user can view Account Balance and Category Amount trends over time.

**Consequences:**
- The selected Shortfall, Investigation Period, Safety Threshold, and threshold crossing are identifiable.
- Selecting a chart point reveals the corresponding Transactions and evidence.
- Charts provide equivalent text summaries and tabular data.

#### FR-23: Replay Transactions Chronologically

The user can replay Transactions from the start to the end of the Investigation Period.

**Consequences:**
- Transactions are ordered chronologically; same-day Transactions use source order, then stable import order.
- Replay highlights when Account Balance crosses the Safety Threshold.
- Replay keeps Account Balance chart, Category trend, Transaction list, Contributor evidence, and graph evidence synchronized.

#### FR-24: Control Transaction Replay

The user can play, pause, move to previous or next events, restart, change speed, and jump from a chart point or Transaction.

**Consequences:**
- Exiting or completing Replay restores the complete Investigation view.
- Reduced-motion mode replaces animation with step-by-step state updates.
- Replay controls are keyboard operable and expose accessible names and current state.

### 4.6 Local Data Control

**Description:** The user retains control over locally stored data and can inspect, export, reset, or permanently remove it.

#### FR-25: Persist Local Data

The system preserves Accounts and related records across page refresh, browser restart, and application restart.

**Consequences:**
- The system requires no user account or cloud connection for the core workflow.
- A failure to persist data is surfaced to the user.
- Sample Data and personal data remain logically separate.
- The application clearly states that financial data remains local, identifies any operation that leaves the local environment, and presents relevant product limitations.

#### FR-26: Export Transactions

The user can export Transactions for an Account.

**Consequences:**
- Exported records distinguish imported values from user corrections.
- Export does not include unrelated Accounts.
- Export failure does not alter local data.

#### FR-27: Permanently Delete Local Data

The user can permanently delete an Account or clear all local data.

**Consequences:**
- Destructive actions require explicit confirmation describing the affected data.
- Deletion removes source records, user annotations, and derived findings.
- The application reports completion or failure.

## 5. Non-Goals

- The MVP does not prove why a user made a financial decision or claim that a Contributor caused a Shortfall.
- The MVP does not provide budgeting prescriptions, financial advice, credit advice, investment advice, or automated decisions.
- The MVP does not predict future Shortfalls or calculate safe-to-spend forecasts.
- The MVP does not generate or compare rescue plans.
- The MVP does not connect directly to banks or payment providers.
- The MVP does not combine Account Balances into a household or portfolio view.
- The MVP does not support shared, multi-user, cloud-hosted, or cross-device use.
- The MVP does not support mixed Currency within an Account.
- The MVP does not use Context to change Contributor ranking.
- The MVP does not optimize for public-scale hosting or production banking compliance.

## 6. MVP Scope

### 6.1 In Scope

- Windows 11 with current versions of Chrome or Edge
- Local single-user application
- Multiple stored Accounts with one Account per Investigation
- One Currency per Account, with monetary amounts rounded to two decimal places
- Local-timezone Transaction Date interpretation
- Up to 10,000 Transactions per Account
- Sample Data, manual entry, and CSV import
- CSV preview, mapping, partial import, rejection reporting, retry, and deduplication
- Account Balance reconstruction and reconciliation
- Transaction corrections, exclusions, deletion, import undo, export, and complete data clearing
- Safety Threshold, Shortfall selection, Investigation Period, and Comparable Period
- Contributor eligibility, ranking, evidence inspection, uncertainty, and refusal behavior
- Historical Account Balance and Category trends
- Synchronized Transaction Replay
- Keyboard-operable core journey, chart alternatives, accessible controls, and reduced-motion behavior
- Local persistence with no telemetry or external financial-data transmission

### 6.2 Out of Scope for MVP

- Direct bank integration
- Cloud hosting, login, multi-user sharing, and device synchronization
- Combined multi-Account Investigations
- Mixed-Currency Accounts
- Future prediction, automated coaching, and rescue plans
- Production financial-advice or regulated banking claims
- Publicly hosted personal-finance infrastructure

## 7. Cross-Cutting Requirements

### 7.1 Privacy and Data Control

- **NFR-1:** The core workflow must operate without sending financial data or telemetry outside the local environment.
- **NFR-2:** Destructive operations must require explicit confirmation and identify affected data.
- **NFR-3:** Sample Data must remain separate from personal Accounts.

### 7.2 Accessibility

- **NFR-4:** The core journey must target WCAG 2.2 AA.
- **NFR-5:** The core journey must be keyboard operable with visible focus and accessible control names.
- **NFR-6:** Charts must provide text summaries and tabular alternatives; meaning must not depend on color, hover, or motion alone.
- **NFR-7:** Transaction Replay must respect reduced-motion preferences.

### 7.3 Performance and Capacity

- **NFR-8:** The application must support up to 10,000 Transactions per Account without preventing completion of the core journey.
- **NFR-9:** After an evidence correction, affected balances, charts, Contributors, and Replay state must update before stale findings can be treated as current.
- **NFR-10:** The application must start through one primary documented command after prerequisites.

### 7.4 Reliability and Explainability

- **NFR-11:** Given identical source evidence, settings, Investigation Period, and Comparable Period, Contributor results must be deterministic.
- **NFR-12:** Every Contributor must remain traceable to source evidence, calculation, Comparison Basis, and ranking rationale.
- **NFR-13:** Product-generated explanations must comply with the approved non-causal and non-advisory language guardrails.
- **NFR-14:** Dates without times use local calendar dates; monetary calculations use the Account Currency rounded to two decimal places.

## 8. Success Metrics

### Primary

- **SM-1: Duplicate-free re-import** — Re-importing the same, renamed, or reordered statement creates zero new Transactions across every duplicate fixture. Measured through automated fixture tests. Validates FR-5, FR-6.
- **SM-2: Fixture reconciliation** — Imported totals, Account Balances, and Category totals match expected fixture values to two decimal places for the Account Currency. Measured through automated fixture tests. Validates FR-4 through FR-7.
- **SM-3: Evidence-backed completion** — From loaded Sample Data, a participant identifies the top Contributor, opens its evidence, distinguishes source facts from system inference, recognizes uncertainty or missing evidence, and explains that the finding is a Contributor rather than a proven cause within five minutes. At least four of five representative participants complete without moderator guidance. Any severe misleading interpretation requires revision and retesting regardless of the aggregate result. Validates FR-13 through FR-24.
- **SM-4: Explanation integrity** — Reviewed benchmark Investigations contain zero unsupported causal statements or financial advice. Measured by reviewing all product-generated text from the validation fixture set. Validates FR-17 through FR-21, NFR-13.

### Secondary

- **SM-5: Valid-row interpretation** — At least 95% of valid rows in representative CSV fixtures are interpreted correctly; every rejected row receives a specific reason. Measured against expected normalized fixture records. Validates FR-4, FR-5.
- **SM-6: Evidence traceability** — 100% of ranked Contributors link to their source Transactions, calculation, Comparison Basis, and ranking rationale. Measured across the validation fixture set. Validates FR-18 through FR-21.
- **SM-7: Local-only operation** — 100% of the core workflow completes without external transmission of financial data or telemetry. Verified with network access disabled and local traffic inspection during acceptance testing. Validates FR-25 through FR-27, NFR-1.
- **SM-8: Clean startup** — A technically comfortable evaluator starts the application in the supported environment with one primary command after satisfying the documented prerequisites and without any undocumented steps. Measured through a clean-environment setup test. Validates NFR-10.
- **SM-9: Portfolio communication** — At least four of five reviewers can identify the problem, evidence model, privacy boundary, non-causal interpretation, and known limitations from the synthetic walkthrough and repository without installing the application. Measured through a short comprehension checklist. Validates the portfolio deliverables in `addendum.md`.

### Counter-Metrics

- **SM-C1: Number of Contributors shown** — Do not maximize; the product should show fewer defensible Contributors rather than more speculative findings. Counterbalances SM-3 and SM-6.
- **SM-C2: Investigation completion rate** — Do not improve by ranking when evidence is insufficient. Refusal is correct when Minimum Evidence is not met. Counterbalances SM-3.
- **SM-C3: Animation engagement** — Do not optimize Replay watch time; Replay exists to improve comprehension, not extend session duration. Counterbalances FR-23 and FR-24.

## 9. Constraints and Guardrails

### 9.1 Evidence Guardrails

- The system may state observed amounts, timing, sequence, deviation, association, and contribution under disclosed rules.
- The system must not infer motivation from a Transaction or Context.
- The system must refuse to rank when Minimum Evidence is not met.
- User-provided Context and Obligations must remain distinguishable from imported facts and derived findings.

### 9.2 Product-Generated Language

Preferred patterns include:

- "These Transactions contributed to the Account Balance decline."
- "This spending pattern was associated with a reduced buffer."
- "Based on the available records..."
- "The available evidence is insufficient to determine..."

Prohibited patterns include:

- "This Transaction caused your Shortfall."
- "You overspent because..."
- Prescriptive statements about what the user should buy, cancel, delay, or reduce

### 9.3 Supported Environment

- Windows 11
- Current versions of Chrome or Edge
- One local timezone per application environment
- One Currency per Account

## 10. Failure and Empty States

- No Accounts: offer Sample Data, manual Account creation, or CSV import.
- No Transactions: explain required data and provide onboarding actions.
- Invalid CSV: preserve preview state, identify mapping or format errors, and allow retry.
- Partial import: report accepted, duplicate, and rejected rows separately.
- All rows rejected: import no Transactions and list every rejection reason.
- Missing Opening Balance or running Balance: request the missing evidence before reconciliation.
- Reconciliation difference: show the difference and require resolution or explicit acceptance.
- No qualifying Shortfall: state that no Account Balance period fell below the Safety Threshold.
- Insufficient evidence: refuse Contributor ranking and list missing or inconsistent evidence.
- No defensible Contributors: state that the available evidence does not support a ranked explanation.
- Persistence, export, or deletion failure: retain current data state and clearly report failure.

## 11. Decision Status

No blocking questions or unvalidated assumptions remain for UX, architecture, or story creation.
