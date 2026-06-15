# Spine Pair Review — my-capstone

## Overall verdict

The spine pair is adequate and internally coherent, with a strong visual posture, resolved token references, and a complete UJ-1 investigation journey. It is not yet a fully source-extractable downstream contract because several PRD requirements lack explicit flow coverage, multiple load-bearing controls are not contracted as components, and several IA surfaces have incomplete state definitions.

## 1. Flow coverage — thin

The four `sources` entries resolve. The PRD defines one named journey, `UJ-1. Denzo investigates a balance decline and verifies the strongest Contributor`, plus FR-1 through FR-27. UJ-1 has a named protagonist, numbered steps, a climax, and a relevant failure path; Flow 2 and Flow 3 add useful import/reconciliation and evidence-correction coverage.

### Findings

- **high** The Key Flows do not provide explicit coverage or a traceability map for all named requirements. Material gaps include FR-1 through FR-3, FR-9 through FR-12, FR-22, and FR-25 through FR-27; several other FRs are only inferable from UJ-1 rather than named verbatim (`EXPERIENCE.md` § Key Flows; source `prd.md` § 4 Features). *Fix:* add focused named-protagonist flows for account/sample/manual onboarding and local-data control, then add a compact FR-to-flow coverage table for every FR-1 through FR-27.
- **medium** Flow 2 and Flow 3 use descriptive titles but do not name the source requirements they realize, weakening clean extraction for architecture and story generation (`EXPERIENCE.md` § Key Flows, Flow 2 and Flow 3). *Fix:* include the relevant FR identifiers and verbatim requirement names in each flow heading or in the proposed coverage table.

## 2. Token completeness — adequate

All color tokens are hex values. Typography, radius, spacing, and component token references conform to the documented types. Every `{path.to.token}` reference in `DESIGN.md` resolves; `EXPERIENCE.md` contains no unresolved token references.

### Findings

- **medium** Contrast is stated only as a general WCAG 2.2 AA requirement, without committing the load-bearing foreground/background pairs used by primary actions, provenance labels, warning callouts, destructive states, and focus rings (`DESIGN.md` § Colors and frontmatter `components`). *Fix:* state the required contrast target and verified token pairs, including text and non-text focus/selection combinations.

## 3. Component coverage — thin

The nine named component contracts in `DESIGN.md.components` have matching visual descriptions in `DESIGN.md` and behavioral rows in `EXPERIENCE.md`: App Navigation, Step Indicator, Balance Chart, Contributor Row, Evidence Inspector, Provenance Label, Limitation Callout, Replay Controls, and Data Table.

### Findings

- **high** Several load-bearing product components used by the IA and flows have no paired visual and behavioral contract: CSV preview/mapper, import result/rejection review, Account readiness/reconciliation panel, Safety Threshold and period controls, Transaction editor/detail, destructive confirmation, and responsive Contributors/Evidence tabs (`EXPERIENCE.md` § Information Architecture, Component Patterns, State Patterns, Responsive & Platform, and Key Flows). *Fix:* add normalized component names to both `DESIGN.md.components`/§ Components and `EXPERIENCE.md` § Component Patterns, or explicitly identify inherited shadcn components and specify only their behavioral deltas.
- **medium** Generic inherited components are invoked inconsistently as drawer, menu, dialog, tabs, and skeletons without an explicit inheritance boundary describing which shadcn defaults are contractual (`DESIGN.md` § Brand & Style and Elevation & Depth; `EXPERIENCE.md` § State Patterns and Interaction Primitives). *Fix:* add a short inherited-component list, matching the shadcn example pattern, and name only the customized variants in the local component tables.

## 4. State coverage — thin

The state table covers the highest-risk onboarding, reconciliation, ranking-refusal, recomputation, failure, and reduced-motion cases. Every IA surface was walked against empty, cold-load, focus, error, offline/service-unavailable, and destructive-action states where applicable.

### Findings

