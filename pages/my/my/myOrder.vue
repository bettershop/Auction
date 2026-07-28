<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的订单" />
    <!-- 我的订单tabs -->
    <ul class="tabs">
      <li :class="{ 'border-bottom': tabIndex == 0, redb: tabIndex == 0 }" @click="chooseTab(0)">
        {{ $t('myorder.tab[0]') }}
      </li>
      <li :class="{ 'border-bottom': tabIndex == 1, redb: tabIndex == 1 }" @click="chooseTab(1)">
        <!-- 不显示为0 的数值 -->
        {{ $t('myorder.tab[1]') }}<span>{{ tab_num[0]||'' }}</span>
      </li>
      <li :class="{ 'border-bottom': tabIndex == 2, redb: tabIndex == 2 }" @click="chooseTab(2)" style="white-space: nowrap">
        {{ $t('myorder.tab[2]') }}<span>{{ tab_num[1]||'' }}</span>
      </li>
      <li :class="{ 'border-bottom': tabIndex == 3, redb: tabIndex == 3 }" @click="chooseTab(3)" style="white-space: nowrap">
        {{ $t('myorder.tab[3]') }}<span>{{ tab_num[2]||'' }}</span>
      </li>
      <li :class="{ 'border-bottom': tabIndex == 4, redb: tabIndex == 4 }" @click="chooseTab(4)" style="white-space: nowrap">
        {{ $t('myorder.tab[4]') }}<span>{{ tab_num[5]||'' }}</span>
      </li>
      <el-input :placeholder="$t('myorder.placeholder')" v-model="ordervalue" size="mini">
        <el-button slot="append" @click="searchOrder">{{
          $t('myorder.search')
        }}</el-button>
      </el-input>
    </ul>
    <!-- 我的订单tabs end -->
    <div>
      <!-- 订单状态栏 -->
      <div class="select-head" v-if="loadFlag || order_list.length > 0 || order_list.total > 0">
        <el-row>
          <el-col :span="10" style="width: 337px">
            <div class="grid-content">{{ $t('myorder.th[0]') }}</div>
          </el-col>
          <el-col :span="3" style="width: 101px">
            <div class="grid-content">{{ $t('myorder.th[1]') }}</div>
          </el-col>
          <el-col :span="2" style="width: 101px">
            <div class="grid-content">{{ $t('myorder.th[2]') }}</div>
          </el-col>
          <el-col :span="3" style="width: 125px">
            <div class="grid-content">{{ $t('myorder.th[3]') }}</div>
          </el-col>
          <el-col :span="3" style="width: 125px">
            <div class="grid-content">{{ $t('myorder.th[4]') }}</div>
          </el-col>
          <el-col :span="3" style="width: 150px">
            <div class="grid-content">{{ $t('myorder.th[5]') }}</div>
          </el-col>
        </el-row>
      </div>

      <div v-else class="noOrder">
        <img :src="noOrder" alt="" />
        <p>{{ $t('myorder.long[0]') }}~</p>
      </div>
      <!-- 订单状态栏 end -->

      <!-- 订单信息 -->
      <div v-if="loadFlag" class="order">
        <!-- 店铺名称 -->
        <div class="store-title" style="display: flex; align-items: center; height: 40px">
          <span class="sp1 nonavtitle" style="height: 18px"></span>
          <span class="nonavtitle" style="width: 200px; height: 18px"></span>
          <span class="nonavtitle" style="width: 170px; height: 18px"></span>
        </div>
        <!-- 订单店铺商品 -->
        <div class="store-cart-goods" style="position: relative">
          <el-table :data="loadData" :span-method="objectSpanMethod" border :show-header="false" style="width: 100%">
            <el-table-column width="337">
              <template slot-scope="scope">
                <div class="grid-content1 goodDetail">
                  <img class="good-img nonavtitle" src="" alt="" />
                  <div class="detail">
                    <p class="nonavtitle" style="display: block"></p>
                    <span class="nonavtitle"></span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="101">
              <template slot-scope="scope">
                <span class="price nonavtitle"></span>
              </template>
            </el-table-column>
            <el-table-column width="101">
              <template slot-scope="scope">
                <span class="num nonavtitle"></span>
              </template>
            </el-table-column>
            <el-table-column width="125">
              <template slot-scope="scope">
                <p class="amount nonavtitle"></p>
              </template>
            </el-table-column>
            <el-table-column width="125">
              <div class="order-condition">
                <span class="nonavtitle"></span>
              </div>
            </el-table-column>
            <el-table-column>
              <el-button size="small" class="nonavtitle" style="width: 80px"></el-button>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="!loadFlag" class="order" v-for="(items, indexs) of order_list" :key="indexs">
        <!-- 店铺名称 -->
        <div class="store-title">
          <span class="sp1">{{ $t('myorder.shop') }}{{ items.shop_name }}</span>
          <span>{{ $t('myorder.order_number') }}{{ items.sNo }}</span>
          <span class="carry" v-if="items.self_lifting == 1">{{
            $t('myorder.self')
          }}</span>
          <span>{{ $t('myorder.add_time') }}{{ items.add_time }}</span>

          <img v-if="items.status != 1 && items.status != 2 && items.status != 4" :src="clear" alt="" style="cursor: pointer" @click="orderBtn(items.id, 'mall.Order.delOrder')" />
        </div>
        <!-- 订单店铺商品 -->
        <div class="store-cart-goods" style="position: relative">
          <el-table :data="items.list" :span-method="objectSpanMethod" border :show-header="false" style="width: 100%">
            <el-table-column width="337">
              <template slot-scope="scope">
                <div class="grid-content1 goodDetail">
                  <el-image class="good-img" :src="scope.row.imgurl" :preview-src-list="[scope.row.imgurl]">
                    <div slot="error">
                      <img class="good-img" style="margin-left: 0;" :src="ErrorImg"></img>
                    </div>
                  </el-image>
                  <div class="detail">
                    <p>
                      <el-tag v-if="items.otype == 'integral'" type="danger">
                        {{ $t('myorder.integral') }}
                      </el-tag>
                      <el-tag v-if="items.otype == 'pt'" type="danger">
                        {{ $t('myorder.pt') }}
                      </el-tag>
                      <el-tag v-if="items.otype == 'MS'" type="danger">
                        {{ $t('myorder.ms') }}
                      </el-tag>
                      {{ scope.row.p_name }}
                    </p>
                    <span>{{ scope.row.size }}</span>
                    <p v-if="scope.row.isReturn" style="color:#D4282D">{{ $t('myorder.tkcg') }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="101">
              <template slot-scope="scope">
                <span class="price"> {{items.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(scope.row.p_price,items.exchange_rate) }} </span>
                <div v-if="items.otype == 'integral'">+</div>
                <div v-if="items.otype == 'integral'" class="integral">
                  <img src="~/static/images/integral_hei.png" alt="" />
                  {{ scope.row.integral }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="101">
              <template slot-scope="scope">
                <span class="num">{{ scope.row.num }}</span>
              </template>
            </el-table-column>
            <el-table-column width="125">
              <template slot-scope="scope">
                <p class="amount"><span v-if='!items.pay_time'>{{ $t('myorder.yf')}}</span>{{items.currency_symbol}}{{$LaiKeCommObject.getPriceWithExchangeRate( items.old_total,items.exchange_rate) }}</p>

                <div v-if="items.otype == 'integral'">+</div>
                <div v-if="items.otype == 'integral'" class="integral" style="color: #020202">
                  <img src="~/static/images/integral_hei.png" alt="" />
                  {{ scope.row.integral }}
                </div>
                <span class="freight" v-if=" items.old_freight > 0 ">({{ $t('myorder.long[1]') }}{{ $LaiKeCommObject.getPriceWithExchangeRate(items.old_freight,items.exchange_rate) }})</span>
              </template>
            </el-table-column>
            <el-table-column width="125">
              <div class="order-condition">
                <span v-if="items.status == 0" class="red">{{
                  $t('myorder.tab[1]')
                }}</span>
                <span v-else-if="items.status == 1">{{
                  $t('myorder.tab[2]')
                }}</span>
                <span v-else-if="items.status == 2">{{
                  $t('myorder.tab[3]')
                }}</span>
                <span v-else-if="items.status == 3">
                  {{ $t('myorder.state[0]') }}</span>
                <span v-else-if="items.status == 4" style="white-space: nowrap">
                  {{
                    items.list[0].re_type == 1
                      ? $t('myorder.state[1]')
                      : items.list[0].re_type == 2
                      ? $t('myorder.state[2]')
                      : $t('myorder.state[3]')
                  }}
                  :
                  {{
                    items.list[0].r_type == 0
                      ? $t('myorder.state[4]')
                      : items.list[0].r_type == 1
                      ? $t('myorder.state[5]')
                      : items.list[0].r_type == 2
                      ? $t('myorder.state[6]')
                      : items.list[0].r_type == 3
                      ? $t('myorder.state[7]')
                      : items.list[0].r_type == 4
                      ? $t('myorder.state[8]')
                      : items.list[0].r_type == 5
                      ? $t('myorder.state[6]')
                      : items.list[0].r_type == 8
                      ? $t('myorder.state[6]')
                      : items.list[0].r_type == 9
                      ? $t('myorder.state[8]')
                      : items.list[0].r_type == 10
                      ? $t('myorder.state[6]')
                      : items.list[0].r_type == 11
                      ? $t('myorder.state[8]')
                      : $t('myorder.state[9]')
                  }}
                </span>
                <span v-else-if="items.status == 5">{{
                  $t('myorder.state[10]')
                }}</span>
                <span v-else-if="items.status == 6" class="grey">{{
                  $t('myorder.state[11]')
                }}</span>
                <span v-else-if="items.status == 7" class="grey">{{
                  $t('myorder.state[12]')
                }}</span>
                <span v-else-if="items.status == 12">{{
                  $t('myorder.state[13]')
                }}</span>

                <a v-if="items.status != 4" href="javascript:;" @click="toDetails('/my/my/orderDetails', items.id)">{{ $t('myorder.order_info') }}</a>
                <a v-else href="javascript:;" @click="toReturn(items)">{{
                  $t('myorder.after_info')
                }}</a>

                <div v-if="items.self_lifting == 1">
                  <a class="red ckwl" href="javascript:;" :class="{ 'border-bottom-1': items.show_address }" :ref="'ztdz' + items.id" @click="carry_address(items, indexs)">
                    {{ $t('myorder.self_address') }}
                  </a>
                  <div class="logistics-box address_top" style="display: none" :ref="'ztdzD' + items.id">
                    <div class="logistics-box-top">
                      <div class="triangle"></div>
                      <div class="item_address">
                        <p>{{ zt_address.name }}</p>
                        <span>{{ zt_address.mobile }}</span>
                      </div>
                    </div>
                    <div class="item_info">
                      <span>
                        {{ zt_address.sheng }} {{ zt_address.shi }}
                        {{ zt_address.xian }}</span>
                      <span>{{ zt_address.address }}</span>
                    </div>
                    <p class="item_time">
                      {{ $t('myorder.time') }}{{ zt_address.business_hours }}
                    </p>
                  </div>
                </div>

                <div v-if="
                    items.status == 2 ||
                    items.status == 3 ||
                    items.status == 5 ||
                    items.haveExpress
                  ">
                  <a v-if="items.self_lifting != 1 || items.haveExpress" class="red ckwl" href="javascript:;" :class="{ 'border-bottom-1': items.show_wuliu }" :ref="'ckwl' + items.id" @click="checkTheLogistics(items)">
                    {{ $t('myorder.logistics') }}
                  </a>
                  <div class="logistics-box" :ref="'ckwlD' + items.id" style="display: none">
                    <div class="logistics-box-top">
                      <div class="triangle"></div>
                      <div>
                        <p>
                          {{ $t('myorder.long[2]')
                          }}<span class="redb">{{ logistics_list.length }}</span>{{ $t('myorder.long[3]') }}
                        </p>
                        <span style="cursor: pointer" @click="toDetails('/my/my/orderDetails', items.id)">{{ $t('myorder.view_more') }}&gt;</span>
                      </div>

                      <p>
                        <span style="
                            margin-right: 10px;
                            max-width: 68px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          ">{{
                            logistics_list[0] && logistics_list[0].kuaidi_name
                          }}</span>
                        <span style="
                            max-width: 160px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          ">{{ $t('myorder.awb') }}:{{
                            logistics_list[0] && logistics_list[0].courier_num
                          }}</span>
                      </p>
                    </div>
                    <div style="height: 292px; overflow-y: auto">
                      <template v-if="logistics_list[0] && logistics_list[0].list">
                        <el-timeline>
                          <el-timeline-item v-for="(activity, index) in logistics_list[0].list" :key="index" :timestamp="activity.ftime" :color="activity.color">
                            {{ activity.context }}
                          </el-timeline-item>
                        </el-timeline>
                      </template>
                      <div>{{ $t('myorder.long[4]') }}~</div>
                    </div>
                    <div class="app-code">
                      <img :src="app_code" alt="" />
                      <div>
                        <p>{{ $t('myorder.long[5]') }}</p>
                        <p>
                          {{
                            mchCoupon && mchCoupon.mallName
                              ? `${mchCoupon.mallName}APP`
                              : $t('myorder.long[6]')
                          }}
                        </p>
                        <p>{{ $t('myorder.long[7]') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-table-column>
            <el-table-column>
              <div v-if="items.status == 0" class="waiting-to-pay">
                <div>
                  <i class="el-icon-time" style="transform: rotateY(180deg)"></i>
                  {{ items.countdown }}
                </div>
                <!-- 立即付款 -->
                <el-button size="small" type="danger" @click="toDetails('/my/my/payment', items.id)">{{ $t('myorder.button[0]') }}</el-button>
                <!-- 取消订单 -->
                <span class="sp" @click="orderBtn(items.id, 'mall.Order.removeOrder')">{{ $t('myorder.button[1]') }}</span>
              </div>
              <template v-else-if="items.status == 1">
                <el-button size="small" :disabled="items.delivery_status == 1" type="danger" @click="orderBtn(items.id, 'mall.Order.delivery')">{{ $t('myorder.button[2]') }}</el-button>
                <!-- 极速退款 -->
                <!-- <div style="margin: 12px auto 0;cursor: pointer;" @click="orderBtnTK(items)">{{ $t('myorder.button[9]') }}</div> -->
              </template>
              <el-button size="small" v-else-if="
                  items.status == 2 &&
                  items.sale_type == 0 &&
                  items.self_lifting != 1
                " type="danger" @click="orderBtn(items.id, 'mall.Order.okOrder')">{{ $t('myorder.button[3]') }}</el-button>
              <el-button size="small" v-else-if="items.status == 5" @click="toEvaluation('/my/my/evaluationing', items.sNo, '5')">
                {{
                  items.comments_type == 1
                    ? $t('myorder.button[4]')
                    : items.comments_type == 2
                    ? $t('myorder.button[6]')
                    : items.comments_type == 3
                    ? $t('myorder.button[7]')
                    : '1'
                }}
              </el-button>
              <div class="kjfp" v-if="items.isInvoice == true">
                <el-button @click="toInvoice(items)" size="small">{{ $t('myorder.button[8]') }}</el-button>
              </div>
              <el-button size="small" v-else-if="items.self_lifting == 1 && items.status == 2" type="danger" @click="View_tqm(items)">{{ $t('myorder.button[5]') }}</el-button>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="block" v-if="order_num > 0">
      <el-pagination :current-page.sync="page" background layout="prev, pager, next" :total="order_num" @current-change="changePage">
      </el-pagination>
    </div>

    <el-dialog :title="$t('myorder.button[5]')" :visible.sync="dialogVisible2" width="40%">
      <div class="modal_code">
        <p class="modal_number">{{ $t('myorder.long[8]') }}{{ tqm.sNo }}</p>
        <div class="modal_cen" v-for="(item, index) in tqm.por_list">
          <img :src="item.img" />
          <div class="modal_item">
            <span>{{ item.product_title }}</span>
            <div class="modal_attr">
              <span>{{item.show_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(item.p_price,item.exchange_rate) }}</span>
              <span>{{ $t('myorder.long[9]') }}{{ item.size }}x{{ item.num }}</span>
            </div>
          </div>
        </div>
        <p class="modal_total">
          {{ $t('myorder.long[10]') }}{{ tqm.num }}{{ $t('myorder.long[11]')
          }}{{ tqm.z_price }}
        </p>
        <div class="modal_tqm">
          {{ $t('myorder.long[12]') }}{{ tqm.extraction_code }}
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="$t('myorder.hirt')" :visible.sync="dialogVisible3" width="40%" class="eldio">
      <span>{{ $t('myorder.isDelOrder') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">{{
          $t('cancel')
        }}</el-button>
        <el-button type="primary" @click="Delete_order">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <div class="addressMask" v-if="yuepayFlag">
      <div style="height: auto">
        <div class="addressMask_title">
          开票提示
          <i class="el-icon-close" @click="yuepayFlag = false"></i>
        </div>

        <div class="order_Detail">
          <div class="pay_payfs">
            <div class="orderDetail_dep">
              <img style="width: 28px" src="~/static/images/close_1.png" />
            </div>
            <div class="orderDetail_center_top">
              该订单发票已超时，请联系商家
            </div>
          </div>
        </div>
        <div class="addressMask_bottom">
          <div class="div_four" style="font-size: 13px" @click="yuepayFlag = false">
            取消
          </div>
          <div class="div_four" style="font-size: 13px" @click="toUrl('/my/my/myOrder')">
            返回订单
          </div>
        </div>
      </div>
    </div>
    <div class="addressMask" v-if="yuepayFlag2">
      <div style="height: auto">
        <div class="addressMask_title">
          {{ $t('invoiceManagement.kptx') }}
          <i class="el-icon-close" @click="yuepayFlag2 = false"></i>
        </div>

        <div class="order_Detail">
          <div class="pay_payfs">
            <!-- <div class="orderDetail_kep">
				<i class="el-icon-check"></i>
			  </div> -->
            <div class="orderDetail_dep">
              <img style="width: 28px" src="~/static/images/close_1.png" />
            </div>
            <div class="orderDetail_center_top">
              {{ $t('invoiceManagement.ndqzw') }}
            </div>
          </div>
        </div>
        <div class="addressMask_bottom">
          <div style="font-size: 16px; color: #000000" @click="yuepayFlag2 = false">
            {{ $t('invoiceManagement.qx') }}
          </div>
          <div style="font-size: 16px" @click="toUrl('/my/my/addInvoice')">
            {{ $t('invoiceManagement.ljtj') }}
          </div>
        </div>
      </div>
    </div>
    <!-- 极速提现弹窗 -->
    <div class="infoMask" v-if="infoFlag">
      <div>
        <i class="el-icon-warning-outline" style="
            color: #d4282d;
            font-size: 36px;
            height: 36px;
            display: flex;
            align-items: center;
          "></i>
        <div class="infoText">
          {{ $t('after_details.qryjstkm') }}
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
  </div>
</template>

<script>
export default {
  async asyncData({ app, query }) {
    let pc_user = app.$cookies.get('pc_user')
    let tabIndex = query.type ?? 0
    return {
      pc_user,
      tabIndex
    }
  },

  data() {
    return {
      yuepayFlag: false,
      yuepayFlag2: false,
      visible: false,
      input: '',
      tabIndex: 0,
      clear: require('/static/images/clear.jpg'),
      app_code: require('/static/images/app_code.png'),
      noOrder: require('/static/images/no_order.png'),
      ErrorImg: require('/static/images/default_picture.png'),
      loadData: [
        {
          p_name: '',
          id: '',
          price: '',
          freight: '',
          num: '',
          stock: ''
        }
      ],

      activities: [
        {
          content: '[长沙市] 快递已到达长沙市岳麓区，快递正在派送中',
          timestamp: '2019-04-02 12:30:44',
          color: '#D4282D'
        },
        {
          content: '[长沙市] 快递已到达长沙市岳麓区，快递正在派送中',
          timestamp: '2019-04-02 12:30:44'
        },
        {
          content: '[长沙市] 快递已到达长沙市岳麓区，客户签收人：张三，已签收',
          timestamp: '2019-04-02 12:30:44'
        }
      ],

      loadFlag: true,

      order_list: [],
      pc_user: {},
      page: 1,
      ordervalue: '', //搜索的订单名称/编号
      order_num: 0, //订单总数
      tab_num: [],

      timeI: '',
      order_failure: 1,

      logistics_list: [],
      jsTkItem: {},//极速退款item
      zt_address: {
        name: 1
      },
      dialogVisible2: false,
      dialogVisible3: false,
      order_id: '',
      infoFlag: false,//极速退款确认弹窗
      tqm: {},
      mchCoupon: {},
      company: '',
    }
  },
  mounted() {
    this.$emit('pageTitle', '我的订单')
    this.pc_user = this.$cookies.get('pc_user')
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    if (this.$route.query.type) {
      this.tabIndex = this.$route.query.type
    }
    this.getApi()
  },
  beforeDestroy() {
    // 清理定时器
    clearTimeout(this.timeI)
  },
  methods: {
    searchOrder() {
      this.page = 1
      this.tabIndex = 0
      this.getApi()
    },
    Delete_order() {
      var data = {

        api: 'mall.Order.delOrder',
        order_id: this.order_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(this.$t('message.Tips[1]'))
          this.dialogVisible3 = false
          this.getApi()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /**
     * 极速退款 - 弹窗
     */
    orderBtnTK(item) {
      this.infoFlag = true
      this.jsTkItem = item
    },
    /**
     * 极速退款 - 确认
     */
    saveSC() {
      let pc_user = this.$cookies.get('pc_user')
      let jsTkID = ''
      this.jsTkItem.list.forEach((item, index) => {
        jsTkID = jsTkID + item.id + ','
      })

      let jsTkz_price = this.$LaiKeCommObject.getPriceWithExchangeRate(this.jsTkItem.z_price, this.jsTkItem.exchange_rate);

      let data = {
        api: 'mall.Order.applyReturnGoods',
        explain: '极速退款', //退货原因
        type: 2, //退货类型 1.退货退款 2.仅退款 3.换货 （极速退款 2.仅退款）
        apply_return_goods: '', // 评论图片
        order_details_id: jsTkID, // 订单详情id
        refund_amount: jsTkz_price, // 退货金额
        refund_apply_money: jsTkz_price, // 用户申请退款金额
      }
      this.$Api.doRequest(data).then(res => {
        this.$router.push('/my/my/management')
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    orderBtn(order_id, m) {
      var data = {

        api: m,
        order_id
      }
      if (m == 'mall.Order.delOrder') {
        this.order_id = order_id
        this.dialogVisible3 = true
        return
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(this.$t('message.czcg'))

          this.getApi()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    changePage(page) {
      clearTimeout(this.timeI)

      this.page = page

      this.loadFlag = true

      this.getApi()
    },
    // 待付款倒计时
    getcountdown(time) {
      var time1 = new Date(time).getTime()
      var time2 = new Date().getTime()

      // 剩余毫秒数
      var time3 = this.convertToMilliseconds(this.order_failure, this.company, time1)
      console.log('time3', time3)
      if (time3 <= 0) {
        // this.getApi()
        return this.$t('myorder.Tips[0]')
      }

      var h = parseInt(time3 / 3600)
      var sTime = parseInt(time3 % 3600)
      var m = parseInt(sTime / 60)
      var s = parseInt(sTime % 60)

      this.timeI = setTimeout(() => {
        var order_list = JSON.parse(JSON.stringify(this.order_list))

        if (order_list) {
          order_list.filter(item => {
            if (item.status == 0) {
              item.countdown = this.getcountdown(item.add_time)
            }
          })
        }

        this.order_list = order_list
      }, 1000)
      if (h < 10) {
        h = '0' + h
      }
      if (m < 10) {
        m = '0' + m
      }
      if (s < 10) {
        s = '0' + s
      }

      return (
        h +
        ":" +
        m +
        ":" +
        s

      )
    },
    /**
    * 将指定时间值转换为毫秒
    * @param {number} order_failure - 时间数值
    * @param {string} company - 时间单位，支持：'秒'、'小时'、'天'（中文或英文单位均可）
    * @param {string | Number} time1 - 时间单位，支持：'秒'、'小时'、'天'（中文或英文单位均可）
    */
    convertToMilliseconds(order_failure, company, time1) {
      // 获取当前时间
      var time2 = new Date().getTime()

      // 剩余毫秒数
      var time3 = 0
      if (company == 'seconds') {
        // 秒
        time3 = (1000 * order_failure - (time2 - time1)) / 1000
      } else if (company == 'day') {
        /**
         * 天
         * 先将天换算为小时：1 天 × 24 小时 / 天 = 24 小时。
         * 再将小时换算为分钟：24 小时 × 60 分钟 / 小时 = 1440 分钟。
         * 接着将分钟换算为秒：1440 分钟 × 60 秒 / 分钟 = 86400 秒。
         * 最后将秒换算为毫秒：86400 秒 × 1000 毫秒 / 秒 = 86400000 毫秒
         *
         */
        var time3 = (24 * 60 * 60 * 1000 * order_failure - (time2 - time1)) / 1000
      } else if (company == 'hour') {
        /**
         * 小时
         * 先将小时换算为分钟：1 小时 × 60 分钟 / 小时 = 60 分钟。
         * 再将分钟换算为秒：60 分钟 × 60 秒 / 分钟 = 3600 秒。
         * 最后将秒换算为毫秒：3600 秒 × 1000 毫秒 / 秒 = 3600000 毫秒
         */
        time3 = (60 * 60 * 1000 * order_failure - (time2 - time1)) / 1000
      }
      return time3
    },
    getApi() {
      this.tableList = ''
      if (!this.pc_user.access_id) {
        this.$router.push({ path: '/login/login' })
      }

      var data = {
        api: 'mall.Order.index',
        order:'JP',
        ordervalue: this.ordervalue, // 商品名称/订单号
        pageNum: this.page // 次数
      }

      if (this.tabIndex == 1) {
        data.order_type = 'payment'
      } else if (this.tabIndex == 2) {
        data.order_type = 'send'
      } else if (this.tabIndex == 3) {
        data.order_type = 'receipt'
      } else if (this.tabIndex == 4) {
        data.order_type = 'evaluete'
      }

      this.$Api.doRequest(data)
        .then(res => {
          console.log('res', res)

          this.loadFlag = false

          //秒
          this.order_failure = res.data.order_failure
          this.company = res.data.company
          if (res.data.order) {
            res.data.order.filter(item => {
              item.show_wuliu = false
              item.show_address = false
              if (item.status == 0) {
                item.countdown = this.getcountdown(item.add_time)
              }

              // if (item.list.length > 2) {
              //   item.list.length = 1
              // }
            })
          }

          this.order_list = res.data.order
          console.log('order_list', this.order_list)

          this.order_num = res.data.order_num
          this.tab_num = res.data.res_order
        })
        .catch(error => {
          this.loadFlag = false

          this.$message.error(error.message)
        })
    },
    chooseTab(index) {
      //
      console.log('index', index)

      this.tabIndex = index

      this.page = 1

      this.loadFlag = true

      this.ordervalue = ''
      this.getApi()
    },
    View_tqm(item) {
      let data = {
        api: 'mall.Order.see_extraction_code',
        order_id: item.id,
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.tqm = res.data
            this.dialogVisible2 = true
          }
          console.log(res)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    carry_address(items, index) {
      console.log(items)
      var btn = this.$refs['ztdz' + items.id] //‘自提地址’文字按钮
      var box = this.$refs['ztdzD' + items.id] //自提地址box

      items.show_address = !items.show_address

      this.order_list.filter(item => {
        if (items.id != item.id) {
          item.show_address = false
        }
      })

      let data = {
        api: 'mall.Order.getMchStore',

        id: items.single_store
      }
      if (items.show_address) {
        this.$Api
          .doRequest(data)
          .then(res => {
            if (res.code == 200) {
              $(box).css('display', '')
              $(btn).removeClass('border-bottom-1')
              this.order_list[index].zi_address = res.data.address
              this.zt_address = res.data.address

              let html =
                '<div class="logistics-box-top">' +
                '<div class="triangle"></div>' +
                '<div class="item_address" style="display: flex;justify-content: space-between;width: 90%;margin-left: 5%;border-bottom: 0.5px solid #e2e2e2;margin-top:10px;">' +
                '<p style="font-weight: 600;">' +
                res.data.address.name +
                '</p>' +
                '<span style="">' +
                res.data.address.mobile +
                '</span>' +
                '</div>' +
                '</div>' +
                '<div class="item_info" style="display: flex;margin-left: 12px;">' +
                '<span style="color:#BEBEBE;">' +
                res.data.address.sheng +
                '    ' +
                res.data.address.shi +
                '    ' +
                res.data.address.xian +
                '</span>' +
                '</div>' +
                '<div class="item_info" style="display: flex;margin-left: 12px;">' +
                '<span>' +
                res.data.address.address +
                '</span>' +
                '</div>' +
                '<p class="item_time" style="display: flex;margin-left: 12px;margin-top:15px;color:#BEBEBE;margin-bottom:15px;">' +
                this.$t('myorder.time') +
                res.data.address.business_hours +
                '</p>'

              $(box).html(html)
              console.log()
              console.log(this.order_list)
            } else {
              this.$message.error(res.data.message)
            }
            console.log(res)
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      } else {
        $(btn).removeClass('border-bottom-1')
        $(box).css('display', 'none')
      }
    },
    checkTheLogistics(items) {
      var btn = this.$refs['ckwl' + items.id] //‘查看物流’文字按钮
      var box = this.$refs['ckwlD' + items.id] //物流消息box

      items.show_wuliu = !items.show_wuliu

      this.order_list.filter(item => {
        if (items.id != item.id) {
          item.show_wuliu = false
        }
      })

      let data = {
        api: 'mall.Order.logistics',

        id: items.sNo, // 订单号
        details: '' // 订单详情id
      }

      if (items.show_wuliu) {
        $('.logistics-box').css('display', 'none')
        $('.ckwl').removeClass('border-bottom-1')

        this.$Api
          .doRequest(data)
          .then(res => {
            this.logistics_list = res.data.list

            this.order_list = JSON.parse(JSON.stringify(this.order_list))

            $(btn).addClass('border-bottom-1')
            $(box).css('display', '')
          })
          .catch(error => {
            items.show_wuliu = false
            this.$message.error(error.message)
          })
      } else {
        $(btn).removeClass('border-bottom-1')
        $(box).css('display', 'none')
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        if (rowIndex === 0) {
          return {
            // 临时解决样式问题
            rowspan: 15,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    toInvoice(items) {
      let data = {
        // api: 'app_pc.invoiceHeader.getDefault',
        api: 'mall.InvoiceHeader.getDefault',
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data).then(res => {
        if (JSON.stringify(res.data) === '{}') {
          this.yuepayFlag2 = true
        } else {
          this.toKt('/my/my/cutInvoice', items.spz_price, items.sNo, items)
        }
      })
    },
    toKt(url, spz_price, sNo, items) {
      let invoiceTimeout = items.invoiceTimeout
      if (invoiceTimeout == true) {
        this.yuepayFlag = true
      } else {
        this.$router.push({
          path: url,
          query: { z_price: spz_price, sNo: sNo }
        })
      }
    },
    toUrl(url) {
      console.log('url', url)
      this.$router.push({ path: url })
      this.yuepayFlag = false
    },
    toDetails(url, order_id) {
      this.$router.push({
        path: url,
        query: { order_id: order_id }
      })
    },
    toEvaluation(url, sNo, type) {
      this.$router.push({
        path: url,
        query: { sNo: sNo, type: type }
      })
    },
    toReturn(items) {
      let id = ''
      items.list.filter(item => {
        id += ',' + item.id
      })

      id = id.replace(',', '')
      this.$router.push({
        path: '/my/my/afterDetails',
        query: { id: id }
      })
    }
  }
}
</script>

<style scoped>
@import '~/assets/css/my/myOrder.css';
/* 极速提现弹窗样式 */
.infoMask {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 666;
}
.infoMask > div {
  width: 420px;
  background: rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 0;
}
.infoMask .btnBox {
  margin-top: 24px;
}
.infoMask .el-button {
  width: 112px;
  height: 36px;
  border-radius: 0;
}
.infoMask .el-button--danger {
  background-color: #d4282d;
}
.infoText {
  text-align: center;
  font-size: 16px;
  line-height: 16px;
  color: #020202;
  margin-top: 16px;
}
.infoText p {
  color: #999999;
  font-size: 12px;
  line-height: 12px;
  margin-top: 10px;
}
/* 极速提现弹窗样式 */
</style>
