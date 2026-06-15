---
name: Shortfall Investigator
description: Visual identity contract for a calm, evidence-first financial investigation application.
status: final
created: 2026-06-15
updated: 2026-06-15
colors:
  primary: '#1D4ED8'
  primary-foreground: '#FFFFFF'
  background: '#F8FAFC'
  foreground: '#172033'
  surface: '#FFFFFF'
  surface-muted: '#F1F5F9'
  muted-foreground: '#5F6B7A'
  border: '#CBD5E1'
  focus-ring: '#2563EB'
  evidence-fact: '#1D4ED8'
  evidence-user: '#6D28D9'
  evidence-derived: '#0F766E'
  warning: '#B45309'
  warning-surface: '#FFF7ED'
  destructive: '#B91C1C'
  destructive-surface: '#FEF2F2'
  success: '#047857'
typography:
  display:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 30px
    fontWeight: '650'
    lineHeight: '1.2'
    letterSpacing: '-0.015em'
  heading:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 20px
    fontWeight: '650'
    lineHeight: '1.3'
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.55'
  label:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.4'
  data:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '550'
    lineHeight: '1.4'
    letterSpacing: '0'
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  '10': 40px
focus:
  width: 2px
  style: solid
  offset: 2px
components:
  app-navigation:
    background: '{colors.surface}'
    border: '{colors.border}'
    active: '{colors.primary}'
    radius: '{rounded.md}'
  step-indicator:
    active: '{colors.primary}'
    complete: '{colors.success}'
    pending: '{colors.muted-foreground}'
  balance-chart:
    background: '{colors.surface}'
    border: '{colors.border}'
    threshold: '{colors.warning}'
    selection: '{colors.primary}'
    radius: '{rounded.lg}'
  contributor-row:
    background: '{colors.surface}'
    selected-background: '{colors.surface-muted}'
    selected-border: '{colors.primary}'
    radius: '{rounded.md}'
  evidence-inspector:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  provenance-label:
    imported: '{colors.evidence-fact}'
    user-provided: '{colors.evidence-user}'
    calculated: '{colors.evidence-derived}'
    radius: '{rounded.full}'
  limitation-callout:
    background: '{colors.warning-surface}'
    foreground: '{colors.warning}'
    radius: '{rounded.md}'
  replay-controls:
    background: '{colors.surface}'
    active: '{colors.primary}'
    radius: '{rounded.md}'
  data-table:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.md}'
  account-readiness-panel:
    background: '{colors.surface}'
    border: '{colors.border}'
    warning-background: '{colors.warning-surface}'
    radius: '{rounded.lg}'
  csv-mapper:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  import-result:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.md}'
  period-controls:
    background: '{colors.surface}'
    border: '{colors.border}'
    active: '{colors.primary}'
    radius: '{rounded.md}'
  transaction-detail:
    background: '{colors.surface}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
  destructive-confirmation:
    background: '{colors.surface}'
    destructive: '{colors.destructive}'
    radius: '{rounded.lg}'
  responsive-region-tabs:
    active: '{colors.primary}'
    border: '{colors.border}'
sources:
  - ../../briefs/brief-my-capstone-2026-06-15/brief.md
  - ../../briefs/brief-my-capstone-2026-06-15/addendum.md
  - ../../prds/prd-my-capstone-2026-06-15/prd.md
  - ../../prds/prd-my-capstone-2026-06-15/addendum.md
---

## Brand & Style

Shortfall Investigator is a quiet analytical tool. It should feel trustworthy, inspectable, and composed under uncertainty, without borrowing the visual language of a bank portal or dramatizing investigation as detective work. The interface prioritizes evidence and sequence over decoration.

The system inherits shadcn/ui component structure and accessibility behavior. This contract defines the restrained brand layer: neutral light surfaces, a blue action and selection color, explicit evidence provenance, amber uncertainty, and red reserved for destructive actions and genuine failures.

Inherited unchanged from shadcn/ui: `Button`, `Input`, `Select`, `Checkbox`, `Dialog`, `Drawer`, `DropdownMenu`, `Tabs`, `Tooltip`, `Skeleton`, `Toast`, `Accordion`, `Separator`, and `Table`. Local component contracts below define product-specific composition or behavioral deltas.

## Colors

- **Primary blue** `{colors.primary}` identifies selection, navigation, focus within charts, and the main next action. It does not imply positive financial performance.
- **Neutral surfaces** `{colors.background}`, `{colors.surface}`, and `{colors.surface-muted}` separate workspace regions through tone and borders rather than heavy elevation.
- **Evidence colors** distinguish imported facts, user-provided information, and calculated or derived findings. Labels always include text; color is never the sole carrier of provenance.
- **Warning amber** `{colors.warning}` marks incomplete evidence, reconciliation differences, and limitations. It is not used for routine decoration.
- **Destructive red** `{colors.destructive}` is limited to deletion, irreversible clearing, and genuine errors. Negative monetary values do not automatically use red.
- Text combinations must meet at least 4.5:1 contrast for normal text and 3:1 for large text. Component boundaries, selection indicators, chart marks, and focus indicators must meet at least 3:1 against adjacent colors.
- Required pairs include `{colors.primary-foreground}` on `{colors.primary}`, `{colors.warning}` on `{colors.warning-surface}`, `{colors.destructive}` on `{colors.destructive-surface}`, and `{colors.focus-ring}` against both `{colors.background}` and `{colors.surface}`. Verify these pairs in implementation rather than assuming token assignment proves compliance.

