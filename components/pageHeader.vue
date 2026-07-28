<template>
  <!-- span标签是为了头部能吸顶，且不影响弹窗 -->
  <span>
    <div id="headApp">
      <!-- head start -->
      <div class="head">
        <div class="main">
          <!-- @click="back('/')" -->
          <div class="header-left" style="cursor: default">
            {{
               $t("auction_title")
            }}
          </div>
          <div class="header-right">
            <ul>
              <li v-if="handleIsShow(`1`)">
                <template v-if="!user_name">
                  <!-- 登录 -->
                  <nuxt-link to="/login/login">【{{ $t("home.login") }}】</nuxt-link>
                  <!-- 注册 -->
                  <nuxt-link to="/login/register">【{{ $t("home.register") }}】</nuxt-link>
                </template>

                <template v-else>
<!--                  <el-tooltip placement="top" effect="light" class="tooltip" v-if="memberPlugin == true">
                    &lt;!&ndash; 用户名称 &ndash;&gt;
                    <a href="javascript:;" @click="toUrl('/my/my/myLoad')" style="max-width: initial">
                      <span class="ccyc" :class="isVip == true ? 'head-yh' : ''">
                        {{ user_name }}
                      </span>
                       &lt;!&ndash; 会员图标 &ndash;&gt;
                      <img v-if="isVip == true && memberPlugin == true" class="tooltop-img" src="~/static/home-img/huiyuan.png" alt="" />
                      &lt;!&ndash; 箭头 &ndash;&gt;
                      <i v-if="memberPlugin == true" class="head-jiantou"></i>
                    </a>
                    &lt;!&ndash; 下拉显示用户信息 &ndash;&gt;
                    <div slot="content" v-if="memberPlugin == true">
                      <div class="xx-tooltop">
                        <div>
                          &lt;!&ndash; <img :src="headUrl" /> &ndash;&gt;
                          &lt;!&ndash; <el-avatar :src="require(headUrl)"></el-avatar> &ndash;&gt;
                          <el-avatar :src="headUrl"></el-avatar>

                          &lt;!&ndash; {{headUrl}} &ndash;&gt;
                        </div>
                        <div>
                          <div style="margin-top: 5px">
                            <span :class="isVip == true ? 'tc-yh' : 'tooltop-span'">{{ user_name }}</span>
                            <img src="~/static/home-img/huise.png" alt="" class="tooltop-img" v-if="isVip == false" />
                            <img src="~/static/home-img/huiyuan.png" alt="" class="tooltop-img" v-if="isVip == true && memberPlugin == true" />
                          </div>
                          <div v-if="isVip == false" class="tooltop-imgone">
                            {{ $t("home.sflj") }}
                          </div>
                          <div v-if="isVip == true" class="dqtime">
                            {{ $t("home.dqsj") }}：{{ vipEndTime.slice(0, 10) }}
                          </div>
                        </div>
                      </div>
                      <div class="tooltop-imgtwo" @click="openVip()" v-if="isVip == false">
                        <div class="tooltop-jiesuo">
                          <div>{{ $t("home.ljjshy") }}</div>
                          <i class="el-icon-arrow-right"></i>
                        </div>
                      </div>
                    </div>
                  </el-tooltip>-->
                  <!-- 用户姓名 -->
                  <span>
                    <a href="javascript:;" @click="toUrl('/my/my/myLoad')">{{
                      user_name
                    }}</a>
                  </span>
                  <!-- 退出登录 -->
                  <a href="javascript:;" @click="unlogin">【{{ $t("home.sign_out") }}】</a>
                </template>
              </li>
              <li v-if="handleIsShow(`2`)">
                <a href="javascript:;" @click="toUrl('/my/my/myOrder')">{{
                  $t("home.My_order")
                }}</a>
              </li>
              <!-- 我的账户 -->
              <li class="header-right-nav-content" v-if="handleIsShow(`3`)">
                <a href="javascript:;" @click="showNav('user')">{{ $t("home.My_account") }}</a>
                <i v-if="show_user_list" class="head-jiantou top"></i>
                <i v-else class="head-jiantou "></i>
                <div v-if="show_user_list" class="header-right-jiantou"></div>
                <div v-if="show_user_list" class="header-right-nav">
              <li @click="toUrl('/my/my/myLoad')">
                {{ $t("home.My_account") }}
              </li>
          <!--        竞拍暂时不显示优惠券        -->
