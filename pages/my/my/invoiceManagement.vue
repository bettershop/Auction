<template>
  <div id="app">
    <input type="hidden" name="pageTitle" :value="$t('addInvoice.fpgl')" />
    <!-- 我的订单tabs -->
    <div class="tab_app">
      <div>
        <ul class="tabs">
          <li
            :class="{ 'border-bottom': tabIndex == 0, redb: tabIndex == 0 }"
            @click="chooseTab(0)"
          >
            {{ $t('invoiceManagement.dkp') }}
          </li>
          <li
            :class="{ 'border-bottom': tabIndex == 1, redb: tabIndex == 1 }"
            @click="chooseTab(1)"
          >
            {{ $t('invoiceManagement.sqz') }}
          </li>
          <li
            :class="{ 'border-bottom': tabIndex == 2, redb: tabIndex == 2 }"
            @click="chooseTab(2)"
            style="white-space: nowrap"
          >
            {{ $t('invoiceManagement.ywc') }}
          </li>
          <li
            :class="{ 'border-bottom': tabIndex == 3, redb: tabIndex == 3 }"
            @click="chooseTab(3)"
            style="white-space: nowrap"
          >
            {{ $t('invoiceManagement.ycx') }}
          </li>
        </ul>
      </div>
      <div style="padding-right: 20px">
        <el-button class="tt_an_fp" @click="goUrl()">{{
          $t('invoiceManagement.fpttg')
        }}</el-button>
      </div>
    </div>
    <div>
      <template v-if="!loadFlag">
        <div class="list" v-for="(item, index) in tableList" :key="index">
          <div class="div_one">
            <div @click="godetails(item)">
              <div class="div_two">
                <div class="div_mchname">
                  {{ $t('invoiceManagement.dp') }}：{{ item.shop_name }}
                </div>
                <div class="div_three">
                  <img class="div_img" src="~/static/images/icon_gd.png" />
                </div>
              </div>
              <div style="display: flex">
                <div class="div_sno" v-if="tabIndex == 0">
                  {{ $t('invoiceManagement.ddh') }}：{{ item.sNo }}
                </div>
                <div class="div_sno" v-else>
                  {{ $t('invoiceManagement.ddh') }}：{{ item.s_no }}
                </div>
                <div class="div_time" v-if="tabIndex == 0">
                  {{ $t('invoiceManagement.ddsj') }}：{{ item.add_time }}
                </div>
                <div class="div_time" v-else>
                  {{ $t('invoiceManagement.ddsj') }}：{{ item.order_add_time }}
                </div>
              </div>
            </div>
            <div class="an_div">
              <el-button
                v-if="tabIndex == 0"
                class="fp_an"
                @click="cutInvoice('/my/my/cutInvoice', item, 1)"
                >{{ $t('invoiceManagement.sqkp') }}</el-button
              >
              <el-button
                @click="revocation(item)"
                v-if="tabIndex == 1"
                class="fp_an"
                >{{ $t('invoiceManagement.cx') }}</el-button
              >
              <el-button
                v-if="tabIndex == 2"
                class="fp_an"
                @click="down(item)"
                >{{ $t('invoiceManagement.xzfp') }}</el-button
              >
              <el-button
                v-if="tabIndex == 3"
                class="fp_an"
                @click="cutInvoice('/my/my/cutInvoice', item, 2)"
              >
                {{ $t('invoiceManagement.cxkp') }}</el-button
              >
            </div>
          </div>
        </div>
        <div v-if="tableList.length == 0" class="noOrder">
          <img :src="noOrder" alt="" />
          <p>
            {{ $t('invoiceManagement.zw')
            }}{{
              tabIndex == 0
                ? $t('invoiceManagement.dkp')
                : tabIndex == 1
                ? $t('invoiceManagement.sqz')
                : tabIndex == 2
                ? $t('invoiceManagement.ywc')
                : tabIndex == 3
                ? $t('invoiceManagement.ycx')
                : ''
            }}{{ $t('invoiceManagement.ddd') }}~
          </p>
        </div>
      </template>
      <template v-if="loadFlag">
        <div class="list">
          <div class="div_one">
            <div>
              <div class="div_two">
                <div class="div_mchname nonavtitle"></div>
                <div class="div_three nonavtitle"></div>
              </div>
              <div style="display: flex">
                <div class="div_sno nonavtitle"></div>
                <div class="div_time nonavtitle"></div>
              </div>
            </div>
            <div class="an_div nonavtitle"></div>
          </div>
        </div>
      </template>
    </div>
    <div class="addressMask" v-if="yuepayFlag">
      <div style="height: auto">
        <div class="addressMask_title">
          {{ $t('invoiceManagement.kptx') }}
          <i class="el-icon-close" @click="yuepayFlag = false"></i>
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
          <div
            style="font-size: 16px; color: #000000"
            @click="yuepayFlag = false"
          >
            {{ $t('invoiceManagement.qx') }}
          </div>
          <div style="font-size: 16px" @click="toUrl('/my/my/addInvoice')">
            {{ $t('invoiceManagement.ljtj') }}
          </div>
        </div>
      </div>
    </div>
    <div class="addressMask" v-if="iShow">
      <div style="height: auto">
        <div class="addressMask_title">
          {{ $t('invoiceManagement.kptx') }}
          <i class="el-icon-close" @click="iShow = false"></i>
        </div>

        <div class="order_Detail">
          <div class="pay_payfs">
            <div class="orderDetail_dep">
              <img style="width: 28px" src="~/static/images/close_1.png" />
            </div>
            <div class="orderDetail_center_top">
              {{ $t('invoiceManagement.gddfp') }}
            </div>
          </div>
        </div>
        <div class="addressMask_bottom">
          <div class="div_four" style="font-size: 13px" @click="iShow = false">
            {{ $t('invoiceManagement.qx') }}
          </div>
          <div
            class="div_four"
            style="font-size: 13px"
            @click="goUrl('order', 'myOrder')"
          >
            {{ $t('invoiceManagement.fhdd') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      iShow: false,
      tabIndex: 0,
      tableList: [],
      tableData: [],
      loadFlag: true,
      yuepayFlag: false,
      order_list: [],
      pc_user: {},
      noOrder: require('/static/images/no_order.png'),
      lange: ''
    }
  },
  mounted () {
    this.$emit('pageTitle', this.$t('addInvoice.fpgl'))
    this.pc_user = this.$cookies.get('pc_user')
    this.lange = this.$cookies.get('i18n_redirected')
    console.log('语言219', this.$cookies.get('i18n_redirected'))
    this.getApi()
  },
  methods: {
    getApi () {
      let data = {
        // api: 'app_pc.invoiceInfo.getToInvoiced',
        api: 'mall.InvoiceInfo.getToInvoiced',

        page: this.page // 次数
      }
      this.$Api.doRequest(data).then(res => {
        if (res.code == '200') {
          this.loadFlag = false
          this.tableList = res.data.list
        }
      })
    },
    axios () {
      let data = {
        // api: 'app_pc.invoiceInfo.getInvoiceInfo',
        api: 'mall.InvoiceInfo.getInvoiceInfo',

        status: this.tabIndex // 发票状态 1.申请中 2.已完成 3.已撤销
      }
      this.$Api.doRequest(data).then(res => {
        console.log('res', res)
        this.loadFlag = false
        this.tableList = res.data.list
      })
    },
    chooseTab (index) {
      console.log('index', index)
      this.tabIndex = index
      this.loadFlag = true
      if (index == 0) {
        this.getApi()
      } else {
        this.axios()
      }
    },
    //撤销申请
    revocation (row) {
      this.$confirm(
        this.$t('invoiceManagement.qrcx'),
        this.$t('invoiceManagement.ts'),
        {
          confirmButtonText: this.$t('invoiceManagement.qd'),
          cancelButtonText: this.$t('invoiceManagement.qx'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$Api
            .getList({
              // api: 'app_pc.invoiceInfo.revoke',
              api: 'mall.InvoiceInfo.revoke',

              id: row.id
            })
            .then(res => {
              console.log('del', res)
              if (res.code == 200) {
                this.axios()
                this.$message({
                  type: 'success',
                  message: this.$t('invoiceManagement.cg')
                  // offset: 102
                })
              }
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消撤销',
          //   offset: 100
          // })
        })
    },
    down (row) {
      console.log('row', row)
      // 查看详情的
      // var a = document.createElement('a')
      // a.setAttribute('href', row.file)

      // a.setAttribute('download', 'dfsf.pdf')
      // a.setAttribute('target', '_blank')
      // let clickEvent = document.createEvent('MouseEvents')
      // clickEvent.initEvent('click', true, true)
      // a.dispatchEvent(clickEvent)
      // 下载
      this.downClickImg(row.file, '发票')
    },
    downClickImg (imgsrc, name) {
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        let a = document.createElement('a') // 生成一个a元素
        let event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = imgsrc
    },
    goUrl () {
      let data = {
        // api: 'app_pc.invoiceHeader.getDefault',
        api: 'mall.InvoiceHeader.getDefault',
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data).then(res => {
        if (JSON.stringify(res.data) === '{}') {
          this.yuepayFlag = true
        } else {
          this.$router.push({
            path: '/my/my/headerManagement'
          })
        }
      })
    },
    godetails (item) {
      this.$router.push({
        path: '/my/my/orderDetails',
        query: { order_id: item.order_id }
      })
    },
    toUrl (url) {
      this.$router.push({
        path: url
      })
    },
    cutInvoice (url, item, row) {
      if (item.invoiceTimeout == true) {
        this.iShow = true
        return
      }
      let data = {
        // api: 'app_pc.invoiceHeader.getDefault',
        api: 'mall.InvoiceHeader.getDefault',
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data).then(res => {
        if (JSON.stringify(res.data) === '{}') {
          this.yuepayFlag = true
        } else {
          if (row == 1) {
            this.$router.push({
              path: url,
              query: {
                z_price: item.z_price,
                sNo: item.sNo,
                shop_name: item.shop_name
              }
            })
          } else {
            console.log('xxxxxxx377', item)
            this.$router.push({
              path: url,
              query: {
                z_price: item.invoice_amount,
                sNo: item.s_no,
                email: item.email,
                id: item.id
              }
            })
          }
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/invoiceManagement.css';
</style>
