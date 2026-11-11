/**
 * ParsCode Marketplace - Client Entry
 * Marketplace UI components: search, plugin cards, detail drawer, management dashboard
 */

import type { Context } from '@deepseek-ai/cordis'
import { createElement, useState, useEffect, useCallback } from 'react'
import './styles.css'
import { FaravaharLogo } from '@parscode/theme/client'
import {
  PRODUCT_NAME,
  BRAND_COLORS,
} from '@parscode/brand'
import type {
  PluginSummary,
  PluginDetail,
  PluginVersionDetail,
  FeaturedPlugin,
  Category,
  PluginListResponse,
  InstalledPlugin,
  InstallResult,
} from '../index.ts'

/** Marketplace API client */
class MarketplaceApi {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
    })
    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  }

  async searchPlugins(params: {
    query?: string
    category?: string
    tag?: string
    sort?: string
    page?: number
    per_page?: number
  }): Promise<PluginListResponse> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value))
    })
    return this.request<PluginListResponse>(`/api/marketplace/plugins?${searchParams}`)
  }

  async getPlugin(id: string): Promise<PluginDetail> {
    return this.request<PluginDetail>(`/api/marketplace/plugins/${encodeURIComponent(id)}`)
  }

  async getPluginVersion(id: string, version: string): Promise<PluginVersionDetail> {
    return this.request<PluginVersionDetail>(`/api/marketplace/plugins/${encodeURIComponent(id)}/versions/${encodeURIComponent(version)}`)
  }

  async getFeatured(): Promise<FeaturedPlugin[]> {
    return this.request<FeaturedPlugin[]>('/api/marketplace/featured')
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/marketplace/categories')
  }

  async installPlugin(id: string, version?: string): Promise<InstallResult> {
    return this.request<InstallResult>('/api/marketplace/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, version }),
    })
  }

  async updatePlugin(name: string, version?: string): Promise<InstallResult> {
    return this.request<InstallResult>('/api/marketplace/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, version }),
    })
  }

  async uninstallPlugin(name: string): Promise<{ success: boolean; error?: string }> {
    return this.request('/api/marketplace/uninstall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
  }

  async listInstalled(): Promise<InstalledPlugin[]> {
    return this.request<InstalledPlugin[]>('/api/marketplace/installed')
  }

  async checkUpdates(): Promise<Array<{ name: string; current: string; latest: string; changelog?: string }>> {
    return this.request('/api/marketplace/updates')
  }
}

/** Plugin card component */
function PluginCard({
  plugin,
  onInstall,
  onClick,
  installed = false,
  updateAvailable = false,
  t,
}: {
  plugin: PluginSummary
  onInstall: (id: string) => void
  onClick: (plugin: PluginSummary) => void
  installed?: boolean
  updateAvailable?: boolean
  t: (key: string) => string
}) {
  return createElement('div', {
    className: `pc-plugin-card ${installed ? 'installed' : ''} ${updateAvailable ? 'update-available' : ''}`,
    onClick: () => onClick(plugin),
  }, [
    // Icon
    createElement('div', {
      key: 'icon',
      className: 'pc-plugin-card-icon',
      style: { background: plugin.icon_url ? `url(${plugin.icon_url}) center/cover` : 'linear-gradient(135deg, var(--pc-accent), var(--pc-accent-deep))' },
    }, plugin.icon_url ? null : createElement(FaravaharLogo, { key: 'logo', size: 32, variant: 'mark' })),

    // Content
    createElement('div', { key: 'content', className: 'pc-plugin-card-content' }, [
      createElement('div', { key: 'header', className: 'pc-plugin-card-header' }, [
        createElement('h4', { key: 'name', className: 'pc-plugin-card-name' }, plugin.name),
        createElement('span', { key: 'version', className: 'pc-plugin-card-version' }, `v${plugin.version}`),
      ]),
      createElement('p', { key: 'desc', className: 'pc-plugin-card-desc' }, plugin.description),
      createElement('div', { key: 'meta', className: 'pc-plugin-card-meta' }, [
        createElement('span', { key: 'author', className: 'pc-plugin-card-author' }, `${t('marketplace.by')} ${plugin.author}`),
        createElement('span', { key: 'downloads', className: 'pc-plugin-card-downloads' }, `${plugin.downloads.toLocaleString()} ${t('marketplace.downloads')}`),
        plugin.rating > 0 && createElement('span', { key: 'rating', className: 'pc-plugin-card-rating' }, `★ ${plugin.rating.toFixed(1)}`),
      ]),
      createElement('div', { key: 'tags', className: 'pc-plugin-card-tags' },
        [...plugin.categories.slice(0, 3), ...plugin.tags.slice(0, 2)].map(tag =>
          createElement('span', { key: tag, className: 'pc-tag' }, tag)
        )
      ),
    ]),

    // Action
    createElement('div', { key: 'action', className: 'pc-plugin-card-action' }, [
      installed ? (
        updateAvailable ? (
          createElement('button', {
            key: 'update',
            className: 'pc-button pc-button-primary pc-button-sm',
            onClick: e => { e.stopPropagation(); onInstall(plugin.id) },
          }, t('marketplace.update'))
        ) : (
          createElement('span', { key: 'installed', className: 'pc-plugin-installed' }, t('marketplace.installed'))
        )
      ) : (
        createElement('button', {
          key: 'install',
          className: 'pc-button pc-button-primary pc-button-sm',
          onClick: e => { e.stopPropagation(); onInstall(plugin.id) },
        }, t('marketplace.install'))
      ),
    ]),
  ])
}

