export const state = () => ({
  arrList: null
})

export const mutations = {
  SET_DATA (state, data) {
    state.arrList = data
  }
}

export const actions = {
  getData (store, data) {
    store.commit('SET_DATA', data)
  },
  // 缓存公告数据
  getCache(store,data){
    this.$storage.set('maintain_text',data)
  }
}

export default {
  state,
  mutations,
  actions
}
