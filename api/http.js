//这是基于nuxt 统一管理axios的方案 最优  --shaco
import qs from 'qs'
const LKT_ROOT_URL 	= process.env.LKT_ROOT_URL
export default $axios =>{
  return{
    doRequest : data => {
      return $axios.post(LKT_ROOT_URL,qs.stringify(data))
    } ,
    getList : data => {
      return $axios.post(LKT_ROOT_URL,qs.stringify(data))
    } ,
    upImg :data =>$axios.post(LKT_ROOT_URL + '&api=mall.Product.uploadImgs',data),

    fetchLocation: (data) => $axios.get('https://ipapi.co/json/'),
  }
}
