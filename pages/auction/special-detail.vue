<template>
  <div>
    <!-- 固定组件 -->
    <Header/>
    <HeaderNavbar :sourceNavIndex="sourceNavIndex"/>
    <nuxt :key="$route.fullPath" />
    <Body></Body>

    <div class="auction-page">
      <!-- 面包屑导航 -->
      <AuctionBreadcrumb
        :breadcrumbs="breadcrumbs"
        :categories="categories"
        :navTitle="navTitle"
        :parent-instance="this"
        @breadcrumb-click="handleBreadcrumbClick"
      />

      <!-- 专场详情核心容器 -->
      <div class="special-detail-wrapper">
        <!-- 专场详情模块 -->
        <div class="special-detail-module">
          <!-- 专场头部信息 -->
          <div class="special-header" v-if="specialDetail">
            <div class="special-top-bar">
              <!-- 左侧：图片 + 名称 + 竖向信息 -->
              <div class="left-section">
                <!-- 单张专场图片 -->
                <img :src="specialDetail.specialImg" class="special-img" :alt="specialDetail.specialName">

                <!-- 名称 + 竖向信息 -->
                <div class="info-section">
                  <h1 class="special-title">{{ specialDetail.specialName }}</h1>
                  <div class="meta-left">
                    <div class="meta-item">
                      <img class="icon" src="~/static/images/grzx.png" alt="" />
                      <span class="meta-value">{{ specialDetail.lookNum }}</span>
                      <span class="meta-label">{{ $t("auction.wg") }}</span>
                    </div>
                    <div class="meta-item">
                      <img class="icon" src="~/static/images/jp.png" alt="" />
                      <span class="meta-value">{{ specialDetail.auctionNum }}</span>
                      <span class="meta-label">{{ $t("auction.jpp") }}</span>
                    </div>
                    <div class="meta-item">
                      <img class="icon" src="~/static/images/djs.png" alt="" />
                      <span class="meta-text">{{ specialDetail.startDate }} {{ $t("auction.zhi") }} {{ specialDetail.endDate }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 右侧：倒计时 -->
              <div class="countdown-right">
                <span class="countdown-text">{{ $t("auction.jjs") }}</span>
                <div class="countdown-nums">
                  <span class="countdown-box">{{ countdownHours }}</span>
                  <span class="countdown-split">:</span>
                  <span class="countdown-box">{{ countdownMinutes }}</span>
                  <span class="countdown-split">:</span>
                  <span class="countdown-box">{{ countdownSeconds }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 场次&排序&商品模块（整体与头部加间距） -->
        <div class="session-sort-product-module">
          <!-- 场次标签（原型样式） -->
          <div class="session-tabs-proto" v-if="sessionList.length > 0">
            <div
              class="session-tab-proto"
              :class="{ active: activeSessionId === item.sessionId }"
              v-for="item in sessionList"
              :key="item.sessionId"
              @click="handleSessionClick(item)"
            >
              <div class="session-name">{{ item.name }}</div>
              <div class="session-time">
                <template v-if="item.status === 1">
                  {{ item.start_date }} {{ $t("auction.ks") }}
                </template>
                <template v-else-if="item.status === 2">
                  {{ item.end_date }} {{ $t("auction.jp") }}
                </template>
                <template v-else-if="item.status === 3">
                  {{ $t("auction.yjs") }}
                </template>
              </div>
            </div>
          </div>

          <!-- 排序筛选（原型样式） -->
          <div class="sort-bar-proto">
            <button class="sort-btn-proto" :class="{ active: sortType === 'default' }" @click="changeSortType('default')"> {{ $t("auction.mr") }}</button>
            <button class="sort-btn-proto" :class="{ active: sortType !== 'default' }" @click="togglePriceSort">
              {{ $t("auction.jg") }}
              <div class="arrow-group">
                <i class="el-icon-caret-top" :class="{ active: sortType === 0 }"></i>
                <i class="el-icon-caret-bottom" :class="{ active: sortType === 1 }"></i>
              </div>
            </button>
          </div>
        </div>

        <!-- 商品列表加载状态 -->
        <div v-if="goodsLoading" style="text-align: center; padding: 50px 0;">
          加载中...
        </div>

        <!-- 商品列表（原型2列布局） -->
        <div class="product-list-proto" v-else>
          <div v-if="productList.length === 0" style="text-align: center; padding: 50px 0; color:#999;">
            暂无该场次的商品数据
          </div>
          <div class="product-item-proto" v-for="(item, index) in productList" :key="index">
            <!-- 商品图片 -->
            <div class="product-img-proto">
              <img :src="item.img" :alt="item.goodsName" @error="
                  (e) => {
                    e.target.src = require('~/static/images/default_picture.png');
                  }
                ">
            </div>
            <!-- 商品信息 -->
            <div class="product-info-proto">
              <div class="product-name-proto">{{ item.goodsName }}</div>
              <div class="product-spec-proto"> {{ $t("auction.gg") }}：{{ item.attribute }}</div>
              <div class="product-price-proto">
                <span class="price-label-proto">{{ item.status === 1 ? $t("auction.qpj") : $t("auction.dqj") }}：</span>
                <span class="price-value-proto">{{$LaiKeCommObject.show_symbol}}{{ item.status === 1 ? $LaiKeCommObject.formatPrice(item.starting_amt) :  $LaiKeCommObject.formatPrice(item.price) }}</span>
              </div>
              <div class="product-bid-info-proto">
                <span class="bid-count-proto">{{$t("auction.yjj")}}<span style="color:#B21E2E;font-weight:600;">{{ item.outNum }}</span>{{$t("auction.ci")}}</span>
                <!-- 核心：只有status=2 竞拍中 才显示按钮 -->
                <button class="join-bid-btn-proto" v-if="item.status === 2" @click="goToProductDetail(item)" >{{$t("auction.cyjp")}}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div class="pagination-container" v-if="productList.length > 0">
        <ul class="pagination">
          <li
            class="page-item prev"
            @click="changePage(pageNo - 1)"
            :class="{ disabled: pageNo === 1 }"
          >
            <span>&lt;</span>
          </li>
          <li
            v-for="item in visiblePages"
            :key="item.value"
            class="page-item"
            :class="{
              active: item.type === 'page' && item.value === pageNo,
              ellipsis: item.type === 'ellipsis'
            }"
            @click="item.type === 'page' && changePage(item.value)"
          >
            <span>{{ item.value }}</span>
          </li>
          <li
            class="page-item next"
            @click="changePage(pageNo + 1)"
            :class="{ disabled: pageNo === totalPages }"
          >
            <span>&gt;</span>
          </li>
        </ul>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
// 导入组件
import HeaderNavbar from '~/pages/auction/auction-nav.vue'
import Header from "@/components/pageHeader.vue";
import Footer from "@/components/pageFooter.vue";
import Body from "@/components/navRight.vue";
import AuctionBreadcrumb from "@/pages/auction/AuctionBreadcrumb.vue";

export default {
  components: {
    Header,
    HeaderNavbar,
    Footer,
    Body,
    AuctionBreadcrumb
  },
  data() {
    return {
      // 面包屑配置
      breadcrumbs: [],
      navTitle: '',
      categories: [],
      // 专场ID
      specialId: '',
      // 专场详情
      specialDetail: null,
      // 场次列表
      sessionList: [],
      // 激活场次ID
      activeSessionId: '',
      // 加载状态
      loading: false,
      // 商品列表加载状态（独立）
      goodsLoading: false,
      // 倒计时
      countdownHours: '00',
      countdownMinutes: '00',
      countdownSeconds: '00',
      countdownTimer: null,
      // 排序 【核心修改】：初始值改为 'default' 字符串，切换价格后为数字 0/1
      sortType: 'default',
      // 商品列表
      productList: [],
      sourceNavIndex: -1,
      total:0,
      pageNo: 1,
      pageSize: 12,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },
    visiblePages() {
      const pages = [];
      const maxShow = 5;
      if (this.totalPages <= maxShow) {
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push({ value: i, type: 'page' });
        }
      } else {
        let start = Math.max(1, this.pageNo - 2);
        let end = Math.min(this.totalPages, start + maxShow - 1);
        if (end - start < maxShow - 1) {
          start = Math.max(1, end - maxShow + 1);
        }
        if (start > 1) {
          pages.push({ value: 1, type: 'page' });
          if (start > 2) pages.push({ value: '...', type: 'ellipsis' });
        }
        for (let i = start; i <= end; i++) {
          pages.push({ value: i, type: 'page' });
        }
        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push({ value: '...', type: 'ellipsis' });
          pages.push({ value: this.totalPages, type: 'page' });
        }
      }
      return pages;
    }
  },
  mounted() {
    document.body.style.backgroundColor = '#F6F6F6';
    document.body.style.background = '#F6F6F6';
    document.body.style.minHeight = '100vh';
    // 获取专场ID
    this.specialId = this.$route.query.specialId || '';
    // 初始化导航索引
    this.sourceNavIndex = this.$route.query.sourceNavIndex ? Number(this.$route.query.sourceNavIndex) : -1;
    // 初始化面包屑
    this.initBreadcrumbs();
    // 请求数据
    if (this.specialId) {
      this.getSpecialDetailData();
      this.getSessionListData();
      this.lookSpecial(this.specialId);
    }
  },
  beforeDestroy() {
    // 清除倒计时定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  methods: {

    //围观专场
    lookSpecial(specialId){
      var data = {
        api: "plugin.auction.AppAuction.lookSpecial",
        specialId: specialId
      };
      this.$Api.doRequest(data).then((res) => {
      }).catch(error => {
        this.$message.error(error.message)
      });
    },
    //跳转到商品详情页
    goToProductDetail(product) {
      // 1. 初始化基础的query参数（必传项）
      const queryParams = {
        id: product.acId,
        mchId: product.mchId,
        sourceNavIndex: this.sourceNavIndex,
        specialId: this.specialId,
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
    // 初始化面包屑
    initBreadcrumbs() {
      const originBreadcrumbs = this.$route.query.breadcrumbs;
      let baseBreadcrumbs = [];

      if (originBreadcrumbs) {
        try {
          baseBreadcrumbs = JSON.parse(originBreadcrumbs);
        } catch (e) {
          console.warn('面包屑参数解析失败：', e);
          baseBreadcrumbs = [
            { name: this.$t("auctionSession"), type: 'home', path: '/' }
          ];
        }
      } else {
        baseBreadcrumbs = [
          { name: this.$t("auctionSession"), type: 'home', path: '/' }
        ];
      }

      this.breadcrumbs = [
        ...baseBreadcrumbs,
        {
          name: this.$t("auction.zcxq"),
          type: 'nav',
          path: this.$route.path
        }
      ];
      this.navTitle = this.$t("auctionSession");
    },
    // 请求专场详情
    getSpecialDetailData() {
      this.loading = true
      var data = {
        api: "plugin.auction.pcAuction.specialDetail",
        specialId: this.specialId
      };

      this.$Api.doRequest(data).then((res) => {
        this.specialDetail = res.data;
        this.loading = false
        this.initCountdown();
      }).catch(error => {
        this.loading = false
        this.$message.error(error.message || '获取专场详情失败')
      });
    },
    // 请求场次列表
    getSessionListData() {
      const data = {
        api: "plugin.auction.pcAuction.getAllSessionList",
        specialId: this.specialId
      };

      this.$Api.doRequest(data).then((res) => {
        this.sessionList = res.data.sessionList || [];
        // 默认激活第一个场次
        if (this.sessionList.length > 0) {
          const firstActive = this.sessionList[0];
          this.activeSessionId = firstActive.sessionId;
          this.getSessionGoodsList();
        }
      }).catch(error => {
        this.$message.error(error.message || '获取场次列表失败')
      });
    },
    // 切换场次点击事件
    handleSessionClick(item) {
      this.activeSessionId = item.sessionId;
      this.getSessionGoodsList();
    },
    // 核心修改 ✅ 重点：获取场次商品列表接口，匹配最新传参规则
    getSessionGoodsList() {
      if (!this.activeSessionId) return;
      this.goodsLoading = true;
      // 核心规则：默认排序 sortType 完全不传参；价格排序才传数字sortType
      const data = {
        api: "plugin.auction.pcAuction.getSessionGoodsList",
        sessionId: this.activeSessionId,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      // 只有非默认排序时，才追加sortType数字参数
      if (this.sortType !== 'default') {
        data.sortType = this.sortType;
      }

      this.$Api.doRequest(data).then((res) => {
        this.productList = res.data.list || [];
        this.total = res.data.total || 0;
        this.goodsLoading = false;
      }).catch(error => {
        this.productList = [];
        this.goodsLoading = false;
        this.$message.error(error.message || '获取商品列表失败');
      });
    },
    // 切换为默认排序
    changeSortType(type) {
      this.sortType = type;
      this.pageNo = 1;
      this.getSessionGoodsList();
    },
    // 价格排序切换 ✅ 核心修改：数字传参规则 1=倒序，0=升序
    togglePriceSort() {
      // 切换：1(倒序) ↔ 0(升序)
      this.sortType = this.sortType === 1 ? 0 : 1;
      this.getSessionGoodsList();
    },
    // 初始化倒计时
    initCountdown() {
      if (this.countdownTimer) clearInterval(this.countdownTimer);

      const calculateCountdown = () => {
        if (!this.specialDetail?.endDate) return;

        const endTime = new Date(this.specialDetail.endDate).getTime();
        const nowTime = new Date().getTime();
        const diffTime = endTime - nowTime;

        if (diffTime <= 0) {
          this.countdownHours = '00';
          this.countdownMinutes = '00';
          this.countdownSeconds = '00';
          clearInterval(this.countdownTimer);
          return;
        }

        this.countdownHours = this.formatNumber(Math.floor(diffTime / (1000 * 60 * 60)));
        this.countdownMinutes = this.formatNumber(Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60)));
        this.countdownSeconds = this.formatNumber(Math.floor((diffTime % (1000 * 60)) / 1000));
      };

      calculateCountdown();
      this.countdownTimer = setInterval(calculateCountdown, 1000);
    },
    // 数字补零
    formatNumber(num) {
      return num < 10 ? `0${num}` : num;
    },
    // 面包屑点击
    handleBreadcrumbClick() {},

    changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.pageNo) return;
      this.pageNo = page;
      this.getSessionGoodsList();
    },
  }
};
</script>

