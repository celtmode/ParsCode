/**
 * ParsCode Theme - Host Entry
 * Design tokens, CSS variables, and theme configuration for the host
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import {
  BRAND_COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  TRANSITIONS,
  ANIMATIONS,
  Z_INDEX,
  BREAKPOINTS,
  type ThemeVariant,
  THEME_VARIANTS,
} from '@parscode/brand'

/** Theme configuration schema */
export interface Config {
  /** Active theme variant */
  variant: Volatile<ThemeVariant>
  /** Glow effect strength (0-1) */
  glowStrength: Volatile<number>
  /** Animation speed multiplier (0.5-2) */
  animationSpeed: Volatile<number>
  /** Accent color intensity (0.5-1.5) */
  accentIntensity: Volatile<number>
  /** Base font size in px */
  fontSize: Volatile<number>
  /** UI density (compact/normal/spacious) */
  density: Volatile<'compact' | 'normal' | 'spacious'>
  /** Background style (solid/aurora/particles) */
  backgroundStyle: Volatile<'solid' | 'aurora' | 'particles'>
  /** Enable reduced motion (overrides system preference) */
  reduceMotion: Volatile<boolean>
}

/** Default configuration values */
export const DEFAULT_CONFIG: Required<Omit<Config, keyof { variant: any }>> & { variant: ThemeVariant } = {
  variant: 'dark',
  glowStrength: 1,
  animationSpeed: 1,
  accentIntensity: 1,
  fontSize: 14,
  density: 'normal',
  backgroundStyle: 'solid',
  reduceMotion: false,
}

/** Zod schema for config validation */
export const Config = z.object({
  variant: z.union([z.literal('dark'), z.literal('gold-light')]).default(DEFAULT_CONFIG.variant).volatile(),
  glowStrength: z.number().min(0).max(1).step(0.1).default(DEFAULT_CONFIG.glowStrength).volatile(),
  animationSpeed: z.number().min(0.5).max(2).step(0.1).default(DEFAULT_CONFIG.animationSpeed).volatile(),
  accentIntensity: z.number().min(0.5).max(1.5).step(0.1).default(DEFAULT_CONFIG.accentIntensity).volatile(),
  fontSize: z.number().min(10).max(24).step(1).default(DEFAULT_CONFIG.fontSize).volatile(),
  density: z.union([z.literal('compact'), z.literal('normal'), z.literal('spacious')]).default(DEFAULT_CONFIG.density).volatile(),
  backgroundStyle: z.union([z.literal('solid'), z.literal('aurora'), z.literal('particles')]).default(DEFAULT_CONFIG.backgroundStyle).volatile(),
  reduceMotion: z.boolean().default(DEFAULT_CONFIG.reduceMotion).volatile(),
})

