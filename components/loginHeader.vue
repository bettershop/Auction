<template>
  <div class="header">
    <div class="inside">
      <div style="cursor: pointer">
        <nuxt-link to="/">
          <img class="logo" :src="mchCoupon.mallLogo" />
        </nuxt-link>
      </div>
      <div class="icon">
        <div v-if="handleIsShow(`1`)">
          <img :src="home" />
          <nuxt-link to="/">{{ $t('login.title2') }}</nuxt-link>
        </div>
        <el-divider direction="vertical" v-if="handleBannerShow()"></el-divider>
        <div v-if="handleIsShow(`2`)">
          <img :src="download" />
          <a href="http://app.laiketui.net/k5mr">{{
            $t('home.Download_app')
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      logo: require('/static/images/login_logo.png'),
      home: require('/static/images/login_home.png'),
      download: require('/static/images/login_download.png'),
      mchCoupon: {}
    }
  },
  props: {
    loginData: {}
  },
  created () {},
  mounted () {
    // this.mchCoupon = this.$cookies.get('mchCoupon')
    // getApi() {
        var data = {
          api:'mall.Index.index',

        }
        this.$Api.doRequest(data).then(res => {
          this.mchCoupon = res.data.mchCoupon || {}
          this.$storage.set('mchCoupon', this.mchCoupon)
          // this.mchCoupon = this.$cookies.get('mchCoupon')
        })
      // },
  },
  methods: {
    handleIsShow (val) {
      if (this.mchCoupon.shortcutMenu2?.indexOf(val) == -1) {
        return false
      } else {
        return true
      }
    },
    handleBannerShow () {
      if (
        this.mchCoupon.shortcutMenu2?.indexOf('1') == -1 ||
        this.mchCoupon.shortcutMenu2?.indexOf('2') == -1
      ) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style scoped>
.header {
    background: #ffffff;
    height: 80px;
}
.header .inside {
    height: 80px;
    display: flex;
    justify-content: space-between;
}
.inside {
    width: 1000px;
    margin: 0 auto;
}
.header .inside div {
    text-align: center;
}
.header .inside .icon {
    height: 17px;
    line-height: 17px;
    display: flex;
    margin: auto 0;
    color: #666666;
    font-size: 16px;
}
.header .inside .icon img {
    width: 16px;
    height: 16px;
}
.header .inside .icon a:link, .header .inside .icon a:visited {
    color: #666666;
}
.header .el-divider--vertical {
    margin: 0 14px;
}
.header .inside .logo {
    width: 174px;
    height: 51px;
    margin-top: 15px;
}
</style>
