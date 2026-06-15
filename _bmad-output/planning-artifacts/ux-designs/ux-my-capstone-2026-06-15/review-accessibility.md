# Accessibility UX Review - Shortfall Investigator

## Verdict

**Adequate direction, not yet implementation-ready for WCAG 2.2 AA.** The contracts explicitly cover keyboard access, chart alternatives, provenance, Replay, reduced motion, visible focus, and responsive layouts, aligning well with PRD NFR-4 through NFR-7. However, several load-bearing behaviors remain too general to implement or test consistently, especially focus management, composite-widget keyboard models, live announcements, chart/table equivalence, 320 CSS-pixel reflow, and financial-value pronunciation.

## Findings

### A11Y-01 - High - Keyboard models are ambiguous across composite widgets

- **Location:** `EXPERIENCE.md` Component Patterns lines 60-66; Interaction Primitives lines 89-90.
- **WCAG 2.2 AA:** 2.1.1 Keyboard; 2.4.3 Focus Order.
- **PRD trace:** NFR-5; FR-14; FR-21; FR-24.
- **Impact:** The statement that arrow keys move within chart points, Contributor rows, tabs, and Replay controls "where the composite-widget pattern applies" does not identify which ARIA pattern each component follows. Implementers may create inconsistent tab stops, unexpected arrow behavior, or controls that cannot be operated reliably by keyboard and screen-reader users.
- **Concrete fix:** Define a keyboard contract per component. Specify whether the chart and Contributor list use a single roving `tabindex` or individually tabbable controls; require Left/Right or Up/Down behavior, `Home`/`End`, and wrap/no-wrap rules; define tabs using the ARIA Tabs pattern; keep ordinary Replay buttons in normal `Tab` order rather than treating the toolbar as a composite unless a documented toolbar pattern is used. State that every pointer action has the same keyboard result.

### A11Y-02 - High - Focus movement and restoration are not defined

- **Location:** `EXPERIENCE.md` lines 38, 58, 61, 90-92, 102, 112-119; Key Flow 1 lines 131-136.
- **WCAG 2.2 AA:** 2.4.3 Focus Order; 2.4.11 Focus Not Obscured (Minimum); 3.2.1 On Focus.
- **PRD trace:** FR-21; FR-24; NFR-5.
- **Impact:** Selecting a Contributor updates a persistent inspector, responsive tabs replace regions, drawers and dialogs close with `Escape`, and Replay temporarily changes emphasis, but the contracts do not say where focus remains or moves. Users may lose their position, miss newly revealed evidence, or return from Replay to the top of the page.
- **Concrete fix:** Add explicit rules: selection alone keeps focus on the initiating control; an `Open evidence` action moves focus to the inspector heading; switching to a hidden responsive Evidence tab focuses its tab or heading; dialogs and drawers trap focus and restore it to their invoker; entering Replay focuses its heading or first control only after explicit activation; exiting Replay restores focus to the invoking control and preserves the selected Contributor. Require focused elements to remain visible despite sticky headers, panels, and virtualized lists.

### A11Y-03 - High - Chart alternatives lack a testable equivalence contract

- **Location:** `DESIGN.md` line 155; `EXPERIENCE.md` lines 60, 99, 129; Responsive lines 112-115.
- **WCAG 2.2 AA:** 1.1.1 Non-text Content; 1.3.1 Info and Relationships; 1.4.1 Use of Color; 2.1.1 Keyboard.
- **PRD trace:** FR-14; FR-22; NFR-6.
- **Impact:** A summary and table are required, but their content, update behavior, and relationship to chart selection are undefined. An alternative could omit threshold crossings, period boundaries, selected Shortfall, Category trend, or linked Transactions, making the core investigation less complete without vision.
- **Concrete fix:** Require every chart alternative to expose the chart title, Account and Currency, date range, Safety Threshold, selected Shortfall, Investigation and Comparable Period boundaries, threshold-crossing event, values at each relevant point, and selected evidence. Make chart and table selection bidirectional and preserve the same active item. Provide an always-available text summary plus a semantic table with caption, column headers, sortable-state announcements where applicable, and a non-visual route to the corresponding Transactions. Do not hide the alternative behind a pointer-only control.

### A11Y-04 - High - Status announcements are named but not behaviorally specified

- **Location:** `EXPERIENCE.md` State Patterns lines 72-84; Accessibility Floor line 101; Evidence Synchronization line 119.
- **WCAG 2.2 AA:** 4.1.3 Status Messages; 3.3.1 Error Identification.
- **PRD trace:** FR-5; FR-8; FR-17; FR-24; FR-25 through FR-27; NFR-9.
- **Impact:** Import results, reconciliation changes, stale findings, recomputation, ranking refusal, persistence failures, synchronized selection, and Replay events can update without moving focus. Without priority, wording, and deduplication rules, screen-reader users may receive silence or an unusable stream of announcements.
- **Concrete fix:** Define status channels: use polite status announcements for import counts, selection summaries, stale/recomputed findings, and Replay state; use assertive alerts only for blocking errors or failed destructive operations. Announce the result and next action, not merely "updated." Suppress duplicate synchronization messages, batch multi-region updates into one summary, and during autoplay announce only meaningful milestones such as threshold crossing unless the user chooses event-by-event narration.

