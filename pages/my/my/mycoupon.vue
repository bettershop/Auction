<template>
  <div class="order-part" id="app" style="height: auto">
    <input type="hidden" name="pageTitle" value="优惠券" />
    <div class="my-title">
      <p>{{ $t('mycoupon.title') }}</p>

      <div v-if="pluginStatus && pluginStatus.couponPlugin == true" @click="toUrl('/coupon/coupon')">
        {{ $t('mycoupon.title2') }}
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>

    <ul class="tabBox">
      <li :class="{ active: tabIndex == 0 }" @click="tabIndex = 0">
        {{ $t('mycoupon.tab[0]') }}({{ wsy_num }})
      </li>
      <li :class="{ active: tabIndex == 1 }" @click="tabIndex = 1">
        {{ $t('mycoupon.tab[1]') }}({{ ysy_num }})
      </li>
      <li :class="{ active: tabIndex == 2 }" @click="tabIndex = 2">
        {{ $t('mycoupon.tab[2]') }}({{ ygq_num }})
      </li>
    </ul>

    <template v-if="!loadFlag">
      <div class="couponlist" v-if="coupon_list.length > 0">
        <template v-for="(item, index) of coupon_list">
          <div v-if="index < page * 10 && index >= (page - 1) * 10" :class="{ huiA: tabIndex != 0 }" :key="index">
            <img :src="yhqbg" alt="" />

            <img v-if="tabIndex == 1" class="couponStatus" :src="isuse" alt="" />
            <img v-else-if="tabIndex == 2" class="couponStatus" :src="isdate" alt="" />

            <div class="couponlist_left">
              <div v-if="item.activity_type == 1">
                <span>{{ $t('mycoupon.Tips[0]') }}</span>
              </div>
              <div v-if="item.activity_type == 2">
                {{$LaiKeCommObject.show_symbol}}
                <span>{{ $LaiKeCommObject.formatPrice(item.money) }}</span>
              </div>
              <div v-if="item.activity_type == 3">
                <span>{{ item.discount }}</span>
                {{ $t('mycoupon.Tips[1]') }}
              </div>
              <div v-if="item.activity_type == 4">
                <template v-if="item.money == 0">
                  <span>{{ item.discount }}</span>
                  {{ $t('mycoupon.Tips[1]') }}
                </template>
                <template v-else>
                  {{$LaiKeCommObject.show_symbol}}
                  <span>{{ $LaiKeCommObject.formatPrice(item.money) }}</span>
                </template>
              </div>
              <div v-if="item.activity_type == 5">
                <img :src="item.imgurl" style="width: 60px; height: 60px" />
              </div>

              <span>{{ item.limit }}</span>
            </div>
            <div class="couponlist_right" style="align-items: flex-start">
              <p style="height: 40px">
                【{{
                  item.activity_type == 1
                    ? $t('mycoupon.vouchers[0]')
                    : item.activity_type == 2
                    ? $t('mycoupon.vouchers[1]')
                    : item.activity_type == 3
                    ? $t('mycoupon.vouchers[2]')
                    : item.activity_type == 4
                    ? $t('mycoupon.vouchers[3]')
                    : item.activity_type == 5
                    ? $t('mycoupon.vouchers[4]')
                    : ''
                }}】{{ item.name ? item.name : item.product_title }}
              </p>

              <div>
                <!-- <span>{{item.add_time&&item.add_time.replace(/-/g,'.')}}{{item.add_time?'-':''}}{{item.expiry_time.replace(/-/g,'.')}}{{item.add_time?'':{{ $t('mycoupon.Tips[2]') }}</span> -->
                <!-- <span>{{ dateFormat(item.add_time) }}{{item.expiry_time?'-':''}}{{ item.expiry_time ? dateFormat(item.expiry_time) : '' }}{{item.add_time?'':{{ $t('mycoupon.Tips[2]') }} }}</span> -->
                <span>{{ item.expirationDate }}</span>
                <div v-if="tabIndex == 0" @click="toUse(item)">
                  {{ $t('mycoupon.Immediate_use') }}
                </div>
                <div v-else style="border-color: transparent"></div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="paginationBox" v-if="coupon_list.length > 0" style="justify-content: center">
        <el-pagination :current-page.sync="page" :page-size="10" @current-change="changePage" background layout="prev, pager, next" :total="coupon_list.length">
        </el-pagination>
      </div>

      <div class="no_good" v-else>
        <img :src="no_good" alt="" />
        <p>
          {{ $t('mycoupon.Tips[3]')
          }}{{
            tabIndex == 0
              ? $t('mycoupon.tab[0]')
              : tabIndex == 1
              ? $t('mycoupon.tab[1]')
              : $t('mycoupon.tab[2]')
          }}{{ $t('mycoupon.Tips[4]') }}
        </p>
        <el-button v-if="pluginStatus && pluginStatus.couponPlugin == true" size="small" type="danger" @click="toUrl('/coupon/coupon')">{{ $t('mycoupon.Go') }}</el-button>
      </div>
    </template>

    <div class="couponlist" v-else>
      <div :class="{ huiA: tabIndex != 0 }">
        <img :src="yhqbg" alt="" />

        <img v-if="tabIndex == 1" class="couponStatus" :src="isuse" alt="" />
        <img v-else-if="tabIndex == 2" class="couponStatus" :src="isdate" alt="" />

        <div class="couponlist_left">
          <div>
            <span class="nonavtitle"></span>
          </div>

          <span class="nonavtitle"></span>
        </div>
        <div class="couponlist_right" style="align-items: flex-start">
          <p class="nonavtitle" style="width: 100%"></p>

          <div>
            <span class="nonavtitle" style="width: 150px"></span>
            <div v-if="tabIndex == 0" class="nonavtitle" style="border: 0"></div>
            <div v-else style="border-color: transparent"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: 0,
      tabIndex: 0,
      no_good: require('/static/images/no_good.png'),
      yhqbg: require('/static/images/yhqbg.png'),
      isuse: require('/static/images/isuse.png'),
      isdate: require('/static/images/isdate.png'),
      wsy_num: '',
      ysy_num: '',
      ygq_num: '',
      coupon_list: [],

      loadFlag: true,

      page: 1,
      pluginStatus: {}
    }
  },
  watch: {
    tabIndex(val) {
      this.loadFlag = true
      this.getApi()
    }
  },
  mounted() {
    this.$emit('pageTitle', '优惠券')
    this.pc_user = this.$cookies.get('pc_user')
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    // if(this.pluginStatus.couponPlugin == false){
    //   this.$router.push({ path: '/my/my/myLoad' })
    // }
    this.getApi()
  },
  methods: {
    dateFormat(val) {
      if (val === null || val === '') {
        return '暂无时间'
      }
      const d = new Date(val) // val 为表格内取到的后台时间
      const month =
        d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
      const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
      const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()
      const min = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
      const sec = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()
      const times = `${d.getFullYear()}-${month}-${day} ${hours}:${min}:${sec}`
      return times
    },
    changePage(e) {
      this.page = Number(e)
    },
    toUse(item) {
      if (item.mch_id == '0') {
        this.$router.push({ path: '/' })
      } else {
        this.$router.push({ path: '/mch/mch', query: { id: item.mch_id } })
      }
    },
    getApi() {
      var data = {
        api: 'plugin.coupon.MallCoupon.myCoupon',

        type: this.tabIndex
      }

      this.coupon_list = []

      this.$Api.doRequest(data)
        .then(res => {
          this.page = 1

          this.wsy_num = res.data.wsy_num
          this.ysy_num = res.data.ysy_num
          this.ygq_num = res.data.ygq_num

          this.coupon_list = res.data.list

          this.loadFlag = false
        })
        .catch(error => {
          this.$message.error(error.message)

          this.loadFlag = false
        })
    },
    toUrl(url) {
      this.$router.push({ path: url })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/mycoupon.css';
</style>
