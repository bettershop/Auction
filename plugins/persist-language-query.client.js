// plugins/persist-language-query.client.js 客户端路由跳转时自动携带 language 参数
export default function ({ app }) {
  const { router, i18n } = app

  // 辅助函数：locale → 简写
  function getShortLang(fullLocale) {
    const map = {
      'zh_CN': 'zh',
      'zh_TW': 'zh-tw',
      'en_US': 'en',
      'ms_MY': 'ms',
      'ja_JP': 'ja',
      'id_ID': 'id',
      'ru_RU': 'ru',
      'fil_PH': 'fil'
    }
    return map[fullLocale] || 'zh'
  }

  router.beforeEach((to, from, next) => {
    let lang = to.query.language

    // 继承来源语言
    if (!lang && from.query.language) {
      lang = from.query.language
    }

    // 用当前 i18n locale 作为 fallback
    if (!lang) {
      lang = getShortLang(i18n.locale)
    }

    // 🔥 关键优化：只有当确实需要修改时才跳转
    if (to.query.language !== lang) {
      next({
        ...to,
        query: { ...to.query, language: lang },
        replace: true
      })
    } else {
      next() // 直接通过
    }
  })
}
