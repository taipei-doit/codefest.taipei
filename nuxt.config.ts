// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    baseURL: '/welcome/',
    head: {
      title: '台北程式設計節',
      meta: [
        { name: 'robots', content: 'index,follow' },
        { 'http-equiv': 'cache-control', content: 'no-cache' },
        { 'http-equiv': 'expires', content: '0' },
        { 'http-equiv': 'pragma', content: 'no-cache' },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        // {
        //   'http-equiv': 'Content-Security-Policy',
        //   content:
        //     "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.surveycake.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://www.surveycake.com; frame-src 'self' https://www.surveycake.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; form-action 'self' https://www.surveycake.com; upgrade-insecure-requests;",
        // },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/welcome/favicon.ico' }],
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/stylelint-module',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],
  tailwindcss: {
    cssPath: '~/assets/main.scss', // 修正為字符串
    configPath: 'tailwind.config.js', // 確保這裡的文件名正確
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  i18n: {
    vueI18n: '~/i18n.config.ts',
  },
});
