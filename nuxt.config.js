import env from './env'

export default {
  ssr: true, //默认是开启的
  head: {
    title: '来客推商城',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        type: 'text/javascript',
        src: env[process.env.NODE_ENV].PUBLIC_PATH + '/js/qrcode.min.js'
        // body: true,//true就是配置再body中插入script标签，false就配置再header中插入script标签
      },
      {
        type: 'text/javascript',
        src: env[process.env.NODE_ENV].PUBLIC_PATH + '/js/jquery.min.js'
      }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  env: {
    NODE_ENV: env[process.env.NODE_ENV].NODE_ENV,
    VUE_APP_LKT_STORE_ID: env[process.env.NODE_ENV].VUE_APP_LKT_STORE_ID, //商城ID
    PUBLIC_PATH: env[process.env.NODE_ENV].PUBLIC_PATH, //配置router
    VUE_APP_STORE_TYPE: env[process.env.NODE_ENV].VUE_APP_STORE_TYPE, //来源
    VUE_APP_LKT_MCH_DEFURL: env[process.env.NODE_ENV].VUE_APP_LKT_MCH_DEFURL, //来客电商PC商城跳转路径
    VUE_APP_LKT_ROOT_IMG_URL: env[process.env.NODE_ENV].VUE_APP_LKT_ROOT_IMG_URL, //图片资源路径
    VUE_APP_LKT_H5_DEFURL: env[process.env.NODE_ENV].VUE_APP_LKT_H5_DEFURL, //来客电商H5默认路径
    VUE_APP_LKT_KEFU_URL: env[process.env.NODE_ENV].VUE_APP_LKT_KEFU_URL, //客服 websocket地址
    VUE_APP_BASE_API: env[process.env.NODE_ENV].VUE_APP_BASE_API,
    LKT_ROOT_URL: env[process.env.NODE_ENV].LKT_ROOT_URL,
    PROT: env[process.env.NODE_ENV].PROT
  },
  router: {
    middleware: ['language-query'], // 添加这里
    base: env[process.env.NODE_ENV].PUBLIC_PATH,
  },
  // 输出文件目录
  // 在npm run build时 生成文件的目录 type:string, default:'dist'
  // outputDir: 'dist',
  server: {
    host: '0.0.0.0', // 修改成这个就可以适配所有网卡了
    port: env[process.env.NODE_ENV].PROT // 这里修改端口
  },
  css: [
    'element-ui/lib/theme-chalk/index.css',
    { src: '@/assets/css/common.scss', lang: 'scss' }
  ],

  plugins: [
    '@/plugins/storage',
    '@/plugins/cookie-consent',
    '@/plugins/element-ui',
    '@/plugins/http',
    '@/plugins/axios',
    '@/plugins/currency',
    '@/plugins/persist-language-query.client.js'
  ],

  components: true,
  buildModules: [],
  //头部进度条
  // loading: {
  //   color: '#0dcaf0',
  //   height: '2px'
  // },
  loading: false,
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/i18n',
    'cookie-universal-nuxt'
  ],
  i18n: {
    //这个是国际化的配置
    locales: [
      { code: 'en_US', iso:'en-US', name: 'English', file: 'en_US.js' },
      { code: 'zh_CN', iso: 'zh-CN', name: '中文', file: 'zh_CN.js' },
      { code: 'zh_TW', iso: 'zh-TW', name: '繁体', file: 'zh_TW.js' },
      { code: 'ms_MY', iso: 'ms-MY', name: '马来语', file: 'ms_MY.js' },
      { code: 'id_ID', iso: 'id-ID', name: '印尼语', file: 'id_ID.js' },
      { code: 'ru_RU', iso: 'ru-RU', name: '俄语', file: 'ru_RU.js' },
      { code: 'ja_JP', iso: 'ja-JP', name: '日语', file: 'ja_JP.js' },
      { code: 'fil_PH', iso: 'fil-PH', name: '菲律宾语', file: 'fil_PH.js' },
    ],
    lazy: false,
    langDir: 'lang/',
    strategy: 'no_prefix',
    defaultLocale: 'en_US',
    vueI18n: {
      fallbackLocale: "en_US",   // 使用i18n配置
    },
    //`currentLang`  cookie 的赋值时机如下：
    // 1. **用户第一次访问网站根路径 `/` 时**   如果没有 `currentLang`，Nuxt i18n 会根据浏览器语言自动选择语言，并把选择结果写入 `currentLang` cookie。
    // 2. **用户手动切换语言时**  当你调用 `$i18n.setLocale('en')` 或页面上有语言切换操作时，Nuxt i18n 也会自动更新 `currentLang` cookie 为当前选择的语言。
    // 3. **每次切换语言后**   只要语言发生变化，Nuxt i18n 都会把当前语言写入 `currentLang` cookie。
    // **总结：**
    // `currentLang` cookie 由 Nuxt i18n 模块自动管理，在用户首次访问、自动检测语言或手动切换语言时自动赋值和更新，无需手动设置。
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'currentLang',
      fallbackLocale: 'en_US',  // 如果浏览器语言没匹配，回退到这个
      alwaysRedirect: false,
    },
  },
  storage: {
    defaultType: 'localStorage',
    expire: { default: null, unit: 'm' } // 默认不过期
  },
  axios: {
    proxy: true,
    credentials: true
  },
  headers: {
    host: '' //1.Error occurred while proxying reques
  },
  proxy: {
    '/api': {
      target: env[process.env.NODE_ENV].VUE_APP_BASE_API,
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      },
    }
  },
  defineConfig: {
    lintOnSave: false
  },
  hooks: {
    'vue-renderer:ssr:context'(context) {
      const routePath = JSON.stringify(context.nuxt.routePath)
      // context.nuxt={serverRendered:true,routePath}
    }
  },
  build: {
    terser: {
      terserOptions: {
        compress: {
          drop_debugger: false,
          drop_console: false
        }
      }
    },
    transpile: [/^element-ui/],
    loaders: {
      sass: {
        implementation: require('sass')
      },
      scss: {
        implementation: require('sass')
      }
    },
    //源代码里面去掉样式
    extractCSS: {
      allChunks: true
    }
  }
}