<style scoped>
/* 页面基础容器 */
.auction-page {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}

/* 专场详情外层容器 */
.special-detail-wrapper {
  border-radius: 8px;
  padding: 20px;
}

/* 专场详情模块 - 与场次模块的间距 */
.special-detail-module {
  margin-bottom: 25px;
}

/* 场次&排序&商品 整体模块 - 与头部的间距 */
.session-sort-product-module {
  width: 100%;
  margin-top: 25px;
  background-color: #fff;
}

/* 专场头部样式 */
.special-header {
  padding: 15px;
  border-radius: 4px;
  background: #fff;
}
.special-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.left-section {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}
.special-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}
.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.special-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}
.meta-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.meta-value {
  color: #B21E2E;
  font-weight: 600;
}
.meta-label {
  color: #333;
}
.meta-text {
  color: #666;
}
.icon{
  width: 16px;
  height: 16px;
  display: inline-block;
}

/* 倒计时样式 */
.countdown-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.countdown-text {
  color: #B21E2E;
}
.countdown-nums {
  display: flex;
  align-items: center;
  gap: 4px;
}
.countdown-box {
  background: #B21E2E;
  color: #fff;
  padding: 2px 8px;
  border-radius: 2px;
  font-weight: 600;
  min-width: 28px;
  text-align: center;
}
.countdown-split {
  color: #B21E2E;
  font-weight: 600;
}

