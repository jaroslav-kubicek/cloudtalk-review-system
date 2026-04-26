# AGENTS.md

Brief for any AI coding agent (Claude Code, Cursor, Codex, …) working in this repo. Human contributors can read it too — it's short.

## Project

CloudTalk fullstack interview assignment: a product review service. Customers write reviews, an admin moderates, only approved reviews count toward a product's aggregate rating. Public Git repo is the deliverable; commit log is graded; agentic coding is welcome per the brief.

**Effort budget: 5 hours.** Not 5 days. Every scoping decision flows from this number — re-read it before adding anything.

The public deliverable's `README.md` (~30–50 lines: what it is, run commands, design decisions, curl admin examples) is a separate file from this one.

## Stack

- **Backend:** NestJS 11 + Fastify adapter + Drizzle ORM + Postgres 16.
- **Frontend:** React 19 + Vite + React Router v7 (data mode, no TanStack Query).
- **Contract:** OpenAPI 3.1 via `@nestjs/swagger` (code-first) → typed client in `packages/api-client`.
- **Monorepo:** pnpm 10 workspaces. No Turbo, no Nx.

## Layout

- `apps/api` — NestJS API
- `apps/web` — React SPA
- `packages/api-client` — OpenAPI-generated typed fetch client (consumed by `apps/web`)

Three packages, no more. No `packages/shared`, `packages/types`, `packages/eslint-config`, `packages/utils`.

## Commit discipline

- **Conventional commits:** `feat(scope): …`, `chore: …`, `fix(scope): …`, `docs: …`, `test(scope): …`.
- One coherent step per commit. Messages focus on the *why*, not the *what*.
- **Never** `wip`, `fix stuff`, `final`, or a bare `update`. The reviewer grades the `git log`.
- Target shape: ~15–20 commits across ~5–7 short-lived feature branches. Avoid both commit-per-line ceremony and the single-mega-PR-at-the-end shape.

## Branch discipline

**Never commit directly to `main`.** Branch first (`feature/<scope>` or `chore/<scope>`), commit on the branch, open a PR, merge, delete the branch, start the next. Push and merge as the slice goes green — don't accumulate unmerged branches.

## No history rewrites

Never `git commit --amend`. Never `git rebase -i`. Never `git push --force` / `--force-with-lease`. If a check fails mid-branch: make the fix → new `fix(scope): …` commit → recheck → push. `fix:` commits are honest signal, not mess to hide.

## Verification — once per branch

Run the full check suite **EXACTLY ONCE per branch**, right before opening that branch's PR:

```
pnpm lint && pnpm -r typecheck && pnpm test
```

**Not** after every edit. **Not** after every commit. **Not** "to be safe." With 5–7 branches that's 5–7 check passes total across the whole build. The only allowed mid-branch check is a targeted `tsc --noEmit` on a single file when an unfamiliar typing pattern is in play.

Today's reality: only `pnpm typecheck` fans out. `pnpm lint` works at root. Per-workspace `test` scripts are added when the test arrives — currently Jest in `apps/api` is added at the `feature/reviews-and-aggregates` branch. `apps/web` ships without tests in v1.

After any backend contract change (DTOs, endpoints, status codes), run `pnpm openapi` (wired up at the `feature/api-client` branch) to regenerate `packages/api-client/src/types.ts`.

**Browser smoke test the relevant flow before opening any web-touching PR.** Don't ship UI you haven't loaded in a browser.

## Aggregates invariant — load-bearing

`AggregatesService.recompute(tx, productId)` runs inside the **same transaction** as any review write that changes the approved set:

- `POST /admin/reviews/:id/approve` → always recompute.
- `POST /admin/reviews/:id/reject` → recompute **only if the previous status was `approved`**. Reject of a pending review is a no-op for the aggregate.
- `POST /reviews` → does **not** recompute. New reviews are created with `status='pending'` and don't enter the approved set.

The `tx` parameter threads explicitly from `ModerationService` into `AggregatesService.recompute`. Keep the signature explicit; do **not** "clean it up" with AsyncLocalStorage or Postgres triggers. The visible `recompute(tx, productId)` contract is the engineering signal of the whole service.

## Gotchas an agent can't guess from the code

- `OPENAPI_EXPORT=1` boots the API in one-shot spec-dump mode (added at the `feature/api-client` branch). Don't set it for normal dev.
- `pnpm --filter @reviews/<name> <script>` is the shape for workspace-scoped scripts under pnpm 10.
- NestJS `ValidationPipe` must be configured with `transform: true` + `whitelist: true` + `forbidNonWhitelisted: true` *together*. Dropping `transform` silently breaks `@Type(() => Number)` on query DTOs.
- Swagger CLI plugin is enabled in `nest-cli.json`. DTOs do **not** need manual `@ApiProperty()` on every field — the plugin infers from TS types, class-validator decorators, and JSDoc.
- **One layer of validation.** DTO decorators only. No Postgres `CHECK` constraints duplicating decorators. No Zod config validation — NestJS fails fast at boot if env vars are missing.

## What NOT to build

- No `role` column on `users`. No `RolesGuard`, no `@Roles('admin')` decorator, no admin user in the seed. Admin is a hardcoded `ADMIN_TOKEN` env var checked by a 5-line `AdminTokenGuard` on the moderation controller.
- No `moderation_note` column. Reject endpoint takes no body.
- No `helpful_votes` / `review_votes` table. No `verified_review_count` / `verified_avg_rating` / `recommend_pct` on stats. If the UI doesn't render it, the schema doesn't have it.
- No `@MinLength(10)` or any arbitrary length floor on free text. Every validation decorator must answer "what real bad input does this prevent and why this number?"
- No filter / sort / pagination DTOs or UI. Reviews list is `ORDER BY created_at DESC`, no controls. The only special-case query is `?author=me` for the already-reviewed UX.
- No `picsum.photos` images on a tech catalog. Use category-keyed Iconify URLs (`https://api.iconify.design/mdi/cpu-64-bit.svg`, `mdi/laptop`, …) or per-category static SVGs in `apps/web/public/products/`.
