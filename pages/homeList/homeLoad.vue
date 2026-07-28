<template>
  <div id="app">
    <div
      class="border"
      style="width: 100%; height: 1px; margin-bottom: 20px; background: #e6e6e6"
    ></div>

    <div class="container">
      <div class="condition">
        <!-- 组件 -->
        <div style="display: flex">
          <el-breadcrumb
            v-if="searchName"
            separator-class="el-icon-arrow-right"
          >
            <el-breadcrumb-item>{{ $t("homList.home") }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ searchName }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="pageBox" v-if="total > 0">
            <img
              :class="{ disabled: page == 1 }"
              @click="pageChange(0)"
              src="~/static/images/jianrou_l.png"
              alt=""
            />
            <div>
              <span>{{ page }}</span>
              /{{ pageAll }}
            </div>
            <img
              :class="{ disabled: page == pageAll }"
              @click="pageChange(1)"
              src="~/static/images/jiantou_r.png"
              alt=""
            />
          </div>
        </div>

        <!-- main start -->
        <div class="my-main" v-if="s_type != 5">
          <ul v-if="!loadFlag">
            <li
              v-for="(item, index) of proList"
              :key="index"
              @click="toUrlpt(item, searchName)"
            >
              <div class="relative">
                <img :src="item.imgUrl" alt="" @error="handleErrorImg"/>
                <div class="proDown proDown_one" v-if="item.recycle == 1">
                  <!-- 已过期 -->
                  {{ $t("shoppingCart.ygq") }}
                </div>
                <div
                  class="proDown proDown_one"
                  v-if="item.status == 3 && item.recycle != 1"
                >
                  <!-- 已下架 -->
                  {{ $t("home_index.shelf") }}
                </div>
                <div
                  class="proDown proDown_one"
                  v-if="item.num <= 0 && item.recycle != 1 && item.status != 3"
                >
                  <!-- 已售罄 -->
                  {{ $t("shoppingCart.ysq") }}
                </div>
              </div>
              <p>{{ item.product_title }}</p>
              <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
            </li>
          </ul>
          <ul v-else>
            <li v-for="i in 8">
              <img class="nonavtitle" src="" alt="" />
              <p class="nonavtitle" style="display: block"></p>
              <span
                class="nonavtitle"
                style="
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 100px;
                "
              ></span>
            </li>
          </ul>
        </div>
        <!-- main end -->
        <!-- huiyuan start -->
        <div class="huiyuan" v-if="s_type == 5">
          <ul v-if="!loadFlag">
            <li
              class="relative"
              v-for="(item, index) in vipList"
              :key="index"
              @click="toUrl(item, 3)"
            >
              <div class="box">
                <img class="vip" :src="item.imgurl" alt=""  @error="handleErrorImg" />
                <div class="stores"><span>会员商品</span></div>
              </div>
              <div class="price">
                <div style="margin-bottom: 10px">{{ item.product_title }}</div>
                <div>
                  <span class="wenzi">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.vipPrice) }}</span>
                  <span class="two">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
                </div>
              </div>
            </li>
          </ul>
          <ul v-else>
            <li v-for="i in 8">
              <img class="nonavtitle" src="" alt="" />
              <p class="nonavtitle" style="display: block"></p>
              <span
                class="nonavtitle"
                style="
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 100px;
                "
              ></span>
            </li>
          </ul>
          <!-- huiyuan end -->
        </div>
        <div
          v-if="total > 0"
          class="paginationBox"
          style="padding-bottom: 68px; justify-content: center"
        >
          <el-pagination
            :page-size="8"
            :current-page.sync="page"
            @current-change="currentChange"
            background
            layout="prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ErrorImg from '@/static/images/default_picture.png'

export default {
  layout: "homeLayout",
  async asyncData({ app, query, $Api }) {
    let pc_user = app.$cookies.get("pc_user");
    let s_type = query.s_type;
    if (s_type == 5) {
      var data = {
        api: "plugin.member.MallMember.memberProList",

        page: 1, //  加载次数
        pageSize: 8,
      };
    } else {
      var data = {
        api: "mall.Index.loadHome",

        s_type: s_type,
        page: 1, //  加载次数
        pageSize: 8,
      };
    }
    let res = await $Api.doRequest(data);

    return {
      pc_user,
      s_type: s_type,
      loadFlag: false,
      total: res.data.total,
      proList: res.data.list,
      vipList: res.data.list,
    };
  },
  data() {
    return {
      loadFlag: true,
      total: 0, //商品总数
      pc_user: {},
      searchName: "",

      proList: [],
      vipList: [], //会员商品列表
      page: 1, //  加载次数
      s_type: "", // 产品值属性 1：新品,2：热销，3：推荐
      blockId: "",
    };
  },
  computed: {
    pageAll() {
      return Math.ceil(this.total / 8);
    },
  },
  watch: {
    page(val) {
      if (this.s_type == 5) {
        this.getApi();
      } else {
        this.axios();
      }
    },
  },
  mounted() {
    if (this.$route.query.s_type) {
      this.s_type = this.$route.query.s_type;
    }
    if (this.s_type == 5) {
      this.searchName = this.$t("homList.tj[3]");
    } else if (this.s_type == 6) {
      this.searchName = this.$route.query.ClassName;
    }
    if (this.$route.query.blockId) {
      this.blockId = this.$route.query.blockId;
    }
    if (this.s_type == 5) {
      this.getApi();
    } else {
      this.axios();
    }
  },
  methods: {
    handleErrorImg (e) {
      e.target.src = ErrorImg
    },
    pageChange(type) {
      if (type == 0 && this.page > 1) {
        this.page = Number(this.page) - 1;
      } else if (type == 1 && this.page < this.pageAll) {
        this.page = Number(this.page) + 1;
      }
    },
    toUrl(item, row) {
      if (this.$storage.get("pluginStatus").isVip) {
        this.$router.push({
          path: "/homedetail/homedetail",
          query: { id: item.id, ClassName: row },
        });
      } else {
        this.$message.warning(this.$t("memberCenter.qxkthy"));
      }
    },
    toUrlpt(item, row) {
        this.$router.push({
          path: "/homedetail/homedetail",
          query: { id: item.id, ClassName: row },
        });
    },
    currentChange(e) {
      this.page = e;
    },
    getApi() {
      var data = {
        api: "plugin.member.MallMember.memberProList",

        // s_type: this.s_type,
        page: this.page, //  加载次数
        pageSize: 8,
      };
      this.$Api.doRequest(data).then((res) => {
        this.vipList = res.data.list;
        this.total = res.data.total;
        this.loadFlag = false;
      });
    },
    // 请求
    axios() {
      var data = {
        api: "mall.Home.getGoodsListByBlockId",
        blockId: this.blockId,

        s_type: this.s_type,
        page: this.page, //  加载次数
        pageSize: 8,
      };

      this.$Api.doRequest(data).then((res) => {
        this.total = res.data.total;
        this.proList = res.data.list;
        this.loadFlag = false;
      });
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/homeList/homeLoad.css";
</style>
