<template>
  <div id="app" v-cloak>
    <!-- 登录背景和登录框 start-->
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
        <div class="login-box">
          <div class="d1">
            <!-- 手机注册 -->
            <span :class="{ active: LoginType == 1 }" @click="LoginType = 1">
              {{ $t("register.tab[0]") }}
            </span>
            <el-divider direction="vertical"></el-divider>
            <!-- 邮箱注册 -->
            <span :class="{ active: LoginType == 2 }" @click="LoginType = 2">
              {{ $t("register.tab[1]") }}
            </span>
          </div>
          <div class="d2">
            <!-- 手机号码（修复后的国家选择器） -->
            <div class="phone-input-group" v-if="LoginType == 1">
              <!-- 国家选择器触发框 -->
              <div
                class="country-select-trigger"
                @click="toggleCountrySelect"
                @blur="handleTriggerBlur"
              >
                <img
                  :src="selectedCountry.national_flag || chinaImg"
                  alt=""
                  class="country-flag"
                />
                <span class="country-name">
                  {{ selectedCountry.name.slice(0, 5) }}...
                </span>
                <span class="country-code">{{ selectedCountry.code2 }}</span>
                <i class="el-icon-arrow-down country-arrow"></i>
              </div>
              <!-- 国家选择器下拉面板（修复层级） -->
              <div
                class="country-select-panel"
                v-show="isCountrySelectOpen"
                ref="countryPanel"
              >
                <!-- 搜索框 -->
                <div class="country-search">
                  <i class="el-icon-search"></i>
                  <input
                    type="text"
                    v-model="countrySearchKey"
                    placeholder="请选择国家/地区"
                    @input="filterCountries"
                    @blur="handlePanelBlur"
                  />
                </div>
                <!-- 国家列表 -->
                <div class="country-list">
                  <div
                    class="country-item"
                    v-for="country in filteredCountries"
                    :key="country.code"
                    @mousedown="selectCountry(country)"
                  >
                    <img
                      :src="country.national_flag || chinaImg"
                      alt=""
                      class="country-item-flag"
                    />
                    <span class="country-item-name">
                      {{ country.name }} ({{ country.code2 }})
                    </span>
                  </div>
                </div>
              </div>
              <!-- 手机号输入框 -->
              <input
                type="text"
                v-model="phone"
                @keydown.enter="register"
                maxlength="11"
                placeholder="请输入手机号"
                class="phone-input"
              />
            </div>
            <!-- 邮箱 -->
            <input
              v-if="LoginType == 2"
              @keydown.enter="register"
              class="ipt1"
              maxlength="20"
              type="text"
              :placeholder="$t('register.placeholder[6]')"
              v-model="e_mail"
            />
            <!-- 其他表单元素（保持不变） -->
            <div style="position: relative">
              <input
                @keydown.enter="register"
                class="ipt3"
                type="text"
                :placeholder="$t('register.placeholder[5]')"
                v-model="keyCode"
              />
              <input
                :style="{
                  color:
                    time_code == $t('register.placeholder[4]') ? '#020202' : '',
                  background:
                    time_code == $t('register.placeholder[4]') ? '#DDDDDD' : ''
                }"
                type="button"
                :value="time_code"
                class="codeBtn"
                @click="set_code"
              />
            </div>
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
              @input="password=password.replace(/[\W]/g,'')"
              class="ipt1"
              maxlength="16"
              type="password"
              :placeholder="$t('register.placeholder[1]')"
              v-model="password"
            />
            <div style="position: relative;">
              <input
                @keydown.enter="register"
                class="ipt2"
                type="text"
                :placeholder="$t('register.placeholder[5]')"
                v-model="imgCode"
              />
              <img class="codeImg" :src="codeImg" @click="code_Img()" alt="" />
              <div class="codeImgGQ" v-if="codeImgGQ" @click="code_Img()">
                <i class="el-icon-refresh-right"></i>
              </div>
            </div>
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
              type="button"
              :value="$t('register.register2')"
              @click="register"
            />
            <div class="d2_2">
              <span>{{ $t('register.Tips[2]') }}</span>
              <nuxt-link to="/login/login">{{
                $t('register.login')
              }}</nuxt-link>
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
      setTime: '',
      codeImgGQ: false,
      zhanghao: '',
      pc_user: {},
      login_bg: require('/static/images/login_bg1.png'),
      login_bgcolor: '#F1F4FA',
      codeImg: '',
      imgCodeCheck: '',
      imgCode: '',
      time_code: '获取验证码',
      timeFlag: true,
      phone: '',
      password: '',
      keyCode: '',
      checked: '',
      Agreement: '',
      agreementFlag: false,
      AgreementContent: '',
      mchCoupon: {},
      LoginType: 1,
      selectedCountry: {
        code2: 'CN',
        dialCode: '+86',
        national_flag: require('/static/images/china.png'),
        name: '中国'
      },
      countries: [],
      filteredCountries: [],
      countrySearchKey: '',
      isCountrySelectOpen: false, // 控制下拉框显示/隐藏
      chinaImg: require('/static/images/china.png'),
      e_mail: ''
    }
  },

  async mounted() {
    if (!this.$storage.get("cpc")) {
      await this.fetchLocationByIp()
    }
    this.getItuList()
    setTimeout(() => {
      this.mchCoupon = this.$storage.get('mchCoupon')
      document.title = this.mchCoupon?.mallName
        ? `${this.mchCoupon.mallName} - 注册`
        : this.$t('register.title')
      const links = document.querySelectorAll('link[rel*="icon"]')
      if (links.length && this.mchCoupon?.mallIcon) {
        links[0].href = this.mchCoupon.mallIcon
      }
    }, 100)
    this.time_code = this.$t('register.placeholder[4]')
    this.getAg()
    this.code_Img()
  },
  beforeDestroy() {
    clearTimeout(this.setTime);
  },
  methods: {
    async fetchLocationByIp() {
      try {
        // 注意：ip-api.com 是 http 协议，如果你的网站是 https，浏览器会阻止混合内容。
        // 生产环境建议使用支持 https 的服务，如 ipapi.co, geoplugin 等。
        // 这里为了演示，我们使用一个支持 https 的镜像或服务。
        // 例如，ipapi.co 的免费版：https://ipapi.co/json/

        // 使用 ipapi.co 作为示例 (支持 https)
        const response = await this.$Api.fetchLocation();
        console.log(response,'response')

        if (response && Object.keys(response).length) {
          const index = response.country_calling_code.indexOf('+')
          if(index>=0){
            const s = response.country_calling_code.slice(index+1)
            this.$storage.set("cpc", s);
          }
        } else {
          throw new Error('未能获取位置信息');
        }
      } catch (err) {
        console.error('IP 定位失败:', err);
        this.error = '无法连接到定位服务，请检查网络。';
      } finally {
        this.loading = false;
      }
    },
    // 切换下拉框显示/隐藏
    toggleCountrySelect() {
      this.isCountrySelectOpen = !this.isCountrySelectOpen
      // 展开时重置搜索并聚焦搜索框
      if (this.isCountrySelectOpen) {
        this.countrySearchKey = ''
        this.filteredCountries = [...this.countries]
        this.$nextTick(() => {
          const searchInput = this.$refs.countryPanel?.querySelector('input')
          searchInput?.focus()
        })
      }
    },
    // 监听面板触发元素失焦
    handleTriggerBlur() {
      setTimeout(() => {
        const panel = this.$refs.countryPanel
        if (!panel?.contains(document.activeElement)) {
          this.isCountrySelectOpen = false
        }
      }, 200)
    },
    // 面板搜索框失去焦点时关闭下拉
    handlePanelBlur() {
      this.isCountrySelectOpen = false
    },
    // 搜索过滤国家
    filterCountries() {
      console.log(this.countrySearchKey,'this.countrySearchKey')
      const key = this.countrySearchKey.trim().toLowerCase()
      this.filteredCountries = key
        ? this.countries.filter(item =>
            item.name.toLowerCase().includes(key) ||
            item.code2.includes(key)
          )
        : [...this.countries]
    },
    // 选择国家
    selectCountry(country) {
      this.selectedCountry = country
      console.log(country,'country')
      this.isCountrySelectOpen = false
      // 选择后聚焦手机号输入框
      this.$nextTick(() => {
        document.querySelector('.phone-input')?.focus()
      })
    },
    // 获取国家列表
    getItuList() {
      this.$Api.doRequest({
        api: 'mall.Login.getItuList',
        keyword: ''
      }).then(res => {
        if (res.code == 200) {
          this.countries = res.data
          this.filteredCountries = res.data
          const s = this.$storage.get("cpc") || '86'
          this.selectedCountry = this.countries.find(item => item.code2 === s)
          console.log(this.selectedCountry ,'this.selectedCountry ')
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    // 其他原有方法（getAg、getAgreement、code_Img、countdown等）保持不变
    getAg () {
      this.$Api.doRequest({
        api: 'mall.Login.userRegisterPage',
      }).then(res => {
        if (res.code == 200) {
          this.Agreement = res.data.Agreement
        }
      })
    },
    getAgreement () {
      this.$Api.doRequest({
        api: 'mall.Login.registerAgreement',
        type: 0
      }).then(res => {
        if (res.code == 200) {
          this.AgreementContent = res.data.content
          this.agreementFlag = true
        }
      })
    },
    code_Img () {
      this.codeImgGQ = false
      this.$Api.doRequest({
        api: 'mall.Login.getCode',
      }).then(res => {
        if (res.code == 200) {
          this.imgCodeCheck = res.data.code
          this.codeImg = res.data.code_img.includes('http')
            ? res.data.code_img
            : process.env.VUE_APP_LKT_ROOT_IMG_URL + res.data.code_img
          if (this.setTime) clearTimeout(this.setTime)
          this.setTime = setTimeout(()=>{
            this.codeImgGQ = true
          }, 120000)
        }
      })
    },
    countdown (i) {
      i--
      if (i > 0) {
        this.time_code = i + this.$t('recharge.Tips[8]')
        setTimeout(() => this.countdown(i), 1000)
      } else {
        this.time_code = this.$t('login.placeholder[4]')
        this.timeFlag = true
      }
    },
    set_code () {
      if (this.LoginType == 1) {
        this.phone_code()
      } else {
        this.e_mail_code()
      }
    },
    phone_code () {
      if (!this.timeFlag || !this.phone) {
        if (!this.phone) this.$message.error(this.$t('register.Tips[3]'))
        return
      }
      this.timeFlag = false
      this.$Api.doRequest({
        api:'mall.User.secretKey',
        smsType: 2,
        phone: this.phone,
        cpc: this.selectedCountry.code2
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(this.$t('register.Tips[4]'))
          this.countdown(60)
        } else {
          this.timeFlag = true
        }
      }).catch(() => {
        this.timeFlag = true
      })
    },
    e_mail_code () {
      if (!this.timeFlag || !this.e_mail) {
        if (!this.e_mail) this.$message.error('请输入邮箱')
        return
      }
      this.timeFlag = false
      this.$Api.doRequest({
        api:'mall.User.send_email_verification_code',
        e_mail: this.e_mail,
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(this.$t('register.Tips[4]'))
          this.countdown(60)
        } else {
          this.timeFlag = true
        }
      }).catch(() => {
        this.timeFlag = true
      })
    },
    checkval (str) {
      return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(str)
    },
    register () {
      if (!this.zhanghao) return this.$message.error(this.$t('register.Tips[7]'))
      if (!this.checkval(this.zhanghao)) return this.$message.error(this.$t('register.Tips[8]'))
      if (!this.password) return this.$message.error(this.$t('register.Tips[9]'))
      if (this.password.length < 6) return this.$message.error(this.$t('register.Tips[10]'))
      if (this.password.includes(' ')) return this.$message.error(this.$t('register.Tips[11]'))
      if (!this.keyCode) return this.$message.error(this.$t('register.Tips[14]'))
      if (!this.imgCode) return this.$message.error(this.$t('register.Tips[15]'))
      if (!this.checked) return this.$message.error(this.$t('register.Tips[17]'))

      this.$Api.doRequest({
        api: 'mall.Login.userRegister',
        userId: this.zhanghao,
        phone: this.phone,
        password: this.password,
        e_mail: this.e_mail,
        imgCode: this.imgCode,
        imgCodeToken: this.imgCodeCheck,
        keyCode: this.keyCode,
        country_num: this.selectedCountry.num3,
        type: this.LoginType == 1 ? 0 : 1,
        cpc: this.selectedCountry.code2
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message)
          setTimeout(() => this.$router.push('/login/login'), 1000)
        } else {
          this.code_Img()
        }
      })
    }
  }
}
</script>

<style scoped>
@import '~/assets/css/login/register.css';
/* 手机号输入组（触发框+输入框） */
.phone-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 320px;
  height: 50px;
  margin-top: 24px;
  position: relative;
  background-color: #fff;
}

/* 国家选择器触发框 */
.country-select-trigger {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
  cursor: pointer;
  border-right: 1px solid #dcdfe6;
  min-width: 100px;
}
.country-flag {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
.country-name {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 4px;
}
.country-code {
  font-size: 14px;
  color: #333;
  margin-right: 4px;
}
.country-arrow {
  font-size: 12px;
  color: #999;
}

/* 国家选择器下拉面板（修复层级和定位） */
.country-select-panel {
  position: absolute;
  top: 55px;
  left: 0;
  width: 200px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  z-index: 9999; /* 提高层级确保显示 */
}
.country-search {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
}
.country-search i {
  font-size: 14px;
  color: #999;
  margin-right: 8px;
}
.country-search input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 4px 0;
}
.country-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
}
.country-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}
.country-item:hover {
  background-color: #f5f7fa;
}
.country-item-flag {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
.country-item-name {
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 手机号输入框 */
.phone-input {
  flex: 1;
  height: 100%;
  border: none;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
}
</style>
