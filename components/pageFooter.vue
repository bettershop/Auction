<template>
  <div id="footApp" class="bottom" style="z-index: 100">
    <div class="bottom-content">
      <ul>
        <li v-for="item in mchCoupon?.bottoList&&mchCoupon.bottoList" :class="!item.subheading ? 'qr' : ''">
          <div class="bottom-list">
            <img :src="item.image" alt="" />
          </div>
          <div class="bottom-text" style="width: auto;">
            <p>{{ item.title }}</p>
            <span>{{ item.subheading }}</span>
          </div>
        </li>
        <!-- <li>
        <div class="bottom-list">
          <img src="~/static/images/lightning_delivery.png" alt="" />
        </div>
        <div class="bottom-text">
          <p>{{ $t('footer[1]') }}</p>
          <span>Lightning delivery</span>
        </div>
      </li>
      <li class="qr">
        <div>
          <img src="~/static/images/app_code.png" alt="" />
        </div>
        <p>{{ $t('footer[2]') }}</p>
      </li>
      <li class="qr">
        <div>
          <img src="~/static/images/wx_code.png" alt="" />
        </div>
        <p>{{ $t('footer[3]') }}</p>
      </li> -->
      </ul>
    </div>

    <!-- :style="$t('cancel') == 'cancel' ? 'width:480px;' : ''" -->
    <div class="bottom-nav">
      <ul>
        <!-- '?module=my&action=aboutUs&type=aboutus' -->
        <li @click="toUrl(t.link)" v-for="t in mchCoupon.list">
          {{ t.name }}
        </li>
        <!-- <li @click="toUrl('shopping_process')">
        {{ $t('login.footer[1]') }}
      </li>
      <li @click="toUrl('payment_method')">
        {{ $t('login.footer[2]') }}
      </li>
      <li @click="toUrl('after_sales_issues')">
        {{ $t('login.footer[3]') }}
      </li>
      <li @click="toUrl('return_policy')">
        {{ $t('login.footer[4]') }}
      </li> -->
      </ul>
    </div>
    <div class="cookie-settings" @click="openCookieSettings">
      {{ $t('cookieConsent.title') }}
    </div>
    <!-- 'http://www.laiketui.com/' -->
    <div class="copy" @click="toUrl('ow')" style="cursor: pointer">
      {{ mchCoupon.archival }} {{ mchCoupon.copyright }}
    </div>
  </div>
</template>

<script>
export default {
  async fetch() {
    // this.pc_user = this.$cookies.get('pc_user')
    var data = {
      api: 'mall.Index.index',
    }
    let res = await this.$Api.doRequest(data)
    if (res.code == '200') {
      console.log('81818188181818181', res.data);
      this.mchCoupon = res.data.mchCoupon
    }
  },
  data() {
    return {
      pc_user: {},
      mchCoupon: {}
    }
  },
  props: {
    publicData: {}
  },
  mounted() {
    // async fetch () {
    // this.pc_user = this.$cookies.get('pc_user')
    var data = {
      api: 'mall.Index.index',
    }
    this.$Api.doRequest(data).then(res => {

      if (res.code == '200') {
        this.mchCoupon = res.data.mchCoupon
      }
      console.log('81818188181818181', res);
    })

    // },
  },
  methods: {
    openCookieSettings() {
      this.$cookieConsent.openSettings()
    },
    toUrl(type) {
      if (type.length <= 0) {
        return
      } else if (type == 'ow') {
        // location.href = this.mchCoupon.authority
        window.open(this.mchCoupon.authority)
      } else {
        // location.href = type
        window.open(type)

        // this.$router.push({
        //   path: '/my/aboutUs',
        //   query: { type: type }
        // })
      }
    }
  }
}
</script>

<style lang="scss">
.bottom {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #333333;
  padding-bottom: 15px;
}
.bottom .bottom-content {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 174px;
  box-sizing: border-box;
  margin: 40px auto 20px;
  padding-bottom: 40px;
  border-bottom: 1px solid #4d4d4d;
}
.bottom .bottom-content ul {
  /* width: 1200px; */
  /* margin: auto; */
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.bottom .bottom-content ul li {
  float: left;
  width: 299px;
  height: 134px;
  border-left: 1px solid #4d4d4d;
}
.bottom .bottom-content ul li:nth-child(1) {
  border-left: none;
}

.bottom-list {
  position: relative;
  width: 68px;
  height: 68px;
  margin: auto;
  border-radius: 8px;
  box-sizing: border-box;
}
.bottom-list img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  margin: auto;
}
.bottom-text {
  margin-top: 27px;
  text-align: center;
}
.bottom-content p {
  font-size: 16px;
  line-height: 16px;
  color: #dddddd;
}

.qr p {
  font-size: 14px;
  line-height: 14px;
  margin-top: 20px;
}
.qr img {
  width: 100px;
  height: 100px;
}

.bottom-content span {
  display: block;
  font-size: 14px;
  line-height: 12px;
  color: #999999;
  margin-top: 9px;
}
.qr {
  text-align: center;
}
.qr div {
  width: 150px;
  height: 100px;
  margin: auto;
  /* background-color: #fff; */
}
.bottom-nav {
  /* width: 332px; */
  /* margin: auto; */
  overflow: hidden;
}
.bottom-nav ul {
  margin: auto;
  display: block;
  height: 12px;
  display: flex;
  justify-content: center;
}
.bottom-nav {
  margin-top: 235px;
}
.bottom-nav ul li {
  float: left;
  font-size: 12px;
  line-height: 12px;
  color: #999999;
  padding: 0 5px;
  cursor: pointer;
}
.bottom-nav ul li:not(:last-child) {
  border-right: 1px solid #999999;
}
.cookie-settings {
  margin-top: 14px;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  color: #cfcfcf;
  cursor: pointer;
  transition: color 0.2s ease;
}
.cookie-settings:hover {
  color: #e7b65f;
}
.copy {
  margin-top: 14px;
  text-align: center;
  font-size: 12px;
  line-height: 12px;
  color: #999999;
}
</style>
