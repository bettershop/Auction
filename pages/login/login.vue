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
            <!-- 密码登录 -->
            <span :class="{ active: pageId == 1 }" @click="pageId = 1">
              {{ $t("login.tab[0]") }}
            </span>
            <el-divider direction="vertical"></el-divider>
            <!-- 验证码登录 -->
            <span :class="{ active: pageId == 2 }" @click="pageId = 2">
              {{ $t("login.tab[1]") }}
            </span>
          </div>

          <div class="d2">
            <!-- 选择手机登录还是邮箱 -->
            <div class="phone-login-type-wrapper">
              <select
                  v-model="LoginType"
                  @change="LoginTypeChange"
              >
                <option value="1">{{ $t('login.phone') }}</option>
                <option value="2">{{ $t('login.email') }}</option>
              </select>
            </div>
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
                  :placeholder="$t('login.qsrsjh')"
                  class="phone-input"
              />
            </div>
            <!-- 邮箱 -->
            <input
                v-if="LoginType == 2"
                maxlength="20"
                class="ipt1"
                :placeholder="$t('login.qsryx')"
                @keydown.enter="login"
                v-model="e_mail"
            />
            <!-- 密码 -->
            <input
                v-if="pageId == 1"
                type="password"
                maxlength="16"
                class="ipt1"
                :placeholder="$t('login.placeholder[2]')"
                @keydown.enter="login"
                v-model="password"
            />
            <div v-else style="display: flex; width: 320px">
              <!-- 手机验证码 -->
              <input
                  class="ipt1"
                  type="text"
                  :placeholder="$t('login.placeholder[5]')"
                  style="flex: 1"
                  @keydown.enter="login"
                  v-model="keyCode"
              />
              <!-- 获取手机验证码 -->
              <input
                  type="button"
                  class="codeBtn"
                  :disabled="!timeFlag"
                  :style="{
                color: timeFlag ? '#fff' : '#999',
                background: timeFlag ? '#ff4d4d' : '#ddd', // 红色 → 灰色
                cursor: timeFlag ? 'pointer' : 'not-allowed'
                }"
                  :value="time_code"
                  @click="set_code"
              />
            </div>
            <div style="position: relative">
              <!-- 图形验证码 -->
              <input
                  type="text"
                  class="ipt2"
                  :placeholder="$t('login.placeholder[5]')"
                  @keydown.enter="login"
                  v-model="imgCode"
              />
              <!-- 获取图形验证码 -->
              <img class="codeImg" :src="codeImg" @click="code_Img()" alt="" />
              <!-- 图形验证码过期提示 -->
              <div class="codeImgGQ" v-if="codeImgGQ" @click="code_Img()">
                <i class="el-icon-refresh-right"></i>
              </div>
            </div>
            <!-- 登录 -->
            <input
                class="button"
                type="button"
                :value="$t('login.placeholder[6]')"
                @click="login"
            />
            <div class="d2_1">
              <!-- 自动登录 -->
              <!-- <el-checkbox v-if="pageId == 1" v-model="isAutoLogin" :label="$t('login.placeholder[7]')"></el-checkbox> -->
              <!-- 忘记密码 -->
              <nuxt-link to="/login/forgetPassword">
                {{ $t("login.Forget") }}
              </nuxt-link>
            </div>
            <!-- 立即注册 -->
            <div class="d2_2">
              <span>{{ $t("login.Tips[0]") }}</span>
              <nuxt-link to="/login/register">
                {{ $t("login.Register_now") }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: "loginLayout",
  data() {
    return {
      setTime: "", //定时器变量，用于销毁定时器
      codeImgGQ: false, //判断图形验证是否过期，后台写死120秒过期。
      pc_user: {},
      pageId: 1,
      login_bg: require("/static/images/login_bg1.png"),
      login_bgcolor: "#F1F4FA", //登录页主体背景颜色
      codeImg: "", //验证码链接
      imgCodeCheck: "", //对比的验证码
      imgCode: "", //需要提交的验证码
      time_code: "获取验证码",
      timeFlag: true,// 控制是否可点击
      phone: "",
      password: "",
      keyCode: "",
      isAutoLogin: false, //是否自动登录
      isReturn: "",
      mchCoupon: {},
      phoneNumber: '',
      LoginType: 1, //1手机，1邮箱
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
    };
  },
  async mounted() {
    if(!this.$storage.get("cpc")){
      await this.fetchLocationByIp()
    }
    this.getItuList()
    this.pc_user = this.$cookies.get("pc_user");
    setTimeout(() => {
      this.mchCoupon = this.$storage.get("mchCoupon");
      $("title").html(
          this.mchCoupon && this.mchCoupon.mallName
              ? `${this.mchCoupon.mallName} - 登录`
              : this.$t("login.title")
      );
      let links = $("link");
      for (let i = 0; i < links.length; i++) {
        let link = $(links[i]);
        let rel = link[0].rel;
        rel = rel.toLowerCase();
        if (rel.indexOf("icon") > -1) {
          link[0].href =
              this.mchCoupon && this.mchCoupon
                  ? this.mchCoupon.mallIcon
                  : "/favicon.ico";
          break;
        }
      }
    }, 100);
    // 获取链接参数
    var arr = location.search.replace("?", "").split("&");
    var option = {};
    arr.filter((item) => {
      option[item.split("=")[0]] = item.split("=")[1];
    });
    if (option.isReturn) {
      this.isReturn = option.isReturn;
    }
    this.time_code = this.$t("login.placeholder[4]");
    // 自动登录
    if (this.$cookies.get("autoToken")) {
      let data = {
        // module: 'app_pc',
        // action: 'login',
        // m: 'autoLogin',
        api: "mall.Login.autoLogin",
        autoToken: this.$cookies.get("autoToken"),
      };
      this.$Api.doRequest(data)
          .then((res) => {
            this.$cookies.remove("pc_user");
            let user =  res.data;

            this.$storage.set('user', user);
            console.log('写入 localStorage 成功吗？', localStorage.getItem('user'));

            this.$cookies.set("pc_user", user);

            this.$message.success(this.$t("login.Tips[1]"));
            setTimeout(() => {
              if (this.isReturn) {
                history.go(-1);
                return;
              }
              this.$router.push({
                path: "/",
              });
            }, 1000);
          })
          .catch((error) => {
            this.$message.error(error.message);
          });
    }
    this.code_Img();
  },
  //组件销毁时
  beforeDestroy() {
    clearTimeout(this.setTime); //清除定时器
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
    LoginTypeChange() {
      // 登录类型改变时触发
      console.log('Login type changed to:', this.LoginType)
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
    code_Img() {
      this.codeImgGQ = false; //初始化隐藏 图形验证码过期显示
      var data = {
        api: "mall.Login.getCode",
      };
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.imgCodeCheck = res.data.code;
          let tmpCodeImg = res?.data?.code_img;

          if(tmpCodeImg && tmpCodeImg.indexOf("http") == -1){
            this.codeImg = process.env.VUE_APP_LKT_ROOT_IMG_URL + res.data.code_img;
          } else {
            this.codeImg = tmpCodeImg
          }

          //如果存在定时器 先清除原有️定时器
          if (this.setTime != "") {
            clearTimeout(this.setTime);
          }
          //开启新的定时器
          this.setTime = setTimeout(() => {
            this.codeImgGQ = true;
          }, 120000);
        }
      });
    },
    countdown(i) {
      this.timeFlag = false; // 禁用按钮
      this.time_code = i + "s"; // 显示倒计时

      if (i > 1) {
        setTimeout(() => {
          this.countdown(i - 1);
        }, 1000);
      } else {
        // 倒计时结束
        this.time_code = "获取验证码";
        this.timeFlag = true;
      }
    },
    set_code() {
      // 阻止重复点击（已有倒计时中）
      if (!this.timeFlag) return;

      // 手机登录：校验手机号
      if (this.LoginType == 1) {
        if (!this.phone?.trim()) {
          this.$message.error(this.$t('register.Tips[3]')); // "请输入手机号"
          return; // ⚠️ 不继续执行，不启动倒计时
        }
        this.phone_code(); // 发送短信
      }

      // 邮箱登录：校验邮箱
      else if (this.LoginType == 2) {
        if (!this.e_mail?.trim()) {
          this.$message.error(this.$t('login.qsryx')); // "请输入邮箱" —— 你已用此 key 作 placeholder
          return; // ⚠️ 不继续执行，不启动倒计时
        }

        // 基础邮箱格式校验（可选但推荐）
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.e_mail)) {
          this.$message.error(this.$t('login.email_format_error') || '邮箱格式不正确');
          return;
        }
        this.e_mail_code(); // 发送邮件验证码
      }

      // ✅ 只有上面都通过，才启动倒计时！
      this.countdown(60);
    },
    phone_code() {
      const data = {
        api: 'mall.User.secretKey',
        smsType: 2,
        phone: this.phone,
        cpc: this.selectedCountry.code2
      };

      this.$Api.doRequest(data)
          .then(res => {
            if (res.code == 200) {
              this.$message.success(this.$t('register.Tips[4]'));
            } else {
              // 发送失败，恢复按钮可点击状态
              this.timeFlag = true;
              this.$message.error(res.message || '获取验证码失败');
            }
          })
          .catch(() => {
            this.timeFlag = true;
            this.$message.error('网络错误，请重试');
          });
    },
    e_mail_code() {
      this.$Api.doRequest({
        api: 'mall.User.send_email_verification_code',
        e_mail: this.e_mail,
      }).then(res => {
        if (res.code == 200) {
          this.$message.success(this.$t('register.Tips[4]'));
        } else {
          this.timeFlag = true;
          this.$message.error(res.message || '发送失败');
        }
      }).catch(() => {
        this.timeFlag = true;
        this.$message.error('网络错误，请重试');
      });
    },
    // 登录
    login() {
      var data;
      if (this.pageId == 1) {

        if (!this.password) {
          this.$message.error(this.$t("login.Tips[5]"));
          this.code_Img();
          return;
        }

        if (this.password.length < 6) {
          this.$message.error(this.$t("login.Tips[6]"));
          this.code_Img();
          return;
        }

        data = {
          api: "mall.Login.login",
          phone: this.phone, // 账号/手机号码
          password: this.password, // 密码
          e_mail: this.e_mail,
          imgCode: this.imgCode,
          verificationCode: this.imgCodeCheck,
          country_num: this.selectedCountry.num3,
          cpc: this.selectedCountry.code2,
          type: this.LoginType,
        };
        if (this.isAutoLogin) {
          data.isAuto = 1;
        }
      } else {
        if (!this.keyCode) {
          this.$message.error(this.$t("login.Tips[9]"));
          this.code_Img();
          return;
        }

        data = {
          api: "mall.Login.register",
          phone: this.phone, // 账号/手机号码
          e_mail: this.e_mail,
          keyCode: this.keyCode, // 手机验证码
          imgCode: this.imgCode,
          verificationCode: this.imgCodeCheck,
          country_num: this.selectedCountry.num3,
          cpc: this.selectedCountry.code2,
          type: this.LoginType,
        };
      }

      if (!this.imgCode) {
        this.$message.error(this.$t("login.Tips[10]"));
        this.code_Img();
        return;
      }

      //传入语言参数
      this.$Api.doRequest(data).then((res) => {
        var { code, data, message } = res;
        if (code == 200) {

          if (this.isAutoLogin) {
            this.$cookies.set("autoToken", data.autoToken);
          } else {
            this.$cookies.remove("autoToken");
          }

          this.$cookies.set("userId", data.userId);
          this.$cookies.set("pc_user", data);
          this.$storage.set('user', data);

          this.$LaiKeCommObject.setUserCurrency(data.userCurrency|| {});
          this.$LaiKeCommObject.setStoreCurrency(data.storeCurrency|| {});
          this.$LaiKeCommObject.setCurrentCurrencyInfo(data.userCurrency || {})

          console.log(this.$LaiKeCommObject.currentCurrency)

          this.$i18n.setLocale(data.user_lang_code);
          this.$message.success(this.$t("login.Tips[12]"));
          // 缓存公告内容
          // 缓存公告
          this.$storage.set("laike_pcMall_uaerInfo", res.data);
          // 是否提示公告弹窗
          if (this.$cookies.get("versionUpdate") == false) {
          } else {
            if (
                (this.$storage.get("laike_pcMall_uaerInfo").systemMsgType == 2 ||
                    this.$storage.get("laike_pcMall_uaerInfo").systemMsgType == 3) &&
                this.$storage.get("laike_pcMall_uaerInfo").type != 0
            ) {
              this.$cookies.set("versionUpdate", true);
            }
          }

          if (data.y_password == 1) {
            setTimeout(() => {
              if (this.isReturn) {
                history.go(-1);
                return;
              }

              this.$router.push({
                path: "/",
              });
            }, 1000);
          } else {
            this.$router.push({
              path: "/login/setPassword",
            });
          }
        } else {
          this.code_Img();
        }
      });
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/login/login.css";
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

.codeBtn {
  transition: all 0.2s ease;
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

.phone-login-type-wrapper{
  width: 320px;
  height: 50px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding:0 8px;
  box-sizing: border-box;

}

.phone-login-type-wrapper select{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: none !important;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  cursor: pointer;
}
/* 新增：隐藏 select 获取焦点时的默认边框 */
.phone-login-type-wrapper select:focus {
  outline: none !important; /* 移除默认的聚焦边框 */
  box-shadow: none !important; /* 移除可能存在的阴影效果 */
}


.phone-input-wrapper input {
  border: none !important;
  border-radius: 0 4px 4px 0;
  padding: 8px;
  background-color: white;
}

.phone-input-wrapper .el-input__prefix {
  margin-left: 12px;
}

</style>
