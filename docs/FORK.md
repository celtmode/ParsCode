# ParsCode Fork Plan

## Overview
This document tracks the rebrand and extension of DeepSeek Harness to ParsCode, a premium developer toolkit with a plugin marketplace, enhanced UI theme, and productivity features.

## Summary of Changes
- **Package Names**: @deepseek-ai/dsh-* → @parscode/*
- **CLI Command**: `dsh` → `parscode` (with deprecated `dsh` alias)
- **Brand Strings**: All DeepSeek references replaced with ParsCode
- **Theme**: Black+gold animated design system
- **Logo**: Original Faravahar vector symbol
- **Marketplace**: Plugin registry with auto-install
- **Settings**: Comprehensive configuration UI

## Affected Files (to be tracked)

### Core Package Renames
- `packages/core/` → `packages/parscode-core/`
- `packages/api/` → `packages/parscode-api/`
- `packages/llm/` → `packages/parscode-llm/`
- And all other `@deepseek-ai/dsh-*` packages

### Configuration Files
- `package.json` (root)
- `pnpm-workspace.yaml` (if exists)
- `README.md`
- `README.zh.md`
- `docs/architecture.md`
- `docs/development.md`
- `AGENTS.md`
- All CI/CD files
- All documentation

### Branding
- Environment variables: `DSH_*` → `PARSCODE_*`
- Config directory: `~/.dsh` → `~/.parscode`
- Window titles and class names
- User-agent strings
- i18n strings

## Migration Strategy
1. **Isolated Development**: Create new packages in `packages/parscode-*`
2. **Brand Config**: Central brand configuration module
3. **Gradual Migration**: Keep old package names functional during transition
4. **Cordis Compatibility**: Preserve plugin resolution for existing plugins

## Tasks Completed

### Phase 1: Initial Assessment
✅ Inspected repository structure
✅ Analyzed AGENTS.md for development guidelines
✅ Reviewed README and package structure
✅ Planned rebrand scope

### Phase 2: Initial Reorganization
- Renamed main package to `@parscode/parscode-root`
- Updated workspace configuration
- Created brand configuration
- Updated package names in scripts

### Phase 3: Theme Development
- Created CSS design tokens
- Developed black+gold theme
- Added animations and micro-interactions
- Implemented responsive design

### Phase 4: Logo Creation
- Designed original Faravahar SVG
- Created variants (full color, monochrome, favicon, app icons)
- Added animations for splash/loading states

### Phase 5: Marketplace Implementation
- Designed plugin registry API
- Implemented plugin installer
- Added auto-install features
- Created example plugins

### Phase 6: Settings UI
- Built comprehensive settings panel
- Added theme customization
- Implemented plugin management
- Added system options

## Risks and Mitigations

### Plugin Compatibility
- **Risk**: Existing plugins may break with rebrand
- **Mitigation**: Maintain backward compatibility, provide migration guide

### Performance Impact
- **Risk**: Theme changes may affect performance
- **Mitigation**: Optimize CSS, use transforms/opacity animations

### CI/CD Changes
- **Risk**: Build pipeline may break
- **Mitigation**: Gradual migration, test each change

## Next Steps
1. Complete theme implementation
2. Final logo refinement
3. Marketplace testing
4. Settings validation
5. Performance optimization
6. Documentation updates

## Repository State
- **Current Commit**: Based on deepseek-harness-master
- **Worktree**: Active rebrand in progress
- **Build Status**: Ready for testing
- **Package Naming**: Complete migration to @parscode/*

## Verification Commands
```bash
pnpm run build:artifacts  # Build all artifacts
pnpm run typecheck          # Type check
pnpm run test:coverage      # Run tests
pnpm run docs:build         # Build documentation
```

## Support
For this rebrand and development, refer to AGENTS.md for development conventions and docs/architecture.md for design decisions.

---
**Note**: This fork preserves the original MIT license and respects all upstream copyright notices. All DeepSeek references have been removed per brand guidelines.