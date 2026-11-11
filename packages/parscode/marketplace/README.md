---
description: "ParsCode plugin marketplace with registry API, auto-install, and comprehensive management UI. Extends the existing plugin manager with a discoverable registry, install/update/uninstall flow, and plugin management dashboard."
kind: "package-reference"
---

# @parscode/marketplace

English | [中文](README.zh.md)

## Summary

`@parscode/marketplace` extends the existing plugin manager with a full-featured plugin marketplace. It provides a registry API client, automated install/update/uninstall with integrity verification, and a rich Web UI for discovering, managing, and configuring plugins.

## Table of Contents

- [Use this package](#use-this-package)
- [Registry API](#registry-api)
- [Installation Flow](#installation-flow)
- [UI Components](#ui-components)
- [Settings](#settings)
- [Security](#security)
- [Example Plugins](#example-plugins)
- [Further Exploration](#further-exploration)

-----

<a id="use-this-package"></a>
## Use this package

### Installation

Add to your profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: parscode-marketplace
      name: '@parscode/marketplace'
```

Or install via CLI:
```bash
parscode plugin --profile web add @parscode/marketplace
```

### Requirements

- `@parscode/theme` (for styling)
- `@deepseek-ai/dsh-plugin-manager` (for installation backend)

## Registry API

The marketplace consumes a REST API defined in `registry-api.yaml` (OpenAPI 3.0). The default registry URL is configurable (default: `https://celtmode.github.io/ParsCode-registry/v1`), hostable as static JSON on GitHub Pages.

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /plugins` | Search plugins with query, category, tag, sort, pagination |
| `GET /plugins/{id}` | Get plugin detail with README, versions, permissions |
| `GET /plugins/{id}/versions/{version}` | Get version detail with download URL, SHA-256, signature |
| `GET /featured` | Get featured plugins |
| `GET /categories` | Get all categories |

### Plugin Manifest Extensions

Plugins declare marketplace metadata in `package.json` under `parscode.marketplace`:

```json
{
  "parscode": {
    "marketplace": {
      "icon": "icon.svg",
      "screenshots": ["screenshot1.png"],
      "featured": false,
      "minAppVersion": "0.2.0",
      "permissions": ["filesystem", "network"]
    }
  }
}
```

## Installation Flow

1. **Search/Discover** - User browses marketplace via Web UI
2. **Select Version** - User picks version from detail drawer
3. **Confirm** - Dialog shows plugin info, permissions, trust notice
4. **Download** - Fetch tarball from `download_url`
5. **Verify** - SHA-256 checksum + optional Ed25519 signature
6. **Extract** - Unzip to `~/.parscode/marketplace/plugins/`
7. **Validate** - Check `package.json`, `dsh.bundle`, compatibility
8. **Install** - Call `pluginManager.installBundle()` with `file:` spec
9. **Record** - Save installation metadata for updates/uninstall
10. **Hot-load** - HMR reloads plugins; otherwise restart required

## UI Components

### Marketplace Page (Plugins → Discover tab)

- **Search**: Debounced query (250ms) across name, description, author, keywords
- **Filters**: Category pills, multi-select tags, sort dropdown
- **Featured**: Horizontal carousel of curated plugins
- **Grid**: Responsive cards with icon, name, version, description, stats, action
- **Load More**: Pagination (50 per page)
- **Empty States**: Illustrated with Faravahar logo

### Plugin Detail Drawer

Slides in from right with tabs:
- **Overview**: Full README, repository/homepage links
- **Versions**: Dropdown selector, changelog, install/update buttons
- **Permissions**: List with required/optional badges

### Installed Tab

List of installed plugins with version, update badges, uninstall action.

### Updates Tab

Check for updates across all installed plugins with changelog preview.

## Settings

Configure in **Settings → Plugins → Marketplace**:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| Registry URL | URL | Official | Primary registry endpoint |
| Auto-update | Boolean | `false` | Automatically install compatible updates |
| Auto-install | Boolean | `false` | Install missing plugins on first use |
| Verify Signatures | Boolean | `true` | Require Ed25519 signature verification |
| Allow Unsigned | Boolean | `false` | Permit plugins without signatures (with warning) |
| Custom Registries | Array | — | Additional registry URLs with API keys |

## Security

### Integrity Verification

- **SHA-256**: Every download verified against registry-provided checksum
- **Signatures**: Optional Ed25519 signatures (public key pinned in app)
- **Fail Closed**: Any verification failure aborts installation

### Permission Model

Plugins declare required permissions:
- `filesystem` - Read/write workspace files
- `network` - HTTP/HTTPS requests
- `shell` - Execute shell commands
- `secrets` - Access credential store
- `clipboard` - Read/write clipboard
- `notifications` - Show system notifications
- `native_modules` - Load native Node addons

UI shows permission prompt before install; `allowUnsigned` setting controls unsigned plugin policy.

### Path Traversal Protection

- Extraction uses `extract-zip` with safe defaults
- Install directory scoped to `~/.parscode/marketplace/plugins/`
- Symlinks and `../` paths rejected

### Zip-Slip Prevention

- All extracted paths validated against target directory
- Absolute paths and directory traversal blocked

## Example Plugins

Three example plugins included in `registry/examples/`:

1. **@parscode/plugin-theme-pack** - Additional theme variants (rose, ocean, forest)
2. **@parscode/plugin-git-helper** - Git workflow commands (commit, branch, rebase helpers)
3. **@parscode/plugin-prompt-library** - Curated prompt templates for common tasks

Each includes:
- Complete source with `dsh.bundle` declaration
- Marketplace manifest extensions
- README with usage examples
- Signed tarball for registry

## Plugin Authoring

See `docs/plugin-authoring.md` for:
- Package structure
- Manifest fields
- Building & signing
- Publishing to registry
- Testing locally

## Further Exploration

- [@parscode/brand](../brand/README.md) - Brand configuration
- [@parscode/theme](../theme/README.md) - Design system
- [@parscode/options](../options/README.md) - Settings integration
- [Plugin Manager](../../boot/plugin-manager/README.md) - Underlying installation backend
- [Registry API Spec](registry-api.yaml) - OpenAPI 3.0 definition