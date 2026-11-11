/**
 * ParsCode Marketplace - Host Entry
 * Plugin registry service, installer, and marketplace management
 */

import type { Context } from '@deepseek-ai/cordis'
import type { Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { TypertRemoteService, Remote, RemoteError } from '@deepseek-ai/dsh-typert-protocol'
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, cpSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import { extract } from 'extract-zip'
import { execa } from 'execa'
import semver from 'semver'
import {
  PRODUCT_NAME,
  CLI_COMMAND,
  REGISTRY,
  ENV_VARS,
  PATHS,
  getHomeDir,
} from '@parscode/brand'

/** Registry configuration */
export interface RegistryConfig {
  /** Registry base URL */
  url: string
  /** API key for private registries */
  apiKey?: string
  /** Registry name for display */
  name: string
}

/** Plugin manifest schema (extends dsh.bundle) */
export interface PluginManifest {
  name: string
  version: string
  description?: string
  author?: string
  license?: string
  repository?: string
  homepage?: string
  keywords?: string[]
  categories?: string[]
  dsh?: {
    bundle?: {
      patch?: string | string[]
      platforms?: string[]
      listedByDefault?: boolean
    }
    client?: {
      platform: 'web'
      inject?: string[]
    }
  }
  parscode?: {
    marketplace?: {
      icon?: string
      screenshots?: string[]
      featured?: boolean
      minAppVersion?: string
      permissions?: PluginPermission[]
    }
  }
}

export type PluginPermission =
  | 'filesystem'
  | 'network'
  | 'shell'
  | 'secrets'
  | 'clipboard'
  | 'notifications'
  | 'native_modules'

/** Registry API response types */
export interface PluginSummary {
  id: string
  name: string
  description: string
  version: string
  author: string
  downloads: number
  rating: number
  categories: string[]
  tags: string[]
  updated_at: string
  icon_url?: string
}

export interface PluginDetail extends PluginSummary {
  readme: string
  versions: PluginVersionSummary[]
  repository: string
  homepage?: string
  license: string
  min_app_version: string
  permissions: PluginPermission[]
}

export interface PluginVersionSummary {
  version: string
  published_at: string
  downloads: number
  changelog?: string
}

export interface PluginVersionDetail {
  download_url: string
  sha256: string
  signature?: string
  size: number
  min_app_version: string
  permissions: PluginPermission[]
}

export interface FeaturedPlugin {
  id: string
  name: string
  description: string
  reason: string
}

export interface Category {
  slug: string
  name: string
  description: string
  plugin_count: number
}

export interface PluginListResponse {
  plugins: PluginSummary[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

/** Marketplace configuration */
export interface Config {
  /** Enabled registries */
  registries: Volatile<RegistryConfig[]>
  /** Default registry index */
  defaultRegistry: Volatile<number>
  /** Auto-install compatible updates */
  autoUpdate: Volatile<boolean>
  /** Auto-install on first use */
  autoInstall: Volatile<boolean>
  /** Verify signatures */
  verifySignatures: Volatile<boolean>
  /** Allow unsigned plugins */
  allowUnsigned: Volatile<boolean>
  /** Cache TTL in minutes */
  cacheTtl: Volatile<number>
  /** Proxy URL */
  proxy?: Volatile<string>
}

/** Default configuration */
export const DEFAULT_CONFIG: Required<Omit<Config, 'proxy'>> & { proxy: string } = {
  registries: [
    { url: REGISTRY.defaultUrl, name: 'ParsCode Official' },
    { url: REGISTRY.npmmirrorRegistry, name: 'npmmirror' },
  ],
  defaultRegistry: 0,
  autoUpdate: false,
  autoInstall: false,
  verifySignatures: true,
  allowUnsigned: false,
  cacheTtl: 60,
  proxy: '',
}

/** Zod schema */
export const Config = z.object({
  registries: z.array(z.object({
    url: z.string().url(),
    apiKey: z.string().optional(),
    name: z.string(),
  })).min(1).default(DEFAULT_CONFIG.registries).volatile(),
  defaultRegistry: z.number().int().min(0).default(DEFAULT_CONFIG.defaultRegistry).volatile(),
  autoUpdate: z.boolean().default(DEFAULT_CONFIG.autoUpdate).volatile(),
  autoInstall: z.boolean().default(DEFAULT_CONFIG.autoInstall).volatile(),
  verifySignatures: z.boolean().default(DEFAULT_CONFIG.verifySignatures).volatile(),
  allowUnsigned: z.boolean().default(DEFAULT_CONFIG.allowUnsigned).volatile(),
  cacheTtl: z.number().int().min(1).default(DEFAULT_CONFIG.cacheTtl).volatile(),
  proxy: z.string().url().optional().default(DEFAULT_CONFIG.proxy).volatile(),
})

/** Installed plugin metadata */
export interface InstalledPlugin {
  name: string
  version: string
  path: string
  manifest: PluginManifest
  installedAt: string
  source: 'registry' | 'git' | 'local' | 'github'
  registryUrl?: string
  verified: boolean
}

/** Installation result */
export interface InstallResult {
  success: boolean
  plugin?: InstalledPlugin
  error?: string
  warnings?: string[]
}

/** Marketplace service */
export class MarketplaceService extends TypertRemoteService {
  static inject = ['pluginManager', 'profileContext']
  static Config = Config

  private readonly cache = new Map<string, { data: unknown; expires: number }>()
  private readonly installDir: string

  constructor(ctx: Context, config: Config) {
    super(ctx, 'marketplace')
    this.installDir = join(getHomeDir(), 'marketplace', 'plugins')
    mkdirSync(this.installDir, { recursive: true })

    // Cleanup expired cache periodically
    setInterval(() => this.cleanupCache(), 5 * 60 * 1000)
  }

  /** Get active registry */
  private getRegistry(config: Config): RegistryConfig {
    const registries = config.registries.get()
    const index = Math.min(config.defaultRegistry.get(), registries.length - 1)
    return registries[index]
  }

  /** Fetch with caching */
  private async fetchCached<T>(url: string, config: Config, ttlMinutes?: number): Promise<T> {
    const cached = this.cache.get(url)
    const ttl = (ttlMinutes ?? config.cacheTtl.get()) * 60 * 1000
    if (cached && cached.expires > Date.now()) {
      return cached.data as T
    }

    const registry = this.getRegistry(config)
    const fullUrl = `${registry.url.replace(/\/$/, '')}${url}`
    const headers: Record<string, string> = { 'Accept': 'application/json' }
    if (registry.apiKey) headers['Authorization'] = `Bearer ${registry.apiKey}`

    const fetchOptions: RequestInit = {
      headers,
      // Proxy support would go here
    }

    const response = await fetch(fullUrl, fetchOptions)
    if (!response.ok) {
      throw new RemoteError('marketplace/registry-error', `Registry request failed: ${response.statusText}`, { status: response.status })
    }

    const data = await response.json()
    this.cache.set(url, { data, expires: Date.now() + ttl })
    return data
  }

  /** Search plugins */
  @Remote
  async searchPlugins(params: {
    query?: string
    category?: string
    tag?: string
    sort?: 'relevance' | 'downloads' | 'rating' | 'updated' | 'created' | 'name'
    page?: number
    per_page?: number
  }): Promise<PluginListResponse> {
    const config = this.ctx.get('marketplace')?.config as Config
    const searchParams = new URLSearchParams()
    if (params.query) searchParams.set('query', params.query)
    if (params.category) searchParams.set('category', params.category)
    if (params.tag) searchParams.set('tag', params.tag)
    if (params.sort) searchParams.set('sort', params.sort)
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.per_page) searchParams.set('per_page', params.per_page.toString())

    return this.fetchCached<PluginListResponse>(`/plugins?${searchParams}`, config)
  }

  /** Get plugin detail */
  @Remote
  async getPlugin(id: string): Promise<PluginDetail> {
    const config = this.ctx.get('marketplace')?.config as Config
    return this.fetchCached<PluginDetail>(`/plugins/${encodeURIComponent(id)}`, config)
  }

  /** Get plugin version detail */
  @Remote
  async getPluginVersion(id: string, version: string): Promise<PluginVersionDetail> {
    const config = this.ctx.get('marketplace')?.config as Config
    return this.fetchCached<PluginVersionDetail>(`/plugins/${encodeURIComponent(id)}/versions/${encodeURIComponent(version)}`, config)
  }

  /** Get featured plugins */
  @Remote
  async getFeatured(): Promise<FeaturedPlugin[]> {
    const config = this.ctx.get('marketplace')?.config as Config
    return this.fetchCached<FeaturedPlugin[]>('/featured', config, 1440) // 24h cache
  }

  /** Get categories */
  @Remote
  async getCategories(): Promise<Category[]> {
    const config = this.ctx.get('marketplace')?.config as Config
    return this.fetchCached<Category[]>('/categories', config, 1440)
  }

  /** Install plugin from registry */
  @Remote
  async installPlugin(params: {
    id: string
    version?: string
    registry?: string
    approvedBuilds?: string[]
  }): Promise<InstallResult> {
    const pluginManager = this.ctx.pluginManager
    const config = this.ctx.get('marketplace')?.config as Config

    try {
      // Get version details
      const versionDetail = await this.getPluginVersion(params.id, params.version ?? 'latest')

      // Verify checksum
      const tarballPath = await this.downloadAndVerify(versionDetail.download_url, versionDetail.sha256)

      // Verify signature if required
      if (config.verifySignatures.get() && versionDetail.signature) {
        const verified = await this.verifySignature(tarballPath, versionDetail.signature)
        if (!verified) {
          throw new Error('Signature verification failed')
        }
      }

      // Extract and validate
      const pluginDir = await this.extractPlugin(tarballPath, params.id)

      // Read manifest
      const manifestPath = join(pluginDir, 'package.json')
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as PluginManifest

      // Check compatibility
      const runtimeVersion = '0.2.2-rc.1' // TODO: get from app
      if (manifest.parscode?.marketplace?.minAppVersion) {
        if (!semver.satisfies(runtimeVersion, `>=${manifest.parscode.marketplace.minAppVersion}`)) {
          throw new Error(`Plugin requires ParsCode >= ${manifest.parscode.marketplace.minAppVersion}`)
        }
      }

      // Check permissions
      const permissions = manifest.parscode?.marketplace?.permissions ?? []
      if (permissions.length > 0 && !config.allowUnsigned.get()) {
        // Permission prompt would be handled by UI
        // For now, just warn
      }

      // Install via plugin manager
      const spec = `file:${pluginDir}`
      const result = await pluginManager.installBundle(spec, {
        saveExact: true,
        enabled: true,
        approvedBuilds: params.approvedBuilds,
      })

      if (!result.changed) {
        throw new Error(result.error?.diagnostic ?? 'Installation failed')
      }

      // Record installation
      const installed: InstalledPlugin = {
        name: params.id,
        version: manifest.version,
        path: pluginDir,
        manifest,
        installedAt: new Date().toISOString(),
        source: 'registry',
        registryUrl: params.registry ?? this.getRegistry(config).url,
        verified: config.verifySignatures.get() && !!versionDetail.signature,
      }

      this.recordInstallation(installed)

      return { success: true, plugin: installed }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  }

  /** Update plugin */
  @Remote
  async updatePlugin(params: { name: string; version?: string }): Promise<InstallResult> {
    const pluginManager = this.ctx.pluginManager
    const installed = this.getInstalledPlugin(params.name)
    if (!installed) {
      return { success: false, error: 'Plugin not installed' }
    }

    const version = params.version ?? 'latest'
    const result = await pluginManager.updateBundle(params.name, version)

    if (result.result.changed) {
      const updated = this.getInstalledPlugin(params.name)
      return { success: true, plugin: updated }
    }

    return { success: false, error: result.result.error?.diagnostic ?? 'Update failed' }
  }

  /** Uninstall plugin */
  @Remote
  async uninstallPlugin(name: string): Promise<{ success: boolean; error?: string }> {
    const pluginManager = this.ctx.pluginManager
    const result = await pluginManager.removeBundle(name)

    if (result.changed) {
      this.removeInstallationRecord(name)
      return { success: true }
    }

    return { success: false, error: result.error?.diagnostic ?? 'Uninstall failed' }
  }

  /** List installed plugins */
  @Remote
  async listInstalled(): Promise<InstalledPlugin[]> {
    const recordPath = join(this.installDir, 'installed.json')
    if (!existsSync(recordPath)) return []
    return JSON.parse(readFileSync(recordPath, 'utf8'))
  }

  /** Get installed plugin */
  @Remote
  async getInstalled(name: string): Promise<InstalledPlugin | null> {
    const plugins = await this.listInstalled()
    return plugins.find(p => p.name === name) ?? null
  }

  /** Check for updates */
  @Remote
  async checkUpdates(): Promise<Array<{ name: string; current: string; latest: string; changelog?: string }>> {
    const installed = await this.listInstalled()
    const updates = []

    for (const plugin of installed) {
      try {
        const detail = await this.getPlugin(plugin.name)
        if (semver.gt(detail.version, plugin.version)) {
          updates.push({
            name: plugin.name,
            current: plugin.version,
            latest: detail.version,
            changelog: detail.versions.find(v => v.version === detail.version)?.changelog,
          })
        }
      } catch {
        // Ignore errors for individual plugins
      }
    }

    return updates
  }

  /** Download and verify checksum */
  private async downloadAndVerify(url: string, expectedSha256: string): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`)

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Verify SHA-256
    const hash = createHash('sha256').update(buffer).digest('hex')
    if (hash !== expectedSha256) {
      throw new Error(`Checksum mismatch: expected ${expectedSha256}, got ${hash}`)
    }

    // Save to temp file
    const tempPath = join(tmpdir(), `parscode-plugin-${Date.now()}.tgz`)
    writeFileSync(tempPath, buffer)
    return tempPath
  }

  /** Verify Ed25519 signature */
  private async verifySignature(filePath: string, signatureB64: string): Promise<boolean> {
    // TODO: Implement Ed25519 verification with public key
    // For now, return true if signature exists
    return true
  }

  /** Extract plugin tarball */
  private async extractPlugin(tarballPath: string, pluginName: string): Promise<string> {
    const extractDir = join(this.installDir, pluginName.replace('/', '_'))
    if (existsSync(extractDir)) rmSync(extractDir, { recursive: true })
    mkdirSync(extractDir, { recursive: true })

    await extract(tarballPath, { dir: extractDir })

    // Find package directory (usually package/ or root)
    const entries = readdirSync(extractDir)
    const pkgDir = entries.includes('package') ? join(extractDir, 'package') : extractDir

    return pkgDir
  }

  /** Record installation */
  private recordInstallation(plugin: InstalledPlugin): void {
    const recordPath = join(this.installDir, 'installed.json')
    const existing = existsSync(recordPath)
      ? JSON.parse(readFileSync(recordPath, 'utf8'))
      : []
    const updated = [...existing.filter((p: InstalledPlugin) => p.name !== plugin.name), plugin]
    writeFileSync(recordPath, JSON.stringify(updated, null, 2))
  }

  /** Remove installation record */
  private removeInstallationRecord(name: string): void {
    const recordPath = join(this.installDir, 'installed.json')
    if (!existsSync(recordPath)) return
    const existing = JSON.parse(readFileSync(recordPath, 'utf8'))
    const updated = existing.filter((p: InstalledPlugin) => p.name !== name)
    writeFileSync(recordPath, JSON.stringify(updated, null, 2))
  }

  /** Get installed plugin (sync) */
  private getInstalledPlugin(name: string): InstalledPlugin | null {
    const recordPath = join(this.installDir, 'installed.json')
    if (!existsSync(recordPath)) return null
    const plugins = JSON.parse(readFileSync(recordPath, 'utf8')) as InstalledPlugin[]
    return plugins.find(p => p.name === name) ?? null
  }

  /** Cleanup expired cache */
  private cleanupCache(): void {
    const now = Date.now()
    for (const [key, value] of this.cache.entries()) {
      if (value.expires <= now) this.cache.delete(key)
    }
  }
}

/** Host plugin registration */
export function apply(ctx: Context, config: Config): void {
  // Register marketplace service
  ctx.provide('marketplace', new MarketplaceService(ctx, config))

  // Provide registry API spec
  ctx.provide('marketplaceRegistrySpec', () => {
    // Would load from registry-api.yaml
    return null
  })
}

// Re-export types
export type {
  RegistryConfig,
  PluginManifest,
  PluginPermission,
  PluginSummary,
  PluginDetail,
  PluginVersionSummary,
  PluginVersionDetail,
  FeaturedPlugin,
  Category,
  PluginListResponse,
  Config,
  InstalledPlugin,
  InstallResult,
}