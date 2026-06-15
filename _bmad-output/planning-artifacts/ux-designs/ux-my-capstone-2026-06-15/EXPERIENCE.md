---
name: Shortfall Investigator
status: final
created: 2026-06-15
updated: 2026-06-15
sources:
  - ../../briefs/brief-my-capstone-2026-06-15/brief.md
  - ../../briefs/brief-my-capstone-2026-06-15/addendum.md
  - ../../prds/prd-my-capstone-2026-06-15/prd.md
  - ../../prds/prd-my-capstone-2026-06-15/addendum.md
---

# Shortfall Investigator - Experience Spine

## Foundation

Desktop-first responsive web application for a local, single-user environment. The primary supported setup is current Chrome or Edge on Windows 11. shadcn/ui supplies the base component and accessibility vocabulary; `DESIGN.md` owns visual identity and brand-layer tokens.

The experience is a guided investigation, not a general analytics dashboard. It should move Denzo from uncertain source data to a supported, verifiable explanation within five minutes when Sample Data is used.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Investigate | App open / navigation | Start or resume the guided investigation |
| Account readiness | Investigate step 1 | Select Account; review data coverage, Opening Balance, and reconciliation |
| Shortfall selection | Investigate step 2 | Set Safety Threshold and choose one qualifying Shortfall |
| Period setup | Investigate step 3 | Confirm Investigation Period and Comparable Period |
| Investigation workspace | Investigate step 4 | Review chart, ranked Contributors, and synchronized evidence |
| Transaction Replay | Investigation workspace | Walk chronologically through the selected period |
| Accounts & Data | Navigation | Manage Accounts, Transactions, Obligations, Context, imports, and reconciliation |
| CSV import | Accounts & Data | Preview, map, validate, import, and review rejected rows |
| Investigations | Navigation | Reopen prior Investigation results |
| Settings & Privacy | Navigation | Export, inspect local-data boundaries, delete Accounts, or clear local data |

Desktop navigation is persistent at left. The Investigation step indicator remains visible without replacing global navigation. Modal stacks are limited to one level.

The Investigation workspace uses three regions: chart and period controls above, ranked Contributors in the main-left region, and a persistent Evidence Inspector at right.

Visual references:

- [`mockups/investigation-workspace.html`](mockups/investigation-workspace.html) anchors the Investigation workspace.
- [`mockups/csv-readiness.html`](mockups/csv-readiness.html) anchors CSV import and Account readiness.
- [`mockups/transaction-replay.html`](mockups/transaction-replay.html) anchors Replay.

The spines win on conflict with any mockup or import.

## Voice and Tone

Microcopy is calm, precise, non-judgmental, and explicit about evidence limits.

| Do | Don't |
|---|---|
| "Based on the available records, these Transactions contributed to the decline." | "These purchases caused your Shortfall." |
| "Comparison data is incomplete. Ranking excludes deviation." | "We could not analyze your spending." |
| "Resolve or accept the $12.40 reconciliation difference to continue." | "Something went wrong." |
| "No defensible Contributors were found for this period." | "Nothing caused this Shortfall." |
| "Your financial data remains in this local environment." | "Your data is 100% safe." |

Use source glossary terms verbatim. Avoid blame, celebration, financial prescriptions, motivational language, and unsupported statements about intent.

## Component Patterns

