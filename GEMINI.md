# GEMINI.md - Fitness Recomp App

## Foundational Mandates (Global)
This project inherits all global mandates from the root `GEMINI.md`.

### Workflow: ACE (Research -> Plan -> Implement)
**CRITICAL:** ACE always stands for **Research -> Plan -> Implement**.
- **Research (R):** Explore the codebase, identify constraints, and understand dependencies *before* proposing a solution.
- **Plan (P):** Create a step-by-step implementation plan with verification procedures.
- **Implement (I):** Execute the plan incrementally, verifying each step.
- Follow this workflow for all complex or architectural tasks.

### Academic Integrity: ABSOLUTE GUARDRAIL
**NEVER generate substantive academic content without source material.**
- **Scaffolding only:** You may create section headings, status labels, checklists, and planning artifacts.
- **No Fabricated Content:** Do not write background paragraphs, methodology claims, results, or novelty assertions unless directly grounded in provided source material (e.g., `Protocol Manual.docx`, `CONTEXT.md`).
- **Mark Gaps:** Label empty sections as "AWAITING" and specify the required source material.

### Communication Style: Terse & Direct
- **Be Terse:** Every word should earn its place. Prefer lists over paragraphs.
- **No Filler:** Skip pleasantries, hedging, and sign-offs.
- **Jarvis-Style:** Be a competent "junior faculty / project collaborator." Flag uncertainty explicitly.
- **Absolute Paths:** Always use absolute paths for file operations to ensure reliability.

---

## Project-Specific Details

### Tech Stack
- **Framework:** Next.js (App Router)
- **Frontend:** Tailwind CSS, TypeScript
- **Backend:** Supabase
- **Styling:** PostCSS, Tailwind

### Project Structure
- Web application for tracking nutrition, training, and body recomposition progress.
- Inherits goals and architectural decisions from the `fitness-recomp` parent project documents.
