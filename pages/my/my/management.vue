<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="售后管理" />
    <!-- 我的订单tabs -->
    <ul class="tabs">
      <div class="tabs_title">{{ $t('afterSale.title') }}</div>
      <el-input
        :placeholder="$t('afterSale.placeholder[4]')"
        v-model="ordervalue"
        size="mini"
      >
        <el-button slot="append" @click="searchOrder">{{
          $t('afterSale.search')
        }}</el-button>
      </el-input>
    </ul>
    <!-- 我的订单tabs end -->
    <div>
      <!-- 订单状态栏 -->
      <div class="select-head" v-if="loadFlag || order_list.length > 0">
        <el-row>
          <el-col :span="10" style="width: 337px">
            <div class="grid-content">
              {{ $t('afterSale.Commodity_information') }}
            </div>
          </el-col>
          <el-col :span="3" style="width: 101px">
            <div class="grid-content">{{ $t('afterSale.refund')}}</div>
          </el-col>
          <el-col :span="2" style="width: 101px">
            <div class="grid-content">
              {{ $t('afterSale.Application_time') }}
            </div>
          </el-col>
          <el-col :span="3" style="width: 125px">
            <div class="grid-content">
              {{ $t('afterSale.Service_type') }}
            </div>
          </el-col>
          <el-col :span="3" style="width: 125px">
            <div class="grid-content">{{ $t('afterSale.After_state') }}</div>
          </el-col>
          <el-col :span="3" style="width: 150px">
            <div class="grid-content">{{ $t('afterSale.action') }}</div>
          </el-col>
        </el-row>
      </div>
      <!-- 订单状态栏 end -->

      <!-- 订单信息 -->
      <div v-if="loadFlag" class="order">
        <!-- 店铺名称 -->
        <div
          class="store-title"
          style="display: flex; align-items: center; height: 40px"
        >
          <span class="sp1 nonavtitle" style="height: 18px"></span>
          <span class="nonavtitle" style="width: 200px; height: 18px"></span>
          <span class="nonavtitle" style="width: 170px; height: 18px"></span>
        </div>
        <!-- 订单店铺商品 -->
        <div class="store-cart-goods" style="position: relative">
          <el-table
            :data="loadData"
            :span-method="objectSpanMethod"
            border
            :show-header="false"
            style="width: 100%"
          >
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
              <el-button
                size="small"
                class="nonavtitle"
                style="width: 80px"
              ></el-button>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template v-else-if="order_list.length > 0">
        <div class="order" v-for="(items, indexs) of order_list" :key="indexs">
          <!-- 店铺名称 -->
          <div class="store-title">
            <span class="sp1"
              >{{ $t('afterSale.shop') }}{{ items.shop_name }}</span
            >
            <span>{{ $t('afterSale.order_number') }}{{ items.sNo }}</span>
          </div>
          <!-- 订单店铺商品 -->
          <div class="store-cart-goods" style="position: relative">
            <el-table
              :data="items.list"
              :span-method="objectSpanMethod"
              border
              :show-header="false"
              style="width: 100%"
            >
              <el-table-column width="337">
                <template slot-scope="scope">
                  <div class="grid-content1 goodDetail">
                    <el-image
                      class="good-img"
                      :src="scope.row.imgurl"
                      :preview-src-list="[scope.row.imgurl]"
                    >
                    </el-image>
                    <div class="detail">
                      <p>{{ scope.row.p_name }}</p>
                      <span>{{ scope.row.size }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column width="101">
                <template slot-scope="scope">
                  <span class="price"> {{scope.row.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(scope.row.re_apply_money,scope.row.exchange_rate) }} </span>
                </template>
              </el-table-column>
              <el-table-column width="101">
                <template slot-scope="scope">
                  <span class="num">{{ scope.row.re_time }}</span>
                </template>
              </el-table-column>
              <el-table-column width="125">
                <template slot-scope="scope">
                  <p>
                    {{
                      items.list[0].re_type == 1
                        ? $t('afterSale.type[0]')
                        : items.list[0].re_type == 2
                        ? $t('afterSale.type[1]')
                        : $t('afterSale.type[2]')
                    }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column width="125">
                <div class="order-condition">
                  <span
                    style="white-space: nowrap"
                    v-if="items.list[0].re_type != 2"
                  >
                    <!-- re_type:{{items.list[0].re_type}}
									r_type:{{items.list[0].r_type}} -->
                    <template v-if="items.list[0].re_type == 1">
                      {{
                        items.list[0].r_type == 0
                          ?  $t('afterSale.type[3]')
                          : items.list[0].r_type == 1
                          ?  $t('afterSale.type[4]')
                          : items.list[0].r_type == 2
                          ?  $t('afterSale.type[5]')
                          : items.list[0].r_type == 3
                          ?  $t('afterSale.type[6]')
                          : items.list[0].r_type == 4
                          ?  $t('afterSale.type[7]')
                          : items.list[0].r_type == 5
                          ?  $t('afterSale.type[5]')
                          : items.list[0].r_type == 8
                          ?  $t('afterSale.type[5]')
                          : items.list[0].r_type == 9
                          ?  $t('afterSale.type[7]')
                          : items.list[0].r_type == 10
                          ?  $t('afterSale.type[5]')
                          : items.list[0].r_type == 11
                          ?  $t('afterSale.type[7]')
                          :  $t('afterSale.type[8]')
                      }}
                    </template>
                    <template v-else-if="items.list[0].re_type == 3">
                      {{
                        items.list[0].r_type == 0
                          ?  $t('afterSale.type[9]')
                          : items.list[0].r_type == 1
                          ?  $t('afterSale.type[4]')
                          : items.list[0].r_type == 2
                          ?  $t('afterSale.type[10]')
                          : items.list[0].r_type == 3
                          ?  $t('afterSale.type[6]')
                          : items.list[0].r_type == 4
                          ?  $t('afterSale.type[11]')
                          : items.list[0].r_type == 5
                          ?  $t('afterSale.type[10]')
                          : items.list[0].r_type == 8
                          ?  $t('afterSale.type[10]')
                          : items.list[0].r_type == 9
                          ?  $t('afterSale.type[11]')
                          : items.list[0].r_type == 10
                          ?  $t('afterSale.type[10]')
                          : items.list[0].r_type == 11
                          ?  $t('afterSale.type[11]')
                          :  $t('afterSale.type[12]')
                      }}
                    </template>
                    <template v-else>
                      {{
                        items.list[0].r_type == 0
                          ?  $t('afterSale.type[13]')
                          : items.list[0].r_type == 1
                          ?  $t('afterSale.type[14]')
                          : items.list[0].r_type == 2
                          ?  $t('afterSale.type[15]')
                          : items.list[0].r_type == 3
                          ?  $t('afterSale.type[6]')
                          : items.list[0].r_type == 4
                          ?  $t('afterSale.type[11]')
                          : items.list[0].r_type == 5
                          ?  $t('afterSale.type[15]')
                          : items.list[0].r_type == 8
                          ?  $t('afterSale.type[15]')
                          : items.list[0].r_type == 9
                          ?  $t('afterSale.type[11]')
                          : items.list[0].r_type == 10
                          ?  $t('afterSale.type[15]')
                          : items.list[0].r_type == 11
                          ?  $t('afterSale.type[11]')
                          :  $t('afterSale.type[8]')
                      }}
                    </template>
                  </span>
                  <span
                    style="white-space: nowrap"
                    v-else
                    :title="
                      items.list[0].r_type == 0
                        ? $t('afterSale.type[3]')
                        : items.list[0].r_type == 8
                        ? $t('afterSale.type[5]')
                        : items.list[0].r_type == 9
                        ? $t('afterSale.type[7]')
                        : $t('afterSale.type[8]')
                    "
                  >
                    {{
                      items.list[0].r_type == 0
                        ? $t('afterSale.type[3]')
                        : items.list[0].r_type == 8
                        ? $t('afterSale.type[5]')
                        : items.list[0].r_type == 9
                        ? $t('afterSale.type[7]')
                        : $t('afterSale.type[8]')
                    }}
                  </span>
                </div>
              </el-table-column>
              <el-table-column>
                <el-button
                  v-if="
                    items.list[0].r_type == 1 ||
                    (items.list[0].r_type == 9 && items.list[0].re_type != 2)
                  "
                  size="small"
                  type="danger"
                  @click="getKuaidi(items)"
                  style="margin-bottom: 10px"
                  >{{ $t('afterSale.button[0]') }}</el-button
                >
                <el-button
                  v-if="items.list[0].r_type == 11"
                  size="small"
                  type="danger"
                  @click="shouhuo(items)"
                  style="margin-bottom: 10px"
                  >{{ $t('afterSale.button[1]') }}</el-button
                >

                <el-button
                  size="small"
                  @click="toReturn(items)"
                  style="margin-left: 0"
                  >{{ $t('afterSale.button[2]') }}</el-button
                >
                <el-button
                  size="small"
                  v-if="items.list[0].r_type == 0"
                  @click="Cancellation_of_application(items)"
                  style="margin-left: 0; margin-top: 5px"
                  >{{ $t('afterSale.button[3]') }}</el-button
                >
                <el-button
                  v-if="items.list[0].r_type == 3"
                  size="small"
                  @click="godetails(items)"
                  style="margin-left: 0; margin-top: 10px"
                  >{{ $t('afterSale.button[4]') }}</el-button
                >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
      <div v-else class="noOrder">
        <img :src="noOrder" alt="" />
        <p>{{ $t('afterSale.Tips[0]') }}~</p>
      </div>
    </div>
    <!-- 分页 -->
    <div class="block" v-if="order_num > 0">
      <el-pagination
        :current-page.sync="page"
        background
        layout="prev, pager, next"
        :total="order_num"
        @current-change="changePage"
      >
      </el-pagination>
    </div>

    <!-- 填写物流信息弹窗 -->
    <div class="mask" v-if="logisticsFlag" style="z-index: 2000">
      <div class="logistics">
        <div class="mask_title">
          {{ $t('afterSale.Popup[0]') }}
          <i class="el-icon-close" @click="logisticsFlag = false"></i>
        </div>

        <ul class="logistics_content">
          <li>
            <div class="logistics_content_left">
              {{ $t('afterSale.Popup[1]') }}
            </div>

            <el-select
              class="flex1"
              v-model="kuaidiName"
              :placeholder="$t('afterSale.placeholder[0]')"
            >
              <el-option
                v-for="item in kuaidiOptions"
                :key="item.id"
                :label="item.kuaidi_name"
                :value="item.kuaidi_name"
              >
              </el-option>
            </el-select>
          </li>

          <li>
            <div class="logistics_content_left">
              {{ $t('afterSale.Popup[2]') }}
            </div>

            <el-input
              class="flex1"
              v-model="kuaidiNumber"
              :placeholder="$t('afterSale.placeholder[1]')"
            ></el-input>
          </li>

          <li>
            <div class="logistics_content_left">
              {{ $t('afterSale.Popup[3]') }}
            </div>

            <el-input
              class="flex1"
              v-model="contactName"
              :placeholder="$t('afterSale.placeholder[2]')"
            ></el-input>
          </li>

          <li>
            <div class="logistics_content_left">
              {{ $t('afterSale.Popup[4]') }}
            </div>

            <el-input
              class="flex1"
              maxlength="11"
              v-model="contactTel"
              :placeholder="$t('afterSale.placeholder[3]')"
            ></el-input>
          </li>
        </ul>

        <div class="mask_btnBox">
          <a href="javascript:;" @click="logisticsFlag = false">{{ $t('cancel')}}</a>
          <a href="javascript:;" @click="saveKuaidi">{{ $t('common_button[1]')}}</a>
        </div>
      </div>
    </div>
    <!-- 填写物流信息弹窗结束 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      input: '',
      tabIndex: 0,
      clear: require('/static/images/clear.jpg'),
      app_code: require('/static/images/app_code.png'),
      noOrder: require('/static/images/no_order.png'),

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

      timeI: '',

      logistics_list: [],

      /* 填写快递信息 */
      logisticsFlag: false,
      kuaidiOptions: [],
      kuaidiName: '',
      kuaidiNumber: '',
      contactName: '',
      contactTel: '',
      order_details_id: '',
      sale_id: ''
    }
  },
  mounted () {
    this.$emit('pageTitle', '售后管理')
    // 获取参数
    if (this.$route.query.type) {
      this.tabIndex = this.$route.query.type
    }
    if (this.$route.query.r_sNo) {
      this.ordervalue = this.$route.query.r_sNo
    }
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    shouhuo (items) {
      let data = {
        api:'mall.Order.exchangeReceipt',

        id: items.list[0].id //售后id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.getApi()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    saveKuaidi () {
      if (!this.kuaidiName) {
        this.$message.error(this.$t('afterSale.Tips[1]'))
        return
      }
      if (!this.kuaidiNumber) {
        this.$message.error(this.$t('afterSale.Tips[2]'))
        return
      }
      if (!this.contactName) {
        this.$message.error(this.$t('afterSale.Tips[3]'))
        return
      }
      if (!this.contactTel) {
        this.$message.error(this.$t('afterSale.Tips[4]'))
        return
      }

      if (this.contactTel.length < 11) {
        this.$message.error(this.$t('afterSale.Tips[5]'))
        return
      }

      let data = {
        api:'mall.Order.backSend',

        kdcode: this.kuaidiNumber, // 快递单号
        kdname: this.kuaidiName, // 快递名称
        lxdh: this.contactTel, // 寄件人电话
        lxr: this.contactName, // 寄件人
        id: this.sale_id // 订单详情id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.logisticsFlag = false
          this.getApi()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    getKuaidi (items) {
      console.log(items)
      this.sale_id = items.id
      this.order_details_id = items.list[0].id

      let data = {
        api:'mall.Order.getExpress',

        pid: items.list[0].pid // 商品ID
      }

      this.$Api.doRequest(data).then(res => {
        this.kuaidiOptions = res.data.express
        console.log('kuaidiOptions', this.kuaidiOptions)

        this.logisticsFlag = true
      })
    },
    searchOrder () {
      this.page = 1
      this.tabIndex = 0
      this.getApi()
    },
    orderBtn (order_id, m) {
      var data = {

        module: 'app_pc',
        action: 'order',
        m,
        order_id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(res.message)

          this.getApi()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    changePage (page) {
      clearTimeout(this.timeI)

      this.page = page

      this.loadFlag = true

      this.getApi()
    },
    getApi () {
      var data = {
        // module: 'app_pc',
        // action: 'order',
        // m: 'ReturnDataList',
        api:'mall.Order.returnDataList',
        order:'JP',
        ordervalue: this.ordervalue, // 商品名称/订单号
        end: 10,
        start: this.page // 次数
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false

          res.data.list &&
            res.data.list.filter(item => {
              item.list = [item]
            })
          this.order_list = res.data.list
          this.order_num = Number(res.data.total)
        })
        .catch(error => {
          this.loadFlag = false

          this.$message.error(error.message)
        })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
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
    godetails (items) {
      this.$router.push({
        path: '/my/my/orderDetails',
        query: { order_id: items.order_id }
      })
    },
    Cancellation_of_application (items) {
      var id = items.list[0].id
      var data = {
        api:'mall.Order.cancellationOfApplication',

        id: id // id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false
          if (res.code == 200) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
          this.getApi()
        })
        .catch(error => {
          this.loadFlag = false
          this.$message.error(error.message)
        })
    },
    toReturn (items) {
      this.$router.push({
        path: '/my/my/afterDetails',
        query: {
          id: items.list[0].detailId,
          goodsId: items.goodsId,
          wlid: items.id,
          shid:items.list[0].id,
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/management.css';
</style>
