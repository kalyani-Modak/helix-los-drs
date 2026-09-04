---
name: mono-repo-drs-common-components
description: >-
  Builds React UI in monoRepoDebtSuite using shared DRS primitives (HButton, HLabel,
  FunctionLayout, common AgGrid, Redux account slice, shell routes). Use when adding
  or editing early-collection screens, common/components, debt-recovery-shell routes,
  or when the user mentions DRS, homelayout, FunctionLayout, or H* form controls.
---

# monoRepoDebtSuite — DRS common components

## Layout

| Area | Path |
|------|------|
| Shell (Vite, routes) | `apps/debt-recovery-shell/` |
| Early collection | `products/collection/modules/early-collection/` |
| Shared H* UI | `products/common/components/` |
| List grids | `products/common/AgGrid-Framework/` |

**Aliases** (shell `vite.config.js`): `@earlycollection`, `@collections`, `@collection-common`, `@utils`, `@toast`, etc. From code compiled by the shell, prefer **`@collection-common/...`** for shared H* UI and grids (stable path). Relative imports into `products/common` are still valid if depth is kept correct.

## New / updated collection screens

1. Register lazy route in `apps/debt-recovery-shell/src/routes/collections.routes.jsx`; paths render under `/homelayout/*` with persistent account chrome via `EarlyCollectionAccountWorkspaceLayout` (see `App.jsx`).
2. Wrap page body in **`FunctionLayout`** (`early-collection/FunctionLayout.jsx`): required **`title`** (translated string); optional **`breadcrumbMid`**. Do not add **`TitleBar`** for standard account workspace pages.
3. Use **`import { … } from "@collection-common/components"`** (barrel: [products/common/components/index.js](products/common/components/index.js)) for **HButton**, **HButtonBar**, **HLabel**, **HTextField**, **HTextarea** (from **HTextArea**), **HDropdown**, **HCheckBox**, **HRadio** / **HRadioGroup**, **HDatePicker**, **HDateTimePicker**, **HAccordion** / **HAccordian** (same component), **OverviewSectionCard**, **OverviewField**, **SearchCommonBox**, **TitleBar**, **useDrsTheme**, **FilterMaster**, **Constants** (**`ALIGNMENT`**), and **SearchGridDefObj** symbols. Use **`import { HAgGrid, … } from "@collection-common/AgGrid-Framework"`** for grids (**[AgGrid-Framework/index.js](products/common/AgGrid-Framework/index.js)**); do not import **HAgGrid** from `components` (only **AgGrid-Framework/HAgGrid.jsx** exists).
4. Lists: follow **CommonAgGrid** / framework patterns in sibling files before inventing new tables.
5. **i18n**: `react-intl`; locale JSON under `products/collection/translations/` (e.g. early-collections); shell loads them via `@translations` in `vite.config.js`.
6. **API**: module **`apiEndpoints.jsx`** + **HAxiosService** patterns; **Redux** `@collection-common/slice/accountSlice` (or `products/common/slice/accountSlice`) for account context when relevant.
7. **Toast** from shell: `@toast` where resolved, else relative path to `ToastProvider.jsx`.

## Conventions

- MUI 7 / React 19; match file style (hooks, quotes) of neighboring screens.
- Prefer Grid `size` (not legacy `item`/`xs`), `slots`/`slotProps` (not `PaperProps`/`TransitionComponent`), and default parameters (not function-component `defaultProps`).
- Interface Delight–aligned chrome lives in shell `AppDrawLayout`; do not duplicate account header inside `FunctionLayout`.
- After route or alias changes, run **`vite build`** in `apps/debt-recovery-shell`.

## HDialog and HDrawer usage

- Import dialog/drawer primitives from shared library only: `import { HDialog, HDrawer } from "@helix/component-library"`.
- Do not import local dialog wrappers (for example `./HDialog`) for new work. Prefer the shared component unless a file is explicitly tied to a legacy wrapper.
- For dialogs, prefer `HDialog` with `title` and `actions` props instead of hand-building header/footer using MUI `DialogTitle` and `DialogActions`.
- If an existing dialog body already uses custom content wrappers, keep behavior by using `disableContentWrapper` on `HDialog`.
- Keep sizing and surface styling through `fullWidth`, `maxWidth`, and `slotProps.paper.sx`.
- Preserve close behavior by wiring `open` + `onClose` exactly as current flow requires (no backdrop/escape behavior changes unless requested).
- Use `HDrawer` for side panels and navigation drawers; configure placement with `variant`, `anchor`, `open`, and `hideBackdrop` as needed.
- For drawer paper styling, use `slotProps.paper.sx`; avoid direct `.MuiDrawer-paper` overrides unless matching an existing file pattern.

### Minimal patterns

```jsx
import { HDialog, HDrawer } from "@helix/component-library";

<HDialog
  open={open}
  onClose={handleClose}
  title="My Dialog"
  actions={<HButton label="common.close" onClick={handleClose} />}
>
  <DialogContent>...</DialogContent>
</HDialog>

<HDrawer
  variant="persistent"
  anchor="left"
  open={open}
  hideBackdrop
  slotProps={{ paper: { sx: { width: 280 } } }}
>
  ...
</HDrawer>
```

## Related docs in repo

- GitHub Copilot: `.github/copilot-instructions.md`
- Codex: `CODEX.md` (repo root)
