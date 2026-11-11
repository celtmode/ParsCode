---
description: "ParsCode comprehensive settings UI with typed schema validation, defaults, descriptions, reset-to-default, and import/export/backup of all settings. Organized into Models, Agent, Workspace, UX, Theme, Marketplace, and System categories."
kind: "package-reference"
---

# @parscode/options

English | [中文](README.zh.md)

## Summary

`@parscode/options` provides a complete settings management system for ParsCode with typed schema validation (Zod), organized categories, import/export/backup functionality, and seamless integration with the existing config-editor and settings infrastructure.

## Table of Contents

- [Use this package](#use-this-package)
- [Settings Categories](#settings-categories)
- [Schema Validation](#schema-validation)
- [Import/Export/Backup](#importexportbackup)
- [Legacy Migration](#legacy-migration)
- [Further Exploration](#further-exploration)

-----

<a id="use-this-package"></a>
## Use this package

### Installation

Add to your profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: parscode-options
      name: '@parscode/options'
```

Or install via CLI:
```bash
parscode plugin --profile web add @parscode/options
```

### Requirements

- `@parscode/theme` (for styling)
- `@deepseek-ai/dsh-settings` (settings persistence)
- `@deepseek-ai/dsh-config-editor` (live config forms)

## Settings Categories

All settings organized into 7 categories accessible from **Settings → ParsCode Options**:

### 1. Models & Providers (`models`)
- **Active Provider** - Select default AI provider
- **Provider Configurations** - Base URLs, API key references (credential store), model lists with capabilities
- **Task Routing** - Per-task model routing with fallback chains
- **Defaults** - Temperature, max tokens, reasoning effort, top-p
- **Usage Tracking** - Enable/disable, daily/monthly budgets, alert thresholds, cost per 1k tokens

### 2. Agent Behavior (`agent`)
- **Permission Mode** - Ask / Auto-edit / Plan-only / Full-auto
- **Tool Permissions** - Per-tool allow/deny lists
- **Plan Mode** - Enable, auto-exit on approval
- **Checkpoints** - Enable, max history, auto-save
- **Auto-compact** - Enable, threshold, turns to keep
- **Subagents** - Enable, max concurrent, default provider
- **Custom Agents** - Define custom agent configurations
- **Slash Commands** - Custom slash commands
- **Hooks** - Pre/post tool, pre/post step hooks
- **MCP Servers** - Configure Model Context Protocol servers
- **Project Memory** - PARSCODE.md file, auto-load
- **Skills** - Enable/disable skills with config

### 3. Workspace (`workspace`)
- **File Tree** - Show hidden, git-ignored, symlinks, max depth
- **Diff Viewer** - Inline/side-by-side, word wrap, line numbers, context lines
- **Tabs** - Enable, max tabs, persist sessions
- **Sessions** - Search, pin, archive after days, export formats
- **Git Panel** - Enable, auto-fetch, interval, stash, worktrees
- **Terminal** - Shell, font size/family, cursor blink, scrollback
- **Prompt Library** - Enabled, categories, snippets
- **Quick Open** - Enabled, max results, include history
- **Command Palette** - Enabled, custom commands
- **Keybindings** - Preset (VS Code/Vim/Emacs/Custom), custom bindings

### 4. User Experience (`ux`)
- **Language** - English / Chinese / Persian (فارسی)
- **RTL Support** - Auto-detect or force RTL layout
- **Calendar** - Gregorian / Jalali (Persian)
- **Notifications** - Enable, sounds, volume, duration, position
- **Onboarding** - Welcome screen, tips, frequency
- **Welcome Screen** - Animated, changelog, tips, background style

### 5. Theme & Appearance (`theme`)
- **Variant** - Dark / Gold Light
- **Glow Strength** - 0-100%
- **Animation Speed** - 0.5x-2x
- **Accent Intensity** - 0.5x-1.5x
- **Font Size** - 10-24px
- **Density** - Compact / Normal / Spacious
- **Background** - Solid / Aurora / Particles
- **Reduce Motion** - Force disable animations

### 6. Plugin Marketplace (`marketplace`)
- **Registries** - Multiple registry URLs with API keys
- **Auto-update** - Install compatible updates automatically
- **Auto-install** - Install missing plugins on first use
- **Verify Signatures** - Require Ed25519 verification
- **Allow Unsigned** - Permit unsigned with warning
- **Cache TTL** - Registry cache duration

### 7. System (`system`)
- **Updates** - Channel (stable/beta/alpha), auto-check, interval, auto-download/install
- **Proxy** - Enable, URL, bypass list, auth
- **Network** - Diagnostics enabled, timeout, test URLs
- **Logs** - Level, max files, max size, timestamps
- **Crash Reporter** - Enable, endpoint, include system info
- **Data Directory** - Custom path, max size, auto-cleanup
- **Telemetry** - Opt-in (default off), endpoint, anonymous ID
- **Launch on Startup** - OS login integration
- **Tray Icon** - Enabled, minimize/close to tray

## Schema Validation

All settings validated with Zod schemas providing:
- **Type safety** - Runtime validation matches TypeScript types
- **Defaults** - Sensible defaults for every field
- **Descriptions** - Human-readable descriptions for UI
- **Constraints** - Min/max, enums, patterns, custom refinements
- **Volatile** - Live updates through Cordis volatile config

```ts
import { SettingsSchema, type Settings } from '@parscode/options'

// Validate settings
const result = SettingsSchema.safeParse(settings)
if (!result.success) {
  console.error(result.error.issues)
}
```

## Import/Export/Backup

### Export
**Settings → ParsCode Options → Export** downloads a JSON file with all settings:
```json
{
  "models": { ... },
  "agent": { ... },
  "workspace": { ... },
  "ux": { ... },
  "theme": { ... },
  "marketplace": { ... },
  "system": { ... }
}
```

### Import
**Settings → ParsCode Options → Import** selects a JSON file and merges/validates:
- Validates against current schema
- Shows errors for invalid fields
- Preserves valid settings on partial failure

### Backup/Restore
Each category has **Backup** and **Reset** buttons:
- **Backup** saves current state (up to 10 per category)
- **Restore** from backup history with timestamp
- **Reset** reverts to schema defaults

## Legacy Migration

Automatic migration from DeepSeek Harness (`~/.dsh`) on first run:
- Reads legacy `cordis.patch.yml`
- Replaces `DSH_*` → `PARSCODE_*` env vars
- Replaces `DEEPSEEK_API_KEY` → `PARSCODE_API_KEY`
- Copies sessions, storages, credentials, compatibility
- Non-destructive - only runs if `~/.parscode` doesn't exist

## Further Exploration

- [@parscode/brand](../brand/README.md) - Brand configuration & env var mapping
- [@parscode/theme](../theme/README.md) - Design system & theme settings
- [@parscode/marketplace](../marketplace/README.md) - Marketplace settings
- [dsh-settings](../../settings/README.md) - Underlying settings persistence
- [dsh-config-editor](../../boot/config-editor/README.md) - Live config forms