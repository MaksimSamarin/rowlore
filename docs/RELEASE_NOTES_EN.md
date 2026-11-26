# Release notes

## 2.3.0

- **Rowlore.** Analyzer is now called Rowlore, with a new menu mark and tab icon.
- **Side menu.** Analysis and administration share one layout with a menu on the left. The Data & model, Template, and Run analysis steps are checked off as they become ready. The theme switch and the account menu sit at the bottom of the menu.
- **My reports.** The report list is a separate screen at the top of the menu. It shows every report with its progress and downloads, and the menu counts reports in progress.
- **Consistent look.** Both screens use one set of colors, the same status colors, and Manrope with tabular figures. The font ships with the build and is not loaded from the internet.
- **System theme.** Until a user picks a theme, the interface follows the system setting. A previously chosen dark theme is kept.
- **Upgrade.** Data, `.env` settings, and volumes are preserved. See “Upgrade from Analyzer” in the README.

## 2.2.0

- **Language settings.** English is the default. Choose English or Russian in Administration → Settings. The interface, built-in prompts and demo files follow the selection.
- **CSV and XLSX.** Upload either format. The CSV delimiter and input encoding are detected automatically.
- **Groups and quotas.** Organize access in groups and set token quotas. Reports can pause when a quota is reached and keep completed rows.
- **Model catalog.** Administrators can enable models, choose a default, and test provider connections.
- **Local sign-in and OIDC.** Local passwords survive upgrades. External identity can be provided by an OIDC provider.
- **Reports.** Preview the model input, download errors in Excel, reuse an interim export, and delete selected reports together.

## 2.0.0

The first public release added custom response fields, grouped analysis, streamed Excel export, live result previews, and validation feedback on retries.

## 1.0.0

The initial release supported feedback analysis from Excel, report history, and Excel export.