| Component | Use | Behavioral rules |
|---|---|---|
| App Navigation | Global | Desktop persistent; drawer below 1024px. Preserve active surface and unsaved import state. |
| Step Indicator | Investigate | Shows Account readiness, Shortfall, Period, and Findings. Completed steps remain revisitable; invalidating an earlier choice marks later findings stale. |
| Balance Chart | Shortfall selection, Investigation workspace, Replay | Supports pointer and keyboard selection. Threshold, period, crossing, and selected evidence remain synchronized with equivalent summary and table. |
| Contributor Row | Investigation workspace | Shows rank, impact, comparison when valid, timing, and one-sentence explanation. Selection opens the Contributor in Evidence Inspector without navigation. |
| Evidence Inspector | Investigation workspace | Shows provenance labels and source Transactions immediately. Calculation is collapsed by default. Limitations stay visible. `Related evidence` appears only when it clarifies the finding. |
| Provenance Label | Evidence surfaces | Text labels distinguish `Imported fact`, `User-provided`, `Calculated`, and `Derived finding`; color supplements text. |
| Limitation Callout | Readiness, findings, evidence | Lists what is unavailable or inconsistent, its effect on ranking, and the corrective path. Never tooltip-only. |
| Replay Controls | Transaction Replay | Play, pause, previous, next, restart, speed, and jump. Exposes current event and state to assistive technology. |
| Data Table | Accounts & Data, chart alternatives, evidence | Sortable only where sorting does not obscure chronology. Long lists use pagination or virtualization, not infinite scroll. |
| Account Readiness Panel | Account readiness | Shows data coverage, balance source, reconciliation status, and one next action. A difference must be corrected or explicitly accepted before ranking. |
| CSV Mapper | CSV import | Preserves the selected file and mappings after validation failure. Required mappings expose examples; ambiguous dates require explicit interpretation. |
| Import Result | CSV import | Separates accepted, duplicate, and rejected counts. Rejected rows retain source row number, reason, and retry path. |
| Period Controls | Shortfall selection, Period setup | Threshold and date changes update previews immediately. Invalid or incomplete ranges keep the user's values and identify the correction. |
| Transaction Detail | Accounts & Data, Evidence Inspector | Shows imported and corrected values together. Editing, exclusion, Transfer, Refund, Obligation, and Context actions expose provenance and downstream effects. |
| Destructive Confirmation | Accounts & Data, Settings & Privacy | Uses one modal level, names affected records, requires an explicit destructive action, traps focus, and restores focus to the invoker. |
| Responsive Region Tabs | Investigation workspace below 1024px | Implements the ARIA Tabs pattern. Selecting a tab reveals Contributors or Evidence without losing the active Contributor. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold load | Global | Layout-matched skeletons; do not show stale findings as current. |
| No Accounts | Investigate | Offer `Load Sample Data`, `Import CSV`, and `Create Account`. |
| No Transactions | Account readiness | Explain Minimum Evidence and route to manual entry or CSV import. |
| Import mapping error | CSV import | Preserve file and mappings; identify affected columns and example values. |
| Partial import | CSV import | Separate accepted, duplicate, and rejected counts; allow retry without duplicating accepted rows. |
| Missing balance evidence | Account readiness | Request Opening Balance or running balance mapping before reconciliation. |
| Reconciliation difference | Account readiness | Show amount and evidence; require correction or explicit acceptance before ranking. |
| No qualifying Shortfall | Shortfall selection | State that no period crossed the current Safety Threshold; allow threshold adjustment. |
| Insufficient evidence | Investigation workspace | Refuse ranking; list every missing or inconsistent input and correction route. |
| No defensible Contributors | Investigation workspace | Show the complete Investigation context but no ranked list; explain the limiting evidence. |
| Recomputing | Investigation workspace | Mark findings stale and disable treating them as current until synchronized recomputation completes. |
| Persistence/export/delete failure | Relevant surface | Retain current data, state what failed, and offer a safe retry. |
| Reduced motion | Replay | Replace animated transitions with immediate step changes. |
| Investigations empty | Investigations | State that no saved Investigations exist and route to `Investigate`. |
| Investigation missing | Investigations | Explain that source evidence was removed or changed; preserve the record summary and offer a new Investigation. |
| Export success/failure | Settings & Privacy | Announce the Account and exported record count on success. On failure, retain data and offer retry. |
| Delete confirmation/success | Settings & Privacy | Name the Account and affected records before deletion; restore focus to the next logical heading after success. |
| Clear local data | Settings & Privacy | Require typed or checkbox confirmation of scope; report completion or failure without implying recoverability. |
| Replay ready | Transaction Replay | Show total events, selected period, and controls at event 1 without autoplay. |
| Replay paused | Transaction Replay | Preserve current event and selection; announce `Paused at event n of total`. |
| Replay completed | Transaction Replay | Announce completion and restore the complete Investigation view with prior Contributor selected. |
| Replay no events | Transaction Replay | Explain that the period contains no replayable Transactions and return to Period setup. |
| Replay stale | Transaction Replay | Pause immediately when evidence changes; identify recomputation and prevent resuming stale data. |
| Replay load failure | Transaction Replay | Preserve Investigation context, state what failed, and return focus to the Replay invoker. |
| Import cancelled/resumed | CSV import | Preserve mappings for the current session and return focus to the import trigger; resuming returns to the first incomplete mapping. |
| Invalid period | Period setup | Preserve entered dates, identify overlap or missing coverage, and keep findings unavailable until valid. |
| Local service unavailable | Global | Keep existing visible data read-only where safe; identify the unavailable local service and retry action. |

