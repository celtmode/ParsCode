/**
 * ParsCode Options - Client Entry
 * Settings UI components, import/export, backup/restore
 */

import type { Context } from '@deepseek-ai/cordis'
import { createElement, useState, useEffect, useCallback } from 'react'
import './styles.css'
import { FaravaharLogo } from '@parscode/theme/client'
import { PRODUCT_NAME } from '@parscode/brand'
import {
  SettingsSchema,
  SETTINGS_CATEGORIES,
  type Settings,
  type SettingsCategory,
} from '../index.ts'

/** Settings panel component */
function SettingsPanel({
  config,
  t,
  onSave,
  onReset,
  onExport,
  onImport,
  onBackup,
  onRestore,
}: {
  config: Settings
  t: (key: string) => string
  onSave: (namespace: string, value: unknown) => void
  onReset: (namespace: string) => void
  onExport: () => void
  onImport: (file: File) => void
  onBackup: (namespace: string) => void
  onRestore: (namespace: string, index: number) => void
}) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>(SETTINGS_CATEGORIES[0])
  const [showImport, setShowImport] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)

  const namespaceConfig = (config as any)[activeCategory.namespace] ?? {}

  return createElement('div', { className: 'pc-options-panel' }, [
    // Header with actions
    createElement('div', { key: 'header', className: 'pc-options-header' }, [
      createElement('div', { key: 'title', className: 'pc-options-title' }, [
        createElement(FaravaharLogo, { key: 'logo', size: 24, animated: false }),
        createElement('h2', { key: 'text' }, t('options.title')),
      ]),
      createElement('div', { key: 'actions', className: 'pc-options-actions' }, [
        createElement('button', {
          key: 'export',
          className: 'pc-button pc-button-secondary pc-button-sm',
          onClick: onExport,
        }, t('options.export')),
        createElement('button', {
          key: 'import',
          className: 'pc-button pc-button-secondary pc-button-sm',
          onClick: () => setShowImport(true),
        }, t('options.import')),
        createElement('button', {
          key: 'reset-all',
          className: 'pc-button pc-button-ghost pc-button-sm',
          onClick: () => {
            if (confirm(t('options.confirmResetAll'))) {
              SETTINGS_CATEGORIES.forEach(c => onReset(c.namespace))
            }
          },
        }, t('options.resetAll')),
      ]),
    ]),

    // Category sidebar
    createElement('nav', { key: 'sidebar', className: 'pc-options-sidebar' }, [
      createElement('ul', { key: 'list', className: 'pc-options-category-list' },
        SETTINGS_CATEGORIES.map(category => createElement('li', {
          key: category.id,
          className: `pc-options-category ${activeCategory.id === category.id ? 'active' : ''}`,
          onClick: () => setActiveCategory(category),
        }, [
          createElement('span', { key: 'icon', className: `pc-icon pc-icon-${category.icon}` }),
          createElement('span', { key: 'name', className: 'pc-category-name' }, t(`options.categories.${category.id}`)),
          createElement('span', { key: 'desc', className: 'pc-category-desc' }, t(`options.categories.${category.id}Desc`)),
        ]))
      ),
    ]),

    // Category content
    createElement('div', { key: 'content', className: 'pc-options-content' }, [
      createElement('div', { key: 'category-header', className: 'pc-category-header' }, [
        createElement('h3', { key: 'name' }, t(`options.categories.${activeCategory.id}`)),
        createElement('p', { key: 'desc', className: 'pc-category-description' }, t(`options.categories.${activeCategory.id}Desc`)),
      ]),
      createElement('div', { key: 'fields', className: 'pc-category-fields' },
        renderCategoryFields(activeCategory, namespaceConfig, t, onSave, onReset, onBackup, onRestore)
      ),
    ]),

    // Import dialog
    showImport && createElement('div', { key: 'import-dialog', className: 'pc-import-dialog-overlay', onClick: () => setShowImport(false) }, [
      createElement('div', { key: 'dialog', className: 'pc-import-dialog', onClick: e => e.stopPropagation() }, [
        createElement('h3', { key: 'title' }, t('options.importTitle')),
        createElement('p', { key: 'desc' }, t('options.importDesc')),
        createElement('input', {
          key: 'file',
          type: 'file',
          accept: '.json',
          onChange: e => setImportFile(e.target.files?.[0] ?? null),
          className: 'pc-file-input',
        }),
        importFile && createElement('p', { key: 'filename', className: 'pc-import-filename' }, importFile.name),
        createElement('div', { key: 'dialog-actions', className: 'pc-dialog-actions' }, [
          createElement('button', {
            key: 'cancel',
            className: 'pc-button pc-button-secondary',
            onClick: () => { setShowImport(false); setImportFile(null) },
          }, t('common.cancel')),
          createElement('button', {
            key: 'import',
            className: 'pc-button pc-button-primary',
            onClick: () => { if (importFile) { onImport(importFile); setShowImport(false); setImportFile(null) } },
            disabled: !importFile,
          }, t('options.import')),
        ]),
      ]),
    ]),
  ])
}

