//解决跳转路由后页面滚动条还停留在以前的位置
export default function (_to, _from, savedPosition) {
    return new Promise((resolve) => {
    //   setTimeout(() => 
      resolve(savedPosition || { x: 0, y: 0 })
    //   , 180)
    })
  }
  