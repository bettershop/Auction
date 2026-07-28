<template>
  <div class="main" :style="'background:' + login_bgcolor + ';'">
    <div
      class="inside"
      :style="
        'background:url(' +
        login_bg +
        ') no-repeat; background-position: -60px center; background-size: 65% auto; background-color:' +
        login_bgcolor +
        ';height: 100%;'
      "
    >
      <div class="login-box">
        <div class="d1">
            <!-- 手机注册 -->
            <span :class="{ active: findType == 1 }" @click="findType = 1">
              {{ $t("register.tab[0]") }}
            </span>
            <el-divider direction="vertical"></el-divider>
            <!-- 邮箱注册 -->
            <span :class="{ active: findType == 2 }" @click="findType = 2">
              {{ $t("register.tab[1]") }}
            </span>
        </div>
        <div class="d2">
     <!-- 手机号码（修复后的国家选择器） -->
            <div class="phone-input-group" v-if="findType == 1">
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

          <!-- 邮箱找回（新增） -->
          <input
            v-if="findType == 2"
            class="ipt1"
            maxlength="50"
            type="text"
            :placeholder="$t('register.placeholder[6]')"
            v-model="e_mail"
          />

          <!-- 验证码输入框 -->
          <div style="position: relative">
            <input
              class="ipt3"
              type="text"
              :placeholder="$t('forget.placeholder[4]')"
              v-model="keyCode"
            />
            <input
              :style="{
                color:
                  time_code == $t('register.placeholder[4]') ? '#020202' : '',
                background:
                  time_code == $t('register.placeholder[4]') ? '#DDDDDD' : ''
              }"
              class="codeBtn"
              type="button"
              :value="time_code"
              @click="getCode"
            />
          </div>

          <!-- 新密码 -->
          <input
            @input="password=password.replace(/[\W]/g,'')"
            class="ipt1"
            type="password"
            maxlength="16"
            :placeholder="$t('forget.placeholder[2]')"
            v-model="password"
          />

          <!-- 确认新密码 -->
          <input
            @input="password1=password1.replace(/[\W]/g,'')"
            class="ipt1"
            type="password"
            maxlength="16"
            :placeholder="$t('forget.placeholder[3]')"
            v-model="password1"
          />

          <!-- 图形验证码 -->
          <div style="position: relative;">
            <input
              class="ipt2"
              type="text"
              :placeholder="$t('forget.placeholder[4]')"
              v-model="imgCode"
            />
            <img class="codeImg" :src="codeImg" @click="code_Img()" alt="" />
            <div class="codeImgGQ" v-if="codeImgGQ" @click="code_Img()">
              <i class="el-icon-refresh-right"></i>
            </div>
          </div>

          <!-- 保存按钮 -->
          <input
            class="button"
            type="button"
            style="padding: 0;"
            :value="$t('common_button[1]')"
            @click="saveOk"
          />
        </div>

        <!-- 返回登录 -->
        <nuxt-link class="toLoginBtn" to="/login/login">{{
          $t('forget.Back_login')
        }}</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'loginLayout',
  data () {
    return {
      // 原有基础数据
      setTime: '',
      codeImgGQ: false,
      login_bg: require('/static/images/login_bg1.png'),
      login_bgcolor: '#F1F4FA',
      title: '找回密码',
      title1: '找回密码',
      title2: '身份验证',
      title3: '重置密码',
      show1: true,
      show2: false,
      show3: false,
      time_code: '获取验证码',
      phone: '',
      timeFlag: true,
      keyCode: '',
      password: '',
      password1: '',
      imgCode: '',
      codeImg: '',
      imgCodeCheck: '',
      mchCoupon: {},

      // ========== 新增：核心切换数据 ==========
      findType: 1, // 1=手机找回，2=邮箱找回
      e_mail: '', // 邮箱地址

      // ========== 区号选择相关数据 ==========
      selectedCountry: {
        code2: 'CN',
        dialCode: '+86',
        national_flag: require('/static/images/china.png'),
        name: '中国'
      },
      countries: [],
      filteredCountries: [],
      countrySearchKey: '',
      isCountrySelectOpen: false,
      chinaImg: require('/static/images/china.png')
    }
  },
  mounted () {
    // 加载国家/区号列表
    this.getItuList()

    // 原有页面初始化逻辑
    setTimeout(() => {
      this.mchCoupon = this.$storage.get('mchCoupon')
      document.title = this.mchCoupon && this.mchCoupon.mallName
        ? `${this.mchCoupon.mallName} - 找回密码`
        : this.$t('forget.title')
      const links = document.querySelectorAll('link[rel*="icon"]')
      if (links.length && this.mchCoupon?.mallIcon) {
        links[0].href = this.mchCoupon.mallIcon
      }
    }, 100)
    this.time_code = this.$t('register.placeholder[4]')
    this.title = this.$t('forget.title2')
    this.code_Img()
  },
  beforeDestroy() {
    clearTimeout(this.setTime);
  },
  methods: {
    // ========== 区号选择核心方法 ==========
    toggleCountrySelect() {
      this.isCountrySelectOpen = !this.isCountrySelectOpen
      if (this.isCountrySelectOpen) {
        this.countrySearchKey = ''
        this.filteredCountries = [...this.countries]
        this.$nextTick(() => {
          const searchInput = this.$refs.countryPanel?.querySelector('input')
          searchInput?.focus()
        })
      }
    },
    handleTriggerBlur() {
      setTimeout(() => {
        const panel = this.$refs.countryPanel
        if (!panel?.contains(document.activeElement)) {
          this.isCountrySelectOpen = false
        }
      }, 200)
    },
    handlePanelBlur() {
      this.isCountrySelectOpen = false
    },
    filterCountries() {
      const key = this.countrySearchKey.trim().toLowerCase()
      this.filteredCountries = key
        ? this.countries.filter(item =>
            item.name?.toLowerCase().includes(key) ||
            item.code2?.includes(key)
          )
        : [...this.countries]
    },
    selectCountry(country) {
      this.selectedCountry = country
      this.isCountrySelectOpen = false
      this.$nextTick(() => {
        document.querySelector('.phone-input-group .ipt1')?.focus()
      })
    },
    getItuList() {
      this.$Api.doRequest({
        api: 'mall.Login.getItuList',
        keyword: ''
      }).then(res => {
        if (res.code == 200) {
          this.countries = res.data
          this.filteredCountries = res.data
          this.selectedCountry = this.countries[0] || this.selectedCountry
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },

    // ========== 新增：获取验证码（适配手机/邮箱） ==========
    getCode() {
      if (!this.timeFlag) return

      if (this.findType == 1) {
        this.phone_code()
      }else {
        this.e_mail_code()
      }
    },

    // 手机验证码
    phone_code() {
      this.timeFlag = false
      const data = {
        api: 'mall.Login.secretKey',
        phone: this.phone,
        smsType: 4,
        type: 0,
        cpc: this.selectedCountry.code2,
        country_num: this.selectedCountry.num3
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.countdown(60)
          this.$message.success(this.$t('forget.Tips[11]'))
        } else {
          this.timeFlag = true
        }
      })
    },

    // 新增：邮箱验证码
    e_mail_code() {
      this.timeFlag = false
      const data = {
        api: 'mall.User.send_email_verification_code',
        e_mail: this.e_mail,
        type: 1
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.countdown(60)
          this.$message.success('验证码已发送至您的邮箱，请查收')
        } else {
          this.timeFlag = true
        }
      }).catch(() => {
        this.timeFlag = true
      })
    },

    // ========== 原有方法（适配手机/邮箱） ==========
    saveOk () {
      // 基础校验
      if (!this.keyCode) {
        this.$message.error(this.$t('forget.Tips[1]'))
        return
      }
      if (!this.password) {
        this.$message.error(this.$t('forget.Tips[2]'))
        return
      }
      if (this.password.includes(' ')) {
        this.$message.error(this.$t('forget.Tips[3]'))
        return
      }
      if (this.password.length < 6) {
        this.$message.error(this.$t('forget.Tips[4]'))
        return
      }
      if (this.password != this.password1) {
        this.$message.error(this.$t('forget.Tips[5]'))
        return
      }
      if (!this.imgCode) {
        this.$message.error(this.$t('forget.Tips[6]'))
        return
      }

      // 手机/邮箱差异化参数
      const data = {
        api: 'mall.Login.forgotpassword',
        keyCode: this.keyCode,
        access_id: this.imgCodeCheck,
        imgCode: this.imgCode,
        password: this.password,
        rpwd: this.password,
        language: this.$cookies.get('currentLang')
      }

      // 手机找回：添加手机号和区号
      if (this.findType == 1) {
        if (!this.phone) {
          this.$message.error(this.$t('forget.Tips[0]'))
          return
        }
        data.phone = this.phone
        data.cpc = this.selectedCountry.code2
      }
      // 邮箱找回：添加邮箱
      else {
        if (!this.e_mail) {
          this.$message.error('请输入邮箱地址')
          return
        }
        data.e_mail = this.e_mail
        data.type = 1 // 标记为邮箱找回
      }

      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.$message.success(this.$t('forget.Tips[8]'))
          setTimeout(() => {
            this.$router.push({ path: '/login/login' })
          }, 1000)
        } else {
          this.code_Img()
        }
      })
    },

    next_one () {
      this.show1 = false
      this.show2 = true
      this.show3 = false
      this.title = this.$t('forget.title3')
    },

    next_two () {
      this.show1 = false
      this.show2 = false
      this.show3 = true
      this.title = this.$t('forget.title4')
    },

    code_Img () {
      this.codeImgGQ = false
      const data = {
        api: 'mall.Login.getCode',
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.imgCodeCheck = res.data.code
          this.codeImg = res.data.code_img.includes('http')
            ? res.data.code_img
            : process.env.VUE_APP_LKT_ROOT_IMG_URL + res.data.code_img
          if(this.setTime != ''){clearTimeout(this.setTime);}
          this.setTime = setTimeout(()=>{
            this.codeImgGQ = true
          },120000)
        }
      })
    },

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
    }
  }
}
</script>

<style scoped>
@import '~/assets/css/login/forgetPassword.css';
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