## Interaction Primitives

- Click or tap to select; selection is never hover-only.
- `Tab` follows visual reading order and enters each composite widget once.
- Balance Chart points use roving `tabindex`: Left/Right moves by chronological point, Home/End moves to first/last, and movement does not wrap.
- Contributor Row list uses roving `tabindex`: Up/Down moves one row, Home/End moves first/last, and movement does not wrap. `Enter` selects; a separate `Open evidence` action moves focus.
- Responsive Region Tabs implement the ARIA Tabs pattern: Left/Right changes the active tab, Home/End moves first/last, and automatic activation is permitted only when content is already available without delay.
- Replay buttons remain ordinary controls in normal `Tab` order; arrow keys are not substituted for `Tab`.
- `Enter` or `Space` activates the focused control. `Escape` closes the topmost drawer, menu, or dialog.
- Selecting a chart point, Contributor, Transaction, or Replay event updates all synchronized evidence regions.
- Selection alone keeps focus on the initiating control. `Open evidence` moves focus to the Evidence Inspector heading. Entering Replay after explicit activation moves focus to the Replay heading; exiting restores focus to the invoking control and preserves the selected Contributor.
- Dialogs and drawers trap focus while open and restore it to their invoker. Focused items must scroll into view and must not be obscured by sticky headers, clipped panels, or virtualized content.
- Changes to evidence invalidate affected findings until recomputation completes.
- Destructive actions require explicit confirmation naming the affected Account or local records.
- Banned: infinite scroll, hidden hover-only actions, auto-playing Replay, nested dialogs, decorative graph animation, and color-only meaning.

## Accessibility Floor

- Target WCAG 2.2 AA across the core journey.
- Every interactive element exposes name, role, state, and visible keyboard focus.
- Every chart alternative exposes the chart title, Account, Currency, date range, Safety Threshold, selected Shortfall, Investigation and Comparable Period boundaries, threshold crossing, relevant point values, and selected evidence. The always-available text summary and semantic table remain bidirectionally synchronized with chart selection and link to corresponding Transactions.
- Tables have captions and headers associated with each value. Sorting announces column and direction. Chart alternatives are never pointer-only.
- Use polite status announcements for import counts, selection summaries, stale/recomputed findings, ranking refusal, and Replay state. Use assertive alerts only for blocking errors and failed destructive operations. Batch synchronized multi-region changes into one result-and-next-action message and suppress duplicates.
- During Replay autoplay, announce threshold crossing and user-selected milestones by default, not every event. Event-by-event narration is an explicit option.
- Focus order follows the visible region order: step and period context, chart, Contributors, Evidence Inspector.
- Monetary groups show Account Currency. Accessible text includes the ISO Currency code when symbols are ambiguous; negative values use `debit` or `decrease` where sign alone is unclear. Dates have unambiguous locale-readable accessible text. Impact, Comparable Period value, deviation, and resulting balance have distinct labels and two-decimal Currency rounding.
- Provenance is programmatically associated with each evidence item. Corrected imports expose original imported and current user-corrected values. Limitations are adjacent in the DOM and described by the affected finding.
- Reduced-motion preferences disable animated chart interpolation and Replay transitions.
- Pointer targets are preferably at least 44 by 44 CSS pixels for frequent controls. Every target meets at least 24 by 24 CSS pixels or the WCAG 2.5.8 spacing exception; compact icons use enlarged hit areas.
- Focus indicators meet 3:1 non-text contrast, are not clipped, and remain at least partially visible when sticky content is present.

