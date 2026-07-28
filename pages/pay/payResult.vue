<template>
  <div id="app">
    <div class="orderDetail">
      <div class="orderDetail_left">
        <i class="el-icon-check"></i>
      </div>
      <div class="orderDetail_center">
        <div class="orderDetail_center_top">
          {{ $t('payResult.long[0]') }}
        </div>

        <p>{{ $t('payResult.long[1]') }}{{ order_list.sNo }}</p>
        <p>
          {{ $t('payResult.long[2]') }}<span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(order_list.total) }}</span>
        </p>
        <p>
          {{ $t('payResult.pay[0]')
          }}{{
            payStyle == 'wallet_pay'
              ? $t('payResult.pay[1]')
              : payStyle == 'pc_wechat'
              ? $t('payResult.pay[2]')
              : payStyle == 'pc_alipay'
              ? $t('payResult.pay[3]')
              : $t('payResult.pay[4]')
          }}
        </p>

        <div class="btnBox">
          <a href="javascript:;" v-if="!trade_no" @click="toUrl('/my/my/myOrder')">{{
            $t('payResult.view_order')
          }}</a>
          <a href="javascript:;" @click="toUrl('/')">{{
            $t('payResult.Go')
          }}</a>
        </div>
      </div>
      <div class="orderDetail_right">
        <img src="~/static/images/app_code.png" alt="" />
        <div>
          {{ $t('payResult.left[0]') }}
          <br />
          {{
            mchCoupon && mchCoupon.mallName
              ? `${mchCoupon.mallName}APP`
              : $t('payResult.left[1]')
          }}
          <br />
          {{ $t('payResult.left[2]') }}
        </div>
      </div>
    </div>

<!--    <div class="w">
      <div class="recommend-title">
        <p>{{ $t('payResult.long[3]') }}</p>
        <div style="cursor: pointer" @click="getTuijian">
          <span>{{ $t('payResult.long[4]') }}</span>
          <img :src="update" alt="" />
        </div>
      </div>
      <ul class="recommend-products-wrap">
        <li
          class="recommend-products"
          v-for="(item, index) of recommendList"
          :key="index"
          @click="toDetail(item)"
        >
          <div class="relative">
            <div
              class="proDown"
              v-if="item.status == 3"
              style="z-index: 9; top: 50%; transform: translate(-50%, -50%)"
            >
              {{ $t('payResult.long[5]') }}
            </div>
            <img class="recommend-products-img" :src="item.imgurl" alt="" />
          </div>
          <p>{{ item.product_title }}</p>
          <div>
            <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
            <div class="to-cart" @click.stop="addPro(item.id)">
              <img :src="to_cart" alt="" />
            </div>
          </div>
        </li>
      </ul>
    </div>-->

    <!-- 添加商品 -->
    <div class="mask" v-if="addProFlag">
      <div class="attrMask">
        <div class="attrMask_title">
          <div>{{ $t('payResult.add_product') }}</div>
          <i class="el-icon-close" @click="addProFlag = false"></i>
        </div>

        <div class="attrMask_pro">
          <img :src="imgurl" alt="" />
          <div>
            <p>{{ addProName }}</p>
            <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(price) }}</span>
          </div>
        </div>

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
                  >{{ value.name }}</el-button
                >
              </el-row>
            </div>
          </div>
        </template>

        <div class="attrMask_attr">
          <span>{{ $t('payResult.number') }}</span>
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
export default {
  layout: 'homeLayout',
  data () {
    return {
      payStyle: '',
      order_list: {},
      recommendList: [],
      update: require('~/static/images/update.png'),
      to_cart: require('~/static/images/cart1.png'),
      trade_no: '',
      addProFlag: false,
      addProName: '',
      pro_id: '',
      haveSkuBean: '',
      price: '',
      imgurl: '',
      goods_num: '',
      count: '',
      skuBeanList: [],
      attrList: [],

      highKeys: {},
      skuName: 'SkuID',
      skuName1: 'Price',
      skuName2: 'Pic',
      skuName3: 'Stock',
      spliter: ',',
      sku_list: {},
      result: {},
      mchCoupon: {}
    }
  },
  mounted () {
    this.mchCoupon = this.$storage.get('mchCoupon')
    if (this.$route.query.order_list) {
      this.order_list = this.$route.query.order_list
      // 浏览器会把"变成%22
      this.order_list = JSON.parse(this.order_list.replace(/%22/g, '"'))
    }
    if (this.$route.query.trade_no) {
      this.trade_no = this.$route.query.trade_no
    }
    if (this.$route.query.payStyle) {
      this.payStyle = this.$route.query.payStyle
    }
    this.pc_user = this.$cookies.get('pc_user')

    this.getTuijian()
  },
  methods: {
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
    initData () {
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
          title: this.$t('payResult.Tips[0]'),
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
        api:'mall.Product.index',

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
          this.price = res.data.pro.price
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
        this.$message.error(this.$t('payResult.Tips[1]'))
        return
      }

      var data = {
        api:'mall.Product.addCart',

        pro_id: this.pro_id, // 商品ID
        num: this.goods_num, // 数量
        attribute_id: this.haveSkuBean.cid // 属性ID
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(this.$t('payResult.Tips[2]'))

          this.addProFlag = false
          this.$root.$emit('shoppingCart')
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    toUrl (url) {
      this.$router.push({ path: url })
    },
    toDetail (item) {
      this.$router.push({
        path: '/homedetail/homedetail',
        query: { id: item.id }
      })
    },
    /*
				获取为你推荐列表
			 */
    getTuijian () {
      var data = {
        api:'mall.Product.recommend',
        access_id: this.pc_user.access_id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.recommendList = res.data.list
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    }
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
@import '~/assets/css/pay/payResult.css';
</style>
