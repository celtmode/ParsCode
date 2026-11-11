/**
 * ParsCode Brand Configuration
 * Centralized brand strings, constants, and configuration
 */

import { Branded } from '@deepseek-ai/dsh-brand'

/** Product identity */
export const PRODUCT_NAME = 'ParsCode'
export const PRODUCT_NAME_SHORT = 'ParsCode'
export const CLI_COMMAND = 'parscode'
export const CLI_COMMAND_ALIAS = 'dsh' // deprecated alias

/** Brand colors */
export const BRAND_COLORS = {
  /** Primary gold accent */
  gold: '#D4AF37',
  /** Light gold highlight */
  goldLight: '#F5D27A',
  /** Deep gold for pressed states */
  goldDeep: '#8A6D1A',
  /** Gold gradient stops */
  goldGradient: ['#B8860B', '#F5D27A', '#D4AF37'] as const,
  /** Background - near black */
  bg: '#0A0A0B',
  /** Surface 1 - elevated */
  surface1: '#121214',
  /** Surface 2 - higher elevation */
  surface2: '#17171A',
  /** Border with gold tint */
  border: 'rgba(212, 175, 55, 0.14)',
  /** Primary text */
  textPrimary: '#F2EDE0',
  /** Secondary text */
  textSecondary: '#A8A08C',
  /** Focus ring */
  focusRing: '#D4AF37',
  /** Error */
  error: '#E85D5D',
  /** Success */
  success: '#5FD67A',
  /** Warning */
  warning: '#F5D27A',
} as const

/** Typography */
export const TYPOGRAPHY = {
  /** UI font stack (Latin + Persian) */
  ui: '"Inter", "Vazirmatn", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
  /** Code font stack */
  code: '"JetBrains Mono", "SF Mono", "Fira Code", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  /** Brand font (Montserrat) */
  brand: '"Montserrat", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const

/** Spacing scale */
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const

/** Border radius scale */
export const BORDER_RADIUS = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  panel: '28px',
  full: '9999px',
} as const

