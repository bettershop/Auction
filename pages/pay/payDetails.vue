<template>
  <div id="app">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{ $t("paydetails.title[0]") }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t("paydetails.title[1]") }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t("paydetails.title[2]") }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 地址 -->
    <div class="address">
      <!-- 收货方式 -->
      <template>
        <div class="address_top">
          <div class="mode">
            <span>{{ $t("paydetails.Receiving_method") }}</span>
            <div>
              <!-- 快递 -->
              <button :class="{ active: is_active == 1 }" @click="mode(1)">
                {{ $t("paydetails.express") }}
              </button>
              <!-- 自提 -->
              <button v-if="is_zt && is_supplier && shop_status" :class="{ active: is_active == 2 }" @click="mode(2)">
                {{ $t("paydetails.Self_Extraction") }}
              </button>
            </div>
          </div>
          <!-- 快递方式 新增收货地址 -->
          <div @click="addressFlag = true" v-if="is_active == 1">
            {{ $t("paydetails.long[0]") }}
            <span>+</span>
          </div>
          <!-- 自提方式 收货人 -->
          <div class="goods_peo" v-else-if="is_active == 2">
            <span>{{ $t("paydetails.long[1]") }}</span>
            <template v-if="address_list.length">
              <input type="text" class="ztinput" v-model="address_list[addressIndex].name" />
              <input type="text" class="ztinput" v-model="address_list[addressIndex].tel" />
            </template>
            <template v-else>
              <input type="text" class="ztinput" v-model="zitiName" />
              <input type="text" class="ztinput" v-model="zitiTel" />
            </template>
          </div>
        </div>
      </template>
      <!-- 地址信息 -->
      <template>
        <!-- 快递方式 地址信息 -->
        <div class="address_center" v-if="!loadFlag && is_active == 1">
          <template v-for="(item, index) of address_list">
            <div class="address_item" :class="{ active: addressId == item.id }" :key="index" v-if="moreAddress ? true : index < 3" @click="addressclick(item.id)">
              <!-- 收货人信息 -->
              <div class="address_item_top">
                <span>{{ item.name }}</span>
                <span>{{ item.tel }}</span>
              </div>
              <!-- 收货地址信息 -->
              <div class="address_item_center">
                <div>
                  {{ item.sheng }}&nbsp;{{ item.city }}&nbsp;{{ item.quyu }}
                </div>
                <p>{{ item.address }}</p>
              </div>
              <div class="address_item_bottom">
                <!-- 设置默认 -->
                <div :class="{ active: item.is_default == 1 }" @click.stop="setDefault(index)">
                  {{ $t("paydetails.setDefault") }}
                </div>
                <!-- 修改 -->
                <span @click.stop="upAddsindex(index)">{{
                  $t("paydetails.modify")
                }}</span>
                <!-- 删除 -->
                <span @click.stop="delAdds(index, item.id)">{{
                  $t("common_button[0]")
                }}</span>
              </div>
              <!-- 设置默认显示 此处通过样式控制 .active>.gouxuan{} -->
              <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
            </div>
          </template>
          <!-- 添加收货地址 -->
          <div class="address_item addAddress" @click="addressFlag = true">
            <i class="el-icon-plus"></i>
            <span>{{ $t("paydetails.long[2]") }}</span>
          </div>
        </div>

        <!-- 自提方式 地址信息 -->
        <div class="address_center" v-if="!loadFlag && is_active == 2">
          <template v-for="(item, index) of zt_list">
            <div class="address_item" :class="{ active: zi_id == item.id }" :key="index" v-if="moreAddress ? true : index < 3" @click="zi_idChange(item.id)">
              <!-- 自提店铺信息 -->
              <div class="address_item_top">
                <span>{{ item.name }}</span>
                <span>{{ item.mobile }}</span>
              </div>
              <!-- 收货地址信息 -->
              <div class="address_item_center">
                <div>
                  {{ item.sheng }}&nbsp;{{ item.shi }}&nbsp;{{ item.xian }}
                </div>
                <p>{{ item.address }}</p>
              </div>
              <!-- 自提店铺营业时间 -->
              <div class="address_item_bottom">
                <p style="color: #888888">
                  {{ $t("paydetails.time") }}{{ item.business_hours }}
                </p>
              </div>
              <!-- 设置默认显示 此处通过样式控制 .active>.gouxuan{} -->
              <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
            </div>
          </template>
        </div>
      </template>
      <!-- 显示更多地址 （大于3个会折叠）-->
      <template>
        <!-- 快递方式 显示更多地址 -->
        <div v-if="address_list.length > 3 && is_active == 1" class="address_bottom" @click="moreAddress = !moreAddress">
          <template v-if="!moreAddress">
            {{ $t("paydetails.long[3]") }}
            <i class="el-icon-arrow-down"></i>
          </template>
          <template v-else>
            {{ $t("paydetails.long[4]") }}
            <i class="el-icon-arrow-up"></i>
          </template>
        </div>

        <!-- 自提方式 显示更多地址 -->
        <div v-if="zt_list.length > 3 && is_active == 2" class="address_bottom" @click="moreAddress = !moreAddress">
          <template v-if="!moreAddress">
            {{ $t("paydetails.long[3]") }}
            <i class="el-icon-arrow-down"></i>
          </template>
          <template v-else>
            {{ $t("paydetails.long[4]") }}
            <i class="el-icon-arrow-up"></i>
          </template>
        </div>
      </template>
    </div>
    <!-- 地址结束 -->

    <!-- 支付方式 -->
    <div class="payStyle">
      <div class="payStyle_top">{{ $t("paydetails.pay[0]") }}</div>
      <div class="payStyle_bottom">
        <!-- 余额支付 -->
        <div v-if="payment.wallet_pay == 1" :class="{ active: defaultPayStyle == 'balance' }" @click=" setDefaultPayStyle('balance')">
          <img src="~/static/images/qianbao.png" alt="" />
          <div>
            <p>{{ $t("paydetails.pay[1]") }}</p>
            <span>（{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(user_money) }}）</span>
          </div>
          <!-- 选中此支付方式 此处通过样式控制 .active>.gouxuan{} -->
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
        <!-- 微信支付 -->
        <div v-if="payment.pc_wechat == 1 && $LaiKeCommObject.s_code == 'CNY' " :class="{ active: defaultPayStyle == 'wxPay' }" @click=" setDefaultPayStyle('wxPay')">
          <img src="~/static/images/wx_pay.png" alt="" />
          <!-- 选中此支付方式 此处通过样式控制 .active>.gouxuan{} -->
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>
        <!-- 支付宝支付 -->
        <div v-if="payment.pc_alipay == 1 && $LaiKeCommObject.s_code == 'CNY' " :class="{ active: defaultPayStyle == 'aliPay' }" @click="setDefaultPayStyle('aliPay')">
          <img src="~/static/images/ali_pay.png" alt="" />
          <!-- 选中此支付方式 此处通过样式控制 .active>.gouxuan{} -->
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>

        <!-- PayPal支付 -->
        <div v-if="payment.paypal == 1" :class="{ active: defaultPayStyle == 'paypal' }" @click="setDefaultPayStyle('paypal')">
          <img src="~/static/images/paypal.png" alt="" />
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>

        <!-- STRIPE支付 -->
        <div v-if="payment.stripe == 1" :class="{ active: defaultPayStyle == 'stripe' }" @click="setDefaultPayStyle('stripe')">
          <img src="~/static/images/stripe.png" alt="" width="208" style="height: 48px;" />
          <img class="gouxuan" src="~/static/images/gouxuan.png" alt="" />
        </div>

      </div>
    </div>
    <!-- 支付方式结束 -->

    <!-- 确认商品信息 -->
    <div class="proInfor">
      <div class="proInfor_top">
        {{ $t("paydetails.long[5]") }}
        <div @click="toUrl('/shoppingCart/shoppingCart')">
          {{ $t("paydetails.long[6]") }}
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>

      <ul class="proInfor_title">
        <li>{{ $t("paydetails.th[0]") }}</li>
        <li>{{ $t("paydetails.th[1]") }}</li>
        <li>{{ $t("paydetails.th[2]") }}</li>
        <li>{{ $t("paydetails.th[3]") }}</li>
      </ul>

      <template v-if="!loadFlag">
        <ul class="inforTable" v-for="(items, indexs) of products" :key="indexs">
          <li>{{ items.shop_name }}</li>
          <li v-for="(item, index) of items.list" :key="index">
            <div class="inforTable_name">
              <img :src="item.img" alt="" @error="handleErrorImg" />
              <div>
                <p>{{ item.product_title }}</p>
                <span>{{ item.size }}</span>
              </div>
            </div>
            <div class="inforTable_price">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</div>
            <div class="inforTable_num">x{{ item.num }}</div>
            <div class="inforTable_zprice">
              {{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice((item.price * item.num)) }}
            </div>
          </li>

          <li>
            <div style="
                padding: 13px 20px;
                box-sizing: border-box;
                display: flex;
                flex: 1;
                max-width: 500px;
                min-height: 100px;
              ">
              <p style="width: 117px; font-size: 14px; color: #020202">
                {{ $t("orderdetails.logistics[7]") }}
              </p>
              <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10 }" :placeholder="$t('paydetails.placeholder[5]')" v-model="items.remarks" maxlength="200" show-word-limit>
              </el-input>
            </div>
            <div class="mchprice" style="padding: 13px 20px; box-sizing: border-box">
              <!-- is_supplier_pro 是否存在供应商商品 如有存在 则不要显示优惠券 -->
              <template v-if="commodity_type != 1 && is_supplier_pro">
                <div class="mchyhq" v-if="vipSource == 0 || pluginStatus.isVip == false" style="font-size: 14px; color: #020202">
                  {{ $t("paydetails.long[7]") }}
                  <el-select v-if="items.coupon_list.length > 0" v-model="mch_sale[indexs]" :placeholder="$t('paydetails.placeholder[0]')" @change="mchChange()">
                    <el-option v-for="(item, index) of items.coupon_list" :key="item.coupon_id" :label="item.coupon_name" :value="item.coupon_id"></el-option>
                  </el-select>
                  <template v-else>{{ $t("paydetails.long[8]") }}</template>
                </div>
              </template>
              <template v-if="commodity_type != 1">
                <p class="mchfreight" v-if="is_freight" style="font-size: 14px; color: #020202">
                  {{ $t("paydetails.long[9]")
                  }}{{
                    items.freight_price == 0
                      ? $t("paydetails.long[10]")
                      : $LaiKeCommObject.show_symbol + $LaiKeCommObject.formatPrice(items.freight_price)
                  }}
                </p>
              </template>
            </div>
          </li>
          <li>
            <div class="mchprice">
              <div style="text-align: end">
                {{ $t("paydetails.long[11]") }}&nbsp;<span>{{
                  items.products_num
                }}</span>&nbsp;{{ $t("paydetails.long[12]") }}
                <span v-if="is_active == 1">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(items.shop_subtotal) }}</span>
                <span v-if="is_active == 2">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(items.product_total) }}</span>
              </div>
            </div>
          </li>
        </ul>
      </template>
      <ul v-else class="inforTable">
        <li class="nonavtitle"></li>
        <li>
          <div class="inforTable_name">
            <img class="nonavtitle" src="" alt="" />
            <div>
              <p class="nonavtitle" style="width: 150px"></p>
              <span class="nonavtitle" style="display: block; width: 60px"></span>
            </div>
          </div>
          <div class="inforTable_price center">
            <span class="nonavtitle"></span>
          </div>
          <div class="inforTable_num center">
            <span class="nonavtitle"></span>
          </div>
          <div class="inforTable_zprice center">
            <span class="nonavtitle"></span>
          </div>
        </li>
        <li>
          <p class="nonavtitle"></p>
          <div class="nonavtitle"></div>
        </li>
      </ul>

      <div class="priceBox" v-if="!loadFlag">
        <div class="coupon" v-if="
            (vipSource == 0 || pluginStatus.isVip == false) && is_supplier_pro
          ">
          <div class="coupon_top">
            {{ $t("paydetails.Discount[0]") }}
            <span>{{ coupon_num ? coupon_num : 0
              }}{{ $t("paydetails.Discount[1]") }}</span>
          </div>
          <el-select v-if="coupon_list.length > 0" v-model="coupon_id" :placeholder="$t('paydetails.Discount[2]')" @change="couChange()">
            <el-option v-for="(item, index) of coupon_list" :key="item.coupon_id" :label="item.coupon_name" :value="item.coupon_id + ',' + item.discount_type"></el-option>
          </el-select>
          <template v-else>{{ $t("paydetails.Discount[3]") }}</template>
        </div>
        <ul>
          <li>
            {{ $t("paydetails.Discount[4]") }}
            <p>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(products_total) }}</p>
          </li>
          <li>
            {{ $t("paydetails.Discount[10]") }}
            <p>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(freight)||'0.00'}}</p>
          </li>
          <li v-if="!vipSource">
            {{ $t("paydetails.Discount[5]") }}
            <p>-{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(mch_preferential_amount) }}</p>
          </li>
          <li v-if="!vipSource">
            {{ $t("paydetails.Discount[6]") }}
            <p>-{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(preferential_amount) }}</p>
          </li>
          <li v-if="isVip && $LaiKeCommObject.formatPrice(member_benefits || 0) > 0">
            {{ $t("paydetails.Discount[7]") }}
            <p>-{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(member_benefits) }}</p>
          </li>
          <li>
            {{ $t("paydetails.Discount[8]") }}
            <p style="font-weight: bold; color: #d4282d">
              {{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(total) }}
            </p>
          </li>
        </ul>
      </div>

      <div class="priceBox" v-else>
        <ul>
          <li>
            {{ $t("paydetails.Discount[9]") }}
            <p class="nonavtitle"></p>
          </li>
          <li>
            {{ $t("paydetails.Discount[10]") }}
            <p class="nonavtitle"></p>
          </li>
          <li>
            {{ $t("paydetails.Discount[11]") }}
            <p class="nonavtitle"></p>
          </li>
          <li>
            {{ $t("paydetails.Discount[12]") }}
            <p class="nonavtitle"></p>
          </li>
        </ul>
      </div>
    </div>
    <!-- 确认商品信息结束 -->

    <!-- 底部提交订单信息 -->
    <div class="payBottom" v-if="!loadFlag">
      <div class="payBottom_top">
        {{ $t("paydetails.Discount[12]") }}<span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(total) }}</span>
        <div class="payBtn" @click="saveOk">
          {{ $t("paydetails.Discount[13]") }}
        </div>
      </div>

      <template v-for="(item, index) of address_list">
        <p v-if="addressId == item.id" :key="item.id" style="margin-top: 20px">
          {{ $t("paydetails.long[14]") }}{{ item.sheng }}&nbsp;{{
            item.city
          }}&nbsp;{{ item.quyu }}&nbsp;{{ item.address }}
        </p>
        <p v-if="addressId == item.id" :key="index + '-' + item.id">
          {{ item.name }}&nbsp;&nbsp;{{
            item.tel.substr(0, 3) + "****" + item.tel.substr(7, 11)
          }}
        </p>
      </template>
    </div>
    <div class="payBottom" v-else>
      <div class="payBottom_top">
        {{ $t("paydetails.Discount[12]") }}<span class="nonavtitle"></span>
        <div class="payBtn" @click="saveOk">
          {{ $t("paydetails.Discount[13]") }}
        </div>
      </div>

      <p class="nonavtitle" style="
          margin-top: 20px;
          display: block;
          width: 200px;
          margin-left: auto;
        "></p>
      <p class="nonavtitle" style="display: block; width: 100px; margin-left: auto; margin-top: 5px"></p>
    </div>
    <!-- 底部提交订单信息结束 -->

    <!-- 新增收货地址弹窗 -->
    <div class="addressMask" v-if="addressFlag">
      <div>
        <div class="addressMask_title">
          {{ modifyAdds ? $t("paydetails.edit") : $t("paydetails.add")
          }}{{ $t("paydetails.Receiving_address[0]") }}
          <i class="el-icon-close" @click="addressFlag = false"></i>
        </div>

        <div class="addressMask_content">
          <div class="addressMask_content_item">
            <div>{{ $t("paydetails.Receiving_address[1]") }}</div>
            <el-cascader class="addressMask_content_item_right" v-model="addressValue" :options="addressOptions" :placeholder="$t('paydetails.placeholder[1]')"></el-cascader>
          </div>
          <div class="addressMask_content_item">
            <div>{{ $t("paydetails.Receiving_address[2]") }}</div>
            <el-input class="addressMask_content_item_right" v-model="addressDisc" type="textarea" maxlength="50" :rows="3" :placeholder="$t('paydetails.placeholder[2]')" style="height: 75px">
            </el-input>
          </div>

          <div class="addressMask_content_item">
            <div>{{ $t("paydetails.Receiving_address[3]") }}</div>
            <el-input v-model="addressName" maxlength="10" class="addressMask_content_item_right" :placeholder="$t('paydetails.placeholder[3]')" clearable>
            </el-input>
          </div>

          <div class="addressMask_content_item">
            <div>{{ $t("paydetails.Receiving_address[4]") }}</div>
            <el-input v-model="addressTel" class="addressMask_content_item_right" :placeholder="$t('paydetails.placeholder[4]')" clearable></el-input>
          </div>

          <el-checkbox v-model="addressDefault" style="margin-left: 76px">{{
            $t("paydetails.Receiving_address[5]")
          }}</el-checkbox>
        </div>

        <div class="addressMask_bottom">
          <div @click="addressFlag = false">{{ $t("cancel") }}</div>
          <div @click="saveAddress">{{ $t("common_button[2]") }}</div>
        </div>
      </div>
    </div>
    <!-- 新增收货地址弹窗结束 -->

    <!-- 输入密码弹窗 -->
    <div class="addressMask" v-if="yuepayFlag">
      <div style="height: auto" v-loading="fullscreenLoading">
        <div class="addressMask_title">
          {{ $t("paydetails.password[0]") }}
          <i class="el-icon-close" @click="yuepayFlag = false"></i>
        </div>

        <div class="addressMask_content_item" style="justify-content: center; margin: 50px 0">
          <div>{{ $t("paydetails.password[1]") }}</div>
          <el-input :placeholder="$t('paydetails.password[2]')" v-model="password" show-password style="width: 360px"></el-input>
        </div>

        <div class="addressMask_bottom">
          <div @click="yuepayFlag = false">{{ $t("cancel") }}</div>
          <div @click="savePassword">{{ $t("common_button[2]") }}</div>
        </div>
      </div>
    </div>
    <!-- 输入密码弹窗结束 -->

    <!-- 没有支付密码弹窗 -->
    <div class="addressMask" v-if="pwdFlag">
      <div class="nopwd" style="height: auto; width: 420px">
        <i class="el-icon-warning-outline"></i>
        <p>{{ $t("paydetails.long[13]") }}</p>
        <div>
          <el-button @click="pwdFlag = false">{{ $t("cancel") }}</el-button>
          <el-button type="danger" @click="toUrl('/my/my/security')">{{
            $t("paydetails.set")
          }}</el-button>
        </div>
      </div>
    </div>
    <!-- 没有支付密码弹窗结束 -->
  </div>
