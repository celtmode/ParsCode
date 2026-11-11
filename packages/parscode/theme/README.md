---
description: "ParsCode black+gold animated design system with design tokens, CSS variables, theme registration, components, and comprehensive customization options."
kind: "package-reference"
---

# @parscode/theme

English | [中文](README.zh.md)

## Summary

`@parscode/theme` implements the ParsCode visual identity: a premium black-and-gold animated theme with design tokens, CSS custom properties, React components, and extensive customization options. It registers themes with `ui-theme`, provides theme-aware components (Faravahar logo, animated backgrounds), and exposes a settings panel for user customization.

## Table of Contents

- [Use this package](#use-this-package)
- [Design Tokens](#design-tokens)
- [Theme Variants](#theme-variants)
- [Components](#components)
- [Animations](#animations)
- [Settings Panel](#settings-panel)
- [RTL & Accessibility](#rtl--accessibility)
- [Further Exploration](#further-exploration)

-----

<a id="use-this-package"></a>
## Use this package

### Installation

Add to your profile's `cordis.patch.yml`:

```yaml
- insert:
    - id: parscode-theme
      name: '@parscode/theme'
```

Or install via Plugin Manager:
```bash
parscode plugin --profile web add @parscode/theme
```

### Theme Registration

The package automatically registers two themes with `ui-theme`:
- `parscode-dark` - Default black + gold
- `parscode-gold-light` - Light variant

Users can select them in **Settings → General → Appearance**.

### Using Design Tokens in CSS

```css
.my-component {
  background: var(--pc-surface-1);
  border: 1px solid var(--pc-border);
  border-radius: var(--pc-radius-panel);
  color: var(--pc-text-primary);
}

.my-button {
  background: linear-gradient(135deg, var(--pc-accent), var(--pc-accent-deep));
  color: var(--pc-bg);
  box-shadow: 0 2px 8px var(--pc-glow-color);
}

.my-button:hover {
  box-shadow: 0 4px 16px var(--pc-glow-color);
}
```

### Using Components in React

```tsx
import {
  FaravaharLogo,
  AuroraBackground,
  ParticlesBackground,
  ThemeProvider,
} from '@parscode/theme/client'

function MyPage() {
  return (
    <ThemeProvider>
      <AuroraBackground />
      <header>
        <FaravaharLogo size={48} animated={true} />
        <h1 className="pc-heading">Welcome to ParsCode</h1>
      </header>
    </ThemeProvider>
  )
}
```

## Design Tokens

All tokens are exposed as CSS custom properties on `:root`:

### Colors

| Token | Dark Value | Light Value | Description |
|-------|------------|-------------|-------------|
| `--pc-bg` | `#0A0A0B` | `#FDF8F0` | Main background |
| `--pc-surface-1` | `#121214` | `#FFFFFF` | Elevated surfaces |
| `--pc-surface-2` | `#17171A` | `#F5EDE3` | Higher elevation |
| `--pc-border` | `rgba(212,175,55,0.14)` | `rgba(212,175,55,0.2)` | Subtle borders |
| `--pc-text-primary` | `#F2EDE0` | `#1A1814` | Primary text |
| `--pc-text-secondary` | `#A8A08C` | `#6B6356` | Secondary text |
| `--pc-accent` | `#D4AF37` | `#D4AF37` | Primary gold |
| `--pc-accent-light` | `#F5D27A` | `#F5D27A` | Light gold |
| `--pc-accent-deep` | `#8A6D1A` | `#8A6D1A` | Deep gold |
| `--pc-focus-ring` | `#D4AF37` | `#D4AF37` | Focus rings |
| `--pc-glow-color` | `rgba(212,175,55,0.4)` | `rgba(212,175,55,0.4)` | Glow effects |

### Typography

| Token | Value |
|-------|-------|
| `--pc-font-ui` | Inter + Vazirmatn (Persian) + system |
| `--pc-font-code` | JetBrains Mono + system |
| `--pc-font-brand` | Montserrat + Inter |

### Spacing

| Token | Default | Compact | Spacious |
|-------|---------|---------|----------|
| `--pc-spacing-xs` | 4px | 3px | 6px |
| `--pc-spacing-sm` | 8px | 6px | 12px |
| `--pc-spacing-md` | 12px | 9px | 18px |
| `--pc-spacing-lg` | 16px | 12px | 24px |
| `--pc-spacing-xl` | 24px | 18px | 36px |

### Border Radius

| Token | Value |
|-------|-------|
| `--pc-radius-xs` | 4px |
| `--pc-radius-sm` | 8px |
| `--pc-radius-md` | 12px |
| `--pc-radius-lg` | 16px |
| `--pc-radius-xl` | 20px |
| `--pc-radius-panel` | 28px |
| `--pc-radius-full` | 9999px |

### Transitions

| Token | Default | Reduced Motion |
|-------|---------|----------------|
| `--pc-transition-fast` | 100ms | ~0ms |
| `--pc-transition-normal` | 200ms | ~0ms |
| `--pc-transition-slow` | 300ms | ~0ms |
| `--pc-easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | - |

## Theme Variants

| Variant | Description | Background |
|---------|-------------|------------|
| `dark` | Black with gold accents (default) | `--pc-bg: #0A0A0B` |
| `gold-light` | Light with gold accents | `--pc-bg: #FDF8F0` |

Switch via Settings or programmatically:
```ts
config.variant.set('gold-light')
```

## Components

### FaravaharLogo

```tsx
<FaravaharLogo
  size={32}           // number, default 32
  animated={true}     // boolean, default true
  variant="full"      // 'full' | 'mono' | 'mark'
/>
```

Variants:
- `full` - Full color with gold gradient (default)
- `mono` - Single color using `currentColor`
- `mark` - Small simplified version (1em)

### AuroraBackground

Animated gradient aurora effect for welcome screens and hero sections.

```tsx
<AuroraBackground intensity={1} /> // 0-1
```

### ParticlesBackground

Floating gold particles for ambient atmosphere.

```tsx
<ParticlesBackground count={50} /> // particle count
```

### ThemeProvider

Wraps application with theme context and applies CSS variables.

```tsx
<ThemeProvider config={config}>
  <App />
</ThemeProvider>
```

## Animations

Pre-defined keyframes (respects `prefers-reduced-motion`):

| Animation | Duration | Use Case |
|-----------|----------|----------|
| `parscode-glow-pulse` | 2s | Focus rings, active buttons |
| `parscode-shimmer` | 1.5s | Skeleton loading |
| `parscode-wing-sweep` | 3s | Logo wing animation |
| `parscode-gold-sweep` | 4s | Gradient light sweep |
| `parscode-fade-in` | 200ms | Staggered entrance |
| `parscode-slide-in` | 200ms | Panel transitions |
| `parscode-aurora-float` | 20s | Aurora layers |
| `parscode-particle-float` | 15-35s | Particle drift |

Apply in CSS:
```css
.my-element {
  animation: parscode-fade-in var(--pc-transition-normal) var(--pc-easing);
}
```

## Settings Panel

The theme adds a comprehensive settings section in **Settings → General → Theme**:

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| Variant | dark / gold-light | dark | Color scheme |
| Glow Strength | 0-100% | 100% | Intensity of glow effects |
| Animation Speed | 0.5x-2x | 1x | Global animation multiplier |
| Accent Intensity | 0.5x-1.5x | 1x | Gold color saturation |
| Font Size | 10-24px | 14px | Base UI font size |
| Density | compact / normal / spacious | normal | Spacing scale |
| Background Style | solid / aurora / particles | solid | Ambient background |
| Reduce Motion | on/off | off | Force disable animations |

Plus a **Reset to Defaults** button.

## RTL & Accessibility

- **Full RTL support** for Persian/Arabic via Vazirmatn font and `[dir="rtl"]` styles
- **WCAG AA contrast** - all color pairs tested
- **Visible focus rings** - 2px gold on all interactive elements
- **Reduced motion** - respects system preference + manual toggle
- **Keyboard navigation** - all custom components focusable
- **Screen reader** - proper ARIA labels on logo and controls

## Further Exploration

- [@parscode/brand](../brand/README.md) - Centralized brand configuration
- [@parscode/marketplace](../marketplace/README.md) - Plugin marketplace with themed UI
- [@parscode/options](../options/README.md) - Comprehensive settings with theme integration
- [ui-theme](../../client/ui-theme/README.md) - Base theme system this extends
- [Web Styling Guide](../../../docs/web-styling.md) - Authoritative styling rules