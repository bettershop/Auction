<template>
  <div id="app">
    <div class="orderDetail">
      <p>{{ $t('scanCode[0]') }}</p>

      <div>
        <div class="orderDetail_left">
          <p>
{{ $t('scanCode[1]') }}{{ payData.order_list ? payData.order_list.sNo : '' }}
          </p>
          <div v-if="order_failure !== '' && order_failure !== undefined && order_failure !== null">
            {{ $t('scanCode[2]') }}
            <span >{{ order_failure }}{{ $t('scanCode[3]') }}</span>
            {{ $t('scanCode[4]') }}
          </div>
        </div>

        <div class="orderDetail_right">
            {{ $t('scanCode[5]') }}<span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(payData.total) }}</span>
        </div>
      </div>
    </div>
    <div class="codeBox">
      <div class="codeBox_left">
        <div v-if="payData.type != 'paypal' && payData.type != 'stripe'" id="codeUrl"></div>
        <p v-if="payData.type == 'pc_alipay'">{{ $t('scanCode[6]') }}</p>
        <p v-if="payData.type == 'pc_wechat'">{{ $t('scanCode[7]') }}</p>
      </div>
      <img v-if="payData.type == 'pc_wechat'" class="codeBox_right" src="~/static/images/saoyisao.png" alt="" />
      <img v-if="payData.type == 'pc_alipay'" class="codeBox_right_zfb" src="~/static/images/zfbsys.png" alt="" />
      <img v-if="payData.type == 'paypal'" class="codeBox_right_zfb" src="~/static/images/paypal_show.png" alt="" />
      <img v-if="payData.type == 'stripe'" class="codeBox_right_zfb" src="~/static/images/stripe.png" alt="" />
    </div>
  </div>
</template>
<script>
export default {
  layout: 'homeLayout',
  data () {
    return {
      payData: {},
      paypal_token:null,
      code_url: '',
      timeI: '',
      order_failure: '', //待支付订单过期时间
      captured: false, // 防止重复捕获
      stripeLoaded: false, // 标记脚本是否加载完成
      stripe: null // 存储脚本导出的对象
    }
  },
  mounted () {

    this.payData = this.$cookies.get('payData')
    this.pc_user = this.$cookies.get('pc_user') || this.$storage.get('user')

    this.$LaiKeCommObject.show_symbol = this.$cookies.get('selectCurrency')?.currency_symbol || '￥';
    this.$LaiKeCommObject.show_rate = this.$cookies.get('selectCurrency')?.exchange_rate || 1;

    // 获取 URL 中的 paypal token
    const urlParams = new URLSearchParams(window.location.search)
    console.log(urlParams)
    const token = urlParams.get('token')
    const PayerID = urlParams.get('PayerID')

    console.log(token)
    if (token && PayerID) {
      this.paypal_token = token
      console.log("==============>"+this.paypal_token)
      console.log("==============>"+PayerID)
      this.capture();  // 如果需要立即触发支付确认
      console.log("=======>capture<==")
      this.setTime();
      console.log("=======>setTime<==")
    } else {
      this.getOrderStatus()
      this.getApi()
    }
      if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.type = 'text/javascript'
      script.async = true

      // 脚本加载完成后的回调
      script.onload = () => {
        console.log('Stripe 脚本加载完成')
        this.stripeLoaded = true
        this.stripe = window.Stripe('你的公钥') // 初始化 Stripe
        console.log('Stripe 初始化完成', this.stripe)
      }

      // 脚本加载失败处理
      script.onerror = () => {
        console.error('Stripe 脚本加载失败')
      }

      document.head.appendChild(script)
    } else {
      // 如果已加载直接初始化
      this.stripeLoaded = true
      this.stripe = window.Stripe('你的公钥')
      console.log('Stripe 初始化完成', this.stripe)

    }
  },
  destroyed () {
    clearInterval(this.timeI)
  },
  methods: {
    getApi () {

      var data = this.$cookies.get('payData')
      data.order_list = JSON.stringify(data.order_list)
      data.access_id = this.pc_user.access_id
      this.$Api.doRequest(data).then(res => {

        if(res.code == 200){
          if(data.type == 'paypal') {
            this.code_url = res.data.data
            // window.location.href = this.code_url
            var newWin = window.open('', '_blank');
            newWin.location = this.code_url ;
          }if(data.type == 'stripe') {
            const stripe_id = res.data.stripe_id
            const publishable_key = res.data.publishable_key
            // 初始化 Stripe（用你的 publishable key）
            const stripe = Stripe(publishable_key);
            // 重定向到 Stripe Checkout
            stripe.redirectToCheckout({
              sessionId: stripe_id
            })
          } else {
            this.code_url = res.data
            this.qrCode()
          }
          this.setTime()
        }else{
          this.$message.error(res.message)
        }
      })
    },
    qrCode () {
      console.log('生成二维码', document.getElementById('codeUrl'))
      var qrcode = new QRCode(document.getElementById('codeUrl'), {
        width: 150,
        height: 150
      })

      let url = this.code_url
      console.log('qrcode',qrcode )
      console.log('url', url)
      qrcode.makeCode(url)
    },
    // 获取订单状态
    setTime () {
      this.timeI = setInterval(() => {

        console.log("<<<<=======>>>>")
        this.getOrderStatus()
      }, 3000)
    },
    splitOrder (callback) {
      var data = {
        api:'mall.Order.leaveSettlement',
        // access_id:this.payData.access_id,

        order_list: JSON.stringify(this.payData.order_list)
      }

      this.$Api.doRequest(data).then(res => {
        setTimeout(() => {
          callback()
        }, 100)
      })
    },
    capture() {
      if (this.captured) return
      this.captured = true

      const  data = {
        api:'app.pay.capture',
        orderId : this.paypal_token,
        sNo : this.payData.order_list.sNo
      }

      this.$Api.doRequest(data).then(res => {
        if(res.code == 200 ){
          this.captured = false
          // 成功
          console.log("商品扣款成功")
        } else {
          this.captured = false
        }
      }).catch(e => {
        this.captured = false
        console.log(e);
      })
    },
    getOrderStatus () {
      var data = {
        api:'mall.Order.orderDetails',
        order_id: this.payData.order_list.order_id ,// 次数
        access_id:this.pc_user.access_id
      }
      if (this.payData.trade_no !== undefined && this.payData.trade_no !== null && this.payData.trade_no !== '') {
        data.trade_no = this.payData.trade_no;
      }

      this.$Api.doRequest(data)
        .then(res => {

          var status = res.data.status
          if (!this.order_failure) {
            this.order_failure = res.data.order_failure
          }
          if (status == 1) {
            this.$message.success(this.$t('scanCode[8]'))
              this.$router.push({
              path: '/pay/payResult',
              query: {
                payStyle: this.payData.type,
                trade_no: this.payData.trade_no,
                order_list: JSON.stringify(this.payData.order_list)
              }
            })
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/pay/scanCode.css';
</style>