### A11Y-05 - High - Responsive behavior does not establish WCAG reflow at 320 CSS pixels

- **Location:** `EXPERIENCE.md` Responsive & Platform lines 107-115; Information Architecture line 38.
- **WCAG 2.2 AA:** 1.4.10 Reflow; 1.3.2 Meaningful Sequence; 2.4.3 Focus Order.
- **PRD trace:** NFR-4 through NFR-6.
- **Impact:** The `<768px` stacked experience is directionally sound, but there is no requirement for 320 CSS-pixel width or 400% zoom, no defined reading order after the three-region layout collapses, and no handling for wide financial tables. Users with low vision may need two-dimensional scrolling or encounter a DOM order that differs from the visible order.
- **Concrete fix:** Require the core journey to reflow at 320 CSS pixels without two-dimensional page scrolling. Define one DOM order used at every breakpoint: investigation context, chart summary/alternative, Contributors, Evidence, then Replay controls/detail. Allow localized horizontal scrolling only for genuinely two-dimensional tables or charts, with labeled scroll regions and a stacked-row alternative where comparison is not essential. Verify drawers, tabs, sticky content, validation messages, and zoomed text do not obscure focus or actions.

### A11Y-06 - High - Replay needs a complete non-visual and reduced-motion operating model

- **Location:** `DESIGN.md` line 160; `EXPERIENCE.md` lines 65, 84, 89-104, 113-119, 134-136.
- **WCAG 2.2 AA:** 2.1.1 Keyboard; 2.2.2 Pause, Stop, Hide; 2.3.3 Animation from Interactions; 4.1.2 Name, Role, Value; 4.1.3 Status Messages.
- **PRD trace:** FR-23; FR-24; NFR-7; PRD same-day ordering rule at FR-23.
- **Impact:** The contracts list controls and reduced-motion behavior but do not define Replay's timeline semantics, autoplay announcement policy, event ordering presentation, or what remains available when animation is removed. Users may be unable to understand balance changes and same-day event order without watching motion.
- **Concrete fix:** Specify Replay as an ordered event list with current position (`event n of total`), local date, source/stable import order for same-day Transactions, signed Amount plus Currency, resulting Account Balance, threshold state, and linked Contributor. All controls must expose accessible names, pressed/current state where applicable, and disabled state at boundaries. Pause must remain immediately reachable. Under `prefers-reduced-motion: reduce`, use instantaneous steps with no interpolation, panning, flashing, or animated auto-scroll; retain every state change and threshold-crossing cue in text. Restore the complete view and prior focus/selection on exit or completion.

### A11Y-07 - Medium - Financial data formatting is not sufficiently explicit for comprehension

- **Location:** `DESIGN.md` lines 133-135, 161; `EXPERIENCE.md` lines 46-52, 61, 103; PRD NFR-14.
- **WCAG 2.2 AA:** 1.3.1 Info and Relationships; 3.1.5 Reading Level; 3.3.2 Labels or Instructions.
- **PRD trace:** FR-19 through FR-21; NFR-12 through NFR-14; SM-3.
- **Impact:** Currency is added to accessible names only when visual context would otherwise carry it, and tabular numerals address alignment but not meaning. A screen reader may announce ambiguous symbols, minus signs, compact dates, percentages, or debit/credit conventions, weakening the user's ability to verify rankings and distinguish impact from deviation.
- **Concrete fix:** Define a financial presentation contract: show Account Currency near every monetary group and include the ISO code in accessible text where a symbol is ambiguous; express negative values as `debit`/`decrease` where sign alone is unclear; use locale-readable dates with unambiguous accessible text; preserve two-decimal Currency rounding; label impact, Comparable Period value, deviation, and resulting balance distinctly; expose table headers to every value; and provide plain-language calculation text in the same reading order as the visual formula.

### A11Y-08 - Medium - Provenance is visually labeled but not structurally associated with evidence

- **Location:** `DESIGN.md` lines 126 and 158; `EXPERIENCE.md` lines 61-63 and 117-119.
- **WCAG 2.2 AA:** 1.3.1 Info and Relationships; 1.4.1 Use of Color; 3.3.2 Labels or Instructions.
- **PRD trace:** FR-8; FR-11; FR-12; FR-20; SM-3; SM-6.
- **Impact:** Text badges prevent color-only meaning, but the contracts do not require programmatic association between each provenance label, its value, source, correction, and limitation. Screen-reader users may hear a sequence of evidence without knowing which items are imported, user-provided, calculated, or derived.
- **Concrete fix:** Require provenance to be part of each evidence item's accessible name or description and grouped semantically with that item. For corrected imports, expose both the original imported value and current user-corrected value with clear labels. Make limitations adjacent in DOM and programmatically associated with the affected finding. Use a consistent four-value vocabulary everywhere.