<!--              <li @click="toUrl('/my/my/mycoupon')">
                {{ $t("home.coupon") }}({{ coupon_num }})
              </li>-->
          </div>
          </li>
          <!-- 切换语言 -->
          <li class="header-right-nav-content" v-if="handleIsShow(`4`)">
            <a href="javascript:;" @click.stop="showNav('lang')">{{ $t("home.Language_switch") }} </a>
            <i v-if="show_languages_list" class="head-jiantou top"></i>
            <i v-else class="head-jiantou"></i>
            <div v-if="show_languages_list" class="header-right-jiantou"></div>
            <div v-if="show_languages_list" class="header-right-nav lang">
              <!-- :class="{'default': item.lang_code == userLlangCode}" -->
          <li v-for="(item, index) of languages" :key="index" @click="changeLang(item.lang_code)">{{ item.lang_name }}</li>
        </div>
        </li>

        <!-- 切换货币 -->
        <li class="header-right-nav-content">
          <a @click.stop="showNav('currency')" href="javascript:;">{{ $t("home.currency_switch") }}</a>
          <i v-if="show_currency_list" class="head-jiantou top"></i>
          <i v-else class="head-jiantou"></i>
          <div v-if="show_currency_list" class="header-right-jiantou"></div>
          <div v-if="show_currency_list" class="header-right-nav lang">
            <!-- :class="{'default': item.currency_id == currencyId}" -->
        <li v-for="(item, index) of currencys" :key="index" @click="changeCurrency(item)">{{ item.currency_code }}({{item.currency_symbol}})</li>
      </div>
      </li>
      <!-- 我的店铺 -->
      <li v-if="handleIsShow(`5`)">
        <i class="head-mch"></i>
        <a class="msgBox" @click="toMch" href="javascript:;" style="overflow: visible">
          {{ $t("home.My_shop") }}
        </a>
      </li>
      <li v-if="handleIsShow(`6`)">
        <i class="head-msg"></i>
        <a class="msgBox" @click="toUrl('/my/my/message')" href="javascript:;" style="overflow: visible">
          {{ $t("home.message") }}
          <span v-if="messages_num > 0"></span>
        </a>
      </li>
      <li v-if="handleIsShow(`8`)">
        <i class="head-app"></i>
        <a @click="handleDownApp">{{ $t("home.Download_app") }}</a>
      </li>
      </ul>
    </div>
    </div>
    </div>
    <!-- head end -->
    <div class="logo-title">
      <div class="logo-img" :style="
            pageTitile
              ? 'margin: 18px 0 0 0;width: 100%;padding-bottom: 18px;'
              : ''
          ">
        <div @click="back('/')" style="cursor: pointer">
          <img :src="mchCoupon?.mallLogo" style="width: 176px; height: 54px" />
          <div class="auction_pm">{{$t('auction_pm')}}
          </div>
        </div>
        <div style="display: flex" class="shaco_seach">
          <el-select :popper-append-to-body="false" popper-class="select-popper" v-model="shaco_select" class="head-select" :placeholder="$t('auction.pp')">
            <el-option :value="1" :label="$t('auction.pp')" style="color: #999"></el-option>
            <el-option :value="2" :label="$t('homList.dp')" style="color: #999"></el-option>
          </el-select>
          <div style="position: relative">
            <input class="head-input" ref="inputField" v-model="input" @keydown.enter="clickSearch" @click="handleSearchClick" />

            <div class="history" v-if="isSearch && search_list.length > 0">
              <ul>
                <li class="his_">
                  {{ $t("home.Recent_search") }}
                  <img @click="clearSearch" src="~/static/home-img/clear.jpg" alt="" class="clear" />
                </li>
                <li @click="clickKeyword(item.keyword)" class="his_data" v-for="(item, index) of search_list" :key="index">
                  <span>{{ item.keyword }}</span>
                  <img @click.stop="delSearch(item.keyword)" class="his_close" src="~/static/images/close2x.png" alt="" />
                </li>
              </ul>
            </div>
          </div>
          <div class="head-ss" @click="clickSearch">
           <img src="~/static/home-img/head_ss.png" class="head-img" />
          </div>
        </div>
      </div>
    </div>
    </div>
    <el-dialog class="vip" :title="$t('home.kthy')" :visible.sync="dialogVisible" :append-to-body="false" width="40%" @close="closed">
      <div slot="title" class="header-title">
        <span class="title-text" v-if="isVip == true">{{
          $t("home.xfhy")
        }}</span>
        <span class="title-text" v-if="isVip == false">{{
          $t("home.kthy")
        }}</span>
        <span class="title-close" @click="closed()"></span>
      </div>
      <div class="tequan_xq1">
        <div class="tequan-dialog">
          <div v-for="(item, index) in member_equity" class="tequan-xh">
            <div><img :src="item.icon" class="dia-img" /></div>
            <div class="tequan-name">{{ item.equityName }}</div>
            <div class="tequan-name2">{{ item.englishName }}</div>
          </div>
        </div>
      </div>
      <div class="pay">
        <div class="payfs">{{ $t("home.ktfs") }}</div>
        <div class="paytc">
          <div class="payapp" v-for="(item, index) in open_config" :class="{ deek: currentIndex == index }" @click="liClick(item, index)">
            <div>
              <div class="pay_price">
                <div class="pay_img">{{ item.day }}{{ $t("home.tian") }}</div>
                <div style="margin-top: 25px">
                  <span class="pay_yk">{{ item.openMethodName }}</span>
                  <span class="pay_yk2"><span class="pay_yk1">{{$LaiKeCommObject.show_symbol}}</span>{{ item.price }}</span>
                </div>
                <div class="pay_yk3" :class="{ pay_yk4: currentIndex == index }">
                  {{ $t("home.mtzxy") }}{{ item.priceForDay
                  }}{{ $t("home.yuane") }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pay">
        <div class="payfs">
          {{ $t("home.ptyh")
          }}<span style="font-size: 14px">{{ $t("home.hdmjp") }}</span>
        </div>
        <div class="paytc">
          <el-select @change="getCoupon($event)" @clear="claerid()" style="width: 20%;min-width:144px" v-model="coupon_id" clearable :placeholder="$t('home.xzpty')" size="small">
            <el-option v-for="item in coupon_list" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="pay">
        <div class="payfs">{{ $t("home.zffs") }}</div>
        <div style="display: flex; justify-content: space-between">
          <div style="width: 40%">
            <div class="paytb">
              <div class="pay_zf" @click="ypay()" :class="pay_yq == 1 ? 'pay_yq' : 'pay_zf'">
                <img class="zf_img" src="~/static/images/yue.png" />
              </div>
              <div class="pay_zf" @click="zfbpay()" :class="pay_zfb == 1 ? 'pay_yq' : 'pay_zf'">
                <img class="zf_img" src="~/static/images/zfb.png" />
              </div>
              <div class="pay_zf" @click="wxpay()" :class="pay_wx == 1 ? 'pay_yq' : 'pay_zf'">
                <img class="zf_img" src="~/static/images/pay-wx.png" />
              </div>
              <div class="pay_zf" @click="paypalpay()" :class="paypal == 1 ? 'pay_yq' : 'pay_zf'">
                <img class="zf_img" src="~/static/images/paypal.png" />
              </div>
              <div class="pay_zf" @click="stripepay()" :class="stripe == 1 ? 'pay_yq' : 'pay_zf'">
                <img class="zf_img" src="~/static/images/stripe.png" />
              </div>
            </div>
            <div class="pay_number">
              <div class="pay_nbone">
                <div class="pay_font">{{ $t("home.zj") }}：</div>
                <div class="pay_font">{{ $t("home.yhq") }}：</div>
                <div class="pay_font">{{ $t("home.sfje") }}：</div>
              </div>
              <div class="pay_nbone">
                <div class="pay_font">{{$LaiKeCommObject.show_symbol}}{{ Number(d_price).toFixed(2) }}</div>
                <div class="pay_font">{{$LaiKeCommObject.show_symbol}}{{ Number(y_price).toFixed(2) }}</div>
                <div class="pay_font1">{{$LaiKeCommObject.show_symbol}}{{ Number(z_price).toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <div class="pay_sys" v-if="kedom == 1">
            <div class="pay_ewm">
              <div class="img_wpay" id="akk" v-loading="!code_url_state">
                <div id="codeUrl"></div>
              </div>
              <p v-if="payStyle == 'pc_alipay'">{{ $t("scanCode[6]") }}</p>
              <p v-if="payStyle == 'pc_wechat'">{{ $t("scanCode[7]") }}</p>
            </div>
            <div>
              <img v-if="payStyle == 'pc_wechat'" style="width: 148px; height: 186px" src="~/static/images/sys.png" />
              <img v-if="payStyle == 'pc_alipay'" style="width: 148px; height: 186px" src="~/static/images/zfu_icon.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="pay_xieyi">
        <div>
          <el-checkbox style="margin: 0" v-model="check">{{
            $t("home.ktqqg")
          }}</el-checkbox>
          <span style="color: #c2a662; cursor: pointer" @click="agreementFlag = true">《{{ AgreementTitle }}》</span>
        </div>
        <div>
          <button class="button_one" @click="closed()">
            {{ $t("cancel") }}
          </button>

          <button class="button_two" type="primary" @click="topay()" v-if="stripe == 1 || pay_yq == 1 || paypal == 1">
            {{ $t("home.ljzf") }}
          </button>
        </div>
      </div>
    </el-dialog>
    <el-dialog class="xf_dialog" :visible.sync="xfdialogVisible" @close="closeXf">
      <div class="xf_kep">
        <div class="xf_imgone"><img class="xf_one" :src="headUrl" /></div>
        <div class="xf_font1">{{ user_name }}</div>
        <div style="margin-bottom: 12px">
          <span class="xf_font2">到期剩余时间：</span><span class="xf_font3">{{ vipEndDay }}天</span>
        </div>
      </div>
      <div class="tequan_xq">
        <div class="tequan-dialog">
          <div v-for="(item, index) in member_equity" class="tequan-xh">
            <div style="margin-bottom: 8px">
              <img :src="item.icon" class="dia-img" />
            </div>
            <div class="tequan-name3">{{ item.equityName }}</div>
            <div class="tequan-name4">{{ item.englishName }}</div>
          </div>
        </div>
      </div>
      <div class="tequan_xq">
        <el-button class="xf_an" @click="open()"> 续费VIP会员 </el-button>
      </div>
      <div class="tequan_xq">
        <div v-if="cut_num == 1">
          <img @click="cut()" class="xf_imgtwo" src="~/static/images/su.png" /><span class="redis_ys">勾选不再显示</span>
        </div>
        <div v-if="cut_num == 2">
          <img @click="cut_back()" class="xf_imgtwo" src="~/static/images/err.png" /><span class="redis_ys">勾选不再显示</span>
        </div>
      </div>
    </el-dialog>
    <!-- 店铺审核中弹窗 -->
    <div class="mask" v-if="mchStatus == 1">
      <div class="mchMask">
        <img src="~/static/images/inReview.png" alt="" />
        <p>{{ $t("Popup[0]") }}</p>
        <span>{{ $t("Popup[1]") }}</span>
        <div class="btnBox">
          <el-button @click="mchStatus = false" class="btn" type="danger">{{
            $t("Popup[2]")
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="mask" v-if="mchStatus == 3">
      <div class="mchMask">
        <img src="~/static/images/unapprove.png" alt="" />
        <p>{{ $t("Popup[3]") }}</p>
        <span>{{ review_result }}</span>
        <div class="btnBox">
          <el-button class="btn" @click="mchStatus = false">{{
            $t("cancel")
          }}</el-button>
          <el-button class="btn" type="danger" @click="toapp()">{{
            $t("Popup[4]")
          }}</el-button>
        </div>
      </div>
    </div>
    <!-- 店铺审核中弹窗结束 -->

    <!-- 输入密码框 -->
    <div class="addressMask" v-if="yuepayFlag">
      <div style="height: auto" v-loading="fullscreenLoading">
        <div class="addressMask_title">
          {{ $t("home.srmm") }}
          <i class="el-icon-close" @click="yuepayFlag = false"></i>
        </div>

        <div class="addressMask_content_item" style="justify-content: center; margin: 50px 0">
          <div>{{ $t("home.yemm") }}</div>
          <el-input show-password :placeholder="$t('home.qsrmm')" v-model="password" style="width: 360px"></el-input>
        </div>

        <div class="addressMask_bottom">
          <div @click="yuepayFlag = false">{{ $t("cancel") }}</div>
          <div @click="savePassword">{{ $t("confirm") }}</div>
        </div>
      </div>
    </div>
    <!-- 支付结果页面 -->
    <div class="addressMask" v-if="payResults">
      <div style="height: auto" v-loading="fullscreenLoading">
        <div class="addressMask_title">
          {{ $t("home.ktfs") }}
          <i class="el-icon-close" @click="handlePayResults"></i>
        </div>

        <div class="order_Detail">
          <div class="pay_payfs">
            <div class="orderDetail_kep">
              <i class="el-icon-check"></i>
            </div>
            <div class="orderDetail_center_top">{{ $t("home.zfcg") }}</div>
          </div>
          <div style="padding-left: 78px">
            <div class="pay_font2">
              {{ $t("payResult.long[1]") }}{{ order_list.sNo }}
            </div>
            <div class="pay_font2">
              {{ $t("payResult.long[2]")
              }}<span class="pay_span">{{$LaiKeCommObject.show_symbol}}{{ order_list.amount }}</span>
            </div>
            <div class="pay_font2">
              {{ $t("home.ktfs") }}：{{ order_list.memberTypeDesc }}
            </div>
            <div class="pay_font2">
              {{ $t("home.dqsj") }}：{{ order_list.endTime }}
            </div>
          </div>
        </div>
        <div class="addressMask_bottom">
          <div @click="handleBackIndex">{{ $t("home.fhsy") }}</div>
        </div>
      </div>
    </div>
    <!-- 会员协议弹窗 -->
    <div class="mask" v-if="agreementFlag">
      <div class="agreementContent">
        <div :class="!AgreementTitle ? 'mask_titleS' : 'mask_title'">
          {{ AgreementTitle }}
          <i class="el-icon-close" @click="agreementFlag = false"></i>
        </div>
        <div class="agreementContent_item">
          <!-- {{ AgreementContent }} -->
          <span v-html="AgreementContent"></span>
        </div>
      </div>
    </div>
    <!-- 没有支付密码弹窗 -->
    <div class="addressMaskMM" v-if="pwdFlag" style="z-index: 999999">
      <div class="nopwd" style="height: auto; width: 420px">
        <i class="el-icon-warning-outline"></i>
        <p>{{ $t("payment.long[3]") }}</p>
        <div>
          <el-button @click="pwdFlag = false">{{ $t("cancel") }}</el-button>
          <el-button type="danger" @click="toUrl('/my/my/security')">{{
            $t("payment.set")
          }}</el-button>
        </div>
      </div>
    </div>
    <!-- 没有支付密码弹窗结束 -->
  </span>
</template>

<script>
import ErrorImg from "@/static/images/default_picture.png";
export default {
  async fetch() {
    this.pc_user = this.$cookies.get("pc_user") ?? {};
    var data = {
      api: "mall.Index.index",
    };
    let res = await this.$Api.doRequest(data);
    this.pluginStatus = res.data.pluginStatus;
    this.isVip = this.pluginStatus.isVip;
    this.memberPlugin = this.pluginStatus.memberPlugin;
    this.headUrl = res.data.headUrl;
    this.vipEndTime = res.data.vipEndTime;
    this.login_status = res.data.login_status;
    this.user_name = res.data.user_name;

    this.messages_num = res.data.messages_num;
    this.memberRemind = res.data.memberRemind;
    if (this.isVip == true) {
      this.vipEndDay = res.data.vipEndDay;
    }
    // if (this.memberRemind == true) {
    //   this.geivipset()
    //   this.xfdialogVisible = true
    // }
    this.coupon_num = res.data.coupon_num;
    this.class_list = res.data.class_list;
    this.cart_list = res.data.cart_list;
    this.cart_num = res.data.cart_num;
    this.waitPayNum = res.data.order_num;
    this.cart_price = res.data.cart_price;
    this.mchCoupon = res.data.mchCoupon || {};
    this.appList = {
      APPExplain: res.data.mchCoupon.APPExplain,
      APPUrl: res.data.mchCoupon.APPUrl,
    };
    this.$storage.set("appList", this.appList);
    this.$storage.set("mchCoupon", this.mchCoupon);
    this.$storage.set("pluginStatus", this.pluginStatus);
    this.loadFlag = false;
  },

  data() {
    return {
      pc_user: {},
      class_list: [], //分类list
      isGoods: false, //判断是否点击购物车
      isSearch: false, //判断是否点击搜索按钮
      shaco_select: 1,
      coupon_num: 0,
      mchCoupon: {},
      messages_num: 0,
      pageTitile: "",
      pageId: "",
      passwordStatus: 0,
      input: "",
      cart_num: "",
      cart_price: "",
      loadFlag: true,
      pluginStatus: {},
      isVip: "", //判断用户是否为会员
      headUrl: "",
      vipEndTime: "",
      login_status: false, //是否登录
      user_name: "",
      memberRemind: "", //判断是否出续费弹窗
      memberPlugin: false,
      vipEndDay: "",
      xfdialogVisible: false,
      cart_list: [],
      member_equity: [], //特权数组
      open_config: [], //支付套餐数组
      order_list: [],
      pay_fs: "月卡", //月卡 季卡 年卡
      memberType: "",
      pay_type: "",
      payStyle: "wallet_pay", //支付方式
      z_price: "", //总价
      x_price: "",
      d_price: "",
      y_price: "0.00", //优惠券
      check: "", //是否勾选
      pay_yq: 1, //余额
      pay_wx: 0, //微信
      pay_zfb: 0, //支付宝
      couponId: "", //优惠券id
      AgreementTitle: "",
      AgreementContent: "",
      review_result: "",
      dialogVisible: false,
      currentIndex: 0,
      coupon_id: "",
      coupon_list: [], //优惠券列表
      cut_num: 1,
      payResults: false,
      user_money: "", //用户余额
      yuepayFlag: false,
      password: "",
      agreementFlag: false,
      fullscreenLoading: false,
      mchStatus: false,
      kedom: "",
      timeI: "",
      search_list: [],
      code_url_state: false,
      appList: {},
      pwdFlag: false,
      languages: [],
      currencys: [],
      userLlangCode: 'zh_CN',
      currencyId: '1',
      stripe: 0, //stripe支付.
      stripe: null, // 存储脚本导出的对象
      paypal: "",
      show_user_list: false,
      show_languages_list: false,
      show_currency_list: false,
    };
  },
  watch: {
    isSearch(val) {
      if (val) {
        this.isGoods = false;
      }
    },
    memberRemind(val) {
      if (
        val == true &&
        (this.$route.path == "/" || this.$route.path == "/my/my/memberCenter")
      ) {
        this.geivipset();
        this.xfdialogVisible = true;
      }
    },
    isGoods(val) {
      if (val) {
        this.isSearch = false;
      }
    },
    shaco_select(val) {
      console.log('shaco_select变化～', val);
      this.$refs.inputField.focus()
      this.isSearch = true
    },
    input(newVal) {
      this.$storage.set('search_input_value', newVal);
    },
    shaco_select(newVal) {
      this.$storage.set('search_select_value', newVal);
    }
  },
  // computed: {
  //   pluginStatus () {
  //     return this.$store.state.layout.arrList.pluginStatus
  //   },
  //   headUrl () {
  //     return this.$store.state.layout.arrList.headUrl
  //   },
  //   vipEndTime () {
  //     return this.$store.state.layout.arrList.vipEndTime
  //   },
  //   login_status () {
  //     return this.$store.state.layout.arrList.login_status
  //   },
  //   user_name () {
  //     return this.$store.state.layout.arrList.user_name
  //   },
  //   messages_num () {
  //     return this.$store.state.layout.arrList.messages_num
  //   },
  //   cart_num () {
  //     return this.$store.state.layout.arrList.cart_num
  //   },
  //   minshow () {
  //     return this.$route.path.indexOf('my/my') >= 1
  //   },
  //   routes () {
  //     return this.$nuxt.$router.options.routes
  //   },
  // },
  beforeDestroy() {
    this.$root.$off("shoppingCart");
    this.$root.$off("toMch");
    this.$root.$off("unlogin");
    this.$root.$off("vip");
    this.$root.$off("search");
  },
  mounted() {
    this.$root.$on("shoppingCart", () => {
      this.getApi();
    });
    this.$root.$on("toMch", () => {
      this.toMch();
    });
    this.$root.$on("unlogin", () => {
      this.unlogin();
    });
    this.$root.$on("vip", () => {
      this.geivipset(true);
      this.dialogVisible = true;
    });
    this.$root.$on("search", () => {
      this.getSearch();
    });
    this.loadFlag = false;
    this.getSearch();
    this.getDefaultValue();
    this.getLangs();
    this.getCurrencys();
    this.getDefaultCurrencys();

    const { user_lang_code, userCurrency } = this.$storage.get('user') || {}
    // 获取用户语言
    if (user_lang_code) {
      this.userLlangCode = user_lang_code
    }
    // 获取币种
    if (userCurrency) {
      this.currencyId = userCurrency.currency_id
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
    this.input = this.$storage.get('search_input_value') || '';
    this.shaco_select = this.$storage.get('search_select_value') || 1;
  },
  created() {
    this.getSystemIcon()
    this.getSearch();
  },
  destroyed() {
    clearInterval(this.timeI);
  },
  computed: {
    routes() {
      return this.$nuxt.$router.options.routes;
    },
    // user_name () {
    //     return this.$cookies.get('pc_user')?.user_name ?? ''
    // },
    minshow() {
      return this.$route.path.indexOf("my/my") >= 1;
    },
  },
  methods: {
    // 获取浏览器 icon配置
    async getSystemIcon() {
      let data = {
        api: 'mall.Home.GetBasicConfiguration'
      }

      const res = await this.$Api.doRequest(data)
      if(res.code != 200) {
        return
      }
      let systemInfo = res.data.list

      if (systemInfo.html_icon) {
        console.log('res', systemInfo)
        const { html_icon } = systemInfo

        const oldLink = document.querySelector('link[rel="icon"]');
        if (oldLink) {
          document.head.removeChild(oldLink);
        }

        // 创建新icon标签（对应你提供的原生代码）
        const link = document.createElement('link');
        link.rel = 'icon';
        // 自动识别icon格式，兼容ico/png
        link.type = html_icon.includes('png') ? 'image/png' : 'image/x-icon';
        link.href = html_icon;

        // 插入到head
        document.head.appendChild(link);
      }
    },
    showNav(e) {
      console.log(e)
      if (e == 'user') {
        this.show_user_list = !this.show_user_list
        this.show_languages_list = false
        this.show_currency_list = false
      } else if (e == 'lang') {
        this.show_languages_list = !this.show_languages_list
        this.show_user_list = false
        this.show_currency_list = false
      } else if (e == 'currency') {
        this.show_currency_list = !this.show_currency_list
        this.show_user_list = false
        this.show_languages_list = false
      }
    },
    getDefaultValue() {
      var data = {
        api: "mall.User.isDefaultValue",

      };
      this.$Api.doRequest(data).then((res) => {
        if (res.data.haveAllUserInfo == true) {
          this.$confirm(this.$t("home.zltext1"), this.$t("home.wxts"), {
            confirmButtonText: this.$t("home.qws"),
            cancelButtonText: this.$t("home.zbws"),
            type: "warning",
          }).then(() => {
            this.toUrl("/my/my/myinfor");
          });
        }
      });
    },
    handleBackIndex() {
      this.payResults = false;
      // this.$router.back('/')
      this.getApi()
      this.$router.push({
        path: "/",
      });
    },
    handlePayResults() {
      this.payResults = false;
      this.getApi(2)
    },
    // 标签显示影藏
    handleIsShow(val) {
      if (this.mchCoupon?.shortcutMenu3?.indexOf(val) == -1) {
        return false;
      } else {
        return true;
      }
    },
    handleCartClick() {
      this.isGoods = !this.isGoods;
    },

    getDefaultCurrencys() {
      this.$LaiKeCommObject.getDefaultCurrencys();
    },

    changeCurrency(item) {
      this.closeList()
      if (!item) {
        console.log("切换货币失败")
        console.log(item)
        return;
      }
      //登录了设置用户的喜好货币 没有登录只用本地货币
      if (this.login_status) {
        //设置用户喜好货币
        this.$Api.doRequest({
          api: 'app.common.userChangeCurrency',
          currency_id: item.currency_id
        }).then((res) => {
          if (res.code == 200) {
            this.currencyId = item.currency_id
            const user = this.$storage.get('user') || {};
            user.userCurrency = item
            this.$storage.set('user', user);
            this.$LaiKeCommObject.setCurrentCurrencyInfo(item);
            this.$message.success(this.$t("message.czcg"));
          }
        });
      }
      else {
        this.$LaiKeCommObject.setCurrentCurrencyInfo(item);
      }
      console.log(this.$LaiKeCommObject.currentCurrency)
    },
    closeList() {
      this.show_languages_list = false
      this.show_currency_list = false
      this.show_user_list = false
    },

    changeLang(locale) {
      this.closeList();
      const availableLocales = this.$i18n.locales.map(l => (typeof l === 'string' ? l : l.code));
      if (!availableLocales.includes(locale)) {
        this.$message.error(this.$t("langnotexists"));
        return;
      }

      // 同步更新 URL
      const shortLang = this.getLocaleShortCode(locale);
      if (this.$route.query.language !== shortLang) {
        this.$router.replace({
          query: { ...this.$route.query, language: shortLang }
        });
      }

      // 设置语言
      this.$i18n.setLocale(locale);

      // 更新用户语言偏好（登录用户）
      let user = this.$cookies.get("pc_user") || {};
      if (user && Object.keys(user).length > 1) {
        this.$Api.doRequest({
          api: 'mall.home.select_language'
        }).then((res) => {
          if (res.code == 200) {
            const user = this.$storage.get('user');
            user.user_lang_code = locale;
            this.$storage.set('user', user);
            this.$message.success(this.$t("message.czcg"));
            // ✅ 不再 reload，而是重新获取页面数据
            this.refreshPageData();
          }
        });
      } else {
        // ✅ 未登录用户也重新获取数据，不 reload
        this.refreshPageData();
      }
    },

    getLocaleShortCode(fullLocale) {
      const map = {
        'zh_CN': 'zh',
        'zh_TW': 'zh-tw',
        'en_US': 'en',
        'ms_MY': 'ms',
        'ja_JP': 'ja',
        'id_ID': 'id',
        'ru_RU': 'ru',
        'fil_PH': 'fil'
        // ⚠️ 请根据你项目实际支持的语言补充或调整
      };
      return map[fullLocale] || 'zh'; // 默认 fallback 到中文
    },
    // 重新获取页面数据（模拟 refresh，但不刷新页面）
    async refreshPageData() {
      // 如果是首页，重新执行 fetch
      if (this.$route.path === '/') {
        await this.getApi(); // 调用你顶部的 async fetch()
        // 如果有其他组件需要刷新（如 header、footer），可 emit 事件
        this.$root.$emit('language-changed');
      }
      // 其他页面可按需处理
    },
    //点击图片切换
    cut() {
      this.cut_num = 2;
    },
    cut_back() {
      this.cut_num = 1;
    },
    open() {
      this.dialogVisible = true;
      console.log("704704704", this.coupon_list);
    },
    //关闭弹窗销毁元素
    closed() {
      this.dialogVisible = false;
      this.check = "";
      this.x_price = "";
      this.currentIndex = "";
      this.ypay();
      // Object.assign(this.$data, this.$options.data())
      // 销毁二维码支付事件轮询
      // 清空二维码状态
      setTimeout(() => {
        clearInterval(this.timeI);
      }, 200);
    },
    closeXf() {
      // this.xfdialogVisible = false
      if (this.cut_num == 2) {
        var data = {
          api: "plugin.member.MallMember.closeFrame",

        };
        this.$Api.doRequest(data).then((res) => {
          if (res.code == 200) {
            this.$message.success(this.$t("message.czcg"));
          }
        });
      }
    },
    /*
          余额密码确认按钮
         */
    savePassword() {
      if (!this.password) {
        this.$message.error(this.$t("paydetails.Tips[10]"));
        return;
      }
      if (this.password.length < 6) {
        this.$message.error(this.$t("paydetails.Tips[11]"));
        return;
      }
      var data = {
        api: "mall.User.paymentPassword",

        password: this.password, //  密码
        language: this.$cookies.get("currentLang"),
      };
      this.fullscreenLoading = true;
      this.$Api.doRequest(data)
        .then((res) => {
          if (res.code == 200) {
            this.payResult();
          } else {
            // this.$message.error(res.message)
            this.fullscreenLoading = false;
          }
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          this.$message.error(error.message);
        });
    },
    payResult() {
      var data = {
        api: "mall.Pay.walletPay",
        sNo: this.order_list.sNo,

        order_list: JSON.stringify(this.order_list),
        type: "wallet_pay", // 支付方式
        payment_money: this.z_price, //应付金额
      };
      this.$Api.doRequest(data)
        .then((res) => {
          if (res.code == "200") {
            this.$message.success(this.$t("paydetails.Tips[12]"));
            this.fullscreenLoading = false;
            this.yuepayFlag = false;
            this.dialogVisible = false;
            setTimeout(() => {
              this.payResults = true;
            }, 200);
          }
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          this.$message.error(error.message);
        });
    },
    //余额支付
    ypay() {
      this.pay_wx = 0;
      this.pay_zfb = 0;
      this.kedom = 0;
      this.stripe = 0;
      this.paypal = 0;
      this.pay_yq = 1;
      this.payStyle = "wallet_pay";
      // 清空二维码状态
      setTimeout(() => {
        clearInterval(this.timeI);
      }, 200);
    },
    //支付宝支付
    zfbpay() {
      this.pay_yq = 0;
      this.pay_wx = 0;
      this.kedom = 0;
      this.stripe = 0;
      this.paypal = 0;
      this.pay_zfb = 1;
      this.payStyle = "pc_alipay";
      this.topay();
    },
    //微信支付
    wxpay() {
      this.pay_yq = 0;
      this.pay_zfb = 0;
      this.kedom = 0;
      this.stripe = 0;
      this.paypal = 0;
      this.pay_wx = 1;
      this.payStyle = "pc_wechat";
      this.topay();
    },
    //stripe支付
    stripepay() {
      this.pay_yq = 0;
      this.pay_zfb = 0;
      this.pay_wx = 0;
      this.kedom = 0;
      this.paypal = 0;
      this.stripe = 1;
      this.payStyle = "stripe";
      // this.topay();
    },
    //paypal支付
    paypalpay() {
      this.pay_yq = 0;
      this.pay_zfb = 0;
      this.pay_wx = 0;
      this.kedom = 0;
      this.paypal = 1;
      this.stripe = 0;
      this.payStyle = "paypal";
      // this.topay();
    },
    handleErrorImg(e) {
      e.target.src = ErrorImg;
    },
    //会员支付
    topay(text) {
      if (this.check == "") {
        this.$message({
          showClose: true,
          message: this.$t("home.ktqqg") + this.AgreementTitle,
          type: "warning",
        });
        this.ypay();
        return;
      }
      // 余额支付,弹窗查看是否设置了支付密码
      // this.payStyle = "wallet_pay";
      if ((this.payStyle === "wallet_pay" && this.passwordStatus == 0)) {
        console.log("余额支付未设置支付密码");
        this.pwdFlag = true;
        return;
      }
      if (this.pay_fs == "月卡") {
        this.memberType = 1;
      } else if (this.pay_fs == "季卡") {
        this.memberType = 2;
      } else if (this.pay_fs == "年卡") {
        this.memberType = 3;
      }
      if (this.user_money > 0 && this.payStyle == "wallet_pay") {
        this.yuepayFlag = true;
      } else {
        if (this.payStyle == "wallet_pay") {
          this.$message.error(this.$t("paydetails.Tips[13]"));
          return;
        }
      }
      var data = {
        api: "plugin.member.MallMember.payment",
        // api:"plugin.member.AppMember.Payment",

        memberType: this.memberType,
        payType: this.payStyle,
        couponId: this.coupon_id,
        amount: this.z_price,
      };

      this.$Api.doRequest(data).then((res) => {
        this.order_list = res.data;
        if (this.payStyle == "wallet_pay") {
          this.yuepayFlag = true;
          return;
        } else if (this.payStyle == "stripe") {
          console.log("stripe支付结果", res);
          var payData = {
            api: "mall.Pay.index",
            total: this.order_list.amount, //会员特惠 兑换券级别
            remarks: "", //  订单备注
            title: "充值会员",
            order_list: JSON.stringify(this.order_list),
            type: this.payStyle, //  支付类型
          };
          this.$Api.getList(payData).then((res) => {
            if (res.code == 200) {
              console.log("stripe支付结果", res);
              const stripe_id = res.data.stripe_id
              const publishable_key = res.data.publishable_key
              // 初始化 Stripe（用你的 publishable key）
              const stripe = Stripe(publishable_key);
              // 重定向到 Stripe Checkout
              stripe.redirectToCheckout({
                sessionId: stripe_id
              })
            }
          })
          return;
        } else if (this.payStyle == "paypal") {
          console.log("paypal支付结果", res);
          var payData = {
            api: "mall.Pay.index",
            total: this.order_list.amount, //会员特惠 兑换券级别
            remarks: "", //  订单备注
            title: "充值会员",
            order_list: JSON.stringify(this.order_list),
            type: this.payStyle, //  支付类型
          };
          this.$Api.getList(payData).then((res) => {
            if (res.code == 200) {
              this.$storage.set('cz_sNo', sNo);
              this.$cookies.set('cz_sNo', sNo);
              this.code_url = res.data.data
              // window.location.href = this.code_url
              var newWin = window.open('', '_blank');
              newWin.location = this.code_url;
            }
          })
          return;
        } else if (
          this.payStyle == "pc_wechat" ||
          this.payStyle == "pc_alipay"
        ) {
          this.kedom = 1;
          setTimeout(() => {
            var payData = {
              api: "mall.Pay.index",
              total: this.order_list.amount, //会员特惠 兑换券级别
              remarks: "", //  订单备注
              title: "充值会员",
              order_list: JSON.stringify(this.order_list),
              type: this.payStyle, //  支付类型
            };
            this.$Api
              .getList(payData)
              .then((res) => {
                if (res.code == 200) {
                  this.code_url = res.data;
                  this.code_url_state = true;
                  this.pay_type = "";
                  setTimeout(() => {
                    this.qrCode();
                  });
                  clearInterval(this.timeI);
                  this.setTime();
                } else {
                  // $("#codeUrl").empty();
                  // this.pay_type = ''
                  this.code_url_state = false;
                }
              })
              .catch((error) => {
                if (error.code != 200 && error.code != 109) {
                  this.code_url_state = false;
                  this.$message.error(error.message);
                } else if (error.code == 109) {
                  this.$message.error(this.$t("paydetails.Tips[13]"));
                }
              });
          }, 100);
        }
      });
    },

    setTime() {
      this.timeI = setInterval(() => {
        this.consAnt();
      }, 3000);
    },
    qrCode() {
      if (this.pay_type == "") {
        this.pay_type = new QRCode(document.getElementById("codeUrl"), {
          width: 100,
          height: 100,
        });
        let url = this.code_url;
        this.pay_type.clear();
        this.pay_type.makeCode(url);
      } else {
        // this.$message.error('请勿重复提交')
      }
    },
    consAnt(callback) {
      var data = {
        api: "mall.Order.getCzorder",

        trade_no: this.order_list.sNo,
      };
      this.$Api.doRequest(data).then((res) => {
        if (res.data.code == 200) {
          this.fullscreenLoading = false;
          this.yuepayFlag = false;
          this.dialogVisible = false;
          setTimeout(() => {
            this.payResults = true;
            clearInterval(this.timeI);
          }, 200);
        }
      });
    },
    openVip() {
      this.geivipset();
      this.dialogVisible = true;
    },
    clearSearch() {
      var data = {
        api: "mall.Index.oneClickClear",

      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.getSearch();
          this.input = ''; // 清空搜索框
          this.shaco_select = 1; // 重置下拉为默认值
          this.$storage.set('search_input_value', ''); // 清空搜索框缓存
          this.$storage.set('search_select_value', 1); // 重置下拉缓存
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    /*
          获取最近搜索
         */
    getSearch() {
      var data = {
        api: "mall.Index.clickSearch",

      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.search_list = res.data.list;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    liClick(item, index) {
      // this.coupon_id = ''
      // 修改默认选中的bug
      if (this.coupon_id) {
        this.y_price = this.y_price = this.coupon_list.find(
          (item) => item.id === this.coupon_id
        ).money;
      }

      this.pay_fs = item.openMethod;
      this.x_price = item.price;
      this.currentIndex = index;
      // 清空选择的input
      this.claerid();
      this.geivipset();
    },
    //优惠券select事件
    getCoupon(row) {
      this.geivipset();
      setTimeout(() => {
        console.log(
          "983983983",
          row,
          this.coupon_list.find((item) => item.id === row)
        );
        // 原先的写法
        // this.y_price = (this.d_price - this.z_price).toFixed(2)

        // 修改默认选中的bug
        this.y_price = this.coupon_list.find((item) => item.id === row).money;
      }, 100);
    },
    //清除优惠券勾选
    claerid() {
      this.coupon_id = "";
      this.y_price = "";
      this.geivipset();
    },
    //获取语言
    getLangs() {
      let data = {
        api: "app.common.getLangs"
      }
      this.$Api.doRequest(data).then((res) => {
        this.languages = res.data
      });
    },
    //获取币种
    getCurrencys() {
      let data = {
        api: "app.common.getCurrencys"
      }
      this.$Api.doRequest(data).then((res) => {
        this.currencys = res.data || []
      });
    },
    //获取开通会员弹窗数据
    geivipset(type = false) {
      let data = {
        api: "plugin.member.MallMember.settlement",

        amount: this.x_price,
        couponId: this.coupon_id,
      };
      this.$Api.doRequest(data).then((res) => {
        this.member_equity = res.data.memberConfig.member_equity;
        this.open_config = res.data.memberConfig.open_config;
        this.z_price = res.data.amount;
        this.d_price = res.data.y_amount;
        this.user_money = res.data.user_money;
        this.coupon_list = res.data.couponList;
        if (type && this.coupon_list.length > 0) {
          this.coupon_id = res.data.couponList[0].id;
          this.y_price = res.data.couponList[0].money;
          this.geivipset(false);
        }
        this.passwordStatus = res.data.passwordStatus;
        this.Agreement();
      });
    },
    //获取会员服务协议
    Agreement() {
      var data = {
        // module: 'app_pc',
        // action: 'login',
        // m: 'register_agreement',
        api: "mall.Login.registerAgreement",
        type: 3,
      };
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.AgreementContent = res.data.content.replace(
            /<img/g,
            "<img style='max-width:100%;height:auto;'"
          );
          // this.agreementFlag = true
          this.AgreementTitle = res.data.title;
        }
      });
    },
    handleSearchClick() {
      // if (this.isSearch && this.input) {
      //   this.$router.push({
      //     path: '/homeList/homeList',
      //     query: { searchName: this.input }
      //   })
      // }
      this.isSearch = !this.isSearch;
    },
    handleDownApp() {
      // href="http://app.laiketui.net/k5mr"
      window.open("http://app.laiketui.net/k5mr");
    },
    toUrl(url) {
      if (url === '/my/my/security') {
        this.dialogVisible = false
        this.pwdFlag = false
      }
      this.$router.push({
        path: url,
      });
    },
    back(url) {
      // location.href = url
      this.$router.push({
        path: url,
      });
    },
    toapp() {
      this.mchStatus = false;
      this.$router.push({
        path: "/mch/applyShop",
        query: {
          edit: 1,
        },
      });
    },
    async getShop() {
      var data = {
        api: "mall.Index.index",
      };
      let res = await this.$Api.doRequest(data);
      this.messages_num = res.data.messages_num;
      this.class_list = res.data.class_list;
      this.cart_list = res.data.cart_list;
      this.cart_num = res.data.cart_num;
      this.waitPayNum = res.data.order_num;
      this.cart_price = res.data.cart_price;
      this.mchCoupon = res.data.mchCoupon || {};
    },
    delOrder(id) {
      var data = {
        // module: 'app_pc',
        // action: 'cart',
        // m: 'delcart',
        api: "mall.Cart.delCart",

        car_id: id,
      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.$message.success(this.$t("home_Tips[0]"));
          this.getApi();
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    toMch() {
      let data = {
        api: "mch.mall.Mch.index",

      };

      this.$Api.doRequest(data)
        .then((res) => {
          let { data } = res;
          if (data.status == 0) {
            this.$router.push({
              path: "/mch/applyShop",
            });
          } else if (res.data.status == 2) {
            window.open(
              process.env.VUE_APP_LKT_MCH_DEFURL +
              "?token=" +
              encodeURIComponent(res.data.token)
            );
          } else {
            this.mchStatus = res.data.status;
            this.review_result = data.review_result;
          }
        })
        .catch((error) => {
          console.log("error", error);

          // this.$message.error(error.message)
        });
    },
    unlogin() {
      var data = {
        // module: 'app_pc',
        // action: 'login',
        // m: 'quit',
        api: "mall.Login.quit",

      };
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {

          const currentLang = this.$cookies.get("currentLang")
          this.$cookies.removeAll()
          this.$cookies.set("currentLang", currentLang)

          localStorage.clear();
          this.$message.success(this.$t("message.czcg"));
          this.$router.push({
            path: "/login/login",
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    clickKeyword(keyword) {
      this.input = keyword;
      this.clickSearch();
    },
    clickSearch() {
      console.log("shaco_select",this.shaco_select)
      if (this.shaco_select == 1) {
        this.$router.push({
          path: "/auction/single-auction",
          query: {
            searchName: this.input,
          },
        });
      } else if (this.shaco_select == 2) {
        this.$router.push({
          path: "/auction/auction-shop",
          query: {
            searchName: this.input,
          },
        });
      }
      this.getSearch();
      this.isSearch = !this.isSearch;
      // this.input = ''
    },
    delSearch(keyword) {
      var data = {
        api: "mall.Index.delSearch",

        keyword,
      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.getSearch();
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    getApi(val) {
      this.pc_user = this.$cookies.get("pc_user");
      console.log("this.pc_user", this.pc_user);
      var data = {
        api: "mall.Index.index",
      };
      this.$Api.doRequest(data).then((res) => {
        this.pluginStatus = res.data.pluginStatus;
        this.isVip = this.pluginStatus.isVip;

        this.memberPlugin = this.pluginStatus.memberPlugin;
        this.headUrl = res.data.headUrl;
        this.vipEndTime = res.data.vipEndTime;
        this.login_status = res.data.login_status;
        this.user_name = res.data.user_name;
        this.messages_num = res.data.messages_num;
        this.memberRemind = res.data.memberRemind;
        if (this.isVip == true) {
          this.vipEndDay = res.data.vipEndDay;
        }

        // if (this.memberRemind == true) {
        //   this.xfdialogVisible = true
        //   this.geivipset()
        // }
        this.coupon_num = res.data.coupon_num;
        this.class_list = res.data.class_list;
        this.cart_list = res.data.cart_list;
        this.cart_num = res.data.cart_num;
        this.waitPayNum = res.data.order_num;
        this.cart_price = res.data.cart_price;
        this.mchCoupon = res.data.mchCoupon;
        this.appList = {
          APPExplain: res.data.mchCoupon.APPExplain,
          APPUrl: res.data.mchCoupon.APPUrl,
        };
        this.$storage.set("appList", this.appList);
        this.$storage.set("mchCoupon", this.mchCoupon);
        this.$storage.set("pluginStatus", this.pluginStatus);
        this.loadFlag = false;
        if (val == 2) {
          setTimeout(() => {
            this.$root.$emit('newDataVip')
          }, 100)
        }
      });
    },
  },
};
</script>
<style>
.el-tooltip__popper.is-light {
  border: 0px;
  box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 16%);
  z-index: 99;
  width: 190px;
  /* height: 94px; */
}

.el-tooltip__popper.is-light .popper__arrow {
  border-bottom-color: #ffffff !important;
}
</style>
<style scoped>
.default {
  color: #e2041b !important;
}
#headApp {
  position: sticky;
  top: 0;
  z-index: 200;
  background: #ffffff;
}

.head {
  width: 100%;
  min-width: 1200px;
  /* background-color: #333333; */
  background-color: #f5f5f5;
}

.main {
  width: 1200px;
  height: 36px;
  margin: auto;
}

.header-left {
  float: left;
  line-height: 36px;
  font-size: 12px;
  /* color: #B8B8B8; */
  color: #999999;
}

.header-right {
  float: right;
  min-width: 520px;
}

::v-deep.head-select .el-input .el-input__inner {
  width: 59px;
  height: 36px;
  margin: 0;
  border: 1px solid #DDDDDD;
  border-right: 0;
  border-radius: 0;
  padding: 0;
  padding-left: 8px;
  color: #999999;
}

::v-deep.head-select .el-input__icon {
  height: 100%;
  width: 15px;
  text-align: center;
  color: #999999 !important;
}

::v-deep.head-select .selected {
  color: #B21E2E !important;
}

::v-deep.head-input,
input::placeholder {
  color: #999;
  font-size: 14px;
}

.header-right ul {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 36px;
  font-size: 12px;
}

.header-right > ul > li {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px 0 10px;
  position: relative;
}

.header-right ul li a {
  vertical-align: middle;
  color: #999999;
  word-break: break-all;
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ccyc {
  max-width: 80px;
  height: auto;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.head-yh {
  color: #e4c270;
  margin-right: 7px;
}

.header-right > ul > li:not(:last-child):after {
  content: '';
  position: absolute;
  right: 0;
  display: block;
  width: 1px;
  height: 14px;
  /* background-color: #7D7D7D; */
  background-color: #b8b8b8;
}

.header-right-nav-content {
  position: relative;
}

.head i {
  display: inline-block;
  background-size: 100% 100%;
  margin-right: 5px;
}

.head i.head-jiantou {
  width: 12px;
  height: 10px;
  margin-left: 5px;
  margin-right: 0;
  background-image: url('~/static/home-img/jiantou.png');
}

.head i.top {
  transform: rotate(180deg);
}

.header-right-nav {
  position: absolute;
  top: 45px;
  left: 0px;
  display: block !important;
  /* 动态宽度设置 */
  min-width: 80px;
  max-width: 200px;
  width: max-content;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.16);
  z-index: 99;
  font-size: 12px;
  /* 关键修改：动态高度设置 */
  max-height: 250px; /* 设置最大高度 */
  overflow-y: auto; /* 超出最大高度时显示垂直滚动条 */
  padding: 5px 0;
  height: auto !important;
  max-height: 200px;
  border-radius: 2px;
}

.header-right-nav li:last-child {
  border-bottom: none !important;
}
/* header-right-nav 用伪元素实现三角形popper__arrow */

/* .header-right-nav::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 35px;
  border-bottom: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 10px solid #fff;
  transform: rotate(90deg);
} */

.lang {
  /* 允许横向滚动 */
  overflow-x: auto;
  white-space: nowrap;
  /* padding-bottom: 5px; */
}

/* 隐藏滚动条但保留功能 */
.lang::-webkit-scrollbar {
  height: 3px;
}
.lang::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}

.head i.head-mch {
  width: 13px;
  height: 12px;
  background-image: url('~/static/images/home_mch.png');
}

.head i.head-msg {
  width: 15px;
  height: 13px;
  background-image: url('~/static/home-img/msg.png');
}

.head i.head-kefu {
  width: 14px;
  height: 13px;
  background-image: url('~/static/home-img/kefu.png');
}

.head i.head-app {
  width: 14px;
  height: 14px;
  background-image: url('~/static/home-img/app.png');
}

.header-right ul li a:hover {
  color: #e2041b;
}

/* .header-right-nav-content:hover {
  background: #ffffff;
} */

.header-right-jiantou {
  position: absolute;
  top: 39px;
  left: 35px;
  border-bottom: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 10px solid #ffffff;
  transform: rotate(-45deg);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.16);
}

.header-right-nav li {
  padding: 10px 15px; /* 适当调整内边距，提升可读性 */
  margin: 0;
  text-align: left; /* 左对齐更符合阅读习惯 */
  color: #333; /* 提高文字对比度 */
  border-right: none !important;
  cursor: pointer;
  display: block; /* 改为块级元素，垂直排列选项 */
  white-space: nowrap; /* 防止文字换行 */
}

/* 自定义滚动条样式 */
.header-right-nav::-webkit-scrollbar {
  width: 4px;
}

.header-right-nav li {
  border-bottom: 1px solid #dfdfdf;
}

.header-right-nav li:hover {
  background-color: #f5f5f5; /* 添加悬停效果 */
  color: #e2041b;
}

.header-right-nav::after {
  display: block;
  position: absolute;
  top: -15px;
  left: 35px;
  content: '';
  border-bottom: 10px solid transparent;
  border-left: 10px solid #fff;
  border-top: 10px solid transparent;
  transform: rotate(-90deg);
}

/* .header-right-nav-content:hover .header-right-nav {
  display: block !important;
} */

.logo-title {
  width: 1200px;
  margin: auto;
}

.auction_pm {
  font-size: 14px;
  color: #333;
  margin-top: 6px;
  margin-left: 50px;
}

.logo-title .logo-img {
  margin: 24px auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 32px;
}

.select-popper {
  margin: 0 !important;
  border: 0 !important;
  width: 59px !important;
}

.select-popper .el-select-dropdown__item {
  padding: 0 15px !important;
}

.select-popper .el-select-dropdown__item {
  padding: 0 15px !important;
}

.head-input {
  width: 361px;
  height: 35px;
  background: rgb(255, 255, 255);
  border-radius: 0px;
  opacity: 1;
  border: 1px solid #DDDDDD;
  padding-left: 35px;
  font-size: 14px;
  font-weight: normal;
}

.head-img {
  width: 18px;
  height: 18px;
  /* position: absolute;
  left: 12px;
  top: 12px; */
}

.head-ss {
  width: 56px;
  height: 36px;
  background:#B21E2E;
  color: rgb(255, 255, 255);
  text-align: center;
  line-height: 37px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.red_cart_box {
  width: 160px;
  height: 36px;
  background: rgb(255, 255, 255);
  border-radius: 0px;
  border: 1px solid rgb(221, 221, 221);
  display: flex;
  justify-content: center;
  align-items: center;
}

.cart_money {
  font-size: 12px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cart_money > span {
  color: #333333;
  line-height: 12px;
  height: 12px;
  font-size: 12px;
  margin-top: 10px;
  cursor: pointer;
}

.cart_money > p {
  display: flex;
  line-height: 12px;
  color: #d4282d;
}

.cart_money > p > span {
  height: 12px;
  line-height: 12px;
  margin-left: 3px;
  color: #333333;
}

.red_cart_box_left {
  position: relative;
  margin-right: 18px;
  margin-top: 5px;
}

.red_cart_box_left .red {
  display: inline-block;
  position: absolute;
  right: -10px;
  top: -5px;
  width: 16px;
  height: 12px;
  line-height: 13px;
  border-radius: 6px;
  background-color: red;
  text-align: center;
  color: #fff !important;
  font-size: 12px;
}

.red_cart_img {
  width: 18px;
  height: 18px;
}

.red_cart_box_right {
  font-size: 14px;
  font-family: MicrosoftYaHei-, MicrosoftYaHei;
  font-weight: normal;
  color: #e2041b;
  width: 100% !important;
  height: auto !important;
  line-height: 24px;
}

.mchMask {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 420px;
  height: 300px;
  background: rgba(255, 255, 255, 1);
}

.mchMask > p {
  font-size: 16px;
  line-height: 16px;
  margin-top: 14px;
  color: #020202;
}

.mchMask > span {
  display: block;
  color: #999999;
  font-size: 12px;
  line-height: 12px;
  margin-top: 10px;
}

.mchMask .btnBox {
  margin-top: 24px;
}

.mchMask .btnBox .btn {
  border-radius: 0;
  width: 112px;
  height: 36px;
  padding: 0;
}

.pay_yk4 {
  font-size: 12px;
  color: #72591e;
  margin-top: 19px;
  width: 158px;
  background-color: #e9ce8c;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

.cart_goods {
  max-height: 276px;
  overflow-y: auto;
}

.cart_goods li {
  display: flex;
  padding: 12px;
}

.cart_goods li:hover {
  background-color: #f6f6f6;
}

.cart_goods li > img {
  display: block;
  width: 60px !important;
  height: 60px !important;
  padding: 0;
}

.cart_ {
  position: absolute;
  top: 46px;
  /* right: 0; */
  right: -201px;
  width: 330px;
  width: 330px;
  max-height: 400px;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.16);
  z-index: 222;
}

.cart_ img {
  width: 40px !important;
  height: 39px !important;
  margin: 0 20px;
  padding: 20px 0;
  vertical-align: middle;
}

.cart_ span {
  width: auto;
  height: auto;
  font-size: 14px;
  color: #999999;
  vertical-align: middle;
}

.cart_ .title {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: #020202;
  border-bottom: 1px solid #eeeeee;
  box-sizing: border-box;
  font-weight: bold;
}

.cart_bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 54px;
  padding: 0 10px;
  font-size: 14px;
  background-color: #f6f6f6;
  box-sizing: border-box;
}

.cart_bottom > p {
  display: flex;
  align-items: center;
}

.cart_bottom > p span {
  line-height: 14px;
  color: #d4282d;
  font-size: 14px;
  height: 14px;
}

.cart_btn {
  width: 80px;
  height: 30px;
  background-color: #d4282d;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #fff !important;
  border: 0;
  outline: 0;
  cursor: pointer;
}

::v-deep.el-tooltip__popper.is-light {
  border: 0px;
  box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 16%);
  z-index: 99;
  width: 190px;
  /* height: 94px; */
}

.xx-tooltop {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
}

.tooltop-span {
  color: #020202;
  font-size: 14px;
}

.tooltop-img {
  width: 16px;
  height: 14px;
}

.tooltop-imgone {
  color: #b8b8b8;
  font-size: 12px;
  margin-top: 10px;
}

.dqtime {
  color: #7b6a41;
  font-size: 12px;
  margin-top: 10px;
}

.tooltop-imgtwo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 11px;
  cursor: pointer;
}

.tooltop-jiesuo {
  width: 171px;
  height: 30px;
  border-radius: 4px;
  border: 0.5px solid #d8d8d8;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(228, 226, 226, 0.8) 100%
  );
}

.tequan-box {
  background-color: #000000;
  color: #ffffff;
  display: flex;
  overflow: hidden;
  overflow-x: auto;
  justify-content: space-evenly;
  width: 100%;
  white-space: nowrap;
}

.tequan-dialog {
  background-color: #000000;
  color: #ffffff;
  display: flex;
  overflow: hidden;
  overflow-x: auto;
  width: 100%;
  white-space: nowrap;
}

.tequan_xq1 ::-webkit-scrollbar {
  width: 5px !important;
  height: 5px !important;
  background-color: #333;
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}

.tequan_xq1 ::-webkit-scrollbar-thumb {
  background-color: #666;
  height: 50px;
  outline-offset: -1px;
  outline: 1px solid #666;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  border-right: 1px solid #666;
  border-left: 1px solid #666;
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}

.tequan_xq1 ::-webkit-scrollbar-track {
  background-color: #000000;
}

.tequan {
  display: inline-flex;
  min-width: 33%;
  height: 110px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tequan_xq {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 21px;
  padding-left: 4%;
  padding-right: 4%;
}

.el-message {
  z-index: 9999 !important;
}

.redis_ys {
  font-size: 15px;
  font-weight: 400;
  color: #cccccc;
  line-height: 24px;
  margin-left: 5px;
}

.el-carousel--horizontal {
  overflow: hidden;
}

.addressMask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2999;
}

.hearder-acc {
  background-color: #ffffff;
}

.img_wpay {
  background-color: #ffffff;
  box-shadow: 0px 0px 12px 0px rgb(0 0 0 / 6%);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.msgBox > span {
  position: absolute;
  /* left: -9px; */
  left: 21px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #d80000;
  color: #ffffff;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
}

.order_Detail {
  justify-content: center;
  margin: 40px 0;
}

.addressMask > div {
  width: 578px;
  height: 510px;
  background: #fff;
}

.addressMask_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  height: 60px;
  color: #000;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  font-weight: 700;
}

.addressMask_content_item {
  display: flex;
  line-height: 36px;
  margin-bottom: 20px;
}

.addressMask_content_item > div {
  width: 76px;
  font-size: 14px;
}

/* 设置密码弹窗 */

.addressMaskMM {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.addressMaskMM > div {
  width: 578px;
  height: 510px;
  background: rgba(255, 255, 255, 1);
}

.addressMask_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  height: 60px;
  color: #000000;
  padding: 0 20px;
  border-bottom: 1px solid #e6e6e6;
  font-weight: bold;
}
.addressMask_title i {
  font-size: 20px;
  font-weight: bold;
  color: #999999;
}

.addressMask_content {
  height: 381px;
  padding: 50px 40px;
  box-sizing: border-box;
}
.addressMask_content_item {
  display: flex;
  line-height: 36px;
  margin-bottom: 20px;
}
.addressMask_content_item > div {
  width: 76px;
  font-size: 14px;
}
.addressMask_content_item_right {
  flex: 1;
  height: 36px;
  font-size: 14px;
  box-sizing: border-box;
}

.addressMask_bottom {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 68px;
  background-color: #f6f6f6;
}
.addressMask_bottom > div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 36px;
  box-sizing: border-box;
  cursor: pointer;
  margin-left: 10px;
  font-size: 16px;
}

.addressMask_bottom > div:first-child {
  border: 1px solid #b8b8b8;
  color: #666666;
}

.addressMask_bottom > div:last-child {
  background-color: #d4282d;
  color: #ffffff;
  margin-right: 40px;
}
.nopwd {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nopwd i {
  font-size: 40px;
  color: #d4282d;
  margin: 32px auto 12px;
}

.nopwd > p {
  font-size: 16px;
  line-height: 16px;
  color: #020202;
  margin-bottom: 24px;
}

.nopwd > div {
  margin-bottom: 36px;
}

.nopwd .el-button {
  width: 112px;
  height: 36px;
  border-radius: 0;
  padding: 0;
}

.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2999;
}

.agreementContent {
  display: flex;
  flex-direction: column;
  width: 860px;
  height: 650px;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
}

.mask_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 20px;
  font-size: 16px;
  line-height: 16px;
  color: #000000;
  font-weight: bold;
  border-bottom: 1px solid #e6e6e6;
}

.mask_title i {
  font-size: 20px;
  font-weight: bold;
  color: #999999;
  line-height: 16px;
}

.agreementContent_item {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
}

.history {
  position: absolute;
  top: 46px;
  left: 0;
  /* width: 280px; */
  width: 400px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.16);
  background: #ffff;
  z-index: 1000;
  max-height: 180px;
  overflow-y: auto;
}

.his_ {
  position: sticky;
  top: 0;
  background-color: #ffffff;
}

.his_,
.his_data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 10px;
  color: #999999;
  font-size: 14px;
  line-height: 30px;
  box-sizing: border-box;
}

.his_data:hover {
  color: #d4282d;
  background-color: #f6f6f6;
}

.his_data {
  cursor: pointer;
}

.clear {
  width: 12px !important;
  height: 14px !important;
}

.his_data:hover .his_close {
  display: block;
  height: auto;
}

.his_close {
  width: 9px !important;
  height: 9px;
  display: none;
}

.trade_box {
  display: flex;
  margin-bottom: 6px;
  font-size: 12px;
  color: #666666;
  align-items: center;
  justify-content: flex-start;
}

.goods > span {
  font-size: 12px;
  line-height: 12px;
  height: 12px;
  color: #999999;
}

.cart_money > span {
  color: #333333;
  line-height: 12px;
  height: 12px;
  font-size: 12px;
  margin-top: 10px;
  cursor: pointer;
}

/* .el-loading-spinner {
    margin-top: 0;
    transform: translateY(-50%);
} */
</style>
