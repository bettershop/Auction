<template>
  <div>
    <Header/>
    <HeaderNavbar :sourceNavIndex="sourceNavIndex"/>
    <nuxt :key="$route.fullPath" />
    <Body></Body>
    <div class="auction-page">
      <!-- 复用面包屑组件，保留原有逻辑 -->
      <AuctionBreadcrumb
        :breadcrumbs="breadcrumbs"
        :categories="categories"
        :navTitle="navTitle"
        :parent-instance="this"
        @breadcrumb-click="handleBreadcrumbClick"
      />

      <!-- 未开始专场详情内容（1:1匹配原型图） -->
      <div class="unstart-detail-container">
        <!-- 店铺信息（原型图中店铺信息在头部上方） -->
        <div class="shop-info-row" @click="goMch(specialInfo)">
          <img :src="specialInfo.mch_logo" class="shop-logo" alt="店铺logo" @error="
            (e) => {
              e.target.src = require('~/static/images/default_picture.png');
            }
          ">
          <span class="shop-name">{{ specialInfo.mch_name }}</span>
          <span class="enter-shop">{{ $t('auction.jdgg') }} ></span>
        </div>

        <!-- 专场头部信息 -->
        <div class="special-header">
          <!-- 左侧图片区域 -->
          <div class="header-left">
            <div class="single-img-container">
              <img
                :src="specialInfo.img || specialInfo.main_img"
                class="detail-single-img"
                :alt="specialInfo.name"
                @error="(e) => { e.target.src = require('~/static/images/default_picture.png'); }"
              >
            </div>
          </div>

          <!-- 右侧信息区域 -->
          <!-- 右侧信息区域 -->
          <div class="header-right">
            <!-- 专场名称 + 提醒按钮 左右对齐行 -->
            <div class="name-remind-row">
              <h2 class="special-name">{{ specialInfo.name }}</h2>
              <div class="remind-btn-group">
                <label class="remind-checkbox" v-if="specialInfo.isRemind">
                  <input type="checkbox" v-model="specialInfo.isRemind" @change="handleRemindToggle" hidden>
                  <span class="check-icon">
          <img src="~/static/images/gx.png" class="check-icon-img" alt="勾选图标">
        </span>
                  {{ $t('auction.ystx') }}
                </label>
                <button
                  class="remind-btn"
                  @click="handleRemindToggle"
                >
                  {{ specialInfo.isRemind ? $t('auction.ystx') : $t('auction.sztx') }}
                </button>
              </div>
            </div>

            <!-- 元信息 + 倒计时 左右对齐容器 -->
            <div class="meta-countdown-row">
              <!-- 元信息列（关注数/拍品数/时间 上下排列） -->
              <div class="meta-column">
                <div class="meta-item">
                  <img src="~/static/images/grzx.png" class="meta-icon" alt="关注图标">
                  <span class="meta-num">{{ specialInfo.followNum }}</span>
                  <span class="meta-text">{{ $t('auction.rgz') }}</span>
                </div>
                <div class="meta-item">
                  <img src="~/static/images/jp.png" class="meta-icon" alt="拍品图标">
                  <span class="meta-num">{{ specialInfo.goodsTotal }}</span>
                  <span class="meta-text">{{ $t('auction.pps') }}</span>
                </div>
                <div class="meta-item">
                  <img src="~/static/images/djs.png" class="meta-icon" alt="时间图标">
                  <span>{{ specialInfo.startDate }} {{ $t('auction.zhi') }} {{ specialInfo.endDate }}</span>
                </div>
              </div>

              <!-- 倒计时区域（与时间行左右对齐） -->
              <div class="countdown-area">
                <!-- 倒计时结束：只显示一次文案 -->
                <span v-if="isCountdownEnd" class="countdown-end-text">{{ $t('auction.jks') }}</span>
                <!-- 倒计时中：显示标签+数字 -->
                <template v-else>
                  <span class="countdown-label">{{ $t('auction.jks') }}</span>
                  <div class="countdown-nums">
                    <span class="countdown-box">{{ countdownHours }}</span>
                    <span class="countdown-split">:</span>
                    <span class="countdown-box">{{ countdownMinutes }}</span>
                    <span class="countdown-split">:</span>
                    <span class="countdown-box">{{ countdownSeconds }}</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 专场详情内容 -->
        <div class="special-content">
          <div v-html="specialInfo.content" class="content-html"></div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
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
      specialInfo: {}, // 专场详情信息
      // 拆分倒计时变量（解决HTML拼接问题）
      countdownHours: '--',   // 小时
      countdownMinutes: '--', // 分钟
      countdownSeconds: '--', // 秒
      timer: null, // 倒计时定时器
      breadcrumbs: [],
      navTitle: '',
      categories: [],
      sourceNavIndex: -1,
      isCountdownEnd: false //标记倒计时是否结束
    }
  },
  async mounted() {
    document.body.style.backgroundColor = '#F6F6F6';
    document.body.style.background = '#F6F6F6';
    document.body.style.minHeight = '100vh';
    // 初始化面包屑
    this.initBreadcrumbs();
    // 获取专场ID并加载详情
    const specialId = this.$route.query.specialId;
    // 初始化导航索引
    this.sourceNavIndex = this.$route.query.sourceNavIndex ? Number(this.$route.query.sourceNavIndex) : -1;
    if (specialId) {
      await this.getSpecialDetail(specialId);
      // 启动倒计时
      this.startCountdown();
    }
  },
  beforeDestroy() {
    // 清除倒计时定时器
    if (this.timer) clearInterval(this.timer);
  },
  methods: {
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

    // 获取未开始专场详情
    // 获取未开始专场详情
    async getSpecialDetail(specialId) {
      try {
        const res = await this.$Api.doRequest({
          api: "plugin.auction.pcAuction.soonInfo",
          id: specialId
        });
        this.specialInfo = res.data;

        // 正则处理img标签，强制添加宽度样式（覆盖原有样式）
        if (this.specialInfo.content) {
          // 正则匹配所有img标签，插入/替换style属性
          this.specialInfo.content = this.specialInfo.content.replace(
            /<img(.*?)>/gi,
            (match, attr) => {
              // 如果已有style属性，替换width/height；无则新增
              if (attr.includes('style=')) {
                // 替换style中的width/height
                return `<img ${attr.replace(
                  /style="([^"]*)"/gi,
                  'style="$1;width:100%;height:100%;"'
                )}>`;
              } else {
                // 新增style属性
                return `<img ${attr} style="width:100%;height:100%;">`;
              }
            }
          );
        }

        console.log("specialInfo", this.specialInfo);
      } catch (error) {
        this.$message.error(error.message);
      }
    },

    // 重构倒计时方法：拆分变量赋值，无HTML拼接
    startCountdown() {
      const _this = this;
      if (!this.specialInfo.startDate) {
        // 空值兜底
        this.countdownHours = '--';
        this.countdownMinutes = '--';
        this.countdownSeconds = '--';
        this.isCountdownEnd = false;
        return;
      }
      const startTimestamp = new Date(this.specialInfo.startDate).getTime();

      const updateCountdown = () => {
        const now = Date.now();
        const diff = startTimestamp - now;

        if (diff <= 0) {
          // 倒计时结束
          _this.isCountdownEnd = true;
          _this.countdownHours = '';
          _this.countdownMinutes = '';
          _this.countdownSeconds = _this.$t('auction.jks');
          clearInterval(_this.timer);
          return;
        }

        // 计算时分秒
        _this.isCountdownEnd = false;
        const totalSeconds = Math.floor(diff / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        // 补零并赋值给拆分的变量
        const formatNum = (num) => num.toString().padStart(2, '0');
        _this.countdownHours = formatNum(hours);
        _this.countdownMinutes = formatNum(minutes);
        _this.countdownSeconds = formatNum(seconds);
      };

      // 立即执行+定时更新
      updateCountdown();
      this.timer = setInterval(updateCountdown, 1000);
    },

    // 设置/取消提醒
    async handleRemindToggle() {
      const specialId = this.specialInfo.specialId || this.specialInfo.id;
      if (!specialId) {
        this.$message.warning('专场ID不存在');
        return;
      }

      try {
        const res = await this.$Api.doRequest({
          api: "plugin.auction.pcAuction.setRemind",
          specialId: specialId
        });
        if (res.code == 200) {
          this.$set(this.specialInfo, 'isRemind', !this.specialInfo.isRemind);
          this.$set(this.specialInfo, 'followNum',
            this.specialInfo.isRemind
              ? (this.specialInfo.followNum || 0) + 1
              : Math.max(0, (this.specialInfo.followNum || 0) - 1)
          );
          this.$message.success(
            this.specialInfo.isRemind
              ? (this.$t('auction.sztxcg') || '设置提醒成功')
              : (this.$t('auction.qxtxcg') || '取消提醒成功')
          );
        } else {
          this.$message.error(res.msg || '操作失败');
        }
      } catch (error) {
        this.$message.error(error.message || '网络异常，请重试');
      }
    },

    // 跳转店铺
    goMch(specialInfo) {
      this.$router.push({
        path: '/auction/shop-info',
        query: {
          id: specialInfo.mch_id,
          breadcrumbs: JSON.stringify(this.breadcrumbs),
          sourceNavIndex: 5,
          mch_name:specialInfo.mch_name
        }
      });
    },


    // 面包屑点击处理
    handleBreadcrumbClick() {},
  }
};
</script>

