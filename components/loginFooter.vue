<template>
  <div class="footer">
    <div class="inside">
      <div class="d1">
        <template v-for="(item,index) in mchCoupon.list">
          <a href="javascript:;" @click="toUrl(item.link)">{{item.name}}</a>
          <i v-if="handleShowIcon(index)">|</i>
        </template>
      </div>
      <div class="d2">
        <a href="javascript:;" @click="openCookieSettings">{{ $t('cookieConsent.title') }}</a>
        <i>|</i>
        <!-- <a :href="mchCoupon.authority"
              >Copyright&nbsp;©&nbsp;2017&nbsp;{{mchCoupon.archival}}&nbsp;&nbsp;</a
            >
            <a :href="mchCoupon.authority">{{mchCoupon.copyright}}</a> -->
        <div class="copy" @click="toUrl('ow')" style="cursor: pointer">
          {{ mchCoupon.archival }} {{ mchCoupon.copyright }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mchCoupon: {},
    }
  },
  props: {
    loginData: {}
  },
  created() { },
  mounted() {
    // this.mchCoupon = this.$storage.get('mchCoupon')
    var data = {
      api: 'mall.Index.index',

    }
    this.$Api.doRequest(data).then(res => {
      this.mchCoupon = res.data.mchCoupon || {}
      this.$storage.set('mchCoupon', this.mchCoupon)
      // this.mchCoupon = this.$cookies.get('mchCoupon')
    })
  },
  methods: {
    openCookieSettings() {
      this.$cookieConsent.openSettings()
    },
    toUrl(url) {
      if (url.length <= 0) {
        return;
      } else if (url == 'ow') {
        // location.href = this.mchCoupon.authority
        window.open(this.mchCoupon.authority)
      } else {
        // location.href = type
        window.open(url)

        // this.$router.push({
        //   path: '/my/aboutUs',
        //   query: { type: type }
        // })
      }
      // location.href = url;
      // window.open(url)
      // this.$router.push({path:item})
    },
    handleShowIcon(index) {
      return this.mchCoupon.list.length == index + 1 ? false : true;
    },
  }
}
</script>
<style scoped>
.footer {
  background: #ffffff;
  height: 88px;
}
.footer .inside {
  height: 88px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  justify-content: center;
}
.inside {
  width: 1000px;
  margin: 0 auto;
}
.footer .inside .d1 {
  color: #666666;
  margin: 0 auto 14px auto;
  margin-bottom: 14px;
}
.footer .inside .d1 a:link,
.footer .inside .d1 a:visited {
  color: #666666;
}
.footer .inside .d1 i {
  width: 1px;
  margin: 0 3px;
}
.footer .inside .d2 {
  color: #888888;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer .inside .d2 a:link,
.footer .inside .d2 a:visited {
  color: #888888;
  transition: color 0.2s ease;
}
.footer .inside .d2 a:hover {
  color: #b21e2e;
}
.footer .inside .d2 i {
  font-style: normal;
  margin: 0 6px;
}
</style>
