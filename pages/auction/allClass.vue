<template>
  <div>
    <Header/>
    <HeaderNavbar />
    <nuxt :key="$route.fullPath" />
    <Body></Body>
    <div class="auction-page">
      <!-- 面包屑导航 -->
      <!-- 引入面包屑组件 -->
      <AuctionBreadcrumb
        :breadcrumbs="breadcrumbs"
        :categories="categories"
        :navTitle="navTitle"
        :parent-instance="this"
        @breadcrumb-click="handleBreadcrumbClick"
      />

      <!--分类 -->
      <div class="main-layout">
        <!-- 左侧分类导航（移到外层） -->
        <AuctionCategorySidebar
          :categories="categories"
          :expandedCategories="expandedCategories"
          :parent-instance="this"
          :navTitle="navTitle"
          :selectedCategory="selectedCategory"
          :selectedSubCategory="selectedSubCategory"
          @all-category-click="handleAllCategoryClick"
          @category-click="handleCategoryClick"
          @subcategory-click="handleSubCategoryClick"
          @toggle-category="toggleCategory"
        />
        <!-- 右侧内容容器 -->
        <div class="page-container">
          <!-- 右侧商品展示区 -->
          <div class="product-content">
            <div class="filter-container">
              <div class="status-filter">
                <button :class="{ active: activeStatus === '' }" @click="handleStatusChange('')">{{ $t('auction.qb') }}</button>
                <button :class="{ active: activeStatus === '1' }" @click="handleStatusChange('1')">{{ $t('auction.wks') }}</button>
                <button :class="{ active: activeStatus === '2' }" @click="handleStatusChange('2')">{{ $t('auction.jpz') }}</button>
                <button :class="{ active: activeStatus === '3' }" @click="handleStatusChange('3')">{{ $t('auction.yjs') }}</button>
              </div>
              <div class="filter-bar">
                <div class="sort-options">
                  <button
                    :class="{ active: sort_criteria === 'default' }"
                    @click="toggleSort('default')"
                  >
                    {{ $t('auction.mr') }}
                  </button>
                  <button
                    :class="{ active: sort_criteria === 'price' }"
                    @click="toggleSort('price')"
                  >
                    {{ $t('auction.jg') }}
                    <i
                      class="priceSort"
                      :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"
                    ></i>
                    <span class="priceSort">
                      <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                      <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                    </span>
                  </button>
                </div>
                <div class="price-filter">
                  <input type="number" v-model="minPrice" :placeholder=$LaiKeCommObject.show_symbol @input="handleMinPriceInput">
                  <span>-</span>
                  <input type="number" v-model="maxPrice" :placeholder=$LaiKeCommObject.show_symbol @input="handleMaxPriceInput">
                  <button class="confirm-btn" @click="filterByPrice"> {{ $t('qd') }}</button>
                </div>
              </div>
            </div>

            <!-- 商品列表 -->
            <div class="product" v-if="products.length > 0"  v-loading="loading">
              <div class="product-item"
                   v-for="(product, index) in products"
                   :key="index"
                   @click="goToProductDetail(product)"
              >
                <div class="product-img">
                  <img :src="product.img" :alt="product.product_title">
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
                      <span class="price-value">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(product.starting_amt) }}</span>
                    </div>
                    <div class="product-bids">
                      <span class="price-value">{{ product.outNum }}</span>
                      <span class="price-label">{{ $t('auction.cjj') }}</span>
                    </div>
                  </div>
                  <div class="product-endtime">
                    {{ $t('auction.jpsj') }} {{ product.end_date }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 新增：暂无数据提示 -->
            <div class="no-data" v-else>
              {{ $t('zdata.zwsj') }}
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
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
      total:0,
      expandedCategories: [],
      activeStatus: '',
      sort_criteria: 'default',
      minPrice: '',
      maxPrice: '',
      sort:'',
      navTitle: '', // 存储从导航栏过来的标题
      breadcrumbs: [
        { name:this.$t('auction.sy'), type: 'home' },
        { name: this.$t('auction.qbfl'), type: 'all' }
      ],
      selectedCategory: null,
      selectedSubCategory: null,
      categories: [],
      products: [],
      loading:true,
    }
  },
  async mounted() {
    // ✅ 第一步：先加载分类数据，等待加载完成（重中之重！）
    await this.getClass();
    // ✅ 第二步：分类数据加载完成后，手动触发路由监听逻辑 → 强制匹配参数赋值
    this.$options.watch['$route.query'].handler.call(this, this.$route.query);
    // ✅ 第三步：最后加载商品数据
    this.getProducts();
    // ✅ 第四步：设置导航标题
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
        this.selectedCategory = null;
        this.selectedSubCategory = null;

        const targetCateId = newQuery.categoryId ? String(newQuery.categoryId) : '';
        if (targetCateId && this.categories.length > 0) {
          this.selectedCategory = this.categories.find(cate => String(cate.cid) === targetCateId) || null;
          if (this.selectedCategory && !this.expandedCategories.includes(this.selectedCategory.cid)) {
            this.expandedCategories.push(this.selectedCategory.cid);
            this.$forceUpdate();
          }
        }

        const targetSubCateId = newQuery.subCategoryId ? String(newQuery.subCategoryId) : '';
        if (targetSubCateId && this.selectedCategory) {
          this.selectedSubCategory = this.selectedCategory.subCategories.find(sub => String(sub.cid) === targetSubCateId) || null;
        }

        // ✅ 核心补充：分类赋值成功后，立即更新面包屑 → 面包屑回显生效！
        this.updateBreadcrumbs();

        if (targetCateId || targetSubCateId) {
          this.pageNo = 1;
          this.getProducts();
        }
      }
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
    //跳转到商品详情页
    goToProductDetail(product) {
      // 1. 初始化基础的query参数（必传项）
      const queryParams = {
        id: product.id,
        mchId: product.mchId,
        sourceNavIndex: 2, // 传递single-auction对应的导航索引（2）
        categoryId: this.selectedCategory?.cid || '',
        subCategoryId: this.selectedSubCategory?.cid || ''
      };

      // 2. 条件判断：仅当breadcrumbs存在且有值时才添加该参数
      if (this.breadcrumbs && this.breadcrumbs.length > 0) {
        queryParams.breadcrumbs = JSON.stringify(this.breadcrumbs);
      }

      // 3. 执行路由跳转
      this.$router.push({
        path: '/auction/product-detail',
        query: queryParams
      });
    },
    // 设置当前导航标题
    setNavTitle() {
      const path = this.$route.path;
      const routeMap = {
        '/': this.$t("home.home_page"),
        '/auction/allClass': this.$t("auction.qbfl"),
        '/single-auction': this.$t("oneAuction"),
        '/auction/auction-session': this.$t("auctionSession"),
        '/auction/auction-mch': this.$t("mchSession"),
        '/shop': this.$t("specialtyMerchant")
      };
      this.navTitle = routeMap[path] || this.$t("auction.qbfl");
    },

    // 更新面包屑
    // ✅ 重构：智能动态生成面包屑（核心修复，必替换）
    updateBreadcrumbs() {
      // 基础面包屑：首页 > 全部分类 (固定不变)
      this.breadcrumbs = [
        { name: this.$t("home.home_page"), type: 'home', path: '/' },
        { name: this.$t("auction.qbfl"), type: 'nav', path: this.$route.path, cid: '' }
      ];

      // ✅ 有选中的一级分类 → 追加一级分类面包屑
      if (this.selectedCategory) {
        this.breadcrumbs.push({
          name: this.selectedCategory.pname,
          type: 'category',
          cid: this.selectedCategory.cid,
          path: this.$route.path // 保持当前页面，点击后筛选对应分类
        });

        // ✅ 有选中的二级分类 → 追加二级分类面包屑
        if (this.selectedSubCategory) {
          this.breadcrumbs.push({
            name: this.selectedSubCategory.pname,
            type: 'subCategory',
            cid: this.selectedSubCategory.cid,
            path: this.$route.path
          });
        }
      }
    },

    async getClass() {
      var data = {
        api: "plugin.auction.pcAuction.getClassList",
      };
      const res = await this.$Api.doRequest(data);
      this.categories = res.data.list || [];
      return this.categories; // 必须return，让await能拿到结果
    },

    getProducts() {
      this.loading = true
      var data = {
        api: "plugin.auction.pcAuction.search",
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      if (this.activeStatus) {
        data.status = this.activeStatus;
      }

      // 排序参数
      if (this.sort_criteria !== 'default') {
        data.sort_criteria = this.sort_criteria; // 排序类型：price
        data.sort = this.sort; // 排序方向：asc/desc
      }

      // 价格筛选参数
      if (this.minPrice) {
        data.minPrice = Number(this.minPrice);
      }
      if (this.maxPrice) {
        data.maxPrice = Number(this.maxPrice);
      }

      if (this.selectedSubCategory) {
        data.cid = this.selectedSubCategory.cid; // 二级分类cid
      } else if (this.selectedCategory) {
        data.cid = this.selectedCategory.cid;     // 一级分类cid
      }

      this.$Api.doRequest(data).then((res) => {

        this.products = res.data.list;
        this.total = res.data.total;
        this.loading = false
      }).catch(error => {
        this.$message.error(error.message)
      });
    },

    handleStatusChange(status) {
      this.activeStatus = status;
      this.pageNo = 1; // 切换状态时重置页码到第一页
      this.getProducts(); // 调用接口获取对应状态的商品
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

    //点击一级分类
    handleCategoryClick(category) {
      this.selectedCategory = category;
      this.selectedSubCategory = null;
      this.pageNo = 1;
      this.getProducts();
    },

    handleSubCategoryClick(category, subCategory) {
      this.selectedCategory = category;
      this.selectedSubCategory = subCategory;
      this.pageNo = 1;
      this.getProducts();
    },
    //点击全部分类 - 原空方法，新增完整逻辑
    handleAllCategoryClick() {
      this.selectedCategory = null;
      this.selectedSubCategory = null;
      this.pageNo = 1;
      this.getProducts();
    },

    //点击面包屑导航
    handleBreadcrumbClick(crumb, index) {},

    resetPage() {
      this.pageNo = 1;
      this.$nextTick(() => {
        this.getProducts();
      });
    },


    toggleSort(type) {
      if (type === 'price') {
        this.sort_criteria = 'price'
        this.sort = this.sort === 'desc' ? 'asc' : 'desc'
      } else {
        this.sort_criteria = 'default'
        this.sort = 'desc'
      }
      this.pageNo = 1;
      this.getProducts();
    },
    handleMinPriceInput() {
      if (this.minPrice === '' || this.minPrice === null) {
        this.minPrice = '';
      } else if (Number(this.minPrice) < 0) {
        this.minPrice = 0;
      }
    },
    handleMaxPriceInput() {
      if (this.maxPrice !== '' && this.maxPrice !== null && Number(this.maxPrice) < 0) {
        this.maxPrice = '';
      }
    },
    filterByPrice() {
      this.pageNo = 1;
      this.getProducts();
    }
  }
}
</script>

