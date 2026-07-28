<template>
  <div id="app">
    <div class="SecondsTop">
      <div class="SecondsTop_Left">
        <img
          src="~static/images/Seconds_icon.png"
          class="SecondsTop_Left_icon"
        />
        <img
          src="~static/images/Seconds2_icon.png"
          class="SecondsTop_Left_icon2"
        />
      </div>
      <div class="SecondsTop_Right">
        <h2>{{ text }}</h2>
        <div class="Hour">
          <span>{{ hour[0] }}</span>
          <span>{{ hour[1] }}</span>
        </div>
        <div class="Interval">:</div>
        <div class="Min">
          <span>{{ min[0] }}</span>
          <span>{{ min[1] }}</span>
        </div>
        <div class="Interval">:</div>
        <div class="Second">
          <span>{{ second[0] }}</span>
          <span>{{ second[1] }}</span>
        </div>
      </div>
    </div>
    <div class="List">
      <ul class="List_ul">
        <li
          v-for="(item, index) in time_list"
          :class="{ active: curror == index }"
          :key="index"
          @click="switch_time(item, index)"
        >
          <h2>{{ item.title }}</h2>
          <span v-if="item.type == 0">{{ $t('seconds.statusArr[0]') }}</span>
          <span v-else-if="item.type == 1">{{ $t('seconds.statusArr[1]') }}</span>
          <span v-else-if="item.type == 2">{{ $t('seconds.statusArr[2]') }}</span>
        </li>
      </ul>
      <div class="container">
        <div class="ListRight" v-for="(item, index) in list">
          <div class="ListRight_Left">
            <img :src="item.imgurl" />
            <div v-if="item.num == 0">{{ $t('seconds.statusArr[3]') }}</div>
            <div v-else-if="item.lefttime < 0">
                {{ $t('seconds.statusArr[0]') }}
            </div>
          </div>
          <div class="ListRight_Item">
            <p>{{ item.product_title }}</p>
            <div class="right-mch">
              <img :src="item.logo_img" />
              <span>{{ item.mch_name }}</span>
            </div>

            <div class="right-price">
              <div class="">
                <label>{{ $t('seconds.seckillPrice') }}</label>
                <font size="" color="">{{$LaiKeCommObject.show_symbol}}{{ item.seconds_price }}</font>
              </div>

              <del>{{$LaiKeCommObject.show_symbol}}{{ item.price }}</del>
            </div>

            <button type="button" class="Status_change" v-if="item.num == 0">
                {{ $t('seconds.statusArr[3]') }}
            </button>
            <button
              type="button"
              class="Status_change"
              v-else-if="item.lefttime < 0"
            >
            {{ $t('seconds.statusArr[0]') }}
            </button>
            <button
              type="button"
              class="Status_change"
              v-else-if="item.type == 2"
            >
            {{ $t('seconds.statusArr[2]') }}
            </button>
            <button type="button" @click="open_modal(item)" v-else>
              {{ $t('seconds.snapup') }}
            </button>
            <div
              class="right_success"
              :style="$t('cancel') == 'cancel' ? 'white-space: nowrap;' : ''"
            >
              <span>{{ $t('seconds.havaTips[0]') }}</span>
              <font
                :style="$t('cancel') == 'cancel' ? 'margin: 0 2px' : ''"
                >{{ item.max_num - item.num }}</font
              >
              <span>{{ $t('seconds.havaTips[1]') }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="No_data" v-if="list.length == 0">
        {{ $t('seconds.noSeckill') }}
      </div>
      <el-pagination
        v-if="list.length > 0"
        class="Pagination"
        @current-change="currentChange"
        background
        layout="prev, pager, next"
        :total="total"
      >
      </el-pagination>
      <el-dialog title="" width="40%" :visible.sync="outerVisible">
        <div class="modal">
          <div id="output"></div>
          <!-- <img src="./static/images/app_code.png"> -->
          <h2>{{ $t('seconds.scanCodeWX') }}</h2>
          <!-- <p>秒杀业务已全面迁移至APP</p> -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'homeLayout',
  async asyncData ({ app, $Api }) {
    let pc_user = app.$cookies.get('pc_user')
    return {
      pc_user
    }
  },
  data () {
    return {
      time_list: [],
      list: [],
      endtime: '',
      hour: '00',
      min: '00',
      second: '00',
      curror: '',
      id: '',
      text: '距离结束',
      page: 1,
      outerVisible: false,
      total: 1
    }
  },
  mounted () {
    this.text = this.$t('seconds.endArr[0]')
    this.getApi()
  },
  methods: {
    switch_time (item, index) {
      this.curror = index
      this.id = item.id
      this.endtime = item.endtime
      if (item.type == 1) {
        this.text = this.$t('seconds.endArr[0]')
      } else if (item.type == 2) {
        this.text = this.$t('seconds.endArr[1]')
      } else if (item.type == 0) {
        this.text = this.$t('seconds.endArr[2]')
        this.hour = '00'
        this.second = '00'
        this.min = '00'
      }
      this.getApi()
      console.log(item.type)
    },
    open_modal (item) {
      this.outerVisible = true

      if (document.getElementById('output') != null) {
        document.getElementById('output').innerHTML = ''
      }
      setTimeout(() => {
        var qrcode = new QRCode(document.getElementById('output'), {
          width: 146,
          height: 146
        })
        let url =
          LKT_ROOT_URL +
          '/H5/#/pagesB/seckill/seckill_detail?pro_id=' +
          item.pro_id +
          '&navType=' +
          item.type +
          '&id=' +
          item.id

        qrcode.makeCode(url)
      }, 100)
    },
    getApi () {
      let data = {
        module: 'app_pc',
        action: 'seckill',
        m: 'seckillhome',
        page: this.page,
        id: this.id
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.time_list = res.time_list
          this.list = res.list
          this.total = parseInt(res.count)
          for (var i in this.time_list) {
            if (this.time_list[i].type == 1 && this.id == '') {
              this.endtime = this.time_list[i].endtime
              this.curror = i
            }
          }
          this.countTime()
        }
      })
    },
    countTime () {
      // 获取当前时间
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let dates = date.getDate()
      let end_time2 = year + '-' + month + '-' + dates + ' ' + this.endtime
      let now = date.getTime()
      // 设置截止时间
      let endDate = new Date(end_time2) // this.curStartTime需要倒计时的日期
      let end = endDate.getTime()
      // 时间差
      let leftTime = end - now
      // 定义变量 d,h,m,s保存倒计时的时间
      let hours = ''
      let mins = ''
      let seconds = ''
      if (leftTime >= 0) {
        // 天
        // 时
        let h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
        this.hour = h < 10 ? '0' + h : h
        // 分
        let m = Math.floor((leftTime / 1000 / 60) % 60)
        this.min = m < 10 ? '0' + m : m
        // 秒
        let s = Math.floor((leftTime / 1000) % 60)
        this.second = s < 10 ? '0' + s : s
      } else {
        hour = '00'
        min = '00'
        second = '00'
      }
      this.hour = this.hour.toString()
      this.min = this.min.toString()
      this.second = this.second.toString()
      // 等于0的时候不调用
      if (
        Number(this.hour) === 0 &&
        Number(this.min) === 0 &&
        Number(this.second) === 0
      ) {
        return
      } else {
        // 递归每秒调用countTime方法，显示动态时间效果,
        setTimeout(this.countTime, 1000)
      }
    },
    currentChange (e) {
      this.page = e
      this.getApi()
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/seconds/index.css';
</style>