## Responsive & Platform

| Width | Behavior |
|---|---|
| `>= 1024px` | Persistent left navigation and full three-region Investigation workspace. |
| `768-1023px` | Navigation drawer; chart above tabs for `Contributors` and `Evidence`. |
| `< 768px` | Stacked review experience; tables become stacked rows when comparison is not essential. CSV mapping and Replay remain accessible with `Best on a larger screen` notice. |

The core journey reflows at 320 CSS pixels and 400% zoom without two-dimensional page scrolling. The DOM order remains: Investigation context, chart summary and alternative, Contributors, Evidence, Replay controls and detail. Local horizontal scrolling is allowed only inside labeled, genuinely two-dimensional chart or table regions; a stacked alternative is provided when comparison is not essential.

No required function disappears at smaller widths. Desktop and tablet remain the primary surfaces for CSV mapping, chart comparison, and Replay. Advisory copy is: `All controls remain available here. A wider window may make side-by-side comparison easier.`

## Evidence Synchronization

The active selection is shared across chart, Contributor list, source Transactions, calculation, Related evidence, and Replay. Only one evidence item is primary at a time. Returning from detail or Replay restores the complete Investigation view and prior selection.

Provenance and limitation information remains attached to its evidence when the layout changes across breakpoints.

## Replay Model

Replay is an ordered event list. Each event exposes `event n of total`, local date, source order and stable import order for same-day Transactions, signed Amount and Currency, resulting Account Balance, threshold state, and linked Contributor. Controls expose accessible names, current or pressed state where relevant, and disabled state at boundaries. Pause remains immediately reachable.

Under reduced motion, events change instantaneously without interpolation, panning, flashing, or animated auto-scroll. Every balance, threshold, Contributor, and evidence change remains available in text. Exit, completion, or failure restores the complete Investigation view, prior selection, and invoking focus.

## Inspiration & Anti-patterns

- Lift the synchronized master-detail discipline of analytical workspaces: one selection updates every evidence view.
- Lift progressive disclosure from audit tools: summary first, source and calculation on demand.
- Reject banking-dashboard conventions that frame spending as performance or advice.
- Reject detective-board metaphors and decorative graph networks.
- Reject causal, motivational, or prescriptive copy.
- Reject animation as engagement; Replay exists for comprehension.

## Key Flows

### Flow 1 - UJ-1. Denzo investigates a balance decline and verifies the strongest Contributor

1. Denzo opens the local application with Sample Data loaded.
2. `Investigate` opens at Account readiness and shows the Account as reconciled.
3. Denzo sets the Safety Threshold and chooses a highlighted Shortfall from the chart or accessible list.
4. The application proposes Investigation and Comparable Periods; Denzo confirms them.
5. The Investigation workspace shows the balance decline above and ranked Contributors below.
6. Denzo selects the highest-ranked Contributor. The Evidence Inspector shows its source Transactions, impact, comparison, timing, provenance, and limitations.
7. Denzo expands the calculation and confirms why the Contributor received its rank.
8. Denzo starts Transaction Replay and steps through the threshold crossing while chart, Transaction, and evidence selection remain synchronized.
9. **Climax:** Denzo can identify the strongest observable Contributor, cite its source evidence, and explain that it contributed under disclosed rules rather than proven causation.
10. Denzo exits Replay and returns to the complete Investigation view with the Contributor still selected.

Failure path: if reconciliation or Minimum Evidence is incomplete, the workspace refuses ranking, lists each issue, and routes Denzo to the exact Account or Transaction correction required.

### Flow 2 - Denzo imports and reconciles a personal statement

