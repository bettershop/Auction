<template>
  <div id="app">
    <div class="border" style="width: 100%; height: 1px; margin-bottom: 20px; background: #e6e6e6"></div>

    <div class="container">
      <div class="condition">
        <el-breadcrumb v-if="!loadFlag" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{ $t('mch.title') }}{{ shop_infor.shop_name }}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-breadcrumb v-else separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <span class="nonavtitle" style="width: 120px"></span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="mchTop" v-if="!loadFlag">
          <!-- banner start -->
          <!-- <el-carousel  v-if="bannerList.length>0" arrow="always" trigger="click" style="width: 400px;height: 242px;">
                <el-carousel-item v-for="item in bannerList" :key="item.id" style="width: 400px;height: 242px;">
                  <img class="bannerImg" :src="item.image" alt="" style="width: 400px;height: 242px;" @click="toUrl(item.url)">
                </el-carousel-item>
            </el-carousel> -->
          <img :src="shop_infor.poster_img" width="300" height="242" @error="handleErrorImg" />
          <div style="height: 242px"></div>

          <!-- banner end -->

          <div class="mchTop_right">
            <div class="mch_one">
              <div class="mchTop_right_top">
                <div class="relative" style="margin-right: 12px">
                  <img class="mch_logo" :src="shop_infor.Head_img" alt="" @error="handleErrorImg" />
                  <div class="xiajia" v-if="shop_infor.is_open != 1">
                    {{ $t('mch.closed') }}
                  </div>
                </div>

                <div>
                  <p>
                    {{ shop_infor.shop_name }}
                    <span @click="lqClick" v-if="
                        shop_infor.is_coupons &&
                        pluginStatus.couponPlugin == true &&
                        shop_infor.isOpenCoupon == true &&
                        pluginStatus.mchCouponPlugin == true
                      ">{{ $t('mch.coupons') }}</span>
                  </p>

                  <div>
                    <span class="red">{{ shop_infor.quantity_on_sale }}</span>&nbsp;{{ $t('mch.long[0]') }}
                    <span style="margin: 0 5px; color: #b8b8b8">|</span>
                    {{ $t('mch.sold') }}&nbsp;<span class="red">{{
                      shop_infor.quantity_sold
                    }}</span>&nbsp;{{ $t('mch.piece') }}
                  </div>
                </div>
              </div>

              <div class="mchTop_right_bottom" style="flex-direction: column; align-items: flex-end">
                <el-button @click="collectionClick" v-if="shop_infor.collection_status != 1" type="danger" round>
                  <img src="~/static/images/mch_sc.png" alt="" />
                  {{ $t('mch.collection[0]') }}
                </el-button>

                <el-button @click="collectionClick" class="collection_btn" v-else type="danger" round>
                  <span class="text" style="margin-left: 0">{{
                    $t('mch.collection[1]')
                  }}</span>
                  <span class="ishover">{{ $t('mch.collection[2]') }}</span>
                </el-button>

                <span style="color: #999999; margin-top: 8px">{{ $t('mch.long[1]') }}&nbsp;{{
                    shop_infor.collection_num
                  }}&nbsp;{{ $t('mch.collection[3]') }}{{ $t('mch.mch') }}</span>
              </div>
            </div>
            <div class="mchTop_right_context">
              {{ shop_infor.shop_information }}
            </div>

            <div class="shop_item_bottom">
              <div>
                <img src="~static/images/address_icon.png" />
                <span>{{ shop_address }}</span>
              </div>
              <a @click="View_shop">{{ $t('mch.long[2]') }}
                <img src="~static/images/arrow_icon.png" /></a>
            </div>
          </div>
        </div>
        <div class="mchTop" v-else>
          <div class="nonavtitle" style="width: 300px; height: 242px"></div>

          <div class="mchTop_right">
            <div class="mchTop_right_top">
              <div class="nonavtitle" style="width: 68px; height: 68px; margin-right: 12px"></div>

              <div>
                <p class="nonavtitle"></p>

                <div>
                  <span class="nonavtitle" style="width: 200px"></span>
                </div>
              </div>
            </div>

            <div class="mchTop_right_context">
              <p class="nonavtitle" style="display: block; height: 16px"></p>
              <p class="nonavtitle" style="display: block; height: 16px; margin-top: 4px"></p>
              <p class="nonavtitle" style="height: 16px; width: 300px; margin-top: 4px"></p>
            </div>

            <div class="mchTop_right_bottom">
              <el-button class="nonavtitle" type="danger" round style="border: 0"></el-button>

              <span class="nonavtitle" style="width: 100px"></span>
            </div>
          </div>
        </div>
        <div class="djtj" v-if="!loadFlag">
          <p v-if="recommend_list.length >0">{{ $t('mch.recommend') }}</p>

          <ul v-if="recommend_list.length >0">
            <li v-for="(item, index) of recommend_list" :key="index" @click="toUrl('/homedetail/homedetail',item)">
              <!-- <div class="proDown" v-if="item.status == 3" style="top: 40px">
                {{ $t('mch.shelf') }}
              </div> -->
              <!-- <img :src="item.imgurl" alt=""/> -->
              <div class="relative">
                <img :src="item.imgurl" alt="" @error="handleErrorImg" />
                <div class="proDown proDown_one" v-if="item.recycle == 1">
                  <!-- 已过期 -->
                  {{ $t('shoppingCart.ygq') }}
                </div>
                <div class="proDown proDown_one" v-if="item.status == 3 && item.recycle != 1">
                  <!-- 已下架 -->
                  {{ $t('shoppingCart.shelf') }}
                </div>
                <div class="proDown proDown_one" v-if="item.stockNum <= 0 && item.recycle != 1 && item.status != 3">
                  <!-- 已过期 -->
                  {{ $t('shoppingCart.ysq') }}
                </div>
              </div>
              <p>{{ item.product_title }}</p>
              <div class="div_wn">
                <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
                <div class="to-cart" @click.stop="addPro(item.id)">
                  <img :src="to_cart" alt="" />
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div class="djtj" v-else>
          <p>{{ $t('mch.recommend') }}</p>

          <ul>
            <li class="relative" v-for="(item, index) of 4" :key="index">
              <div class="nonavtitle" style="width: 288px; height: 288px"></div>
              <p class="nonavtitle" style="display: block"></p>
              <div class="nonavtitle" style="
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 100px;
                "></div>
            </li>
          </ul>
        </div>

        <!-- screen start -->
        <div class="screen" v-if="!loadFlag">
          <div class="screen-head" style="height: 50px; box-sizing: border-box">
            <p style="font-size: 16px">{{ $t('mch.All_products') }}</p>
          </div>

          <!-- screen-head start -->
          <div v-if="
              checkBrandText.length > 0 || checkClassText.length > 0 || amount
            " class="screen-head" style="
              background-color: #ffffff;
              height: 54px;
              box-sizing: border-box;
              border-bottom: 1px solid #eeeeee;
            ">
            <p>{{ $t('mch.Selected_conditions') }}</p>
            <div class="screen-item">
              <el-tag @close="removeCheck(item, 1)" v-for="(item, index) of checkClassText" :key="item.cid" closable type="info" color="#fff" effect="plain">{{ item.pname }}</el-tag>
              <template v-for="(item, index) of amount">
                <el-tag v-if="index == 0" :key="amount" @close="removeCheck(item, 1, true)" closable type="info" color="#fff" effect="plain">{{ amount }}</el-tag>
              </template>
            </div>
            <p class="screen-clear" @click="clearCheck">
              {{ $t('mch.empty') }}
            </p>
          </div>
          <!-- screen-head end -->

          <!-- fenlei start -->
          <div class="pingpai" v-if="class_list.length > 0">
            <p class="pingpai_left">{{ $t('mch.class') }}:</p>
            <ul class="list_ul" v-if="!isMore[1]">
              <template v-if="!isChecked[1]">
                <li :class="{ active: class_id == item.cid }" v-for="(item, index) of class_list.slice(0,6)" :key="item.cid" @click="class_id = item.cid">
                  {{ item.pname }}
                </li>
              </template>
              <el-checkbox-group v-else v-model="checkClass" style="display: flex; flex-wrap: wrap; width: 100%">
                <li v-for="(item, index) of class_list.slice(0,6)" :key="item.cid">
                  <el-checkbox :label="item.cid.toString()">{{ item.pname }}</el-checkbox>
                </li>
              </el-checkbox-group>
            </ul>
            <div class="moreBox" v-else>
              <!-- <ul>
                        <li :class="{active: classS=='所有分类'}">所有分类</li>
                        <li :class="{active: classS==item}" v-for="item,index of letterList" :key="item" @click="classS = item">{{item}}</li>
                    </ul> -->

              <div class="moreBox_bottom" style="margin-top: 0">
                <ul class="list_ul">
                  <template v-if="!isChecked[1]">
                    <li :class="{ active: class_id == item.cid }" v-for="(item, index) of class_list" :key="item.cid" @click="class_id = item.cid">
                      {{ item.pname }}
                    </li>
                  </template>

                  <el-checkbox-group v-else v-model="checkClass" style="display: flex; flex-wrap: wrap; width: 100%">
                    <li v-for="(item, index) of class_list" :key="item.cid">
                      <el-checkbox :label="item.cid.toString()">{{
                        item.pname
                      }}</el-checkbox>
                    </li>
                  </el-checkbox-group>
                </ul>
              </div>
            </div>
            <div class="xuanxiang">
              <template v-if="class_list.length > 6">
                <span class="el-dropdown-link" v-if="!isMore[1]" @click="clickMore(1)">
                  {{ $t('mch.more')
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>

                <span class="el-dropdown-link" v-else @click="clickMore(1)">
                  {{ $t('mch.Put')
                  }}<i class="el-icon-arrow-up el-icon--right"></i>
                </span>
              </template>

              <el-button class="el-icon-plus" size="mini" @click="clickChecked(1)">
                {{ isChecked[1] ? $t('mch.Checked[0]') : $t('mch.Checked[1]') }}
              </el-button>
            </div>
          </div>
          <!-- fenlei end -->

          <!-- jiage start -->
          <div class="pingpai" style="
              padding: 12px 20px;
              display: flex;
              align-items: center;
              border-bottom: 0;
            ">
            <p class="pingpai_left">{{ $t('mch.price') }}:</p>
            <ul class="list_ul">
              <li :class="{ active: amount == item }" @click="checkPrice(item)" v-for="(item, index) of priceList" :key="index">
                {{$LaiKeCommObject.show_symbol}}{{ item }}
              </li>
            </ul>
            <div class="xuanxiang_jiage">
              {{$LaiKeCommObject.show_symbol}}
              <el-input v-model="min_price" class="myinput"> </el-input>
              -
              <el-input v-model="max_price" class="myinput"> </el-input>
              <el-button type="mini" class="mybutton" @click="priceOk">
                {{ $t('common_button[2]') }}
              </el-button>
            </div>
          </div>
          <!-- jiage end -->
        </div>

        <div class="screen" v-else>
          <div class="screen-head" style="height: 50px; box-sizing: border-box">
            <p style="font-size: 16px">{{ $t('mch.All_products') }}</p>
          </div>

          <!-- fenlei start -->
          <div class="pingpai">
            <p class="pingpai_left">{{ $t('mch.class') }}:</p>
            <ul class="list_ul">
              <li class="nonavtitle"></li>
            </ul>
            <div class="xuanxiang">
              <span class="el-dropdown-link nonavtitle"></span>

              <el-button class="nonavtitle" size="mini" style="margin-left: 10px"></el-button>
            </div>
          </div>
          <!-- fenlei end -->

          <!-- jiage start -->
          <div class="pingpai" style="padding: 12px 20px; display: flex; align-items: center">
            <p class="pingpai_left">{{ $t('mch.price') }}:</p>
            <ul class="list_ul">
              <li :class="{ active: amount == item }" @click="checkPrice(item)" v-for="(item, index) of priceList" :key="index">
                {{$LaiKeCommObject.show_symbol}}{{ item }}
              </li>
            </ul>
            <div class="xuanxiang_jiage">
              {{$LaiKeCommObject.show_symbol}}
              <el-input v-model="min_price" class="myinput"> </el-input>
              -
              <el-input v-model="max_price" class="myinput"> </el-input>
              <el-button type="mini" class="mybutton" @click="priceOk">
                {{ $t('common_button[2]') }}
              </el-button>
            </div>
          </div>
          <!-- jiage end -->
        </div>
        <!-- screen end -->

        <!-- default start-->
        <div class="default">
          <div class="default-content">
            <p :class="{ active: sort_type == '' }" @click="sort_type = ''">
              {{ $t('mch.mr') }}
            </p>
            <p :class="{ active: sort_type == 'price' }" class="priceSort" @click="sortClick('price')">
              {{ $t('mch.price') }}
              <i :class="{ active: sort == '0' }" class="el-icon-caret-top"></i>
              <i :class="{ active: sort == '1' }" class="el-icon-caret-bottom"></i>
            </p>
            <p :class="{ active: sort_type == 'volume' }" @click="sortClick('volume')">
              {{ $t('mch.sales_volume') }}
            </p>

            <div class="pageBox" v-if="total > 0">
              <img :class="{ disabled: page == 1 }" @click="pageChange(0)" src="~static/images/jianrou_l.png" alt="" />
              <div>
                <span>{{ page }}</span>
                /{{ pageAll }}
              </div>
              <img :class="{ disabled: page == pageAll }" @click="pageChange(1)" src="~/static/images/jiantou_r.png" alt="" />
            </div>
          </div>
        </div>
        <!-- default end -->

        <!-- main start -->
        <div class="my-main">
          <ul v-if="!loadFlag">
            <li class="relative" v-for="(item, index) of proList" :key="index" @click="toUrl('/homedetail/homedetail',item)">
              <div class="relative">
                <img :src="item.imgurl" alt="" @error="handleErrorImg" />
                <div class="proDown proDown_one" v-if="item.recycle == 1">
                  <!-- 已过期 -->
                  {{ $t('shoppingCart.ygq') }}
                </div>
                <div class="proDown proDown_one" v-if="item.status == 3 && item.recycle != 1">
                  <!-- 已下架 -->
                  {{ $t('shoppingCart.shelf') }}
                </div>
                <div class="proDown proDown_one" v-if="item.stockNum <= 0 && item.recycle != 1 && item.status != 3">
                  <!-- 已过期 -->
                  {{ $t('shoppingCart.ysq') }}
                </div>
              </div>
              <p>{{ item.product_title }}</p>
              <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
            </li>
            <li class="noPro" v-if="proList.length == 0">
              <img src="~/static/images/noPro.png" alt="" />
              <p>{{ $t('homList.noPros[0]') }}</p>
              <p>{{ $t('homList.noPros[1]') }}</p>
            </li>
          </ul>
          <ul v-else>
            <li>
              <div class="nonavtitle" style="width: 286px; height: 286px"></div>
              <p class="nonavtitle" style="display: block"></p>
              <span class="nonavtitle" style="
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 100px;
                "></span>
            </li>
          </ul>
        </div>
        <!-- main end -->

        <div v-if="total > 0" class="paginationBox" style="padding-bottom: 68px; justify-content: center">
          <el-pagination :page-size="12" :current-page.sync="page" @current-change="currentChange" background layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 添加商品 -->
    <div class="mask" v-if="addProFlag">
      <div class="attrMask">
        <div class="attrMask_title">
          <div>{{ $t('mch.add_shop') }}</div>
          <i class="el-icon-close" @click="addProFlag = false"></i>
        </div>

        <div class="attrMask_pro">
          <img :src="imgurl" alt="" @error="handleErrorImg" />
          <div>
            <p>{{ addProName }}</p>
            <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(price) }}</span>
          </div>
        </div>
        <!-- <template v-if="!sku_list.result"> -->
        <template v-if="!sku_list.result['undefined']">
          <div class="attrMask_attr" v-for="(item, key) in sku_list.result" :key="key">
            <span>{{ key }}</span>
            <div class="attrMask_attr_item">
              <el-row>
                <el-button v-for="(value, i) in item" :key="i" :class="{ active: value.active }" size="small" plain :disabled="value.disabled" @click="handleActive(key, value)">{{ value.name }}</el-button>
              </el-row>
            </div>
          </div>
        </template>

        <div class="attrMask_attr">
          <span>{{ $t('mch.num') }}</span>
          <el-input-number size="small" v-model="goods_num" class="number" :min="1" :max="count">
          </el-input-number>
        </div>

        <div class="attrMask_btn">
          <el-button type="danger" @click="saveAdd">{{
            $t('common_button[2]')
          }}</el-button>
        </div>
      </div>
    </div>

    <!-- 领取优惠券弹窗 -->
    <div class="mask" v-if="lqFlag">
      <div class="coupon_mask">
        <div class="coupon_mask_title">
          {{ $t('mch.Collect_coupons') }}
          <i class="el-icon-close" @click="lqFlag = false"></i>
        </div>
        <ul class="coupon_mask_content">
          <li v-for="(item, index) of coupon_list" :key="index">
            <div class="coupon_mask_content_data">
              <div class="coupon_mask_top">
                <template v-if="item.activity_type == 1">
                  <span class="price">{{ $t('mycoupon.Tips[0]') }}</span>
                </template>
                <template v-if="item.activity_type == 2">
                  {{$LaiKeCommObject.show_symbol}}<span class="price">{{ $LaiKeCommObject.formatPrice(item.money) }}</span>
                </template>
                <template v-else-if="item.activity_type == 3">
                  <span class="price">{{ Number(item.discount) }}</span>{{ $t('mch.fracture') }}
                </template>
                <span class="maxprice">{{ item.limit }}</span>
              </div>
              <p>{{ item.coupon_name }}</p>
              <span>{{ item.expirationDate }}</span>
            </div>
            <div v-if="item.point" @click="pointBtn(item)" :style="{
                cursor:
                  item.point != '立即领取' && item.point != '立即使用'
                    ? 'default'
                    : ''
              }" class="coupon_mask_btn">
              {{ item.point }}
            </div>

            <img v-if="item.point == '立即使用'" class="lq_ylq" src="~/static/images/lq_ylq.png" alt="" />
          </li>
        </ul>
      </div>
    </div>
    <el-dialog :title="$t('mch.long[2]')" class="modal_dialog" :visible.sync="dialogVisible" width="35%">
      <div class="modal" v-for="(item, index) in shop_list">
        <p class="modal_mch_wzConf modal_title">
          {{ $t('mch.long[6]') }}{{ item.name }}
        </p>
        <p class="modal_mch_wzConf">
          {{ $t('mch.long[4]') }}{{ item.business_hours }}
        </p>
        <p class="modal_mch_wzConf">{{ $t('mch.long[5]') }}{{ item.mobile }}</p>
        <p class="modal_mch_wzConf">
          {{ $t('mch.long[7]') }}{{ item.sheng }} {{ item.shi }}
          {{ item.xian }} {{ item.address }}
        </p>
      </div>

      <div class="no_shop" v-if="shop_list.length == 0">
        <img :src="no_storeInfo" alt="" class="no_shopImg" />
        {{ $t('mch.Tips[6]') }}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ErrorImg from '@/static/images/default_picture.png'
