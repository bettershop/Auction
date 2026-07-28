//这是基于nuxt封装的axios --shaco
import qs from 'qs'
import Api from '@/api/http.js'
import { Message } from 'element-ui'

export default function ({ $axios, store, redirect, app }, inject) {
  function axiosConfig($axios) {
    let requestConfig = {}
    // 设置请求拦截
    $axios.onRequest((config) => {
      let lang = app.$cookies.get('currentLang')
      if (lang) {
        config.url = config.url + '&language=' + lang
      }

      let localUser = app.$storage.get('user');
      console.log(localUser)

      let pc_user = app.$cookies.get('pc_user') || localUser
      let paramJson = qs.parse(config.data);
      paramJson.access_id = ''
      if (pc_user && pc_user.access_id) {
        paramJson.access_id = pc_user.access_id ;
        config.data = qs.stringify(paramJson);
      }

      requestConfig = {
        baseURL: config.baseURL,
        url: config.url,
        method: config.method,
        data: config.data,
        headers: config.headers,
        params: config.params,
      }
      config.startTime = new Date().getTime()
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      return config
    })
    // 设置响应拦截
    $axios.onResponse((response) => {
      response.config.endTime = new Date().getTime()
      const status = response.status
      const code = response.data.code
      if (code == '200') {
        return response.data
      } else if (code == '203' || code == '404' || code == '4003') {
        if (code == '4003') {
          return redirect('/maintain/maintain')
        }
        Message({
          message: response.data.message || 'error',
          type: 'error',
          duration: 2 * 1000
        })
        setTimeout(() => {
          redirect('/login/login?isReturn=1')
        }, 1000);
      } else {
        // 如果请求失败的，打印出相应的错误信息，更好的修改。
        Message({
          message: response.data.message || 'error',
          type: 'error',
          duration: 2 * 1000
        })
        return response.data
        // const responseConfig = response ? response.config : {}
        // console.error('响应拦截报错提示： ', {
        //   url: responseConfig.baseURL + responseConfig.url,
        //   status: response.status,
        //   statusText: response.statusText,
        //   method: responseConfig.method,
        //   headers: responseConfig.headers,
        //   data: responseConfig.data,
        //   params: responseConfig.params,
        //   responseData: response.data,
        // })
      }
    })

    // axios错误处理
    $axios.onError((error) => {
      const response = error.response || {}
      const responseConfig = response.config || {}
      console.error('$axios.onError: ', error)
      console.error('错误处理提示 ', {
        url: responseConfig.baseURL + responseConfig.url,
        status: response.status,
        statusText: response.statusText,
        method: responseConfig.method,
        headers: responseConfig.headers,
        data: responseConfig.data,
        params: responseConfig.params,
        responseData: response.data,
        ...requestConfig,
      })

    })
    // 最后返回$axios对象
    return $axios
  }
  inject('Api', Api(axiosConfig($axios.create())))
}