/* 场次标签（原型样式） */
.session-tabs-proto {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}
.session-tab-proto {
  padding: 10px 20px;
  text-align: center;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}
.session-tab-proto.active {
  border-bottom: 2px solid #B21E2E;
}
.session-tab-proto.disabled {
  color: #999;
  cursor: not-allowed;
}
.session-tab-proto.active .session-name {
  color: #B21E2E;
  font-weight: 600;
}
.session-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 2px;
}
.session-time {
  font-size: 12px;
  color: #999;
}

/* 排序筛选（原型样式） */
.sort-bar-proto {
  display: flex;
  gap: 20px;
  padding: 10px 0;
  margin-bottom: 20px;
}
.sort-btn-proto {
  background: transparent;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px; /* 价格文字 和 箭头组 的间距 */
}
.sort-btn-proto.active {
  color: #B21E2E;
  font-weight: 600;
}
/* 核心样式：箭头组 强制上下排列 */
.arrow-group {
  display: flex;
  flex-direction: column;
  line-height: 1;
}
/* 两个箭头默认灰色，大小适配 */
.sort-btn-proto .el-icon-caret-top,
.sort-btn-proto .el-icon-caret-bottom {
  font-size: 9px;
  color: #ccc;
  line-height: 6px;
}
/* 选中升序=0 上箭头红，选中降序=1 下箭头红 */
.sort-btn-proto .el-icon-caret-top.active,
.sort-btn-proto .el-icon-caret-bottom.active {
  color: #B21E2E;
}

