<template>
  <div id="app">
    <div class="w mt20">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{ $t('shoppingCart.title') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('shoppingCart.title2') }}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 无登录提示框 -->
      <div class="login-hint" v-if="login_status == '0'">
        <img :src="exclamation" alt="" />
        <span>{{ $t('shoppingCart.Tips[0]') }}</span>
        <input
          type="button"
          :value="$t('shoppingCart.login')"
          @click="toUrl('/login/login', 1)"
        />
      </div>
      <!-- 无登录提示框 end -->

      <!-- 有商品时显示 -->
      <div class="w" v-if="goods_length">
        <!-- 购物车选择头部 -->
        <div class="select-head">
          <el-row>
            <el-col :span="2" style="background-color: #f6f6f6">
              <div class="grid-content color02 checkBox">
                <el-checkbox
                  :label="$t('shoppingCart.checkbox')"
                  v-model="checkAll"
                  @change="changeAll"
                ></el-checkbox>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">{{ $t('shoppingCart.th[0]') }}</div>
            </el-col>
            <el-col :span="2">
              <div class="grid-content">{{ $t('shoppingCart.th[1]') }}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">{{ $t('shoppingCart.th[2]') }}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">{{ $t('shoppingCart.th[3]') }}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">{{ $t('shoppingCart.th[4]') }}</div>
            </el-col>
          </el-row>
        </div>
        <!-- 购物车选择头部 end -->
        <!-- 购物车主体 -->
        <div v-if="!loadFlag">
          <div v-for="(items, indexs) of cartList" :key="indexs">
            <!-- 店铺名称 -->
            <div class="store-title checkBox">
              <el-checkbox
                :label="items.mch_name"
                v-model="checkList[indexs].all"
                @change="changeStore(indexs)"
              ></el-checkbox>
              <div
                class="couponBox"
                v-if="
                  pluginStatus.couponPlugin == true &&
                  pluginStatus.mchCouponPlugin == true &&
                  items.isOpenCoupon == true &&
                  items.coupon_list.length > 0
                "
              >
                {{ $t('shoppingCart.coupons') }}
                <img src="~/static/images/coupon_down.png" alt="" />

                <div class="couponHover">
                  <div>
                    <div
                      class="couponHover_row"
                      v-for="(item, index) of items.coupon_list"
                      :key="index"
                    >
                      <div
                        class="couponHover_row_left"
                        :class="{ noLeft: item.point_type == 2 }"
                        v-if="item.activity_type == 2"
                      >
                        {{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.money) }}
                      </div>
                      <div
                        class="couponHover_row_left"
                        :class="{ noLeft: item.point_type == 2 }"
                        v-if="item.activity_type == 3"
                      >
                        {{ item.discount }}{{ $t('shoppingCart.fold') }}
                      </div>
                      <!-- 免邮券 -->
                      <div
                        class="couponHover_row_left"
                        :class="{ noLeft: item.point_type == 2 }"
                        v-if="item.activity_type == 1"
                      >
                      {{ $t('mycoupon.Tips[0]') }}
                      </div>
                      <div class="couponHover_row_center">
                        <p>{{ item.name }}</p>
                        <span>{{ item.expirationDate }}</span>
                      </div>
                      <div
                        class="couponHover_btn"
                        @click="couponClick(item)"
                        :class="{ noBtn: item.point_type == 2 }"
                      >
                        {{ item.point }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 购物车店铺商品 -->
            <div
              class="store-cart-goods"
              v-for="(item, index) of items.list"
              :key="index"
            >
              <!-- 购物车单条商品 -->
              <el-row>
                <el-col :span="1">
                  <div class="grid-content1 color02 checkBox">
                    <el-checkbox
                      label=""
                      v-model="checkList[indexs].list[index]"
                      @change="changePro(indexs)"
                    ></el-checkbox>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="grid-content1 goodDetail">
                    <img class="good-img" :src="item.imgurl" alt="" @error="handleErrorImg"/>
                    <div class="text-align-start">
                      <p>{{ item.pro_name }}</p>
                      <div
                        style="display: inline-block"
                        @click="openAttr(indexs, index, item.attribute_id)"
                      >
                        <template v-if="item.attrList.length > 0">
                          <span>
                            <span
                              v-for="attr of item.skuBeanList"
                              :key="attr.name"
                              style="margin-right: 7px"
                              >{{ attr.name }}</span
                            >
                          </span>
                          <img class="jiantou" :src="jiantou" />
                        </template>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="unit grid-content1 lh120">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content1">
                    <el-input-number
                      v-model="item.num"
                      @change="handleChange(indexs, index)"
                      size="mini"
                      :min="1"
                      :max="Number(item.stock)"
                      :label="$t('shoppingCart.add')"
                    ></el-input-number>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="amount grid-content1 lh120">
                    {{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price * item.num) }}
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content1 re">
                    <!-- 移到我的收藏 -->
                    <p class="p1" @click="openMask(indexs, index, 2)">
                      {{ $t('shoppingCart.remover') }}
                    </p>
                    <!-- 删除 -->
                    <p class="p2" @click="openMask(indexs, index, 1)">
                      {{ $t('common_button[0]') }}
                    </p>
                  </div>
                </el-col>
              </el-row>
              <!-- 购物车单条商品 end -->
            </div>
            <!-- 购物车店铺商品 end -->
          </div>
        </div>
        <div v-else>
          <div>
            <!-- 店铺名称 -->
            <div class="store-title checkBox">
              <div class="nonavtitle" label=""></div>
            </div>
            <!-- 购物车店铺商品 -->
            <div class="store-cart-goods">
              <!-- 购物车单条商品 -->
              <el-row>
                <el-col :span="1">
                  <div class="grid-content1 color02 checkBox">
                    <el-checkbox label=""></el-checkbox>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="grid-content1 goodDetail">
                    <img class="good-img nonavtitle" src="" alt="" @error="handleErrorImg"/>
                    <div class="text-align-start">
                      <p class="nonavtitle"></p>
                      <span class="nonavtitle" style="display: block"></span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="unit grid-content1 lh120 center">
                    <span class="nonavtitle" style="height: 19px"></span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content1 center">
                    <span class="nonavtitle"></span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="amount grid-content1 lh120 center">
                    <span class="nonavtitle" style="height: 19px"></span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content1 re">
                    <p class="p1 nonavtitle" style="color: transparent">
                      {{ $t('shoppingCart.remover') }}
                    </p>
                    <p class="p2 nonavtitle" style="color: transparent">
                      {{ $t('common_button[0]') }}
                    </p>
                  </div>
                </el-col>
              </el-row>
              <!-- 购物车单条商品 end -->
            </div>
            <!-- 购物车店铺商品 end -->
          </div>
        </div>
        <!-- 购物车主体 end -->
      </div>

      <!-- 无商品时显示 -->
      <div class="empty">
        <div v-if="!goods_length">
          <img class="empty-img" :src="empty_cart" alt="" />
          <p>{{ $t('shoppingCart.Tips[1]') }}~</p>
          <p>{{ $t('shoppingCart.Tips[2]') }}</p>
          <div class="empty-ipt-wrap">
            <input
              class="ipt1"
              type="button"
              :value="$t('shoppingCart.login')"
              v-if="login_status == '0'"
              @click="toUrl('/login/login', 1)"
            />
            <input
              class="ipt2"
              type="button"
              :value="$t('shoppingCart.go')"
              @click="toHome('/')"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="lose_head" v-if="loseList.length > 0">
          <div class="lose_font1">{{ $t('shoppingCart.sxsp') }}</div>
          <div class="lose_clo" @click="loseFlag = true">
            <i class="el-icon-delete"></i>
            <span class="lose_font2">{{ $t('shoppingCart.qksxsp') }}</span>
          </div>
        </div>
        <div
          class="store-cart-goods cursor"
          @click="loseChange(itn)"
          v-for="(itn, ind) of loseList"
        >
          <!-- 购物车单条商品 -->
          <el-row>
            <el-col :span="1" class="tc_box1"> </el-col>
            <el-col :span="9">
              <div class="grid-contentx goodDetail">
                <img class="good-img" :src="itn.imgurl" alt="" @error="handleErrorImg"/>
                <div class="text-align-start">
                  <p>{{ itn.pro_name }}</p>
                  <div class="bpx">
                    <span v-if="itn.recycle == 1">{{
                      $t('shoppingCart.ygq')
                    }}</span>
                    <span v-if="itn.goodsStatus == 1 && itn.recycle != 1">{{
                      $t('shoppingCart.yxj')
                    }}</span>
                    <span
                      v-if="
                        itn.goodsStatus == 0 &&
                        itn.recycle != 1 &&
                        itn.goodsStatus != 3
                      "
                      >{{ $t('shoppingCart.ysq') }}</span
                    >
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="2">
              <div class="unit grid-contentx lh120">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(itn.price) }}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-contentx lh120">
                {{ itn.num }}
              </div>
            </el-col>
            <el-col :span="4">
              <div class="amount grid-contentx lh120">
                {{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(Number(itn.price) * Number(itn.num)) }}
              </div>
            </el-col>
            <el-col :span="4" class="tc_box2"> </el-col>
          </el-row>
          <!-- 购物车单条商品 end -->
        </div>
      </div>
      <!-- 购物车结算尾部 -->
      <div
        v-if="cartList.length > 0"
        id="toPayBox"
        class="shoppingCartBottom"
        style="height: 70px"
      >
        <el-row
          style="width: 1200px; z-index: 101"
          :style="{
            position: is_position ? 'fixed' : '',
            bottom: is_position ? '0' : ''
          }"
        >
          <el-col :span="2">
            <div class="grid-content2 bg-purple text-align-center">
              <el-checkbox
                :label="$t('shoppingCart.checkbox')"
                v-model="checkAll"
                @change="changeAll"
              ></el-checkbox>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content2 bg-purple-light">
              <span style="cursor: pointer" @click="openMask(0, 0, 3)">{{
                $t('shoppingCart.long[0]')
              }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content2 bg-purple text-align-center">
              {{ $t('shoppingCart.long[1]')
              }}<span class="red">{{ checkNum }}</span
              >{{ $t('shoppingCart.piece') }}&nbsp;&nbsp;
              {{ $t('shoppingCart.long[2]')
              }}<span class="red">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(checkPrice) }}</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content2 bg-purple-light">
              <input
                class="topayBtn"
                type="button"
                :value="$t('shoppingCart.settlement')"
                @click="toPay"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 购物车结算尾部 end -->
      <div class="w">
        <div class="recommend-title">
          <p>{{ $t('shoppingCart.Recommend') }}</p>
          <div style="cursor: pointer" @click="getTuijian">
            <span>{{ $t('shoppingCart.batch') }}</span>
            <img :src="update" alt="" />
          </div>
        </div>
        <ul class="recommend-products-wrap">
          <li
            class="recommend-products"
            v-for="(item, index) of recommendList"
            :key="index"
            @click="toDetail(item.id)"
          >
            <div class="relative">
              <div class="proDown proDown_one" v-if="item.recycle == 1">
                <!-- 已过期 -->
                {{ $t('shoppingCart.ygq') }}
              </div>
              <div
                class="proDown proDown_one"
                v-if="item.status == 3 && item.recycle != 1"
              >
                <!-- 已下架 -->
                {{ $t('shoppingCart.shelf') }}
              </div>
              <div
                class="proDown proDown_one"
                v-if="
                  item.stockNum <= 0 && item.recycle != 1 && item.status != 3
                "
              >
                <!-- 已过期 -->
                {{ $t('shoppingCart.ysq') }}
              </div>
              <img class="recommend-products-img" :src="item.imgurl" alt="" @error="handleErrorImg"/>
            </div>
            <p>{{ item.product_title }}</p>
            <div>
              <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price_yh) }}</span>
              <div @click.stop="addPro(item.id)" class="to-cart">
                <img :src="to_cart" alt="" />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 无商品时显示 end -->
    </div>

    <div class="infoMask" v-if="infoFlag">
      <div>
        <i
          class="el-icon-warning-outline"
          style="
            color: #d4282d;
            font-size: 36px;
            height: 36px;
            display: flex;
            align-items: center;
          "
        ></i>

        <div class="infoText" v-if="infoFlag == 1">
          {{ $t('shoppingCart.Tips[4]') }}
        </div>
        <div class="infoText" v-else-if="infoFlag == 3">
          {{ $t('shoppingCart.Tips[4]') }}
        </div>
        <div class="infoText" v-else>
          {{ $t('shoppingCart.Tips[6]') }}
        </div>

        <div class="btnBox">
          <el-button plain @click="infoFlag = false">{{
            $t('cancel')
          }}</el-button>
          <el-button type="danger" @click="saveSC">{{
            $t('common_button[2]')
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="infoMask" v-if="loseFlag">
      <div>
        <i
          class="el-icon-warning-outline"
          style="
            color: #d4282d;
            font-size: 36px;
            height: 36px;
            display: flex;
            align-items: center;
          "
        ></i>

        <div class="infoText">
          {{ $t('shoppingCart.qdyscsxspm') }}
        </div>

        <div class="btnBox">
          <el-button plain @click="loseFlag = false">{{
            $t('cancel')
          }}</el-button>
          <el-button type="danger" @click="saveLose">{{
            $t('common_button[2]')
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="infoMask" v-if="ysxFlag">
      <div>
        <i
          class="el-icon-warning-outline"
          style="
            color: #d4282d;
            font-size: 36px;
            height: 36px;
            display: flex;
            align-items: center;
          "
        ></i>

        <div class="infoText">
          {{ $t('shoppingCart.spygq') }}
        </div>

        <div class="btnBox">
          <el-button type="danger" @click="ysxFlag = false">{{
            $t('shoppingCart.wzdl')
          }}</el-button>
        </div>
      </div>
    </div>
    <!-- 修改购物车属性 -->
    <div class="mask" v-if="attrMaskFlag">
      <div class="attrMask">
        <div class="attrMask_title">
          <div>{{ $t('shoppingCart.Tips[7]') }}</div>
          <i class="el-icon-close" @click="attrMaskFlag = false"></i>
        </div>

        <div class="attrMask_pro">
          <img :src="attrMaskPro.imgurl" alt="" />
          <div>
            <p>{{ attrMaskPro.pro_name }}</p>
            <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(attrMaskPro.price) }}</span>
          </div>
        </div>

        <div
          class="attrMask_attr"
          v-for="(item, key) in sku_list.result"
          :key="key"
        >
          <span>{{ key }}</span>
          <div class="attrMask_attr_item">
            <el-row>
              <el-button
                v-for="(value, i) in item"
                :key="i"
                :class="{ active: value.active }"
                size="small"
                plain
                :disabled="value.disabled"
                @click="handleActive(key, value)"
                >{{ value.name }}
              </el-button>
            </el-row>
          </div>
        </div>

        <div class="attrMask_btn">
          <el-button type="danger" @click="saveAttr">{{
            $t('common_button[2]')
          }}</el-button>
        </div>
      </div>
    </div>

    <!-- 添加商品 -->
    <div class="mask" v-if="addProFlag">
      <div class="attrMask">
        <div class="attrMask_title">
          <div>{{ $t('shoppingCart.add_shop') }}</div>
          <i class="el-icon-close" @click="addProFlag = false"></i>
        </div>

        <div class="attrMask_pro">
          <img :src="imgurl" alt="" />
          <div>
            <p>{{ addProName }}</p>
            <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(price) }}</span>
          </div>
        </div>
        <!-- v-if="!sku_list.result['undefined']" -->
        <template v-if="!sku_list.result['undefined']">
          <div
            class="attrMask_attr"
            v-for="(item, key) in sku_list.result"
            :key="key"
          >
            <span>{{ key }}</span>
            <div class="attrMask_attr_item">
              <el-row>
                <el-button
                  v-for="(value, i) in item"
                  :key="i"
                  :class="{ active: value.active }"
                  size="small"
                  plain
                  :disabled="value.disabled"
                  @click="handleActive(key, value)"
                  >{{ value.name }}
                </el-button>
              </el-row>
            </div>
          </div>
        </template>

        <div class="attrMask_attr">
          <span>{{ $t('shoppingCart.num') }}</span>
          <el-input-number
            size="small"
            v-model="goods_num"
            class="number"
            :min="1"
            :max="count"
          >
          </el-input-number>
        </div>

        <div class="attrMask_btn">
          <el-button type="danger" @click="saveAdd">{{
            $t('common_button[2]')
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ErrorImg from '@/static/images/default_picture.png'

export default {
  async asyncData ({ app, query, $Api }) {
    let pc_user = app.$cookies.get('pc_user')
    var data = {
      // module: 'app_pc',
      // action: 'cart',
      // m: 'index',
      api: 'mall.Cart.index',
      access_id: pc_user.access_id
    }
    let res = await $Api.doRequest(data)
    var checkList = []
    res.data.list.filter(items => {
      var checkItem = { all: false, list: [] }

      items.list.filter(item => {
        checkItem.list.push(false)
      })

      checkList.push(checkItem)
    })
    return {
      pc_user,
      login_status: res.data.login_status,
      cartList: res.data.list,
      loseList: res.data.data0,
      total: res.data.total,
      checkList: checkList,
      loadFlag: false
    }
  },
  layout: 'homeLayout',
  data () {
    return {
      login_status: '',
      loadFlag: true,
      pc_user: {},
      empty_cart: require('/static/images/empty_cart.png'),
      update: require('/static/images/update.png'),
      to_cart: require('/static/images/cart1.png'),
      exclamation: require('/static/images/exclamation.png'),
      jiantou: require('/static/images/jianX.png'),
      goods_length: true,
      num: 1,
      cartList: [], // 购物车列表数据
      checkAll: false,

      checkList: [], // {all: false, list: [false, false]}

      infoFlag: false,
      loseFlag: false,
      ysxFlag: false,
      car_id: '', //点击收藏或删除的商品购物车id

      attrMaskFlag: false,
      attrMaskPro: {},
      goods_num: 1, //弹窗商品数量
      attrList: [],
      skuBeanList: [],
      haveSkuBean: '',
      count: 1,

      recommendList: [], //为你推荐

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
      is_position: '',
      pluginStatus: {},
      meStatus: '',
      loseList: []
    }
  },
  computed: {
    checkNum () {
      let num = 0
      this.checkList.filter((items, indexs) => {
        items.list.filter((item, index) => {
          if (item) {
            num += Number(this.cartList[indexs].list[index].num)
          }
        })
      })
      return num
    },
    checkPrice () {
      let price = 0
      this.checkList.filter((items, indexs) => {
        items.list.filter((item, index) => {
          if (item) {
            price +=
              Number(this.cartList[indexs].list[index].num) *
              Number(this.cartList[indexs].list[index].price)
          }
        })
      })
      return price.toFixed(2)
    }
  },
  watch: {
    checkList: {
      handler (newVal, oldVal) {
        if (this.cartList.length > 0) {
          let flag = true
          newVal.filter(item => {
            if (!item.all) {
              flag = false
            }
          })
          this.checkAll = flag
        }
      },
      deep: true
    }
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll, true)
  },
  mounted () {
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    this.getTuijian()
    this.getApi()
    // 传递noIndex给homeHeader
    this.$root.$emit('noIndex')
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleErrorImg (e) {
      e.target.src = ErrorImg
    },
    loseChange (row) {
      if (row.recycle == 1) {
        this.ysxFlag = true
      } else {
        this.$router.push({
          path: '/homedetail/homedetail',
          query: { id: row.Goods_id, ClassName: this.$t('shoppingCart.title2') }
        })
      }
    },
    couponClick (item) {
      if (item.point_type == 1) {
        var data = {
          api: 'plugin.coupon.MallCoupon.receive',

          id: item.id // 活动id
        }

        this.$Api
          .doRequest(data)
          .then(res => {
            this.$message.success(this.$t('shoppingCart.Tips[8]'))

            this.getApi()
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      }
    },
    handleScroll () {
      let top = $('#toPayBox').offset()?.top
      if (
        top >= $(window).scrollTop() &&
        top < $(window).scrollTop() + $(window).height() - 70
      ) {
        this.is_position = false
      } else {
        this.is_position = true
      }
    },
    /*
             ——————sku核心算法 开始——————
         */
    powerset (arr) {
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
    initData (isCart) {
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
      if (
        !this.sku_list.result['undefined'] &&
        this.haveSkuBean == '' &&
        !isCart
      ) {
        let price = 0
        let sku = ''
        for (let i = 0; i < this.sku_list.items.length; i++) {
          let stock = Number(this.sku_list.items[i].Stock)

          if (stock > 0 && price == 0) {
            price = Number(this.sku_list.items[i].price)
            sku = this.sku_list.items[i]
          } else if (
            stock > 0 &&
            price > Number(this.sku_list.items[i].price)
          ) {
            price = Number(this.sku_list.items[i].price)
            sku = this.sku_list.items[i]
          }
        }

        if (sku != '') {
          this.initSeleted(sku.sku)
        }
      }
      this.showResult()
    },

    /**
     * 正常属性点击
     */
    handleNormalClick (key, value) {
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
    handleDisableClick (key, value) {
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
          title: this.$t('shoppingCart.Tips[9]'),
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
    combineAttr (data, keys) {
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

    isJSON (str) {
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
    getAllKeys () {
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

    getAttruites (arr) {
      let result = []
      for (let i = 0; i < arr.length; i++) {
        result.push(arr[i].path)
      }

      return result
    },

    /**
     * 生成所有子集是否可选、库存状态 map
     */
    buildResult (items) {
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
    getSelectedItem () {
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
    updateStatus (selected, type) {
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

    trimSpliter (str, spliter) {
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
    initSeleted (a) {
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
    showResult () {
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
    addPro (id) {
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
            跳转商品详情
         */
    toDetail (id) {
      this.$router.push({ path: '/homedetail/homedetail', query: { id: id } })
    },
    /*
            获取为你推荐列表
         */
    getTuijian () {
      var data = {
        api: 'mall.Product.recommend',
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.recommendList = res.data.list
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
            添加到购物车
         */
    saveAdd () {
      if (this.sku_list.result['undefined']) {
        this.haveSkuBean = {
          cid: this.sku_list.items[0].sku,
          skus: this.sku_list.items[0]
        }
      }

      if (!this.haveSkuBean) {
        this.$message.error(this.$t('shoppingCart.Tips[10]'))
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
          if (res.code == '200') {
            this.$message.success(this.$t('shoppingCart.Tips[11]'))
            this.addProFlag = false
            this.getApi()
            this.$root.$emit('shoppingCart')
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
            点击保存属性
         */
    saveAttr () {
      if (!this.haveSkuBean) {
        this.$message.error(this.$t('shoppingCart.Tips[10]'))
        return
      }

      var data = {
        // module: 'app_pc',
        // action: 'cart',
        // m: 'modify_attribute',
        api: 'mall.Cart.modifyAttribute',

        car_id: this.car_id, // 购物车id
        attribute_id: this.haveSkuBean.cid // 属性id
      }

      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == '200') {
            this.attrMaskFlag = false
            this.$message.success(this.$t('shoppingCart.xgcg'))

            this.getApi()
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
            核心算法
         */
    _spec () {
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
    checkAttr (indx, index) {
      var listItem = this.attrList

      var items = listItem[indx]
      var item = items.attr[index]

      if (item.select) {
        return
      }

      if (!item.enable) {
        uni.showToast({
          title: this.$t('shoppingCart.Tips[9]'),
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
            canGetInfoLog = this.$t('shoppingCart.Tips[12]') + ' '
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
            title: this.$t('shoppingCart.Tips[9]'),
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
            打开选择属性的弹窗
         */
    openAttr (indexs, index, attribute_id) {
      this.attrMaskPro = this.cartList[indexs].list[index]

      var data = {
        // module: 'app_pc',
        // action: 'cart',
        // m: 'dj_attribute',
        api: 'mall.Cart.djAttribute',

        car_id: this.cartList[indexs].list[index].id
      }

      this.car_id = this.cartList[indexs].list[index].id

      this.$Api.doRequest(data)
        .then(res => {
          this.skuBeanList = res.data[0].attribute_list
          this.haveSkuBean = ''
          this.initData()
          this.attrMaskFlag = true

          // 以下为初始化选中
          for (let i in this.sku_list.items) {
            if (this.sku_list.items[i].sku == attribute_id) {
              this.haveSkuBean = {
                name: this.sku_list.items[i].path,
                cid: attribute_id,
                skus: this.sku_list.items[i]
              }
            }
          }
          let selectName = ''
          if (this.haveSkuBean.name) {
            selectName = this.haveSkuBean.name.split(',')
          }
          // let selectName = this.haveSkuBean.name.split(',')

          for (let i in this.sku_list.result) {
            for (let k in this.sku_list.result[i]) {
              let flag = ''
              if (selectName) {
                selectName.some(item => item == k)
              }

              if (flag) {
                this.handleActive(i, this.sku_list.result[i][k])
              }
            }
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    openMask (indexs, index, type) {
      if (type == 3 && this.checkNum == 0) {
        this.$message.error(this.$t('shoppingCart.Tips[13]'))
        return
      }

      this.infoFlag = type
      this.meStatus = type
      if (type != 3) {
        this.car_id = this.cartList[indexs].list[index].id
      }
    },
    saveLose () {
      if (this.loseList.length <= 0) {
        return
      }
      var list = []
      this.loseList.forEach(item => {
        list.push(item.id)
      })
      var data = {
        api: 'mall.Cart.delCart',

        cartIds: list.join(',')
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == '200') {
          this.$message.success(this.$t('shoppingCart.sccg2'))
          this.loseFlag = false
          this.getApi()
        }
      })
    },
    saveSC () {
      var data = {
        // module: 'app_pc',
        // action: 'cart',
        // m: 'to_Collection',
        api: 'mall.Cart.toCollection',

        car_id: this.car_id
      }

      if (this.infoFlag == 1 || this.infoFlag == 3) {
        // 删除
        data.m = 'delcart'
      }

      if (this.infoFlag == 3) {
        var cart_id = []

        this.checkList.filter((items, indexs) => {
          items.list.filter((item, index) => {
            if (item) {
              cart_id.push(this.cartList[indexs].list[index].id)
            }
          })
        })

        cart_id = cart_id.join(',')

        data.car_id = cart_id
      }

      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == '200') {
            this.infoFlag = false
            if (this.meStatus == 2) {
              this.$message.success(this.$t('shoppingCart.sccg'))
            } else if (this.meStatus == 1) {
              this.$message.success(this.$t('shoppingCart.sccg2'))
            } else {
              this.$message.success(this.$t('shoppingCart.Tips[14]'))
            }
            this.getApi()
            this.$root.$emit('shoppingCart')
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    toPay () {
      var cart_id = []
      var goods = []

      this.checkList.filter((items, indexs) => {
        items.list.filter((item, index) => {
          if (item) {
            // this.cartList[indexs].list[index]
            cart_id.push(this.cartList[indexs].list[index].id)
            goods.push({
              num: this.cartList[indexs].list[index].num,
              cart_id: Number(this.cartList[indexs].list[index].id)
            })
          }
        })
      })

      if (cart_id.length == 0) {
        this.$message.error(this.$t('shoppingCart.Tips[13]'))
        return
      }

      cart_id = cart_id.join(',')
      this.$router.push({
        path: '/pay/payDetails',
        query: { cart_id: cart_id, vipSource: 0 }
      })
    },
    getApi (type) {
      var data = {
        // module: 'app_pc',
        // action: 'cart',
        // m: 'index',
        api: 'mall.Cart.index',
        access_id: this.pc_user.access_id
      }

      this.$Api.doRequest(data).then(res => {
        this.login_status = res.data.login_status
        this.cartList = res.data.list
        this.loseList = res.data.data0
        console.log('loseList', this.loseList)
        var checkList = []

        this.cartList.filter(items => {
          var checkItem = { all: false, list: [] }

          items.list.filter(item => {
            checkItem.list.push(false)
          })

          checkList.push(checkItem)
        })

        this.checkList = checkList

        if (this.cartList.length == 0) {
          this.goods_length = false
        } else {
          this.goods_length = true
        }
        this.loadFlag = false

        setTimeout(() => {
          this.handleScroll()
        }, 50)
      })
    },
    handleChange (indexs, index) {
      let goodsList = []
      let goods = {
        num: this.cartList[indexs].list[index].num,
        cart_id: this.cartList[indexs].list[index].id
      }
      goodsList.push(goods)
      var data = {
        // module: 'app_pc',
        // action: 'cart',
        // m: 'up_cart',
        api: 'mall.Cart.upCart',

        cart: JSON.stringify(goodsList)
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.$root.$emit('shoppingCart')
        })
        .catch(error => {
          this.$message.error(this.$t('shoppingCart.Tips[15]'))
          this.getApi()
        })
    },

    // 店铺全选
    changeStore (indexs) {
      let checkList = JSON.parse(JSON.stringify(this.checkList))
      let arr = []
      checkList[indexs].list.filter(item => {
        arr.push(checkList[indexs].all)
      })
      checkList[indexs].list = arr

      this.checkList = checkList
    },

    // 商品单选
    changePro (indexs) {
      let checkList = JSON.parse(JSON.stringify(this.checkList))

      let flag = true

      checkList[indexs].list.filter(item => {
        if (!item) {
          flag = false
        }
      })

      checkList[indexs].all = flag

      this.checkList = checkList
    },

    // 购物车全选
    changeAll (newVal) {
      let checkList = JSON.parse(JSON.stringify(this.checkList))

      checkList.filter(items => {
        items.all = newVal

        items.list.filter((item, index) => {
          items.list[index] = newVal
        })
      })

      this.checkList = checkList
    },

    toUrl (url, row) {
      this.$router.push({ path: url, query: { isReturn: row } })
    },
    toHome (url) {
      this.$router.push({ path: url })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/shoppingCart/shoppingCart.css';
</style>
