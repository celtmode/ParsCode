---
description: "Centralized brand configuration for ParsCode: product identity, colors, typography, environment variables, and migration utilities."
kind: "package-reference"
---

# @parscode/brand

English | [中文](README.zh.md)

## Summary

`@parscode/brand` provides a single source of truth for all ParsCode brand configuration. It centralizes product identity strings, design tokens, environment variable mappings, path constants, and migration utilities for transitioning from DeepSeek Harness (`DSH_*` / `~/.dsh`) to ParsCode (`PARSCODE_*` / `~/.parscode`).

## Table of Contents

- [Use this package](#use-this-package)
- [Brand Constants](#brand-constants)
- [Environment Variables](#environment-variables)
- [Migration Utilities](#migration-utilities)
- [Client Exports](#client-exports)
- [Further Exploration](#further-exploration)

-----

<a id="use-this-package"></a>
## Use this package

Import brand constants and utilities instead of hardcoding strings:

```ts
import {
  PRODUCT_NAME,
  CLI_COMMAND,
  BRAND_COLORS,
  TYPOGRAPHY,
  ENV_VARS,
  PATHS,
  getEnvVar,
  getHomeDir,
  migrateLegacyConfig,
} from '@parscode/brand'

// Use in any package
console.log(PRODUCT_NAME) // "ParsCode"
console.log(CLI_COMMAND)  // "parscode"
console.log(BRAND_COLORS.gold) // "#D4AF37"
```

### Environment Variable Access

Always use `getEnvVar()` for reading configuration:

```ts
const apiKey = getEnvVar(ENV_VARS.primary.apiKey, ENV_VARS.fallback.apiKey)
// Reads PARSCODE_API_KEY first, falls back to DEEPSEEK_API_KEY
```

### Home Directory Resolution

```ts
const homeDir = getHomeDir()
// Returns PARSCODE_HOME if set, else DSH_HOME, else ~/.parscode
```

### Legacy Configuration Migration

Call once at application startup:

```ts
await migrateLegacyConfig()
// Copies ~/.dsh/* to ~/.parscode/ if new location doesn't exist
```

## Brand Constants

### Product Identity

| Constant | Value | Description |
|----------|-------|-------------|
| `PRODUCT_NAME` | `"ParsCode"` | Full product name |
| `PRODUCT_NAME_SHORT` | `"ParsCode"` | Short product name |
| `CLI_COMMAND` | `"parscode"` | Primary CLI command |
| `CLI_COMMAND_ALIAS` | `"dsh"` | Deprecated alias |
| `USER_AGENT` | `"ParsCode/0.2.2-rc.1"` | HTTP user agent string |

### Colors

All colors in `BRAND_COLORS`:

| Token | Value | Usage |
|-------|-------|-------|
| `gold` | `#D4AF37` | Primary accent |
| `goldLight` | `#F5D27A` | Highlights, hover |
| `goldDeep` | `#8A6D1A` | Pressed states |
| `goldGradient` | `['#B8860B', '#F5D27A', '#D4AF37']` | Gradient stops |
| `bg` | `#0A0A0B` | Main background |
| `surface1` | `#121214` | Elevated surfaces |
| `surface2` | `#17171A` | Higher elevation |
| `border` | `rgba(212, 175, 55, 0.14)` | Subtle borders |
| `textPrimary` | `#F2EDE0` | Primary text |
| `textSecondary` | `#A8A08C` | Secondary text |
| `focusRing` | `#D4AF37` | Focus indicators |
| `error` | `#E85D5D` | Error states |
| `success` | `#5FD67A` | Success states |
| `warning` | `#F5D27A` | Warning states |

### Typography

| Token | Value |
|-------|-------|
| `ui` | Inter + Vazirmatn (Persian) + system fallbacks |
| `code` | JetBrains Mono + system fallbacks |
| `brand` | Montserrat + Inter fallbacks |

### Spacing, Radius, Transitions

Standardized scales in `SPACING`, `BORDER_RADIUS`, `TRANSITIONS`.

### Animations

Pre-defined keyframes in `ANIMATIONS`:
- `glowPulse` - Focus/active glow
- `shimmer` - Skeleton loading
- `wingSweep` - Logo wing animation
- `goldSweep` - Gradient light sweep
- `fadeIn` - Staggered entrance
- `slideIn` - Panel transitions

## Environment Variables

### Primary (ParsCode)

| Variable | Purpose | Default |
|----------|---------|---------|
| `PARSCODE_HOME` | Config/home directory | `~/.parscode` |
| `PARSCODE_API_KEY` | Default API key | — |
| `PARSCODE_BASE_URL` | API base URL | — |
| `PARSCODE_TELEMETRY_MODE` | OTel mode | `FEEDBACK_ONLY` |
| `PARSCODE_TELEMETRY_OTLP_URL` | OTel endpoint | — |
| `PARSCODE_PERMISSION_MODE` | Sandbox mode | `workspace-write` |
| `PARSCODE_LOG_LEVEL` | Log verbosity | — |

### Fallback (DeepSeek Harness - Deprecated)

| Variable | Maps To |
|----------|---------|
| `DSH_HOME` | `PARSCODE_HOME` |
| `DEEPSEEK_API_KEY` | `PARSCODE_API_KEY` |
| `DEEPSEEK_BASE_URL` | `PARSCODE_BASE_URL` |
| `DSH_TELEMETRY_MODE` | `PARSCODE_TELEMETRY_MODE` |
| `DSH_TELEMETRY_OTLP_URL` | `PARSCODE_TELEMETRY_OTLP_URL` |
| `DSH_PERMISSION_MODE` | `PARSCODE_PERMISSION_MODE` |
| `DSH_LOG_LEVEL` | `PARSCODE_LOG_LEVEL` |

## Migration Utilities

### `getHomeDir(): string`

Resolves the home directory with proper fallback chain:
1. `PARSCODE_HOME`
2. `DSH_HOME`
3. `~/.parscode` (default)

### `isLegacyMode(): boolean`

Returns `true` if any `DSH_*` or `DEEPSEEK_*` env vars are set.

### `migrateLegacyConfig(): Promise<void>`

Copies legacy configuration from `~/.dsh` to `~/.parscode`:
- `.credentials.yaml`
- `compatibility.json`
- `.anonymous-user-id`
- `cordis.patch.yml`
- `sessions/` directory
- `storages/` directory

Only runs if new location doesn't exist. Non-destructive.

## Client Exports

The `./client` entry provides:

```ts
import {
  PARSCODE_THEMES,
  registerParsCodeThemes,
  getProductName,
  getThemeVariantInfo,
} from '@parscode/brand/client'
```

### `PARSCODE_THEMES`

Pre-defined theme definitions for `ui-theme` registration:
- `parscode-dark` - Default black + gold
- `parscode-gold-light` - Light variant

### `registerParsCodeThemes(ctx)`

Call from a client plugin to register themes:

```ts
export function apply(ctx: Context) {
  registerParsCodeThemes(ctx)
}
```

## Further Exploration

- [parscode-theme](../theme/README.md) - Design token implementation and component library
- [parscode-marketplace](../marketplace/README.md) - Plugin marketplace with auto-install
- [parscode-options](../options/README.md) - Comprehensive settings UI
- [Brand Guidelines](../../BRAND_GUIDELINES.md) - Visual identity specification