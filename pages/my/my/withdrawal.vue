<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的钱包" />
    <div class="my-title">
      <p>{{ $t('withdrawal.title') }}</p>
    </div>

    <div class="card">
      <!-- 提现说明 -->
      <div class="card-row txSm">
        <div class="card-row-left" style="width: auto;">
          <img src="../../../static/images/pj.png"/>
        </div>
        <div class="card-row-right txSm-test">
          <div>{{ $t('withdraw_instructions.title') }}</div>
          <div>{{ $t('withdraw_instructions.line1', { min_amount, max_amount, service_charge }) }} </div>
          <div>{{ $t('withdraw_instructions.line2', { symbol: $LaiKeCommObject.show_symbol }) }}</div>
        </div>
      </div>
      <!-- 提现方式 -->
      <div class="card-row">
        <div class="card-row-left">
          {{ $t('txfs') }}
        </div>
        <div class="card-row-right">
          <el-button class="card-chooseType" :class="{active: isChooseType == 1}" type="danger" @click="isChooseType = 1">
          {{ $t('payType.wxzf') }}
          </el-button>
          <el-button class="card-chooseType" :class="{active: isChooseType == 2}" type="danger" @click="isChooseType = 2">
          {{ $t('payType.yhk') }}
          </el-button>
        </div>
      </div>
      <!-- 微信零钱提现 -->
      <div class="card-row" v-if="isChooseType == 1">
        <div class="card-row-left">
          <span style="color: red">*</span>{{ $t('wxh') }}
        </div>
        <div class="card-row-right">
          <el-input
            disabled
            v-model="wxbdmc"
            :placeholder="$t('wxlqts')"
            style="width: 420px"
          ></el-input>
        </div>
      </div>
      <!-- 请选择银行卡 -->
      <div class="card-row" v-if="isChooseType == 2">
        <div class="card-row-left">
          <span style="color: red">*</span>{{ $t('withdrawal.selectBrank') }}
        </div>
        <div class="card-row-right">
          <el-select
            v-model="value"
            class="card-select"
            :placeholder="$t('withdrawal.selectBrankPH')"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button
            class="card-addband"
            type="danger"
            @click="toUrl('/my/my/myBankCard')"
            >{{ $t('withdrawal.addBrank') }}</el-button
          >
        </div>
      </div>
      <!-- 提现金额 -->
      <div class="card-row">
        <div class="card-row-left">
          <span style="color: red">*</span>{{ $t('withdrawal.label[0]') }}
        </div>
        <div class="card-row-right">
          <el-input
            v-model="amoney"
            :placeholder="$t('withdraw_amount_range', { m1: min_amount, m2: max_amount })"
            onkeyup="this.value=this.value.match(/\d+\.?\d{0,2}/);this.dispatchEvent(new Event('input'))"
            @blur="verification"
            style="width: 420px"
          ></el-input>
          <span class="amount_r">
            {{ $LaiKeCommObject.s_symbol }}（{{ $t('withdrawal.Tips[0]') }}{{ money }}{{ $LaiKeCommObject.s_symbol }}，
            <el-link type="primary" @click="AllWithdrawal">{{ $t('withdrawal.Withdrawal_all') }}</el-link>）
          </span>
        </div>
      </div>
      <!-- 手续费 -->
      <div class="card-row">
        <div class="card-row-left">
          <span style="color: red">*</span>{{ $t('service_fee') }}
        </div>
        <div class="card-row-right">
          <el-input
            disabled
            :placeholder="amoney?amoney*serviceCharge:sxfts"
            style="width: 420px"
          ></el-input>
          <span class="amount_r">
            {{$LaiKeCommObject.s_symbol}}
          </span>
        </div>
      </div>
      <!-- 手机号码 -->
      <div class="card-row" v-if="isChooseType == 2">
        <div class="card-row-left">{{ $t('withdrawal.label[5]') }}</div>
        <div class="card-row-right">
          <el-input
            disabled
            v-model="mobile"
            :placeholder="$t('withdrawal.placeholder[4]')"
            style="width: 420px"
          ></el-input>
        </div>
      </div>
      <!-- 验证码 -->
      <div class="card-row" v-if="isChooseType == 2">
        <div class="card-row-left">
          <span style="color: red">*</span>{{ $t('withdrawal.label[6]') }}
        </div>
        <div class="card-row-right">
          <el-input
            v-model="keyCode"
            :placeholder="$t('withdrawal.placeholder[5]')"
            class="input-with-select"
            style="width: 420px"
          >
            <el-button
              slot="append" v-if="codeDisc == $t('withdrawal.placeholder[5]')"
              @click="getCode"

              >{{ codeDisc }}</el-button
            >
            <el-button
              slot="append"

              v-else
              ><span style="opacity: 0.4;">{{ codeDisc }}</span></el-button
            >
          </el-input>
        </div>
      </div>
    </div>

    <!-- 确认提现 -->
    <div class="bottomBtn">
      <el-button type="danger" @click="_saveOk">{{
        $t('withdrawal.Confirm_Withdrawal')
      }}</el-button>
    </div>

    <!-- 身份校验弹窗 -->
    <div class="addressMask" v-if="sfjyShow">
      <div style="height: auto">
        <div class="addressMask_title">
          {{ $t('sfjy') }}
          <i class="el-icon-close" @click="sfjyShow = false"></i>
        </div>
        <div class="addressMask_content_item" style="justify-content: center; margin: 50px 0">
          <div>{{ $t('zsxm') }}</div>
          <el-input :placeholder="$t('qsrzsxm')" v-model="zsName" style="width: 360px"></el-input>
        </div>
        <div class="addressMask_bottom">
          <div @click="sfjyShow = false">{{ $t('cancel') }}</div>
          <div @click="saveOk">{{ $t('common_button[2]') }}</div>
        </div>
      </div>
    </div>
    <!-- 身份校验弹窗结束 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      codeDisc: '获取验证码',
      max_amount: '',//最大提现额度
      min_amount: '',//最小提现额度
      service_charge: '',//手续费
      serviceCharge: 0,//手续费计算比例
      pshd: '',//提现金额提示
      sxfts: '0.00',//手续费提示
      // wxlqts: '您还未绑定微信，请前往移动端绑定',//微信未绑定提示
      wxbdmc: '',//已绑定显示绑定名称
      wx_withdraw: false,//是否已绑定微信号
      zsName: '',//真实姓名
      sfjyShow: false,//提现金额大于2000需要进行身份校验（输入真实姓名）
      unit: '',
      money: '',
      isChooseType: 1,//提现方式：1微信零钱 2银行卡
      amoney: '', //提现金额
      Bank_name: '', //银行名称
      branch: '', //支行名称
      Bank_card_number: '', //银行卡号
      Cardholder: '', //持卡人
      mobile: '', //手机号码
      keyCode: '', //验证码
      options: [],
      value: '',
    }
  },
  mounted () {
    this.$emit('pageTitle', '我的钱包')
	this.pc_user = this.$cookies.get('pc_user')
    this.codeDisc = this.$t('withdrawal.placeholder[5]')
    this.getApi()
    this.axios_bank()
  },
  watch: {
    Bank_card_number (val, old) {
      if (old != '') {
        this.Bank_name = ''
      }
    }
  },
  methods: {
    //限制输入特殊字符
    btKeyUp (e) {
      e.target.value = e.target.value.replace(
        /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#{{$LaiKeCommObject.show_symbol}}%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,
        ''
      )
    },
    verification (e) {
      if (
        e.target.value > this.max_amount ||
        e.target.value < this.min_amount
      ) {
        this.$message.error(this.$t('withdrawal.Tips[5]'))
        this.amoney = ''
      }
    },
    //全部提现
    AllWithdrawal () {
      if(this.money>this.max_amount){
        this.amoney =this.max_amount
      }else{
        this.amoney = this.money
      }

    },
    _saveOk(){
      // 提现金额不能为空
      if (!this.amoney) {
        this.$message.error(this.$t('withdrawal.title2'))
        return
      }
      //提现金额最大最小值
      if (this.amoney > this.max_amount || this.amoney < this.min_amount) {
        this.$message.error(this.$t('withdrawal.Tips[5]'))
        return
      }
      //提现类型判断 isChooseType 1微信 2银行卡
      if(this.isChooseType==1){
        if (this.wx_withdraw == false) {
          this.$message.error('您还未绑定微信，请前往移动端绑定')
          return
        } else {
          //微信提现且金额>=2000,需要输入真实姓名后提现
          if(this.amoney >= 2000){
            this.sfjyShow = true
          } else {
            //直接提现
            this.saveOk()
          }
        }
      } else if(this.isChooseType==2){
        if (this.value == '') {
          this.$message.error('请选择银行卡')
          return
        }
        if (!this.mobile) {
          this.$message.info(this.$t('withdrawal.Tips[3]'))
          return
        }
        if (!this.keyCode) {
          this.$message.error(this.$t('withdrawal.Tips[4]'))
          return
        }
        //直接提现
        this.saveOk()
      }
    },
    saveOk () {
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'withdrawals',
        api: 'mall.User.withdrawals',

        shop_id: '', // 店铺ID(传空)
        amoney: this.amoney, // 提现金额
        // Bank_name:this.Bank_name, // 银行名称
        // branch:this.branch, // 支行名称
        // Bank_card_number:this.Bank_card_number, // 银行卡号
        // Cardholder:this.Cardholder, // 持卡人
        mobile: this.mobile, // 手机号码
        keyCode: this.keyCode, // 验证码
        bankCardId: this.value,
        withdrawStatus: this.isChooseType==1?2:1,//提现类型 1银行卡 2微信余额
        userName: this.zsName,//用户真实姓名
      }
      this.$Api.doRequest(data)
        .then(res => {
          setTimeout(() => {
            this.$router.push('/my/my/myWallet')
          }, 1000)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
				验证银行卡号
			 */
    validation () {
      var data = {
        api:'mall.Bank.verification',


        Bank_name: '',
        Bank_card_number: this.Bank_card_number
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.Bank_name = res.data
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    getCode () {
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'secret_key',
        api: 'mall.User.secretKey',

        phone: this.mobile,
        message_type: 0, // 短信类型 0.验证码 1.短信通知
        smsType: 6 // 短信类别 6.提现
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.countdown(60)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    countdown (i) {
      i--

      this.codeDisc = i + this.$t('recharge.Tips[8]')

      if (i < 1) {
        this.codeDisc = this.$t('withdrawal.placeholder[5]')
        return
      }

      setTimeout(() => {
        this.countdown(i)
      }, 1000)
    },
    toUrl (url) {
		this.$router.push({path:url})
    },
    getApi () {
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'into_withdrawals',
        api: 'mall.User.intoWithdrawals',

        shop_id: '' // 店铺ID(传空)
      }

      this.$Api.doRequest(data)
        .then(res => {
          var data = res.data
          console.log(data)
          this.wxbdmc = data.wx_name
          this.wx_withdraw = data.wx_withdraw
          this.max_amount = data.max_amount
          this.min_amount = data.min_amount
          this.serviceCharge = data.serviceCharge
          this.service_charge = data.service_charge
          this.pshd = null
          this.mobile = data.mobile
          this.money = data.money
          this.unit = data.unit
          this.money = data.money
          this.Bank_card_number = data.bank_information.Bank_card_number
          this.Cardholder = data.bank_information.Cardholder
          this.Bank_name = data.bank_information.Bank_name
          this.branch = data.bank_information.branch
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    axios_bank () {
      var data = {
        // module: 'app_pc',
        // action: 'bank',
        // app: 'bank_list',
        api:'mall.Bank.bankList',
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.options = []
            for (var i = 0; i < res.data.length; i++) {
              this.options.push({
                value: res.data[i].id,
                label:
                  res.data[i].Bank_name +
                  this.$t('withdrawal.tail') +
                  ' ：' +
                  res.data[i].Bank_card_number
              })
              if (res.data[i].is_default == 1) {
                this.value = res.data[i].id
              }
            }
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
@import '~/assets/css/my/withdrawal.css';
/* .amount_r{
  width: 300px;
  display: inline-block;
  float: right;
} */
</style>