/** Render fields for a category */
function renderCategoryFields(
  category: SettingsCategory,
  config: any,
  t: (key: string) => string,
  onSave: (namespace: string, value: unknown) => void,
  onReset: (namespace: string) => void,
  onBackup: (namespace: string) => void,
  onRestore: (namespace: string, index: number) => void
) {
  // This is a simplified renderer - in production would use config-editor
  // For now, render a basic form based on the schema shape
  const fields = getSchemaFields(category.schema)

  return fields.map(field => createElement('div', {
    key: field.key,
    className: 'pc-setting-field',
  }, [
    createElement('label', { key: 'label', className: 'pc-field-label' }, [
      createElement('span', { key: 'name' }, t(`options.fields.${category.namespace}.${field.key}`)),
      field.required && createElement('span', { key: 'required', className: 'pc-field-required' }, '*'),
    ]),
    createElement('div', { key: 'control', className: 'pc-field-control' }, renderFieldControl(field, config[field.key], t, (value) => {
      onSave(category.namespace, { ...config, [field.key]: value })
    })),
    field.description && createElement('p', { key: 'help', className: 'pc-field-help' }, t(`options.fields.${category.namespace}.${field.key}Help`)),
    createElement('div', { key: 'actions', className: 'pc-field-actions' }, [
      createElement('button', {
        key: 'backup',
        className: 'pc-button pc-button-ghost pc-button-xs',
        onClick: () => onBackup(category.namespace),
      }, t('options.backup')),
      createElement('button', {
        key: 'reset',
        className: 'pc-button pc-button-ghost pc-button-xs',
        onClick: () => onReset(category.namespace),
      }, t('options.reset')),
    ]),
  ]))
}

/** Extract field definitions from schema */
function getSchemaFields(schema: z.ZodTypeAny): Array<{ key: string; type: string; required: boolean; description: boolean }> {
  // Simplified - in reality would introspect the Zod schema
  return []
}

/** Render appropriate input control */
function renderFieldControl(field: any, value: any, t: (key: string) => string, onChange: (value: any) => void) {
  switch (field.type) {
    case 'boolean':
      return createElement('input', {
        type: 'checkbox',
        className: 'pc-checkbox',
        checked: value ?? false,
        onChange: e => onChange(e.target.checked),
      })
    case 'number':
      return createElement('input', {
        type: 'number',
        className: 'pc-input',
        value: value ?? '',
        onChange: e => onChange(parseFloat(e.target.value) || 0),
        min: field.min,
        max: field.max,
        step: field.step,
      })
    case 'string':
      if (field.enum) {
        return createElement('select', {
          className: 'pc-select',
          value: value ?? '',
          onChange: e => onChange(e.target.value),
        }, field.enum.map((v: string) => createElement('option', { key: v, value: v }, t(`options.enums.${field.key}.${v}`))))
      }
      return createElement('input', {
        type: 'text',
        className: 'pc-input',
        value: value ?? '',
        onChange: e => onChange(e.target.value),
        placeholder: field.placeholder ? t(field.placeholder) : undefined,
      })
    default:
      return createElement('span', { className: 'pc-field-unsupported' }, t('options.unsupportedType'))
  }
}

