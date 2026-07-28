// middleware/language-query.js 首屏 SSR 语言设置 + 首页默认跳转
export default function ({ app, route, redirect }) {
  const { i18n } = app
  const langFromQuery = route.query.language

  // 🌐 简写语言码映射表
  const langMap = {
    'ja': 'ja_JP', 'jp': 'ja_JP', 'jpn': 'ja_JP',
    'ms': 'ms_MY', 'malay': 'ms_MY',
    'zh': 'zh_CN', 'cn': 'zh_CN', 'chs': 'zh_CN',
    'zh-tw': 'zh_TW', 'tw': 'zh_TW', 'cht': 'zh_TW',
    'en': 'en_US',
    'id': 'id_ID', 'in': 'id_ID',
    'ru': 'ru_RU',
    'fil': 'fil_PH', 'ph': 'fil_PH'
  }

  // ================================
  // ✅ 新增：首页无 language 时，跳转到默认语言
  // ================================
  const isHomePage = route.path === '/'
  if (isHomePage && !langFromQuery) {
    // 默认语言简写（可配置）
    const DEFAULT_LANG_SHORT = 'zh' // ← 改成你想要的默认值，如 'en', 'ms'
    return redirect({ path: '/', query: { language: DEFAULT_LANG_SHORT } })
  }

  // 如果没有 language 参数，直接返回（靠 cookie 显示语言）
  if (!langFromQuery) {
    return
  }

  // 1. 尝试直接匹配完整 locale code
  let targetLocale = i18n.locales.find(l => l.code === langFromQuery)

  // 2. 尝试通过简写映射
  if (!targetLocale && langFromQuery in langMap) {
    const fullCode = langMap[langFromQuery]
    targetLocale = i18n.locales.find(l => l.code === fullCode)
  }

  // 3. 如果找到有效语言且与当前不同，则切换
  if (targetLocale && i18n.locale !== targetLocale.code) {
    i18n.setLocale(targetLocale.code)
    // 注意：这里不 redirect，保留原始参数
  }
}