/* 商品列表（原型2列布局） */
.product-list-proto {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.product-item-proto {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
.product-item-proto:hover {
  transform: scale(1.03); /* 放大1.03倍（可调整数值，如1.05更明显） */
  border: 1px solid #b21e2e; /* 红色边框 */
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
}
.product-img-proto {
  width: 180px;
  height: 150px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
}
.product-img-proto img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-info-proto {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.product-name-proto {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-spec-proto {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}
.product-price-proto {
  margin-bottom: 10px;
}
.price-label-proto {
  font-size: 12px;
  color: #666;
}
.price-value-proto {
  font-size: 16px;
  color: #B21E2E;
  font-weight: 600;
}
.product-bid-info-proto {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bid-count-proto {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 3px;
}
.join-bid-btn-proto {
  background: #B21E2E;
  color: #fff;
  border: none;
  border-radius: 2px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
}

.pagination-container {
  margin: 40px auto;
  text-align: center;
}

.pagination {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.page-item {
  width: 36px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  background-color: #fff;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f5f5;
    color: #B21E2E;
  }

  &.active {
    background-color: #B21E2E;
    color: #fff;
    font-weight: 600;
  }

  &.disabled {
    color: #ccc;
    cursor: not-allowed;
    background-color: #f5f5f5;

    &:hover {
      color: #ccc;
      background-color: #f5f5f5;
    }
  }

  &.prev, &.next {
    font-size: 20px;
    line-height: 38px;
  }
  &.ellipsis {
    cursor: default;
    background: transparent;
    pointer-events: none;

    &:hover {
      background: transparent;
      color: #666;
    }
  }
}

.page-item:has(span:contains('...')) {
  cursor: default;
  background: transparent;

  &:hover {
    background: transparent;
    color: #666;
  }
}
</style>
