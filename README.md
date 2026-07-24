# BGrowth Studio

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Publishing to the BGrowth Portal

The Checklist Builder's "Publish to Portal" button (`src/modules/checklist-builder/TemplateBuilderScreen.tsx`)
sends the current template to the **BGrowth Publishing Engine**, which lives
in `bgrowth-portal` (`api/publishing-engine/publish.ts`) and is the only
thing that writes to the Portal's Supabase `products` table.

- `src/lib/publishingEngine.ts` — the client (`publishToPortal`), called
  from the builder UI.
- `api/publish.js` — a server-side proxy, mirroring the existing GAS proxy
  pattern (`api/gas-proxy-post.js`): the shared `PORTAL_PUBLISHING_ENGINE_SECRET`
  is attached here, never in browser code. Configure
  `PORTAL_PUBLISHING_ENGINE_URL` / `PORTAL_PUBLISHING_ENGINE_SECRET` in this
  project's environment (see `.env.example`) to match whatever's configured
  on the Portal side.
- A template must be **saved at least once** before it can be published —
  `draft.templateId` becomes the stable id the Portal republishes against,
  and an unsaved draft's id isn't stable across sessions.
- Only the Checklist Generator Engine's products publish today (the Portal's
  Publishing Engine validates content against a schema per `content_type`,
  and only `workspace` has one yet). Planner/Calculator/other engines will
  need their own schema on the Portal side before they can publish too — see
  `bgrowth-portal/src/schemas/workspaceContent.schema.ts` for the pattern to
  follow.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
