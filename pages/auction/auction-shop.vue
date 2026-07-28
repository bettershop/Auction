<template>
  <div>
    <Header/>
    <HeaderNavbar />
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

      <!-- 分类标签栏（还原设计图：全部/食品/电器/服务） -->
      <div class="category-tabs" v-if="mchClassList.length > 0">
        <div
          class="tab-item"
          :class="{ active: selectedCategoryId === '' }"
          @click="handleCategoryClick('')"
        >
          全部
        </div>
        <div
          v-for="category in mchClassList"
          :key="category.id"
          class="tab-item"
          :class="{ active: selectedCategoryId === category.id }"
          @click="handleCategoryClick(category.id)"
        >
          {{ category.name }}
        </div>
      </div>

      <!-- 商家列表网格 -->
      <div class="merchant-grid" v-if="mchList.length > 0">
        <div
          class="merchant-card"
          v-for="merchant in mchList"
          :key="merchant.id"
        >
          <!-- 商家图片 -->
          <div class="merchant-img">
            <img :src="merchant.head_img" alt="店铺logo" @error="
                  (e) => {
                    e.target.src = require('~/static/images/default_picture.png');
                  }
                ">
          </div>
          <!-- 商家信息区 -->
          <div class="merchant-info">
            <div class="merchant-header">
              <img :src="merchant.logo" class="merchant-logo" alt="店铺logo" @error="
      (e) => {
        e.target.src = require('~/static/images/default_picture.png');
      }
    ">
              <!-- 新增容器：包裹名称+介绍，实现右侧上下对齐 -->
              <div class="merchant-text-content">
                <span class="merchant-name">{{ merchant.name }}</span>
                <p class="merchant-desc">{{ merchant.shop_information || $t('auction.zwjs') }}</p>
              </div>
            </div>
            <div class="merchant-footer">
        <span class="collect-count">
       <span class="price-value">{{ merchant.collection_num}}</span>
        {{ $t('auction.rsc') }}</span>
              <button class="enter-btn" @click="goMch(merchant)">{{ $t('auction.jdgg') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空数据提示 -->
      <div class="no-data" v-else-if="!loading">
        {{ $t('auction.zwsjsj') }}
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="mchList.length > 0">
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
      pageNo: 1,
      pageSize: 12,
      total: 0,
      expandedCategories: [],
      activeStatus: '1',
      sort_criteria: 'default',
      minPrice: '',
      maxPrice: '',
      sort: '',
      navTitle: '',
      breadcrumbs: [
        { name: this.$t('auction.sy'), type: 'home' },
        { name: this.$t('auction.qbfl'), type: 'all' }
      ],
      selectedCategory: null,
      selectedSubCategory: null,
      selectedCategoryId: '', // 新增：选中的分类ID
      categories: [],
      mchList: [], // 特色商家列表（接口返回赋值）
      mchClassList: [], // 商家分类列表（接口返回赋值）
      loading: true,
      searchName: ''
    }
  },
  mounted() {
    this.getMchClassList();
    this.$options.watch['$route.query'].handler.call(this, this.$route.query);
    this.getMchList();
    this.setNavTitle();
  },
  watch: {
    '$route'(to) {
      this.setNavTitle();
      this.updateBreadcrumbs();
    },
    '$route.query': {
      immediate: true,
      deep: true,
      handler(newQuery) {
        if (!newQuery) return;
        // 解析URL中的搜索关键词，有值赋值，无值清空，自动去空格
        this.searchName = newQuery.searchName ? String(newQuery.searchName).trim() : '';

        // 只要URL带searchName参数，就重置页码+调用接口
        const hasSearchParam = 'searchName' in newQuery;
        if (hasSearchParam) {
          this.pageNo = 1;
          this.getMchList();
        }
      }
    },
    // 分类切换时重新加载商家列表
    selectedCategoryId(newVal) {
      this.pageNo = 1; // 重置页码
      this.getMchList();
    }
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
  methods: {
    setNavTitle() {
      const path = this.$route.path;
      const routeMap = {
        '/': this.$t("home.home_page"),
        '/auction/allClass': this.$t("allClass"),
        '/auction/single-auction': this.$t("oneAuction"),
        '/auction/auction-session': this.$t("auctionSession"),
        '/auction/auction-mch': this.$t("mchSession"),
        '/auction/auction-shop': this.$t("specialtyMerchant")
      };
      this.navTitle = routeMap[path] || this.$t("allClass");
      this.updateBreadcrumbs();
    },
    updateBreadcrumbs() {
      this.breadcrumbs = [
        { name: this.$t("home.home_page"), type: 'home', path: '/' },
        { name: this.navTitle, type: 'nav', path: this.$route.path }
      ];
    },
    // 分类点击事件
    handleCategoryClick(categoryId) {
      this.selectedCategoryId = categoryId;
    },

    goMch(merchant) {
      this.$router.push({
        path: '/auction/shop-info',
        query: {
          id: merchant.id,
          breadcrumbs: JSON.stringify(this.breadcrumbs),
          sourceNavIndex: 5,
          mch_name:merchant.name
        }
      });
    },
    getMchList() {
      this.loading = true;
      var data = {
        api: "plugin.auction.pcAuction.getMchList",
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        classId: this.selectedCategoryId, // 传递选中的分类ID
        name: this.searchName || ''
      };
      this.$Api.doRequest(data).then((res) => {
        this.mchList = res.data.list;
        this.total = res.data.total;
        this.loading = false;
      }).catch(error => {
        this.$message.error(error.message);
        this.loading = false;
      });
    },
    getMchClassList() {
      this.loading = true;
      var data = {
        api: "plugin.auction.pcAuction.getMchClass",
      };
      this.$Api.doRequest(data).then((res) => {
        this.mchClassList = res.data.list;
        this.loading = false;
      }).catch(error => {
        this.$message.error(error.message);
        this.loading = false;
      });
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.pageNo) return;
      this.pageNo = page;
      this.getMchList();
    },
    handleBreadcrumbClick() {},

    resetPage() {
      this.pageNo = 1;
      this.$nextTick(() => {
        this.getMchList();
      });
    },
  }
}
</script>