</template>
<script>
import ErrorImg from "@/static/images/default_picture.png";

export default {
  async asyncData({ app, query, $Api }) {
    let pc_user = app.$cookies.get("pc_user");
    let product = query.product;
    let cart_id = query.cart_id;
    let vipSource = query.vipSource;
    return {
      pc_user,
      product,
      cart_id,
      vipSource,
    };
  },
  layout: "homeLayout",
  data() {
    return {
      pluginStatus: {},
      vipSource: "",
      loadFlag: true,
      pc_user: {},
      product: "",
      cart_id: "", //购物车id
      moreAddress: false,
      payStyle: "wallet_pay",
      defaultPayStyle: "balance",//改成跟移动端一致 stripe balance余额 paypal贝宝 aliPay支付宝 wxPay微信
      defaultpayment: {}, //默认支付方式
      remarks: "", //订单备注
      couponFlag: false, // 优惠券弹窗
      modifyAdds: "",
      payment: {}, //支付方式
      password: "",
      password_status: "", //是否设置了支付密码
      coupon_num: "",
      products: [],
      products_total: "",
      total: "",
      freight: "",
      coupon_money: "",
      user_money: "",
      yuepayFlag: false,
      order_list: "",
      coupon_list: [],
      coupon_id: "",
      checkedCouponItem: {},
      fullscreenLoading: false,
      grade_rate: "",
      // 店铺优惠
      mch_sale: [],
      canshu: false,
      preferential_amount: 0,
      mch_preferential_amount: 0,
      grade_rate_amount: 0,
      pwdFlag: false,
      commodity_type: "",
      zt_list: [],
      zi_id: "",
      shop_id: "",

      is_active: 1,
      is_freight: true,
      shop_address_id: "",
      address_list: [], //收货人信息
      addressId: "", //已选中的地址ID
      addressIndex: 0, //已选中的地址ID，在address_list中的下标
      addressFlag: false, // 添加地址弹窗
      addressValue: "", // 添加地址弹窗，所在地区选项
      addressDisc: "", //详细地址
      addressName: "",
      addressTel: "",
      addressDefault: false,
      addressOptions: [],
      member_benefits: "", //会员优惠
      isVip: false,
      zitiName: "",
      zitiTel: "",
      is_zt: true, //是否 存在自提点
      is_supplier: false, //是否 是供应商
      shop_status: true, //是否 显示自提地址 （显示自提地址实际由 is_zt && is_supplier && shop_status 三个参数控制）
      is_supplier_pro: true, // true:不是供应商商品  false:供应商商品
      oderPayType: "", //当前支付方式，切换支付方式需要重新渲染数据，且余额支付接口需传pay_type：wallet_pay（下单接口也要）；此功能是优化功能0元支付 bugID 52195。

      stripeLoaded: false, // 标记脚本是否加载完成
      stripe: null // 存储脚本导出的对象
    };
  },
  watch: {
    payStyle(val) {
      console.log("支付方式变化～", val);
      this.oderPayType = val;
      let coupon_arr = [];
      this.mch_sale.filter((item) => {
        let id = item ? item : 0;
        coupon_arr.push(id);
      });
      if (this.coupon_id) {
        coupon_arr.push(this.coupon_id);
      } else {
        coupon_arr.push("0,0", "no_discount");
      }
      if (this.is_active == 2) {
        var zi_id = this.zi_id;
      } else {
        var zi_id = "";
      }
      var data = {
        api: "mall.Order.settlement",
        product_type: "", // 商品类型
        address_id: this.addressId, // 地址id
        vipSource: this.vipSource,
        canshu: this.canshu,
        shop_address_id: zi_id,
        pay_type: this.oderPayType,
      };
      data.coupon_id = coupon_arr.join();
      if (this.product) {
        data.product = this.product; // 商品数组
      } else {
        data.cart_id = this.cart_id; // 购物车id-- 12,13,123, =
      }
      this.$Api.doRequest(data)
        .then((res) => {
          this.total = res.data.total;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    addressFlag(val) {
      if (!val) {
        this.addressValue = "";
        this.addressDisc = "";
        this.addressName = "";
        this.addressTel = "";
        this.addressDefault = false;
        this.modifyAdds = "";
      }
    },
    yuepayFlag(val) {
      if (!val) {
        this.$confirm(
          this.$t("paydetails.Tips[0]"),
          this.$t("paydetails.Tips[1]"),
          {
            confirmButtonText: this.$t("common_button[2]"),
            cancelButtonText: this.$t("cancel"),
            type: "warning",
          }
        )
          .then(() => {
            this.toUrl("/my/my/myOrder");
          })
          .catch(() => {
            this.toUrl("/");
          });
      }
    },
  },

  mounted() {
    //获取缓存中的支付方式
    if (this.$storage.get("oderPayType")) {
      let oderPayType = this.$storage.get("oderPayType");
      if (oderPayType.wallet_pay) {
        this.oderPayType = "wallet_pay";
      }
    }
    setTimeout(() => {
      this.mchCoupon = this.$storage.get("mchCoupon");
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
    if (this.product) {
      var decodeData = window.atob(this.product);
      this.product = decodeData;
      this.product = this.product.replace(/%22/g, '"');
    }
    this.pc_user = this.$cookies.get("pc_user") || this.$storage.get('user');
    this.pluginStatus = this.$storage.get("pluginStatus");

    this.$LaiKeCommObject.setUserCurrency(this.pc_user.userCurrency);

    this.getApi();
    this.getAddressJson();
    this.handleIsVip();
    console.log(this.payStyle);

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
    handleErrorImg(e) {
      e.target.src = ErrorImg;
    },
    async handleIsVip() {
      var data = {
        api: "mall.Index.index",
      };
      let res = await this.$Api.doRequest(data);
      this.pluginStatus = res.data.pluginStatus;
      this.isVip = this.pluginStatus.isVip;
    },
    addressclick(e) {
      this.addressId = e;
      this.getApi();
    },
    _axios_mode() {
      let data = {
        api: "mch.mall.Mch.seeMyStore",
        shop_id: this.shop_id,
      };
      this.$Api.doRequest(data)
        .then((res) => {
          if (res.code == 200) {
            this.zt_list = res.data.list;
            if (this.zt_list.length != 0) {
              this.shop_address_id = this.zt_list.find(
                (item) => item.is_default === 1
              ).id;
            }
            if (this.zt_list == null || this.zt_list.length == 0) {
              this.is_zt = false;
            }
            for (var i in this.zt_list) {
              if (i == 0) {
                this.zi_id = this.zt_list[i].id;
              }
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    zi_idChange(item) {
      this.zi_id = item;
      this.shop_address_id = item;
    },
    mode(type) {
      this.is_active = type;
      if (this.is_active == 2) {
        this.is_freight = false;
        this.total = this.total - this.freight;
      } else if (this.is_active == 1) {
        this.is_freight = true;
        this.total = this.total + this.freight;
      }
      this.getApi();
    },
    /*
        修改地址
       */
    upAddsindex(index) {
      var data = {
        // module: 'app_pc',
        // action: 'address',
        // m: 'up_addsindex',
        api: "mall.Address.upAddsindex",

        addr_id: this.address_list[index].id,
      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.addressValue = [
            res.data.province,
            res.data.city_id,
            res.data.county,
          ];
          this.addressDisc = res.data.address.address;
          this.addressName = res.data.address.name;
          this.addressTel = res.data.address.tel;
          this.addressDefault = res.data.address.is_default == 1 ? true : false;

          this.modifyAdds = res.data.address.id;
          this.addressFlag = true;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    /*
        删除地址
       */
    delAdds(index, id) {
      var data = {
        // module: 'app_pc',
        // action: 'address',
        // m: 'del_adds',
        api: "mall.Address.delAdds",

        addr_id: this.address_list[index].id,
      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.$message.success(this.$t("paydetails.Tips[2]"));

          this.address_list = res.data;

          if (res.data && res.data.length > 0) {
            var i = res.data.findIndex((item) => {
              return this.addressId == item.id;
            });

            if (i < 0) {
              this.addressId = res.data[0].id;
            }
          } else {
            this.addressId = "";
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    /*
        设为默认地址
       */
    setDefault(index) {
      if (this.address_list[index].is_default == 1) {
        return;
      }
      var data = {
        // module: 'app_pc',
        // action: 'address',
        // m: 'set_default',
        api: "mall.Address.setDefault",

        addr_id: this.address_list[index].id,
      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.address_list = res.data;

          res.data.filter((item) => {
            if (item.is_default == 1) {
              this.addressId = item.id;
            }
          });
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    checkval(str) {
      var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    /*
        保存地址
       */
    saveAddress() {
      if (!this.addressValue) {
        this.$message.error(this.$t("paydetails.Tips[3]"));
        return;
      }

      if (!this.addressDisc) {
        this.$message.error(this.$t("paydetails.Tips[4]"));
        return;
      }

      if (!this.addressName) {
        this.$message.error(this.$t("paydetails.Tips[5]"));
        return;
      }

      if (!this.checkval(this.addressName)) {
        this.$message.error(this.$t("paydetails.Tips[6]"));
        return;
      }

      if (!this.addressTel) {
        this.$message.error(this.$t("paydetails.Tips[7]"));
        return;
      }

      var place = this.addressValue.join(",");
      var address = this.addressDisc;
      var user_name = this.addressName;
      var mobile = this.addressTel;
      var is_default = this.addressDefault ? 1 : 0;

      var data = {
        api: "mall.Address.saveAddress",

        place,
        address,
        user_name,
        mobile,
        is_default,
      };

      if (this.modifyAdds) {
        data.api = "mall.Address.upAdds";
        data.addr_id = this.modifyAdds;
      }

      this.$Api.doRequest(data)
        .then((res) => {
          if (res.code == "200") {
            this.addressFlag = false;
            this.address_list = res.data;

            if (this.modifyAdds) {
              this.$message.success(this.$t("paydetails.Tips[8]"));
            } else {
              this.$message.success(this.$t("paydetails.Tips[9]"));
            }

            if (res.data && res.data.length > 0) {
              res.data.filter((item) => {
                if (item.is_default == 1) {
                  this.addressId = item.id;
                }
              });
            }
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
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
        // module: 'app_pc',
        // action: 'user',
        // m: 'payment_password',
        api: "mall.User.paymentPassword",

        password: this.password, //  密码
      };

      this.fullscreenLoading = true;
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      this.$Api.doRequest(data)
        .then((res) => {
          if (res.code == "200") {
            this.payResult();
          } else {
            this.fullscreenLoading = false;
          }
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          this.$message.error(error.message);
        });
    },
    splitOrder(callback) {
      var data = {
        // module: 'app_pc',
        // action: 'order',
        // m: 'leave_Settlement',
        api: "mall.Order.leaveSettlement",

        order_list: JSON.stringify(this.order_list),
      };

      this.$Api.doRequest(data).then((res) =>
        setTimeout(() => {
          callback();
        }, 100)
      );
    },
    payResult() {
      var data = {
        api: "mall.Pay.walletPay",
        sNo: this.order_list.sNo,

        order_list: JSON.stringify(this.order_list),
        type: "wallet_pay", // 支付方式
        payment_money: this.total,
      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.$root.$emit("shoppingCart");

          // this.splitOrder(() => {
          this.$message.success(this.$t("paydetails.Tips[12]"));
          this.fullscreenLoading = false;
          this.$router.push({
            path: "/pay/payResult",
            query: {
              payStyle: "wallet_pay",
              order_list: JSON.stringify(this.order_list),
            },
          });
          // })
        })
        .catch((error) => {
          this.fullscreenLoading = false;
          this.$message.error(error.message);
        });
    },
    /*
        提交订单
      */
    saveOk() {
      //获取订单备注
      this.remarks = [];
      this.products.forEach((item, index) => {
        this.remarks.push(item.remarks || "");
      });
      //判断是否有备注信息
      let isTrue = this.products.every((item, index) => {
        return item.remarks == "";
      });
      //如果没有备注，转回字符串类型; 有备注转化一下类型，好传值。
      if (isTrue) {
        this.remarks = "";
      } else {
        this.remarks = JSON.stringify(this.remarks);
      }
      let coupon_arr = [];
      this.mch_sale.filter((item) => {
        let id = item ? item : 0;
        coupon_arr.push(id);
      });
      console.log(coupon_arr);
      if (this.coupon_id) {
        coupon_arr.push(this.coupon_id);
      } else {
        coupon_arr.push("0,0");
      }
      if (this.is_active == 1 && this.addressId == "") {
        this.$message.error("没有选择收货地址");
        return;
      }
      var data = {
        api: "mall.Order.payment",
        vipSource: this.vipSource,

        grade_l: "0", //会员特惠 兑换券级别
        type: "", //  订单类型
        coupon_id: coupon_arr.join(), // 优惠券id
        allow: 0, // 用户使用积分
        address_id: this.addressId, //  地址id
        remarks: this.remarks, //  订单备注
        pay_type: this.payStyle, // 支付类型
        currency_code: this.$LaiKeCommObject.show_code,
        currency_symbol: this.$LaiKeCommObject.show_symbol,
        exchange_rate: this.$LaiKeCommObject.show_rate,

      };
      if (this.is_active == 2) {
        data.shop_address_id = this.shop_address_id;
        if (this.address_list && this.address_list.length) {
          data.fullName = this.address_list[this.addressIndex].name;
          data.fullPhone = this.address_list[this.addressIndex].tel;
        } else if (this.zitiName != "" && this.zitiTel != "") {
          data.fullName = this.zitiName;
          data.fullPhone = this.zitiTel;
        } else {
          data.fullName = "";
          data.fullPhone = "";
        }
        if (data.fullName == "" || data.fullPhone == "") {
          this.$message.error("请先设置收货人");
          return;
        }
      } else if (this.is_active == 1) {
        data.shop_address_id = "";
      }
      if (this.payStyle == "wallet_pay") {
        if (this.password_status == "0" || !this.password_status) {
          this.pwdFlag = true;
          return;
        }

        if (this.total > this.user_money) {
          this.$message.error(this.$t("paydetails.Tips[13]"));
          return;
        }
      }
      if (this.product) {
        data.product = this.product; // 商品数组
      } else {
        data.cart_id = this.cart_id; // 购物车id-- 12,13,123, =
      }
      this.$Api.doRequest(data)
        .then((res) => {
          this.order_list = res.data;

          if (this.payStyle == "wallet_pay") {
            if (res.code == 200) {
              this.yuepayFlag = true;
            } else {
              return;
            }
            return;
          } else if (this.payStyle == "pc_wechat") {
            var payData = {
              api: "mall.Pay.index",
              total: this.order_list.total, //会员特惠 兑换券级别
              remarks: this.remarks, //  订单备注
              title: this.products[0].list[0].product_title,
              order_list: this.order_list,
              type: this.payStyle, //  支付类型
            };
            this.$cookies.set("payData", payData);
            this.$storage.set("payData", payData);
            this.$router.push({
              path: "/pay/scanCode",
            });
          } else if (this.payStyle == "pc_alipay") {
            var payData = {
              api: "mall.Pay.index",
              total: this.order_list.total, //会员特惠 兑换券级别
              remarks: this.remarks, //  订单备注
              title: this.products[0].list[0].product_title,
              order_list: this.order_list,
              type: this.payStyle, //  支付类型
            };
            this.$cookies.set("payData", payData);
            this.$storage.set("payData", payData);
            this.$router.push({
              path: "/pay/scanCode",
            });
          } else if (this.payStyle == "paypal") {
            var payData = {
              api: "mall.Pay.index",
              total: this.order_list.total, //会员特惠 兑换券级别
              remarks: this.remarks, //  订单备注
              title: this.products[0].list[0].product_title,
              order_list: this.order_list,
              sNo: this.order_list.sNo,
              pay_type: this.payStyle,
              type: this.payStyle, //  支付类型
            };

            this.$cookies.set("payData", payData);
            this.$storage.set("payData", payData);
            this.$router.push({
              path: "/pay/scanCode",
            });
          } else if (this.payStyle == "stripe") {

            this.$Api.doRequest({
              api: "mall.Pay.index",
              total: this.order_list.total, //会员特惠 兑换券级别
              remarks: this.remarks, //  订单备注
              title: this.products[0].list[0].product_title,
              // order_list: this.order_list,
              sNo: this.order_list.sNo,
              pay_type: this.payStyle,
              type: this.payStyle, //  支付类型
            }).then(res => {
              console.log(res)
              if (res.code == 200) {
                const stripe_id = res.data.stripe_id
                const publishable_key = res.data.publishable_key

                // 初始化 Stripe（用你的 publishable key）
                const stripe = Stripe(publishable_key);

                // 重定向到 Stripe Checkout
                stripe.redirectToCheckout({
                  sessionId: stripe_id
                }).then(function (result) {

                });
              } else {
                // this.$message.error(res.message);
              }
            })


            this.$cookies.set("payData", data);
            this.$storage.set("payData", data);


          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    couChange() {
      this.canshu = true;
      console.log(this.products);
      this.getApi();
    },
    mchChange() {
      this.canshu = true;
      this.getApi();
    },
    /*
        获取订单信息
       */
    getApi() {
      let coupon_arr = [];
      this.mch_sale.filter((item) => {
        let id = item ? item : 0;
        coupon_arr.push(id);
      });
      if (this.coupon_id) {
        coupon_arr.push(this.coupon_id);
      } else {
        coupon_arr.push("0,0", "no_discount");
      }
      if (this.is_active == 2) {
        var zi_id = this.zi_id;
      } else {
        var zi_id = "";
      }
      var data = {
        api: "mall.Order.settlement",

        product_type: "", // 商品类型
        address_id: this.addressId, // 地址id
        vipSource: this.vipSource,
        canshu: this.canshu,
        shop_address_id: zi_id,
        pay_type: this.oderPayType,
      };
      //传入语言参数
      data.language = this.$cookies.get("currentLang");
      // if(this.is_active==2){
      // 	data.coupon_id = 0
      // }else if(this.is_active==1){
      // 	data.coupon_id=coupon_arr.join() // 优惠券id
      // }
      data.coupon_id = coupon_arr.join();
      if (this.product) {
        data.product = this.product; // 商品数组
      } else {
        data.cart_id = this.cart_id; // 购物车id-- 12,13,123, =
      }

      this.$Api.doRequest(data)
        .then((res) => {
          if (res.code == "200") {
            this.canshu = false;
            this.grade_rate = 10 * this.$LaiKeCommObject.formatPrice(res.data.grade_rate);
            this.payment = res.data.payment;
            this.defaultpayment = res.data.defaultpayment;
            if (this.defaultpayment) {
              this.defaultPayStyle = this.defaultpayment.defaultpayName
              this.setDefaultPayStyle(this.defaultPayStyle)
            } else {
              if (this.payment.wallet_pay == 1) {
                this.payStyle = "wallet_pay";
              } else if (this.payment.pc_wechat == 1) {
                this.payStyle = "pc_wechat";
              } else if (this.payment.pc_alipay == 1) {
                this.payStyle = "pc_alipay";
              }
            }
            this.password_status = res.data.password_status;


            if (res.data.address_list && res.data.address_list.length > 0) {
              res.data.address_list.filter((item) => {
                if (item.is_default == 1 && this.addressId == "") {
                  this.addressId = item.id;
                }
              });
            }

            //如果自提没有地址则不显示自提按钮
            // if(res.data.shop_list==null || res.data.shop_list.sheng==null){
            //     this.is_zt = false
            // }
            this.addresssx = res.data.omsg;
            this.coupon_list = res.data.coupon_list;
            // fuleForm.freight = freight_list.find(
            // item => item.is_default === "1"
            // ).i
            if (this.coupon_list.length != 0) {
              var id = res.data.coupon_list.find(
                (item) => item.coupon_status === true
              ).coupon_id;
              var type = res.data.coupon_list.find(
                (item) => item.coupon_status === true
              ).discount_type;
              this.coupon_id = id + "," + type;
            }
            this.is_supplier_pro = res.data.is_supplier_pro;
            //在商品列表中加一个参数，用于备注
            this.products.forEach((item, index) => {
              //双向绑定
              this.$set(this.products[index], "remarks", "");
            });
            this.address_list = res.data.address_list;
            //此处新增一个choose参数,这个参数记录当前选中收货人信息;
            //此参数用于先在【收货方式：快递】选中地址后，再选【收货方式：自提】时收货人动态变化.
            //如果存在选中地址addressId,则标记此id为选中状态,否则标记默认收货人为选中状态.
            this.address_list.forEach((item, index) => {
              if (this.addressId && item.id == this.addressId) {
                //双向绑定
                this.$set(item, "choose", true);
                //记录当前选中地址的下标
                this.addressIndex = index;
              } else {
                if (!this.addressId && item.is_default) {
                  //双向绑定
                  this.$set(item, "choose", true);
                  //记录当前选中地址的下标
                  this.addressIndex = index;
                } else {
                  //双向绑定
                  this.$set(item, "choose", false);
                }
              }
            });
            this.coupon_num = res.data.coupon_num;
            this.products = res.data.products;
            this.products_total = res.data.products_total;
            this.total = res.data.total;
            this.freight = res.data.freight;
            this.coupon_money = res.data.coupon_money;
            this.user_money = res.data.user_money;
            this.mch_preferential_amount = res.data.mch_preferential_amount;
            this.preferential_amount = res.data.preferential_amount;
            this.member_benefits = res.data.grade_rate_amount;
            this.grade_rate_amount = res.data.grade_rate_amount;
            this.is_supplier = res.data.is_supplier_pro;
            this.shop_status = res.data.shop_status;
            this.shop_id = res.data.products[0].shop_id;
            if (this.mch_sale.length == 0) {
              this.products.filter((items) => {
                let i = items.coupon_list.findIndex((item) => {
                  return item.coupon_status;
                });

                if (i < 0) {
                  this.mch_sale.push(undefined);
                } else {
                  this.mch_sale.push(items.coupon_list[i].coupon_id);
                }
              });
            }
            this.loadFlag = false;
            this._axios_mode();
          } else if (res.code == 50871) {
            this.$message.error(res.message);
            setTimeout(() => {
              this.toUrl("/shoppingCart/shoppingCart");
            }, 1000);
            return;
          }
        })
        .catch((error) => {
          this.loadFlag = false;

          this.$message.error(error.message);
        });
    },
    /*
        获取省市区地址
       */
    getAddressJson() {
      var data = {
        // module: 'app_pc',
        // action: 'address',
        // m: 'AddressManagement',
        api: "mall.Address.addressManagement",

      };

      this.$Api.doRequest(data).then((res) => {
        this.addressOptions = res.data;
      });
    },
    toUrl(url) {
      this.$router.push({
        path: url,
      });
    },
  },
};
</script>
<style scoped>
@import '~/assets/css/pay/payDetails.css';
</style>