/** Category card for overview */
function CategoryCard({
  category,
  active,
  onClick,
  t,
}: {
  category: SettingsCategory
  active: boolean
  onClick: () => void
  t: (key: string) => string
}) {
  return createElement('button', {
    className: `pc-category-card ${active ? 'active' : ''}`,
    onClick,
  }, [
    createElement('div', { key: 'icon', className: `pc-category-card-icon pc-icon-${category.icon}` }),
    createElement('h4', { key: 'name' }, t(`options.categories.${category.id}`)),
    createElement('p', { key: 'desc' }, t(`options.categories.${category.id}Desc`)),
  ])
}

/** Main options page */
function OptionsPage({
  config,
  t,
  onSave,
  onReset,
  onExport,
  onImport,
  onBackup,
  onRestore,
}: {
  config: Settings
  t: (key: string) => string
  onSave: (namespace: string, value: unknown) => void
  onReset: (namespace: string) => void
  onExport: () => void
  onImport: (file: File) => void
  onBackup: (namespace: string) => void
  onRestore: (namespace: string, index: number) => void
}) {
  return createElement('div', { className: 'pc-options-page' }, [
    createElement('header', { key: 'header', className: 'pc-options-page-header' }, [
      createElement('div', { key: 'brand', className: 'pc-options-brand' }, [
        createElement(FaravaharLogo, { key: 'logo', size: 32, animated: true }),
        createElement('h1', { key: 'title' }, t('options.title')),
      ]),
      createElement('p', { key: 'subtitle', className: 'pc-options-subtitle' }, t('options.subtitle')),
    ]),
    createElement('main', { key: 'main', className: 'pc-options-main' }, [
      createElement(SettingsPanel, {
        config,
        t,
        onSave,
        onReset,
        onExport,
        onImport,
        onBackup,
        onRestore,
      }),
    ]),
  ])
}

/** Client plugin registration */
export function apply(ctx: Context): void {
  // Register options page in Settings
  ctx.slots.inject('settings.page', () => {
    return ctx.slots.register({
      name: 'settings.page',
      id: 'parscode-options',
      locale: 'parscodeOptions',
    }, ({ t, form }) => createElement(OptionsPage, {
      config: form.state?.parscodeOptions ?? {} as Settings,
      t,
      onSave: (namespace, value) => form.mutate({ [namespace]: value }),
      onReset: (namespace) => form.mutate({ [namespace]: {} }),
      onExport: () => {
        const service = ctx.parscodeOptions
        const json = service.exportSettings(form.state?.parscodeOptions ?? {} as Settings)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `parscode-settings-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
      },
      onImport: (file) => {
        const reader = new FileReader()
        reader.onload = () => {
          const service = ctx.parscodeOptions
          const result = service.importSettings(reader.result as string)
          if (result.success) {
            form.mutate({ parscodeOptions: result.settings })
          } else {
            alert(`${t('options.importFailed')}: ${result.error}`)
          }
        }
        reader.readAsText(file)
      },
      onBackup: (namespace) => {
        const service = ctx.parscodeOptions
        service.createBackup(namespace, (form.state?.parscodeOptions as any)?.[namespace])
      },
      onRestore: (namespace, index) => {
        const service = ctx.parscodeOptions
        const data = service.restoreBackup(namespace, index)
        if (data) {
          form.mutate({ [namespace]: data })
        }
      },
    }))
  })

  // Provide service
  declare module '@deepseek-ai/cordis' {
    interface Context {
      parscodeOptions: ReturnType<typeof import('../index.ts').then(m => m.OptionsService)>
    }
  }
}

// Export components
export {
  SettingsPanel,
  CategoryCard,
  OptionsPage,
}