export default {
  layout: 'homeLayout',
  async asyncData({ app, query, $Api }) {
    let pc_user = app.$cookies.get('pc_user')
    let shop_id = query.id
    var data = {
      api: 'mch.mall.Mch.storeHomepage',

      shop_id: shop_id, // 店铺ID
      page: 1, //  加载次数
      pageSize: 12
    }
    let res = await $Api.doRequest(data)
    console.log('res', res)
    return {
      pc_user,
      total: res.data.total,
      brand_list: res.data.brand_list,
      class_list: res.data.class_list,
      proList: res.data.list,
      bannerList: res.data.banner,
      recommend_list: res.data.recommend_list,
      shop_address: res.data.mch_address,
      shop_infor: res.data,
      loadFlag: false
    }
  },
  data() {
    return {
      shop_id: '',
      loadFlag: true,
      isMore: [false, false], //品牌和分离是否点击了更多
      isMultiSelect: [false, false], //品牌和分离是否多选
      min_price: '', //搜索的最小价格
      max_price: '', //搜索的最大价格

      to_cart: require('/static/images/cart1.png'),

      no_storeInfo: require('/static/images/no-shop.png'),

      isChecked: [false, false],
      checkBrand: [],
      checkClass: [],
      checkBrandText: [],
      checkClassText: [],
      letterList: [],
      brandS: '所有品牌',
      classS: '所有分类',

      total: 0, //商品总数
      brand_list: [],
      class_list: [],
      proList: [],

      pname: '', //从哪个分类进来的

      searchName: '',
      cid: '', //从分类进本页面时，传的分类ID
      class_id: '', //选择的分类ID(71,74)
      brand_id: '', // 选择的品牌ID(87,136)
      amount: '', // 金额(1500- )
      sort_type: '', //  排序类型(price 或 volume)
      sort: '', //  排序(asc 或 desc)
      page: 1, //  加载次数

      recommend_list: [],
      shop_infor: {},

      attrMaskFlag: false,
      attrMaskPro: {},
      goods_num: 1, //弹窗商品数量
      attrList: [],
      skuBeanList: [],
      haveSkuBean: '',
      count: 1,
      addProFlag: false,
      addProName: '',
      pro_id: '',

      highKeys: {},
      skuName: 'SkuID',
      skuName1: 'Price',
      skuName2: 'Pic',
      skuName3: 'Stock',
      spliter: ',',
      sku_list: {},
      result: {},

      lqFlag: false,
      coupon_list: [],

      shop_address: '',
      dialogVisible: false,
      shop_list: [],
      bannerList: [],
      pluginStatus: {}
    }
  },
  computed: {
    pageAll() {
      return Math.ceil(this.total / 12)
    },
    priceList() {
      let fmt = this.$LaiKeCommObject.formatPrice.bind(this.$LaiKeCommObject);
      return [
        '0-' + fmt(499),
        fmt(500) + '-' + fmt(1000),
        fmt(1000) + '-' + fmt(1500),
        fmt(1500) + '-' + this.$t('ys')
      ]
    }
  },
  watch: {
    sort_type(val, old) {
      if (val != old && val != 'price') {
        this.sort = ''
        this.getApi()
      }
    },
    page(val) {
      this.getApi()
    },
    amount(val) {
      this.getApi()
    },
    checkBrand(val, old) {
      if (val[0] == '' && val.length == 1) {
        this.checkBrand = []
        return
      }

      if (val) {
        this.brand_id = val.join(',')
      }
    },
    checkClass(val, old) {
      if (val[0] == '' && val.length == 1) {
        this.checkClass = []
        return
      }

      if (val) {
        this.class_id = val.join(',')
      }
    },
    class_id(val, old) {
      // 判断是否重复调用
      if (val == old) {
        return
      }
      val = val + ''
      var checkArr = val.split(',')
      var checkClassText = []

      this.class_list.filter(items => {
        var flag = checkArr.some(item => item == items.cid)
        if (flag) {
          checkClassText.push(items)
        }
      })

      this.checkClassText = checkClassText

      if (checkArr.length <= 1) {
        this.checkClass = checkArr
      }
      this.getApi()
    },
    brand_id(val, old) {
      // 判断是否重复调用
      if (val == old) {
        return
      }

      var checkArr = val.split(',')

      var checkBrandText = []

      this.brand_list.filter(items => {
        var flag = checkArr.some(item => item == items.brand_id)
        if (flag) {
          checkBrandText.push(items)
        }
      })

      this.checkBrandText = checkBrandText

      if (checkArr.length <= 1) {
        this.checkBrand = checkArr
      }

      this.getApi()
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.shop_id = this.$route.query.id
    }
    for (var i = 0; i < 26; i++) {
      this.letterList.push(String.fromCharCode(65 + i))
    }
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    this.getApi()
  },
  methods: {
    handleErrorImg(e) {
      e.target.src = ErrorImg
    },
    View_shop() {
      let data = {
        api: 'mch.mall.Mch.seeMyStore',
        shop_id: this.shop_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.shop_list = res.data.list
            this.dialogVisible = true
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    pointBtn(item) {
      if (item.point == '立即领取') {
        var data = {
          api: 'plugin.coupon.MallCoupon.receive',

          id: item.id // 活动id
        }

        this.$Api
          .doRequest(data)
          .then(res => {
            console.log('res', res)
            if (res.data.code == '200' || res.code == '200') {
              this.$message.success(this.$t('mch.Tips[1]'))
              this.lqClick()
            }
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      } else if (item.point == '立即使用') {
        this.lqFlag = false
      }
    },
    lqClick() {
      let data = {
        api: 'plugin.coupon.MallCoupon.mchCoupon',

        mchId: this.shop_id // 店铺ID
      }

      this.$Api.doRequest(data)
        .then(res => {
          if (res.data.list && res.data.list.length > 0) {
            res.data.list.filter(item => {
              if (item.point == '可用商品') {
                item.point = '立即使用'
              }
            })
          }
          this.coupon_list = res.data.list
          this.lqFlag = true
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
           ——————sku核心算法 开始——————
       */
    powerset(arr) {
      let ps = [[]]
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0, len = ps.length; j < len; j++) {
          ps.push(ps[j].concat(arr[i]))
        }
      }

      return ps
    },

    /**
     * 初始化数据
     * @return
     */
    initData() {
      this.result = {}
      this.keys = this.getAllKeys() //arrKeys["颜色", "尺码", "型号"]

      for (let i = 0; i < this.keys.length; i++) {
        this.highKeys[this.keys[i]] = false //所有的都为false
      }
      this.sku_list = this.combineAttr(this.skuBeanList, this.keys)
      this.buildResult(this.sku_list.items)
      this.updateStatus(this.getSelectedItem(), true)

      // 初始筛选出库存为0的属性
      let filterObj = {}
      for (let i in this.result) {
        if (!i.includes(',') && this.result[i].skus.Stock == 0) {
          filterObj[i] = this.result[i]
        }
      }

      for (let i in this.sku_list.result) {
        for (let k in this.sku_list.result[i]) {
          for (let j in filterObj) {
            if (k == j) {
              this.sku_list.result[i][k].disabled = true
            }
          }
        }
      }
      // 筛选结束

      this.showResult()
    },

    /**
     * 正常属性点击
     */
    handleNormalClick(key, value) {
      let list = JSON.parse(JSON.stringify(this.sku_list))

      for (let i in list.result[key]) {
        if (i != value.name) {
          list.result[key][i].active = false
        } else {
          list.result[key][i].active = true
        }
      }

      this.sku_list = list
    },

    /**
     * 无效属性点击
     */
    handleDisableClick(key, value) {
      this.sku_list.result[key][value.name]['disabled'] = false
      // 清空高亮行的已选属性状态（因为更新的时候默认会跳过已选状态）
      for (let i in this.sku_list.result) {
        if (i != key) {
          for (let x in this.sku_list.result[i]) {
            this.sku_list.result[i][x].active = false
          }
        }
      }

      this.updateStatus(this.getSelectedItem())
    },

    /**
     * 高亮行
     */
    highAttributes: function () {
      for (let key in this.sku_list.result) {
        this.highKeys[key] = true
        for (let attr in this.sku_list.result[key]) {
          if (this.sku_list.result[key][attr].active === true) {
            this.highKeys[key] = false
            break
          }
        }
      }
    },

    /**
     * 点击事件处理
     * @param  key   点击的行
     * @param  value 点击的按钮的数据
     */
    handleActive: function (key, value) {
      if (value.disabled === true) {
        uni.showToast({
          title: this.$t('mch.Tips[2]'),
          icon: 'none'
        })
        return
      }

      if (value.active == true) {
        return false
      }

      this.handleNormalClick(key, value)
      if (value.disabled === true) {
        this.handleDisableClick(key, value)
      }

      this.updateStatus(this.getSelectedItem())
      this.highAttributes()
      this.showResult()
    },

    /**
     * 计算属性
     * @param  {[type]} data [description]
     * @param  {[type]} keys [description]
     * @return {[type]}      [description]
     */
    combineAttr(data, keys) {
      let allKeys = []
      let result = {}

      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let values = []

        for (let j = 0; j < keys.length; j++) {
          let key = keys[j]
          if (!result[key]) {
            result[key] = {}
          }

          if (!result[key][item[key]]) {
            result[key][item[key]] = {
              name: item[key],
              active: false,
              disabled: item['Stock'] > 0 ? false : true
            }
          }

          values.push(item[key])
        }

        allKeys.push({
          path: values.join(this.spliter),
          sku: item['SkuID'],
          price: item['Price'],
          Pic: item['Pic'],
          Stock: item['Stock']
        })
      }

      return {
        result: result,
        items: allKeys
      }
    },

    isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str)
          return true
        } catch (e) {
          console.log('error：' + str + '!!!' + e)
          return false
        }
      }
    },

    /**
     * 获取所有属性
     * @return {[type]} [description]
     */
    getAllKeys() {
      let arrKeys = []
      for (let attribute in this.skuBeanList[0]) {
        if (!this.skuBeanList[0].hasOwnProperty(attribute)) {
          continue
        }

        if (
          attribute !== this.skuName &&
          attribute !== this.skuName1 &&
          attribute !== this.skuName2 &&
          attribute !== this.skuName3
        ) {
          arrKeys.push(attribute)
        }
      }

      if (arrKeys.length == 0) {
        arrKeys = ['undefined']
        this.skuBeanList[0]['undefined'] = 'undefined'
      }

      return arrKeys
    },

    getAttruites(arr) {
      let result = []
      for (let i = 0; i < arr.length; i++) {
        result.push(arr[i].path)
      }

      return result
    },

    /**
     * 生成所有子集是否可选、库存状态 map
     */
    buildResult(items) {
      let allKeys = this.getAttruites(items)

      let attr = {}
      //价格 , 库存, 图片 赋值
      for (let i = 0; i < allKeys.length; i++) {
        let curr = allKeys[i]
        let sku = items[i].sku
        let Pic = items[i].Pic
        let price = items[i].price
        let Stock = items[i].Stock
        let values = curr.split(this.spliter)
        let allSets = this.powerset(values)

        // 每个组合的子集
        for (let j = 0; j < allSets.length; j++) {
          let set = allSets[j]
          let key = set.join(this.spliter)
          if (key && !this.result[key]) {
            this.result[key] = {
              skus: {
                sku,
                Pic,
                price,
                Stock
              }
            }

            if (
              (!key.includes(',') && !attr[key]) ||
              (key.includes(',') &&
                key.split(',').length < allKeys[i].split(',').length)
            ) {
              attr[key] = {
                skus: {
                  sku,
                  Pic,
                  price,
                  Stock
                }
              }
            }
          }
        }
      }

      for (let i in attr) {
        attr[i].skus.Stock = 0
        for (let k in this.result) {
          if (
            i != k &&
            k.split(',').length == allKeys[0].split(',').length &&
            k.includes(i)
          ) {
            attr[i].skus.Stock += Number(this.result[k].skus.Stock)
          } else if (k.split(',').length == allKeys[0].split(',').length) {
            let flag = []

            k.split(',').filter(item => {
              i.split(',').filter(it => {
                if (item == it) {
                  flag.push(true)
                }
              })
            })

            if (flag.length == i.split(',').length) {
              attr[i].skus.Stock += Number(this.result[k].skus.Stock)
            }
          }
        }
      }

      Object.assign(this.result, attr)
    },

    /**
     * 获取选中的信息
     * @return Array
     */
    getSelectedItem() {
      let result = []
      for (let attr in this.sku_list.result) {
        let attributeName = ''
        for (let attribute in this.sku_list.result[attr]) {
          if (this.sku_list.result[attr][attribute].active === true) {
            attributeName = attribute
          }
        }

        result.push(attributeName)
      }

      return result
    },

    /**
     * 更新所有属性状态
     */
    updateStatus(selected, type) {
      for (let i = 0; i < this.keys.length; i++) {
        let key = this.keys[i],
          data = this.sku_list.result[key],
          hasActive = !!selected[i],
          copy = selected.slice()

        for (let j in data) {
          let item = data[j]['name']
          if (selected[i] == item) {
            continue
          }

          copy[i] = item
          let curr = this.trimSpliter(copy.join(this.spliter), this.spliter)

          if (type) {
            this.sku_list.result[key][j]['disabled'] = this.result[curr]
              ? false
              : true
          } else {
            this.sku_list.result[key][j]['disabled'] =
              this.result[curr].skus.Stock > 0 ? false : true
          }
        }
      }
    },

    trimSpliter(str, spliter) {
      let reLeft = new RegExp('^' + spliter + '+', 'g')
      let reRight = new RegExp(spliter + '+$', 'g')
      let reSpliter = new RegExp(spliter + '+', 'g')
      return str
        .replace(reLeft, '')
        .replace(reRight, '')
        .replace(reSpliter, spliter)
    },

    /**
     * 初始化选中
     * @param  mixed|Int|String SkuID 需要选中的SkuID
     * @return {[type]}       [description]
     */
    initSeleted(a) {
      for (let i in this.skuBeanList) {
        if (this.skuBeanList[i][this.skuName] == a) {
          for (let x in this.skuBeanList[i]) {
            if (
              x !== this.skuName &&
              x !== this.skuName1 &&
              x !== this.skuName2 &&
              x !== this.skuName3
            ) {
              this.sku_list.result[x][this.skuBeanList[i][x]].active = true
            }
          }
          break
        }
      }
    },

    /**
     * 显示选中的信息
     * @return
     */
    showResult() {
      let result = this.getSelectedItem()
      let s = []
      for (let i = 0; i < result.length; i++) {
        let item = result[i]
        if (!!item) {
          s.push(item)
        }
      }

      if (s.length > 0) {
        this.count = this.result[s.join(this.spliter)].skus.Stock
      }

      if (s.length == this.keys.length) {
        let curr = this.result[s.join(this.spliter)]
        if (curr) {
          this.SkuID = curr.skus.sku
          this.imgurl = curr.skus.Pic
          this.price = curr.skus.price
          this.count = Number(curr.skus.Stock)

          if (Number(this.goods_num) > Number(this.count)) {
            this.goods_num = Number(this.count)
          }
        }

        this.haveSkuBean = {
          name: s.join(this.spliter),
          cid: curr.skus.sku,
          skus: curr.skus
        }
      } else {
        this.haveSkuBean = ''
      }
    },
    /*
           ——————sku核心算法 结束——————
      */
    /*
        添加商品到购物车
       */
    addPro(id) {
      var data = {
        api: 'mall.Product.index',
        pro_id: id // 商品ID
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.pc_user.access_id = res.data.access_id
          this.$cookies.set('pc_user', this.pc_user)
          this.skuBeanList = res.data.attribute_list
          this.price = res.data.pro.price
          this.count = res.data.pro.num
          this.goods_num = 1
          this.imgurl = res.data.pro.photo_x
          this.addProName = res.data.pro.name

          this.haveSkuBean = ''
          this.pro_id = id

          this.addProFlag = true

          this.initData()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
        核心算法
       */
    _spec() {
      var attrListIn = this.attrList
      var skuBeanListIn = this.skuBeanList
      for (var i = 0; i < attrListIn.length; i++) {
        var attrListBig = attrListIn[i]
        //当前类别之外的选择列表
        var attrsOtherSelect = []
        for (var j = 0; j < attrListIn.length; j++) {
          var attrListSmall = attrListIn[j]
          if (attrListSmall.id != attrListBig.id) {
            for (var k = 0; k < attrListSmall.attr.length; k++) {
              var attrListSmallAttr = attrListSmall.attr[k]
              if (attrListSmallAttr.enable && attrListSmallAttr.select) {
                //可选并且已经选择的属性
                attrsOtherSelect.push(attrListSmallAttr)
              }
            }
          }
        }

        var enableIds = []
        for (var z = 0; z < skuBeanListIn.length; z++) {
          var ism = true
          var skuBean = skuBeanListIn[z]
          for (var j = 0; j < attrsOtherSelect.length; j++) {
            var enable = false
            for (var k = 0; k < skuBean.attributes.length; k++) {
              var goodAttrBean = skuBean.attributes[k]
              if (
                attrsOtherSelect[j].attributeId == goodAttrBean.attributeId &&
                attrsOtherSelect[j].id == goodAttrBean.attributeValId
              ) {
                enable = true
                break
              }
            }
            ism = enable && ism
          }

          if (ism) {
            for (var o = 0; o < skuBean.attributes.length; o++) {
              var goodAttrBean = skuBean.attributes[o]
              if (attrListBig.id == goodAttrBean.attributeId) {
                enableIds.push(goodAttrBean.attributeValId)
              }
            }
          }
        }
        for (let s = 0; s < attrListBig.attr.length; s++) {
          let attrItem = attrListBig.attr[s]
          attrItem.enable = Number(skuBeanListIn[s].count)
          // 这里需修改，如何改变enabale的真假
        }
      }
      // 重新赋值
      this.attrList = attrListIn
      this.skuBeanList = skuBeanListIn
    },
    /*
        选择属性
       */
    checkAttr(indx, index) {
      var listItem = this.attrList

      var items = listItem[indx]
      var item = items.attr[index]

      if (item.select) {
        return
      }

      if (!item.enable) {
        uni.showToast({
          title: this.$t('mch.Tips[2]'),
          icon: 'none',
          duration: 1500
        })
        return
      }
      var select = !item.select
      for (var i = 0; i < items.attr.length; i++) {
        items.attr[i].select = false
      }
      item.select = select
      // 获取点击属性列表
      var canGetInfo = []
      for (var skuIndex = 0; skuIndex < listItem.length; skuIndex++) {
        for (
          var skuIndexIn = 0;
          skuIndexIn < listItem[skuIndex].attr.length;
          skuIndexIn++
        ) {
          if (
            listItem[skuIndex].attr[skuIndexIn].enable &&
            listItem[skuIndex].attr[skuIndexIn].select
          ) {
            canGetInfo.push(listItem[skuIndex].attr[skuIndexIn])
          }
        }
      }

      console.log(canGetInfo, '目前点击的属性')

      let selectedlist = Array.from(canGetInfo, item => item.attributeValue)
      this.selectedlist = selectedlist.join(' ')

      var canGetInfoLog = ''

      var skuBeanList = this.skuBeanList

      var haveSkuBean = []
      // 对应库存清单扫描
      for (
        var skuBeanIndex = 0;
        skuBeanIndex < skuBeanList.length;
        skuBeanIndex++
      ) {
        var iListCount = 0
        for (
          var skuBeanIndexIn = 0;
          skuBeanIndexIn < skuBeanList[skuBeanIndex].attributes.length;
          skuBeanIndexIn++
        ) {
          if (
            canGetInfo.length == skuBeanList[skuBeanIndex].attributes.length
          ) {
            if (
              skuBeanList[skuBeanIndex].attributes[skuBeanIndexIn]
                .attributeValId == canGetInfo[skuBeanIndexIn].id
            ) {
              iListCount++
            }
          } else {
            canGetInfoLog = this.$t('mch.Tips[3]') + ' '
          }
        }
        if (iListCount == skuBeanList[skuBeanIndex].attributes.length) {
          haveSkuBean.push(skuBeanList[skuBeanIndex])
        }
      }

      /*console.log(haveSkuBean, "存在于库存清单");*/

      for (var iox = 0; iox < canGetInfo.length; iox++) {
        canGetInfoLog += canGetInfo[iox].attributeValue + ' '
      }
      if (haveSkuBean.length != 0) {
        this.count = Number(haveSkuBean[0].count)
        if (this.num == 0) {
          uni.showToast({
            title: this.$t('mch.Tips[2]'),
            icon: 'none',
            duration: 1500
          })
        }
        this.price = haveSkuBean[0].price
        if (this.imgurl != haveSkuBean[0].imgurl) {
          this.loadImg = true
          this.imgurl = haveSkuBean[0].imgurl
        }

        this.haveSkuBean = haveSkuBean[0]
      } else {
        this.count = Number(this.attrMaskPro.stock)
        this.price = this.ys_price
        this.haveSkuBean = ''
      }

      // 重新赋值
      this.attrList = listItem
      /*infoText: canGetInfoLog,*/

      // 重新sku运算
      this._spec()
    },
    /*
        添加到购物车
       */
    saveAdd() {
      if (!this.haveSkuBean) {
        this.$message.error(this.$t('mch.Tips[4]'))
        return
      }

      var data = {
        api: 'mall.Product.addCart',

        pro_id: this.pro_id, // 商品ID
        num: this.goods_num, // 数量
        attribute_id: this.haveSkuBean.cid // 属性ID
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(this.$t('mch.Tips[5]'))

          this.addProFlag = false
          this.getApi()
          this.$root.$emit('shoppingCart')
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    collectionClick() {
      let data = {
        api: 'mch.mall.Mch.collectionShop',

        shopId: this.shop_id // 店铺ID
      }

      this.$Api.doRequest(data)
        .then(res => {
          console.log('res', res)
          if (res.code == '200') {
            if (this.shop_infor.collection_status == 0) {
              this.$message.success(this.$t('mch.sccg'))
            } else {
              this.$message.success(this.$t('mch.qxsc'))
            }
            this.getApi()
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    toUrl(url, item) {
      this.$router.push({
        path: url,
        query: { id: item.id, ClassName: item.product_title }
      })
    },
    sortClick(type) {
      this.sort_type = type

      if (type == 'price') {
        // 升序：asc 或 降序：desc
        this.sort = this.sort == '0' ? '1' : '0'

        this.getApi()
      }
    },
    pageChange(type) {
      if (type == 0 && this.page > 1) {
        this.page = Number(this.page) - 1
      } else if (type == 1 && this.page < this.pageAll) {
        this.page = Number(this.page) + 1
      }
    },
    currentChange(e) {
      this.page = e
    },
    clearCheck() {
      this.min_price = ''
      this.max_price = ''
      this.amount = ''
      this.checkBrandText = []
      this.checkBrand = []
      this.checkClassText = []
      this.checkClass = []
    },
    priceOk() {
      this.amount = (this.min_price ? this.min_price : 0) + '-' + this.max_price
    },
    checkPrice(item) {
      this.amount = item
    },
    // 删除筛选条件
    removeCheck(item, type, flag) {
      if (flag) {
        this.amount = ''
        return
      }

      if (type == 0) {
        var index = this.checkBrandText.findIndex(items => {
          return items.brand_id == item.brand_id
        })

        this.checkBrandText.splice(index, 1)

        var i = this.checkBrand.findIndex(items => {
          return items == item.brand_id
        })

        this.checkBrand.splice(i, 1)
      } else if (type == 1) {
        var index = this.checkClassText.findIndex(items => {
          return items.cid == item.cid
        })

        this.checkClassText.splice(index, 1)

        var i = this.checkClass.findIndex(items => {
          return items == item.cid
        })

        this.checkClass.splice(i, 1)
      }
    },
    // 点击查看更多
    clickMore(index) {
      var flag = !this.isMore[index]
      this.isMore.splice(index, 1, flag)
    },
    // 点击多选
    clickChecked(index) {
      var flag = !this.isChecked[index]
      this.isChecked.splice(index, 1, flag)
    },
    // 请求
    getApi() {
      var amount = this.amount != `1500${this.$t('ys')}` ? this.amount : '1500-'

      var data = {
        api: 'mch.mall.Mch.storeHomepage',

        shop_id: this.shop_id, // 店铺ID
        cid: this.cid, // 分类ID
        keyword: this.searchName, // 关键字
        class_id: this.class_id, // 选择的分类ID(71,74)
        amount: amount, // 金额(1500- )
        sortType: this.sort_type, //  排序类型(price 或 volume)
        // sort:1, //  排序(asc 或 desc)
        sort: this.sort, //  排序(asc 或 desc)
        page: this.page, //  加载次数
        pageSize: 12
      }

      this.$Api.doRequest(data).then(res => {
        this.loadFlag = false
        this.total = res.data.total
        this.brand_list = res.data.brand_list
        this.class_list = res.data.class_list
        this.proList = res.data.list
        this.bannerList = res.data.banner

        this.recommend_list = res.data.recommend_list
        this.shop_address = res.data.mch_address
        this.shop_infor = res.data
      })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/mch/mch.css';
</style>