1. Denzo opens `Accounts & Data` and chooses `Import CSV`.
2. Denzo previews the file and maps required columns.
3. Ambiguous dates require an explicit date interpretation before import.
4. The import result separates accepted, duplicate, and rejected rows.
5. Denzo reviews the reconstructed balance and a visible reconciliation difference.
6. Denzo corrects a mapping or explicitly accepts the disclosed difference.
7. **Climax:** Account readiness changes to `Ready to investigate`, with the evidence source and reconciliation status visible.

Failure path: if all rows are rejected, no Transactions are imported; the preserved preview lists every rejection and allows correction and retry.

### Flow 3 - Denzo corrects evidence and verifies recomputation

1. From a selected Contributor, Denzo opens one source Transaction.
2. Denzo corrects its Category and marks another Transaction as a Transfer.
3. The application labels existing findings stale and begins recomputation.
4. Updated balance, Contributor ranks, chart selection, and Replay data replace the stale state together.
5. **Climax:** Denzo sees the revised ranking and can trace the changed result to the two explicit corrections.

Failure path: if persistence fails, edits remain visible but unsaved, the prior committed findings remain identified, and Denzo receives a retry action.

### Flow 4 - Denzo manages local data and privacy

1. Denzo opens `Settings & Privacy` and selects an Account export.
2. The application identifies the Account, Currency, and included record types.
3. Denzo exports Transactions and receives a polite status message with the record count.
4. Denzo reviews the local-only boundary and selects `Delete Account`.
5. A destructive confirmation names Transactions, Obligations, Context, and derived findings that will be removed.
6. **Climax:** after explicit confirmation, the Account disappears, completion is announced, and focus moves to the Accounts heading without implying recovery.

Failure path: export or deletion failure retains all local data, identifies the failed operation, and offers retry.

### Flow 5 - Denzo starts without imported data

1. Denzo opens the app with no Accounts.
2. `Investigate` offers `Load Sample Data`, `Import CSV`, and `Create Account`.
3. Denzo creates an Account and manually enters a Transaction with required fields.
4. Denzo adds an Opening Balance and reviews Account readiness.
5. Denzo may add an Obligation or Context; each is labeled `User-provided` and does not alter rank without a linked Transaction.
6. **Climax:** the Account becomes ready for Shortfall selection, and Denzo understands which evidence is imported, entered, or derived.

Failure path: invalid values remain in the form, identify the affected fields, and do not create a partial Transaction.

## Requirement Coverage

| Source requirement | Covered by |
|---|---|
| FR-1 Manage Accounts; FR-2 Load and Reset Sample Data; FR-3 Enter Transactions Manually | Flow 5; Account Readiness Panel; No Accounts and No Transactions states |
| FR-4 Preview and Map CSV Data; FR-5 Import Valid Rows and Report Rejections; FR-6 Prevent Duplicate Transactions; FR-7 Establish and Reconcile Account Balance | Flow 2; CSV Mapper; Import Result; Account Readiness Panel |
| FR-8 Correct Transactions; FR-9 Exclude, Delete, and Undo Evidence; FR-10 Identify Transfers and Refunds; FR-11 Record Obligations; FR-12 Record Context | Flow 3 and Flow 5; Transaction Detail |
| FR-13 Define Safety Threshold; FR-14 Identify and Select Shortfalls; FR-15 Propose and Adjust Investigation Period; FR-16 Select Comparable Period | Flow 1; Period Controls; Balance Chart |
| FR-17 Enforce Minimum Evidence; FR-18 Determine Eligible Contributors; FR-19 Rank Contributors; FR-20 Explain Findings Without Causal Overclaiming; FR-21 Inspect Contributor Evidence | Flow 1; Contributor Row; Evidence Inspector; Limitation Callout |
| FR-22 View Historical Trends; FR-23 Replay Transactions Chronologically; FR-24 Control Transaction Replay | Flow 1; Balance Chart; Replay Model and Replay Controls |
| FR-25 Persist Local Data; FR-26 Export Transactions; FR-27 Permanently Delete Local Data | Flow 4; Settings & Privacy states; Destructive Confirmation |
