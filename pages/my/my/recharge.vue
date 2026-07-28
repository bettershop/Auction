<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的钱包" />
    <div class="my-title">
      <p>{{ $t("recharge.title") }}</p>
    </div>

    <div class="card" style="border-bottom: 1px solid #e6e6e6">
      <p class="card-title">{{ $t("recharge.Tips[0]") }}</p>
      <div class="card-row">
        <div class="card-row-left">{{ $t("recharge.Tips[1]") }}</div>
        <div class="card-row-right">
          <el-input
            v-model="total"
            :placeholder="$t('recharge.Tips[7]')"
            style="width: 160px"
            onkeyup="this.value=this.value.match(/\d+\.?\d{0,2}/);this.dispatchEvent(new Event('input'))"
          ></el-input>
          {{ $t("recharge.Tips[2]") }}
        </div>
      </div>
      <div class="card-row">
        <div class="card-row-left">{{ $t("recharge.Tips[11]") }}</div>
        <div class="card-row-right">
          <el-input
            type="textarea"
            v-model="remark"
            :placeholder="$t('recharge.Tips[12]')"
            style="width: 300px"
            maxlength="200"
            show-word-limit
          ></el-input>
        </div>
      </div>
    </div>

    <div class="card">
      <p class="card-title">{{ $t("recharge.Tips[3]") }}</p>
      <div class="card-row">
        <!-- 微信支付 -->
        <div
          v-if="payment.pc_wechat == 1 && $LaiKeCommObject.s_code == 'CNY' "
          :class="{ active: defaultPayStyle == 'wxPay' }"
          @click=" setDefaultPayStyle('wxPay')"
          class="payStyle"
        >
          <img src="~/static/images/wx_pay.png" alt="" />
          <!-- 选中此支付方式 此处通过样式控制 .active>.gouxuan{} -->
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
        <!-- 支付宝支付 -->
        <div
          v-if="payment.pc_alipay == 1 && $LaiKeCommObject.s_code == 'CNY' "
          :class="{ active: defaultPayStyle == 'aliPay' }"
          @click="setDefaultPayStyle('aliPay')"
          class="payStyle"
        >
          <img src="~/static/images/ali_pay.png" alt="" />
          <!-- 选中此支付方式 此处通过样式控制 .active>.gouxuan{} -->
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>

        <!-- PayPal支付 -->
        <div
          v-if="payment.paypal == 1"
          :class="{ active: defaultPayStyle == 'paypal' }"
          class="payStyle"
          @click="setDefaultPayStyle('paypal')"
        >
          <img src="~/static/images/paypal.png" alt="" />
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
        <!-- STRIPE支付 -->
        <div
          v-if="payment.stripe == 1"
          class="payStyle"
          :class="{ active: defaultPayStyle == 'stripe' }"
          @click="setDefaultPayStyle('stripe')"
        >
          <img src="~/static/images/stripe.png" alt="" width="208"  style="height: 48px;"/>
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
      </div>
    </div>

    <div class="codeBox" v-if="code_url">
      <div class="codeBox_left">
        <div v-if="this.payStyle != 'paypal'" id="codeUrl"></div>
        <p v-if="this.payStyle == 'pc_alipay'">
          {{ $t("recharge.Tips[4]") }}
        </p>
        <p v-if="this.payStyle == 'pc_wechat'">{{ $t("recharge.Tips[5]") }}</p>
      </div>
    </div>

    <div class="bottomBtn">
      <el-button type="danger" @click="saveOk">{{
        $t("recharge.Confirm_recharge")
      }}</el-button>
    </div>
    <el-dialog
      :visible.sync="successFlag"
      width="350px"
      top="30vh"
      :show-close="false"
      :close-on-click-modal="false"
      center
    >
      <span style="display: block; text-align: center; font-size: 18px">
        {{ $t("recharge.Recharge_success") }}</span
      >
      <span slot="footer" class="dialog-footer">
        <!-- <el-button size="small" @click="toUrl('index.html')">{{ $t('recharge.Go'}}</el-button> -->
        <el-button
          type="danger"
          size="small"
          @click="toUrl('/my/my/myWallet')"
          >{{ $t("recharge.myWallet") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pc_user: {},
      payStyle: "pc_wechat",
      codeDisc: "获取验证码",
      total: "",
      code_url: "",
      defaultPayStyle: "balance",//改成跟移动端一致 stripe balance余额 paypal贝宝 aliPay支付宝 wxPay微信
      defaultpayment: {}, //默认支付方式
      paypal_token: "",
      timeI: "",
      successFlag: false,
      captured: false,
      min_cz: 0,
      remark:'',
      payment: {},
      stripe: null // 存储脚本导出的对象
    };
  },
  mounted() {
    this.$emit("pageTitle", "我的钱包");
    this.pc_user = this.$cookies.get("pc_user") || this.$storage.get("user");
    this.codeDisc = this.$t("recharge.Tips[6]");

    // 获取 URL 中的 paypal token
    const urlParams = new URLSearchParams(window.location.search)
    console.log(urlParams)
    const token = urlParams.get('token')
    const PayerID = urlParams.get('PayerID')

    console.log(token)
    if ( token && PayerID ) {

      this.paypal_token = token
      console.log("kaishi capture")
      this.capture()  // 如果需要立即触发支付确认
      console.log("jieshu capture")

      console.log("kaishi timeI")
      this.timeI = setInterval(() => {
        //这里之前用的setInterval，一直调用一直报错
        let sNo = this.$storage.get('cz_sNo') ||this.$cookies.get('cz_sNo');
        this.getResult(sNo);
      }, 3000);
      console.log("jieshu timeI")
    } else {
      this.getApi();
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
  watch: {
    payStyle(val) {
      this.code_url = "";
    },
  },
  destroyed() {
    clearInterval(this.timeI);
  },
  methods: {
    setDefaultPayStyle(type) {
      this.defaultPayStyle = type;
      if (type == 'balance') {
        this.payStyle = 'wallet_pay';
      } else if (type == 'wxPay') {
        this.payStyle = 'pc_wechat';
      } else if (type == 'aliPay') {
        this.payStyle = 'pc_alipay';
      } else if (type == 'paypal') {
        this.payStyle = 'paypal';
      } else if (type == 'stripe') {
        this.payStyle = 'stripe';
      }
    },
    toUrl(url) {
      this.$router.push(url);
    },
    getApi() {
      let data = {
        api: "mall.Recharge.index",


      };

      this.$Api.doRequest(data).then((res) => {
        this.min_cz = res.data.min_cz;
        this.payment = res.data.payment;
        this.defaultpayment = res.data.defaultpayment;
        if(this.defaultpayment ){
          this.defaultPayStyle = this.defaultpayment.defaultpayName
        }
      });
    },
    /*
				获取支付结果
			 */
    getResult(sNo) {
      let data = {
        api: "mall.Order.getCzorder",

        trade_no: sNo,
      };
      if (!this.successFlag) {
        this.$Api.doRequest(data).then((res) => {
          console.log("res", res);

          if (typeof res == "string") {
            res = JSON.parse(res);
          }

          if (res.code == 200 && res.data.code == 200) {
            this.successFlag = true;
          }
        });
      } else {
        clearInterval(this.timeI);
      }
    },
    saveOk() {
      if (this.total <= 0 || !this.total) {
        this.$message.error(this.$t("recharge.Tips[7]"));
        return;
      }
      console.log(this.min_cz, "this.min_cz");
      if (Number(this.total) < Number(this.min_cz)) {
        this.$message.error(this.$t("recharge.Tips[9]") + this.min_cz);
        return;
      }
      let sNo = this.getCZNo();

      var data = {
        api: "mall.Pay.index",


        title: "充值",
        type: this.payStyle, // 支付类型
        total: this.total,
        remarks:this.remark,
        // currency_code: this.$LaiKeCommObject.s_code,
        currency_code: 'USD',
        currency_symbol: this.$LaiKeCommObject.s_symbol,
        exchange_rate: this.$LaiKeCommObject.s_rate,
        sNo: sNo,
      };

      this.$Api.doRequest(data).then((res) => {
        if(res.code == 200){
          this.code_url = res.data;
          if(data.type == 'paypal') {
            this.$storage.set('cz_sNo',sNo);
            this.$cookies.set('cz_sNo',sNo);
            this.code_url = res.data.data
            // window.location.href = this.code_url
            var newWin = window.open('', '_blank');
            newWin.location = this.code_url ;
          }if(data.type == 'stripe') {
                if(res.code == 200){
                    const stripe_id = res.data.stripe_id
                    const publishable_key = res.data.publishable_key

                    // 初始化 Stripe（用你的 publishable key）
                    const stripe = Stripe(publishable_key);

                    // 重定向到 Stripe Checkout
                    stripe.redirectToCheckout({
                      sessionId: stripe_id
                    }).then(function (result) {

                    });
                }else{
                  // this.$message.error(res.message);
                }
          }else{
            setTimeout(() => {
              this.qrCode();
            }, 1000);
          }

          clearInterval(this.timeI);
          this.timeI = setInterval(() => {
            //这里之前用的setInterval，一直调用一直报错
            this.getResult(sNo);
          }, 3000);
        }
      });
    },
    qrCode() {
      console.log(this.code_url);
      document.getElementById("codeUrl").innerHTML = ""; //清除二维码
      var qrcode = new QRCode(document.getElementById("codeUrl"), {
        width: 150,
        height: 150,
      });
      let url = this.code_url;
      qrcode.makeCode(url);
    },
    getCode() {
      this.countdown(60);
    },
    countdown(i) {
      i--;

      this.codeDisc = i + this.$t("recharge.Tips[8]");

      if (i < 1) {
        this.codeDisc = this.$t("recharge.Tips[6]");
        return;
      }

      setTimeout(() => {
        this.countdown(i);
      }, 1000);
    },

    capture() {
      if (this.captured) return
      this.captured = true

      let sno = this.$storage.get('cz_sNo') ||this.$cookies.get('cz_sNo');
      console.log("返回的订单号："+sno)
      const  data = {
        api:'app.pay.capture',
        orderId : this.paypal_token,
        sNo : sno
      }

      this.$Api.doRequest(data).then(res => {
        if(res.code == 200 ){
          // 成功
          console.log("扣款成功")
          this.captured = false
          this.$storage.remove('cz_sNo');
          this.$cookies.remove('cz_sNo');
        } else {
          this.captured = false
        }
      }).catch(e => {
        console.log(e);
        this.captured = false
      })
    },

    //获取充值订单号
    getCZNo() {
      let time = new Date().getTime();
      return (
        "CZ" +
        time +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10) +
        Math.floor(Math.random() * 10)
      );
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/my/recharge.css";
</style>
