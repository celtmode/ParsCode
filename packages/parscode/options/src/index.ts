/**
 * ParsCode Options - Host Entry
 * Comprehensive settings schemas, validation, and configuration management
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import {
  PRODUCT_NAME,
  ENV_VARS,
  PATHS,
  getHomeDir,
  BRAND_COLORS,
  THEME_VARIANTS,
} from '@parscode/brand'

// ============================================================================
// Settings Schemas (Zod)
// ============================================================================

/** Models & Providers Settings */
export const ModelsSchema = z.object({
  /** Active provider ID */
  activeProvider: z.string().default('deepseek-official').volatile(),
  /** Provider configurations */
  providers: z.record(z.object({
    name: z.string(),
    baseUrl: z.string().url().optional(),
    apiKeyRef: z.string().optional(), // Credential reference
    models: z.array(z.object({
      id: z.string(),
      name: z.string(),
      contextWindow: z.number().optional(),
      maxOutput: z.number().optional(),
      supportsReasoning: z.boolean().default(false),
      supportsVision: z.boolean().default(false),
      supportsTools: z.boolean().default(true),
    })).default([]),
    enabled: z.boolean().default(true),
  })).default({}).volatile(),
  /** Per-task model routing */
  taskRouting: z.record(z.object({
    provider: z.string(),
    model: z.string(),
    fallback: z.array(z.object({
      provider: z.string(),
      model: z.string(),
    })).default([]),
  })).default({}).volatile(),
  /** Default parameters */
  defaults: z.object({
    temperature: z.number().min(0).max(2).step(0.1).default(0.7).volatile(),
    maxTokens: z.number().min(1).max(100000).step(1).default(4096).volatile(),
    reasoningEffort: z.union([z.literal('low'), z.literal('medium'), z.literal('high')]).default('medium').volatile(),
    topP: z.number().min(0).max(1).step(0.05).default(1).volatile(),
  }).volatile(),
  /** Usage tracking */
  usage: z.object({
    enabled: z.boolean().default(true).volatile(),
    dailyBudget: z.number().min(0).default(0).volatile(), // 0 = unlimited
    monthlyBudget: z.number().min(0).default(0).volatile(),
    alertThreshold: z.number().min(0).max(1).default(0.8).volatile(),
    costPer1kTokens: z.record(z.object({
      input: z.number().default(0),
      output: z.number().default(0),
    })).default({}).volatile(),
  }).volatile(),
})

