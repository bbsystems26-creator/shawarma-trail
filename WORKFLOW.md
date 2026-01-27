# 🏭 AI Coding Agent Workflow — BB Systems Standard

**Version:** 1.0
**Author:** דוד 🔧 + בנימין
**Date:** 2026-01-27
**Applies to:** All projects using AI coding agents (Claude Code, Codex, etc.)

---

## Overview

This document defines BB Systems' standard workflow for using AI coding agents to build software. The methodology is inspired by how top engineering organizations break down work — but optimized for AI agent execution.

**Core principle:** Small, focused tasks with clear boundaries → parallel execution → fast delivery.

---

## 1. The Pipeline

```
 ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
 │   1. PLAN    │────▶│  2. BREAK    │────▶│ 3. PLAN TASK │────▶│  4. EXECUTE  │────▶│  5. VERIFY   │
 │  Write PRD   │     │  Task Graph  │     │Agent Plans → │     │  Agent Runs  │     │  QA + Ship   │
 │              │     │              │     │David Approves│     │              │     │              │
 └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

### Phase 1 — PLAN: Write the PRD
- Define the product clearly (what, why, for whom)
- List all features grouped by priority (P0/P1/P2)
- Define tech stack and architecture
- Include visual references / inspiration sites
- **Output:** `PRD.md`

### Phase 2 — BREAK: Create Task Graph
- Break PRD into **task groups** (A, B1, B2, B3...)
- Each task group = one agent session
- Map dependencies between tasks
- Identify parallelizable work
- Estimate time per task
- **Output:** `TASKS.md`

### Phase 3 — PLAN PER TASK: Agent Plans Before Executing
- Before each task, launch Claude Code in **plan mode**
- Agent reads the task, explores the codebase, and outputs:
  - Which files it will create/modify
  - What changes it will make in each file
  - Execution order
  - Potential risks or conflicts
- **David reviews the plan** and either approves or adjusts
- Only after approval does the agent execute
- This prevents wasted work and catches issues early
- **Output:** Approved execution plan per task

### Phase 4 — EXECUTE: Run Agent Sessions
- One session per task group
- Parallel where dependencies allow
- Each session gets a focused prompt with:
  - Context (which files to read)
  - Exact sub-tasks
  - Rules (style, language, conventions)
  - Verification step (build/test)
  - Commit instruction
  - Wake notification on completion
- **Output:** Working code, committed per task

### Phase 5 — VERIFY: QA & Ship
- Full build verification
- Manual testing of all routes/features
- Performance check
- Deploy to staging → production
- **Output:** Live product

---

## 2. Task Breakdown Rules

### What makes a good task group?
| ✅ Good | ❌ Bad |
|---------|--------|
| 3-8 sub-tasks | 15+ sub-tasks |
| Touches 2-5 files | Touches 20+ files |
| ~5-15 min agent time | 30+ min agent time |
| Clear input/output | Vague "improve everything" |
| Can verify with build/test | No way to verify |
| One commit message describes it | Needs paragraph to explain |

### Dependency mapping
```
Independent tasks → run in parallel
Dependent tasks → run sequentially
Mixed → identify critical path, parallelize the rest
```

### Naming convention
- **TASK A** — Foundation / backend (usually runs first)
- **TASK B1, B2, B3...** — Feature groups (often parallelizable)
- **TASK C** — Integration / deploy (runs last)

---

## 3. Session Prompt Templates

### 3a. Planning Prompt (runs FIRST for every task)

```markdown
Read CLAUDE.md, TASKS.md, and relevant source files.
Your task: [TASK_ID] — [Task Name]

DO NOT EXECUTE YET. Create an execution plan only.

## Context
- Project: [project name]
- Read these files: [file list]

## Task Requirements
[Paste the task sub-tasks from TASKS.md]

## Output Required
Create a plan that includes:
1. Files to create (with path)
2. Files to modify (with what changes)
3. Execution order (which file first, which last)
4. Dependencies or risks
5. Estimated complexity (low/medium/high)

Output the plan as markdown. Do NOT write any code yet.
```

**David reviews the plan → approves or adjusts → then runs execution prompt.**

### 3b. Execution Prompt (runs AFTER plan approval)

```markdown
Read CLAUDE.md and relevant source files.
Your task: [TASK_ID] — [Task Name]

## Approved Plan
[Paste the approved plan from step 3a]

## Sub-tasks
1. [Sub-task with specific file + action]
2. [Sub-task with specific file + action]
3. [Sub-task with specific file + action]
...

## Rules
- [Language/style conventions]
- [Framework-specific rules]
- [Testing requirements]

## Verification
- Run `npm run build` — must pass with zero errors
- Run `npm run lint` — fix any warnings

