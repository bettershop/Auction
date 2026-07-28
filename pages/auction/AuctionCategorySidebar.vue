<template>
  <div class="category-sidebar">
    <h3 class="category-title" @click="handleAllCategoryClick">
      {{ $t('auction.qbfl') }}
    </h3>
    <ul class="category-list">
      <li
        class="category-item"
        v-for="category in categories"
        :key="category.cid"
        @click="handleCategoryClick(category)"
        :class="{ active: selectedCategory && String(selectedCategory.cid) === String(category.cid) }">
        <div class="category-header">
          <span class="category-name">{{ category.pname }}</span>
          <span class="category-count">({{ category.count }})</span>
          <i
            class="arrow-icon"
            :class="{ 'rotate': expandedCategories.includes(category.cid) }"
            v-if="category.subCategories.length > 0"
          ></i>
        </div>
        <ul
          class="subcategory-list"
          v-if="category.subCategories.length > 0 && expandedCategories.includes(category.cid)"
        >
          <li
            class="subcategory-item"
            v-for="(sub, index) in category.subCategories"
            :key="index"
            @click.stop="handleSubCategoryClick(category, sub)"
            :class="{ active: selectedSubCategory && String(selectedSubCategory.cid) === String(sub.cid) }"
          >
            <span>{{ sub.pname }}</span>
            <span class="subcategory-count">({{ sub.count }})</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    categories: { type: Array, required: true },
    expandedCategories: { type: Array, default: () => [] },
    navTitle: { type: String, default: '' },
    parentInstance: { type: Object, required: true },
    // ========== 【新增2个核心props，必加】接收父组件的选中分类 ==========
    selectedCategory: { type: Object, default: null },
    selectedSubCategory: { type: Object, default: null }
  },
  methods: {
    // 全部分类点击
    handleAllCategoryClick() {
      const parent = this.parentInstance;
      parent.selectedCategory = null;
      parent.selectedSubCategory = null;

      // 更新面包屑
      parent.breadcrumbs = [
        { name: parent.$t("home.home_page"), type: 'home', path: '/' },
        { name: parent.navTitle, type: 'nav', path: parent.$route.path }
      ];

      parent.pageNo = 1;
      parent.getProducts();
      this.$emit('all-category-click');
    },

    // 一级分类点击
    handleCategoryClick(category) {
      const parent = this.parentInstance;
      this.$emit('toggle-category', category.cid);

      parent.selectedCategory = category;
      parent.selectedSubCategory = null;

      // 更新面包屑
      parent.breadcrumbs = [
        { name: parent.$t("home.home_page"), type: 'home', path: '/' },
        { name: parent.navTitle, type: 'nav', path: parent.$route.path },
        { name: category.pname, type: 'category', cid: category.cid }
      ];

      parent.pageNo = 1;
      parent.getProducts();
      this.$emit('category-click', category);
    },

    // 二级分类点击
    handleSubCategoryClick(category, subCategory) {
      const parent = this.parentInstance;
      parent.selectedCategory = category;
      parent.selectedSubCategory = subCategory;

      // 更新面包屑 - 给二级分类增加 type: subCategory 标识，让面包屑组件能识别
      parent.breadcrumbs = [
        { name: parent.$t("home.home_page"), type: 'home', path: '/' },
        { name: parent.navTitle, type: 'nav', path: parent.$route.path },
        { name: category.pname, type: 'category', cid: category.cid },
        // ========== 新增：二级分类增加type标识 ==========
        { name: subCategory.pname, type: 'subCategory', cid: subCategory.cid }
      ];

      window.scrollTo({ top: 0, behavior: 'smooth' });
      parent.pageNo = 1;
      parent.getProducts();
      this.$emit('subcategory-click', category, subCategory);
    }
  }
};
</script>

<style scoped>

/* 左侧分类样式（位置调整后样式保持） */
.category-sidebar {
  width: 220px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px 0;
  /* 固定分类栏高度，避免随商品列表拉伸 */
  align-self: flex-start;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  padding: 0 20px 10px;
  margin-bottom: 10px;
  color: #333333;
  line-height: 28px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  cursor: default;
  /* 修改边框样式为仅三分之一宽度的红色下划线 */
  position: relative;
}

.category-title::after {
  content: '';
  position: absolute;
  left: 20px; /* 与padding-left对齐 */
  bottom: 0;
  width: 33%; /* 三分之一宽度 */
  height: 1px;
  background-color: #B21E2E;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-item {
  border-left: 3px solid transparent;
  transition: background-color 0.2s;
}

.category-item:hover {
  background-color: #f5f5f5;
}

/* 展开时的样式：限制最大高度并允许滚动 */
.category-item:has(.arrow-icon.rotate) .subcategory-list {
  max-height: 240px; /* 限制最大高度（可根据需求调整） */
  overflow-y: auto; /* 超出高度时显示滚动条 */
  padding: 5px 0; /* 展开时增加内边距 */
}

.category-header {
  position: relative;
  padding: 0 20px;
  line-height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.category-header::after {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  height: 1px;
  background-color: #f0f0f0;
  opacity: 0.5;
}

.category-name {
  font-weight: bold;
  font-size: 16px;
  color: #333333;
  line-height: 28px;
  text-align: left;
  font-style: normal;
  text-transform: none;
}

.category-count, .subcategory-count {
  color: #999;
  font-size: 12px;
  margin-left: 5px;
}

.arrow-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center;
  transition: transform 0.3s ease;
}

.arrow-icon.rotate {
  transform: translateY(-50%) rotate(180deg); /* 修正旋转时的垂直居中 */
}

.subcategory-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fafafa;
  max-height: 0; /* 默认收起状态 */
  overflow: hidden; /* 隐藏超出内容 */
  transition: max-height 0.5s ease-in-out; /* 0.5秒平缓展开/收起动画 */
}

.subcategory-item {
  padding: 0 30px;
  line-height: 36px;
  display: flex;
  align-items: center;
  font-size: 13px;
  cursor: default;
}

.category-item.active {
  border-left-color: #B21E2E; /* 左侧红色竖线高亮，和你的边框样式呼应 */
  background-color: #f5f5f5;
}
.category-item.active .category-name {
  color: #B21E2E; /* 选中后文字变红 */
  font-weight: 700;
}
.category-item.active .category-count {
  color: #B21E2E; /* 数量也变红 */
}

.subcategory-item.active {
  background-color: #f0f0f0;
  color: #B21E2E;
  font-weight: 500;
}
/* 修复：选中状态下hover不冲突 */
.subcategory-item.active:hover {
  color: #B21E2E;
  background-color: #f0f0f0;
}

.subcategory-item:hover {
  background-color: #f0f0f0;
  color: #B21E2E;
}
</style>