### A11Y-09 - Medium - Focus appearance has no measurable token or obscuration rule

- **Location:** `DESIGN.md` tokens lines 14-15 and Colors line 129; `EXPERIENCE.md` lines 98 and 102.
- **WCAG 2.2 AA:** 1.4.11 Non-text Contrast; 2.4.7 Focus Visible; 2.4.11 Focus Not Obscured (Minimum).
- **PRD trace:** NFR-5.
- **Impact:** A focus-ring color is defined, but thickness, offset, component coverage, and visibility under sticky or clipped containers are not. Browser or component defaults may be overridden into an indicator that is technically present but difficult to perceive.
- **Concrete fix:** Add focus tokens for width, style, and offset, and require at least 3:1 contrast between the focused and unfocused visual states. Apply the indicator to every custom control, chart point, row action, link, tab, and Replay control. Prohibit clipping by `overflow`, and require scrolling or layout adjustment so the focused item is not entirely hidden by sticky content.

### A11Y-10 - Medium - Target-size coverage is limited to "primary controls"

- **Location:** `EXPERIENCE.md` line 105; compact controls implied by `DESIGN.md` Components.
- **WCAG 2.2 AA:** 2.5.8 Target Size (Minimum).
- **PRD trace:** NFR-4; FR-24.
- **Impact:** Secondary icon buttons, chart points, row actions, disclosure controls, table sort controls, and Replay speed/jump affordances could fall below the AA minimum even though primary controls are 44 by 44 CSS pixels.
- **Concrete fix:** Keep the preferred 44 by 44 CSS-pixel target for primary and frequent controls, but explicitly require every pointer target to be at least 24 by 24 CSS pixels or have sufficient non-overlapping spacing under WCAG 2.5.8 exceptions. Enlarge the hit area without enlarging compact icons, and test densely packed chart markers and table actions.

### A11Y-11 - Medium - Virtualization may break reading order and evidence traceability

- **Location:** `EXPERIENCE.md` Data Table line 66; PRD capacity requirement NFR-8.
- **WCAG 2.2 AA:** 1.3.1 Info and Relationships; 1.3.2 Meaningful Sequence; 2.4.3 Focus Order; 4.1.2 Name, Role, Value.
- **PRD trace:** FR-5; FR-21 through FR-24; NFR-8; SM-6.
- **Impact:** Virtualized Transaction lists can remove focused rows from the accessibility tree, misstate row counts, reset position, or make evidence links appear to disappear. This is especially risky when chart, Contributor, and Replay selections synchronize to rows outside the rendered window.
- **Concrete fix:** Prefer pagination for semantic tables. If virtualization is necessary, require stable row identifiers, correct total and position metadata, focus retention, programmatic scrolling to selected evidence, no recycling of a focused DOM node into different content, and an accessible non-virtualized export or paginated view. Announce page/window changes without flooding the live region.

### A11Y-12 - Low - The "Best on a larger screen" notice could be mistaken for a restriction

- **Location:** `EXPERIENCE.md` line 113.
- **WCAG 2.2 AA:** 3.3.2 Labels or Instructions; 3.2.4 Consistent Identification.
- **PRD trace:** Responsive MVP scope and NFR-4.
- **Impact:** Although the contract says no function disappears, the notice may discourage users who depend on zoom or narrow windows, or imply that CSV mapping and Replay are incomplete on mobile.
- **Concrete fix:** Use neutral copy such as: `All controls remain available here. A wider window may make side-by-side comparison easier.` Place it as advisory text, not a warning or blocking dialog, and provide a direct path to continue.

## Strengths To Preserve

- The PRD and UX contracts consistently require WCAG 2.2 AA, keyboard operation, chart summaries and tables, visible focus, accessible names, and reduced-motion Replay.
- Color is explicitly supplementary for provenance, chart state, and warnings.
- Limitations remain visible rather than tooltip-only, supporting financial comprehension and non-causal interpretation.
- Replay does not autoplay, and synchronization preserves one primary evidence selection.
- The preferred 44 by 44 CSS-pixel primary targets exceed the WCAG 2.2 AA minimum.
- Responsive intent preserves functionality rather than removing it on narrow screens.

## Recommended Acceptance Checks

1. Complete UJ-1 with keyboard only at desktop width, 400% zoom, and 320 CSS-pixel viewport width.
2. Complete Shortfall selection and Contributor verification using only the text summary and table alternatives.
3. Run Replay with a screen reader in manual and autoplay modes, including same-day Transactions and threshold crossing.
4. Enable reduced motion and confirm that all Replay information remains available without interpolation, panning, or animated auto-scroll.
5. Correct evidence during an Investigation and verify stale, recomputing, completion, and failure messages without focus movement.
6. Verify each amount, date, rank, provenance label, calculation, and limitation is understandable out of visual context.
7. Inspect focus visibility and target size for chart points, disclosures, table actions, responsive tabs, drawers, and all Replay controls.
