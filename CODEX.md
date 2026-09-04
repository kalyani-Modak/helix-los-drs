# monoRepoDebtSuite — Codex instructions (DRS + shared components)

Apply when generating or editing code under **`monoRepoDebtSuite`**, especially **`apps/debt-recovery-shell`** and **`products/collection/modules/early-collection`**.

## Repository shape

- **`apps/debt-recovery-shell`**: Vite React host, routing (`src/App.jsx`, `src/routes/collections.routes.jsx`), `AppDrawLayout`, path aliases in `vite.config.js`.
- **`products/collection/modules/early-collection`**: Feature screens (lazy-loaded by alias `@earlycollection`).
- **`products/common/components`**: Reusable **H*** form/action primitives and shared UI (**HButton**, **HLabel**, **HTextField**, **HDropdown**, **HDatePicker**, **HButtonBar**, **HAccordian**, **HAgGrid**, **OverviewSectionCard**, **OverviewField**, etc.).
- **`products/common/AgGrid-Framework`**: **CommonAgGrid** / list grid patterns.

## Import rules

1. From **`early-collection/**/*.jsx`**, import shared controls with **`@collection-common/...`** (preferred) or correct **relative** paths into **`products/common`**.
2. From code built with the shell bundler, you may use aliases such as **`@earlycollection`**, **`@collections`**, **`@collection-common`**, **`@utils`**, **`@toast`** (see `apps/debt-recovery-shell/vite.config.js`).
3. Do not assume Node-only APIs in browser modules.

## UI composition rules

1. **New collection pages** under `/homelayout/*` (except `listView` where applicable): the shell keeps **AccountHeader** + **FunctionGroupsBar** mounted. Implement the page body inside **`FunctionLayout`** (`early-collection/FunctionLayout.jsx`) with a required **`title`** string (already translated by the caller). Optional **`breadcrumbMid`** overrides the middle breadcrumb segment. Do not add a second **`TitleBar`** for standard account workspace pages.
2. Prefer **H*** components over bespoke MUI for labels, inputs, buttons, and button bars so **intl** and CSS stay consistent.
3. Use **`react-intl`** for visible copy; place keys under **`products/collection/translations/`** (e.g. early-collections `en.json`), loaded in shell `App.jsx` via **`@translations`**.
4. For lists, follow existing **CommonAgGrid** / `ListGridFramework` usage in the same module before inventing a new table.
5. **`Constants.jsx`** exposes **`ALIGNMENT`** for grid/text alignment—reuse instead of magic strings.

## API and state

- Follow per-module **`apiEndpoints.jsx`** + **`HAxiosService`** patterns found in early-collection screens.
- Account selection / header data: **`@collection-common/slice/accountSlice`** and Redux **`Provider`** in shell `App.jsx`.

## Quality bar

- Match surrounding file style (quotes, hooks order, MUI 7 / React 19).
- Avoid widening scope: touch only files needed for the feature.
- After route or alias changes, verify **`npm`** / **`vite build`** for **`apps/debt-recovery-shell`**.

## Quick reference — `common/components`

| File | Use for |
|------|---------|
| HButton.jsx | Actions |
| HButtonBar.jsx | Footer save/reset/close |
| HLabel.jsx | Field labels (message ids) |
| HTextField.jsx, HTextArea.jsx | Text |
| HDropdown.jsx | Selects |
| HCheckBox.jsx, HRadio.jsx, HRadioGroup.jsx | Choice |
| HDatePicker.jsx, HDateTimePicker.jsx | Dates |
| HAccordian.jsx | Sections |
| HAgGrid.jsx | Grid host |
| OverviewSectionCard.jsx, OverviewField.jsx | Overview blocks |
| TitleBar.jsx | Legacy; avoid duplicating FunctionLayout chrome |
