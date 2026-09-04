# monoRepoDebtSuite — DRS UI components (GitHub Copilot)

Use this guidance when adding or changing React UI in **debt-recovery-shell** or **products/** (especially early-collection).

## Monorepo layout

| Area | Path |
|------|------|
| Shell app (Vite, routes, layout) | `apps/debt-recovery-shell/` |
| Early collection feature modules | `products/collection/modules/early-collection/` |
| Shared collection UI + form controls | `products/common/components/` |
| Collection grids (AgGrid wrapper) | `products/common/AgGrid-Framework/` |
| Redux store (collection) | `products/common/store` |
| Masters, allocation, ruleengine, etc. | `products/collection/modules/*` (sibling packages) |

## Vite path aliases (shell `vite.config.js`)

Use these **only from code compiled by debt-recovery-shell** (lazy routes, shell `src/`):

- `@earlycollection` → `products/collection/modules/early-collection`
- `@collections` → `products/collection/modules`
- `@collection-common` → `products/common`
- `@common-master`, `@allocation`, `@ruleengine`, `@utility`, `@integrationframework`, `@usermanagement`
- `@utils` → `apps/debt-recovery-shell/src/utils`
- `@toast` → shell Toast provider

Inside **early-collection** source files, prefer **`@collection-common/...`** for shared UI (resolved by shell `vite.config.js`).

## Page shell (account workspace)

- New **homelayout** collection screens are registered in `apps/debt-recovery-shell/src/routes/collections.routes.jsx` and rendered under `EarlyCollectionAccountWorkspaceLayout` (persistent account header + function bar).
- Wrap feature body in **`FunctionLayout`** from `early-collection/FunctionLayout.jsx`: pass `title` (resolved string, e.g. `intl.formatMessage(...)`) and optional `breadcrumbMid`. It provides Interface Delight–style breadcrumbs; **do not** reintroduce `TitleBar` for those pages unless there is a deliberate exception.

## Shared custom components (`products/common/components/`)

Prefer these over raw MUI for consistency, i18n, and styling:

| Component | Role |
|-----------|------|
| **HButton** | Primary actions; props: `id` (message id), `label`, `onClick`, `variant`, `color`, `disabled`, `loading`, `hiddenYN`, `readOnly`, `align`, etc. Uses `react-intl`. |
| **HButtonBar** | Save / Reset / Close / Next row; wire `onSave`, `onReset`, `onClose`, etc. |
| **HLabel** | Form labels; `value` is often a message id; `translate`, `required`, `align`, `colon`. |
| **HTextField**, **HTextArea** | Text inputs aligned with app patterns. |
| **HDropdown** | Select-style control with app styling. |
| **HCheckBox**, **HRadio**, **HRadioGroup** | Boolean / single choice. |
| **HDatePicker**, **HDateTimePicker** | Dates (MUI x pickers integration as used in repo). |
| **HAccordian** | Accordion sections (filename keeps this spelling). |
| **HAgGrid** | Thin AgGrid host when list UIs use the shared grid stack. |
| **TitleBar** | Legacy gradient title strip; avoid for new early-collection pages that already use `FunctionLayout`. |
| **OverviewSectionCard**, **OverviewField** | Overview-style dense cards/fields (Interface Delight aligned). |
| **MultiLanguage**, **SearchCommonBox**, **FilterMaster** | Shell/i18n/search patterns as needed. |
| **Constants.jsx** | **`ALIGNMENT`** for grid/text alignment tokens. |

**Grids:** Full-featured worklist-style grids often use **`CommonAgGrid`** / framework files under `products/common/AgGrid-Framework/` (see existing `AccountList.jsx`, masters).

## HDialog and HDrawer standards

- Import from shared library only: `import { HDialog, HDrawer } from "@helix/component-library"`.
- For dialogs, prefer `HDialog` with `title` and `actions` props instead of hand-building header/footer with MUI `DialogTitle` and `DialogActions`.
- If an existing dialog body already uses custom wrappers, preserve behavior with `disableContentWrapper`.
- Keep sizing/styling through `fullWidth`, `maxWidth`, and `slotProps.paper.sx`.
- Do not change close behavior unless requested: preserve `open`, `onClose`, and backdrop/escape handling.
- For side panels/navigation, use `HDrawer` and style via `slotProps.paper.sx`.
- Avoid introducing local dialog wrappers for new work when shared `HDialog` is sufficient.

## Conventions

1. **i18n**: Use `react-intl` (`useIntl`, `formatMessage`) for user-visible strings; add keys under `products/collection/translations/` for early-collections (and other products as applicable); shell imports JSON via `@translations`.
2. **Data**: Prefer existing **`HAxiosService`** / module **`apiEndpoints.jsx`** patterns in early-collection rather than ad-hoc `fetch`.
3. **State**: Account context often uses **`react-redux`** with `products/common/slice/accountSlice` (or `@collection-common/slice/accountSlice`) for `selectedRow` / header data.
4. **Toast**: From early-collection, shell path is typically `../../../../apps/debt-recovery-shell/src/context/ToastProvider.jsx` or use `@toast` where the bundler resolves it.
5. **MUI**: Match existing MUI v5 usage (`@mui/material`, `@mui/icons-material`); follow **Interface Delight** cues in shell `AppDrawLayout` (foreground/muted tokens) when touching global chrome.
6. **Imports**: Keep **relative depth correct** from nested folders (`account-overview/`, etc.). Run the shell **build** after adding routes or aliases.

## Checklist for a new early-collection screen

- [ ] Lazy entry in `collections.routes.jsx` + path under `/homelayout/...`
- [ ] Screen wrapped in **`FunctionLayout`** with `title` (and `breadcrumbMid` if not “Customer”)
- [ ] Forms/lists use **H*** components and/or **CommonAgGrid** as appropriate
- [ ] Strings via **intl**; API via existing module patterns
- [ ] No duplicate account header (layout owns it)