<style scoped>
/* 全局容器 */
.auction-page {
  width: 1200px;
  margin: 0 auto;
  padding: 10px 0;
}

.unstart-detail-container {
  width: 100%;
  border: none;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  box-sizing: border-box;
}

/* 店铺信息行（原型图顶部） */
.shop-info-row {
  display: flex;
  align-items: center;
  background: #fff;
  gap: 8px;
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom:20px
}

.shop-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.shop-name {
  font-size: 14px;
  color: #333;
}

.enter-shop {
  font-size: 12px;
  color: #B21E2E;
  margin-left: auto;
}

/* 专场头部容器 */
.special-header {
  display: flex;
  gap: 20px;
  background: #fff;
  padding: 20px;
  align-items: flex-start;
}

/* 左侧图片 */
.header-left .single-img-container {
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.detail-single-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.meta-countdown-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* 与时间行底部对齐，匹配原型图 */
  gap: 20px;
}


/* 右侧信息区域 */
.header-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 专场名称 + 提醒按钮 左右对齐行 */
.name-remind-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.special-name {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin: 0;
}

/* 元信息列（关注数/拍品数/时间 上下排列） */
.meta-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 300px; /* 防止挤压，保证时间文本完整显示 */
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.meta-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.meta-num {
  color: #B21E2E;
  font-weight: bold;
}

