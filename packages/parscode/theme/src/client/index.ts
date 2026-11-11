/**
 * ParsCode Theme - Client Entry
 * Registers theme definitions, provides theme components, and manages theme runtime
 */

import type { Context } from '@deepseek-ai/cordis'
import { createElement } from 'react'
import './styles.css'
import {
  PARSCODE_THEMES,
  registerParsCodeThemes,
  getProductName,
} from '@parscode/brand/client'
import {
  generateCssVariables,
  applyThemeToDocument,
  type Config,
  DEFAULT_CONFIG,
  ANIMATIONS,
} from '../index.ts'

/** Theme runtime state */
interface ThemeState {
  variant: Config['variant']
  glowStrength: Config['glowStrength']
  animationSpeed: Config['animationSpeed']
  accentIntensity: Config['accentIntensity']
  fontSize: Config['fontSize']
  density: Config['density']
  backgroundStyle: Config['backgroundStyle']
  reduceMotion: Config['reduceMotion']
}

/** Create reactive theme state from volatile config */
function createThemeState(config: Config): ThemeState {
  return {
    variant: config.variant.get(),
    glowStrength: config.glowStrength.get(),
    animationSpeed: config.animationSpeed.get(),
    accentIntensity: config.accentIntensity.get(),
    fontSize: config.fontSize.get(),
    density: config.density.get(),
    backgroundStyle: config.backgroundStyle.get(),
    reduceMotion: config.reduceMotion.get(),
  }
}

/** Apply theme state to document */
function applyThemeState(state: ThemeState): void {
  const fullConfig = { ...DEFAULT_CONFIG, ...state } as Required<Config>
  applyThemeToDocument(fullConfig)
}

/** Theme settings panel component */
function ThemeSettingsPanel({
  config,
  t,
}: {
  config: Config
  t: (key: string) => string
}) {
  const [localState, setLocalState] = React.useState<ThemeState>(() => createThemeState(config))

  // Sync with volatile config
  React.useEffect(() => {
    setLocalState(createThemeState(config))
  }, [config])

  // Apply changes
  React.useEffect(() => {
    applyThemeState(localState)
  }, [localState])

  const handleChange = <K extends keyof ThemeState>(key: K, value: ThemeState[K]) => {
    setLocalState(prev => ({ ...prev, [key]: value }))
    // Write back to volatile config
    ;(config as any)[key].set(value)
  }

  return createElement('div', { className: 'pc-theme-settings' }, [
    createElement('h3', { key: 'title', className: 'pc-section-title' }, t('theme.title')),
    createElement('p', { key: 'desc', className: 'pc-section-desc' }, t('theme.description')),

    // Variant selector
    createElement('div', { key: 'variant', className: 'pc-setting-row' }, [
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.variant')),
      createElement('select', {
        key: 'select',
        className: 'pc-select',
        value: localState.variant,
        onChange: e => handleChange('variant', e.target.value as Config['variant']),
      }, [
        createElement('option', { key: 'dark', value: 'dark' }, t('theme.variants.dark')),
        createElement('option', { key: 'gold-light', value: 'gold-light' }, t('theme.variants.goldLight')),
      ]),
    ]),

    // Glow strength
    createElement('div', { key: 'glow', className: 'pc-setting-row' }, [
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.glowStrength')),
      createElement('input', {
        key: 'input',
        type: 'range',
        className: 'pc-slider',
        min: '0',
        max: '1',
        step: '0.1',
        value: localState.glowStrength,
        onChange: e => handleChange('glowStrength', parseFloat(e.target.value)),
      }),
      createElement('span', { key: 'value', className: 'pc-setting-value' }, `${Math.round(localState.glowStrength * 100)}%`),
    ]),

    // Animation speed
    createElement('div', { key: 'anim', className: 'pc-setting-row' }, [
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.animationSpeed')),
      createElement('input', {
        key: 'input',
        type: 'range',
        className: 'pc-slider',
        min: '0.5',
        max: '2',
        step: '0.1',
        value: localState.animationSpeed,
        onChange: e => handleChange('animationSpeed', parseFloat(e.target.value)),
      }),
      createElement('span', { key: 'value', className: 'pc-setting-value' }, `${localState.animationSpeed}x`),
    ]),

    // Accent intensity
    createElement('div', { key: 'accent', className: 'pc-setting-row' }, [
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.accentIntensity')),
      createElement('input', {
        key: 'input',
        type: 'range',
        className: 'pc-slider',
        min: '0.5',
        max: '1.5',
        step: '0.1',
        value: localState.accentIntensity,
        onChange: e => handleChange('accentIntensity', parseFloat(e.target.value)),
      }),
      createElement('span', { key: 'value', className: 'pc-setting-value' }, `${localState.accentIntensity}x`),
    ]),

    // Font size
    createElement('div', { key: 'fontSize', className: 'pc-setting-row' }, [
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.fontSize')),
      createElement('input', {
        key: 'input',
        type: 'range',
        className: 'pc-slider',
        min: '10',
        max: '24',
        step: '1',
        value: localState.fontSize,
        onChange: e => handleChange('fontSize', parseInt(e.target.value, 10)),
      }),
      createElement('span', { key: 'value', className: 'pc-setting-value' }, `${localState.fontSize}px`),
    ]),

    // Density
    createElement('div', { key: 'density', className: 'pc-setting-row' }, [
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.density')),
      createElement('select', {
        key: 'select',
        className: 'pc-select',
        value: localState.density,
        onChange: e => handleChange('density', e.target.value as Config['density']),
      }, [
        createElement('option', { key: 'compact', value: 'compact' }, t('theme.densities.compact')),
        createElement('option', { key: 'normal', value: 'normal' }, t('theme.densities.normal')),
        createElement('option', { key: 'spacious', value: 'spacious' }, t('theme.densities.spacious')),
      ]),
    ]),

    // Background style
    createElement('div', { key: 'bg', className: 'pc-setting-row' }, [
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.backgroundStyle')),
      createElement('select', {
        key: 'select',
        className: 'pc-select',
        value: localState.backgroundStyle,
        onChange: e => handleChange('backgroundStyle', e.target.value as Config['backgroundStyle']),
      }, [
        createElement('option', { key: 'solid', value: 'solid' }, t('theme.backgrounds.solid')),
        createElement('option', { key: 'aurora', value: 'aurora' }, t('theme.backgrounds.aurora')),
        createElement('option', { key: 'particles', value: 'particles' }, t('theme.backgrounds.particles')),
      ]),
    ]),

    // Reduced motion toggle
    createElement('div', { key: 'reduceMotion', className: 'pc-setting-row pc-setting-row-checkbox' }, [
      createElement('input', {
        key: 'input',
        type: 'checkbox',
        className: 'pc-checkbox',
        checked: localState.reduceMotion,
        onChange: e => handleChange('reduceMotion', e.target.checked),
      }),
      createElement('label', { key: 'label', className: 'pc-setting-label' }, t('theme.reduceMotion')),
    ]),

    // Reset button
    createElement('button', {
      key: 'reset',
      className: 'pc-button pc-button-secondary',
      onClick: () => {
        Object.entries(DEFAULT_CONFIG).forEach(([key, value]) => {
          ;(config as any)[key].set(value)
        })
      },
    }, t('theme.reset')),
  ])
}