<style scoped>
.auction-page {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 新增：主布局容器，控制侧边栏和内容区的排列 */
.main-layout {
  display: flex;
  gap: 30px;
}

/* 修改：page-container不再需要flex，变为商品内容的容器 */
.page-container {
  flex: 1;

}


.product-content {
  width: 100%;
}

.filter-container{
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #fff;
}

.status-filter {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 5px;
}

.status-filter button {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 10px;
}

.status-filter button.active {
  color: #B21E2E;
  border-bottom-color: #B21E2E;
  font-weight: 500;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  box-sizing: border-box;
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

.priceSort {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-icon-caret-top {
  margin-bottom: -2px;
}
.el-icon-caret-bottom {
  margin-top: -2px;
}

.el-icon-caret-top,
.el-icon-caret-bottom {
  font-size: 12px;
  color: #999;
  transition: color 0.2s;
}

.el-icon-caret-top.active,
.el-icon-caret-bottom.active {
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 100%; /* 修改：适应容器宽度 */
  margin: 0;
}

.product-item {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.product-item:hover {
  transform: scale(1.03); /* 放大1.03倍（可调整数值，如1.05更明显） */
  border: 1px solid #b21e2e; /* 红色边框 */
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
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

.no-data {
  text-align: center;
  padding: 200px 0;
  color: #999;
  font-size: 16px;
}

</style>