.meta-text {
  color: #666;
}

/* 倒计时区域（原型图右侧） */
.countdown-area {
  display: flex;
  align-items: center;
  gap: 5px;
  /* 与时间行文字基线对齐 */
  align-self: flex-end;
  margin-bottom: 1px; /* 微调对齐精度 */
}

/* 倒计时结束文案样式（和原数字盒子风格统一） */
.countdown-end-text {
  display: inline-block;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #B21E2E;
  color: #fff;
  border-radius: 2px;
  font-size: 12px;
  font-weight: bold;
}

.countdown-label {
  font-size: 14px;
  color: #B21E2E;
}

/* 倒计时数字盒子（匹配原型图红色方块） */
.countdown-nums {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.countdown-box {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #B21E2E;
  color: #fff;
  border-radius: 2px;
  font-size: 12px;
  font-weight: bold;
}

.countdown-split {
  color: #B21E2E;
  font-weight: bold;
  margin: 0 2px;
}

/* 提醒按钮组 */
.remind-btn-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remind-checkbox {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  border: 1px solid #B21E2E;
  padding: 2px 8px;
  border-radius: 2px;
}

.remind-checkbox input {
  display: none;
}

/* 勾选图标样式 */
.check-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  color: #fff;
  font-size: 10px;
  border-radius: 2px;
  /* 保证图标容器尺寸固定 */
  overflow: hidden;
}
.check-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 提醒按钮统一样式（无禁用状态） */
.remind-btn {
  background: #B21E2E;
  color: #fff;
  border: none;
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 2px;
  cursor: pointer;
}
/* 可选：已设提醒时按钮样式微调（如需区分） */
.remind-btn:hover {
  opacity: 0.9;
}


/* 专场详情内容 */
.special-content {
  padding: 20px;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  width: 100%;          /* 宽度继承父容器 */
  box-sizing: border-box; /* 内边距计入宽度，防止溢出 */
  overflow-x: hidden;   /* 隐藏横向溢出内容 */
}
.content-html {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  max-width: 100%;      /* 最大宽度不超过父容器 */
  word-wrap: break-word; /* 长文本自动换行 */
  word-break: break-all; /* 超长单词/字符强制换行（如URL） */
}

/* 确保图片也不超出容器 */
.content-html img {
  width: 100%;
  height: 100%;         /* 图片自适应高度，防止变形 */
  margin: 10px 0;
}

/* 补充auction-page的溢出控制（防止整体溢出） */
.auction-page {
  width: 1200px;
  margin: 0 auto;
  padding: 10px 0;
  box-sizing: border-box; /* 内边距计入宽度 */
  overflow-x: hidden;     /* 隐藏横向溢出 */
}

/* 响应式适配（原型图PC优先，移动端兼容） */
@media (max-width: 768px) {
  .auction-page {
    width: 100%;
    padding: 0 10px;
  }
  .special-header {
    flex-direction: column;
  }
  .name-remind-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .countdown-area {
    position: static;
    margin-top: 10px;
  }
  .header-left .single-img-container {
    width: 100%;
    height: auto;
  }
}
@media (max-width: 768px) {
  .meta-countdown-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .countdown-area {
    align-self: flex-start;
    margin-bottom: 0;
  }
}
</style>
