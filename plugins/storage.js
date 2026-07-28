import {
  getData as getLocal,
  setData as setLocal,
  clear as clearLocal,
  removeData as removeLocal,
} from 'nuxt-storage/local-storage'

export default ({ app }, inject) => {
  inject('storage', {
    get: (key) => getLocal(key),
    set: (key, val) => setLocal(key, val,366,'d'),
    remove: (key) => removeLocal(key),
    clear: () => clearLocal()
  })
}
