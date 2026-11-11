/**
 * ParsCode Brand - Client Entry
 * Provides theme registration and brand utilities for the browser
 */

import type { Context } from '@deepseek-ai/cordis'
import { PRODUCT_NAME, BRAND_COLORS, THEME_VARIANTS, type ThemeVariant } from '../index.ts'

/** Theme definition for ui-theme registration */
export interface ParsCodeThemeDefinition {
  id: string
  name: string
  description: string
  tokens: Record<string, string>
  icons?: Record<string, string> // SVG strings for icon replacement
}

/** Available ParsCode themes */
export const PARSCODE_THEMES: ParsCodeThemeDefinition[] = [
  {
    id: 'parscode-dark',
    name: 'ParsCode Dark',
    description: 'Black background with gold accents (default)',
    tokens: {
      '--pc-bg': BRAND_COLORS.bg,
      '--pc-surface-1': BRAND_COLORS.surface1,
      '--pc-surface-2': BRAND_COLORS.surface2,
      '--pc-border': BRAND_COLORS.border,
      '--pc-text-primary': BRAND_COLORS.textPrimary,
      '--pc-text-secondary': BRAND_COLORS.textSecondary,
      '--pc-accent': BRAND_COLORS.gold,
      '--pc-accent-light': BRAND_COLORS.goldLight,
      '--pc-accent-deep': BRAND_COLORS.goldDeep,
      '--pc-focus-ring': BRAND_COLORS.focusRing,
      '--pc-glow-color': `${BRAND_COLORS.gold}66`, // 40% opacity
      '--pc-font-ui': '"Inter", "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      '--pc-font-code': '"JetBrains Mono", "SF Mono", "Fira Code", Consolas, monospace',
    },
  },
  {
    id: 'parscode-gold-light',
    name: 'ParsCode Gold Light',
    description: 'Light background with gold accents',
    tokens: {
      '--pc-bg': '#FDF8F0',
      '--pc-surface-1': '#FFFFFF',
      '--pc-surface-2': '#F5EDE3',
      '--pc-border': 'rgba(212, 175, 55, 0.2)',
      '--pc-text-primary': '#1A1814',
      '--pc-text-secondary': '#6B6356',
      '--pc-accent': BRAND_COLORS.gold,
      '--pc-accent-light': BRAND_COLORS.goldLight,
      '--pc-accent-deep': BRAND_COLORS.goldDeep,
      '--pc-focus-ring': BRAND_COLORS.focusRing,
      '--pc-glow-color': `${BRAND_COLORS.gold}66`,
      '--pc-font-ui': '"Inter", "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      '--pc-font-code': '"JetBrains Mono", "SF Mono", "Fira Code", Consolas, monospace',
    },
  },
]

/** Register ParsCode themes with ui-theme */
export function registerParsCodeThemes(ctx: Context): void {
  // Register themes through ui-theme's theme registration slot
  // This is called from the parscode-theme package's client entry
  ctx.slots.inject('theme.definitions', () => {
    return ctx.slots.registerFactory({
      name: 'theme.definitions',
      id: 'parscode-themes',
    }, () => PARSCODE_THEMES)
  })
}

/** Get product name for UI display */
export function getProductName(): string {
  return PRODUCT_NAME
}

/** Get theme variant info */
export function getThemeVariantInfo(variant: ThemeVariant) {
  return THEME_VARIANTS[variant]
}