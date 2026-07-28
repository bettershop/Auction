<template>
  <div id="app" v-cloak>
    <div class="main" :style="'background:' + login_bgcolor + ';'">
      <div
        class="inside"
        :style="
          'background:url(' +
          login_bg +
          ') no-repeat; background-position: -60px center; background-size: 65% auto; background-color:' +
          login_bgcolor +
          ';'
        "
      >
        <div class="login-box" style="height: 540px">
          <div class="d1">
            <span>{{ $t('register.register') }}</span>
          </div>
          <p style="text-align: center; padding-top: 19px">{{ $t('hwzc') }}</p>
          <div class="d2">
            <input
              @keydown.enter="register"
              class="ipt1"
              maxlength="20"
              type="text"
              :placeholder="$t('register.placeholder[0]')"
              v-model="zhanghao"
            />
            <input
              @keydown.enter="register"
              class="ipt1"
              maxlength="16"
              type="password"
              :placeholder="$t('register.placeholder[1]')"
              v-model="password"
            />
            <div class="d2_1">
              <el-checkbox
                v-model="checked"
                :label="$t('register.Tips[0]')"
              ></el-checkbox>
              <a
                href="javascript:;"
                :title="$t('register.Tips[1]')"
                @click="getAgreement"
                >《{{ Agreement }}》</a
              >
            </div>
            <input
              class="button"
              style="margin-bottom: 70px"
              type="button"
              :value="$t('confirm')"
              @click="register"
            />

            <div class="d2_2" @click="Back" style="cursor: pointer">
              <span>{{ $t('security.Back') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="agreementFlag">
      <div class="agreementContent">
        <div class="mask_title">
          {{ Agreement }}
          <i class="el-icon-close" @click="agreementFlag = false"></i>
        </div>

        <div class="agreementContent_item" v-html="AgreementContent"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'loginLayout',
  data () {
    return {
      login_bg: require('/static/images/login_bg1.png'),
      login_bgcolor: '#F1F4FA', //登录页主体背景颜色
      Agreement: '',
      agreementFlag: false,
      checked: '',
      imgCodeCheck: '',
      codeImg: '', //验证码链接
      timeFlag: true,

      zhanghao: '',
      phone: '',
      password: '',
      keyCode: '',
      imgCode: '',

      time_code: '获取验证码',
      AgreementContent: '',
      pc_user: {},
      mchCoupon: {}
    }
  },
  mounted () {
    this.pc_user = this.$cookies.get('pc_user')
    setTimeout(() => {
      this.mchCoupon = this.$storage.get('mchCoupon')
      $('title').html(
        this.mchCoupon && this.mchCoupon.mallName
          ? `${this.mchCoupon.mallName} - 注册`
          : this.$t('register.title')
      )
      let links = $("link")
        for(let i = 0;i<links.length;i++){
          let link = $(links[i])
          let rel = link[0].rel;
          rel = rel.toLowerCase();
          if(rel.indexOf('icon') > -1){
            link[0].href = this.mchCoupon&&this.mchCoupon?this.mchCoupon.mallIcon:'/favicon.ico'
            break;
          }
        }
    }, 100)
    this.time_code = this.$t('register.placeholder[4]')
    this.getAg()
    this.code_Img()
  },
  methods: {
    getAg () {
      var data = {
        // module: 'app_pc',
        // action: 'login',
        // m: 'user_register_page',
        api: 'mall.Login.userRegisterPage',
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.Agreement = res.data.Agreement
        }
      })
    },
    Back () {
      this.$router.push({ path: '/login/login' })
    },
    /*
			获取注册协议
		 */
    getAgreement () {
      var data = {
        // module: 'app_pc',
        // action: 'login',
        // m: 'register_agreement',
        api: 'mall.Login.registerAgreement',
        type: 0
      }

      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.AgreementContent = res.data.content
          this.agreementFlag = true
        }
      })
    },

    /*
			获取图形验证码
		 */
    code_Img () {
      var data = {
        // module: 'app_pc',
        // action: 'login',
        // m: 'get_code',
        api: 'mall.Login.getCode',
      }

      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.imgCodeCheck = res.data.code
          this.codeImg =
            process.env.VUE_APP_LKT_ROOT_IMG_URL + res.data.code_img
        }
      })
    },

    /*
		 验证码倒计时
		 */
    countdown (i) {
      i--
      if (i > 0) {
        this.time_code = i + this.$t('recharge.Tips[8]')
        setTimeout(() => {
          this.countdown(i)
        }, 1000)
      } else {
        this.time_code = this.$t('register.placeholder[4]')
        this.timeFlag = true
      }
    },
    // 获取手机验证码
    phone_code () {
      if (!this.timeFlag) {
        return
      }

      if (!this.phone) {
        this.$message.error(this.$t('register.Tips[3]'))
        return
      }

      this.timeFlag = false

      var data = {
        // module: 'app',
        // action: 'user',
        // app: 'secret_key',
        api:'mall.User.secretKey',
        phone: this.phone
      }

      this.$Api.doRequest(data)
        .then(res => {
          var { code, data, message } = res
          if (code == 200) {
            this.$message.success(this.$t('register.Tips[4]'))
            this.countdown(60)
          } else if (code == 220) {
            this.timeFlag = true
            this.$message.error(this.$t('register.Tips[5]'))
          } else {
            this.timeFlag = true
          }
        })
        .catch(error => {
          console.log('error', error)
        })
    },
    /*
			点击注册按钮
		 */
    checkval (str) {
      var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      if (reg.test(str)) {
        return true
      } else {
        return false
      }
    },
    register () {
      var reg =
        /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (!this.checked) {
        this.$message.error(this.$t('register.Tips[17]'))
        return
      }
      // if(!reg.test(this.zhanghao)) {
      //     this.$message.error(this.$t('login.Tips[8]'));
      //     return
      // }
      if (this.password == '') {
        this.$message.error(this.$t('login.Tips[5]'))
        return
      }
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'set_username_password',
        api: 'mall.User.setUsernamePassword',
        user_name: this.zhanghao, //用户名
        password: this.password, //密码
        access_id: this.pc_user?.access_id
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.$message.success(this.$t('address_Tips[5]'))
          setTimeout(() => {
            this.$router.push({ path: '/' })
          }, 1500)
        }
      })
    }
  }
}
</script>

<style scoped>
@import '~/assets/css/login/register.css';
</style>
