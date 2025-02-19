const routerBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
      router: {
        // base: '/non-extractive-architecture/'
        base: '/'
      }
    }
    : {}

export default {
  ...routerBase,
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Non-Extractive Architecture',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'preload', as: 'font', type: 'font/woff', href: '/_nuxt/assets/fonts/Diagramatika-Text-Regular.woff', crossorigin: true },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: '/_nuxt/assets/fonts/Diagramatika-Text-Regular.woff2', crossorigin: true },
      { rel: 'preload', as: 'font', type: 'font/woff', href: '/_nuxt/assets/fonts/Diagramatika-Text-Italic.woff', crossorigin: true },
      { rel: 'preload', as: 'font', type: 'font/woff2', href: '/_nuxt/assets/fonts/Diagramatika-Text-Italic.woff2', crossorigin: true }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/scss/application'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources'
  ],

  styleResources: {
    scss: ['~assets/scss/*/*.scss']
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/axios'],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend (config) {
      config.module.rules.push({
        test: /\.pdf$/,
        loader: 'file-loader'
      })
    }
  }
}
