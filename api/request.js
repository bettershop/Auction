/**
 * 封装Axios
 * 处理请求、响应错误信息
 * //这是vue 封装axios的方案 在nuxt内不推荐，可以为了upImg接口做后手  --shaco
 */
import axios from 'axios' // 引用axios
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: '/api/', // 所有异步请求都加上/api,nginx转发到后端
  // withCredentials: true, // 是否允许带cookie请求，但是放开会跨域，需要后端那边处理
  timeout: 5000 // request timeout
})

// 请求（request）拦截器
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers['-Token'] = getToken()
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应（response）拦截器
service.interceptors.response.use(
  response => {
    const res = response.data // res is my own data
    if (parseInt(res.code) === 200) {
      return res
    } else {
      Message({
        message: res.msg || res.message || 'error',
        type: 'error',
        duration: 2 * 1000
      })
      window.location.href = '/login'
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service // 导出封装后的axios
