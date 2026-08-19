export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    baseURL: '/Boardgame-table/',
    buildAssetsDir: '/_nuxt/',
    cdnURL: ''
  },

  nitro: {
    preset: 'github-pages'
  },

  ssr: false,

  compatibilityDate: '2026-08-20'
})