// import Vue from 'vue'
// import Element from 'element-ui'
import Vue from 'vue'
import Element from 'element-ui'
import elementLocale from 'element-ui/lib/locale'
 
Vue.use(Element)
 
export default ({ app }) => {
  elementLocale.i18n((key, value) => app.i18n.t(key, value))
}