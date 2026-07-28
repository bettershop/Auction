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

      <div class="main-layout">
        <!-- 右侧内容容器 -->
        <div class="page-container">
          <!-- 右侧商品展示区 -->
          <div class="product-content">
            <div class="filter-container">
              <div class="status-filter">
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
                    :class="{ active: sort_criteria === 'num' }"
                    @click="toggleSort('num')"
                    v-if="activeStatus === '2'|| activeStatus === '3'"
                  >
                    {{ $t('auction.pps') }}
                    <i
                      class="Sort"
                      :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"
                    ></i>
                    <span class="Sort">
                      <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                      <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                    </span>
                  </button>

                  <button
                    :class="{ active: sort_criteria === 'look_count' }"
                    @click="toggleSort('look_count')"
                    v-if="activeStatus === '2' || activeStatus === '3'"
                  >
                    {{ $t('auction.wgs') }}
                    <i
                      class="Sort"
                      :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"
                    ></i>
                    <span class="Sort">
                      <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                      <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                    </span>
                  </button>

                  <button
                    :class="{ active: sort_criteria === 'focus_num' }"
                    @click="toggleSort('focus_num')"
                    v-if="activeStatus === '1'"
                  >
                    {{ $t('auction.gzs') }}
                    <i
                      class="Sort"
                      :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"
                    ></i>
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
                    <i
                      class="Sort"
                      :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"
                    ></i>
                    <span class="Sort">
                      <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                      <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                    </span>
                  </button>
                  <button
                    :class="{ active: sort_criteria === 'total_amount' }"
                    @click="toggleSort('total_amount')"
                    v-if="activeStatus === '3'"
                  >
                    {{ $t('auction.cjje') }}
                    <i
                      class="Sort"
                      :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"
                    ></i>
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
                    <i
                      class="Sort"
                      :class="{ 'asc': sort === 'asc', 'desc': sort === 'desc' }"
                    ></i>
                    <span class="Sort">
                      <i :class="{ active: sort === 'asc' }" class="el-icon-caret-top"></i>
                      <i :class="{ active: sort === 'desc' }" class="el-icon-caret-bottom"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 竞拍中：4列网格布局 -->
            <div class="product bidding-layout" v-if="activeStatus === '2' && specialList.length > 0"  v-loading="loading">
              <div class="bidding-item" v-for="(special, index) in specialList" :key="index">
                <!-- 图片区域 -->
                <div class="bidding-image">
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
                      <img :src="special.main_img || special.img" class="grid-img"  :alt="special.name">
                    </div>
                    <!-- 第1张小图 -->
                    <div class="img-item sub" v-if="special.auctionProImgList?.[0]">
                      <img :src="special.auctionProImgList[0]" class="grid-img" :alt="special.name + '-1'">
                    </div>
                    <!-- 第2张小图 -->
                    <div class="img-item sub" v-if="special.auctionProImgList?.[1]">
                      <img :src="special.auctionProImgList[1]" class="grid-img" :alt="special.name + '-2'">
                    </div>
                  </div>
                </div>
                <!-- 信息区域 -->
                <div class="bidding-info">
                  <div class="bidding-name">{{ special.name }}</div>
                  <div class="bidding-time">{{ special.end_date }} {{ $t('auction.jp') }}</div>
                  <div class="bidding-stats">
                    <div class="stat-item">
                      <span class="stat-value">{{ special.goodsTotal || 0 }}</span>
                      <span class="stat-label">{{ $t('auction.pps') }}</span>
                    </div>
                    <!-- 新增竖线分隔符 -->
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                      <span class="stat-value">{{ special.look_count || 0 }}</span>
                      <span class="stat-label">{{ $t('auction.wgs') }}</span>
                    </div>
                    <button class="view-btn" @click="goToSpecialDetail(special)">{{ $t('auction.llzc') }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 已结束：2列卡片布局 -->
            <div class="product ended-layout" v-if="activeStatus === '3' && specialList.length > 0" v-loading="loading">
              <div class="ended-item" v-for="(special, index) in specialList" :key="index">
                <!-- 图片区域 -->
                <div class="ended-image">
                  <div
                    class="img-grid"
                    :class="{
                    'only-main': !special.auctionProImgList || special.auctionProImgList.length === 0,
                    'one-sub': special.auctionProImgList?.length === 1,
                    'two-subs': special.auctionProImgList?.length >= 2
                    }"
                  >
                    <div class="img-item main">
                      <img :src="special.main_img || special.img" class="grid-img" :alt="special.name">
                    </div>
                    <div class="img-item sub" v-if="special.auctionProImgList?.[0]">
                      <img :src="special.auctionProImgList[0]" class="grid-img" :alt="special.name + '-1'">
                    </div>
                    <div class="img-item sub" v-if="special.auctionProImgList?.[1]">
                      <img :src="special.auctionProImgList[1]" class="grid-img" :alt="special.name + '-2'">
                    </div>
                  </div>
                </div>
                <!-- 右侧信息容器 -->
                <div class="ended-right">
                  <div class="ended-header">
                    <div class="ended-name">{{ special.name }}</div>
                    <div class="ended-time">{{ special.end_date }} {{ $t('auction.jp') }}</div>
                  </div>
                  <!-- 统计数据 -->
                  <div class="ended-stats-wrap"> <!-- 新增外层容器承载整块背景 -->
                    <div class="ended-stats">
                      <div class="stat-card">
                        <span class="stat-value">{{ $LaiKeCommObject.formatPrice(special.specialDealAmt) || 0 }}</span>
                        <span class="stat-label">{{ $t('auction.zcjje') }}</span>
                      </div>
                      <div class="ended-stat-divider"></div>
                      <div class="stat-card">
                        <span class="stat-value">{{ special.goodsTotal || 0 }}</span>
                        <span class="stat-label">{{ $t('auction.pps') }}</span>
                      </div>
                      <div class="ended-stat-divider"></div>
                      <div class="stat-card">
                        <span class="stat-value">{{ special.look_count || 0 }}</span>
                        <span class="stat-label">{{ $t('auction.wgs') }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- 操作按钮 -->
                  <div class="ended-action">
                    <button class="view-btn" @click="goToSpecialDetail(special)">{{ $t('auction.llzc') }}</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 未开始：保留原有布局 -->
            <div class="product unstart-layout" v-if="activeStatus === '1' && specialList.length > 0"  v-loading="loading">
              <div class="product-item" v-for="(special, index) in specialList" :key="index">
                <div class="new-special-image">
                  <div
                    class="img-grid"
                    :class="{
                    'only-main': !special.auctionProImgList || special.auctionProImgList.length === 0,
                    'one-sub': special.auctionProImgList?.length === 1,
                    'two-subs': special.auctionProImgList?.length >= 2
                    }"
                  >
                    <div class="img-item main">
                      <img :src="special.main_img || special.img" class="grid-img" :alt="special.name">
                    </div>
                    <div class="img-item sub" v-if="special.auctionProImgList?.[0]">
                      <img :src="special.auctionProImgList[0]" class="grid-img" :alt="special.name + '-1'">
                    </div>
                    <div class="img-item sub" v-if="special.auctionProImgList?.[1]">
                      <img :src="special.auctionProImgList[1]" class="grid-img" :alt="special.name + '-2'">
                    </div>
                  </div>
                </div>
                <div class="product-info">
                  <h4 class="product-name">{{ special.name }}</h4>
                  <div class="product-endtime">
                    <span>{{ special.start_date }}</span>
                    <span>{{$t('auction.kp')}}</span>
                  </div>
                  <div class="price-bid-row">
                    <div class="product-bids">
                      <span class="price-value">{{ special.focus_num}}</span>
                      <span class="price-label">{{$t('auction.rgz')}}</span>
                    </div>
                    <!-- 动态文案：未设置=设置提醒 / 已设置=取消提醒 -->
                    <button
                      class="remind-btn"
                      :class="{ 'remind-btn--set': special.isRemind }"
                      @click="handleRemindToggle(special.id)"
                    >
                      {{ special.isRemind ? $t('auction.qxtx') : $t('auction.sztx') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 暂无数据提示 -->
            <div class="no-data" v-if="specialList.length === 0">
              {{ $t('zdata.zwsj') }}
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="specialList.length > 0">
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
      activeStatus: '1',
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
      specialList: [],
      loading:true,
      SORT_CONFIG: {
        validTypes: ['price', 'date', 'end_date', 'count','focus_num','num','look_count','total_amount'],
        defaultType: 'default',
        defaultOrder: 'desc'
      }
    }
  },
  mounted() {
    this.getSpecialList();
    this.setNavTitle();
  },
  watch: {
    '$route'(to) {
      this.setNavTitle();
      this.updateBreadcrumbs();
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
        '/shop': this.$t("specialtyMerchant")
      };
      this.navTitle = routeMap[path] || this.$t("allClass");
      this.updateBreadcrumbs();
    },
    goToSpecialDetail(special) {
      this.$router.push({
        path: '/auction/special-detail',
        query: {
          specialId: special.id,
          breadcrumbs: JSON.stringify(this.breadcrumbs),
          sourceNavIndex: 3
        }
      });
    },

    updateBreadcrumbs() {
      this.breadcrumbs = [
        { name: this.$t("home.home_page"), type: 'home', path: '/' },
        { name: this.navTitle, type: 'nav', path: this.$route.path }
      ];
    },
    getSpecialList() {
      this.loading = true
      var data = {
        api: "plugin.auction.pcAuction.getSpecialList",
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      if (this.activeStatus) {
        data.status = this.activeStatus;
      }
      if (this.sort_criteria !== 'default') {
        data.sort_criteria = this.sort_criteria;
        data.sort = this.sort;
      }
      if (this.minPrice) {
        data.minPrice = Number(this.minPrice);
      }
      if (this.maxPrice) {
        data.maxPrice = Number(this.maxPrice);
      }
      if (this.selectedSubCategory) {
        data.cid = this.selectedSubCategory.cid;
      } else if (this.selectedCategory) {
        data.cid = this.selectedCategory.cid;
      }
      this.$Api.doRequest(data).then((res) => {
        this.specialList = res.data.list;
        this.total = res.data.total;
        this.loading = false
      }).catch(error => {
        this.$message.error(error.message)
      });
    },

    // 设置提醒接口调用
    async handleRemindToggle(specialId) {
      // 先找到当前项，判断当前状态（用于后续文案/数值更新）
      const targetItem = this.specialList.find(item => item.id === specialId);
      if (!targetItem) return; // 未找到项则终止

      const isRemind = targetItem.isRemind; // 当前是否已设置提醒
      var data = {
        api: "plugin.auction.pcAuction.setRemind",
        specialId: specialId
      };

      try {
        const res = await this.$Api.doRequest(data);
        if (res.code == "200") {
          // 区分“设置/取消”的成功提示
          const tipText = isRemind
            ? this.$t('auction.qxtxcg')
            : this.$t('auction.sztxcg');
          this.$message.success(tipText);
          // 更新状态 + 同步followNum数值
          if (targetItem) {
            // 强制响应式更新（关键：避免页面不刷新）
            this.$set(targetItem, 'isRemind', !isRemind);
            // 设置提醒则+1，取消则-1
            this.$set(targetItem, 'focus_num',
              isRemind ? targetItem.focus_num - 1 : targetItem.focus_num + 1
            );
          }
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    handleStatusChange(status) {
      this.activeStatus = status;
      this.pageNo = 1;
      this.sort_criteria = 'default';
      this.sort = '';
      this.getSpecialList();
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages || page === this.pageNo) return;
      this.pageNo = page;
      this.getSpecialList();
    },
    handleBreadcrumbClick() {},
    resetPage() {
      this.pageNo = 1;
      this.$nextTick(() => {
        this.getSpecialList();
      });
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
      this.getSpecialList();
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

.main-layout {
  display: flex;
  gap: 30px;
}

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
  padding: 12px 16px;
}

.status-filter button {
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-right: 24px;
}

.status-filter button.active {
  color: #B21E2E;
  font-weight: 500;
}

.status-filter button.active::after {
  content: '';
  position: absolute;
  bottom: -13px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #B21E2E;
}

.filter-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #f5f5f5;
}

.sort-options {
  display: flex;
  gap: 24px;
}

.sort-options button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  align-items: center;
  gap: 4px;
  display: inline-flex;
  font-size: 14px;
}

.Sort {
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

/* 图片网格容器通用样式 */
.img-grid {
  display: grid;
  width: 100%;
  gap: 2px;
  background-color: #fff;
  /* 等比例缩小：容器高度整体减少，保持宽高比 */
  transform: scale(0.92); /* 缩放至原大小的92%，可根据需要调整（0.9~0.95为宜） */
  transform-origin: top center; /* 缩放原点置顶居中，避免整体位移 */
}


.img-grid.only-main {
  grid-template-columns: 1fr;
  grid-template-rows: 220px;
}

.img-grid.one-sub {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 220px;
}

.img-grid.two-subs {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 240px 80px;
}

.img-grid.two-subs .img-item.main {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

.img-grid.two-subs .img-item.sub:nth-child(2) {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  padding-top: 10px;
}

.img-grid.two-subs .img-item.sub:nth-child(3) {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  padding-top: 10px;
}

.img-item {
  overflow: hidden;
}

.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.img-item:hover .grid-img {
  transform: scale(1.05);
}

/* 竞拍中：4列网格布局 */
.product.bidding-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.bidding-item {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.bidding-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 悬浮加深阴影 */
  transform: translateY(-2px); /* 轻微上浮 */
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
}


.bidding-image {
  width: 100%;
  padding-bottom: 8px; /* 补偿缩放后的底部间距，避免信息区紧贴图片 */
}

.bidding-info {
  padding: 12px 8px;
  text-align: center; /* 专场名和时间居中 */
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.bidding-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bidding-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  margin-top: auto;
}

.bidding-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0;
  margin-top: 8px;
  width: 100%;
}
/* 竖线分隔符 */
.stat-divider {
  width: 1px;
  height: 24px;
  background-color: #e5e5e5; /* 浅灰色竖线，贴合设计风格 */
}

.stat-item {
  display: flex;
  flex-direction: column; /* 数字在上，文案在下 */
  align-items: center;
  gap: 2px;
  font-size: 12px;
}

.stat-item .stat-value {
  color: #B21E2E;
  font-weight: 600;
  font-size: 14px;
}

.stat-item .stat-label {
  color: #666;
  font-size: 12px;
}

.view-btn {
  background-color: #B21E2E;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 7px 12px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

/* 已结束：2列卡片布局 */
.product.ended-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.ended-item {
  display: flex;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
}

.ended-item:hover {
  transform: scale(1.03); /* 放大1.03倍（可调整数值，如1.05更明显） */
  border: 1px solid #b21e2e; /* 红色边框 */
  box-shadow: 0px 0px 12px 1px rgba(0, 0, 0, 0.1);
  z-index: 10; /* 可选：确保放大后不会被其他卡片遮挡 */
}

.bidding-image {
  width: 100%;
  padding-bottom: 8px; /* 补偿缩放后的底部间距，避免信息区紧贴图片 */
}

.ended-image {
  width: 200px;
  flex-shrink: 0;
  transform: scale(0.92); /* 同步缩放 */
  transform-origin: top center;
  padding-bottom: 8px;
}

.ended-right {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ended-header {
  margin-bottom: 16px;
}

.ended-name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
}

.ended-time {
  font-size: 12px;
  color: #999;
}


.ended-stats {
  display: flex;
  align-items: center;
  justify-content: center; /* 内部内容居中 */
  background-color: #f5f5f5; /* 整块浅灰色背景 */
  padding: 6px 20px; /* 内部内边距 */
  gap: 0;
}

/* 已结束：单个统计项 */
.ended-stats .stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 20px; /* 统计项左右间距 */
  height: 60px;
  box-sizing: border-box;
}

.ended-stats .stat-card .stat-value {
  font-size: 16px;
  color: #B21E2E;
  font-weight: 600;
  margin-bottom: 4px;
}

.ended-stats .stat-card .stat-label {
  font-size: 12px;
  color: #666;
}

/* 已结束：竖线分隔符（仅在统计项之间显示） */
.ended-stat-divider {
  width: 1px;
  height: 36px;
  background-color: #e5e5e5;
  flex-shrink: 0; /* 防止竖线被压缩 */
}

.stat-card {
  display: flex;
  flex-direction: column;
}

.stat-card .stat-value {
  font-size: 16px;
  color: #B21E2E;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-card .stat-label {
  font-size: 12px;
  color: #666;
}

.ended-action {
  display: flex;
  justify-content: flex-end;
}

.ended-action .view-btn {
  padding: 6px 16px;
  font-size: 14px;
}

/* 未开始布局（保留原有样式） */
.product.unstart-layout {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 100%;
  margin: 0;
}

/* 按钮基础样式（保留你的原始红色样式） */
.remind-btn {
  background-color: #B21E2E;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 7px 12px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  /* 新增：过渡动画，切换状态更丝滑 */
  transition: background-color 0.2s ease;
}

.remind-btn--set {
  background-color: #cccccc;
  color: #999999;
  cursor: pointer;
}

.remind-btn:not(.remind-btn--set):hover {
  background-color: #a01a28;
}

.remind-btn--set:hover {
  background-color: #bfbfbf;
}

.remind-btn:disabled {
  background-color: inherit;
  color: inherit;
  cursor: pointer;
}
.remind-btn:not(:disabled) {
  cursor: pointer;
}

.product.unstart-layout .product-item {
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.product.unstart-layout .product-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 悬浮加深阴影 */
  transform: translateY(-2px); /* 轻微上浮 */
  z-index: 10;
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

.product-endtime {
  color: #999;
  font-size: 12px;
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
  margin-top: 5px;
}

.price-value {
  color: #B21E2E;
  font-weight: 600;
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

.no-data {
  text-align: center;
  padding: 200px 0;
  color: #999;
  font-size: 16px;
}
</style>
