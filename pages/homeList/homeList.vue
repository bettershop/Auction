<template>
  <div id="app">
    <!-- 判断有没有右侧固定栏：返回顶部等 -->
    <div class="border" style="width: 100%; height: 1px; margin-bottom: 20px; background: #e6e6e6"></div>

    <div class="Mch" v-if="Mch_List.length > 0">
      <el-breadcrumb v-if="searchName" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{ $t('homList.title') }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          "{{ searchName }}" &nbsp;&nbsp;&nbsp;&nbsp;
          <span v-if="total">{{ $t('homList.long[0]') }}<span class="red">{{ total }}</span>{{ $t('homList.long[1]') }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="MyShop">
        <ul>
          <li v-for="(item, index) in Mch_List">
            <div class="MyShop_LiLeft">
              <img :src="item.logo" alt="" />
              <div class="MyShop_LiLeft_Info">
                <div class="MyShop_Name">
                  <h2>{{ item.name }}</h2>
                  <p>所在地：{{ item.sheng }}{{ item.shi }}</p>
                </div>
                <div class="MyShop_Info">
                  <span>{{ item.collection_num }}人收藏</span>
                  <div>|</div>
                  <span>{{ item.proNum }}件在售商品</span>
                </div>
              </div>
            </div>
            <div class="MyShop_LiRight">
              <button class="MyShop_Go" @click="goMch(item.id)">
                进店逛逛 >>
              </button>
              <div @click="Collection(index, item)">
                <button class="MyShop_Collection2" v-if="item.isCollect == 1">
                  <img src="~/static/images/To_stars.png" class="To_stars" alt="" />
                  已收藏
                </button>
                <button class="MyShop_Collection" v-else>
                  <img src="~/static/images/Not_stars.png" class="Not_stars" alt="" />
                  <img src="~/static/images/hover_stars.png" class="hover_stars" alt="" />
                  收藏店铺
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="Mch_Count > 0" class="paginationBox" style="padding-bottom: 68px; justify-content: center">
        <el-pagination :page-size="2" :current-page.sync="page2" @current-change="currentChange2" background layout="prev, pager, next" :total="Mch_Count">
        </el-pagination>
      </div>
    </div>

    <div class="container">
      <div class="condition">
        <!-- 组件 -->
        <el-breadcrumb v-if="searchName" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>{{ $t('homList.title') }}</el-breadcrumb-item>
          <el-breadcrumb-item>
            "{{ searchName }}" &nbsp;&nbsp;&nbsp;&nbsp;
            <span v-if="total">{{ $t('homList.long[0]') }}<span class="red">{{ total }}</span>{{ $t('homList.long[1]') }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb v-else-if="pname" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">
            <a href="javascript:;" @click="toHome('/')">{{
              $t('homList.home')
            }}</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>{{ pname }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- screen start -->
        <div class="screen" v-if="!loadFlag">
          <!-- screen-head start -->
          <div v-if="
              checkBrandText.length > 0 || checkClassText.length > 0 || amount
            " class="screen-head">
            <p>{{ $t('homList.long[2]') }}</p>
            <div class="screen-item">
              <el-tag @close="removeCheck(item, 0)" v-for="(item, index) of checkBrandText" :key="item.brand_id" closable type="info" color="#fff" effect="plain">{{ item.brand_name }}</el-tag>
              <el-tag @close="removeCheck(item, 1)" v-for="(item, index) of checkClassText" :key="item.cid" closable type="info" color="#fff" effect="plain">{{ item.pname }}</el-tag>
              <template v-for="(item, index) of amount">
                <el-tag v-if="index == 0" :key="amount" @close="removeCheck(item, 1, true)" closable type="info" color="#fff" effect="plain">{{ amount }}</el-tag>
              </template>
            </div>
            <p class="screen-clear" @click="clearCheck">
              {{ $t('homList.emity') }}
            </p>
          </div>
          <!-- screen-head end -->

          <!-- && proList.length != 0 -->
          <div class="pingpai" v-if="class_list.length != 0 || classHead">
            <p class="pingpai_left">{{ $t('homList.class') }}:</p>
            <ul class="list_ul" v-if="!isMore[1]">
              <template v-if="!isChecked[1]">
                <li :class="{ active: class_id == item.cid }" v-for="(item, index) of class_list" :key="item.cid" @click="class_id = item.cid">
                  {{ item.pname }}
                </li>
              </template>
              <el-checkbox-group v-else v-model="checkClass" style="display: flex; flex-wrap: wrap; width: 100%">
                <li v-for="(item, index) of class_list" :key="item.cid">
                  <el-checkbox :label="item.cid.toString()">{{ item.pname }}</el-checkbox>
                </li>
              </el-checkbox-group>
            </ul>
            <div class="moreBox" v-else>
              <ul>
                <li @click="allClass" :class="{ active: classS == '所有分类' }">
                  {{ $t('homList.all_cl') }}
                </li>
                <li :class="{ active: classS == item }" v-for="(item, index) of letterList" :key="item" @click="classChange(item)">
                  {{ item }}
                </li>
              </ul>

              <div class="moreBox_bottom">
                <ul class="list_ul">
                  <template v-if="!isChecked[1]">
                    <li :class="{ active: class_id == item.cid }" v-for="(item, index) of class_list" :key="item.cid" @click="class_id = item.cid">
                      {{ item.pname }}
                    </li>
                    <div class="zw_font" v-if="class_list.length <= 0">
                      {{ $t('homList.zwfl') }}
                    </div>
                  </template>
                  <el-checkbox-group v-else v-model="checkClass" style="display: flex; flex-wrap: wrap; width: 100%">
                    <li v-for="(item, index) of class_list" :key="item.cid">
                      <el-checkbox :label="item.cid.toString()">{{
                        item.pname
                      }}</el-checkbox>
                    </li>
                  </el-checkbox-group>
                </ul>
              </div>
            </div>
            <div class="xuanxiang">
              <template v-if="class_list.length > 6">
                <span class="el-dropdown-link" v-if="!isMore[1]" @click="clickMore(1)">
                  {{ $t('homList.more')
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>

                <span class="el-dropdown-link" v-else @click="clickMore(1)">
                  {{ $t('homList.Put')
                  }}<i class="el-icon-arrow-up el-icon--right"></i>
                </span>
              </template>

              <el-button class="el-icon-plus" size="mini" @click="clickChecked(1)">
                {{
                  isChecked[1]
                    ? $t('homList.change[0]')
                    : $t('homList.change[1]')
                }}
              </el-button>
            </div>
          </div>
          <!-- fenlei end -->

          <!-- pingpai start -->
          <div class="pingpai" v-if="brand_list.length != 0 || brandHead" style="border-top: 1px solid #eeeeee">
            <p class="pingpai_left">{{ $t('homList.pp') }}:</p>
            <ul class="list_ul" v-if="!isMore[0]">
              <template v-if="!isChecked[0]">
                <li :class="{ active: brand_id == item.brand_id }" v-for="(item, index) of brand_list" :key="item.brand_id" @click="brand_id = item.brand_id">
                  {{ item.brand_name }}
                </li>
              </template>

              <el-checkbox-group v-else v-model="checkBrand" style="display: flex; flex-wrap: wrap; width: 100%">
                <li v-for="(item, index) of brand_list" :key="item.brand_id">
                  <el-checkbox :label="item.brand_id">{{
                    item.brand_name
                  }}</el-checkbox>
                </li>
              </el-checkbox-group>
            </ul>
            <div class="moreBox" v-else>
              <ul>
                <li @click="allBrand" :class="{ active: brandS == '所有品牌' }">
                  {{ $t('homList.all_pp') }}
                </li>
                <li @click="brandChange(item)" :class="{ active: brandS == item }" v-for="(item, index) of letterList" :key="item">
                  {{ item }}
                </li>
              </ul>

              <div class="moreBox_bottom">
                <ul class="list_ul">
                  <template v-if="!isChecked[0]">
                    <template v-for="(item, index) of brand_list">
                      <li :class="{ active: brand_id == item.brand_id }" :key="item.brand_id" @click="brand_id = item.brand_id">
                        {{ item.brand_name }}
                      </li>
                    </template>
                    <div class="zw_font" v-if="brand_list.length <= 0">
                      {{ $t('homList.zwpp') }}
                    </div>
                  </template>
                  <el-checkbox-group v-else v-model="checkBrand" style="display: flex; flex-wrap: wrap; width: 100%">
                    <template v-for="(item, index) of brand_list">
                      <li :key="item.brand_id">
                        <el-checkbox :label="item.brand_id">{{
                          item.brand_name
                        }}</el-checkbox>
                      </li>
                    </template>
                  </el-checkbox-group>
                </ul>
              </div>
            </div>
            <div class="xuanxiang">
              <template v-if="brand_list.length > 6">
                <span class="el-dropdown-link" v-if="!isMore[0]" @click="clickMore(0)">
                  {{ $t('homList.more')
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>

                <span class="el-dropdown-link" v-else @click="clickMore(0)">
                  {{ $t('homList.Put')
                  }}<i class="el-icon-arrow-up el-icon--right"></i>
                </span>
              </template>

              <el-button class="el-icon-plus" size="mini" @click="clickChecked(0)">
                {{
                  isChecked[0]
                    ? $t('homList.change[0]')
                    : $t('homList.change[1]')
                }}
              </el-button>
            </div>
          </div>
          <!-- pingpai end -->
          <!-- fenlei start -->
          <!-- jiage start -->
          <div class="pingpai" style="padding: 12px 20px; display: flex; align-items: center">
            <p class="pingpai_left">{{ $t('homList.price') }}:</p>
            <ul class="list_ul">
              <li :class="{ active: amount == item }" @click="checkPrice(item)" v-for="(item, index) of priceList" :key="index">
                {{$LaiKeCommObject.show_symbol}}{{ item }}
              </li>
            </ul>
            <div class="xuanxiang_jiage">
              <div style="margin-right: 8px">{{$LaiKeCommObject.show_symbol}}</div>
              <el-input style="width: 60px" v-model="min_price" class="myinput" @keyup.native="min_price = oninput2(min_price)">
              </el-input>
              <div style="margin: 0 6px">-</div>
              <el-input style="width: 60px" v-model="max_price" class="myinput" @keyup.native="max_price = oninput2(max_price)">
              </el-input>
              <el-button type="mini" class="mybutton" @click="priceOk">
                {{ $t('common_button[2]') }}
              </el-button>
            </div>
          </div>
          <!-- jiage end -->
        </div>

        <div class="screen" v-else>
          <!-- pingpai start -->
          <div class="pingpai" style="border-top: 1px solid #eeeeee">
            <p class="pingpai_left">{{ $t('homList.pp') }}:</p>
            <ul class="list_ul">
              <li class="nonavtitle"></li>
            </ul>
            <div class="xuanxiang">
              <span class="el-dropdown-link nonavtitle"></span>

              <el-button class="nonavtitle" size="mini" style="margin-left: 10px"></el-button>
            </div>
          </div>
          <!-- pingpai end -->

          <!-- fenlei start -->
          <div class="pingpai">
            <p class="pingpai_left">{{ $t('homList.class') }}:</p>
            <ul class="list_ul">
              <li class="nonavtitle"></li>
            </ul>
            <div class="xuanxiang">
              <span class="el-dropdown-link nonavtitle"></span>

              <el-button class="nonavtitle" size="mini" style="margin-left: 10px"></el-button>
            </div>
          </div>
          <!-- fenlei end -->

          <!-- jiage start -->
          <div class="pingpai" style="padding: 12px 20px; display: flex; align-items: center">
            <p class="pingpai_left">{{ $t('homList.price') }}:</p>
            <ul class="list_ul">
              <li :class="{ active: amount == item }" @click="checkPrice(item)" v-for="(item, index) of priceList" :key="index">
                {{$LaiKeCommObject.show_symbol}}{{ item }}
              </li>
            </ul>
            <div class="xuanxiang_jiage">
              {{$LaiKeCommObject.show_symbol}}
              <el-input v-model="min_price" class="myinput"> </el-input>
              -
              <el-input v-model="max_price" class="myinput"> </el-input>
              <el-button type="mini" class="mybutton" @click="priceOk">
                {{ $t('common_button[2]') }}
              </el-button>
            </div>
          </div>
          <!-- jiage end -->
        </div>
        <!-- screen end -->

        <!-- default start-->
        <div class="default">
          <div class="default-content">
            <p :class="{ active: sort_type == '' }" @click="sort_type = ''">
              {{ $t('homList.default') }}
            </p>
            <p :class="{ active: sort_type == 'price' }" class="priceSort" @click="sortClick('price')">
              {{ $t('homList.price') }}
              <i :class="{ active: sort == '0' }" class="el-icon-caret-top"></i>
              <i :class="{ active: sort == '1' }" class="el-icon-caret-bottom"></i>
            </p>
            <p :class="{ active: sort_type == 'volume' }" class="priceSort" @click="sortClick('volume')">
              {{ $t('homList.volume') }}
              <i :class="{ active: sort1 == '0' }" class="el-icon-caret-top"></i>
              <i :class="{ active: sort1 == '1' }" class="el-icon-caret-bottom"></i>
            </p>

            <div class="pageBox" v-if="total > 0">
              <img :class="{ disabled: page == 1 }" @click="pageChange(0)" src="~/static/images/jianrou_l.png" alt="" />
              <div>
                <span>{{ page }}</span>
                /{{ pageAll }}
              </div>
              <img :class="{ disabled: page == pageAll }" @click="pageChange(1)" src="~/static/images/jiantou_r.png" alt="" />
            </div>
          </div>
        </div>
        <!-- default end -->

        <!-- main start -->
        <div class="my-main">
          <ul v-if="!loadFlag">
            <li class="relative" v-for="(item, index) of proList" :key="index" @click="toUrl(item)">
              <div class="proDown" v-if="item.recycle == 1" style="top: 40px">
                <!-- 已过期 -->
                {{ $t('shoppingCart.ygq') }}
              </div>
              <div class="proDown" v-if="item.status == 3 && item.recycle != 1" style="top: 40px">
                <!-- 已下架 -->
                {{ $t('homList.shelf') }}
              </div>
              <div class="proDown" v-if="
                  item.goodsNum <= 0 && item.recycle != 1 && item.status != 3
                " style="top: 40px">
                <!-- 已售罄 -->
                {{ $t('homedetail.empty') }}
              </div>
              <img :src="item.imgurl" alt="" @error="handleIngError(index)" />
              <div class="product_price">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</div>
              <div class="product_title">{{ item.product_title }}</div>
              <div class="product_volume"> <span class="number">{{ item.volume }}{{ item.volume >= 100 ? '+' : '' }}</span> {{ $t('rgm') }}</div>
              <div class="proMch">
                <!-- <img :src="item.head_img" alt="" /> -->
                {{ item.mch_name }}
              </div>
            </li>
            <li class="noPro" v-if="proList.length == 0">
              <img src="~/static/images/noPro.png" alt="" />
              <p>{{ $t('homList.noPros[0]') }}</p>
              <p>{{ $t('homList.noPros[1]') }}</p>
            </li>
          </ul>
          <ul v-else>
            <li v-for="i in 12">
              <div class="nonavtitle" style="width: 286px; height: 286px"></div>
              <p class="nonavtitle" style="display: block"></p>
              <span class="nonavtitle" style="
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 100px;
                "></span>
            </li>
          </ul>
        </div>
        <!-- main end -->

        <div v-if="total > 0" class="paginationBox" style="padding-bottom: 68px; justify-content: center">
          <el-pagination :page-size="20" :current-page.sync="page" @current-change="currentChange" background layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'homeLayout',
  async asyncData({ app, query, $Api }) {
    let pc_user = app.$cookies.get('pc_user')
    let cid = query.cid
    let pname = query.pname
    let searchName = query.searchName
    var data = {
      api: 'mall.Index.search',
      access_id: pc_user ? pc_user.access_id : '',
      cid: cid, // 分类ID
      keyword: searchName, // 关键字
      page: 1, //  加载次数
      pageSize: 20,
      page_mch: 1
    }
    let res = await $Api.doRequest(data)
    return {
      pc_user,
      cid,
      pname,
      searchName,
      loadFlag: false,
      total: res.data.total,
      brand_list: res.data.brand_list ? res.data.brand_list : [],
      class_list: res.data.class_list ? res.data.class_list : [],
      proList: res.data.list ? res.data.list : []
      //   Mch_List: res.data.mch ? res.data.mch : [],
      //   Mch_Count: Mch_Count
    }
  },
  data() {
    return {
      // 破图
      ErrorIMG: process.env.VUE_APP_LKT_ROOT_IMG_URL + "/pic/images/icon/Default_picture.png",
      loadFlag: true,
      isMore: [false, false], //品牌和分离是否点击了更多
      isMultiSelect: [false, false], //品牌和分离是否多选
      min_price: '', //搜索的最小价格
      max_price: '', //搜索的最大价格
      isChecked: [false, false],
      checkBrand: [],
      checkClass: [],
      checkBrandText: [],
      checkClassText: [],
      letterList: [],
      brandS: '所有品牌',
      classS: '所有分类',

      total: 0, //商品总数
      brand_list: [],
      class_list: [],
      proList: [],

      pname: '', //从哪个分类进来的

      searchName: '',
      cid: '', //从分类进本页面时，传的分类ID
      class_id: '', //选择的分类ID(71,74)
      brand_id: '', // 选择的品牌ID(87,136)
      amount: '', // 金额(1500- )
      sort_type: '', //  排序类型(price 或 volume)
      sort: '', //  排序(asc 或 desc)
      sort1: '',//销量的 升序和降序
      page: 1, //  加载次数
      page2: 1,
      page_mch: 1,
      is_Collection: [],
      Mch_List: [],
      Mch_Count: 0,
      brandHead: '',
      classHead: ''
    }
  },
  computed: {

    pageAll() {
      return Math.ceil(this.total / 20)
    },

    //价格区间：不要在data中声明这个属性 否则会报错
    priceList() {
      let fmt = this.$LaiKeCommObject.formatPrice.bind(this.$LaiKeCommObject);
      return [
        '0-' + fmt(499),
        fmt(500) + '-' + fmt(1000),
        fmt(1000) + '-' + fmt(1500),
        fmt(1500) + '-' + this.$t('ys')
      ]
    }
  },
  watch: {
    sort_type(val, old) {
      if (val != old && val != 'price') {
        this.sort = ''
        this.getApi()
      }

      if (val != old && val != 'volume') {
        this.sort1 = ''
        this.getApi()
      }
    },
    page(val) {
      this.getApi()
    },
    amount(val) {
      this.getApi()
    },
    checkBrand(val, old) {
      if (val[0] == '' && val.length == 1) {
        this.checkBrand = []
        return
      }

      if (val) {
        this.brand_id = val.join(',')
      }
    },
    checkClass(val, old) {
      if (val[0] == '' && val.length == 1) {
        this.checkClass = []
        return
      }

      if (val) {
        this.class_id = val.join(',')
      }
    },
    class_id(val, old) {
      // 判断是否重复调用
      if (val == old) {
        return
      }
      val = val.toString()
      var checkArr = val.split(',')

      var checkClassText = []

      this.class_list.filter(items => {
        var flag = checkArr.some(item => item == items.cid)
        if (flag) {
          checkClassText.push(items)
        }
      })

      this.checkClassText = checkClassText

      if (checkArr.length <= 1) {
        this.checkClass = checkArr
      }
      this.getApi()
    },
    brand_id(val, old) {
      // 判断是否重复调用
      if (val == old) {
        return
      }

      val = val.toString()
      var checkArr = val.split(',')

      var checkBrandText = []

      this.brand_list.filter(items => {
        var flag = checkArr.some(item => item == items.brand_id)
        if (flag) {
          checkBrandText.push(items)
        }
      })

      this.checkBrandText = checkBrandText

      if (checkArr.length <= 1) {
        this.checkBrand = checkArr
      }

      this.getApi()
    }
  },
  mounted() {
    setTimeout(() => {
      let links = $('link')
      let mchCoupon = this.$storage.get('mchCoupon')

      for (let i = 0; i < links.length; i++) {
        let link = $(links[i])
        let rel = link[0].rel
        rel = rel.toLowerCase()
        if (rel.indexOf('icon') > -1) {
          link[0].href =
            mchCoupon && mchCoupon ? mchCoupon.mallIcon : '/favicon.ico'
          break
        }
      }
    }, 100)
    for (var i = 0; i < 26; i++) {
      this.letterList.push(String.fromCharCode(65 + i))
    }
    if (this.$route.query.searchName) {
      this.searchName = this.$route.query.searchName
    }
    if (this.$route.query.cid) {
      this.cid = this.$route.query.cid
      // 传递cid给homeHeader
      this.$root.$emit('cid', this.cid)
    }
    if (this.$route.query.pname) {
      this.pname = this.$route.query.pname
    }
    this.getApi()
  },
  methods: {
    handleIngError(index) {
      console.log();
      this.proList[index].imgurl = this.ErrorIMG
    },
    oninput2(num, limit) {
      var str = num
      str = str.replace(/[^\.\d]/g, '')
      str = str.replace('.', '')

      return str
    },
    collectionClick() {
      let data = {
        api: 'mch.mall.Mch.collectionShop',

        shop_id: this.shop_id // 店铺ID
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(res.message)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    goMch(id) {
      this.$router.push({ path: '/mch/mch', query: { id: id } })
    },
    Collection(index, item) {
      let data = {
        api: 'mch.mall.Mch.collectionShop',

        shop_id: item.id // 店铺ID
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(res.message)
          if (item.isCollect == 1) {
            item.isCollect = 0
          } else {
            item.isCollect = 1
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    toUrl(item) {
      this.$router.push({
        path: '/homedetail/homedetail',
        query: { id: item.id, ClassName: this.$t('shoppingCart.title') }
      })
    },
    sortClick(type) {
      this.sort_type = type

      if (type == 'price') {
        // 升序：asc 或 降序：dlogin.htmlesc
        this.sort = this.sort == '0' ? '1' : '0'

        this.getApi()
      }
      // 销量
      if (type == 'volume') {
        // 升序：asc 或 降序：dlogin.htmlesc
        this.sort1 = this.sort1 == '0' ? '1' : '0'

        this.getApi()
      }

    },
    pageChange(type) {
      if (type == 0 && this.page > 1) {
        this.page = Number(this.page) - 1
      } else if (type == 1 && this.page < this.pageAll) {
        this.page = Number(this.page) + 1
      }
    },
    currentChange(e) {
      this.page = e
    },
    currentChange2(e) {
      this.page_mch = e
      this.getApi()
    },
    clearCheck() {
      this.amount = ''
      this.checkBrandText = []
      this.checkBrand = []
      this.checkClassText = []
      this.checkClass = []
    },
    priceOk() {
      this.amount = (this.min_price ? this.min_price : 0) + '-' + this.max_price
    },
    checkPrice(item) {
      this.amount = item
    },
    // 删除筛选条件
    removeCheck(item, type, flag) {
      if (flag) {
        this.amount = ''
        return
      }

      if (type == 0) {
        var index = this.checkBrandText.findIndex(items => {
          return items.brand_id == item.brand_id
        })

        this.checkBrandText.splice(index, 1)

        var i = this.checkBrand.findIndex(items => {
          return items == item.brand_id
        })

        this.checkBrand.splice(i, 1)
      } else if (type == 1) {
        var index = this.checkClassText.findIndex(items => {
          return items.cid == item.cid
        })

        this.checkClassText.splice(index, 1)

        var i = this.checkClass.findIndex(items => {
          return items == item.cid
        })

        this.checkClass.splice(i, 1)
      }
    },
    // 点击查看更多
    clickMore(index) {
      var flag = !this.isMore[index]
      this.isMore.splice(index, 1, flag)
    },
    // 点击多选
    clickChecked(index) {
      var flag = !this.isChecked[index]
      this.isChecked.splice(index, 1, flag)
    },
    toHome(url) {
      this.$router.push({ path: url })
    },
    allBrand() {
      this.brandS = '所有品牌'
      this.brandHead = '所有品牌'
      this.getApi()
    },
    allClass() {
      this.classS = '所有分类'
      this.classHead = '所有分类'
      this.getApi()
    },
    brandChange(item) {
      this.brandS = item
      this.brandHead = item
      this.getApi()
    },
    classChange(item) {
      this.classS = item
      this.classHead = item
      this.getApi()
    },
    // 请求
    getApi() {
      console.log(this.amount, `1500-${this.$t('ys')}`)
      var amount = this.amount != `1500.00-${this.$t('ys')}` ? this.amount : '1500'

      var data = {
        api: 'mall.Index.search',

        cid: this.cid, // 分类ID
        keyword: this.searchName, // 关键字
        class_id: this.class_id, // 选择的分类ID(71,74)
        brand_id: this.brand_id, // 选择的品牌ID(87,136)
        amount: amount, // 金额(1500- )
        sort_type: this.sort_type, //  排序类型(price 或 volume)
        sort: this.sort || this.sort1, // 价格 排序(asc 或 desc)
        page: this.page, //  加载次数
        page_mch: this.page_mch,
        brandHead: this.brandHead == '所有品牌' ? '' : this.brandHead,
        classHead: this.classHead == '所有分类' ? '' : this.classHead,
        pageSize: 20
      }

      this.$Api.doRequest(data).then(res => {
        this.total = res.data.total
        this.brand_list = res.data.brand_list ? res.data.brand_list : []
        // if(this.brandHead){
        //   if(this.brand_list.length <=0){
        //     this.brand_list.length = 1
        //   }
        // }
        console.log('brand_list', this.brand_list)

        this.class_list = res.data.class_list ? res.data.class_list : []
        this.proList = res.data.list ? res.data.list : []
        this.loadFlag = false
        // this.Mch_List = res.data.mch?res.data.mch:[];
        // console.log(this.Mch_List);
        // this.Mch_Count = parseInt(res.data.mch_count)
        // console.log(this.Mch_Count);
      })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/homeList/homeList.css';
</style>
