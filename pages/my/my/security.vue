<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="账号安全" />

    <div class="my-title">
      <p>{{ $t("security.title") }}</p>
    </div>

    <div class="list">
      <i class="el-icon-lock"></i>

      <div>
        <p>{{ $t("security.login_password") }}</p>
        <span>{{ $t("security.long[0]") }}</span>
      </div>

      <el-button @click="mimaMaskFlag = true">{{
        $t("security.modify")
      }}</el-button>
    </div>

    <div class="list">
      <!-- <i class="el-icon-lock"></i> -->
      <img
        src="~/static/images/security_pwd.png"
        style="padding: 0 2px; margin-right: 15px"
      />

      <div>
        <p>{{ $t("security.Payment_password") }}</p>
        <span v-if="password_staus">{{ $t("security.long[1]") }}</span>
        <span v-else>{{ $t("security.long[2]") }}</span>
      </div>

      <el-button v-if="password_staus" @click="pwdFlag = true">{{
        $t("security.modify")
      }}</el-button>
      <el-button v-else @click="pwdFlag = true">{{
        $t("security.set")
      }}</el-button>
    </div>

    <div class="list">
      <i class="el-icon-mobile-phone"></i>

      <div>
        <p>{{ $t("security.phone") }}</p>
        <span>{{ $t("security.long[3]") }}:{{ old_tel }}</span>
      </div>

      <el-button @click="telMaskFlag = true">{{
        $t("security.modify")
      }}</el-button>
    </div>

    <!-- 修改密码 -->
    <div class="mask" v-if="mimaMaskFlag">
      <div class="mimaMask">
        <div class="mask_title">
          {{ $t("security.long[4]") }}
          <i class="el-icon-close" @click="mimaMaskFlag = false"></i>
        </div>

        <ul class="mimaMask_content">
          <!-- 原密码 -->
          <li>
            <div class="mimaMask_content_left">
              {{ $t("security.password[0]") }}
            </div>

            <div class="mimaMask_content_right">
              <el-input
                type="password"
                maxlength="16"
                class="flex1"
                v-model="old_pwd"
                :placeholder="$t('security.placeholder[0]')"
              ></el-input>
            </div>
          </li>
          <!-- 新密码 -->
          <li>
            <div class="mimaMask_content_left">
              {{ $t("security.password[1]") }}
            </div>

            <div class="mimaMask_content_right">
              <el-input
                @input="new_pwd = new_pwd.replace(/[\W]/g, '')"
                type="password"
                maxlength="16"
                class="flex1"
                v-model="new_pwd"
                :placeholder="$t('security.placeholder[1]')"
              ></el-input>
            </div>
          </li>
          <!-- 确认密码 -->
          <li>
            <div class="mimaMask_content_left">
              {{ $t("security.password[2]") }}
            </div>

            <div class="mimaMask_content_right">
              <el-input
                @input="confirm_pwd = confirm_pwd.replace(/[\W]/g, '')"
                type="password"
                maxlength="16"
                class="flex1"
                v-model="confirm_pwd"
                :placeholder="$t('security.placeholder[2]')"
              ></el-input>
            </div>
          </li>
          <!-- 验证码 -->
          <!-- <li>
            <div class="mimaMask_content_left">
              {{ $t('security.password[3]') }}
            </div>

            <div class="mimaMask_content_right" style="flex: initial;">
              <div>
                <el-input
                  class="flex1"
                  v-model="imgCode"
                  :placeholder="$t('security.placeholder[3]')"
                ></el-input>
              </div>
              <img class="codeImg" :src="codeImg" @click="code_Img()" alt="" />
              <div class="codeImgGQ" v-if="codeImgGQ" @click="code_Img()">
                <i class="el-icon-refresh-right"></i>
              </div>
            </div>
          </li> -->
        </ul>

        <div class="mask_btnBox">
          <!-- 取消 -->
          <a
            class="mask_btnBox_href1"
            href="javascript:;"
            @click="mimaMaskFlag = false"
            >{{ $t("cancel") }}</a
          >
          <!-- 保存 -->
          <a class="mask_btnBox_href2" href="javascript:;" @click="saveMima">{{
            $t("common_button[1]")
          }}</a>
        </div>
      </div>
    </div>
    <!-- 修改密码结束 -->

    <!-- 设置支付密码 -->
    <div class="mask" v-if="pwdFlag">
      <div class="mimaMask">
        <div class="mask_title">
          {{ password_staus ? $t("security.modify") : $t("security.set")
          }}{{ $t("security.Payment_password") }}
          <i class="el-icon-close" @click="pwdFlag = false"></i>
        </div>

        <ul class="mimaMask_content">
          <li>
            <div class="mimaMask_content_left">
              {{ $t("security.phone") }}
            </div>

            <div class="mimaMask_content_right">
              {{ y_mobile }}
            </div>
          </li>

          <li>
            <div class="mimaMask_content_left">
              {{ $t("security.phone2[2]") }}
            </div>
            <div class="mimaMask_content_right">
              <!-- 手机验证码 -->
              <el-input
                class="input-with-select flex1"
                v-model="pwd_code"
                :placeholder="$t('security.placeholder[4]')"
                style="width: 420px"
              >
                <!-- 获取手机验证码 -->
                <el-button
                  :style="{
                    color:
                      codeDisc1 != $t('security.placeholder[5]')
                        ? ''
                        : '#000000',
                  }"
                  slot="append"
                  @click="getCode1(y_mobile, 5)"
                  :disabled="codeDisc1 != $t('security.placeholder[5]')"
                  >{{ codeDisc1 }}</el-button
                >
              </el-input>
            </div>
          </li>

          <li>
            <div class="mimaMask_content_left">
              {{ $t("security.password[1]") }}
            </div>

            <div class="mimaMask_content_right">
              <el-input
                type="password"
                maxlength="6"
                class="flex1"
                v-model="pwd_new"
                :placeholder="$t('security.placeholder[6]')"
              ></el-input>
            </div>
          </li>

          <li>
            <div class="mimaMask_content_left">
              {{ $t("security.password[2]") }}
            </div>

            <div class="mimaMask_content_right">
              <el-input
                type="password"
                maxlength="6"
                class="flex1"
                v-model="pwd_confirm"
                :placeholder="$t('security.placeholder[2]')"
              ></el-input>
            </div>
          </li>

          <!-- <li>
            <div class="mimaMask_content_left">
              {{ $t('security.password[3]') }}
            </div>
            <div class="mimaMask_content_right" style="flex: initial;">
              <div>
                <el-input
                  class="flex1"
                  v-model="imgCode"
                  :placeholder="$t('security.placeholder[3]')"
                ></el-input>
              </div>
              <img class="codeImg" :src="codeImg" @click="code_Img()" alt="" />
              <div class="codeImgGQ" v-if="codeImgGQ" @click="code_Img()">
                <i class="el-icon-refresh-right"></i>
              </div>
            </div>
          </li> -->
        </ul>

        <div class="mask_btnBox">
          <a
            class="mask_btnBox_href1"
            href="javascript:;"
            @click="pwdFlag = false"
            >{{ $t("cancel") }}</a
          >
          <a class="mask_btnBox_href2" href="javascript:;" @click="savePwd">{{
            $t("common_button[1]")
          }}</a>
        </div>
      </div>
    </div>
    <!-- 设置支付密码结束 -->

    <!-- 修改手机号 -->
    <div class="mask" v-if="telMaskFlag">
      <div class="mimaMask">
        <div class="mask_title">
          {{ $t("security.modify_phone") }}
          <i class="el-icon-close" @click="telMaskFlag = false"></i>
        </div>

        <ul class="steps">
          <li
            v-for="(item, index) of stepsList"
            :key="index"
            :class="{ active: activeIndex >= index }"
          >
            <i v-if="index > 0"></i>
            <div>{{ index + 1 }}</div>
            <span
              v-if="$t('cancel') == 'cancel' && index == 0"
              style="right: -35px"
              >{{ item }}</span
            >
            <span v-else>{{ item }}</span>
          </li>
        </ul>

        <div class="masktel_content" v-if="activeIndex != 2">
          <div class="prompt">
            {{ $t("security.long[6]") }}
          </div>

          <div class="masktel_list">
            <div class="masktel_list_left">
              {{
                activeIndex == 0
                  ? $t("security.phone2[0]")
                  : $t("security.phone2[1]")
              }}
            </div>
            <div class="masktel_list_right">
              <span v-if="activeIndex == 0">{{ old_tel }}</span>
              <el-input
                v-else
                class="flex1"
                v-model="new_tel"
                :placeholder="$t('security.placeholder[7]')"
              ></el-input>
            </div>
          </div>

          <div class="masktel_list">
            <div class="masktel_list_left">
              {{ $t("security.phone2[2]") }}
            </div>
            <div class="masktel_list_right">
              <!-- 第一步 身份认证 手机验证码-->
              <el-input
                v-if="activeIndex == 0"
                class="input-with-select flex1"
                v-model="old_code"
                :placeholder="$t('security.placeholder[4]')"
                style="width: 420px"
              >
                <!-- 获取手机验证码 -->
                <el-button
                  slot="append"
                  :style="{
                    color:
                      codeDisc != $t('security.placeholder[5]')
                        ? ''
                        : '#000000',
                  }"
                  @click="getCode('', 3)"
                  :disabled="codeDisc != $t('security.placeholder[5]')"
                  >{{ codeDisc }}</el-button
                >
              </el-input>
              <!-- 第二步 修改手机 手机验证码-->
              <el-input
                v-else
                class="input-with-select flex1"
                v-model="new_code"
                :placeholder="$t('security.placeholder[4]')"
                style="width: 420px"
              >
                <!-- 获取手机验证码 -->
                <el-button
                  slot="append"
                  :style="{
                    color:
                      codeDisc != $t('security.placeholder[5]')
                        ? ''
                        : '#000000',
                  }"
                  @click="getCode(new_tel, 3)"
                  :disabled="codeDisc != $t('security.placeholder[5]')"
                  >{{ codeDisc }}</el-button
                >
              </el-input>
            </div>
          </div>

          <!-- <div class="masktel_list" style="margin-bottom: 50px">
            <div class="masktel_list_left">
              {{ $t('security.password[3]') }}
            </div>
            <div class="mimaMask_content_right" style="flex: initial;">
              <div>
                <el-input
                  class="flex1"
                  v-model="imgCode"
                  :placeholder="$t('security.placeholder[3]')"
                ></el-input>
              </div>
              <img class="codeImg" :src="codeImg" @click="code_Img()" alt="" />
              <div class="codeImgGQ" v-if="codeImgGQ" @click="code_Img()">
                <i class="el-icon-refresh-right"></i>
              </div>
            </div>
          </div> -->
        </div>

        <div v-else class="mask_success">
          <img src="~/static/images/success_h.png" alt="" />
          <p>{{ $t("security.Tips[0]") }}</p>
        </div>

        <div class="mask_btnBox">
          <a
            class="mask_btnBox_href2"
            v-if="activeIndex != 2"
            href="javascript:;"
            @click="afterSave"
            >{{ $t("security.next") }}</a
          >
          <a
            class="mask_btnBox_href2"
            v-else
            href="javascript:;"
            @click="telMaskFlag = false"
            >{{ $t("security.Back") }}</a
          >
        </div>
      </div>
    </div>
    <!-- 修改手机号结束 -->
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    let pc_user = app.$cookies.get("pc_user");

    return {
      pc_user,
    };
  },
  data() {
    return {
      setTime: "", //定时器变量，用于销毁定时器
      codeImgGQ: false, //判断图形验证是否过期，后台写死120秒过期。
      pc_user: {},

      codeDisc: "获取验证码",
      codeDisc1: "获取验证码",

      imgCodeCheck: "",
      codeImg: "",
      mimaMaskFlag: false,

      old_pwd: "",
      new_pwd: "",
      confirm_pwd: "",
      imgCode: "",

      telMaskFlag: false,
      stepsList: ["身份验证", "修改手机", "修改完成"],
      activeIndex: 0,

      old_tel: "", //原手机号
      y_mobile: "", //原手机号
      old_code: "", //原手机号验证码
      authenticationToken: "", //身份token
      new_tel: "", //新手机号
      new_code: "", //新手机号验证码

      timeout: "",

      password_staus: false, //是否设置了支付密码
      pwdFlag: "",
      pwd_code: "", //设置支付密码的验证码
      pwd_new: "", //设置新支付密码
      pwd_confirm: "", //设置支付确认密码
    };
  },
  mounted() {
    this.$emit("pageTitle", "账号安全");
    this.pc_user = this.$cookies.get("pc_user");
    this.stepsList = this.$t("security.stepsList");
    this.codeDisc = this.$t("security.placeholder[5]");
    this.codeDisc1 = this.$t("security.placeholder[5]");
    this.axios();

    this.code_Img();
  },
  watch: {
    pwdFlag(val) {
      this.pwd_code = "";
      this.pwd_new = "";
      this.pwd_confirm = "";
      this.codeDisc = this.$t("security.placeholder[5]");
      this.codeDisc1 = this.$t("security.placeholder[5]");

      this.imgCode = "";

      if (!val) {
        this.code_Img();
      }
    },
    mimaMaskFlag(val) {
      if (!val) {
        this.old_pwd = "";
        this.new_pwd = "";
        this.confirm_pwd = "";
        this.imgCode = "";
        this.code_Img();
      }
    },
    telMaskFlag(val) {
      if (!val) {
        this.activeIndex = 0;
        this.old_code = "";
        this.new_tel = "";
        this.new_code = "";
        this.imgCode = "";
        this.code_Img();
      }
    },
  },
  //组件销毁时
  beforeDestroy() {
    clearTimeout(this.setTime); //清除定时器
  },
  methods: {
    savePwd() {
      // if(!this.pwd_code){
      // 	this.$message.error(this.$t('security.Tips[1]'))
      // 	return
      // }
      if (this.pwd_new.length != 6) {
        this.$message.error(this.$t("security.Tips[2]"));
        return;
      }

      var reg = /\s/;
      if (reg.test(this.pwd_new)) {
        this.$message.error(this.$t("security.Tips[3]"));
        return;
      }

      if (this.pwd_new != this.pwd_confirm) {
        this.$message.error(this.$t("security.Tips[4]"));
        return;
      }
      // if(!this.imgCode){
      // 	this.$message.error(this.$t('security.Tips[5]'))
      // 	return
      // }
      // var imgCode = this.imgCode.toLocaleUpperCase()
      // if(imgCode != this.imgCodeCheck){
      // 	this.$message.error(this.$t('security.Tips[6]'))
      // 	return
      // }

      let data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'set_payment_password',
        api: "mall.User.setPaymentPassword",

        imgToken: this.imgCodeCheck, //图形验证码token
        keyCode: this.imgCode, // 图形验证码
        pcode: this.pwd_code,
        password: this.pwd_new, // 密码
        password1: this.pwd_confirm, // 确认密码
      };
      if (this.password_staus) {
        // data.m = 'modify_payment_password'
        data.api = "mall.User.modifyPaymentPassword";
      }
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.pwdFlag = false;
          this.$message.success(res.message);
          this.axios();
        } else {
          this.code_Img();
        }
      });
    },
    getCode(mobile, type) {
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'secret_key',
        api: "mall.User.secretKey",

        message_type: 0, // 短信类型 0.验证码 1.短信通知
        smsType: type, // 短信类型(3.修改手机号 4.修改密码  5.修改支付密码 6.提现)
      };
      if (type === 3) {
        data.newPhone = mobile;
      }
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.countdown(60);
        }
      });
    },
    getCode1(mobile, type) {
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'secret_key',
        api: "mall.User.secretKey",

        message_type: 0, // 短信类型 0.验证码 1.短信通知
        smsType: type, // 短信类型(3.修改手机号 4.修改密码  5.修改支付密码 6.提现)
      };
      if (type === 3) {
        data.newPhone = mobile;
      }
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.countdown1(60);
        }
      });
    },
    countdown(i) {
      i--;

      this.codeDisc = i + this.$t("recharge.Tips[8]");

      if (i < 1) {
        this.codeDisc = this.$t("security.placeholder[5]");
        return;
      }

      this.timeout = setTimeout(() => {
        this.countdown(i);
      }, 1000);
    },
    countdown1(i) {
      i--;

      this.codeDisc1 = i + this.$t("recharge.Tips[8]");

      if (i < 1) {
        this.codeDisc1 = this.$t("security.placeholder[5]");
        return;
      }

      this.timeout = setTimeout(() => {
        this.countdown1(i);
      }, 1000);
    },
    modifyTel() {
      if (!this.new_tel) {
        this.$message.error(this.$t("security.Tips[7]"));
        return;
      }

      if (!this.new_code) {
        this.$message.error(this.$t("security.Tips[8]"));
        return;
      }

      // if (!this.imgCode) {
      //   this.$message.error(this.$t("security.Tips[5]"));
      //   return;
      // }

      // var imgCode = this.imgCode.toLocaleUpperCase()

      // if(imgCode != this.imgCodeCheck){
      // 	this.$message.error(this.$t('security.Tips[6]'))
      // 	return
      // }

      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'update_phone',
        api: "mall.User.updatePhone",

        authenticationToken: this.authenticationToken,
        newPhone: this.new_tel, // 手机号码
        pCode: this.new_code, // 验证码
        keyCode: this.imgCode, //图形验证码
        imgToken: this.imgCodeCheck, //图形验证码Token
      };
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.activeIndex = 2;
          this.$message.success(res.message);
          this.axios();
        }
      });
    },
    authenUser() {
      if (!this.old_code) {
        this.$message.error(this.$t("security.Tips[8]"));
        return;
      }

      // var imgCode = this.imgCode.toLocaleUpperCase()

      // if(imgCode != this.imgCodeCheck){
      // 	this.$message.error(this.$t('security.Tips[6]'))
      // 	return
      // }

      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'Authentication',
        api: "mall.User.authentication",

        phone: this.y_mobile, // 手机号码
        //imgToken: this.imgCodeCheck, //图形验证码token
        pCode: this.old_code, // 验证码
        keyCode: this.imgCode, //图形验证码
      };
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        // 重新获取验证码
        this.imgCode = "";
        this.code_Img();
        if (res.code == 200) {
          this.activeIndex = 1;
          this.codeDisc = this.$t("security.placeholder[5]");
          this.codeDisc1 = this.$t("security.placeholder[5]");
          this.authenticationToken = res.data.token;
          clearTimeout(this.timeout);
          this.$message.success(res.message);
        } else {
          this.code_Img();
        }
      });
    },
    saveMima() {
      if (!this.old_pwd) {
        this.$message.error(this.$t("security.placeholder[0]"));
        return;
      }
      if (!this.new_pwd) {
        this.$message.error(this.$t("security.placeholder[1]"));
        return;
      }
      if (!this.confirm_pwd) {
        this.$message.error(this.$t("security.Tips[9]"));
        return;
      }
      // if(!this.imgCode){
      // 	this.$message.error(this.$t('security.Tips[5]'))
      // 	return
      // }

      if (this.new_pwd.length < 6) {
        this.$message.error(this.$t("security.Tips[10]"));
        return;
      }

      var reg = /\s/;
      if (reg.test(this.new_pwd)) {
        this.$message.error(this.$t("security.Tips[11]"));
        return;
      }

      if (this.new_pwd != this.confirm_pwd) {
        this.$message.error(this.$t("security.Tips[4]"));
        return;
      }

      // var imgCode = this.imgCode.toLocaleUpperCase()

      // if(imgCode!=this.imgCodeCheck){
      // 	this.$message.error(this.$t('security.Tips[12]'))
      // 	return
      // }
      console.log(this.imgCodeCheck);
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'updatepassword',
        api: "mall.User.updatepassword",

        imgToken: this.imgCodeCheck,
        //keyCode: this.imgCode,
        password: this.old_pwd, // 原密码
        passwordOld: this.new_pwd, // 新密码
        x_password1: this.confirm_pwd, // 新密码
      };
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.mimaMaskFlag = false;
          this.$message.success(this.$t("security.Tips[0]"));
        } else {
          this.code_Img();
        }
      });
    },
    code_Img() {
      this.codeImgGQ = false; //初始化隐藏 图形验证码过期显示
      var data = {
        // module: 'app_pc',
        // action: 'login',
        // m: 'get_code',
        api: "mall.Login.getCode",
      };
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.imgCodeCheck = res.data.code;
          let tmpCodeImg = res?.data?.code_img;
          if (tmpCodeImg && tmpCodeImg.indexOf("http") == -1) {
            this.codeImg =
              process.env.VUE_APP_LKT_ROOT_IMG_URL + res.data.code_img;
          } else {
            this.codeImg = tmpCodeImg;
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
    axios() {
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'account_security',
        api: "mall.User.accountSecurity",

      };
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.password_staus = res.data.password_staus;
          this.old_tel = res.data.mobile;
          this.y_mobile = res.data.mobile;
        }
      });
    },
    afterSave() {
      if (this.activeIndex == 0) {
        this.authenUser();
      } else if (this.activeIndex == 1) {
        this.modifyTel();
      }
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/my/security.css";
</style>