/** Theme selector for quick switching */
function ThemeSelector({
  config,
  t,
}: {
  config: Config
  t: (key: string) => string
}) {
  const variant = config.variant.get()

  return createElement('div', { className: 'pc-theme-selector' }, [
    createElement('span', { key: 'label', className: 'pc-theme-selector-label' }, t('theme.quickSwitch')),
    createElement('select', {
      key: 'select',
      className: 'pc-theme-selector-select',
      value: variant,
      onChange: e => config.variant.set(e.target.value as Config['variant']),
    }, [
      createElement('option', { key: 'dark', value: 'dark' }, t('theme.variants.dark')),
      createElement('option', { key: 'gold-light', value: 'gold-light' }, t('theme.variants.goldLight')),
    ]),
  ])
}

/** Animated background: Aurora */
function AuroraBackground({ intensity = 1 }: { intensity?: number }) {
  return createElement('div', {
    className: 'pc-aurora-bg',
    style: { '--pc-aurora-intensity': intensity },
  }, [
    createElement('div', { key: 'layer1', className: 'pc-aurora-layer pc-aurora-layer-1' }),
    createElement('div', { key: 'layer2', className: 'pc-aurora-layer pc-aurora-layer-2' }),
    createElement('div', { key: 'layer3', className: 'pc-aurora-layer pc-aurora-layer-3' }),
  ])
}

/** Animated background: Particles */
function ParticlesBackground({ count = 50 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 20,
    duration: 15 + Math.random() * 20,
  }))

  return createElement('div', { className: 'pc-particles-bg' },
    particles.map(p => createElement('div', {
      key: p.id,
      className: 'pc-particle',
      style: {
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        animationDelay: `${p.delay}s`,
        animationDuration: `${p.duration}s`,
      },
    }))
  )
}

