<template>
  <div class="breadcrumbs">
    <template v-for="(crumb, index) in breadcrumbs">
      <span
        :key="`crumb-${index}`"
        :class="{ 'current': index === breadcrumbs.length - 1 }"
        @click="handleBreadcrumbClick(crumb, index)"
        style="cursor: pointer;"
      >
        {{ crumb.name }}
      </span>
      <span
        :key="`sep-${index}`"
        class="separator"
        v-if="index !== breadcrumbs.length - 1"
      >></span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AuctionBreadcrumb',
  // AuctionBreadcrumb.vue - props 定义区域 【核心修改】
  props: {
    breadcrumbs: {
      type: Array,
      required: true,
      default: () => []
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    },
    navTitle: {
      type: String,
      required: false,
      default: ''
    },
    // ========== 重点修改这一行 ==========
    parentInstance: {
      type: Object,
      required: false, // 从true改为false，取消必填校验
      default: undefined // 添加默认值
    }
  },
  methods: {
    handleBreadcrumbClick(crumb, index) {
      console.log("crumb", crumb);
      // 点击当前页的面包屑项，不做处理
      if (index === this.breadcrumbs.length - 1) return;

      // ========== 核心新增1：定义【导航索引 → 页面路径】映射表，和你的导航栏完全一致，永恒不变 ==========
      const navIndexToPath = {
        0: '/',
        1: '/auction/allClass',
        2: '/auction/single-auction',
        3: '/auction/auction-session',
        4: '/auction/auction-mch',
        5: '/auction/auction-shop'
      };
      // ========== 核心新增2：获取「来源页面的导航索引」，就是你跳转详情页时传入的sourceNavIndex ==========
      const sourceNavIndex = this.$route.query.sourceNavIndex || '1'; // 默认1=全部分类，兜底
      const specialId = this.$route.query.specialId || ''
      console.log("sourceNavIndex",sourceNavIndex)
      console.log("specialId",specialId)
      // ========== 核心新增3：动态生成「要跳转回的页面路径」，彻底抛弃硬编码 ==========
      const targetPath = navIndexToPath[sourceNavIndex];
      console.log("targetPath",targetPath)

      // ========== 核心新增4：面包屑切片，保留你原有逻辑，点击哪级回退到哪级 ==========
      const targetBreadcrumbs = JSON.stringify(this.breadcrumbs.slice(0, index));
      console.log("targetBreadcrumbs",targetBreadcrumbs);

      // 场景1：点击【首页】→ 直接跳转首页，逻辑不变，保留
      if (crumb.type === 'home') {
        this.$router.push('/');
        return;
      }

      // 场景2：点击【全部分类/专场拍卖】这类 nav 类型面包屑 → 动态跳转+清空分类筛选
      if (crumb.type === 'nav') {
        this.$router.push({
          path: crumb.path,
          query: {
            sourceNavIndex: sourceNavIndex, // 带回原导航索引，保证返回后导航栏选中态正确
            breadcrumbs: targetBreadcrumbs,  // 带回面包屑层级
            categoryId: '',
            subCategoryId: '',
            specialId:specialId
          }
        });
        return;
      }

      // 场景3：点击【一级分类】category 类型 → 动态跳转+筛选当前一级分类
      if (crumb.type === 'category') {
        this.$router.push({
          path: targetPath,
          query: {
            sourceNavIndex: sourceNavIndex,
            categoryId: crumb.cid,
            subCategoryId: '',
            breadcrumbs: targetBreadcrumbs
          }
        });
        return;
      }

      // 场景4：点击【二级分类】subCategory 类型 → 动态跳转+精准筛选当前二级分类 ✅ 无硬编码
      if (crumb.type === 'subCategory') {
        const parentCate = this.breadcrumbs.find(item => item.type === 'category');
        this.$router.push({
          path: targetPath, // ✅ 动态路径，从来源索引获取
          query: {
            sourceNavIndex: sourceNavIndex,
            categoryId: parentCate?.cid || '',
            subCategoryId: crumb.cid,
            breadcrumbs: targetBreadcrumbs
          }
        });
      }
    },
  }
};
</script>

<style scoped>
.breadcrumbs {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
  cursor: default;
}

.breadcrumbs .separator {
  margin: 0 8px;
}
</style>
