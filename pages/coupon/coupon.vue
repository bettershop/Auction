<template>
  <div id="app" v-cloak>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{ $t('coupon.title') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('coupon.title2') }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="new-nav">
      <div @click="_chooseNav(1)">
        <div :class="{newAavActive: chooseNav == 1}">平台</div>
        <!-- <img :src="nav" alt="" /> -->
      </div>
      <div @click="_chooseNav(2)">
        <div :class="{newAavActive: chooseNav == 2}">店铺</div>
        <!-- <img :src="nav" alt="" /> -->
      </div>
    </div>
    <div class="new-search" v-if="chooseNav == 2">
      <el-input class="new-search-input" :placeholder="$t('请输入店铺名称')" v-model="mchName" size="mini">
        <el-button slot="append" @click="searchOrder">{{
          $t('myorder.search')
        }}</el-button>
      </el-input>
    </div>

    <div class="list" v-if="!loadFlag">
      <div v-for="(item, index) of coupon_list" :key="index" :class="{ is_lq: item.point_type == 2 || item.point_type == 4 , is_qg: item.point_type == 3 }">
        <img class="couponrbg" :src="couponrbg1" alt="" v-if="item.activity_type == 1" />
        <img class="couponrbg" :src="couponrbg2" alt="" v-if="item.activity_type == 2" />
        <img class="couponrbg" :src="couponrbg3" alt="" v-if="item.activity_type == 3" />

        <div class="list_left">
          <img :src="item.cover_map || coupon_my" alt="" />
          <div>
            <img style="width: 29px;height: 20px;" :src="couponrbg1s" alt="" v-if="item.activity_type == 1" />
            <img style="width: 49px;height: 20px;" :src="couponrbg2s" alt="" v-if="item.activity_type == 2" />
            <img style="width: 45px;height: 20px;" :src="couponrbg3s" alt="" v-if="item.activity_type == 3" />
            <p class="list_left_center">{{ item.name }}</p>
            <!-- <div class="list_left_bottom" v-if="item.point_type != 3 && item.issue_number_type == 2">
              {{ $t('coupon.Tips[2]') }}{{ item.percentage_yq }}%
              <el-progress
                :stroke-width="10"
                :percentage="item.percentage_yq"
                :color="customColor"
                :format="format"
              ></el-progress>
            </div>
            <div class="list_left_bottom" v-if="item.point_type == 3 && item.issue_number_type == 2">
              {{ $t('coupon.Tips[1]') }}
            </div> -->
          </div>
        </div>
        <div class="list_right">
          <template v-if="item.activity_type">
            <!-- 免运费 -->
            <div class="myf" v-if="item.activity_type == 1">
              <span>{{ $t('mycoupon.Tips[0]') }}</span>
            </div>
            <!-- 满减 -->
            <div class="mj" v-if="item.activity_type == 2">
              减<span>{{ item.money }}</span>
            </div>
            <!-- 折扣 -->
            <div class="zk" v-if="item.activity_type == 3">
              <span>{{ item.discount }}</span>
              {{ $t('mycoupon.Tips[1]') }}
            </div>
          </template>
          <!-- 要求 -->
          <div class="yaoqiu">{{item.limit}}</div>
          <!-- 按钮 -->
          <div class="aniu" :class="{cor1:item.activity_type == 1,cor2:item.activity_type == 2,cor3:item.activity_type == 3}" v-if="item.point" @click="pointBtn(item)">{{ item.point }}</div>
          <img v-if="item.point_type == 2 || item.point_type == 3 || item.point_type == 4" class="couponStatus" :src="item.point_type == 2 ? islq : item.point_type == 3 ? isqg : item.point_type == 4 ? islq : ''" alt="" />
        </div>
      </div>

      <div class="no_good" v-if="total === 0">
        <img :src="no_good" alt="" />
        <p>{{ $t('mycoupon.Tips[3]') }}</p>
      </div>
    </div>

    <div class="list" v-else>
      <div>
        <img class="couponrbg" :src="couponrbg" alt="" />

        <div class="list_left">
          <img class="nonavtitle" src="" alt="" style="width: 108px" />

          <div>
            <div class="list_left_top nonavtitle" style="width: 160px; height: 26px"></div>

            <p class="list_left_center nonavtitle" style="width: 126px"></p>

            <div class="list_left_bottom nonavtitle" style="width: 200px"></div>
          </div>
        </div>
        <div class="list_right">
          <div class="nonavtitle"></div>
        </div>
      </div>
    </div>

    <div v-if="total > 0" class="paginationBox" style="padding: 60px 0; justify-content: center">
      <el-pagination :page-size="10" :current-page.sync="page" @current-change="currentChange" background layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'homeLayout',
  async asyncData({ app, $Api }) {
    let pc_user = app.$cookies.get('pc_user')
    var data = {
      api: 'plugin.coupon.MallCoupon.index',
      access_id: pc_user ? pc_user.access_id : '',
      page: 1,
      type: 1,
    }
    let res = await $Api.doRequest(data)
    res.data.list &&
      res.data.list.filter(item => {
        item.percentage = parseInt(
          (Number(item.num) / Number(item.circulation)) * 100
        )

        item.percentage_yq = parseInt(
          ((Number(item.circulation) - Number(item.num)) /
            Number(item.circulation)) *
          100
        )
      })
    return {
      pc_user,
      coupon_list: res.data.list,
      total: Number(res.data.total),
      loadFlag: false
    }
  },

  data() {
    return {
      pc_user: {},
      no_good: require('/static/images/no_good.png'),
      couponrbg: require('/static/images/couponrbg.png'),
      nav: require('/static/images/nav.png'),
      couponrbg1: require('/static/images/couponrbg1.png'),
      couponrbg2: require('/static/images/couponrbg2.png'),
      couponrbg3: require('/static/images/couponrbg3.png'),
      couponrbg1s: require('/static/images/couponrbg1s.png'),
      couponrbg2s: require('/static/images/couponrbg2s.png'),
      couponrbg3s: require('/static/images/couponrbg3s.png'),
      coupon_zk: require('/static/images/coupon_zk.png'),
      coupon_mj: require('/static/images/coupon_mj.png'),
      coupon_my: require('/static/images/coupon_my.png'),
      islq: require('/static/images/islq.png'),
      isqg: require('/static/images/isqg.png'),
      percentage: 20,
      customColor: '#FFE5E5',
      chooseNav: 1,
      mchName: '',//
      coupon_list: [],
      loadFlag: true,
      page: 1,
      total: 0
    }
  },
  mounted() {
    this.pc_user = this.$cookies.get('pc_user') || {}
    console.log('coupon_list', this.coupon_list);

    // this.getApi()
  },
  methods: {
    _chooseNav(val) {
      this.chooseNav = val
      this.getApi()
    },
    searchOrder() {
      this.getApi()
    },
    currentChange(e) {
      this.page = e
      this.getApi()
    },
    toUp() {
      ; (function smoothscroll() {
        var currentScroll =
          document.documentElement.scrollTop || document.body.scrollTop
        if (currentScroll > 0) {
          window.requestAnimationFrame(smoothscroll)
          window.scrollTo(0, currentScroll - currentScroll / 2)
        }
      })()
    },
    pointBtn(item) {
      if (item.point_type == 1) {
        var data = {
          api: 'plugin.coupon.MallCoupon.receive',

          id: item.id // 活动id
        }

        this.$Api
          .doRequest(data)
          .then(res => {
            console.log('res', res);

            if (res.code == '200') {
              this.$message.success(this.$t('coupon.Tips[4]'))
              this.getApi()
            }
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      } else if (item.point_type == 2) {
        if (item.mch_id == '0') {
          this.$router.push({ path: '/' })
        } else {
          this.$router.push({ path: '/mch/mch', query: { id: item.mch_id } })
        }
      }
    },
    format(percentage) {
      return ''
    },
    getApi() {
      var data = {
        api: 'plugin.coupon.MallCoupon.index',

        page: this.page,
        type: this.chooseNav,
      }
      if (this.chooseNav == 2 && this.mchName != '') {
        data.mchName = this.mchName
      }
      this.$Api.doRequest(data)
        .then(res => {
          res.data.list &&
            res.data.list.filter(item => {
              item.percentage = parseInt(
                (Number(item.num) / Number(item.circulation)) * 100
              )

              item.percentage_yq = parseInt(
                ((Number(item.circulation) - Number(item.num)) /
                  Number(item.circulation)) *
                100
              )
            })

          this.coupon_list = res.data.list
          this.total = Number(res.data.total)

          this.loadFlag = false
        })
        .catch(error => {
        })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/coupon/coupon.css';
</style>
