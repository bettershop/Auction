<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的订单" />
    <div class="my-title">
      <p>{{ $t('payment.title') }}</p>
    </div>

    <div class="card" style="border-bottom: 1px solid #e6e6e6; padding: 0">
      <div class="card-row">
        <div
          class="card-row-left"
          style="width: auto; font-size: 16px; color: #020202"
        >
          {{ $t('payment.Amount_payable') }}
          <span class="red">{{ $LaiKeCommObject.show_symbol }}{{ $LaiKeCommObject.formatPrice(total) }}</span>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="card-title">{{ $t('payment.long[0]') }}</p>
      <div class="card-row">
        <div
          v-if="payment.wallet_pay == 1"
          class="payStyle"
          :class="{ active: payStyle == 'wallet_pay' }"
          @click="payStyle = 'wallet_pay'"
          style="display: flex; align-items: center; justify-content: center"
        >
          <img src="~/static/images/qianbao.png" alt="" />

          <div style="margin-left: 9px">
            <p
              style="
                font-size: 16px;
                line-height: 16px;
                color: #000000;
                font-weight: bold;
              "
            >
              {{ $t('payment.long[1]') }}
            </p>
            <span
              style="
                font-size: 12px;
                line-height: 11px;
                color: #999999;
                margin-top: 6px;
                text-indent: -3px;
                display: inline-block;
              "
              >（{{$LaiKeCommObject.show_symbol}}{{ user_money }}）</span
            >
          </div>

          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
        <div
          v-if="payment.pc_wechat == 1"
          class="payStyle"
          :class="{ active: payStyle == 'pc_wechat' }"
          @click="payStyle = 'pc_wechat'"
        >
          <img src="~/static/images/wx_pay.png" alt="" />
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>

        <div
          v-if="payment.pc_alipay == 1"
          class="payStyle"
          :class="{ active: payStyle == 'pc_alipay' }"
          @click="payStyle = 'pc_alipay'"
        >
          <img src="~/static/images/ali_pay.png" alt="" />
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>

        <div
          v-if="payment.paypal == 1 "
          class="payStyle"
          :class="{ active: payStyle == 'paypal' }"
          @click="payStyle = 'paypal'"
        >
          <img src="~/static/images/paypal.png" alt="" />
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
        <div
          v-if="payment.paypal == 1 "
          class="payStyle"
          :class="{ active: payStyle == 'stripe' }"
          @click="payStyle = 'stripe'"
          style="margin-top: 12px;"
        >
          <img src="~/static/images/stripe.png" style="width: 100%; height: 48px;"  alt="" />
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
      </div>
    </div>

    <div class="bottomBtn">
      <el-button type="danger" @click="saveOk">{{
        $t('payment.long[2]')
      }}</el-button>
    </div>

    <!-- 余额支付 -->
    <div class="addressMask" v-if="yuepayFlag">
      <div style="height: auto" v-loading="fullscreenLoading">
        <div class="addressMask_title">
          {{ $t('payment.password[0]') }}
          <i class="el-icon-close" @click="yuepayFlag = false"></i>
        </div>

        <div
          class="addressMask_content_item"
          style="justify-content: center; margin: 50px 0"
        >
          <div>{{ $t('payment.password[1]') }}</div>
          <el-input
            :placeholder="$t('payment.password[2]')"
            v-model="password"
            show-password
            style="width: 360px"
          ></el-input>
        </div>

        <div class="addressMask_bottom">
          <div @click="yuepayFlag = false">{{ $t('cancel') }}</div>
          <div @click="savePassword">{{ $t('common_button[2]') }}</div>
        </div>
      </div>
    </div>

    <!-- 没有支付密码弹窗 -->
    <div class="addressMask" v-if="pwdFlag">
      <div class="nopwd" style="height: auto; width: 420px">
        <i class="el-icon-warning-outline"></i>
        <p>{{ $t('payment.long[3]') }}</p>
        <div>
          <el-button @click="pwdFlag = false">{{ $t('cancel') }}</el-button>
          <el-button type="danger" @click="toUrl('/my/my/security')">{{
            $t('payment.set')
          }}</el-button>
        </div>
      </div>
    </div>
    <!-- 没有支付密码弹窗结束 -->
  </div>
</template>