- **high** `Investigations` and `Settings & Privacy` have no surface-specific empty, loading, missing-record, export success, deletion confirmation/success, or clear-local-data states despite owning persistent and destructive workflows (`EXPERIENCE.md` § Information Architecture and State Patterns; source `prd.md` FR-25 through FR-27). *Fix:* add explicit states and recovery behavior for both surfaces.
- **medium** Transaction Replay lacks initial, paused, completed, no-events, stale-during-recompute, and failed-to-load states; only reduced motion is specified (`EXPERIENCE.md` § State Patterns and Component Patterns, Replay Controls). *Fix:* define the Replay lifecycle and the state restored on exit or failure.
- **medium** Account readiness, Shortfall selection, Period setup, Accounts & Data, and CSV import do not fully specify focus, successful completion, cancellation/resume, service-unavailable, or invalid-range states (`EXPERIENCE.md` § Information Architecture and State Patterns). *Fix:* extend the state table by IA surface, including preserved user input and the next corrective action.

## 5. Visual reference coverage — thin

There are no usable files in `mockups/` or `wireframes/`; `imports/` contains only `.gitkeep`, which is a placeholder rather than a visual reference. There are therefore no orphaned visual artifacts or broken inline artifact links.

### Findings

- **medium** No visual reference anchors the layout-driving three-region investigation workspace, responsive tab transformation, CSV mapping, or Replay mode (`DESIGN.md` § Layout & Spacing; `EXPERIENCE.md` § Information Architecture and Responsive & Platform). *Fix:* create and link key-screen references for those surfaces, naming what each illustrates and stating once that the spines win on conflict.

## 6. Bloat & overspecification — strong

The pair is concise, uses tables where extraction benefits, avoids implementation-level pixel positioning beyond reusable tokens and breakpoints, and does not duplicate the PRD wholesale. The invented Evidence Synchronization section carries a product-specific contract and earns its place.

### Findings

No material findings.

## 7. Inheritance discipline — adequate

All four source paths resolve. `UJ-1` is reproduced verbatim, glossary terms are generally preserved, component names match across the two component sections, and all token references resolve. The shadcn/ui inheritance posture is directionally clear.

### Findings

- **medium** Requirement inheritance is not mechanically traceable because FR names are absent from the experience contract, and Flow 2/Flow 3 introduce summaries rather than verbatim source requirement names (`EXPERIENCE.md` § Key Flows; source `prd.md` § 4 Features). *Fix:* add a source coverage table using exact FR identifiers and titles without restating requirement prose.
- **low** The decision log still lists responsive behavior and detailed state patterns as open after both were decided and written into `EXPERIENCE.md` (`.decision-log.md` § Open Decisions versus Confirmed Decisions and `EXPERIENCE.md` §§ State Patterns, Responsive & Platform). *Fix:* close or replace stale open items during the next UX update so the canonical decision history does not conflict with the spines.

## 8. Shape fit — adequate

`DESIGN.md` follows the canonical section order. `EXPERIENCE.md` includes every default section, the triggered Responsive & Platform section, and one justified product-specific section. Frontmatter includes the required design-system identity and resolvable sources.

### Findings

- **medium** Inspiration & Anti-patterns is missing even though the sources and decision log explicitly reject banking-dashboard styling, detective metaphors, decorative graph networks, gradients, causal language, and advisory behavior (`DESIGN.md` § Brand & Style and Do's and Don'ts; `.decision-log.md` § Visual Posture; source `brief.md` and `prd.md`). *Fix:* add a concise Inspiration & Anti-patterns section to `EXPERIENCE.md` that records lifted interaction precedents and rejected product patterns without repeating the visual rules.

## Mechanical notes

- Source frontmatter: all four relative paths resolve from the UX workspace.
- Frontmatter completeness: `DESIGN.md` includes `name`, `description`, all supported token groups, metadata, and sources; `EXPERIENCE.md` includes identity, status, dates, and matching sources.
- Token references: all 26 prose references and all component-internal references resolve.
- Component naming: the nine currently contracted names match across both spines; additional UI nouns are not yet normalized as components.
- Cross-references: `EXPERIENCE.md` correctly identifies `DESIGN.md` as the visual identity source; no artifact links exist.
- Visual artifacts: `imports/.gitkeep` is non-visual; no `mockups/` or `wireframes/` files were found.
- Mermaid: no Mermaid blocks are present, so syntax validation is not applicable.
