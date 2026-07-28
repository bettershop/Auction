<template>
  <div>
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

      <!-- 店铺头部信息（原型图顶部区域） -->
      <div class="shop-header">
        <!-- 左侧大图区域 -->
        <div class="shop-header-banner">
          <img :src="shopInfo.headImg || require('~/static/images/default_picture.png')" class="shop-banner-img" alt="店铺头像">
        </div>
        <!-- 右侧信息+收藏区域 -->
        <div class="shop-header-right-wrap">
          <div class="shop-header-middle">
            <!-- Logo+名称+所在地 -->
            <div class="shop-logo-name-location">
              <img :src="shopInfo.logo"  @error="
                  (e) => {
                    e.target.src = require('~/static/images/default_picture.png');
                  }"  class="shop-header-logo" alt="店铺logo">
              <div class="name-location-wrap">
                <h2 class="shop-name">{{ shopInfo.name }}</h2>
                <p class="shop-location">{{ $t('auction.szd') }}: {{ shopInfo.address || '暂无' }}</p>
              </div>
            </div>
            <!-- 店铺简介 -->
            <p class="shop-desc">{{ shopInfo.desc || '暂无店铺简介' }}</p>
            <!-- 统计项 -->
            <div class="shop-stats">
              <div class="stat-item">
                <span class="stat-value">{{ shopInfo.auctionCount || 0 }}</span>
                <span class="stat-label">{{ $t('auction.ppsl') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ shopInfo.dealCount || 0 }}</span>
                <span class="stat-label">{{ $t('auction.cjsl') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ shopInfo.flowCount || 0 }}</span>
                <span class="stat-label">{{ $t('auction.lpsl') }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ shopInfo.collectCount || 0 }}</span>
                <span class="stat-label">{{ $t('auction.scrs') }}</span>
              </div>
            </div>
          </div>
          <div class="shop-header-right">
            <!-- 合并收藏/取消收藏按钮，统一可点击 -->
            <button class="collect-btn" :class="{ active: isCollected }" @click="toggleCollect">
              <i class="el-icon-check" v-if="isCollected"></i>
              <i class="el-icon-heart" v-else></i>
              {{ isCollected ? $t('auction.qxsc') : $t('auction.sc') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 分类+商品区域（原型图主体） -->
      <div class="main-layout">
        <!-- 左侧分类导航（原封不动保留） -->
        <AuctionCategorySidebar
          :categories="categories"
          :expandedCategories="expandedCategories"
          :parent-instance="this"
          @all-category-click="handleAllCategoryClick"
          @category-click="handleCategoryClick"
          @subcategory-click="handleSubCategoryClick"
          @toggle-category="toggleCategory"
        />
        <!-- 右侧内容容器 -->
        <div class="page-container">
          <!-- 右侧状态筛选（原型图“全部/未开始”区域） -->
          <div class="status-filter">
            <button :class="{ active: activeStatus === '' }" @click="handleStatusChange('')">{{ $t('auction.qb') }}</button>
            <button :class="{ active: activeStatus === '1' }" @click="handleStatusChange('1')">{{ $t('auction.wks') }}</button>
            <button :class="{ active: activeStatus === '2' }" @click="handleStatusChange('2')">{{ $t('auction.jpz') }}</button>
            <button :class="{ active: activeStatus === '3' }" @click="handleStatusChange('3')">{{ $t('auction.yjs') }}</button>
          </div>
          <!-- 排序+价格筛选（原封不动保留） -->
          <div class="filter-bar">
            <div class="sort-options">
              <button
                :class="{ active: sort_criteria === 'default' }"
                @click="toggleSort('default')"
              >
                {{ $t('auction.mr') }}
              </button>
              <button
                :class="{ active: sort_criteria === 'count' }"
                @click="toggleSort('count')"
                v-if="activeStatus === '2' || activeStatus === '3'"
              >
                {{ $t('auction.jpcs') }}
                <i class="Sort" :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"></i>
                <span class="Sort">
                  <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                  <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                </span>
              </button>
              <button
                :class="{ active: sort_criteria === 'price' }"
                @click="toggleSort('price')"
              >
                {{ $t('auction.jg') }}
                <i class="Sort" :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"></i>
                <span class="Sort">
                  <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                  <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                </span>
              </button>
              <button
                :class="{ active: sort_criteria === 'end_date' }"
                @click="toggleSort('end_date')"
                v-if="activeStatus === '2' || activeStatus === '3'"
              >
                {{ $t('auction.jpsj') }}
                <i class="Sort" :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"></i>
                <span class="Sort">
                  <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                  <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                </span>
              </button>
              <button
                :class="{ active: sort_criteria === 'date' }"
                @click="toggleSort('date')"
                v-if="activeStatus === '1'"
              >
                {{ $t('auction.kpsj') }}
                <i class="Sort" :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"></i>
                <span class="Sort">
                  <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                  <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                </span>
              </button>
            </div>
            <div class="price-filter">
              <input type="number" v-model="minPrice" :placeholder=$LaiKeCommObject.show_symbol @input="handleMinPriceInput">
              <span>-</span>
              <input type="number" v-model="maxPrice" :placeholder=$LaiKeCommObject.show_symbol @input="handleMaxPriceInput">
              <button class="confirm-btn" @click="filterByPrice">{{ $t('qd') }}</button>
            </div>
          </div>

          <!-- 商品列表（原型图3列布局） -->
          <div class="product" v-if="products.length > 0" v-loading="loading">
            <div class="product-item"
                 v-for="(product, index) in products"
                 :key="index"
                 @click="goToProductDetail(product)"
                 style="cursor: pointer;"
            >
              <div class="product-img">
                <img :src="product.img || require('~/static/images/default_picture.png')" :alt="product.product_title">
                <img
                  v-if="product.status === 2"
                  class="status-image"
                  src="~/static/images/end.png"
                  :alt="$t('auction.yjs')"
                >
                <img
                  v-if="product.status === 3"
                  class="status-image"
                  src="~/static/images/flow.png"
                  alt="已流拍"
                >
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.product_title }}</h4>
                <div class="price-bid-row">
                  <div class="product-price">
                    <span class="price-label">{{ $t('auction.qpj') }}</span>
                    <span class="price-value">{{$LaiKeCommObject.show_symbol}}{{$LaiKeCommObject.formatPrice(product.starting_amt) }}</span>
                  </div>
                  <div class="product-bids">
                    <span class="price-value">{{ product.sessionStatus === 1 ? product.collect_num : product.outNum }}</span>
                    <span class="price-label">{{ statusFilter(product.sessionStatus) }}</span>
                  </div>
                </div>
                <div class="product-endtime">
                  <span>{{ dateFilter(product.sessionStatus) }}</span>
                  <span>{{ product.sessionStatus === 1 ? product.start_date : product.end_date }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 暂无数据提示 -->
          <div class="no-data" v-else>
            {{ $t('zdata.zwsj') }}
          </div>
        </div>
      </div>

      <!-- 分页（原封不动保留） -->
      <div class="pagination-container" v-if="products.length > 0">
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
// 保留原有引入
import HeaderNavbar from '~/pages/auction/auction-nav.vue'
import Header from "@/components/pageHeader.vue";
import Footer from "@/components/pageFooter.vue";
import Title from "@/components/homeHeader.vue";
import Body from "@/components/navRight.vue";
import AuctionBreadcrumb from "@/pages/auction/AuctionBreadcrumb.vue";
import AuctionCategorySidebar from "@/pages/auction/AuctionCategorySidebar.vue";

export default {
  components: {
    Header,
    HeaderNavbar,
    Footer,
    Title,
    Body,
    AuctionBreadcrumb,
    AuctionCategorySidebar
  },
  data() {
    return {
      // 新增：店铺信息+收藏状态
      shopInfo: {},
      isCollected: false,
      // 保留原有数据
      pageNo: 1,
      pageSize: 12,
      total:0,
      expandedCategories: [],
      activeStatus: '',
      sort_criteria: 'default',
      minPrice: '',
      maxPrice: '',
      sort:'',
      navTitle: '',
      breadcrumbs: [
        { name:this.$t('auction.sy'), type: 'home' },
        { name: this.$t('auction.qbfl'), type: 'all' }
      ],
      selectedCategory: null,
      selectedSubCategory: null,
      categories: [],
      products: [],
      loading:true,
      SORT_CONFIG: {
        validTypes: ['price', 'date', 'end_date', 'count'],
        defaultType: 'default',
        defaultOrder: 'desc'
      },
      sourceNavIndex:-1,
      mchId: null,
    }
  },
  mounted() {
    // 新增：获取店铺ID并加载店铺信息
    const mchId = this.$route.query.id;
    console.log("mchId",mchId);
    if (mchId) {
      this.getShopInfo(mchId);
      this.mchId = mchId;
    }
    this.initBreadcrumbs();
    // 初始化导航索引
    this.sourceNavIndex = this.$route.query.sourceNavIndex ? Number(this.$route.query.sourceNavIndex) : -1;
    // 保留原有逻辑
    this.getClass();
    this.getProducts();
  },
  computed: {
    totalPages() { return Math.ceil(this.total / this.pageSize); },
    visiblePages() {
      const pages = [];
      const maxShow = 5;
      if (this.totalPages <= maxShow) {
        for (let i = 1; i <= this.totalPages; i++) { pages.push({ value: i, type: 'page' }); }
      } else {
        let start = Math.max(1, this.pageNo - 2);
        let end = Math.min(this.totalPages, start + maxShow - 1);
        if (end - start < maxShow - 1) { start = Math.max(1, end - maxShow + 1); }
        if (start > 1) {
          pages.push({ value: 1, type: 'page' });
          if (start > 2) pages.push({ value: '...', type: 'ellipsis' });
        }
        for (let i = start; i <= end; i++) { pages.push({ value: i, type: 'page' }); }
        if (end < this.totalPages) {
          if (end < this.totalPages - 1) pages.push({ value: '...', type: 'ellipsis' });
          pages.push({ value: this.totalPages, type: 'page' });
        }
      }
      return pages;
    }
  },
  methods: {

    initBreadcrumbs() {
      const originBreadcrumbs = this.$route.query.breadcrumbs;
      let baseBreadcrumbs = [];

      if (originBreadcrumbs) {
        try {
          baseBreadcrumbs = JSON.parse(originBreadcrumbs);
        } catch (e) {
          console.warn('面包屑参数解析失败：', e);
          baseBreadcrumbs = [
            { name: this.$t("specialtyMerchant"), type: 'home', path: '/' }
          ];
        }
      } else {
        baseBreadcrumbs = [
          { name: this.$t("specialtyMerchant"), type: 'home', path: '/' }
        ];
      }
      const mchName = this.$route.query.mch_name || this.shopInfo.name || '';
      this.breadcrumbs = [
        ...baseBreadcrumbs,
      {
          name: mchName,
          type: 'nav',
          path: this.$route.path
        }
      ];
      this.navTitle = this.$t("auctionSession");
    },
    // 新增：获取店铺信息
    async getShopInfo(mchId) {
      try {
        const res = await this.$Api.doRequest({
          api: "plugin.auction.pcAuction.getShopInfo",
          mchId: mchId
        });
        this.shopInfo = res.data;
        this.isCollected = res.data.isCollected || false;
        // 更新面包屑（首页>特色商家>店铺名）
        this.breadcrumbs = [
          { name: this.$t("home.home_page"), type: 'home', path: '/' },
          { name: this.$t("specialtyMerchant"), type: 'nav', path: '/auction/auction-shop' },
          { name: this.shopInfo.name, type: 'nav', path: this.$route.path }
        ];
        this.navTitle = this.shopInfo.name;
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    // 新增：切换收藏
    async toggleCollect() {
      try {
        const res = await this.$Api.doRequest({
          api: "plugin.auction.pcAuction.toggleShopCollect",
          mchId: this.shopInfo.mchId // 传参保持不变
        });
        if (res.code == 200) {
          // 切换收藏状态
          this.isCollected = !this.isCollected;
          // 提示文案区分收藏/取消收藏
          const tipText = this.isCollected
            ? this.$t('auction.sccg')
            : this.$t('auction.qxsc');
          this.$message.success(tipText);
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    // 保留原有方法（goToProductDetail/setNavTitle/statusFilter等）
    goToProductDetail(product) {
      this.$router.push({
        path: '/auction/product-detail',
        query: {
          id: product.id,
          mchId: product.mchId,
          breadcrumbs: JSON.stringify(this.breadcrumbs),
          sourceNavIndex: 2
        }
      });
    },
    statusFilter(sessionStatus) {
      return sessionStatus === 1 ? this.$t('auction.rsc') : this.$t('auction.cjj');
    },
    dateFilter(sessionStatus) {
      return sessionStatus === 1 ? this.$t('auction.kpsj') : this.$t('auction.jpsj');
    },
    getClass() {
      console.log("this.shopInfo.mchId ",this.shopInfo.mchId )
      this.$Api.doRequest(
        {
          api: "plugin.auction.pcAuction.getClassList",
          mchId:this.mchId
        }
      ).then(res => {
        this.categories = res.data.list;
      });
    },
    getProducts() {
      this.loading = true
      const data = {
        api: "plugin.auction.pcAuction.search",
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        mch_id: this.mchId // 新增：筛选当前店铺商品
      };
      if (this.activeStatus) data.status = this.activeStatus;
      if (this.sort_criteria !== 'default') { data.sort_criteria = this.sort_criteria; data.sort = this.sort; }
      if (this.minPrice) data.minPrice = Number(this.minPrice);
      if (this.maxPrice) data.maxPrice = Number(this.maxPrice);
      if (this.selectedSubCategory) data.cid = this.selectedSubCategory.cid;
      else if (this.selectedCategory) data.cid = this.selectedCategory.cid;

      this.$Api.doRequest(data).then(res => {
        this.products = res.data.list;
        this.total = res.data.total;
        this.loading = false
      }).catch(error => {
        this.$message.error(error.message)
      });
    },
    handleStatusChange(status) {
      this.activeStatus = status;
      this.pageNo = 1;
      this.sort_criteria = 'default';
      this.sort = '';
      this.getProducts();
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.pageNo) return;
      this.pageNo = page;
      this.getProducts();
    },
    toggleCategory(categoryId) {
      if (this.expandedCategories.includes(categoryId)) {
        this.expandedCategories = this.expandedCategories.filter(id => id !== categoryId)
      } else {
        this.expandedCategories.push(categoryId)
      }
    },
    handleCategoryClick() {},
    handleSubCategoryClick() {},
    handleAllCategoryClick() {},
    handleBreadcrumbClick() {},
    resetPage() {
      this.pageNo = 1;
      this.$nextTick(() => { this.getProducts(); });
    },
    toggleSort(type) {
      if (this.SORT_CONFIG.validTypes.includes(type)) {
        this.sort_criteria = type;
        this.sort = this.sort === 'desc' ? 'asc' : 'desc';
      } else {
        this.sort_criteria = this.SORT_CONFIG.defaultType;
        this.sort = this.SORT_CONFIG.defaultOrder;
      }
      this.pageNo = 1;
      this.getProducts();
    },
    handleMinPriceInput() {
      if (this.minPrice === '' || this.minPrice === null) this.minPrice = '';
      else if (Number(this.minPrice) < 0) this.minPrice = 0;
    },
    handleMaxPriceInput() {
      if (this.maxPrice !== '' && this.maxPrice !== null && Number(this.maxPrice) < 0) this.maxPrice = '';
    },
    filterByPrice() {
      this.pageNo = 1;
      this.getProducts();
    }
  }
}
</script>

<style scoped>
/* 店铺头部样式（原型图顶部区域） */
.shop-header {
  display: flex;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  height: 200px; /* 固定头部总高度，banner 同步此高度 */
}

/* Logo+名称+所在地 容器 */
.shop-logo-name-location {
  display: flex;
  align-items: center; /* Logo与名称/所在地垂直居中 */
  gap: 12px; /* Logo与文字的间距 */
  margin-bottom: 8px; /* 与简介的间距 */
}

/* 左侧横幅区域 */
.shop-header-banner {
  width: 280px; /* 原型图左侧大图宽度 */
  height: 100%; /* 继承父容器高度，与shop-header高度一致 */
  flex-shrink: 0;
  overflow: hidden;
}
.shop-banner-img {
  width: 100%;
  height: 100%; /* 强制与父容器同高 */
  object-fit: cover; /* 保持比例填充，避免拉伸变形 */
}

/* 右侧信息+收藏容器 */
.shop-header-right-wrap {
  flex: 1;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 100%; /* 继承父容器高度 */
  box-sizing: border-box; /* 避免padding撑开高度 */
}

/* 中间信息区域 */
.shop-header-middle {
  flex: 1;
  height: 100%; /* 继承父容器高度 */
  display: flex;
  flex-direction: column; /* 垂直排列，避免内容溢出 */
}

.name-location-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px; /* 名称与所在地的间距 */
}

.shop-header-logo {
  width: 50px; /* 原型图Logo尺寸 */
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
}
.shop-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
  line-height: 1.2;
}
.shop-location {
  font-size: 14px; /* 原型图所在地字号 */
  color: #999;
  margin: 0;
  line-height: 1.2;
}

/* 店铺简介 */
.shop-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0; /* 与统计项的间距 */
  overflow: clip;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 原型图显示两行 */
  -webkit-box-orient: vertical;
  width: 100%;
  height: 21px;
}

/* 统计项（原型图带竖线分隔） */
.shop-stats {
  display: flex;
  justify-content: space-around; /* 均分宽度 */
  border-top: 1px solid #f5f5f5; /* 顶部边框 */
  padding: 10px 0;
  background: #F6F6F6;
}
.stat-item {
  text-align: center;
  position: relative;
  flex: 1; /* 每个统计项均分宽度 */
}
/* 竖线分隔（最后一项无竖线） */
.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 10px;
  height: 40px;
  width: 1px;
  background-color: #e5e5e5; /* 原型图分隔线颜色 */
}
.stat-value {
  display: block;
  font-size: 22px; /* 原型图数字字号 */
  font-weight: 700;
  color: #B21E2E; /* 原型图数字颜色 */
  margin-bottom: 4px;
}
.stat-label {
  font-size: 12px;
  color: #666;
}

/* 右侧收藏区域 */
.shop-header-right {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.collect-btn {
  padding: 6px 16px;
  border: 1px solid #B21E2E;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  transition: all 0.2s;
}

/* 未收藏样式 */
.collect-btn:not(.active) {
  background: #fff;
  color: #B21E2E;
}

/* 已收藏样式（取消收藏） */
.collect-btn.active {
  background: #B21E2E;
  color: #fff;
}
.collect-btn .el-icon-check,
.collect-btn .el-icon-heart {
  font-size: 14px;
}

/* 状态筛选样式（原型图“全部/未开始”区域） */
.status-filter {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 15px;
}
.status-filter button {
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #333;
  font-size: 14px;
  cursor: pointer;
}
.status-filter button.active {
  border-bottom-color: #B21E2E;
  color: #B21E2E;
  font-weight: 500;
}

/* 保留原有样式（仅调整商品布局为3列） */
.auction-page {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.main-layout {
  display: flex;
  gap: 30px;
}
.page-container {
  flex: 1;
}
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 20px;
}
.sort-options {
  display: flex;
  gap: 15px;
}
.sort-options button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  align-items: center;
  gap: 3px;
  display: inline-flex;
}
.Sort {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.el-icon-caret-top, .el-icon-caret-bottom {
  font-size: 12px;
  color: #999;
  transition: color 0.2s;
}
.el-icon-caret-top.active, .el-icon-caret-bottom.active {
  color:#B21E2E;
  font-weight: bold;
}
.sort-options button:not(.active) .el-icon-caret-top,
.sort-options button:not(.active) .el-icon-caret-bottom {
  color: #ccc;
}
.sort-options button.active {
  color: #B21E2E;
}
.price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}
.price-filter input {
  width: 80px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.confirm-btn {
  padding: 6px 16px;
  background-color: #B21E2E;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.product {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 原型图3列布局 */
  gap: 20px;
}
.product-item {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}
.product-item:hover {
  transform: scale(1.03);
  border: 1px solid #b21e2e;
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.product-img {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}
.status-image {
  position: absolute;
  bottom: 10px;
  right: 40px;
  transform: rotate(5deg);
  z-index: 10;
  width: 80px !important;
  height: auto;
  max-height: 40px;
}
.product-img > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.product-info {
  padding: 15px;
}
.product-name {
  font-size: 14px;
  margin: 0 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 20px;
}
.product-price {
  font-size: 14px;
  margin-bottom: 0;
}
.price-value {
  color: #B21E2E;
  font-weight: 600;
}
.price-bid-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.product-bids {
  color: #666;
  font-size: 12px;
  margin-bottom: 5px;
}
.product-endtime {
  color: #999;
  font-size: 12px;
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
}
.page-item:hover {
  background-color: #f5f5f5;
  color: #B21E2E;
}
.page-item.active {
  background-color: #B21E2E;
  color: #fff;
  font-weight: 600;
}
.page-item.disabled {
  color: #ccc;
  cursor: not-allowed;
  background-color: #f5f5f5;
}
.page-item.disabled:hover {
  color: #ccc;
  background-color: #f5f5f5;
}
.page-item.prev, .page-item.next {
  font-size: 20px;
  line-height: 38px;
}
.page-item.ellipsis {
  cursor: default;
  background: transparent;
  pointer-events: none;
}
.page-item.ellipsis:hover {
  background: transparent;
  color: #666;
}
.no-data {
  text-align: center;
  padding: 200px 0;
  color: #999;
  font-size: 16px;
}
</style>