/** Agent Behavior Settings */
export const AgentSchema = z.object({
  /** Permission mode */
  permissionMode: z.union([
    z.literal('ask'),
    z.literal('auto-edit'),
    z.literal('plan-only'),
    z.literal('full-auto'),
  ]).default('ask').volatile(),
  /** Per-tool allow/deny lists */
  toolPermissions: z.object({
    allow: z.array(z.string()).default([]).volatile(),
    deny: z.array(z.string()).default([]).volatile(),
  }).volatile(),
  /** Plan mode */
  planMode: z.object({
    enabled: z.boolean().default(false).volatile(),
    autoExit: z.boolean().default(false).volatile(),
  }).volatile(),
  /** Checkpoints */
  checkpoints: z.object({
    enabled: z.boolean().default(true).volatile(),
    maxHistory: z.number().min(10).max(1000).default(50).volatile(),
    autoSave: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Auto-compact */
  autoCompact: z.object({
    enabled: z.boolean().default(true).volatile(),
    threshold: z.number().min(0.1).max(1).default(0.8).volatile(),
    keepTurns: z.number().min(1).max(100).default(10).volatile(),
  }).volatile(),
  /** Subagents */
  subagents: z.object({
    enabled: z.boolean().default(true).volatile(),
    maxConcurrent: z.number().min(1).max(10).default(3).volatile(),
    defaultProvider: z.string().default('spawn').volatile(),
  }).volatile(),
  /** Custom agents */
  customAgents: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    systemPrompt: z.string(),
    tools: z.array(z.string()).default([]),
    model: z.string().optional(),
  })).default([]).volatile(),
  /** Slash commands */
  slashCommands: z.array(z.object({
    name: z.string(),
    description: z.string(),
    command: z.string(),
  })).default([]).volatile(),
  /** Hooks */
  hooks: z.object({
    preTool: z.array(z.string()).default([]).volatile(),
    postTool: z.array(z.string()).default([]).volatile(),
    preStep: z.array(z.string()).default([]).volatile(),
    postStep: z.array(z.string()).default([]).volatile(),
  }).volatile(),
  /** MCP servers */
  mcpServers: z.array(z.object({
    name: z.string(),
    command: z.string(),
    args: z.array(z.string()).default([]),
    env: z.record(z.string()).default({}),
    enabled: z.boolean().default(true),
  })).default([]).volatile(),
  /** Project memory */
  projectMemory: z.object({
    enabled: z.boolean().default(true).volatile(),
    fileName: z.string().default('PARSCODE.md').volatile(),
    autoLoad: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Skills */
  skills: z.array(z.object({
    name: z.string(),
    enabled: z.boolean().default(true),
    config: z.record(z.unknown()).default({}),
  })).default([]).volatile(),
})

/** Workspace Settings */
export const WorkspaceSchema = z.object({
  /** File tree */
  fileTree: z.object({
    showHidden: z.boolean().default(false).volatile(),
    showGitIgnored: z.boolean().default(false).volatile(),
    followSymlinks: z.boolean().default(true).volatile(),
    maxDepth: z.number().min(1).max(20).default(10).volatile(),
  }).volatile(),
  /** Diff viewer */
  diffViewer: z.object({
    inline: z.boolean().default(true).volatile(),
    wordWrap: z.boolean().default(false).volatile(),
    showLineNumbers: z.boolean().default(true).volatile(),
    contextLines: z.number().min(0).max(50).default(3).volatile(),
  }).volatile(),
  /** Multi-session tabs */
  tabs: z.object({
    enabled: z.boolean().default(true).volatile(),
    maxTabs: z.number().min(1).max(50).default(20).volatile(),
    persistSession: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Session management */
  sessions: z.object({
    searchEnabled: z.boolean().default(true).volatile(),
    pinEnabled: z.boolean().default(true).volatile(),
    archiveAfterDays: z.number().min(1).max(365).default(30).volatile(),
    exportFormats: z.array(z.union([z.literal('markdown'), z.literal('json')])).default(['markdown', 'json']).volatile(),
  }).volatile(),
  /** Git panel */
  git: z.object({
    enabled: z.boolean().default(true).volatile(),
    autoFetch: z.boolean().default(true).volatile(),
    fetchInterval: z.number().min(10).max(3600).default(60).volatile(),
    showStash: z.boolean().default(true).volatile(),
    worktreeSupport: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Integrated terminal */
  terminal: z.object({
    shell: z.string().default('auto').volatile(), // auto, bash, zsh, pwsh, cmd
    fontSize: z.number().min(8).max(24).default(13).volatile(),
    fontFamily: z.string().default('').volatile(),
    cursorBlink: z.boolean().default(true).volatile(),
    scrollback: z.number().min(100).max(100000).default(10000).volatile(),
  }).volatile(),
  /** Prompt library */
  promptLibrary: z.object({
    enabled: z.boolean().default(true).volatile(),
    categories: z.array(z.string()).default([]).volatile(),
    snippets: z.array(z.object({
      name: z.string(),
      prefix: z.string(),
      content: z.string(),
      description: z.string(),
    })).default([]).volatile(),
  }).volatile(),
  /** Quick open */
  quickOpen: z.object({
    enabled: z.boolean().default(true).volatile(),
    maxResults: z.number().min(10).max(200).default(50).volatile(),
    includeHistory: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Command palette */
  commandPalette: z.object({
    enabled: z.boolean().default(true).volatile(),
    customCommands: z.array(z.object({
      id: z.string(),
      label: z.string(),
      command: z.string(),
      category: z.string(),
    })).default([]).volatile(),
  }).volatile(),
  /** Keybindings */
  keybindings: z.object({
    preset: z.union([z.literal('vscode'), z.literal('vim'), z.literal('emacs'), z.literal('custom')]).default('vscode').volatile(),
    custom: z.record(z.string()).default({}).volatile(),
  }).volatile(),
})

/** UX Settings */
export const UxSchema = z.object({
  /** Language */
  language: z.union([z.literal('en'), z.literal('zh'), z.literal('fa')]).default('en').volatile(),
  /** RTL support */
  rtl: z.boolean().default(false).volatile(),
  /** Calendar */
  calendar: z.union([z.literal('gregorian'), z.literal('jalali')]).default('gregorian').volatile(),
  /** Notifications */
  notifications: z.object({
    enabled: z.boolean().default(true).volatile(),
    sounds: z.boolean().default(false).volatile(),
    soundVolume: z.number().min(0).max(1).step(0.1).default(0.5).volatile(),
    duration: z.number().min(1000).max(30000).default(5000).volatile(),
    position: z.union([z.literal('top-right'), z.literal('top-left'), z.literal('bottom-right'), z.literal('bottom-left')]).default('top-right').volatile(),
  }).volatile(),
  /** Onboarding */
  onboarding: z.object({
    showWelcome: z.boolean().default(true).volatile(),
    showTips: z.boolean().default(true).volatile(),
    tipFrequency: z.union([z.literal('daily'), z.literal('weekly'), z.literal('never')]).default('weekly').volatile(),
  }).volatile(),
  /** Welcome screen */
  welcomeScreen: z.object({
    animated: z.boolean().default(true).volatile(),
    showChangelog: z.boolean().default(true).volatile(),
    showTips: z.boolean().default(true).volatile(),
    background: z.union([z.literal('solid'), z.literal('aurora'), z.literal('particles')]).default('aurora').volatile(),
  }).volatile(),
})

/** System Settings */
export const SystemSchema = z.object({
  /** Updates */
  updates: z.object({
    channel: z.union([z.literal('stable'), z.literal('beta'), z.literal('alpha')]).default('stable').volatile(),
    autoCheck: z.boolean().default(true).volatile(),
    checkInterval: z.number().min(1).max(168).default(24).volatile(), // hours
    autoDownload: z.boolean().default(false).volatile(),
    autoInstall: z.boolean().default(false).volatile(),
  }).volatile(),
  /** Proxy */
  proxy: z.object({
    enabled: z.boolean().default(false).volatile(),
    url: z.string().url().optional().volatile(),
    bypass: z.array(z.string()).default([]).volatile(),
    auth: z.object({
      username: z.string().optional(),
      password: z.string().optional(),
    }).optional().volatile(),
  }).volatile(),
  /** Network diagnostics */
  network: z.object({
    enabled: z.boolean().default(true).volatile(),
    timeout: z.number().min(1000).max(60000).default(10000).volatile(),
    testUrls: z.array(z.string().url()).default(['https://api.github.com', 'https://registry.npmjs.org']).volatile(),
  }).volatile(),
  /** Logs */
  logs: z.object({
    level: z.union([z.literal('debug'), z.literal('info'), z.literal('warn'), z.literal('error')]).default('info').volatile(),
    maxFiles: z.number().min(1).max(100).default(10).volatile(),
    maxSize: z.number().min(1).max(1000).default(50).volatile(), // MB
    includeTimestamps: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Crash reporter */
  crashReporter: z.object({
    enabled: z.boolean().default(false).volatile(),
    endpoint: z.string().url().optional().volatile(),
    includeSystemInfo: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Data directory */
  dataDir: z.object({
    path: z.string().default('').volatile(), // empty = default
    maxSize: z.number().min(100).max(100000).default(5000).volatile(), // MB
    autoCleanup: z.boolean().default(true).volatile(),
  }).volatile(),
  /** Telemetry */
  telemetry: z.object({
    enabled: z.boolean().default(false).volatile(),
    endpoint: z.string().url().optional().volatile(),
    anonymousId: z.string().optional().volatile(),
  }).volatile(),
  /** Launch on startup */
  launchOnStartup: z.boolean().default(false).volatile(),
  /** Tray icon */
  trayIcon: z.object({
    enabled: z.boolean().default(true).volatile(),
    minimizeToTray: z.boolean().default(true).volatile(),
    closeToTray: z.boolean().default(false).volatile(),
  }).volatile(),
})

/** Theme Settings (from parscode-theme) */
export const ThemeSchema = z.object({
  variant: z.union([z.literal('dark'), z.literal('gold-light')]).default('dark').volatile(),
  glowStrength: z.number().min(0).max(1).step(0.1).default(1).volatile(),
  animationSpeed: z.number().min(0.5).max(2).step(0.1).default(1).volatile(),
  accentIntensity: z.number().min(0.5).max(1.5).step(0.1).default(1).volatile(),
  fontSize: z.number().min(10).max(24).step(1).default(14).volatile(),
  density: z.union([z.literal('compact'), z.literal('normal'), z.literal('spacious')]).default('normal').volatile(),
  backgroundStyle: z.union([z.literal('solid'), z.literal('aurora'), z.literal('particles')]).default('solid').volatile(),
  reduceMotion: z.boolean().default(false).volatile(),
})

/** Marketplace Settings (from parscode-marketplace) */
export const MarketplaceSchema = z.object({
  registries: z.array(z.object({
    url: z.string().url(),
    apiKey: z.string().optional(),
    name: z.string(),
  })).min(1).default([
    { url: 'https://celtmode.github.io/ParsCode-registry/v1', name: 'ParsCode Official' },
  ]).volatile(),
  defaultRegistry: z.number().int().min(0).default(0).volatile(),
  autoUpdate: z.boolean().default(false).volatile(),
  autoInstall: z.boolean().default(false).volatile(),
  verifySignatures: z.boolean().default(true).volatile(),
  allowUnsigned: z.boolean().default(false).volatile(),
  cacheTtl: z.number().int().min(1).default(60).volatile(),
  proxy: z.string().url().optional().volatile(),
})

/** Complete Settings Schema */
export const SettingsSchema = z.object({
  models: ModelsSchema,
  agent: AgentSchema,
  workspace: WorkspaceSchema,
  ux: UxSchema,
  system: SystemSchema,
  theme: ThemeSchema,
  marketplace: MarketplaceSchema,
})

export type Settings = z.infer<typeof SettingsSchema>
export type ModelsSettings = z.infer<typeof ModelsSchema>
export type AgentSettings = z.infer<typeof AgentSchema>
export type WorkspaceSettings = z.infer<typeof WorkspaceSchema>
export type UxSettings = z.infer<typeof UxSchema>
export type SystemSettings = z.infer<typeof SystemSchema>
export type ThemeSettings = z.infer<typeof ThemeSchema>
export type MarketplaceSettings = z.infer<typeof MarketplaceSchema>

// ============================================================================
// Settings Categories for UI
// ============================================================================

export interface SettingsCategory {
  id: string
  name: string
  description: string
  icon: string
  order: number
  schema: z.ZodTypeAny
  namespace: string
}

export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: 'models',
    name: 'Models & Providers',
    description: 'Configure AI model providers, API keys, routing, and usage tracking',
    icon: 'model',
    order: 1,
    schema: ModelsSchema,
    namespace: 'models',
  },
  {
    id: 'agent',
    name: 'Agent Behavior',
    description: 'Permission modes, tool access, checkpoints, subagents, and hooks',
    icon: 'bot',
    order: 2,
    schema: AgentSchema,
    namespace: 'agent',
  },
  {
    id: 'workspace',
    name: 'Workspace',
    description: 'File tree, diff viewer, sessions, git, terminal, and productivity tools',
    icon: 'folder',
    order: 3,
    schema: WorkspaceSchema,
    namespace: 'workspace',
  },
  {
    id: 'ux',
    name: 'User Experience',
    description: 'Language, RTL, calendar, notifications, onboarding, and welcome screen',
    icon: 'user',
    order: 4,
    schema: UxSchema,
    namespace: 'ux',
  },
  {
    id: 'theme',
    name: 'Theme & Appearance',
    description: 'Color scheme, animations, fonts, density, and background effects',
    icon: 'palette',
    order: 5,
    schema: ThemeSchema,
    namespace: 'theme',
  },
  {
    id: 'marketplace',
    name: 'Plugin Marketplace',
    description: 'Registry sources, auto-install, signature verification, and cache',
    icon: 'store',
    order: 6,
    schema: MarketplaceSchema,
    namespace: 'marketplace',
  },
  {
    id: 'system',
    name: 'System',
    description: 'Updates, proxy, network, logs, crash reports, data, and telemetry',
    icon: 'settings',
    order: 7,
    schema: SystemSchema,
    namespace: 'system',
  },
]

// ============================================================================
// Settings Service
// ============================================================================

export interface Config {
  /** Settings schema validation */
  validate: boolean
  /** Auto-save on change */
  autoSave: boolean
  /** Backup on change */
  backup: boolean
  /** Max backups to keep */
  maxBackups: number
}

export const DEFAULT_CONFIG: Required<Config> = {
  validate: true,
  autoSave: true,
  backup: true,
  maxBackups: 10,
}

export const Config = z.object({
  validate: z.boolean().default(DEFAULT_CONFIG.validate).volatile(),
  autoSave: z.boolean().default(DEFAULT_CONFIG.autoSave).volatile(),
  backup: z.boolean().default(DEFAULT_CONFIG.backup).volatile(),
  maxBackups: z.number().int().min(1).max(100).default(DEFAULT_CONFIG.maxBackups).volatile(),
})

export class OptionsService {
  private readonly ctx: Context
  private readonly config: Config
  private readonly backups: Map<string, unknown[]> = new Map()

  constructor(ctx: Context, config: Config) {
    this.ctx = ctx
    this.config = config
  }

  /** Validate settings against schema */
  validate(settings: unknown): { valid: boolean; errors: z.ZodIssue[] } {
    const result = SettingsSchema.safeParse(settings)
    return {
      valid: result.success,
      errors: result.success ? [] : result.error.issues,
    }
  }

  /** Get default settings */
  getDefaults(): Settings {
    return SettingsSchema.parse({})
  }

  /** Export all settings as JSON */
  exportSettings(settings: Settings): string {
    return JSON.stringify(settings, null, 2)
  }

  /** Import settings from JSON */
  importSettings(json: string): { success: boolean; settings?: Settings; error?: string } {
    try {
      const parsed = JSON.parse(json)
      const result = SettingsSchema.safeParse(parsed)
      if (!result.success) {
        return { success: false, error: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') }
      }
      return { success: true, settings: result.data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  }

  /** Create backup */
  createBackup(namespace: string, settings: unknown): void {
    if (!this.config.backup.get()) return
    const key = `${namespace}.backup`
    const list = this.backups.get(key) ?? []
    list.unshift({ timestamp: Date.now(), data: settings })
    if (list.length > this.config.maxBackups.get()) list.pop()
    this.backups.set(key, list)
  }

  /** Get backups */
  getBackups(namespace: string): Array<{ timestamp: number; data: unknown }> {
    return this.backups.get(`${namespace}.backup`) ?? []
  }

  /** Restore backup */
  restoreBackup(namespace: string, index: number): unknown | null {
    const list = this.backups.get(`${namespace}.backup`)
    if (!list || index >= list.length) return null
    return list[index].data
  }

  /** Reset namespace to defaults */
  resetNamespace(namespace: string): Partial<Settings> {
    const defaults = this.getDefaults()
    const category = SETTINGS_CATEGORIES.find(c => c.namespace === namespace)
    if (!category) return {}
    return { [namespace]: (defaults as any)[namespace] }
  }

  /** Migrate legacy DSH settings */
  async migrateLegacySettings(): Promise<void> {
    const { existsSync, readFileSync, writeFileSync } = await import('node:fs')
    const { join } = await import('node:path')

    const legacyDir = join(getHomeDir().replace('.parscode', '.dsh'))
    const newDir = getHomeDir()

    if (!existsSync(legacyDir)) return

    // Migrate cordis.patch.yml settings
    const legacyPatch = join(legacyDir, 'cordis.patch.yml')
    const newPatch = join(newDir, 'cordis.patch.yml')

    if (existsSync(legacyPatch) && !existsSync(newPatch)) {
      const content = readFileSync(legacyPatch, 'utf8')
      // Replace DSH_ env vars with PARSCODE_ equivalents
      const migrated = content
        .replace(/DSH_HOME/g, 'PARSCODE_HOME')
        .replace(/DSH_TELEMETRY/g, 'PARSCODE_TELEMETRY')
        .replace(/DSH_PERMISSION/g, 'PARSCODE_PERMISSION')
        .replace(/DSH_LOG/g, 'PARSCODE_LOG')
        .replace(/DEEPSEEK_API_KEY/g, 'PARSCODE_API_KEY')
        .replace(/DEEPSEEK_BASE_URL/g, 'PARSCODE_BASE_URL')
      writeFileSync(newPatch, migrated)
    }
  }
}

// ============================================================================
// Host Plugin Registration
// ============================================================================

export function apply(ctx: Context, config: Config): void {
  const service = new OptionsService(ctx, config)

  // Migrate legacy settings on startup
  ctx.effect(async () => {
    await service.migrateLegacySettings()
  }, 'parscode-options: migrate legacy')

  // Provide service
  ctx.provide('parscodeOptions', service)

  // Register settings schemas for config-editor
  ctx.provide('parscodeOptionsSchemas', {
    SettingsSchema,
    ModelsSchema,
    AgentSchema,
    WorkspaceSchema,
    UxSchema,
    SystemSchema,
    ThemeSchema,
    MarketplaceSchema,
    SETTINGS_CATEGORIES,
  })

  // Extend config-editor with our schemas
  ctx.on('config-editor/register-schemas', (schemas) => {
    schemas.push(
      { namespace: 'models', schema: ModelsSchema, title: 'Models & Providers' },
      { namespace: 'agent', schema: AgentSchema, title: 'Agent Behavior' },
      { namespace: 'workspace', schema: WorkspaceSchema, title: 'Workspace' },
      { namespace: 'ux', schema: UxSchema, title: 'User Experience' },
      { namespace: 'theme', schema: ThemeSchema, title: 'Theme & Appearance' },
      { namespace: 'marketplace', schema: MarketplaceSchema, title: 'Plugin Marketplace' },
      { namespace: 'system', schema: SystemSchema, title: 'System' },
    )
  })
}

// Re-export types and schemas
export {
  SettingsSchema,
  ModelsSchema,
  AgentSchema,
  WorkspaceSchema,
  UxSchema,
  SystemSchema,
  ThemeSchema,
  MarketplaceSchema,
  SETTINGS_CATEGORIES,
  type Settings,
  type ModelsSettings,
  type AgentSettings,
  type WorkspaceSettings,
  type UxSettings,
  type SystemSettings,
  type ThemeSettings,
  type MarketplaceSettings,
  type SettingsCategory,
}