/** Plugin detail drawer */
function PluginDetailDrawer({
  plugin,
  onClose,
  onInstall,
  onUpdate,
  onUninstall,
  installed = false,
  updateAvailable = false,
  t,
}: {
  plugin: PluginDetail | null
  onClose: () => void
  onInstall: (id: string, version?: string) => void
  onUpdate: (name: string, version?: string) => void
  onUninstall: (name: string) => void
  installed?: boolean
  updateAvailable?: boolean
  t: (key: string) => string
}) {
  if (!plugin) return null

  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'permissions'>('overview')
  const [selectedVersion, setSelectedVersion] = useState(plugin.version)

  return createElement('div', { className: 'pc-plugin-detail-drawer' }, [
    // Header
    createElement('div', { key: 'header', className: 'pc-detail-header' }, [
      createElement('div', { key: 'icon', className: 'pc-detail-icon' },
        plugin.icon_url ? createElement('img', { src: plugin.icon_url, alt: '', width: 64, height: 64 }) : createElement(FaravaharLogo, { size: 48 })
      ),
      createElement('div', { key: 'info', className: 'pc-detail-info' }, [
        createElement('h3', { key: 'name', className: 'pc-detail-name' }, plugin.name),
        createElement('span', { key: 'version', className: 'pc-detail-version' }, `v${plugin.version}`),
        createElement('p', { key: 'desc', className: 'pc-detail-desc' }, plugin.description),
        createElement('div', { key: 'meta', className: 'pc-detail-meta' }, [
          createElement('span', { key: 'author' }, `${t('marketplace.by')} ${plugin.author}`),
          createElement('span', { key: 'license' }, `${t('marketplace.license')}: ${plugin.license}`),
          createElement('span', { key: 'updated' }, `${t('marketplace.updated')}: ${new Date(plugin.updated_at).toLocaleDateString()}`),
        ]),
      ]),
      createElement('button', { key: 'close', className: 'pc-detail-close', onClick: onClose }, '×'),
    ]),

    // Tabs
    createElement('div', { key: 'tabs', className: 'pc-detail-tabs' }, [
      createElement('button', {
        key: 'overview',
        className: `pc-tab ${activeTab === 'overview' ? 'active' : ''}`,
        onClick: () => setActiveTab('overview'),
      }, t('marketplace.overview')),
      createElement('button', {
        key: 'versions',
        className: `pc-tab ${activeTab === 'versions' ? 'active' : ''}`,
        onClick: () => setActiveTab('versions'),
      }, t('marketplace.versions')),
      createElement('button', {
        key: 'permissions',
        className: `pc-tab ${activeTab === 'permissions' ? 'active' : ''}`,
        onClick: () => setActiveTab('permissions'),
      }, t('marketplace.permissions')),
    ]),

    // Tab content
    createElement('div', { key: 'content', className: 'pc-detail-content' }, [
      activeTab === 'overview' && createElement('div', { key: 'overview', className: 'pc-detail-pane' }, [
        createElement('div', { key: 'readme', className: 'pc-detail-readme', dangerouslySetInnerHTML: { __html: plugin.readme } }),
        plugin.repository && createElement('div', { key: 'links', className: 'pc-detail-links' }, [
          createElement('a', { key: 'repo', href: plugin.repository, target: '_blank', rel: 'noopener' }, t('marketplace.repository')),
          plugin.homepage && createElement('a', { key: 'home', href: plugin.homepage, target: '_blank', rel: 'noopener' }, t('marketplace.homepage')),
        ]),
      ]),

      activeTab === 'versions' && createElement('div', { key: 'versions', className: 'pc-detail-pane' }, [
        createElement('select', {
          key: 'version-select',
          className: 'pc-version-select',
          value: selectedVersion,
          onChange: e => setSelectedVersion(e.target.value),
        }, plugin.versions.map(v =>
          createElement('option', { key: v.version, value: v.version }, `v${v.version} ${v.published_at ? `(${new Date(v.published_at).toLocaleDateString()})` : ''}`)
        )),
        createElement('div', { key: 'changelog', className: 'pc-changelog', dangerouslySetInnerHTML: {
          __html: plugin.versions.find(v => v.version === selectedVersion)?.changelog ?? ''
        } }),
        createElement('div', { key: 'version-actions', className: 'pc-version-actions' }, [
          installed && selectedVersion === plugin.version ? (
            updateAvailable ? (
              createElement('button', {
                className: 'pc-button pc-button-primary',
                onClick: () => onUpdate(plugin.name, selectedVersion),
              }, t('marketplace.update'))
            ) : (
              createElement('span', { className: 'pc-current-version' }, t('marketplace.currentVersion'))
            )
          ) : (
            createElement('button', {
              className: 'pc-button pc-button-primary',
              onClick: () => onInstall(plugin.name, selectedVersion),
            }, t('marketplace.installVersion'))
          ),
        ]),
      ]),

      activeTab === 'permissions' && createElement('div', { key: 'permissions', className: 'pc-detail-pane' }, [
        plugin.permissions.length === 0 ? (
          createElement('p', { className: 'pc-no-permissions' }, t('marketplace.noPermissions'))
        ) : (
          createElement('ul', { className: 'pc-permissions-list' },
            plugin.permissions.map(p => createElement('li', { key: p.name, className: 'pc-permission-item' }, [
              createElement('span', { key: 'name', className: 'pc-permission-name' }, p.name),
              createElement('span', { key: 'desc', className: 'pc-permission-desc' }, p.description),
              p.required && createElement('span', { key: 'required', className: 'pc-permission-required' }, t('marketplace.required')),
            ]))
          )
        ),
      ]),
    ]),
  ])
}