<script>
export default {
  async asyncData ({ app, query }) {
    let pc_user = app.$cookies.get('pc_user')
    let order_id = query.order_id
    return {
      pc_user,
      order_id
    }
  },
  data () {
    return {
      order_id: '',
      payStyle: '',
      codeDisc: '获取验证码',
      total: '',
      user_money: '',

      order_list: '',
      payTitle: '',

      password: '',
      yuepayFlag: false,

      fullscreenLoading: false,

      payment: {},

      pwdFlag: false,
      password_status: 0,
    }
  },
  mounted () {
    this.$emit('pageTitle', '我的订单')
    if (this.$route.query.order_id) {
      this.order_id = this.$route.query.order_id
    }
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    savePassword () {
      if (!this.password) {
        this.$message.error(this.$t('payment.Tips[0]'))
        return
      }

      if (this.password.length < 6) {
        this.$message.error(this.$t('payment.Tips[1]'))
        return
      }

      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'payment_password',
        api: 'mall.User.paymentPassword',

        password: this.password //  密码
      }

      this.fullscreenLoading = true

      this.$Api.doRequest(data)
        .then(res => {
          console.log('输入密码～', res);
          if(res.code == 200){
            this.payResult()
          } else {
            this.$router.push({
              path: '/my/my/myOrder'
            })
          }
          this.fullscreenLoading = false
        })
        .catch(error => {
          this.fullscreenLoading = false
          this.$message.error(error.message)
        })
    },
    splitOrder (callback) {
      var data = {
        api:'mall.Order.leaveSettlement',

        order_list: JSON.stringify(this.order_list)
      }
      this.$Api.doRequest(data).then(res => {
        setTimeout(() => {
          callback()
        }, 100)
      })
    },
    payResult () {
      var data = {
        api:'mall.Pay.walletPay',


        order_list: JSON.stringify(this.order_list),
        type: 'wallet_pay', // 支付方式
        payment_money: this.total
      }

      this.$Api.doRequest(data)
        .then(res => {
            if(res.code == 200){
              this.$message.success(this.$t('payment.Tips[2]'))
              this.fullscreenLoading = false
              this.$router.push({
                path: '/pay/payResult',
                query: {
                  payStyle: 'wallet_pay',
                  order_list: JSON.stringify(this.order_list)
                }
              })
            } else {
              this.$router.push({
                path: '/my/my/myOrder'
              })
            }
        })
        .catch(error => {
          this.fullscreenLoading = false
          this.$message.error(error.message)
        })
    },
    getApi () {
      var data = {
        api:'mall.Order.orderDetails',

        order_id: this.order_id // 次数
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.payment = res.data.payment
          this.user_money = res.data.user_money
          this.total = res.data.z_price
          this.payTitle = res.data.list[0].p_name
          if(this.payment.wallet_pay==1){
              this.payStyle = 'wallet_pay'
          }else if(this.payment.pc_wechat==1){
            this.payStyle = 'pc_wechat'
          }else if(this.payment.pc_alipay==1){
            this.payStyle = 'pc_alipay'
          }
          if(res.data.z_price==0){
            this.payment.pc_wechat=0
            this.payment.pc_alipay=0
          }
          console.log(this.payStyle,this.payment.wallet_pay);
          this.password_status = res.data.password_status

          this.order_list = {
            total: Number.parseFloat(this.total),
            order_id: this.order_id,
            sNo: res.data.sNo
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    saveOk () {
      if(this.payStyle==''){
        this.$message.error('请选择支付方式')
        return
      }
      if (this.payStyle == 'wallet_pay') {
        if (this.password_status == 0) {
          this.pwdFlag = true
          return
        }
        this.yuepayFlag = true
        return
      }

      var payData = {
        api:"mall.Pay.index",
        total: this.order_list.total, //会员特惠 兑换券级别
        remarks: '', //  订单备注
        title: this.payTitle,
        order_list: this.order_list,
        sNo: this.order_list.sNo,
        pay_type: this.payStyle,
        type: this.payStyle, //  支付类型
      }

      this.$cookies.set('payData', payData)
      this.$router.push({
        path: '/pay/scanCode'
      })
    },
    toUrl (url) {
      this.$router.push(url)
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/payment.css';
</style>