/** Faravahar logo component */
function FaravaharLogo({
  size = 32,
  animated = true,
  variant = 'full',
}: {
  size?: number
  animated?: boolean
  variant?: 'full' | 'mono' | 'mark'
}) {
  const viewBox = '0 0 100 100'
  const strokeWidth = variant === 'mark' ? 0 : 1.5

  return createElement('svg', {
    width: size,
    height: size,
    viewBox,
    className: `pc-faravahar pc-faravahar-${variant} ${animated ? 'pc-faravahar-animated' : ''}`,
    'aria-label': getProductName(),
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  }, [
    // Wings
    createElement('path', {
      key: 'wings',
      d: 'M20,50 Q10,30 15,15 Q25,20 30,30 Q25,40 20,50 Z M80,50 Q90,30 85,15 Q75,20 70,30 Q75,40 80,50 Z',
      stroke: variant === 'mono' ? 'currentColor' : 'url(#goldGradient)',
      strokeWidth,
      fill: variant === 'mono' ? 'currentColor' : 'url(#goldGradient)',
      className: 'pc-faravahar-wings',
    }),
    // Body
    createElement('circle', {
      key: 'body',
      cx: 50,
      cy: 50,
      r: 12,
      stroke: variant === 'mono' ? 'currentColor' : 'url(#goldGradient)',
      strokeWidth,
      fill: variant === 'mono' ? 'none' : 'url(#goldGradient)',
      className: 'pc-faravahar-body',
    }),
    // Tail feathers
    createElement('path', {
      key: 'tail',
      d: 'M50,62 Q45,75 50,85 Q55,75 50,62',
      stroke: variant === 'mono' ? 'currentColor' : 'url(#goldGradient)',
      strokeWidth,
      fill: variant === 'mono' ? 'currentColor' : 'url(#goldGradient)',
      className: 'pc-faravahar-tail',
    }),
    // Head ring
    createElement('circle', {
      key: 'ring',
      cx: 50,
      cy: 28,
      r: 6,
      stroke: variant === 'mono' ? 'currentColor' : 'url(#goldGradient)',
      strokeWidth: 1,
      fill: 'none',
      className: 'pc-faravahar-ring',
    }),
    // Gradient definition
    createElement('defs', { key: 'defs' }, [
      createElement('linearGradient', {
        id: 'goldGradient',
        x1: '0%',
        y1: '0%',
        x2: '100%',
        y2: '100%',
      }, [
        createElement('stop', { key: 's1', offset: '0%', stopColor: '#B8860B' }),
        createElement('stop', { key: 's2', offset: '50%', stopColor: '#F5D27A' }),
        createElement('stop', { key: 's3', offset: '100%', stopColor: '#D4AF37' }),
      ]),
      // Glow filter
      createElement('filter', { id: 'goldGlow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, [
        createElement('feGaussianBlur', { stdDeviation: '2', result: 'blur' }),
        createElement('feMerge', {}, [
          createElement('feMergeNode', { in: 'blur' }),
          createElement('feMergeNode', { in: 'SourceGraphic' }),
        ]),
      ]),
    ]),
  ])
}

/** Theme provider component */
function ThemeProvider({
  children,
  config,
}: {
  children: React.ReactNode
  config: Config
}) {
  const [state, setState] = React.useState<ThemeState>(() => createThemeState(config))

  React.useEffect(() => {
    setState(createThemeState(config))
  }, [config])

  React.useEffect(() => {
    applyThemeState(state)
  }, [state])

  // Listen for theme changes from host
  React.useEffect(() => {
    const handleChange = () => setState(createThemeState(config))
    // This would be connected to the host's theme change event
    return () => {}
  }, [config])

  return createElement('div', { className: 'pc-theme-provider' }, children)
}

/** Export client entry */
export function apply(ctx: Context): void {
  // Register ParsCode themes with ui-theme
  registerParsCodeThemes(ctx)

  // Register theme settings panel
  ctx.slots.inject('settings.general.section', () => {
    return ctx.slots.register({
      name: 'settings.general.section',
      id: 'parscode-theme',
      locale: 'parscodeTheme',
    }, ({ t, form }) => {
      // Get config from settings
      // This is a simplified version - actual implementation would use the settings API
      return createElement(ThemeSettingsPanel, { config: form.state?.theme ?? {} as Config, t })
    })
  })

  // Register theme selector in header/toolbar
  ctx.slots.inject('header.actions', () => {
    return ctx.slots.register({
      name: 'header.actions',
      id: 'parscode-theme-selector',
    }, ({ t }) => createElement(ThemeSelector, { config: {} as Config, t }))
  })

  // Provide theme components for other plugins
  ctx.provide('parscodeTheme', {
    FaravaharLogo,
    AuroraBackground,
    ParticlesBackground,
    ThemeProvider,
    ThemeSettingsPanel,
    ThemeSelector,
  })

  // Export CSS for dynamic injection
  ctx.provide('parscodeThemeCss', {
    generateCssVariables,
    applyThemeToDocument,
    ANIMATIONS,
  })
}

// Re-export for other client plugins
export {
  FaravaharLogo,
  AuroraBackground,
  ParticlesBackground,
  ThemeProvider,
  ThemeSettingsPanel,
  ThemeSelector,
  generateCssVariables,
  applyThemeToDocument,
  ANIMATIONS,
  type ThemeState,
}