/** Transition durations */
export const TRANSITIONS = {
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const

/** Animation keyframes */
export const ANIMATIONS = {
  /** Glow pulse for focus/active states */
  glowPulse: `
    @keyframes parscode-glow-pulse {
      0%, 100% { box-shadow: 0 0 0 0 var(--pc-glow-color, rgba(212, 175, 55, 0.4)); }
      50% { box-shadow: 0 0 0 8px var(--pc-glow-color, rgba(212, 175, 55, 0)); }
    }
  `,
  /** Shimmer for skeleton loading */
  shimmer: `
    @keyframes parscode-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `,
  /** Wing sweep for logo animation */
  wingSweep: `
    @keyframes parscode-wing-sweep {
      0% { stroke-dashoffset: 100; opacity: 0.3; }
      50% { opacity: 1; }
      100% { stroke-dashoffset: 0; opacity: 0.3; }
    }
  `,
  /** Gold light sweep across gradient */
  goldSweep: `
    @keyframes parscode-gold-sweep {
      0% { background-position: -200% 50%; }
      100% { background-position: 200% 50%; }
    }
  `,
  /** Fade in for staggered entrance */
  fadeIn: `
    @keyframes parscode-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  /** Slide in for panels */
  slideIn: `
    @keyframes parscode-slide-in {
      from { opacity: 0; transform: translateX(-16px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
} as const

/** Z-index layers */
export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  modal: 200,
  popover: 300,
  tooltip: 400,
  toast: 500,
} as const

/** Breakpoints */
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/** Environment variable mappings */
export const ENV_VARS = {
  /** Primary env vars (ParsCode) */
  primary: {
    home: 'PARSCODE_HOME',
    apiKey: 'PARSCODE_API_KEY',
    baseUrl: 'PARSCODE_BASE_URL',
    telemetryMode: 'PARSCODE_TELEMETRY_MODE',
    telemetryUrl: 'PARSCODE_TELEMETRY_OTLP_URL',
    permissionMode: 'PARSCODE_PERMISSION_MODE',
    logLevel: 'PARSCODE_LOG_LEVEL',
  },
  /** Fallback env vars (DeepSeek Harness - deprecated) */
  fallback: {
    home: 'DSH_HOME',
    apiKey: 'DEEPSEEK_API_KEY',
    baseUrl: 'DEEPSEEK_BASE_URL',
    telemetryMode: 'DSH_TELEMETRY_MODE',
    telemetryUrl: 'DSH_TELEMETRY_OTLP_URL',
    permissionMode: 'DSH_PERMISSION_MODE',
    logLevel: 'DSH_LOG_LEVEL',
  },
} as const

/** Default paths */
export const PATHS = {
  /** Default home directory */
  homeDir: '.parscode',
  /** Legacy home directory (for migration) */
  legacyHomeDir: '.dsh',
  /** Sessions directory */
  sessions: 'sessions',
  /** Storages directory */
  storages: 'storages',
  /** Credentials file */
  credentials: '.credentials.yaml',
  /** Anonymous user ID */
  anonymousId: '.anonymous-user-id',
  /** Compatibility/exemptions file */
  compatibility: 'compatibility.json',
} as const

/** Registry defaults */
export const REGISTRY = {
  /** Default marketplace registry (placeholder - hostable on GitHub Pages) */
  defaultUrl: 'https://celtmode.github.io/ParsCode-registry/v1',
  /** Official npm registry */
  npmRegistry: 'https://registry.npmjs.org/',
  /** npmmirror registry */
  npmmirrorRegistry: 'https://registry.npmmirror.com/',
} as const

/** Window titles */
export const WINDOW_TITLES = {
  app: 'ParsCode',
  welcome: 'Welcome to ParsCode',
  about: 'About ParsCode',
  settings: 'Settings - ParsCode',
  marketplace: 'Plugin Marketplace - ParsCode',
} as const

/** User agent string */
export const USER_AGENT = `ParsCode/${'0.2.2-rc.1'}`

/** About dialog content */
export const ABOUT = {
  name: 'ParsCode',
  tagline: 'Everything is a Plugin',
  description: 'An open-source agent harness built on Cordis with a plugin marketplace, premium theme, and powerful customization.',
  version: '0.2.2-rc.1',
  homepage: 'https://github.com/celtmode/ParsCode',
  repository: 'https://github.com/celtmode/ParsCode',
  license: 'MIT',
  basedOn: 'Based on DeepSeek Harness (MIT)',
  copyright: 'Copyright (c) 2026 ParsCode Team',
} as const

/** Theme variants */
export type ThemeVariant = 'dark' | 'gold-light'

export const THEME_VARIANTS: Record<ThemeVariant, { name: string; description: string }> = {
  dark: {
    name: 'Dark (Default)',
    description: 'Black background with gold accents',
  },
  'gold-light': {
    name: 'Gold Light',
    description: 'Light background with gold accents',
  },
}

/** Reduced motion preference */
export const REDUCED_MOTION_MEDIA_QUERY = '@media (prefers-reduced-motion: reduce)'

/** Utility to get env var with fallback */
export function getEnvVar(primary: string, fallback: string): string | undefined {
  return process.env[primary] ?? process.env[fallback]
}

/** Get home directory path with migration support */
export function getHomeDir(): string {
  const primary = process.env[ENV_VARS.primary.home]
  const fallback = process.env[ENV_VARS.fallback.home]
  if (primary) return primary
  if (fallback) return fallback
  // Default to new location
  const home = process.env.USERPROFILE ?? process.env.HOME ?? '~'
  return `${home}/${PATHS.homeDir}`
}

/** Check if running in legacy mode (using DSH_* vars) */
export function isLegacyMode(): boolean {
  return !!(
    process.env[ENV_VARS.fallback.home] ||
    process.env[ENV_VARS.fallback.apiKey] ||
    process.env[ENV_VARS.fallback.baseUrl]
  )
}

/** Migrate legacy configuration to new location */
export async function migrateLegacyConfig(): Promise<void> {
  const { existsSync, mkdirSync, copyFileSync, rmSync } = await import('node:fs')
  const { join } = await import('node:path')
  const { homedir } = await import('node:os')

  const legacyDir = join(homedir, PATHS.legacyHomeDir)
  const newDir = join(homedir, PATHS.homeDir)

  if (!existsSync(legacyDir) || existsSync(newDir)) {
    return // Nothing to migrate or already migrated
  }

  try {
    mkdirSync(newDir, { recursive: true })
    // Copy key files
    const filesToMigrate = [
      PATHS.credentials,
      PATHS.compatibility,
      PATHS.anonymousId,
      'cordis.patch.yml',
    ]
    for (const file of filesToMigrate) {
      const src = join(legacyDir, file)
      const dest = join(newDir, file)
      if (existsSync(src)) {
        copyFileSync(src, dest)
      }
    }
    // Copy sessions directory if exists
    const legacySessions = join(legacyDir, PATHS.sessions)
    const newSessions = join(newDir, PATHS.sessions)
    if (existsSync(legacySessions)) {
      // Recursive copy
      const { cpSync } = await import('node:fs')
      cpSync(legacySessions, newSessions, { recursive: true })
    }
    // Copy storages directory if exists
    const legacyStorages = join(legacyDir, PATHS.storages)
    const newStorages = join(newDir, PATHS.storages)
    if (existsSync(legacyStorages)) {
      const { cpSync } = await import('node:fs')
      cpSync(legacyStorages, newStorages, { recursive: true })
    }
  } catch (error) {
    console.warn('[ParsCode] Failed to migrate legacy config:', error)
  }
}

/** Branded type for ParsCode-specific IDs */
export type ParsCodeId<B extends string> = Branded<B, 'parscode'>

/** Create a ParsCode-branded ID */
export function createParsCodeId<B extends string>(value: B): ParsCodeId<B> {
  return value as ParsCodeId<B>
}