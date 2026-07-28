<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <ul class="nav-links">
        <li  @click.stop="navLink(0,'/')" :class="{'nav-links-hover':navIndex === 0}"> {{$t("home.home_page")}}</li>
        <li  @click.stop="navLink(1)" :class="{'nav-links-hover':navIndex === 1}">{{$t("allClass")}}</li>
        <li  @click.stop="navLink(2)" :class="{'nav-links-hover':navIndex === 2}">{{$t("oneAuction")}}</li>
        <li  @click.stop="navLink(3)" :class="{'nav-links-hover':navIndex === 3}">{{$t("auctionSession")}}</li>
        <li  @click.stop="navLink(4)" :class="{'nav-links-hover':navIndex === 4}">{{$t("mchSession")}}</li>
        <li  @click.stop="navLink(5)" :class="{'nav-links-hover':navIndex === 5}">{{$t("specialtyMerchant")}}</li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'HeaderNavbar',
  // 新增：接收父组件传递的来源导航索引
  props: {
    sourceNavIndex: {
      type: Number,
      default: -1 // 默认-1表示无传递
    }
  },
  data() {
    return {
      navIndex: '',
      routes: [
        '/', // 首页
        '/auction/allClass', // 全部分类页面路由
        '/auction/single-auction', // 单个拍品（索引2）
        '/auction/auction-session', // 竞拍专场
        '/auction/auction-mch',  // 店铺专场
        '/auction/auction-shop'  // 特色商家
      ]
    }
  },

  created() {
    // 优先使用父组件传递的来源索引，无则按路由匹配
    console.log("sourceNavIndex",this.sourceNavIndex);
    console.log("this.sourceNavIndex !== -1",this.sourceNavIndex !== -1)
    console.log("this.sourceNavIndex < this.routes.length",this.sourceNavIndex < this.routes.length)
    if (this.sourceNavIndex !== -1 && this.sourceNavIndex < this.routes.length) {
      console.log("111111111111111111");
      this.navIndex = this.sourceNavIndex;
    } else {
      console.log("22222222222222");
      this.updateActiveNav(this.$route.path);
    }
  },

  methods: {
    updateActiveNav(currentPath) {
      // 根据当前路径匹配对应的导航索引
      const index = this.routes.findIndex(route => currentPath === route);
      this.navIndex = index !== -1 ? index : '';
    },

    navLink(index) {
      this.navIndex = index;
      // 获取对应索引的路由路径
      const targetPath = this.routes[index];
      // 正常路由跳转（当前窗口）
      this.$router.push(targetPath);
    }
  },

  // 监听路由变化，更新选中状态（仅当无来源索引时生效）
  watch: {
    // ✅ 修改：监听 fullPath（包含参数），而不是 path（只包含路径）
    '$route.fullPath'(newPath) {
      if (this.sourceNavIndex === -1) {
        this.updateActiveNav(this.$route.path); // 还是匹配path，只是监听更全面
      }
    },
    sourceNavIndex(newVal) {
      if (newVal !== -1 && newVal < this.routes.length) {
        this.navIndex = newVal;
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.navbar {
  background-color: #B21E2E;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  top: 172px;
  width: 100%;
  z-index: 3;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-links {
  display: flex;
  list-style: none;
  align-items: center;
}

.nav-links li {
  margin-left: 20px;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-size: 16px;
}

.nav-links li:hover {
  background-color: rgba(255, 255, 255);
  color: #B21E2E;
  border-radius: 5px;
  box-shadow: 2px 2px 1px #B21E2E , 3px 3px 1px #fff;
  padding-left:10px;
  transform: translateY(-2px);
}

.nav-links-hover{
  background-color: rgba(255, 255, 255);
  color: #B21E2E;
  border-radius: 5px;
  box-shadow: 2px 2px 1px #B21E2E , 3px 3px 1px #fff;
  padding-left:10px;
  transform: translateY(-2px);
}

.nav-links li.shop-btn {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-links li.shop-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    align-items: flex-start;
  }


  .nav-links {
    flex-wrap: wrap;
    width: 100%;
  }

  .nav-links li {
    margin: 5px;
    font-size: 14px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .nav-links {
    justify-content: space-between;
  }

  .nav-links li {
    flex: 1;
    text-align: center;
    margin: 2px;
    font-size: 13px;
    padding: 5px 8px;
  }
}
</style>