## Commit
- `git add -A && git commit -m "[emoji] [descriptive message]"`

## Notify
When finished: `clawdbot gateway wake --text 'Done: [TASK_ID] complete' --mode now`
```

---

## 4. Parallel Execution Model

### Single operator (Clawdbot)
```
David (orchestrator)
  │
  ├── TASK A: Plan → David Reviews → Approve → Execute → ✅ wake David
  ├── TASK B1: Plan → David Reviews → Approve → Execute → ✅ wake David
  │   (A and B1 can plan+execute in parallel if no file overlap)
  │
  │   [After A completes:]
  ├── TASK B2: Plan → Approve → Execute ─┐
  ├── TASK B3: Plan → Approve → Execute ─┤ parallel
  ├── TASK B4: Plan → Approve → Execute ─┘
  │   └── All done → wake David
  │
  └── TASK C: Plan → Approve → Execute (after all B tasks)
      └── ✅ Done → wake David → notify Binyamin
```

### Key principles
1. **Max 3 parallel sessions** — prevents git conflicts
2. **Each session = isolated files** — no two sessions edit the same file
3. **Build verification per session** — catch errors early
4. **Commit per task** — clean git history
5. **Wake notification** — David tracks progress automatically

---

## 5. CLAUDE.md — Project Config File

Every project has a `CLAUDE.md` at root with agent instructions:

```markdown
# CLAUDE.md — Agent Instructions

## Project
[Name] — [One-line description]

## Tech Stack
- Frontend: [framework]
- Backend: [framework]
- Database: [database]
- Styling: [CSS framework]

## Conventions
- Language: [Hebrew UI / English code]
- Direction: RTL
- Theme: [dark/light]
- Component style: [functional, hooks]

## File Structure
[Brief tree of key directories]

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — linting

## Do NOT
- Change package.json dependencies without asking
- Delete existing files without confirmation
- Skip the build verification step
```

---

## 6. Quality Gates

### Per-session gates (must pass before commit)
- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero errors (warnings OK)
- [ ] New files follow project conventions
- [ ] No hardcoded strings (use constants.ts)
- [ ] Mobile-responsive (if UI task)

### Per-project gates (before deploy)
- [ ] All tasks committed and pushed
- [ ] Full build passes
- [ ] All routes accessible
- [ ] Lighthouse: Performance >90, SEO 100
- [ ] Works on mobile (iOS Safari + Android Chrome)
- [ ] Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1

---

## 7. Error Recovery

### Agent session fails mid-task
1. Check git status — what was committed?
2. If partial work: `git stash` or `git reset --soft HEAD~1`
3. Re-run the task with adjusted prompt
4. Add context: "Previous attempt failed at [step]. Continue from there."

### Build fails after task
1. Read error message carefully
2. Create focused fix session: "Fix build error: [error]"
3. Don't re-run the entire task — just fix the specific issue

### Dependency conflict between parallel tasks
1. Stop both sessions
2. Merge manually: `git merge --no-ff`
3. Resolve conflicts
4. Re-run build verification

---

## 8. Git Workflow

### Branch strategy (for MVP)
- `main` — production-ready code
- Direct commits to main (speed over ceremony for MVP)

### Branch strategy (for team/scale)
- `main` — production
- `develop` — integration
- `task/[id]-[name]` — per-task branches
- PR + review before merge

### Commit conventions
```
✨ New feature
🐛 Bug fix
♻️ Refactor
🎨 Style/UI
🗃️ Database/schema
🧭 Navigation
🗺️ Maps
📄 Documentation
🚀 Deploy
🔧 Config
```

---

## 9. Metrics & Tracking

### Per project
| Metric | Target |
|--------|--------|
| PRD → First deploy | <1 week |
| Tasks per project | 4-8 |
| Agent time per task | 5-15 min |
| Build failures | <20% of sessions |
| Parallel utilization | >50% |

### Track in Notion
- Project → Tasks → Status (Not Started / In Progress / Done)
- Time tracking per task
- Issues encountered & solutions

---

## 10. Example: ShawarmaTrail Week 2

```
Project: ShawarmaTrail (שווארמה טרייל)
PRD: projects/shawarma-trail/PRD.md
Tasks: projects/shawarma-trail/TASKS.md

Execution:
  T+0:   TASK A (schema+seed)  ‖  TASK B1 (navbar+footer)
  T+10:  TASK B2 (listing)  ‖  TASK B3 (homepage)  ‖  TASK B4 (explore)
  T+22:  TASK C (deploy+polish)
  T+30:  ✅ Done — production live

Total: ~30-40 min agent time
Sessions: 6
Max parallel: 3
```

---

*This workflow is a living document. Update it as we learn what works.*
*Generated by דוד 🔧 | BB Systems Engineering*