/** Marketplace page */
function MarketplacePage({
  api,
  t,
}: {
  api: MarketplaceApi
  t: (key: string) => string
}) {
  const [plugins, setPlugins] = useState<PluginSummary[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<FeaturedPlugin[]>([])
  const [installed, setInstalled] = useState<InstalledPlugin[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [selectedPlugin, setSelectedPlugin] = useState<PluginDetail | null>(null)
  const [activeTab, setActiveTab] = useState<'discover' | 'installed' | 'updates'>('discover')

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const [cats, feat, inst] = await Promise.all([
          api.getCategories(),
          api.getFeatured(),
          api.listInstalled(),
        ])
        setCategories(cats)
        setFeatured(feat)
        setInstalled(inst)
        await loadPlugins()
      } catch (error) {
        console.error('Failed to load marketplace:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const loadPlugins = useCallback(async () => {
    try {
      const response = await api.searchPlugins({ query, category, sort, page, per_page: 50 })
      if (page === 1) {
        setPlugins(response.plugins)
      } else {
        setPlugins(prev => [...prev, ...response.plugins])
      }
    } catch (error) {
      console.error('Failed to load plugins:', error)
    }
  }, [api, query, category, sort, page])

  // Load plugins when filters change
  useEffect(() => {
    setPage(1)
    loadPlugins()
  }, [query, category, sort, loadPlugins])

  const handleInstall = async (id: string, version?: string) => {
    const result = await api.installPlugin(id, version)
    if (result.success) {
      setInstalled(prev => [...prev.filter(p => p.name !== id), result.plugin!])
      if (selectedPlugin?.id === id) setSelectedPlugin(null)
    } else {
      alert(`${t('marketplace.installFailed')}: ${result.error}`)
    }
  }

  const handleUpdate = async (name: string, version?: string) => {
    const result = await api.updatePlugin(name, version)
    if (result.success) {
      setInstalled(prev => prev.map(p => p.name === name ? result.plugin! : p))
    } else {
      alert(`${t('marketplace.updateFailed')}: ${result.error}`)
    }
  }

  const handleUninstall = async (name: string) => {
    if (!confirm(`${t('marketplace.confirmUninstall')} ${name}?`)) return
    const result = await api.uninstallPlugin(name)
    if (result.success) {
      setInstalled(prev => prev.filter(p => p.name !== name))
    } else {
      alert(`${t('marketplace.uninstallFailed')}: ${result.error}`)
    }
  }

  const handlePluginClick = async (plugin: PluginSummary) => {
    const detail = await api.getPlugin(plugin.id)
    setSelectedPlugin(detail)
  }

  if (loading) {
    return createElement('div', { className: 'pc-marketplace-loading' }, [
      createElement(FaravaharLogo, { key: 'logo', size: 48, animated: true }),
      createElement('p', { key: 'text' }, t('marketplace.loading')),
    ])
  }

  return createElement('div', { className: 'pc-marketplace' }, [
    // Header
    createElement('header', { key: 'header', className: 'pc-marketplace-header' }, [
      createElement('div', { key: 'brand', className: 'pc-marketplace-brand' }, [
        createElement(FaravaharLogo, { key: 'logo', size: 32, animated: true }),
        createElement('h1', { key: 'title' }, t('marketplace.title')),
      ]),
      createElement('div', { key: 'tabs', className: 'pc-marketplace-tabs' }, [
        createElement('button', {
          key: 'discover',
          className: `pc-marketplace-tab ${activeTab === 'discover' ? 'active' : ''}`,
          onClick: () => setActiveTab('discover'),
        }, t('marketplace.discover')),
        createElement('button', {
          key: 'installed',
          className: `pc-marketplace-tab ${activeTab === 'installed' ? 'active' : ''}`,
          onClick: () => setActiveTab('installed'),
        }, `${t('marketplace.installed')} (${installed.length})`),
        createElement('button', {
          key: 'updates',
          className: `pc-marketplace-tab ${activeTab === 'updates' ? 'active' : ''}`,
          onClick: () => setActiveTab('updates'),
        }, t('marketplace.updates')),
      ]),
    ]),

    // Content
    createElement('main', { key: 'main', className: 'pc-marketplace-main' }, [
      // Discover tab
      activeTab === 'discover' && createElement('div', { key: 'discover', className: 'pc-discover' }, [
        // Toolbar
        createElement('div', { key: 'toolbar', className: 'pc-discover-toolbar' }, [
          createElement('div', { key: 'search', className: 'pc-search' }, [
            createElement('input', {
              type: 'search',
              placeholder: t('marketplace.searchPlaceholder'),
              value: query,
              onChange: e => setQuery(e.target.value),
              className: 'pc-search-input',
            }),
            createElement('select', {
              key: 'category',
              value: category,
              onChange: e => setCategory(e.target.value),
              className: 'pc-category-select',
            }, [
              createElement('option', { key: 'all', value: '' }, t('marketplace.allCategories')),
              ...categories.map(c => createElement('option', { key: c.slug, value: c.slug }, `${c.name} (${c.plugin_count})`)),
            ]),
            createElement('select', {
              key: 'sort',
              value: sort,
              onChange: e => setSort(e.target.value),
              className: 'pc-sort-select',
            }, [
              createElement('option', { value: 'relevance' }, t('marketplace.sort.relevance')),
              createElement('option', { value: 'downloads' }, t('marketplace.sort.downloads')),
              createElement('option', { value: 'rating' }, t('marketplace.sort.rating')),
              createElement('option', { value: 'updated' }, t('marketplace.sort.updated')),
              createElement('option', { value: 'name' }, t('marketplace.sort.name')),
            ]),
          ]),
        ]),

        // Featured section
        featured.length > 0 && createElement('section', { key: 'featured', className: 'pc-featured-section' }, [
          createElement('h2', { key: 'title', className: 'pc-section-title' }, t('marketplace.featured')),
          createElement('div', { key: 'grid', className: 'pc-featured-grid' },
            featured.map(f => createElement('div', { key: f.id, className: 'pc-featured-card' }, [
              createElement('h4', { key: 'name' }, f.name),
              createElement('p', { key: 'desc' }, f.description),
              createElement('span', { key: 'reason', className: 'pc-featured-reason' }, f.reason),
            ]))
          ),
        ]),

        // Plugin grid
        createElement('div', { key: 'grid', className: 'pc-plugin-grid' },
          plugins.map(plugin => {
            const isInstalled = installed.some(p => p.name === plugin.id)
            const hasUpdate = isInstalled && semver.gt(plugin.version, installed.find(p => p.name === plugin.id)!.version)
            return createElement(PluginCard, {
              key: plugin.id,
              plugin,
              onInstall: handleInstall,
              onClick: handlePluginClick,
              installed: isInstalled,
              updateAvailable: hasUpdate,
              t,
            })
          })
        ),

        // Load more
        plugins.length > 0 && createElement('button', {
          key: 'load-more',
          className: 'pc-load-more',
          onClick: () => setPage(p => p + 1),
        }, t('marketplace.loadMore')),

        // Empty state
        plugins.length === 0 && !loading && createElement('div', { key: 'empty', className: 'pc-empty-state' }, [
          createElement(FaravaharLogo, { key: 'logo', size: 64, variant: 'mono' }),
          createElement('h3', { key: 'title' }, t('marketplace.noResults')),
          createElement('p', { key: 'desc' }, t('marketplace.noResultsDesc')),
        ]),
      ]),

      // Installed tab
      activeTab === 'installed' && createElement('div', { key: 'installed', className: 'pc-installed' }, [
        installed.length === 0 ? (
          createElement('div', { className: 'pc-empty-state' }, [
            createElement(FaravaharLogo, { size: 64, variant: 'mono' }),
            createElement('h3', null, t('marketplace.noInstalled')),
            createElement('p', null, t('marketplace.noInstalledDesc')),
          ])
        ) : (
          createElement('div', { className: 'pc-installed-list' },
            installed.map(plugin => createElement('div', { key: plugin.name, className: 'pc-installed-item' }, [
              createElement('div', { className: 'pc-installed-info' }, [
                createElement('h4', null, `${plugin.name} ${plugin.manifest.parscode?.marketplace?.icon ? '' : ''}`),
                createElement('span', { className: 'pc-installed-version' }, `v${plugin.version}`),
              ]),
              createElement('div', { className: 'pc-installed-actions' }, [
                createElement('button', {
                  className: 'pc-button pc-button-secondary pc-button-sm',
                  onClick: () => handleUninstall(plugin.name),
                }, t('marketplace.uninstall')),
              ]),
            ]))
          )
        ),
      ]),

      // Updates tab
      activeTab === 'updates' && createElement('div', { key: 'updates', className: 'pc-updates' }, [
        createElement('button', {
          key: 'check',
          className: 'pc-check-updates',
          onClick: async () => {
            const updates = await api.checkUpdates()
            // Would show update notifications
          },
        }, t('marketplace.checkUpdates')),
        // Updates list would go here
      ]),
    ]),

    // Detail drawer
    selectedPlugin && createElement(PluginDetailDrawer, {
      key: 'drawer',
      plugin: selectedPlugin,
      onClose: () => setSelectedPlugin(null),
      onInstall: handleInstall,
      onUpdate: handleUpdate,
      onUninstall: handleUninstall,
      installed: installed.some(p => p.name === selectedPlugin.id),
      updateAvailable: installed.some(p => p.name === selectedPlugin.id) && semver.gt(selectedPlugin.version, installed.find(p => p.name === selectedPlugin.id)!.version),
      t,
    }),
  ])
}

/** Settings integration */
function MarketplaceSettings({
  config,
  t,
}: {
  config: any
  t: (key: string) => string
}) {
  return createElement('div', { className: 'pc-marketplace-settings' }, [
    createElement('h3', { className: 'pc-section-title' }, t('marketplace.settingsTitle')),
    createElement('p', { className: 'pc-section-desc' }, t('marketplace.settingsDesc')),

    // Registry URL
    createElement('div', { className: 'pc-setting-row' }, [
      createElement('label', { className: 'pc-setting-label' }, t('marketplace.registryUrl')),
      createElement('input', {
        type: 'url',
        className: 'pc-input',
        value: config.registries.get()[0]?.url ?? '',
        onChange: e => {
          const regs = config.registries.get()
          regs[0] = { ...regs[0], url: e.target.value }
          config.registries.set(regs)
        },
      }),
    ]),

    // Auto-update
    createElement('div', { className: 'pc-setting-row pc-setting-row-checkbox' }, [
      createElement('input', {
        type: 'checkbox',
        className: 'pc-checkbox',
        checked: config.autoUpdate.get(),
        onChange: e => config.autoUpdate.set(e.target.checked),
      }),
      createElement('label', { className: 'pc-setting-label' }, t('marketplace.autoUpdate')),
    ]),

    // Auto-install
    createElement('div', { className: 'pc-setting-row pc-setting-row-checkbox' }, [
      createElement('input', {
        type: 'checkbox',
        className: 'pc-checkbox',
        checked: config.autoInstall.get(),
        onChange: e => config.autoInstall.set(e.target.checked),
      }),
      createElement('label', { className: 'pc-setting-label' }, t('marketplace.autoInstall')),
    ]),

    // Verify signatures
    createElement('div', { className: 'pc-setting-row pc-setting-row-checkbox' }, [
      createElement('input', {
        type: 'checkbox',
        className: 'pc-checkbox',
        checked: config.verifySignatures.get(),
        onChange: e => config.verifySignatures.set(e.target.checked),
      }),
      createElement('label', { className: 'pc-setting-label' }, t('marketplace.verifySignatures')),
    ]),

    // Allow unsigned
    createElement('div', { className: 'pc-setting-row pc-setting-row-checkbox' }, [
      createElement('input', {
        type: 'checkbox',
        className: 'pc-checkbox',
        checked: config.allowUnsigned.get(),
        onChange: e => config.allowUnsigned.set(e.target.checked),
      }),
      createElement('label', { className: 'pc-setting-label' }, t('marketplace.allowUnsigned')),
    ]),
  ])
}

/** Client plugin registration */
export function apply(ctx: Context): void {
  // Create API client
  const api = new MarketplaceApi('/api/marketplace')

  // Register marketplace page in Plugins sidebar
  ctx.slots.inject('plugins.tab', () => {
    return ctx.slots.register({
      name: 'plugins.tab',
      id: 'marketplace',
      locale: 'marketplace',
    }, ({ t }) => createElement(MarketplacePage, { api, t }))
  })

  // Register marketplace settings
  ctx.slots.inject('settings.plugins.section', () => {
    return ctx.slots.register({
      name: 'settings.plugins.section',
      id: 'marketplace-settings',
      locale: 'marketplaceSettings',
    }, ({ t, form }) => createElement(MarketplaceSettings, { config: form.state?.marketplace ?? {}, t }))
  })

  // Provide API for other plugins
  ctx.provide('marketplaceApi', api)

  // Register types for TypeScript
  declare module '@deepseek-ai/cordis' {
    interface Context {
      marketplaceApi: MarketplaceApi
    }
  }
}

// Export components for other plugins
export {
  PluginCard,
  PluginDetailDrawer,
  MarketplacePage,
  MarketplaceApi,
}