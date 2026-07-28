<template>
  <div id="app1">
    <!-- 右侧上部用户信息 -->
    <div class="user-part">
      <div class="user-info">
        <el-image v-if="!loadFlag" class="avatar" :src="user.headimgurl" :preview-src-list="[user.headimgurl]">
        </el-image>
        <img v-else class="avatar nonavtitle" src="" alt="" />
        <div>
          <div class="pay_two">
            <div v-if="!loadFlag" class="user-name">{{ user.user_name }}</div>
            <div v-if="
                pluginStatus.isVip == false && pluginStatus.memberPlugin == true
              ">
              <img class="pay_one" src="~/static/home-img/huise.png" />
            </div>
            <div v-if="
                pluginStatus.isVip == true && pluginStatus.memberPlugin == true
              ">
              <img class="pay_one" src="~/static/home-img/huiyuan.png" />
            </div>
          </div>
          <!-- <p v-else class="user-name nonavtitle" style="display: block;"></p> -->
          <el-button icon="el-icon-edit" size="small" round @click="toUrl('/my/my/myinfor')">{{ $t('myLoad.title') }}</el-button>
        </div>
      </div>
      <div class="user-operation">
<!--        <div>
          <span v-if="!loadFlag" class="sp red">{{ user.coupon_num }}</span>
          <span v-else class="sp red nonavtitle"></span>
          <p>{{ $t('myLoad.tab[0]') }}</p>
          <el-button size="small" round style="color: #4184e8" @click="toUrl('/coupon/coupon')">{{ $t('myLoad.tab[1]') }}</el-button>
        </div>-->
        <div>
          <span v-if="!loadFlag" class="sp">{{ user.money }}</span>
          <span v-else class="sp nonavtitle"></span>
          <p>{{ $t('myLoad.tab[2]') }}</p>
          <el-button size="small" round style="color: #4184e8" @click="toUrl('/my/my/recharge')">{{ $t('myLoad.tab[3]') }}</el-button>
        </div>
        <div>
          <span v-if="!loadFlag" class="sp">{{ user.score }}</span>
          <span v-else class="sp nonavtitle"></span>
          <p>{{ $t('myLoad.tab[4]') }}</p>
          <div style="width: 10px;height: 32px;"></div>
          <!-- <el-button
            size="small"
            round
            style="color: #4184e8"
            @click="toUrl('/my/my/myintegral')"
            >{{ $t('myLoad.tab[5]') }}</el-button
          > -->
        </div>
      </div>
    </div>
    <div v-if="pluginStatus.memberPlugin == true" class="kvip" @click="toUrl('/my/my/memberCenter')">
      <img class="kvip_img" src="~/static//images/kvip.png" />
    </div>
    <!-- 右侧下部订单信息 -->
    <div class="order-part">
      <div class="order-title">
        <p>{{ $t('myLoad.myorder[0]') }}</p>
        <a href="javascript:;" @click="toUrl('/my/my/myOrder')">
          <div style="display: flex; align-items: center">
            <span>{{ $t('myLoad.myorder[1]') }}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </a>
      </div>
      <div class="order-icons">
        <div class="order-icon" @click="toOrder('/my/my/myOrder', '1')">
          <el-badge :hidden="dfk_num == 0" :value="dfk_num" class="item" type="danger">
            <img class="dd_icon" :src="dfk" alt="" />
            <img class="dd_icon_h" :src="dfk_h" alt="" />
          </el-badge>
          <p>{{ $t('myLoad.myorder[2]') }}</p>
        </div>
        <div class="order-icon" @click="toOrder('/my/my/myOrder', '2')">
          <el-badge :hidden="dfh_num == 0" :value="dfh_num" class="item" type="danger">
            <img class="dd_icon" :src="dfh" alt="" />
            <img class="dd_icon_h" :src="dfh_h" alt="" />
          </el-badge>
          <p>{{ $t('myLoad.myorder[3]') }}</p>
        </div>
        <div class="order-icon" @click="toOrder('/my/my/myOrder', '3')">
          <el-badge :hidden="dsh_num == 0" :value="dsh_num" class="item" type="danger">
            <img class="dd_icon" :src="dsh" alt="" />
            <img class="dd_icon_h" :src="dsh_h" alt="" />
          </el-badge>
          <p>{{ $t('myLoad.myorder[4]') }}</p>
        </div>
        <div class="order-icon" @click="toOrder('/my/my/myOrder', '4')">
          <el-badge :hidden="dpj_num == 0" :value="dpj_num" class="item" type="danger">
            <img class="dd_icon" :src="dpj" alt="" />
            <img class="dd_icon_h" :src="dpj_h" alt="" />
          </el-badge>
          <p>{{ $t('myLoad.myorder[5]') }}</p>
        </div>
        <div class="order-icon" @click="toUrl('/my/my/management')">
          <el-badge :hidden="th_num == 0" :value="th_num" class="item" type="danger">
            <img class="dd_icon" :src="shtk" alt="" />
            <img class="dd_icon_h" :src="shtk_h" alt="" />
          </el-badge>
          <p>{{ $t('myLoad.myorder[6]') }}</p>
        </div>
        <div class="order-icon" @click="toUrl('/my/my/myOrder')">
          <el-badge class="item" type="danger">
            <img class="dd_icon" :src="qbdd" alt="" />
            <img class="dd_icon_h" :src="qbdd_h" alt="" />
          </el-badge>
          <p>{{ $t('myLoad.myorder[7]') }}</p>
        </div>
      </div>

      <template v-if="!loadFlag">
        <div class="order-details" v-if="order_list.length != 0">
          <div class="order-info" v-for="(item, index) of order_list" :key="index">
            <el-image class="good-img" :src="item.img" :preview-src-list="[item.img]">
            </el-image>
            <div class="d1">
              <template v-if="item.status == 0">
                <p>{{ $t('myLoad.long[0]') }}</p>
                <span class="sp1">{{item.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(item.z_price,item.exchange_rate) }}</span>
              </template>

              <template v-else>
                <p v-if="item.status == 1">{{ $t('myLoad.long[1]') }}</p>
                <p v-else>
                  {{ $t('myLoad.long[2]')
                  }}{{
                    item.status == 2
                      ? $t('myLoad.long[3]')
                      : item.status == 3
                      ? $t('myLoad.long[4]')
                      : item.status == 4
                      ? $t('myLoad.long[5]')
                      : item.status == 5
                      ? $t('myLoad.long[6]')
                      : item.status == 6
                      ? $t('myLoad.long[7]')
                      : item.status == 7
                      ? $t('myLoad.long[8]')
                      : item.status == 8
                      ? $t('myLoad.long[9]')
                      : item.status == 12
                      ? $t('myLoad.long[10]')
                      : ''
                  }}
                </p>
                <span class="sp2">{{ item.add_time }}</span>
              </template>
            </div>
            <div class="d2">
              <el-button size="small" @click="toDetails('/my/my/orderDetails', item.id)">{{ $t('myLoad.button[0]') }}</el-button>
              <el-button size="small" v-if="item.status == 2 || item.status == 3 || item.status == 5" @click="toDetails('/my/my/orderDetails', item.id)">{{ $t('myLoad.button[1]') }}</el-button>
              <el-button type="danger" size="small" v-if="item.status == 0" @click="toDetails('/my/my/payment', item.id)">{{
                $t('myLoad.button[2]')
              }}</el-button>
              <el-button type="danger" size="small" :disabled="item.delivery_status == 1" v-else-if="item.status == 1" @click="orderBtn(item.id, 'mall.Order.delivery')">{{ $t('myLoad.button[3]') }}</el-button>
              <!-- 确认收货 -->
              <el-button type="danger" size="small" v-else-if="item.self_lifting != 1 && item.status == 2 && item.sale_type == 0" @click="orderBtn(item.id, 'mall.Order.okOrder')">{{ $t('myLoad.button[4]') }}</el-button>
              <el-button type="danger" size="small" v-else-if="item.status == 3" @click="toEvaluation('/my/my/evaluationing', item.sNo, '0')">{{ $t('myLoad.button[5]') }}</el-button>
              <el-button type="danger" size="small" v-else-if="item.status == 8" @click="toEvaluation('/my/my/evaluationing', item.sNo, '5')">{{ $t('myLoad.button[6]') }}</el-button>
            </div>
          </div>
        </div>
        <!-- 空状态 -->
        <div class="my-no-order" v-else>
          <img src="~/static/images/empty_cart.png" alt="" />
          <p>
            {{ $t('myLoad.long[11]') }}
            <br />
            {{ $t('myLoad.long[12]') }}~
          </p>
        </div>
      </template>
      <!-- 骨架屏 -->
      <div class="order-details" v-else>
        <div class="order-info">
          <img class="nonavtitle" src="" alt="" />
          <div class="d1">
            <p class="nonavtitle" style="display: block; width: 150px"></p>
            <span class="sp1 nonavtitle" style="width: 120px"></span>
          </div>
          <div class="d2">
            <el-button class="nonavtitle" size="small" style="width: 100px"></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    // let pc_user = app.$cookies.get('pc_user')
    // return {
    //   pc_user
    // }
  },
  data() {
    return {
      pluginStatus: {},
      avatar:
        'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      shtk: require('/static/images/shtk.png'),
      shtk_h: require('/static/images/shtk_h.png'),
      dfh: require('/static/images/dfh.png'),
      dfh_h: require('/static/images/dfh_h.png'),
      dfk: require('/static/images/dfk.png'),
      dfk_h: require('/static/images/dfk_h.png'),
      dpj: require('/static/images/dpj.png'),
      dpj_h: require('/static/images/dpj_h.png'),
      dsh: require('/static/images/dsh.png'),
      dsh_h: require('/static/images/dsh_h.png'),
      qbdd: require('/static/images/qbdd.png'),
      qbdd_h: require('/static/images/qbdd_h.png'),

      dfk_num: '',
      dfh_num: '',
      dsh_num: '',
      dpj_num: '',
      th_num: '',
      user: {},
      order_list: [],
      loadFlag: true
    }
  },
  mounted() {
    this.pc_user = this.$cookies.get('pc_user')
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    this.getApi()
  },
  methods: {
    getApi() {
      var data = {
        // module: 'app_pc',
        // action: 'user',
        // m: 'index',
        api: 'mall.User.index',
        isAuction:1,
        access_id: this.pc_user.access_id
      }

      this.$Api.doRequest(data).then(res => {
        this.loadFlag = false
        this.dfk_num = res.data.dfk_num
        this.dfh_num = res.data.dfh_num
        this.dsh_num = res.data.dsh_num
        this.dpj_num = res.data.dpj_num
        this.th_num = res.data.th
        this.user = res.data.user
        this.order_list = res.data.order_list
      })
    },
    toUrl(url) {
      this.$router.push({
        path: url
      })
    },
    toOrder(url, type) {
      this.$router.push({
        path: url,
        query: { type: type }
      })
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
    orderBtn(order_id, m) {
      var data = {

        api: m,
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
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/my.css';
</style>
