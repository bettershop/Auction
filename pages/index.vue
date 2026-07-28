<template>
  <div id="app">
    <div>
      <!-- 页面其他内容 -->
    </div>
    <!-- banner start -->
    <div style="position: relative" v-if="!loadFlag">
      <!-- bug736 根据ui，因为导航和登陆高度适配，此处只能固定高度1920*500 -->
      <el-carousel
        v-if="!loadFlag"
        :interval="5000"
        arrow="never"
        :style="{ height: 500 + 'px' }"
        class="lbt"
      >
        <el-carousel-item
          v-for="item in banner"
          :key="item.id"
          :style="{ height: 500 + 'px' }"
        >
          <img
            class="bannerImg"
            :src="item.image"
            alt=""
            :style="{ height: 500 + 'px' }"
            @click="carouselUrl(item.url)"
          />
        </el-carousel-item>
      </el-carousel>
      <div style="width: 0; margin: auto">
        <!-- <div class="db_box" @mouseleave="leaveClass">
          <div class="db_sun" :style="{ height: 501 + 'px' }">
            <div v-for="(item, index) in allClass" :key="index" class="allClass_box" @mouseover="getClassDetail(item.children, index)" :style="imageHeight">
              <div class="allClass_box_one">
                <div class="allClass_box_two">
                  <img :src="item.imgUrl" class="allClass_box_img" @error="handleErrorImg" />
                </div>
                <div>
                  <div @click="navClick(item.cid, item.pname)" style="display: flex;margin-bottom: 5px;">
                    <span class="allClass_oneclass" :class="item.ishow ? 'class_one' : ''">{{ item.pname }}</span>
                  </div>
                  <div style="display: flex;">
                    <span class="allClass_twoclass" :class="item.ishow ? 'class_two' : ''" v-for="items in item.children.slice(0, 2)" @click="navClick(items.cid, items.pname)">{{ items.pname }}</span>
                    <span class="allClass_twoclass" v-if="item.children.length > 2">...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="xf_box" :style="{ height: 500 + 'px' }" v-show="classDetailShow">
            <div class="xf_lalog" v-for="(item, index) in classDetailList" :key="index">
              <div class="xf_left" @click="navClick(item.cid, item.pname)">
                <div class="flex_top">
                  <div class="flex_top-name">{{item.pname}}</div>
                  <img class="flex_top-jt" src="~/static/images/jta.png" />
                </div>
              </div>
              <div class="left_box">
                <div class="flex_left" v-for="(itm, indx) in classDetailList[index].children" :key="indx" @click="navClick(itm.cid, itm.pname)">
                  {{itm.pname}}
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div v-else class="nobannerImg">
      <img :src="defualtImg" alt="" />
    </div>
    <!-- banner end -->

    <!-- 插件测试入口 -->
    <!-- <div onclick="location.href='?module=plug&action=index'">全部插件</div> -->
    <!-- 插件 -->

    <!-- 骨架屏 start -->
    <div class="Skeleton" v-if="loadFlag">
      <div class="Skeleton-content">
        <div class="sbox">
          <div class="title">
            <div
              style="width: 46px; height: 46px; background-color: #eeeeee"
            ></div>
            <div class="text">
              <p class="nonavtitle"></p>
              <span class="nonavtitle"></span>
            </div>
          </div>
          <span class="nonavtitle" style="height: 16px"></span>
        </div>

        <div class="product">
          <ul>
            <li
              v-for="(item, index) of 4"
              :key="index"
              style="background-color: #ffffff !important"
            >
              <div class="main-img nonavtitle"></div>
              <div class="main-text">
                <p class="nonavtitle" style="width: 80%"></p>
                <span class="nonavtitle" style="width: 60px"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="Skeleton" v-if="loadFlag">
      <div class="Skeleton-content">
        <div class="sbox">
          <div class="title">
            <div
              style="width: 46px; height: 46px; background-color: #eeeeee"
            ></div>
            <div class="text">
              <p class="nonavtitle"></p>
              <span class="nonavtitle"></span>
            </div>
          </div>
          <span class="nonavtitle" style="height: 16px"></span>
        </div>

        <div class="product">
          <ul>
            <li
              v-for="(item, index) of 4"
              :key="index"
              style="background-color: #ffffff !important"
            >
              <div class="main-img nonavtitle"></div>
              <div class="main-text">
                <p class="nonavtitle" style="width: 80%"></p>
                <span class="nonavtitle" style="width: 60px"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="Skeleton_end" v-if="loadFlag">
      <div class="Skeleton-content">
        <div class="sbox">
          <div class="title">
            <div
              style="width: 46px; height: 46px; background-color: #eeeeee"
            ></div>
            <div class="text">
              <p class="nonavtitle"></p>
              <span class="nonavtitle"></span>
            </div>
          </div>
          <span class="nonavtitle" style="height: 16px"></span>
        </div>

        <div class="product">
          <ul>
            <li
              v-for="(item, index) of 4"
              :key="index"
              style="background-color: #ffffff !important"
            >
              <div class="main-img nonavtitle"></div>
              <div class="main-text">
                <p class="nonavtitle" style="width: 80%"></p>
                <span class="nonavtitle" style="width: 60px"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--竞拍首页商品列表-->
    <div class="auction-step-image"></div>
    <div style="background-color: #f6f6f6; padding-top: 40px">
      <div>

        <!-- 商品展示区域 -->
        <div class="product-grid">
          <!--近期预告标题 -->
          <div class="auction-notice">
            <div class="notice-text">
              <span>{{ $t("auction.jq") }}</span>
              <span>{{ $t("auction.yg") }}</span>
            </div>
          </div>
          <!-- 商品大于6条展示箭头 -->
          <div class="auction-but" v-if="total > 6">
            <div @click="handlePrev">&lt;</div>
            <div @click="handleNext">&gt;</div>
          </div>
          <div
            v-for="(product, index) in products"
            :key="index"
            class="product-item"
            @click="goToProductDetail(product)"
          >
            <!-- 商品图片区域 -->
            <div class="product-image">
              <img
                :src="product.img"
                @error="
                  (e) => {
                    e.target.src = require('~/static/images/default_picture.png');
                  }
                "
              />
              <div class="upcoming-badge">
                {{ $t("auction.jjks") }}
                <div class="triangle"></div>
              </div>
            </div>

            <!-- 商品信息区域 -->
            <div class="product-info">
              <h3 class="product-name">{{ product.product_title }}</h3>
              <div class="price-info">
                <span class="label" style="margin-right: 12px">{{ $t("auction.qpj") }}</span>
                <span class="unit" style="color: #b21e2e">{{$LaiKeCommObject.show_symbol}}</span>
                <span class="price-class">{{ $LaiKeCommObject.formatPrice(product.starting_amt) }}</span>
              </div>
              <div class="time-info">
                <span class="label">{{ $t("auction.kpsj") }}</span>
                <span class="value">{{ product.start_date }}</span>
                <span class="favorite-count" style="color: #b21e2e">{{
                  product.collect_num
                }}</span>
                <span class="collect">{{ $t("auction.rsc") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--      -->
      <div class="new-hot-special-container">
        <!-- 热门专场标题区域 -->
        <div class="auction-notice">
          <div class="notice-text">
            <span>{{ $t("auction.rm") }}</span>
            <span>{{ $t("auction.zc") }}</span>
          </div>
        </div>

        <!-- 专场列表网格布局 -->
        <div class="new-public-class">
          <div
            v-for="(special, index) in specials"
            :key="index"
            class="new-special-item"
          >
            <!-- 图片区域（修改为拼接式布局） -->
            <div class="new-special-image">
              <!-- 主图+小图容器（根据数量动态布局） -->
              <div
                class="img-grid"
                :class="{
      'only-main': !special.auctionProImgList || special.auctionProImgList.length === 0,
      'one-sub': special.auctionProImgList?.length === 1,
      'two-subs': special.auctionProImgList?.length >= 2
    }"
              >
                <!-- 主图 -->
                <div class="img-item main">
                  <img :src="special.main_img" class="grid-img" />
                </div>
                <!-- 第1张小图 -->
                <div class="img-item sub" v-if="special.auctionProImgList?.[0]">
                  <img :src="special.auctionProImgList[0]" class="grid-img" />
                </div>
                <!-- 第2张小图 -->
                <div class="img-item sub" v-if="special.auctionProImgList?.[1]">
                  <img :src="special.auctionProImgList[1]" class="grid-img" />
                </div>
              </div>
            </div>

            <!-- 专场信息区域 -->
            <div class="new-special-info">
              <h3 class="new-special-name">{{ special.name }}</h3>
              <div class="new-special-time">
                <span class="new-value">{{ special.end_date }} {{ $t("auction.jp") }}</span>
              </div>
              <div class="new-special-actions">
                <span class="new-item-count">{{ $t("auction.gong") }}{{ special.goodsTotal }}{{ $t("auction.jsp") }}</span>
                <button class="new-view-btn" @click="goToSpecialDetail(special)">{{ $t("auction.llzc") }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 热门拍品展示区域 -->
      <div class="hot-auction-container">
        <!-- 热门专场标题区域 -->
        <div class="auction-notice">
          <div class="notice-text">
            <span>{{ $t("auction.rm") }}</span>
            <span>{{ $t("auction.pp") }}</span>
          </div>
        </div>
        <!-- 商品网格容器（保持双列排列） -->
        <div class="hot-product-grid">
          <!-- 商品项：左右布局卡片 -->
          <div
            v-for="(product, index) in hotProducts"
            :key="index"
            class="hot-auction-card"
          >
            <!-- 左右布局容器（核心：用flex实现左右排列） -->
            <div class="hot-auction-layout">
              <!-- 左侧：商品图片区域 -->
              <div class="hot-auction-img-wrapper">
                <img
                  :src="product.img"
                  :alt="product.product_title"
                  @error="
              (e) => {
                e.target.src = require('~/static/images/default_picture.png');
              }
            "
                />
              </div>

              <!-- 右侧：商品信息区域 -->
              <div class="hot-auction-meta">
                <h3 class="hot-auction-meta__title">{{ product.product_title }}</h3>

                <div class="hot-auction-meta__price">
                  <span>{{ $t("auction.qpj") }}</span>
                  <span class="hot-auction-meta__amount">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice( product.starting_amt) }}</span>
                </div>

                <div class="hot-auction-meta__deadline">
                  <span>{{ $t("auction.jpsj") }}</span>
                  <span class="hot-auction-meta__value">{{ product.end_date }}</span>
                </div>

                <div class="hot-auction-meta__action-group">
                  <div class="hot-auction-meta__reserve">
                    {{ $t("auction.yjj") }} <span style=" color: #b21e2e;">{{ product.outNum || 0 }}</span> 次
                  </div>

                  <button class="hot-auction-meta__button" @click="goToProductDetail(product)">{{ $t("auction.cyjp") }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 店铺审核中弹窗 -->
    <div class="mask" v-if="mchStatus == 1">
      <div class="mchMask">
        <img src="~/static/images/inReview.png" alt="" />
        <p>{{ $t("Popup[0]") }}</p>
        <span>{{ $t("Popup[1]") }}</span>
        <div class="btnBox">
          <el-button @click="mchStatus = false" class="btn" type="danger">{{
            $t("Popup[2]")
          }}</el-button>
        </div>
      </div>
    </div>
    <div class="mask" v-if="mchStatus == 3">
      <div class="mchMask">
        <img src="~/static/images/unapprove.png" alt="" />
        <p>{{ $t("Popup[3]") }}</p>
        <span>{{ review_result }}</span>
        <div class="btnBox">
          <el-button class="btn" @click="mchStatus = false">{{
            $t("cancel")
          }}</el-button>
          <el-button class="btn" type="danger" @click="toapp()">{{
            $t("Popup[4]")
          }}</el-button>
        </div>
      </div>
    </div>
    <!-- 店铺审核中弹窗结束 -->
    <el-dialog title="" width="40%" :visible.sync="outerVisible">
      <div class="modal">
        <div id="output"></div>
        <!-- <img src="./static/images/app_code.png"> -->
        <h2>{{ $t("home_index.scanCodeWX") }}</h2>
        <!-- <p>秒杀业务已全面迁移至APP</p> -->
      </div>
    </el-dialog>
    <!-- <div class="mask" v-if="showVersion && versionUpdate">
      <div class="mask-content">
        <div class="margin-left">
          <img src="../static/images/bg_1314.png" class="mask_bg" alt=""></div>
        <div class="margin-right">
          <h1>版本升级通知</h1>
          <div class="title-content">
            <h2>公告内容</h2>
            <div class="content">
              <p v-html="content"></p>
            </div>
          </div>
          <el-button @click="closeVersion" type="primary" style="width: 113px;">我知道了</el-button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import ErrorImg from "@/static/images/default_picture.png";
import HeaderNavbar from "~/pages/auction/auction-nav.vue";
export default {
  components: {
    HeaderNavbar,
  },
  layout: "homeLayout",
  async asyncData({ app, $Api, store }) {
    let pc_user = app.$cookies.get("pc_user");
    let data1 = {
      api: "mall.Index.home",
      access_id: pc_user ? pc_user.access_id : "",
      cid: "",
      page: 1,
      pageSize: 8,
    };
    var data2 = {
      api: "mall.Index.index",
      access_id: pc_user ? pc_user.access_id : "",
    };
    var data0 = {
      api: "mall.User.getUserTell",
    };
    let [res0, res1, res2] = await Promise.all([
      $Api.doRequest(data0),
      $Api.doRequest(data1),
      $Api.doRequest(data2),
    ]);
    console.log("xxxxxxres0", res0);
    store.commit("layout/SET_DATA", res2.data);
    // store.commit("layout/getCache", res0);
    app.$storage.set("maintain_text", res0.data);

    return {
      pc_user: pc_user ?? {},
      login_status: !!res2.data?.login_status,
      banner: res1.data?.banner || "",
      list_seconds: "",
      coupon_list: "",
    };
  },
  data() {
    return {
      products: [],
      hotProducts:[],
      specials: [],

      mainImg: "",
      auctionProImgList_size: 0,
      showVersion: true,
      versionUpdate: false,
      content: "xxxxx",
      list_m: [], //会员商品
      imageHeight: "",
      loadFlag: true,
      outerVisible: false,
      pc_user: {},
      login_status: false,
      banner: [],
      list_r: [],
      list_x: [],
      list_seconds: {},
      end_time: "",
      hour: "00",
      min: "00",
      second: "00",
      logo: require("/static/home-img/logo.jpg"), //webpack环境提供require加载
      activeName: "second",
      defualtImg: require("/static/images/defualtImg1.png"),
      input: "",
      isGoods: false, //判断是否点击购物车
      isSearch: false, //判断是否点击搜索按钮
      isNav: false, //判断tab选项卡打开
      coupon_list: [],
      allClass: [],
      user_name: "",
      headUrl: "",
      goodList: [],
      nameList: [],
      pluginStatus: {},
      total: 0,
      pageNo: 1, //  加载次数
      classDetailShow: false,
      classDetailList: [],
      class_list: [],
      mchCoupon: {},
      navIndex: 0,
      message: {},
      tab_num: [],
      mchStatus: false,
      review_result: "",
      pageSize: 6,
    };
  },
  created() {
    if (!this.$cookies.get("pc_user")) {
      this.$cookies.set("pc_user", "{}");
    }
  },
  mounted() {
    this.auctionProds();
    this.auctionSpecial();
    this.auctionHotProds();

    setTimeout(() => {
      this.mchCoupon = this.$storage.get("mchCoupon");
      $("title").html(
        this.mchCoupon && this.mchCoupon.mallName
          ? `${this.mchCoupon.mallName}`
          : this.$t("title2")
      );
      let links = $("link");
      for (let i = 0; i < links.length; i++) {
        let link = $(links[i]);
        let rel = link[0].rel;
        rel = rel.toLowerCase();
        if (rel.indexOf("icon") > -1) {
          link[0].href =
            this.mchCoupon && this.mchCoupon
              ? this.mchCoupon.mallIcon
              : "/favicon.ico";
          break;
        }
      }
    }, 100);
    if (window.innerWidth) {
      var imageWidth = window.innerWidth;
      this.imageHeight = imageWidth * (450 / 1920);
    } else if (
      document.documentElement &&
      document.documentElement.clientWidth
    ) {
      var imageWidth = document.documentElement.clientWidth;
      this.imageHeight = imageWidth * (450 / 1920);
    } else {
      var imageWidth = document.body.offsetWidth;
      this.imageHeight = imageWidth * (450 / 1920);
    }
    this.$root.$emit("home");
    this.$root.$emit("search");

    this.axios();

    if (this.login_status) {
      this.getOderPayType();
      this.getOrderApi();
    }
  },
  methods: {
    //跳转到商品详情页
    goToProductDetail(product) {
      // 1. 初始化基础的query参数（必传项）
      const queryParams = {
        id: product.id,
        mchId: product.mchId,
        sourceNavIndex: 2 // 传递single-auction对应的导航索引（2）
      };

      // 2. 条件判断：仅当breadcrumbs存在且有值时才添加该参数
      if (this.breadcrumbs && Object.keys(this.breadcrumbs).length > 0) {
        queryParams.breadcrumbs = JSON.stringify(this.breadcrumbs);
      }

      // 3. 执行路由跳转
      this.$router.push({
        path: '/auction/product-detail',
        query: queryParams
      });
    },
    goToSpecialDetail(special) {
      this.$router.push({
        path: '/auction/special-detail',
        query: {
          specialId: special.id,
          breadcrumbs: JSON.stringify(this.breadcrumbs),
          sourceNavIndex: 3 // 传递single-auction对应的导航索引（2）
        }
      });
    },
    checkConfirm() {
      this.$router.push({
        path: "my/my/messageDetail?id=" + this.message.id,
      });
    },
    auctionProds(product) {
      var data = {
        api: "plugin.auction.pcAuction.search",
        pageNo: this.pageNo, //  加载次数
        pageSize: this.pageSize,
        //状态 1=未开始 2=进行中 3=已结束
        status: 1,
      };

      this.$Api
        .doRequest(data)
        .then((res) => {
          if (res.code == 200) {
            this.products = res.data.list;
            this.total = Number(res.data.total) || 0;
            // 计算是否显示箭头（total>6且total有效）
            this.isShowArrow = this.total > 6;
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    auctionHotProds(product) {
      var data = {
        api: "plugin.auction.pcAuction.getHotAuctionProList",
      };

      this.$Api
        .doRequest(data)
        .then((res) => {
          if (res.code == 200) {
            this.hotProducts = res.data.list;
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    auctionSpecial() {
      var data = {
        api: "plugin.auction.pcAuction.getHotSpecialList",
      };

      this.$Api
        .doRequest(data)
        .then((res) => {
          if (res.code == 200) {
            this.specials = res.data.list;
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },

    // 点击左箭头：上一页（循环）
    handlePrev() {
      // 计算总页数
      const totalPages = this.calcTotalPages();

      // 第一页点击上一页，跳转到最后一页
      this.pageNo = this.pageNo === 1 ? totalPages : this.pageNo - 1;

      // 重新请求数据
      this.auctionProds();
    },

    // 点击右箭头：下一页（循环）
    handleNext() {
      // 计算总页数
      const totalPages = this.calcTotalPages();
      // 最后一页点击下一页，跳转到第一页
      this.pageNo = this.pageNo >= totalPages ? 1 : this.pageNo + 1;

      // 重新请求数据
      this.auctionProds();
    },

    // 单独抽取总页数计算方法
    calcTotalPages() {
      if (!this.total || this.total <= 0 || !this.pageSize) {
        return 1; // 异常情况默认1页
      }
      // 计算总页数：向上取整，确保最后一页数据不丢失
      return Math.ceil(this.total / this.pageSize);
    },

    // 标签显示影藏
    handleIsShow(val) {
      if (this.mchCoupon?.shortcutMenu3?.indexOf(val) == -1) {
        return false;
      } else {
        return true;
      }
    },
    toapp() {
      this.mchStatus = false;
      this.$router.push({
        path: "/mch/applyShop",
        query: {
          edit: 1,
        },
      });
    },
    toMch() {
      let data = {
        api: "mch.mall.Mch.index",
      };
      this.$Api
        .doRequest(data)
        .then((res) => {
          let { data } = res;
          if (data.status == 0) {
            this.$router.push({
              path: "/mch/applyShop",
            });
          } else if (res.data.status == 2) {
            window.open(
              process.env.VUE_APP_LKT_MCH_DEFURL +
                "?token=" +
                encodeURIComponent(res.data.token)
            );
          } else {
            this.mchStatus = res.data.status;
            this.review_result = data.review_result;
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    getOrderApi() {
      var data = {
        api: "mall.Order.index",
        order:'JP',
        page: 1,
      };
      this.$Api
        .doRequest(data)
        .then((res) => {
          if (res.code == 200) {
            this.tab_num = res.data.res_order;
            console.log("getOrderApi", this.tab_num);
            this.getMessageApi();
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    getMessageApi() {
      let user = this.$cookies.get("pc_user") || {};
      if (Object.keys(user).length == 1) {
        return;
      }

      var data = {
        api: "mall.Message.index",
        page: 1,
      };
      this.$Api
        .doRequest(data)
        .then((res) => {
          if (res.code == 200) {
            this.message = res.data.message[0] || "";
            console.log("getMessageApi", this.message);
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    //获取支付方式
    getOderPayType() {
      let data = {
        api: "mall.Order.getPayment",
      };
      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          this.$storage.set("oderPayType", res.data);
        }
      });
    },

    unlogin() {
      this.$root.$emit("unlogin");
    },
    more(url, row) {
      this.$router.push({
        path: url,
        query: { s_type: row },
      });
    },
    carouselUrl(url) {
      location.href = url;
    },
    toUrl(url) {
      this.$router.push({
        path: url,
      });
    },
    // 请求
    axios() {
      var data = {
        api: "mall.Index.home",

        cid: "",
        page: 1,
        pageSize: 8,
      };
      this.$Api.doRequest(data).then((res) => {
        res.data.banner &&
          res.data.banner.filter((item) => {
            if (item.url.includes("&")) {
              let arr = item.url.split("&");
              arr[1] = arr[1].replace("?", "&");
              item.url = arr.join("&");
            }
          });
        this.banner = res.data.banner;

        this.list_r = res.data.list_r ?? [];
        this.list_x = res.data.list_x ?? [];
        this.list_m = res.data.list_m ?? [];
        this.coupon_list = res.data.coupon_list;
        this.pluginStatus = this.$cookies.get("pluginStatus") || {};
        this.user_name = this.pc_user.user_name;
        this.headUrl = this.pc_user.headimgurl;
        this.loadFlag = false;
      });
    },
  },
};
</script>
<style lang="scss">
@import "~/assets/css/home/home.css";
::-webkit-scrollbar {
  display: none;
}
.nav-content ::-webkit-scrollbar {
  display: block;
  cursor: e-resize !important;
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  // display: block;
  .mask-content {
    display: flex;
    top: 50% !important;
    background: none;
    width: 1140px;
    height: auto !important;
    margin: 0 auto;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    .margin-left {
      width: 667px;
      height: 636px;
      padding: 0;
      // background-color: pink;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin: 0;
      }
    }
    .margin-right {
      flex: 1;
      background-color: #fff;
      padding-left: 75px;
      border-radius: 0 12px 12px 0;
      h1 {
        margin-top: 85px;
        // text-align: center;
        color: #333333;
        font-size: 32px;
      }
      .title-content {
        height: 350px;
        width: 322px;
        padding-top: 56px;
        margin-bottom: 40px;

        .content {
          height: 267px;
          overflow-y: scroll;
          p > p > img {
            width: 100% !important;
            // object-fit: cover;
          }
        }
        h2 {
          font-size: 18px;
          margin-bottom: 12px;
          color: #333;
        }
        p {
          color: #666;
          font-size: 16px;
          word-wrap: break-word;
        }
      }
    }
  }
}
.mchMask {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 420px;
  height: 300px;
  background: rgba(255, 255, 255, 1);
}

.mchMask > p {
  font-size: 16px;
  line-height: 16px;
  margin-top: 14px;
  color: #020202;
}

.mchMask > span {
  display: block;
  color: #999999;
  font-size: 12px;
  line-height: 12px;
  margin-top: 10px;
}

.mchMask .btnBox {
  margin-top: 24px;
}

.mchMask .btnBox .btn {
  border-radius: 0;
  width: 112px;
  height: 36px;
  padding: 0;
}
.message-content {
  max-width: 120px;
  word-break: break-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.recent-preview {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}

.auction-notice {
  /* 1. 容器尺寸：按需调整（背景图会铺满这个大小） */
  width: 1000px; /* 适中宽度，避免太窄挤掉文字 */
  height: 60px; /* 足够高度，避免文字溢出 */
  margin: 0 auto 0; /* 水平居中，避免超出屏幕 */
  /* 2. 背景图铺满（不拉伸） */
  background-image: url("~/static/images/auction-notice.png");
  background-size: 100% 100%;
  /* 定位父级：文字绝对居中 */
  position: relative;
}

.auction-step-image {
  background-image: url("~/static/images/auction-step.png");
  /* 1. 容器尺寸：按需调整（背景图会铺满这个大小） */
  width: 1000px; /* 适中宽度，避免太窄挤掉文字 */
  height: 110px; /* 足够高度，避免文字溢出 */
  margin: 0 auto 0; /* 水平居中，避免超出屏幕 */
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  /* 定位父级：文字绝对居中 */
  position: relative;
}

.notice-text {
  /* 绝对定位：强制在容器正中间，不会被挤掉 */
  position: absolute;
  top: 0;
  left: 11px;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 文字强制高对比度（必显关键！） */
  color: #000; /* 纯黑色文字（不管背景是深/浅，都能看到） */
  font-size: 19px; /* 放大字体，更醒目 */
  font-weight: bold; /* 加粗 */
  text-shadow: 0 0 2px #fff; /* 白色文字阴影：进一步提升对比度，避免和背景融合 */
  white-space: nowrap; /* 禁止换行，避免被截断 */
  z-index: 10; /* 强制在背景图上方（防止被覆盖） */
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  max-width: 1200px; /* 可选：限制最大宽度（避免商品过多时拉太宽） */
  margin: 0 auto; /* 让容器自身居中（关键！） */
  padding: 60px 40px;
  border-radius: 8px 8px 8px 8px;
  position: relative;
}

.hot-product-class{
  display: grid;
  /* 关键：2列等宽，每列最小宽度 280px（适配小屏幕），超出自动换行 */
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: 20px; /* 商品项之间的间距（上下+左右） */
  padding: 0 16px; /* 左右留白，避免贴边 */
  margin-top: 16px;
}


.public-class {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  max-width: 1200px; /* 可选：限制最大宽度（避免商品过多时拉太宽） */
  margin: 0 auto; /* 让容器自身居中（关键！） */
  padding: 60px 40px;
  border-radius: 8px 8px 8px 8px;
  position: relative;
  img {
    width: 100%;
    height: 10%;
  }
}

.special-image {
  height: 345px;
  width: 274px;
  display: flex;
  flex-direction: column;
  img {
    object-fit: fill; /* 核心属性：强制铺满宽高，忽略图片原始比例 */
    object-position: center; /* 可选：确保图片居中裁剪/拉伸（默认也是center） */
    display: block;
    width: 100%;
    height: 100%;
  }
  > div {
    flex: 1;
    width: 100%;
  }
}

/* 小图通用样式 */
.sub-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.3); /* 白色边框区分小图 */
}
.auction-but {
  position: absolute;
  top: 48%;
  z-index: 100;
  width: 75%;
  display: flex;
  //
  justify-content: space-between;
  div {
    width: 50px;
    height: 50px;
    background: #000000;
    opacity: 0.4;
    border-radius: 50%;
    color: #fff;
    font-size: 30px;
    font-family: fangsong;
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.special-item {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  background-color: #fff;
}

.product-special:hover {
  transform: scale(1.03); /* 放大1.03倍（可调整数值，如1.05更明显） */
  border: 1px solid #b21e2e; /* 红色边框 */
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
}

.-item {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  background-color: #fff;
}

/* 商品卡片样式调整 */
.product-item {
  min-width: 240px; /* 最小宽度，避免小屏幕过窄 */
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease; /* 合并过渡效果 */
  background-color: #fff;
  box-sizing: border-box; /* 确保边框和内边距不影响宽度 */
}


.product-item:hover {
  transform: scale(1.03); /* 放大1.03倍（可调整数值，如1.05更明显） */
  border: 1px solid #b21e2e; /* 红色边框 */
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
}

.product-image {
  position: relative;
  overflow: hidden;
}

.product-image img {
  width: 300px;
  height: 300px;
  object-fit: cover;
}

.price-class {
  font-family: Microsoft YaHei, Microsoft YaHei;
  font-weight: bold;
  font-size: 28px;
  color: #b21e2e;
  line-height: 1;
}

.upcoming-badge {
  position: absolute;
  top: 20px; /* 可根据需求调整标签位置 */
  background-color: #00723a;
  color: white;
  padding: 4px 8px;
  font-size: 8px;
  height: 20px; /* 调整高度，适配文字+内边距 */
  width: 50px;
  display: flex; /* 让文字垂直居中 */
  align-items: center; /* 文字垂直居中 */
  justify-content: center; /* 文字水平居中 */
  box-sizing: border-box; /* 让 padding 不影响总宽高 */
}

.triangle {
  position: absolute;
  top: 50%;
  left: 100%; /* 箭头紧贴徽章右侧 */
  transform: translateY(-50%); /* 精准垂直居中 */
  width: 0; /* 三角形无需宽度，靠边框实现 */
  height: 0; /* 三角形无需高度，靠边框实现 */
  border-top: 10px solid transparent; /* 上透明三角 */
  border-bottom: 10px solid transparent; /* 下透明三角 */
  border-left: 6px solid #00723a; /* 左红色三角（指向右） */
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  /* 关键属性：设置宽度，超出显示省略号 */
  text-overflow: ellipsis;
  width: 200px;
}

.price-info,
.time-info {
  display: flex;
  justify-content: left;
  margin-bottom: 8px;
  font-size: 14px;
  gap: 3px;
}

.price-info {
  align-items: end;
}

.label {
  color: #666;
}

.value {
  color: #666;
  margin-left: 10px;
}

.favorite-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.favorite-count {
  font-size: 14px;
  color: #999;
  margin-left: auto;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s ease;
}

.favorite-btn:hover,
.favorite-btn.active {
  color: #e60000;
}

.flex_left {
  cursor: pointer;
}

.flex_top-name {
  cursor: pointer;
}


//热门专场样式
/* 容器外层 - 独立命名 */
.new-hot-special-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.new-decor-line {
  position: absolute;
  top: 50%;
  width: 40px;
  height: 1px;
  background-color: #ddd;
}

.new-decor-line-left {
  left: 0;
  transform: translateX(-120%);
}

.new-decor-line-right {
  right: 0;
  transform: translateX(120%);
}

/* 网格布局 - 独立命名 */
.new-public-class {
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* 与商品区域保持一致的15px间距 */
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* 热门专场 - 1行4列 */
.new-special-item {
  width: calc(25% - 11.25px); /* 保持4列布局 */
  min-width: 200px;
  max-width: 220px;
  border: none; /* 去掉原边框 */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 增加轻微阴影 */
  background-color: #fff;
  transition: all 0.3s ease;
}

.new-special-item:hover {
  transform: scale(1.03); /* 放大1.03倍（可调整数值，如1.05更明显） */
  border: 1px solid #b21e2e; /* 红色边框 */
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
}

/* 4列布局的响应式调整 */
@media (max-width: 992px) {
  .new-special-item {
    width: calc(50% - 10px); /* 中等屏幕2列 */
  }
}
@media (max-width: 576px) {
  .new-special-item {
    width: 100%; /* 小屏幕1列 */
  }
}

/* 图片网格容器 */
.new-special-image {
  width: 100%;
  overflow: hidden;
}
.img-grid {
  display: grid;
  width: 100%;
  gap: 4px; /* 图片间的小间距 */
  background-color: #fff; /* 间距背景设为白色，形成分割线效果 */
}

/* 1. 只有主图：占满整个区域 */
.img-grid.only-main {
  grid-template-columns: 1fr;
  grid-template-rows: 240px; /* 固定图片总高度 */
}

/* 2. 主图+1张小图：左右拼接（各占50%宽度） */
.img-grid.one-sub {
  grid-template-columns: 1fr 1fr; /* 2列均分 */
  grid-template-rows: 240px; /* 固定总高度 */
}

/* 3. 主图+2张小图：品字形（主图上，小图下并排） */
.img-grid.two-subs {
  grid-template-columns: 1fr 1fr; /* 2列 */
  grid-template-rows: 160px 80px; /* 主图高160，小图总高80 */

}
/* 品字形时主图跨2列 */
.img-grid.two-subs .img-item.main {
  grid-column: 1 / 3; /* 横跨两列 */
  grid-row: 1 / 2; /* 占第一行 */
}
.img-grid.two-subs .img-item.sub:nth-child(2) {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.img-grid.two-subs .img-item.sub:nth-child(3) {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}

/* 图片通用样式 */
.img-item {
  overflow: hidden;
}
.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例裁剪 */
  transition: transform 0.3s ease;
}
.img-item:hover .grid-img {
  transform: scale(1.05); /* hover放大效果 */
}

/* 信息区域 - 独立命名 */
.new-special-info {
  padding: 12px 15px; /* 减少内边距，让文字更紧凑 */
}

.new-special-name {
  font-size: 16px;
  font-weight: 600; /* 加粗更明显 */
  color: #333;
  margin: 0 0 8px 0;
  display: -webkit-box; /* 多行省略 */
  -webkit-line-clamp: 2; /* 最多2行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4; /* 行高适中 */
}

.new-special-time .new-value {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  display: block; /* 单独占一行 */
}

.new-special-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.new-item-count {
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 3px;
}

.new-view-btn {
  background-color: #B21E2E;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.new-view-btn:hover {
  background-color: #9e1a28; /* 加深hover色 */
}

/* 响应式调整 - 独立命名 */
@media (max-width: 992px) {
  .new-public-class {
    grid-template-columns: repeat(2, 1fr); /* 中等屏幕2列 */
  }
}

@media (max-width: 576px) {
  .new-public-class {
    grid-template-columns: 1fr; /* 小屏幕1列 */
  }
}

//热门拍品样式
/* 外层容器 */
.hot-auction-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
/* 商品网格：保持双列布局 */
.hot-product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 970px;
}

/* 卡片容器 */
.hot-auction-card {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #fff;
  margin-top: 30px;
}

.hot-auction-card:hover {
  transform: scale(1.03); /* 放大1.03倍（可调整数值，如1.05更明显） */
  border: 1px solid #b21e2e; /* 红色边框 */
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
}

/* 核心：左右布局容器（用flex横向排列） */
.hot-auction-layout {
  display: flex; /* 横向排列子元素 */
  height: 100%; /* 确保高度一致 */
}

/* 左侧图片区域：固定宽度占比 */
.hot-auction-img-wrapper {
  width: 50%; /* 图片占40%宽度 */
  flex-shrink: 0; /* 不压缩 */
  height: 160px; /* 固定高度，确保卡片整齐 */
  overflow: hidden;
}

.hot-auction-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例裁剪 */
  transition: transform 0.5s ease;
}

.hot-auction-card:hover .hot-auction-img-wrapper img {
  transform: scale(1.05);
}

/* 右侧信息区域：占剩余宽度 */
.hot-auction-meta {
  width: 50%; /* 文字占60%宽度 */
  padding: 15px;
  display: flex;
  flex-direction: column; /* 文字内部纵向排列 */
  justify-content: center; /* 垂直居中对齐 */
  gap: 6px;
}

/* 标题样式 */
.hot-auction-meta__title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 最多两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

/* 价格样式 */
.hot-auction-meta__price {
  margin-top: 2px;
}

.hot-auction-meta__currency {
  color: #b21e2e;
  font-weight: 600;
}

.hot-auction-meta__amount {
  color: #b21e2e;
  font-size: 16px;
  font-weight: 700;
  margin-left: 5px;
}
.hot-auction-meta__value{
  margin-left: 5px;
}

/* 截拍时间和预约次数 */
.hot-auction-meta__deadline {
  font-size: 12px;
  color: #666;
}

.hot-auction-meta__reserve {
  font-size: 12px;
  color: #999;
  align-self: center;
}


.hot-auction-meta__action-group {
  display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 垂直居中对齐（可选，让元素更整齐） */
  margin-top: 8px; /* 原按钮的 margin-top 移到容器上，控制与上方元素的间距 */
}

/* 按钮样式 */
.hot-auction-meta__button {
  background: #b21e2e;
  color: #fff;
  border: none;
  border-radius: 2px;
  height: 30px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  width: 40%; /* 按钮右侧宽度 */
}

.hot-auction-meta__button:hover {
  background: #a01a28;
}

/* 响应式：小屏幕自动切换为上下布局（避免文字挤压） */
@media (max-width: 768px) {
  .hot-product-grid {
    grid-template-columns: 1fr; /* 单列布局 */
  }

  /* 小屏幕恢复上下布局，提升可读性 */
  .hot-auction-layout {
    flex-direction: column; /* 纵向排列 */
  }

  .hot-auction-img-wrapper {
    width: 100%; /* 图片占满宽度 */
    height: 180px;
  }

  .hot-auction-meta {
    width: 100%; /* 文字占满宽度 */
  }
}
</style>