## Typography

Inter is the preferred family, falling back to the system sans-serif stack. The hierarchy remains compact and functional; display type is reserved for page titles and consequential empty states.

Monetary values, dates, rankings, and calculations use `{typography.data}` with tabular numerals enabled in implementation. Body copy uses sentence case. Avoid all-caps labels, oversized financial totals, and typography that implies celebration or alarm.

## Layout & Spacing

The spacing scale is based on 4px increments. Desktop uses a persistent navigation rail and a three-region Investigation workspace: chart and period controls above, Contributors in the main-left region, and Evidence Inspector at right.

Major workspace regions use `{spacing.6}` or `{spacing.8}` separation. Closely related labels and values use `{spacing.1}` or `{spacing.2}`. Dense evidence lists may use `{spacing.3}` between rows but must preserve a clear reading order.

Composition references:

- [`mockups/investigation-workspace.html`](mockups/investigation-workspace.html) illustrates the desktop three-region workspace.
- [`mockups/csv-readiness.html`](mockups/csv-readiness.html) illustrates CSV mapping and Account readiness.
- [`mockups/transaction-replay.html`](mockups/transaction-replay.html) illustrates Replay and reduced-motion presentation.

The spines win on conflict with any mockup or import.

## Elevation & Depth

Hierarchy comes from layout, tonal layering, and borders. Default panels have no shadow. Floating menus and dialogs inherit restrained shadcn/ui elevation. Do not use glow, glass effects, or dramatic shadows.

## Shapes

Corners are crisp and lightly rounded: `{rounded.sm}` for compact controls, `{rounded.md}` for rows and inputs, and `{rounded.lg}` for major workspace panels. Pill shapes are reserved for short provenance and status labels.

## Components

- **App Navigation** uses `{components.app-navigation}`. Active items combine blue text or icon treatment with a visible shape or left marker.
- **Step Indicator** uses `{components.step-indicator}` and always pairs state color with text and position.
- **Balance Chart** uses `{components.balance-chart}`. Threshold, selected period, crossing, and current evidence selection use distinct line styles or markers as well as color.
- **Contributor Row** uses `{components.contributor-row}`. Rank and monetary impact are visually prominent; comparison, timing, and explanation remain readable without expanding the row.
- **Evidence Inspector** uses `{components.evidence-inspector}`. Provenance, source Transactions, calculation, limitations, and Related evidence form distinct sections.
- **Provenance Label** uses `{components.provenance-label}` with explicit text: `Imported fact`, `User-provided`, `Calculated`, or `Derived finding`.
- **Limitation Callout** uses `{components.limitation-callout}`. It remains visible in context and is never reduced to an icon or tooltip.
- **Replay Controls** use `{components.replay-controls}` with visible play state, current event position, speed, and keyboard focus.
- **Data Table** uses `{components.data-table}`. Numeric columns align by decimal position where practical; sticky headers may be used for long Transaction lists.
- **Account Readiness Panel** uses `{components.account-readiness-panel}` to group source coverage, balance evidence, and reconciliation status.
- **CSV Mapper** uses `{components.csv-mapper}` for source preview and required/optional column mapping. Mapping errors remain adjacent to the affected control and example value.
- **Import Result** uses `{components.import-result}` to separate accepted, duplicate, and rejected counts and rows.
- **Period Controls** use `{components.period-controls}` for Safety Threshold, Shortfall, Investigation Period, and Comparable Period selection.
- **Transaction Detail** uses `{components.transaction-detail}` for imported values, user corrections, provenance, exclusion, Transfer, Refund, Obligation, and Context actions.
- **Destructive Confirmation** uses `{components.destructive-confirmation}` and names the affected Account or local records. The destructive action is visually distinct from cancel.
- **Responsive Region Tabs** use `{components.responsive-region-tabs}` below 1024px to switch between Contributors and Evidence while preserving shared selection.

All custom focus indicators use `{focus.width}` `{focus.style}` `{colors.focus-ring}` with `{focus.offset}`. Focus styling applies to custom rows, chart points, disclosures, tabs, links, and Replay controls; containers must not clip it.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Use calm neutral surfaces and explicit labels | Mimic a retail banking dashboard |
| Let blue indicate action and selection | Use green and red to judge spending behavior |
| Keep limitations visible near findings | Hide uncertainty in tooltips |
| Use tabular numerals for comparisons | Emphasize totals as promotional hero metrics |
| Show graph relationships only when explanatory | Render dense decorative networks |
| Use borders and spacing for hierarchy | Use gradients, glass effects, or dramatic shadows |