/** Generate CSS custom properties from config */
export function generateCssVariables(config: Required<Config>): Record<string, string> {
  const { variant, glowStrength, animationSpeed, accentIntensity, fontSize, density, backgroundStyle, reduceMotion } = config
  const theme = THEME_VARIANTS[variant]

  // Base colors (variant-specific)
  const colors = variant === 'dark'
    ? {
        bg: BRAND_COLORS.bg,
        surface1: BRAND_COLORS.surface1,
        surface2: BRAND_COLORS.surface2,
        border: BRAND_COLORS.border,
        textPrimary: BRAND_COLORS.textPrimary,
        textSecondary: BRAND_COLORS.textSecondary,
      }
    : {
        bg: '#FDF8F0',
        surface1: '#FFFFFF',
        surface2: '#F5EDE3',
        border: 'rgba(212, 175, 55, 0.2)',
        textPrimary: '#1A1814',
        textSecondary: '#6B6356',
      }

  // Accent colors with intensity
  const gold = adjustColorLightness(BRAND_COLORS.gold, accentIntensity)
  const goldLight = adjustColorLightness(BRAND_COLORS.goldLight, accentIntensity)
  const goldDeep = adjustColorLightness(BRAND_COLORS.goldDeep, accentIntensity)

  // Glow color with strength
  const glowAlpha = Math.round(glowStrength * 102) // 0-102 (0.4 max)
  const glowColor = `${gold}${glowAlpha.toString(16).padStart(2, '0')}`

  // Density spacing multipliers
  const densityMultiplier = density === 'compact' ? 0.75 : density === 'spacious' ? 1.5 : 1

  // Animation duration multipliers
  const animMultiplier = reduceMotion ? 0.001 : animationSpeed // near-zero for reduced motion

  return {
    // ParsCode design tokens
    '--pc-bg': colors.bg,
    '--pc-surface-1': colors.surface1,
    '--pc-surface-2': colors.surface2,
    '--pc-border': colors.border,
    '--pc-text-primary': colors.textPrimary,
    '--pc-text-secondary': colors.textSecondary,
    '--pc-accent': gold,
    '--pc-accent-light': goldLight,
    '--pc-accent-deep': goldDeep,
    '--pc-focus-ring': gold,
    '--pc-glow-color': glowColor,
    '--pc-font-ui': TYPOGRAPHY.ui,
    '--pc-font-code': TYPOGRAPHY.code,
    '--pc-font-brand': TYPOGRAPHY.brand,

    // Spacing
    '--pc-spacing-xs': `${parseFloat(SPACING.xs) * densityMultiplier}px`,
    '--pc-spacing-sm': `${parseFloat(SPACING.sm) * densityMultiplier}px`,
    '--pc-spacing-md': `${parseFloat(SPACING.md) * densityMultiplier}px`,
    '--pc-spacing-lg': `${parseFloat(SPACING.lg) * densityMultiplier}px`,
    '--pc-spacing-xl': `${parseFloat(SPACING.xl) * densityMultiplier}px`,
    '--pc-spacing-2xl': `${parseFloat(SPACING['2xl']) * densityMultiplier}px`,
    '--pc-spacing-3xl': `${parseFloat(SPACING['3xl']) * densityMultiplier}px`,

    // Border radius
    '--pc-radius-xs': BORDER_RADIUS.xs,
    '--pc-radius-sm': BORDER_RADIUS.sm,
    '--pc-radius-md': BORDER_RADIUS.md,
    '--pc-radius-lg': BORDER_RADIUS.lg,
    '--pc-radius-xl': BORDER_RADIUS.xl,
    '--pc-radius-panel': BORDER_RADIUS.panel,
    '--pc-radius-full': BORDER_RADIUS.full,

    // Transitions
    '--pc-transition-fast': `${parseFloat(TRANSITIONS.fast) * animMultiplier}ms`,
    '--pc-transition-normal': `${parseFloat(TRANSITIONS.normal) * animMultiplier}ms`,
    '--pc-transition-slow': `${parseFloat(TRANSITIONS.slow) * animMultiplier}ms`,
    '--pc-easing': TRANSITIONS.easing,

    // Z-index
    '--pc-z-dropdown': Z_INDEX.dropdown.toString(),
    '--pc-z-modal': Z_INDEX.modal.toString(),
    '--pc-z-popover': Z_INDEX.popover.toString(),
    '--pc-z-tooltip': Z_INDEX.tooltip.toString(),
    '--pc-z-toast': Z_INDEX.toast.toString(),

    // Font size
    '--pc-font-size-base': `${fontSize}px`,
    '--pc-font-size-sm': `${fontSize - 1}px`,
    '--pc-font-size-lg': `${fontSize + 2}px`,
    '--pc-font-size-xl': `${fontSize + 4}px`,

    // Density
    '--pc-density': densityMultiplier.toString(),

    // Background style
    '--pc-background-style': backgroundStyle,

    // Reduced motion
    '--pc-reduce-motion': reduceMotion ? '1' : '0',
  }
}

/** Adjust color lightness by factor */
function adjustColorLightness(hex: string, factor: number): string {
  const rgb = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, Math.round(((rgb >> 16) & 0xff) * factor)))
  const g = Math.min(255, Math.max(0, Math.round(((rgb >> 8) & 0xff) * factor)))
  const b = Math.min(255, Math.max(0, Math.round((rgb & 0xff) * factor)))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`
}

/** Generate complete CSS with animations */
export function generateThemeCss(config: Required<Config>): string {
  const vars = generateCssVariables(config)
  const varDeclarations = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')

  const reducedMotionQuery = '@media (prefers-reduced-motion: reduce) {\n  :root { --pc-reduce-motion: 1; }\n}'

  return `:root {\n${varDeclarations}\n}\n\n${reducedMotionQuery}\n\n${ANIMATIONS.glowPulse}\n${ANIMATIONS.shimmer}\n${ANIMATIONS.wingSweep}\n${ANIMATIONS.goldSweep}\n${ANIMATIONS.fadeIn}\n${ANIMATIONS.slideIn}`
}

/** Apply theme to document */
export function applyThemeToDocument(config: Required<Config>): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const vars = generateCssVariables(config)
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }
  // Also set data attribute for CSS selectors
  root.dataset.pcTheme = config.variant
  root.dataset.pcDensity = config.density
  root.dataset.pcBackground = config.backgroundStyle
}

/** Host plugin registration */
export function apply(ctx: Context, config: Config): void {
  // Provide theme CSS variables before client loads
  ctx.on('webserver/index-inject', (table) => {
    const css = generateThemeCss(config as Required<Config>)
    table.push({
      type: 'inline-style',
      content: css,
      priority: 'high',
    })
  }, { prepend: true })

  // Watch for config changes and broadcast to clients
  ctx.on('loader/volatile-update', () => {
    ctx.emit('parscode-theme/changed', config)
  })
}

// Re-export brand constants for convenience
export {
  BRAND_COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  TRANSITIONS,
  ANIMATIONS,
  Z_INDEX,
  BREAKPOINTS,
  type ThemeVariant,
  THEME_VARIANTS,
  DEFAULT_CONFIG,
} from '@parscode/brand'