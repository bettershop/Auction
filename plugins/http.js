//基于vue的公共方法，getList已经集成在nuxt里面，所以用不到，顶多用个upImg  --shaco
import request from '../api/request'
import Vue from 'vue';
import qs from 'qs'

const LKT_ROOT_URL 	= process.env.VUE_APP_BASE_API + "?store_id=" + process.env.VUE_APP_LKT_STORE_ID + "&store_type=" + process.env.VUE_APP_STORE_TYPE

Vue.prototype.$getList = function(data) {
  //传入语言参数
  data.language = this.$cookies.get('currentLang')
  return request({
    url: LKT_ROOT_URL,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

Vue.prototype.$upImg = function(data) {
  return request({
    url: LKT_ROOT_URL + '&api=mall.Product.uploadImgs',
    method: 'post',
    data: data,
    contentType: false,
    processData: false,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