<style scoped>
.auction-page {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 分类标签栏样式 */
.category-tabs {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 20px;
}
.tab-item {
  padding: 10px 20px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.tab-item.active {
  color: #B21E2E;
  font-weight: 500;
}
.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #B21E2E;
}
.tab-item:hover {
  color: #B21E2E;
}

/* 商家列表网格 */
.merchant-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}
/* 商家卡片 */
.merchant-card {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%; /* 网格布局下所有卡片等高 */
}
/* 商家图片区 */
.merchant-img {
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0; /* 图片高度固定，不被压缩 */
}
.merchant-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.merchant-card:hover .merchant-img img {
  transform: scale(1.05);
}
/* 商家信息区 */
.merchant-info {
  padding: 12px;
  display: flex;
  flex-direction: column; /* 整体垂直：(logo+文字) → footer */
  flex: 1; /* 占满剩余高度，让footer到底部 */
}


.merchant-header {
  display: flex;
  align-items: flex-start; /* logo和文字区顶部对齐 */
  gap: 10px; /* logo和文字区的间距 */
  margin-bottom: 0; /* 取消默认间距 */
}
.merchant-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0; /* 关键：logo大小固定 */
}

.merchant-text-content {
  display: flex;
  flex-direction: column; /* 名称在上，介绍在下 */
  gap: 4px; /* 名称和介绍的间距，可微调 */
  flex: 1; /* 占满右侧剩余宽度 */
  width: 100%; /* 确保宽度继承父容器，省略号基于此生效 */
}

.merchant-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.2; /* 适配行高，和介绍对齐 */
}
.merchant-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 0; /* 取消默认margin */
  white-space: nowrap;    /* 强制单行显示，不换行 */
  overflow: hidden;       /* 超出容器宽度部分隐藏 */
  text-overflow: ellipsis;/* 超出部分显示省略号... */
  width: 100%;            /* 占满merchant-text-content的宽度 */
  box-sizing: border-box; /* 防止padding/margin撑大宽度 */
}
.merchant-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto; /* 核心：自动推到底部 */
  padding-top: 8px;
}


.collect-count {
  font-size: 12px;
}
.price-value {
  color: #B21E2E;
  font-weight: 600;
}
.enter-btn {
  background-color: #B21E2E;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.enter-btn:hover {
  background-color: #a01a28;
}

/* 分页样式 */
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

/* 空数据提示 */
.no-data {
  text-align: center;
  padding: 100px 0;
  color: #999;
  font-size: 16px;
}
</style>
