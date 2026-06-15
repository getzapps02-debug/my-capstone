---
title: "Shortfall Investigator"
status: final
created: 2026-06-15
updated: 2026-06-15
source:
  - "_bmad-output/brainstorming/brainstorming-session-2026-06-15-122910.md"
---

# Product Brief: Shortfall Investigator

## Executive Summary

Shortfall Investigator is a local-first web application that helps individuals reconstruct what changed before a past cash shortfall and identify the observable transactions, obligations, and spending patterns that contributed to it. Instead of presenting another budgeting dashboard, it guides the user through a financial investigation: select a low-balance period, replay the events leading to it, and inspect the evidence behind each finding.

Financial records remain on the user's computer. Every finding links to inspectable evidence, and the product distinguishes facts and computed relationships from hypotheses. It does not claim that correlation proves causation or provide financial advice. The first release is both a useful personal tool and a portfolio case study in explainable, privacy-conscious software.

## The Problem

A person may know that their money fell short but still be unable to reconstruct how it happened. Rent, groceries, transport, social spending, small purchases, and unexpected costs can each appear manageable alone. Their timing and combined effect may unexpectedly eliminate the available buffer.

Traditional transaction lists and category summaries show what was spent, but they leave the user to connect the evidence. They rarely explain how a sequence of obligations and purchases developed into a shortfall. This can leave the user feeling confused and out of control, especially when essential expenses cannot realistically be reduced.

The product must avoid replacing confusion with false certainty. Available data can support statements about sequence, contribution, and association, but it may not prove why a person made a purchase or establish strict causality.

## Who This Serves

The initial user is a financially responsible adult with irregular expenses who can see that money ran short but cannot easily reconstruct which changes produced the gap. The first implementation is designed for Denzo's personal use and for technically comfortable portfolio evaluators.

Success for the user means moving from "I do not know what happened" to a clear, evidence-backed understanding of the largest supported contributors, while retaining control over classifications and interpretations.

## The Solution

Shortfall Investigator leads with a Guided Investigation rather than a general dashboard:

1. The user loads synthetic sample data, enters transactions manually, or imports a bank statement CSV.
2. The user selects a historical balance low point or shortfall period.
3. The application shows what changed through synchronized balance and category line charts.
4. It ranks observable contributors and connects each finding to inspectable transactions, obligations, merchants, or contextual tags.
5. Transaction Replay walks through the period chronologically while the balance, evidence summary, and relevant graph relationships update together.

Each investigation uses three explanation layers:

- **What changed?** The size and timing of the balance decline.
- **What contributed?** Ranked, evidence-supported transaction groups and obligations.
- **Why is this shown?** Expandable records and relationships supporting the finding.

The graph visualization is supporting evidence, not the product's main attraction. It appears when relationships clarify a finding; the user is never required to interpret a dense network unaided.

This approach differs from ordinary trackers through traceable explanations, calibrated language, synchronized storytelling, and local-first privacy. The application runs locally in a browser, with Neo4j and supporting services packaged using Docker Compose. Neo4j earns its place only where connected evidence improves traceability. The implementation should demonstrate useful paths connecting a shortfall period to a balance decline, category changes, transactions, a merchant, and an obligation. Relationships that do not improve an investigation should not be exposed merely to showcase graph technology.

## MVP Scope

### Included

- Local single-user browser interface running on localhost
- Neo4j and application services launched through Docker Compose
- Synthetic sample dataset
- Manual transaction entry
- CSV preview, mapping, validation, and import
- Duplicate transaction prevention
- Historical balance and category line charts
- Guided selection of a past shortfall period
- Evidence-backed contributor summaries
- Inspectable transaction and relationship evidence
- Synchronized Transaction Replay
- Clear local-data and limitation messaging

### Explicitly Deferred

- Direct bank integrations
- Cloud hosting and multi-user accounts
- Future shortfall prediction
- Safe-spending forecasts
- Automated rescue-plan recommendations
- Adaptive coaching
- Claims of proven causality
- Financial advice

## Vision

If the evidence model proves reliable, Shortfall Investigator can expand from historical reconstruction into forward-looking support. Later releases could forecast shortfall risk, protect essential obligations, compare possible recovery actions, and learn which interventions work for the user.

That future depends on first earning trust. The product must establish that its imported data is accurate, its evidence is inspectable, its explanations are appropriately limited, and its graph relationships improve understanding rather than decorate the interface.

## Success Criteria

The MVP is successful when:

**Data integrity**

- Re-importing the same statement creates zero duplicate transactions.
- At least 95% of valid rows in representative CSV fixtures import correctly; rejected rows are clearly identified.
- Imported totals, historical balances, and category totals reconcile with known fixture data.

**Evidence integrity**

- Every reported contributor links to supporting transactions, obligations, or contextual evidence.
- Reviewed benchmark investigations contain zero unsupported causal statements.
- Chart selection, evidence details, graph highlights, and Transaction Replay remain synchronized.

**Usability**

- A first-time evaluator can move from sample data to a supported explanation within five minutes.
- In formative testing with five representative users, at least four can identify the largest evidence-supported contributor without moderator guidance, cite its supporting evidence, distinguish source facts from system inference, and recognize uncertainty or missing evidence.
- Any severe misleading interpretation, unsupported conclusion, or confusion between fact and inference requires revision and retesting regardless of the aggregate usability score.

**Privacy and operability**

- The core workflow operates without transmitting financial data outside the local environment.
- A clean setup can be started with one primary command after documented prerequisites.

### Portfolio Delivery

The project should be presented as a local-first financial explainability case study, not as a polished banking product or AI financial adviser. The public demonstration will use synthetic data and two or three curated shortfall scenarios.

The portfolio narrative should show:

- The user problem and why ordinary transaction lists are insufficient
- The graph model and why connected evidence improves traceability
- Accurate, idempotent CSV ingestion
- One complete import-to-investigation journey
- Transaction Replay and synchronized visual evidence
- Safeguards against causal overclaiming
- Privacy boundaries and known limitations

The project will be presented publicly through a well-structured repository and a recorded walkthrough of five minutes or less, rather than through a hosted instance. The repository will include:

- `README.md` with the problem, audience, value, screenshots, quick start, and walkthrough link
- `docs/architecture.md` with system-context and data-flow diagrams
- `docs/investigation-workflow.md` with an annotated shortfall investigation
- `docs/evidence-model.md` defining facts, calculations, inference, confidence, and unsupported claims
- `docs/usability-report.md` with the protocol, observations, failures, and resulting revisions
- `docs/privacy-and-limitations.md` with data-handling boundaries, constraints, and non-goals
- A clearly labeled synthetic dataset and expected investigation outcome under `samples/`

The walkthrough will demonstrate one complete investigation, the supporting evidence trail, privacy boundaries, and limitations. Public hosting may be reconsidered only if an employer or evaluator requires hands-on access.
