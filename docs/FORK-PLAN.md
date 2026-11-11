# ParsCode Fork & Rebrand Plan

## Current State Analysis

### Repository Structure
- **Root package**: `@parscode/parscode-root` (already renamed from @deepseek-ai)
- **Package naming**: Still uses `@deepseek-ai/dsh-*` convention for all packages
- **CLI command**: `dsh` (primary) with `parscode` alias added in package.json scripts
- **Home directory**: Still references `DSH_HOME` and `~/.dsh` in code
- **Brand strings**: "DeepSeek Harness" throughout docs, README, code
- **Package workspace**: Uses `packages/parscode/*` pattern in pnpm-workspace.yaml (already set up for new packages)

### Key Files & Locations for Rebrand

#### Brand Strings (to replace)
| Location | Current | Target |
|----------|---------|--------|
| README.md | "DeepSeek Harness", "dsh" | "ParsCode", "parscode" |
| package.json | "dsh" bin, @deepseek-ai packages | "parscode" bin, @parscode packages |
| AGENTS.md | "DeepSeek Harness", "dsh" | "ParsCode", "parscode" |
| docs/architecture.md | "DeepSeek Harness", "dsh" | "ParsCode", "parscode" |
| All package.json files | @deepseek-ai/dsh-* | @parscode/* |
| All .md files | DeepSeek references | ParsCode references |
| CLI help | "dsh" | "parscode" |
| Window titles | "DeepSeek Harness" | "ParsCode" |
| Environment vars | DSH_* | PARSCODE_* (with fallback) |
| Home dir | ~/.dsh | ~/.parscode (with migration) |

#### Styles & Tokens (to extend/replace)
| File | Purpose |
|------|---------|
| `packages/client/ui-theme/src/styles/base.css` | Design tokens (CSS variables) |
| `packages/client/ui-theme/src/styles/design-platform.css` | Platform-specific tokens |
| `packages/client/ui-theme/src/styles/*.css` | Component styles |
| `apps/desktop/resources/icon.svg` | Desktop app icon (whale) |
| `apps/desktop/resources/icon-windows.svg` | Windows icon |
| `apps/desktop/resources/icon-macos.svg` | macOS icon |
| `apps/web/public/favicon.svg` | Web favicon |
| `apps/web/public/icon-*.png` | PWA icons |

#### Extension Points (to use)
| Extension Point | Package | Purpose |
|-----------------|---------|---------|
| `ctx.theme.register()` | ui-theme | Third-party theme registration |
| `ctx.tools.register()` | tools | Add model-facing tools |
| `ctx.commands` | commands | Human commands |
| `plugins.tab` | ui-plugin-manager | Marketplace tab |
| `plugins.detail.actions` | ui-plugin-manager | Bundle actions |
| `settings` namespace | dsh-settings | Live config forms |
| Profile bundles | dsh-base, dsh-web-app | Composition layers |

### New Packages to Create
| Package | Purpose | Location |
|---------|---------|----------|
| `parscode-brand` | Centralized brand config, strings, constants | `packages/parscode/brand/` |
| `parscode-theme` | Black+gold design tokens, components, animations | `packages/parscode/theme/` |
| `parscode-marketplace` | Plugin registry API, auto-install, UI | `packages/parscode/marketplace/` |
| `parscode-options` | Comprehensive settings UI, schema validation | `packages/parscode/options/` |

### Upstream Files to Modify (with reasons)
| File | Reason |
|------|--------|
| `package.json` (root) | Rename to @parscode/*, update scripts, bin entry |
| `pnpm-workspace.yaml` | Already uses packages/parscode/*, keep |
| `apps/cli/src/bin.ts` | Add `parscode` as primary command, keep `dsh` alias |
| `apps/cli/src/args.ts` | Update CLI help, command parsing |
| `README.md`, `README.zh.md` | Full rebrand |
| `AGENTS.md` | Update conventions to reference ParsCode |
| `docs/architecture.md` | Update profile/bundle names |
| `BRAND_GUIDELINES.md` | Replace with ParsCode guidelines |
| `packages/boot/app-boot/src/profile.ts` | Update DSH_HOME references, env var names |
| `packages/bundle/base/cordis.patch.yml` | Update env var references (DSH_* → PARSCODE_*) |
| `apps/desktop/package.json` | Rename to @parscode/parscode-desktop |
| `apps/web/package.json` | Rename to @parscode/parscode-web-frontend |
| All package.json files | Rename @deepseek-ai/dsh-* → @parscode/* |

## Implementation Order

### Phase 1: Foundation (Week 1)
1. Create `parscode-brand` package with centralized config
2. Update root package.json, pnpm-workspace.yaml for @parscode/* naming
3. Rename all existing packages from @deepseek-ai/dsh-* → @parscode/*
4. Update CLI entry point for `parscode` command
5. Implement environment variable migration (DSH_* → PARSCODE_*)
6. Implement home directory migration (~/.dsh → ~/.parscode)

### Phase 2: Theme & Visual Identity (Week 2)
1. Create `parscode-theme` package with black+gold design tokens
2. Design original Faravahar SVG logo with gold gradient
3. Generate all icon variants (favicon, app icons, tray, splash)
4. Implement animations (wing sweep, glow pulse, shimmer)
5. Replace all upstream logos in Web UI, Desktop, docs
6. Add theme settings page (glow, animation, density controls)

### Phase 3: Plugin Marketplace (Week 3)
1. Create `parscode-marketplace` package
2. Design Registry API (OpenAPI 3 spec)
3. Implement plugin installer with checksum verification
4. Build marketplace UI (search, categories, cards, detail drawer)
5. Integrate with existing plugin manager (extend, don't replace)
6. Add example plugins + plugin-authoring docs

### Phase 4: Comprehensive Options (Week 4)
1. Create `parscode-options` package
2. Implement settings schema with validation
3. Build settings UI for all categories (Models, Agent, Workspace, UX, System)
4. Add import/export/backup for all settings
5. Implement RTL/Persian support with Vazirmatn font

### Phase 5: Quality & CI (Week 5)
1. Unit tests for installer, settings schema
2. E2E tests for marketplace flow
3. Security audit (path traversal, zip-slip, SSRF)
4. GitHub Actions workflow for Windows x64 build
5. Documentation updates (README, docs, screenshots)

### Phase 6: Push & Release
1. Final build & test verification
2. Push to origin (https://github.com/celtmode/ParsCode.git)
3. Tag v0.1.0 to trigger Windows build workflow
4. Verify release artifacts

## Risk Mitigation
- **Plugin compatibility**: Maintain Cordis plugin resolution, provide migration guide
- **Performance**: Use transform/opacity animations, lazy load theme resources
- **Backward compatibility**: Keep `dsh` as deprecated alias, fallback env vars
- **CI/CD**: Gradual migration, test each change independently