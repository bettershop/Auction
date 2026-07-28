<template>
  <div id="app">
    <div class="afterSale_title">{{ $t('after_Sale.title') }}</div>

    <div class="afterSale_card_title">{{ $t('after_Sale.logn[0]') }}</div>

    <table v-if="!loadFlag" class="afterPro" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th style="position: relative">
            <el-checkbox
              v-if="type == 1"
              class="quanxuan"
              v-model="checkAll"
              @change="checkAllClick"
              >{{ $t('after_Sale.checkAll') }}</el-checkbox
            >
          </th>
          <th style="width: 450px">{{ $t('after_Sale.th[0]')}}</th>
          <th>{{ $t('after_Sale.th[1]') }}</th>
          <th>{{ $t('after_Sale.th[2]') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) of return_list" :key="index" v-if="item.refund==true">
          <td>
            <el-checkbox
              v-if="type == 1"
              v-model="checkArr[index]"
              @change="checkArrClick"
            ></el-checkbox>
          </td>
          <td>
            <div class="afterProDiv">
              <img :src="item.image" alt="" />
              <div>
                <p>{{ item.p_name }}</p>
                <span>{{ item.size }}</span>
              </div>
            </div>
          </td>
          <td>{{item.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(item.p_price,item.exchange_rate) }}</td>
          <td>x{{ item.num }}</td>
        </tr>
      </tbody>
    </table>

    <table v-else class="afterPro" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th style="position: relative">
            <el-checkbox v-if="type == 1" class="quanxuan">{{ $t('after_Sale.checkAll') }}</el-checkbox>
          </th>
          <th style="width: 450px">{{ $t('after_Sale.th[0]') }}</th>
          <th>{{ $t('after_Sale.th[1]') }}</th>
          <th>{{ $t('after_Sale.th[2]') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <el-checkbox v-if="type == 1"></el-checkbox>
          </td>
          <td>
            <div class="afterProDiv">
              <img class="nonavtitle" src="" alt="" />
              <div>
                <p class="nonavtitle" style="display: block; width: 200px"></p>
                <span class="nonavtitle"></span>
              </div>
            </div>
          </td>
          <td>
            <span class="nonavtitle"></span>
          </td>
          <td>
            <span class="nonavtitle"></span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="afterSale_card_title">{{ $t('after_Sale.logn[1]') }}</div>

    <div class="afterOperation">
      <div v-if="loadFlag">
        <img class="nonavtitle" src="" alt style="width: 58px; height: 58px" />
        <div>
          <p class="nonavtitle"></p>
          <span class="nonavtitle" style="display: block; width: 200px"></span>
        </div>
      </div>
      <div @click="toAfter(0)" v-if="refund && refundAmt">
        <img src="~/static/images/returnMoney.png" alt="来客推商城-退款" />
        <div>
          <p>{{ $t('after_Sale.logn[2]' )}}</p>
          <span>{{ $t('after_Sale.logn[3]') }}</span>
        </div>
      </div>
      <div @click="toAfter(1)" v-if="refund && refundGoodsAmt">
        <img src="~/static/images/returnPro.png" alt="来客推商城-退货退款" />
        <div>
          <p>{{ $t('after_Sale.logn[4]') }}</p>
          <span>{{ $t('after_Sale.logn[5]') }}</span>
        </div>
      </div>
      <div @click="toAfter(2)" v-if="refund && refundGoods">
        <img src="~/static/images/exchange.png" alt="来客推商城-换货" />
        <div>
          <p>{{ $t('after_Sale.logn[6]') }}</p>
          <span>{{ $t('after_Sale.logn[7]') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loadFlag: true,
      order_id: '',
      type: '',
      checkAll: '',
      checkArr: [],

      refund_only_status: false, // 退款
      return_refund_status: false, // 退货退款
      exchange_goods_status: false, // 换货
      return_list: [],

      refund: false,
      refundAmt: false,
      refundGoodsAmt: false,
      refundGoods: false
    }
  },
  mounted () {
    this.$emit('pageTitle', '我的订单')
    if (this.$route.query.order_id) {
        this.order_id = this.$route.query.order_id
    }
    if (this.$route.query.type) {
        this.type = this.$route.query.type
    }
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    checkArrClick (flag) {
      if (!flag) {
        this.checkAll = false
        return
      }

      if (!this.checkArr.includes(false)) {
        this.checkAll = true
      }
    },
    checkAllClick (flag) {
      let checkArr = []

      this.checkArr.filter(item => {
        checkArr.push(flag)
      })

      this.checkArr = checkArr
    },
    getApi () {
      let data = {
        api:'mall.Order.singleReturnGoodsPage',

        order_details_id: this.order_id // 订单详情id
      }

      if (this.type == 1) {
        data.api = 'mall.Order.batchReturnGoodsPage'
        // data.order_id = this.order_id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.refund = res.data.refund
          this.refundAmt = res.data.refundAmt
          this.refundGoodsAmt = res.data.refundGoodsAmt
          this.refundGoods = res.data.refundGoods

          this.loadFlag = false
          this.refund_only_status = res.data.refund_only_status
          this.return_refund_status = res.data.return_refund_status
          this.exchange_goods_status = res.data.exchange_goods_status

          if (
            res.data.orderType == 'KJ' ||
            res.data.orderType == 'JP' ||
            res.data.orderType == 'MS' ||
            res.data.orderType == 'FX' ||
            res.data.orderType == 'integral'
          ) {
            this.refund_only_status = false // 退款
            this.return_refund_status = false // 退货退款
          }

          res.data.list &&
            res.data.list.filter(item => {
              this.checkArr.push(false)
            })

          this.return_list = res.data.list
        })
        .catch(error => {
          setTimeout(function () {
            window.history.go(-1)
          }, 1000)
          this.$message.error(error.message)
        })
    },
    toAfter (type) {
      var id = ''

      if (this.type == 1) {
        this.checkArr.filter((item, index) => {
          if (item) {
            id += ',' + this.return_list[index].id
          }
        })
      } else {
        this.return_list.filter(item => {
          id += ',' + item.id
        })
      }

      id = id.replace(',', '')

      if (!id) {
        this.$message.error(this.$t('after_Sale.Tips'))
        return
      }
      this.$router.push({path:'/my/my/afterDetails',query:{type:type,id:id}})
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/afterSale.css';
</style>
