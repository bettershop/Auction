<template>
  <div>
    <Header/>
    <HeaderNavbar :sourceNavIndex="sourceNavIndex" />
    <Body></Body>
    <div class="auction-detail-page">
      <!-- 面包屑导航 -->
      <AuctionBreadcrumb
        :breadcrumbs="breadcrumbs"
        :categories="categories"
        :navTitle="navTitle"
        @breadcrumb-click="handleBreadcrumbClick"
      />

      <!-- 详情页核心布局 -->
      <div class="detail-main">
        <!-- 左侧商品图片区 -->
        <div class="detail-left">
          <div class="main-img">
            <img
              :src="productInfo.imgList[activeThumb] || productInfo.imgurl || '/static/images/default.png'"
              :alt="productInfo.product_title || '拍品图片'"
            >
          </div>
          <div class="thumb-img-wrap">
            <button class="thumb-prev" @click="prevThumb" :disabled="activeThumb === 0 || !(productInfo.imgList?.length || 0)">
              <i class="el-icon-arrow-left"></i>
            </button>
            <div class="thumb-img-list">
              <div
                class="thumb-item"
                v-for="(img, idx) in (productInfo.imgList || [])"
                :key="idx"
                :class="{ active: idx === activeThumb }"
                @click="activeThumb = idx"
              >
                <img :src="img || '/static/images/default_thumb.png'" :alt="productInfo.product_title || '缩略图'">
              </div>
            </div>
            <button class="thumb-next" @click="nextThumb" :disabled="getIsNextDisabled()">
              <i class="el-icon-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- 右侧商品信息区 -->
        <div class="detail-right">
          <h1 class="product-title">{{ productInfo.product_title }}</h1>
          <div class="product-spec">{{ $t('auction.gg') }}：{{ productInfo.attribute }}</div>
          <div class="auction-status">
            <!-- 原有 status=1/2 的背景图模块 -->
            <div
              v-if="productInfo.status === 1 || productInfo.status === 2"
              class="status-bg"
              :class="{
                'status-bg-jjks': productInfo.status === 1,
                'status-bg-zzjp': productInfo.status === 2
              }"
            >
              <span class="status-text">{{ getStatusMainText() }}</span>
              <div class="countdown-wrap">
                <span class="countdown-label">{{ getStatusSubText() }}</span>
                <div class="countdown-box">
                  <span class="time-item">{{ countdown.hh }}</span>
                  <span class="time-split">:</span>
                  <span class="time-item">{{ countdown.mm }}</span>
                  <span class="time-split">:</span>
                  <span class="time-item">{{ countdown.ss }}</span>
                </div>
              </div>
            </div>

            <div v-else-if="productInfo.status === 3" class="status-end-wrap">
              <div class="status-end-tag">{{ $t('auction.jpjs') }}</div>
              <div class="status-end-info">
                <div class="end-title">{{ $t('auction.ppycj') }}</div>
                <div class="end-time">{{ $t('auction.jssj') }}：{{ endDate || '暂无' }}</div>
              </div>
            </div>
          </div>

          <div class="info-border-wrapper">
            <div class="price-main">
              <div class="price-item">
                <span class="label">{{ $t('auction.qpj') }}：</span>
                <span class="value">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(productInfo.starting_amt) }}</span>
              </div>
              <div class="price-item">
                <span class="label">{{ $t('auction.bzj') }}：</span>
                <span class="value" style="color: #010101">{{$LaiKeCommObject.show_symbol}}{{$LaiKeCommObject.formatPrice(productInfo.promise_amt) || 0}}</span>
              </div>
            </div>

            <div class="action-bar">
              <button
                class="join-auction-btn"
                :disabled="isJoinBtnDisabled"
              :class="{ 'btn-disabled': isJoinBtnDisabled }"
              @click="handleJoinAuction()"
              >
                {{ joinBtnText }}
              </button>
              <div class="action-icons">
                <button class="icon-btn" @click="handleCollect" :disabled="collectLoading">
                  <img :src="isCollection ? soucang_red : soucang" alt="收藏" />
                  <span>{{ $t('auction.sc') }}</span>
                </button>
                <button class="icon-btn" @click="handleService">
                  <i class="el-icon-headset"></i>
                  <span>{{ $t('auction.kf') }}</span>
                </button>
              </div>
            </div>

            <div class="price-bottom-bar">
              <div class="price-bar-item">
                <div class="bar-value">{{$LaiKeCommObject.show_symbol}}{{$LaiKeCommObject.formatPrice(productInfo.starting_amt) || 0 }}</div>
                <div class="bar-label">{{ $t('auction.qpj') }}</div>
              </div>
              <div class="ended-stat-divider"></div>
              <div class="price-bar-item">
                <div class="bar-value">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(productInfo.mark_up_amt) || 0 }}</div>
                <div class="bar-label">{{ $t('auction.jjfd') }}</div>
              </div>
              <div class="ended-stat-divider"></div>
              <div class="price-bar-item">
                <div class="bar-value">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(productInfo.freight) || 0 }}</div>
                <div class="bar-label">{{ $t('auction.yf') }}</div>
              </div>
              <div class="ended-stat-divider"></div>
              <div class="price-bar-item">
                <div class="bar-value">{{ Number(productInfo.commission || 0).toFixed(2) }}%</div>
                <div class="bar-label">{{ $t('auction.yj') }} <i class="el-icon-question"></i></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品详情标签页模块 + 右侧店铺信息列 -->
      <div style="display: flex; gap: 20px; margin-top: 30px;">
        <!-- 原有商品详情标签页模块 -->
        <div class="product-detail-tab" style="flex: 1;">
          <!-- 标签切换栏 -->
          <div class="tab-nav">
            <div
              class="tab-item"
              :class="{ active: activeTab === 'detail' }"
              @click="activeTab = 'detail'"
            >
              {{ $t('auction.ppxq') }}
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'bidRecord' }"
              @click="activeTab = 'bidRecord'"
            >
              {{ $t('auction.cjjl') }}({{ sortedBidRecordList.length }})
            </div>
            <div
              class="tab-item"
              :class="{ active: activeTab === 'rule' }"
              @click="activeTab = 'rule'"
            >
              {{ $t('auction.jpgz') }}
            </div>
          </div>

          <!-- 标签内容区 -->
          <div class="tab-content">
            <!-- 拍品详情 -->
            <div class="content-item detail-content" v-if="activeTab === 'detail'">
              <div class="detail-module" v-for="(item, idx) in productDetailList" :key="idx">
                <h3 class="module-title">{{ item.name }}</h3>
                <div class="module-content" v-html="item.content"></div>
              </div>
              <div class="detail-empty" v-if="productDetailList.length === 0">
                <p>{{ $t('auction.zwppxq') }}</p>
              </div>
            </div>

            <!-- 出价记录 -->
            <div class="content-item record-content" v-if="activeTab === 'bidRecord'">
              <div class="record-empty" v-if="sortedBidRecordList.length === 0">
                <i class="el-icon-empty"></i>
                <p>{{ $t('auction.zwcjjl') }}</p>
              </div>
              <table class="record-table" v-else>
                <thead>
                <tr>
                  <th>{{ $t('auction.cjsj') }}</th>
                  <th>{{ $t('auction.jg') }}</th>
                  <th>{{ $t('auction.zt') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(record, idx) in sortedBidRecordList" :key="idx">
                  <td>{{ record.add_time }}</td>
                  <td>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(record.price) }}</td>
                  <td>
                      <span class="status-tag" :class="{
                        leading: record.status === '领先',
                        out: record.status === '出局'
                      }">
                        {{ record.status }}
                      </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>

            <!-- 竞拍规则 -->
            <div class="content-item rule-content" v-if="activeTab === 'rule'">
              <div class="rule-rich-content" v-html="rule" v-if="rule"></div>
              <div class="rule-empty" v-if="!rule">
                <p>{{ $t('auction.zwjpgz') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧店铺信息列（1:1匹配原型） -->
        <div class="right-side-panel">
          <!-- 店铺信息卡片 -->
          <div class="shop-info-card">
            <div class="shop-header">
              <img :src="shop_list.shop_logo" class="shop-logo" alt="店铺logo" @error="
                  (e) => {
                    e.target.src = require('~/static/images/default_picture.png');
                  }
                ">
              <div class="shop-name">{{ shop_list.shop_name }}</div>
              <button class="enter-shop-btn" @click="goMch(shop_list)">
                {{ $t('auction.jd') }}
              </button>
            </div>
            <div class="shop-stats">
              <div class="stat-item">
                <div class="stat-value">{{ goodsTotal || 0 }}</div>
                <div class="stat-label">{{ $t('auction.ppsl') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ shop_list.quantity_sold || 0 }}</div>
                <div class="stat-label">{{ $t('auction.cjsl') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ shop_list.collection_num || 0 }}</div>
                <div class="stat-label">{{ $t('auction.scsl') }}</div>
              </div>
            </div>
          </div>

          <!-- 相关推荐模块 -->
          <div class="related-recommend">
            <div class="recommend-title">
              <span class="line"></span>
              <span class="title-text">{{ $t('auction.xgtj') }}</span>
              <span class="line"></span>
            </div>
            <ul class="recommend-list">
              <li class="recommend-item" v-for="(item, idx) of related_recommendations" :key="idx" @click="toDetail(item)">
                <img
                  :src="item.img || ''"
                  alt="推荐商品"
                  class="recommend-img"
                  @error="
                  (e) => {
                    e.target.src = require('~/static/images/default_picture.png');
                  }
                "
                />
                <div class="recommend-name">{{ item.goodsName}}</div>
                <div class="recommend-price">
                  <span class="price-label">{{ $t('auction.qpj') }}¥</span>
                  <span class="price-value">{{ $LaiKeCommObject.formatPrice(item.starting_amt) || '0.00' }}</span>
                </div>
              </li>
              <!-- 兜底占位 -->
              <li class="recommend-item placeholder" v-if="related_recommendations.length === 0">
                <div class="img-placeholder"></div>
                <div class="text-placeholder"></div>
                <div class="price-placeholder"></div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 支付保证金弹窗 - 修改底部区域 -->
      <el-dialog
      title="支付保证金"
      :visible.sync="payModalVisible"
      width="800px"
      height="800px"
      :close-on-click-modal="false"
      :show-close="true"
      append-to-body
      :header-border="false"
      class="fixed-height-dialog"
      >
      <div class="pay-modal-content">
<!--        <div class="header-top-line"></div>-->
        <!-- 1. 拍卖会名称 + 保证金（新增红色边框） -->
        <div class="modal-header">
          <div class="auction-name">{{ auctionName }}</div>
          <div class="deposit"> {{ $t('auction.bzj') }}{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(depositAmount)}}</div>
        </div>

        <!-- 3. 规则说明（新增灰色背景） -->
        <div class="rule-wrap">
          <h4>{{ $t('auction.gzsm') }}</h4>
          <div class="rule-content" v-html="ruleDesc"></div>
        </div>

        <!-- 4. 支付方式 -->
        <div class="pay-method">
          <h4>{{ $t('auction.zffs') }}</h4>
          <div class="method-icons">
            <img
              v-for="method in displayPayMethods"
              :key="method.key"
              :src="method.icon"
              :alt="method.name"
            :class="{ 'pay-icon-selected': selectedPayMethod === method.key }"
            @click="selectPayMethod(method.key)"
            style="cursor: pointer;"
            />
          </div>
        </div>

        <!-- 5. 协议勾选 + 立即支付（同一行布局） -->
        <div class="agreement-pay-wrap">
          <el-checkbox v-model="agreeProtocol" class="agreement-checkbox">
            {{ $t('auction.jpxy') }} <a href="#" @click.prevent="viewAgreement">{{ $t('auction.ckxy') }}</a>
          </el-checkbox>
          <el-button
            type="danger"
            size="medium"
            class="pay-btn"
            @click="handlePayDeposit"
            :disabled="!agreeProtocol"
          >
            {{ $t('auction.ljzf') }}
          </el-button>
        </div>
      </div>

      </el-dialog>

      <el-dialog
        title="竞拍协议"
        :visible.sync="agreementModalVisible"
      :close-on-click-modal="false"
      append-to-body
      class="agreement-dialog"
      >
      <div class="agreement-content" v-html="agreementContent"></div>
      </el-dialog>


      <el-dialog
        title="输入密码"
        :visible.sync="passwordModalVisible"
        width="500px"
      height="220px"
      :close-on-click-modal="false"
      append-to-body
      :show-close="true"
      custom-class="balance-password-modal"
      :header-border="false"
      >
      <div class="password-modal-body">
        <div class="input-group">
          <label class="password-label">余额密码：</label>
          <el-input
            v-model="balancePassword"
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="请输入密码"
            class="password-input"
            @keyup.enter="verifyPassword"
          >
            <!-- 密码可见性切换按钮 -->
            <template #append>
              <i
                class="el-icon-view password-eye"
                @click="isPasswordVisible = !isPasswordVisible"
                :class="{ 'eye-active': isPasswordVisible }"
              ></i>
            </template>
          </el-input>
        </div>
      </div>
      <template #footer>
        <div class="password-modal-footer">
          <!-- 仅修改密码弹窗的取消按钮点击事件 -->
          <el-button
            type="default"
            class="cancel-btn"
            @click="handleCancel"
          >
            {{ $t("cancel") }}
          </el-button>
          <el-button
            type="primary"
            class="confirm-btn"
            @click="verifyPassword"
            :loading="verifyLoading"
          >
            {{ $t("confirm") }}
          </el-button>
        </div>
      </template>
      </el-dialog>

      <!-- 支付成功弹窗 -->
      <el-dialog
        title=""
        :visible.sync="paySuccessVisible"
        width="500px"
        :close-on-click-modal="false"
        :show-close="true"
        custom-class="pay-success-modal"
        class="pay-success-ok"
        :header-border="false"
      >
        <div class="success-content">
          <!-- 替换为导入的支付成功图标 -->
          <div class="success-icon-wrap">
            <img :src="paySuccessIcon" alt="支付成功" class="success-icon" />
          </div>
          <!-- 居中的“支付成功”文案 -->
          <div class="success-title">{{ $t("auction.zfcg") }}</div>
          <!-- 订单信息区域 -->
          <div class="order-info">
            <p>{{ $t("auction.ddbh") }}：{{ successOrderInfo.sNo }}</p>
            <p class="pay-amount">{{ $t("auction.zfje") }}：¥{{ Number(successOrderInfo.total).toFixed(2) }}</p>
            <p>{{ $t("auction.zfsj") }}：{{ successOrderInfo.orderTime }}</p>
          </div>
        </div>
      </el-dialog>

      <!-- 出价弹框 -->
      <el-dialog
        title="出价"
        :visible.sync="bidModalVisible"
        width="420px"
        :close-on-click-modal="false"
        append-to-body
        :header-border="false"
        custom-class="bid-modal-custom"
      >
        <!-- 弹框内容 -->
        <div class="bid-modal-content">
          <!-- 当前价区域 -->
          <div class="current-price-wrap">
            <span class="current-label">{{ $t("auction.dqj") }}：</span>
            <span class="current-value">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(currentBidPrice)}}</span>
          </div>

          <!-- 价格调整区域 -->
          <div class="price-adjust-wrap">
            <button
              class="adjust-btn minus-btn"
              @click="decreaseBidPrice"
              :disabled="Number(bidPrice) <= Number(currentBidPrice)"
            >
              -
            </button>
            <el-input
              v-model="formatBidPrice"
              type="text"
              inputmode="numeric"
              pattern="[0-9.]+"
              class="price-input"
              @input="validateBidPrice"
              :disabled="true"
              :style="{fontSize: '22px', fontWeight: 'bold'}"
            ></el-input>
            <button
              class="adjust-btn plus-btn"
              @click="increaseBidPrice"
            >
              +
            </button>
          </div>
        </div>

        <!-- 弹框底部（确认出价按钮） -->
        <template #footer>
          <div class="bid-modal-footer">
            <el-button
              type="default"
              @click="bidModalVisible = false"
              style="margin-right: 10px;"
            >
              {{ $t("cancel") }}
            </el-button>
            <el-button
              type="primary"
              class="confirm-bid-btn"
              @click="confirmBid"
              :disabled="!isBidPriceValid"
              style="background-color: #B21E2E; border-color: #B21E2E; width: 120px;"
            >
              {{ $t("auction.qrcj") }}
            </el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 出价成功图片弹窗 -->
      <div class="success-popup" v-if="showSuccessImage">
        <div class="popup-mask" @click="closeSuccessImage"></div>
        <div class="popup-content">
          <img :src="successImage" alt="出价成功" class="success-img" />
          <!-- 出价成功文案（基于原型图定制） -->
          <div class="success-text">{{ $t("auction.cjcg") }}！</div>
        </div>
      </div>
      <!-- ========== 替换原有客服组件标签 核心传参 ✅ 必改 ========== -->
      <CustomerService
        ref="customerServiceRef"
        v-if="serviceVisible"
        :pc_user="pc_user"
        :currentMchId="shop_list.shop_id"
        :currentUserId="pc_user.userId"
        :ErrorImg="ErrorImg"
        @close="closeCustomerService"
      />
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
import wechatIcon from '~/static/images/pay-wechat.png'
import successImage from '~/static/images/cjcg.png'
import paySuccessIcon from '~/static/images/zfcg.png'
import alipayIcon from '~/static/images/pay-alipay.png'
import paypalIcon from '~/static/images/pay-paypal.png'
import walletIcon from '~/static/images/qianbao.png'
import stripeIcon from '~/static/images/stripe.png'
import CustomerService from '~/components/CustomerService.vue'

export default {
  components: {
    Header,
    HeaderNavbar,
    Footer,
    Body,
    AuctionBreadcrumb,
    CustomerService
  },
  data() {
    return {
      paySuccessIcon,
      successImage,
      productId: '',
      productInfo: {
        imgList: [],
        startTime: '',
        endTime: '',
        commission: 0,
        promise_amt:'',
        description: '',
        specialId:'',
        mark_up_amt:0,
        status:1,
      },
      endDate:'',
      startDate: '',
      categories: [],
      categoryId: '',
      subCategoryId: '',
      navTitle: '',
      breadcrumbs: [],
      countdown: { hh: '20', mm: '10', ss: '10' },
      countdownTimer: null,
      activeThumb: 0,
      activeTab: 'detail',
      bidRecordList: [],
      sortedBidRecordList: [],
      productDetailList:[],
      rule:'',
      second: 5,
      sourceNavIndex: -1,
      soucang: require('/static/images/soucang.png'),
      soucang_red: require('/static/images/soucang_red.png'),
      isCollection:false,
      shop_list: {},
      goodsTotal:0, //店铺拍品数量
      mchId:'',
      related_recommendations: [], // 相关推荐列表
      collectLoading: false, // 收藏按钮加载状态
      // 新增：保证金弹窗相关数据
      payModalVisible: false, // 弹窗显示状态
      auctionName: '', // 拍卖会名称
      depositAmount: 0, // 保证金金额
      ruleDesc: '', // 规则说明内容
      agreeProtocol: false, // 是否同意协议
      agreementModalVisible: false, // 协议弹窗显隐
      agreementContent: '', // 协议富文本内容
      payMethodsConfig: [
        { key: 'pc_wechat', name: '微信支付', icon: wechatIcon },
        { key: 'pc_alipay', name: '支付宝支付', icon: alipayIcon },
        { key: 'wallet_pay', name: '钱包支付', icon: walletIcon },
        { key: 'paypal', name: 'PayPal支付', icon: paypalIcon },
        { key: 'stripe', name: 'stripe支付', icon: stripeIcon }
      ],
      // 接口返回的支付方式状态
      paymentStatus: {},
      selectedPayMethod: 'wallet_pay',
      passwordModalVisible: false, // 密码弹窗显隐
      balancePassword: '', // 余额支付密码
      verifyLoading: false, // 密码验证加载状态
      //密码可见性控制
      isPasswordVisible: false,
      //订单信息
      order_list: {},
      paySuccessVisible: false, // 弹窗显隐
      successOrderInfo: { // 弹窗显示的订单信息
        sNo: '',
        total: 0,
        orderTime: ''
      },
      bidModalVisible: false, // 出价弹框显示状态
      currentBidPrice: 0, // 当前竞拍价格
      bidPrice: 0, // 用户输入的出价
      bidLoading: false, // 出价加载状态

      showSuccessImage: false, // 控制成功图片弹窗显示/隐藏
      serviceVisible: false,
      ErrorImg: require('~/static/images/default_picture.png'),
      pc_user:{},
      btnCountDownTime: 0,  // 按钮倒计时剩余秒数
      btnCountDownTimer: null, // 按钮倒计时定时器
      isOutAmt:false //是否可以出价
    }
  },
  computed: {
    isJoinBtnDisabled() {
      // 原有禁用逻辑 + 新增「倒计时中」禁用逻辑
      const originDisabled = this.isOutAmt;
      // 只要倒计时剩余秒数>0，按钮就禁用，优先级最高
      return !originDisabled || this.btnCountDownTime > 0 ;
    },
    joinBtnText() {
      if (this.btnCountDownTime > 0) {
        // 倒计时中：显示【X秒后可再次出价】
        return `${this.btnCountDownTime}${this.$t('auction.zccj')}`;
      } else {
        // 正常状态：显示原有的参与竞拍文字
        return this.$t('auction.cyjp');
      }
    },
    displayPayMethods() {
      return this.payMethodsConfig.filter(method => {
        // 只有当对应字段值为1时才显示
        return this.paymentStatus[method.key] === 1;
      });
    },
    //校验出价是否有效
    isBidPriceValid() {
      const bidNum = Number(this.bidPrice);
      const currentNum = Number(this.currentBidPrice);
      // 关键：使用goodsInfo.mark_up_amt作为加价幅度，兜底为0
      const step = Number(this.productInfo.mark_up_amt) || 0;

      // 加价幅度为0时，只要出价大于当前价即可
      if (step === 0) {
        return bidNum > currentNum;
      }
      // 出价必须大于当前价
      return bidNum > currentNum ;
    },
    //汇率计算
    formatBidPrice: {
      // 取值：给输入框显示「带汇率+格式化」后的金额
      get() {
        if (this.bidPrice && !isNaN(Number(this.bidPrice))) {
          return this.$LaiKeCommObject.formatPrice(Number(this.bidPrice));
        }
        return '0.00';
      },
      // 赋值：输入框赋值时，还原成「纯数字」给变量 bidPrice 存储
      set(val) {
        // 过滤掉所有非数字内容，只保留 数字和小数点，兼容手动输入
        const pureNum = val.replace(/[^\d.]/g, '');
        this.bidPrice = pureNum ? Number(pureNum).toFixed(2) : 0;
      }
    },
  },
  watch: {
    bidRecordList(newVal) {
      this.sortBidRecord(newVal);
    },
    //监听路由参数变化
    '$route.query.id'(newId, oldId) {
      if (newId && newId !== oldId) {
        // 重置状态（避免旧数据残留）
        this.productId = newId;
        this.productInfo = { imgList: [], startTime: '', endTime: '', commission: 0, description: '', specialId: '' };
        this.bidRecordList = [];
        this.sortedBidRecordList = [];
        this.productDetailList = [];
        this.rule = '';
        this.activeThumb = 0;
        // 重新加载所有数据
        this.getProductDetail();
        this.getBidRecord();
        this.getRule();
        this.getRelatedRecommend();
      }
    }
  },
  mounted() {
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.background = '#fff';
    document.body.style.minHeight = '100vh';

    this.pc_user = this.$cookies.get('pc_user') || {};
    console.log("pc_user",this.pc_user)
    this.productId = this.$route.query.id || '';
    this.mchId = this.$route.query.mchId || '';
    this.categoryId = this.$route.query.categoryId || '';
    this.subCategoryId = this.$route.query.subCategoryId || '';
    this.sourceNavIndex = this.$route.query.sourceNavIndex ? Number(this.$route.query.sourceNavIndex) : -1;

    this.selectedCategory = {cid: this.categoryId};
    this.selectedSubCategory = this.subCategoryId ? {cid: this.subCategoryId} : null;
    this.initBreadcrumbs();

    if (this.productId) {
      this.getProductDetail();
      this.getBidRecord();
      this.getRule();
      this.getRelatedRecommend(); // 获取相关推荐
    }
  },
  beforeUnmount() {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    if (this.btnCountDownTimer) clearInterval(this.btnCountDownTimer);
  },

  beforeDestroy() {
    if (this.btnCountDownTimer) clearInterval(this.btnCountDownTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  },

  methods: {
    initBtnCountDown() {
      // 1. 先清除旧的定时器，防止重复执行
      if (this.btnCountDownTimer) {
        clearInterval(this.btnCountDownTimer);
      }
      // 2. 将接口返回的second赋值给倒计时变量，作为总时长
      this.btnCountDownTime = this.second;
      // 3. 开启倒计时定时器 每秒执行一次
      this.btnCountDownTimer = setInterval(() => {
        if (this.btnCountDownTime > 0) {
          this.btnCountDownTime--;
        } else {
          // 倒计时结束，清除定时器
          clearInterval(this.btnCountDownTimer);
          this.btnCountDownTimer = null;
        }
      }, 1000);
    },
    getProductDetail() {
      // 明确返回Promise对象，避免返回undefined
      return new Promise(async (resolve, reject) => {
        try {
          const data = {
            api: "plugin.auction.pcAuction.getGoodsDetails",
            acid: this.productId
          };
          // 使用await确保请求完成
          const res = await this.$Api.doRequest(data);
          const goodsInfo = res.data.goodsInfo || {};

          this.productInfo = {
            ...goodsInfo,
            imgList: res.data.imgList || [],
            startTime: goodsInfo.startTime || '',
            endTime: res.data.endDate || '',
            commission: goodsInfo.commission || 0,
            description: goodsInfo.description || '',
            promise_amt: goodsInfo.promise_amt || 0,
            specialId: goodsInfo.specialId || '',
            mark_up_amt: goodsInfo.mark_up_amt || 0,
            status: goodsInfo.status,
          };
          //是否可以出价
          this.isOutAmt = res.data.isOutAmt
          console.log(" res.data.isOutAmt", res.data.isOutAmt)
          // 当前价：优先使用goodsInfo.price，兜底用起拍价
          this.currentBidPrice = Number(goodsInfo.price) || Number(this.productInfo.starting_amt) || 0;
          this.endDate = res.data.endDate;
          this.isCollection = res.data.isCollection || false;
          this.shop_list = res.data.shop_list || {};

          this.goodsTotal = res.data.shop_list.mchGoodsTotal;


          this.productDetailList = JSON.parse(this.productInfo.content) || [];
          if (this.productInfo.status === 1) {
            this.startDate = res.data.startDate || '';
          } else if (this.productInfo.status === 2) {
            this.startDate = res.data.endDate || '';
          } else {
            this.startDate = '';
          }

          const imgListLength = this.productInfo.imgList.length;
          this.activeThumb = imgListLength > 0 ? 0 : -1;

          if (this.startDate) {
            this.initCountdown(this.startDate);
          }

          // 成功时resolve
          resolve(res);
        } catch (error) {
          // 捕获所有异常，避免Promise被reject后未处理
          this.$message.error(error.message || '获取商品详情失败');
          reject(error);
        }
      });
    },

    // 获取相关推荐商品
    getRelatedRecommend() {
      const data = {
        api: "plugin.auction.pcAuction.getRelatedGoods",
        mchId: this.mchId
      };
      this.$Api.doRequest(data).then((res) => {
        this.related_recommendations = res.data.list || [];
      }).catch(error => {
        console.error("获取相关推荐失败：", error);
      });
    },

    getBidRecord() {
      const data = {
        api: "plugin.auction.pcAuction.getGoodsOutAmtRecord",
        acid: this.productId
      };
      this.$Api.doRequest(data).then((res) => {
        let mockList = res.data.list;
        const markedList = this.markBidStatus(mockList);
        this.sortBidRecord(markedList);
      }).catch(error => {
        this.$message.warning('获取出价记录失败');
      });
    },

    getRule() {
      const data = {
        api: "plugin.auction.pcAuction.getRule",
      };
      this.$Api.doRequest(data).then((res) => {
        this.rule = res.data.content;
        this.second = res.data.second;
      }).catch(error => {
        this.$message.warning('获取竞拍规则失败');
      });
    },

    getStatusMainText() {
      const status = this.productInfo.status;
      if (status === 1) {
        return this.$t('auction.jjks');
      } else if (status === 2) {
        return this.$t('auction.zzjp');
      } else {
        return this.$t('auction.jpjs');
      }
    },

    getStatusSubText() {
      const status = this.productInfo.status;
      if (status === 1) {
        return this.$t('auction.jks');
      } else if (status === 2) {
        return this.$t('auction.jjs');
      } else {
        return this.$t('auction.jpjs');
      }
    },

    markBidStatus(list) {
      if (!list.length) return [];
      const maxAmount = Math.max(...list.map(item => Number(item.bidAmount || item.price)));
      return list.map((item, idx) => {
        let isLeading = false;
        if (Number(item.bidAmount || item.price) === maxAmount) {
          isLeading = idx === list.findLastIndex(i => Number(i.bidAmount || i.price) === maxAmount);
        }
        return {
          ...item,
          status: isLeading ?  this.$t('auction.lx') :  this.$t('auction.cj')
        };
      });
    },

    sortBidRecord(list) {
      if (!list.length) {
        this.sortedBidRecordList = [];
        return;
      }
      const leadingItem = list.find(item => item.status === '领先');
      const outItems = list.filter(item => item.status === '出局');
      this.sortedBidRecordList = leadingItem ? [leadingItem, ...outItems] : outItems;
    },


    selectPayMethod(methodKey) {
      this.selectedPayMethod = methodKey;
      // 可选：选中后可触发其他逻辑，比如记录到表单/调用接口等
      console.log('选中的支付方式：', methodKey);
    },


    // 修改：调用保证金支付接口并控制弹窗
    handleJoinAuction() {
      // 调用支付保证金页面接口
      const data = {
        api: "plugin.auction.pcAuction.payPromisePage",
        specialId: this.productInfo.specialId
      };

      this.$Api.doRequest(data).then((res) => {
        const { isPayPromise, specialName, total, auctionRule, agreeContent, payment } = res.data;
        // 格式化保证金金额，避免字符串/数字类型问题，确保判断准确
        this.depositAmount = Number(total) || 0;

        // 核心判断逻辑
        if (isPayPromise || this.depositAmount == 0) {
          // 修复：添加catch处理Promise异常，避免then调用报错
          this.getProductDetail()
            .then(() => {
              const step = Number(this.productInfo.mark_up_amt) || 0;
              // 默认出价：当前价 + 加价幅度（加价幅度为0时默认+1）
             const price = this.bidPrice = step === 0
                ? Number(this.currentBidPrice) + 1
                : Number(this.currentBidPrice) + step;
              this.bidModalVisible = true;
              this.bidPrice = price.toFixed(2)
            })
            .catch((error) => {
              // 处理getProductDetail失败的情况
              console.error('刷新商品详情失败：', error);
              this.$message.error('获取最新价格失败，请重试');
              // 兜底：使用现有数据显示出价弹框
              const step = Number(this.productInfo.mark_up_amt) || 0;
              const price = this.bidPrice = step === 0
                ? Number(this.currentBidPrice) + 1
                : Number(this.currentBidPrice) + step;
              this.bidModalVisible = true;
              this.bidPrice = price.toFixed(2)
            });
        } else {
          // 未支付保证金金额>0 → 显示弹窗
          this.auctionName = specialName;
          this.ruleDesc = auctionRule;
          this.agreementContent = agreeContent;
          this.paymentStatus = payment || {};

          this.$nextTick(() => {
            this.payModalVisible = true;
          });
        }

      }).catch(error => {
        this.$message.error("获取保证金信息失败，请稍后再试");
        console.error("获取保证金信息异常：", error);
      });
    },

    getIsNextDisabled() {
      const imgListLength = this.productInfo.imgList.length;
      return this.activeThumb >= imgListLength - 1 || imgListLength === 0;
    },

    initCountdown(startDate) {
      if (!startDate) return;
      if (this.countdownTimer) clearInterval(this.countdownTimer);

      const targetTime = new Date(startDate).getTime();
      if (isNaN(targetTime)) {
        this.countdown = { hh: '00', mm: '00', ss: '00' };
        return;
      }

      this.calculateCountdown(targetTime);
      this.countdownTimer = setInterval(() => {
        this.calculateCountdown(targetTime);
      }, 1000);
    },

    calculateCountdown(targetTime) {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0 || isNaN(diff)) {
        clearInterval(this.countdownTimer);
        this.countdown = { hh: '00', mm: '00', ss: '00' };
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.countdown = {
        hh: this.padZero(hours),
        mm: this.padZero(minutes),
        ss: this.padZero(seconds)
      };
    },

    padZero(num) {
      return num.toString().padStart(2, '0');
    },

    initBreadcrumbs() {
      const originBreadcrumbs = this.$route.query.breadcrumbs;
      let baseBreadcrumbs = [];

      if (originBreadcrumbs) {
        try {
          baseBreadcrumbs = JSON.parse(originBreadcrumbs);
        } catch (e) {
          console.warn('面包屑参数解析失败：', e);
          baseBreadcrumbs = [
            { name: this.$t("sy"), type: 'home', path: '/' },
            { name: this.$t("oneAuction"), type: 'nav', path: '/auction/single-auction' }
          ];
        }
      } else {
        baseBreadcrumbs = [
          { name: this.$t("oneAuction"), type: 'nav', path: '/' }
        ];
      }

      this.breadcrumbs = [
        ...baseBreadcrumbs,
        {
          name: this.$t("auction.ppxq"),
          type: 'nav',
          path: this.$route.path
        }
      ];
    },

    prevThumb() {
      const imgListLength = this.productInfo.imgList.length;
      if (this.activeThumb > 0 && imgListLength > 0) {
        this.activeThumb--;
      }
    },

    nextThumb() {
      const imgListLength = this.productInfo.imgList.length;
      if (this.activeThumb < imgListLength - 1 && imgListLength > 0) {
        this.activeThumb++;
      }
    },

    handleCollect() {
      if (this.collectLoading) return;
      this.collectLoading = true;

      const data = {
        api: "plugin.auction.pcAuction.collection",
        acId: this.productId
      };

      this.$Api.doRequest(data).then((res) => {
        if (res.code == '200') {
          this.isCollection = !this.isCollection;
          this.$message.success(this.isCollection ? this.$t("auction.sccg") : this.$t("auction.qxsc"));
        }
      }).catch(error => {
        this.$message.error("收藏操作异常，请稍后再试");
        console.error("收藏接口调用失败：", error);
      }).finally(() => {
        this.collectLoading = false;
      });
    },

    handleService() {
      // 1. 判空，防止用户信息为空报错
      if (!this.pc_user || !this.pc_user.userId) {
        this.$message.warning('请先登录后再咨询客服');
        return;
      }
      // 2. 强制显示组件
      this.serviceVisible = true;
      console.log('serviceVisible=', this.serviceVisible); // 新增
      // 3. 【核心修复】不用$nextTick，直接延迟一点调用，百分百能拿到ref
      setTimeout(() => {
        if (this.$refs.customerServiceRef) {
          console.log('✅ 成功获取客服组件，执行打开方法');
          this.$refs.customerServiceRef.openKefu();
        } else {
          console.log('❌ 未获取到客服组件ref');
        }
      }, 100);
    },

    closeCustomerService() {
      this.serviceVisible = false;
    },
    // ========== 商品详情页面包屑点击跳转逻辑 ==========
    handleBreadcrumbClick(crumb, index) {},


    // 新增：进入店铺
    goMch(shop_list) {
      this.$router.push({
        path: '/auction/shop-info',
        query: {
          id: shop_list.shop_id,
          breadcrumbs: JSON.stringify(this.breadcrumbs),
          sourceNavIndex: 5,
          mch_name:shop_list.shop_name
        }
      });
    },

    // 推荐商品跳转详情
    toDetail(product) {
      console.log("product",product)
      if (!product || !product.acId) return; // 校验product和id是否存在
      this.$router.push({
        path: '/auction/product-detail',
        query: {
          id: product.acId,
          mchId: product.mchId,
          breadcrumbs: JSON.stringify(this.breadcrumbs),
          sourceNavIndex: 2, // 传递single-auction对应的导航索引（2）
          categoryId: this.categoryId,
          subCategoryId: this.subCategoryId,
        }
      });
    },

    // 新增：查看竞拍协议
    viewAgreement() {
      this.agreementModalVisible = true; // 打开协议弹窗
    },

    // 新增：立即支付保证金
    handlePayDeposit() {
      // 1. 校验是否选中支付方式
      if (!this.selectedPayMethod) {
        this.$message.warning(this.$t("auction.qxzzffs"));
        return;
      }

      // 2. 区分支付类型处理
      if (this.selectedPayMethod === 'wallet_pay') {
        // 余额支付：打开密码弹窗
        this.passwordModalVisible = true;
        return;
      } else {
        // 非余额支付：直接调用支付接口
        const payTypeMap = {
          'pc_wechat': 'pc_wechat',
          'pc_alipay': 'pc_alipay',
          'paypal': 'paypal',
          'stripe':'stripe'
        };
        const payType = payTypeMap[this.selectedPayMethod] || this.selectedPayMethod;
        this.doPayRequest(payType);
      }
    },

    handleCancel() {
      this.passwordModalVisible = false;
      this.balancePassword = ''; // 清空密码
      this.isPasswordVisible = false; // 重置密码可见状态
    },

    //验证余额支付密码
    verifyPassword() {
      // 1. 密码为空校验
      if (!this.balancePassword) {
        this.$message.warning(this.$t("auction.qsrzfmm"));
        return;
      }

      this.verifyLoading = true;
      // 2. 调用密码验证接口
      const verifyData = {
        api: "mall.User.paymentPassword",
        password: this.balancePassword,
      };

      this.$Api.doRequest(verifyData).then((res) => {
        // 判断返回code是否为50737
        if (res.code === "50737") {
          // 关闭密码弹窗并清空相关状态
          this.passwordModalVisible = false;
          this.balancePassword = '';
          this.isPasswordVisible = false;
          setTimeout(() => {
            this.$router.push({ path: '/my/my/security' });
          }, 1500);
          return;
        }

        if (res.code == 200) {
          // 密码验证通过：调用支付接口
          this.doPayRequest('wallet_pay');
          this.passwordModalVisible = false;
          this.balancePassword = ''; // 清空密码
          this.isPasswordVisible = false; // 重置密码可见状态
        } else {
          this.balancePassword = ''; // 验证失败也清空密码
        }
      }).catch(error => {
        this.$message.error('密码验证接口调用失败：' + (error.message || '网络异常'));
        console.error('密码验证失败：', error);
        this.balancePassword = ''; // 接口异常也清空密码
      }).finally(() => {
        this.verifyLoading = false;
      });
    },

    // 修改：仅处理保证金下单逻辑
    doPayRequest(payType) {
      const orderData = {
        api: "plugin.auction.pcAuction.payPromise",
        specialId: this.productInfo.specialId,
        payType: payType // 仅用于下单接口标记支付类型，不参与实际支付
      };

      this.$Api.doRequest(orderData).then((res) => {
        if (res.code == 200) {
          // 1. 存储下单接口返回的订单信息
          this.order_list = {
            sNo: res.data.sNo,
            total: res.data.total,
            orderTime: res.data.orderTime,
            specialId: res.data.specialId
          };
          // 2. 调用独立的通用支付接口（解耦核心逻辑）
          this.callUniversalPayApi(payType);
        }
      }).catch(error => {
        this.$message.error("保证金下单接口调用失败：" + error.message);
        console.error('保证金下单失败：', error);
      });
    },

    //通用支付接口调用（支持所有支付方式）
    callUniversalPayApi(payType) {
      // 校验订单信息是否完整
      if (!this.order_list.sNo || !this.order_list.total) {
        this.$message.error("订单信息不完整，无法发起支付");
        return;
      }
      const title = '竞拍保证金';
      console.log("this.order_list",this.order_list);

      if (payType === 'wallet_pay') {
        const payParams = {
          api: "mall.Pay.index",
          sNo: this.order_list.sNo,
          payment_money: this.order_list.total,
          order_list:JSON.stringify(this.order_list),
          payType: payType,
          parameter: JSON.stringify({
            "laikeApi": "plugin.auction.payPromise"
          })
        };
        this.$Api.doRequest(payParams).then((payRes) => {
          if (payRes.code == 200) {
            // 赋值弹窗订单信息
            this.successOrderInfo = {
              sNo: this.order_list.sNo,
              total: this.order_list.total,
              orderTime: this.order_list.orderTime
            };
            // 关闭支付模态框
            this.payModalVisible = false;
            setTimeout(() => {
              this.paySuccessVisible = true;
            }, 1000);
          }
        });
      }
      else if (payType === 'pc_wechat') {
        var payData = {
          api: "mall.Pay.index",
          payment_money:this.order_list.total,
          remarks: title, //  订单备注
          title: title,
          order_list: this.order_list,
          trade_no:this.order_list.sNo,//竞拍保证金支付单号，为了/pay/scanCode查询订单详情判断第三方支付查询订单是否支付成功用的
          type: payType, //  支付类型
          sNo: this.order_list.sNo,
          parameter: JSON.stringify({
            "laikeApi": "plugin.auction.payPromise"
          })
        };
        this.$cookies.set("payData", payData);
        this.$storage.set("payData", payData);
        this.$router.push({
          path: "/pay/scanCode",
        });
      }else if (payType == "pc_alipay") {
        var payData = {
          api: "mall.Pay.index",
          payment_money: this.order_list.total, //会员特惠 兑换券级别
          remarks: title, //  订单备注
          title: title,
          sNo: this.order_list.sNo,
          trade_no:this.order_list.sNo,//竞拍保证金支付单号，为了/pay/scanCode查询订单详情判断第三方支付查询订单是否支付成功用的
          order_list:this.order_list,
          type: payType, //  支付类型
          parameter: JSON.stringify({
            "laikeApi": "plugin.auction.payPromise"
          })
        };
        this.$cookies.set("payData", payData);
        this.$storage.set("payData", payData);
        this.$router.push({
          path: "/pay/scanCode",
        });
      }else if (payType == "paypal") {
        var payData = {
          api: "mall.Pay.index",
          payment_money: this.order_list.total, //会员特惠 兑换券级别
          remarks: title, //  订单备注
          title: title,
          trade_no:this.order_list.sNo,//竞拍保证金支付单号，为了/pay/scanCode查询订单详情判断第三方支付查询订单是否支付成功用的
          order_list: this.order_list,
          sNo: this.order_list.sNo,
          pay_type: payType,
          type: payType, //  支付类型
          parameter: JSON.stringify({
            "laikeApi": "plugin.auction.payPromise"
          })
        };
        this.$cookies.set("payData", payData);
        this.$storage.set("payData", payData);
        this.$router.push({
          path: "/pay/scanCode",
        });
      } else if (payTyp == "stripe") {
        this.$Api.doRequest({
          api: "mall.Pay.index",
          payment_money: this.order_list.total, //会员特惠 兑换券级别
          trade_no:this.order_list.sNo,//竞拍保证金支付单号，为了/pay/scanCode查询订单详情判断第三方支付查询订单是否支付成功用的
          remarks: title, //  订单备注
          title: title,
          order_list: this.order_list,
          sNo: this.order_list.sNo,
          pay_type:payType,
          type: payType, //  支付类型
          parameter: JSON.stringify({
            "laikeApi": "plugin.auction.payPromise"
          })
        }).then(res => {
          console.log(res)
          if (res.code == 200) {
            const stripe_id = res.data.stripe_id
            const publishable_key = res.data.publishable_key
            // 初始化 Stripe（用你的 publishable key）
            const stripe = Stripe(publishable_key);
            // 重定向到 Stripe Checkout
            stripe.redirectToCheckout({
              sessionId: stripe_id
            }).then(function (result) {
            });
          }
        })
        this.$cookies.set("payData", data);
        this.$storage.set("payData", data);
      }
   /*   this.$Api.doRequest(payParams).then((payRes) => {
        this.order_list = payRes.data; // 补上原代码的核心赋值，和你原有逻辑兼容
        // 1. 钱包支付的逻辑 (保留你自己的原有完整逻辑，完全不变)
        if (payType === 'wallet_pay') {
          if (payRes.code == 200) {
            // 赋值弹窗订单信息
            this.successOrderInfo = {
              sNo: this.order_list.sNo,
              total: this.order_list.total,
              orderTime: this.order_list.orderTime
            };
            // 关闭支付模态框
            this.payModalVisible = false;
            setTimeout(() => {
              this.paySuccessVisible = true;
            }, 1000);
          }
        }
        // 2. 微信扫码支付 pc_wechat (新增原代码的支付逻辑)
        else if (payType === 'pc_wechat') {
          const payData = {
            api: "mall.Pay.index",
            total: this.order_list.total,
            remarks: title,
            title: title,
            order_list: JSON.stringify(this.order_list),
            type: payType,
            parameter: JSON.stringify({
              "laikeApi": "plugin.auction.payPromise"
            })
          };
          this.$cookies.set("payData", payData);
          this.$storage.set("payData", payData);
          this.$router.push({ path: "/pay/scanCode" });
          this.payModalVisible = false;
        }
        // 3. 支付宝扫码支付 pc_alipay (新增原代码的支付逻辑)
        else if (payType === 'pc_alipay') {
          const payData = {
            api: "mall.Pay.index",
            total: this.order_list.total,
            remarks: title,
            title: title,
            order_list: JSON.stringify(this.order_list),
            type: payType,
            parameter: JSON.stringify({
              "laikeApi": "plugin.auction.payPromise"
            })
          };
          this.$cookies.set("payData", payData);
          this.$storage.set("payData", payData);
          this.$router.push({ path: "/pay/scanCode" });
          this.payModalVisible = false;
        }
        // 4. paypal支付 (新增原代码的支付逻辑)
        else if (payType === 'paypal') {
          const payData = {
            api: "mall.Pay.index",
            total: this.order_list.total,
            remarks: title,
            title: title,
            order_list: JSON.stringify(this.order_list),
            sNo: this.order_list.sNo,
            pay_type: payType,
            type: payType,
            parameter: JSON.stringify({
              "laikeApi": "plugin.auction.payPromise"
            })
          };
          this.$cookies.set("payData", payData);
          this.$storage.set("payData", payData);
          this.$router.push({ path: "/pay/scanCode" });
          this.payModalVisible = false;
        }
        // 5. stripe支付 (新增原代码的完整逻辑，含二次请求+支付跳转)
        else if (payType === 'stripe') {
          this.$Api.doRequest({
            api: "mall.Pay.index",
            total: this.order_list.total,
            remarks: title,
            title: title,
            sNo: this.order_list.sNo,
            pay_type: payType,
            type: payType,
            parameter: JSON.stringify({
              "laikeApi": "plugin.auction.payPromise"
            })
          }).then(res => {
            console.log(res)
            if (res.code == 200) {
              const stripe_id = res.data.stripe_id
              const publishable_key = res.data.publishable_key
              // 初始化 Stripe 并跳转支付
              const stripe = Stripe(publishable_key);
              stripe.redirectToCheckout({
                sessionId: stripe_id
              }).then(function (result) {});
            } else {
              this.$message.error(res.message || "Stripe支付初始化失败");
            }
          })
          this.$cookies.set("payData", payParams);
          this.$storage.set("payData", payParams);
          this.payModalVisible = false;
        }
      }).catch(payError => {
        this.$message.error("支付接口调用失败：" + (payError.message || "网络异常"));
        console.error('通用支付接口失败：', payError);
      });*/
    },

    // 减少出价
    decreaseBidPrice() {
      // 使用接口返回的加价幅度
      const step = Number(this.productInfo.mark_up_amt) || 0;
      if (step === 0) {
        this.$message.warning("当前商品未设置加价幅度，无法调整价格");
        return;
      }
      const newPrice = Number(this.bidPrice) - step;
      if (newPrice >= Number(this.currentBidPrice)) {
        this.bidPrice = newPrice.toFixed(2);
      }
    },

    // 增加出价
    increaseBidPrice() {
      // 使用接口返回的加价幅度
      const step = Number(this.productInfo.mark_up_amt) || 0;
      if (step === 0) {
        this.$message.warning("当前商品未设置加价幅度，无法调整价格");
        return;
      }
      this.bidPrice = (Number(this.bidPrice) + step).toFixed(2);
    },

    // 校验出价输入
    validateBidPrice() {
      let price = Number(this.bidPrice).toFixed(2);
      const current = Number(this.currentBidPrice).toFixed(2);
      // 使用接口返回的加价幅度
      const step = Number(this.productInfo.mark_up_amt) || 0;

      // 确保价格为数字
      if (isNaN(price)) {
        // 加价幅度为0时，默认出价为当前价+1
        this.bidPrice = step === 0 ? current + 1 : current + step;
        return;
      }

      // 确保价格不低于当前价
      if (price < current) {
        this.bidPrice = step === 0 ? current + 1 : current + step;
      }
    },

    // 确认出价
    confirmBid() {
      const step = Number(this.productInfo.mark_up_amt) || 0;
      if (!this.isBidPriceValid) {
        if (step === 0) {
          this.$message.warning(`出价必须大于当前价¥${this.currentBidPrice}`);
        } else {
          this.$message.warning(`出价必须大于当前价¥${this.currentBidPrice}，且为加价幅度¥${this.productInfo.mark_up_amt}的整数倍`);
        }
        return;
      }

      this.bidLoading = true;
      // 调用出价接口
      const data = {
        api: "plugin.auction.pcAuction.offerAmt",
        acGoodsId: this.productId,
        price: this.bidPrice,
        /*specialId: this.productInfo.specialId*/
      };

      this.$Api.doRequest(data).then((res) => {
        if (res.code == 200) {
          // 1. 隐藏出价弹框
          this.bidModalVisible = false;
          // 2. 显示成功图片弹窗
          this.showSuccessImage = true;
          this.initBtnCountDown();
          // 3. 5秒后自动关闭弹窗（核心：仅保留自动关闭）
          setTimeout(() => {
            this.closeSuccessImage();
          }, 2000);
          // 4. 刷新商品详情和出价记录
          this.getProductDetail().then(() => {
            this.getBidRecord();
          });
        }
      }).catch(error => {
        this.$message.error("出价接口调用失败：" + (error.message || "网络异常"));
        console.error("出价失败：", error);
      }).finally(() => {
        this.bidLoading = false;
      });
    },

    // 关闭成功图片弹窗（仅内部调用）
    closeSuccessImage() {
      this.showSuccessImage = false;
    },

  }
}
</script>

<style scoped>
.auction-detail-page {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.detail-main {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.detail-left {
  width: 400px;
}
.main-img {
  width: 100%;
  height: 400px;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.thumb-img-wrap {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.thumb-prev, .thumb-next {
  width: 24px;
  height: 24px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
.thumb-prev:disabled, .thumb-next:disabled {
  cursor: not-allowed;
  color: #ccc;
}
.thumb-img-list {
  display: flex;
  gap: 10px;
  margin: 0 5px;
  overflow: hidden;
}
.thumb-item {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  cursor: pointer;
}
.thumb-item.active {
  border-color: #B21E2E;
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-right {
  flex: 1;
  padding: 10px 0;
}
.product-title {
  font-size: 22px;
  color: #333;
  margin: 0 0 10px;
  font-weight: 600;
}
.product-spec {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}
.info-border-wrapper {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 20px;
  margin-top: 10px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* 竞拍状态样式 */
.auction-status {
  margin-bottom: 20px;
}
.status-bg {
  width: 100%;
  max-width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: space-between;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
}
.status-bg-jjks {
  background-image: url('~/static/images/jjks.png') !important;
}
.status-bg-zzjp {
  background-image: url('~/static/images/zzjp.png') !important;
}

/* 竞拍结束样式 */
.status-end-wrap {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 48px;
  background-color: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}
.status-end-tag {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 100%;
  background-color: #999;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}
.status-end-tag::after {
  content: '';
  position: absolute;
  right: -16px;
  top: 0;
  width: 0;
  height: 0;
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  border-left: 16px solid #999;
}
.status-end-info {
  flex: 1;
  padding: 8px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.end-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}
.end-time {
  font-size: 12px;
  color: #666;
}

/* 倒计时样式 */
.countdown-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-text {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  margin-right: auto;
}
.countdown-label {
  font-size: 14px;
  color: #fff;
  margin-right: 0;
}
.countdown-box {
  background: transparent;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 14px;
}
.time-item {
  background: rgba(255,255,255,0.9);
  padding: 2px 8px;
  border-radius: 4px;
  color: #333;
}
.time-split {
  color: #fff;
  margin: 0 2px;
}
.countdown-box span {
  padding: 0 3px;
}

/* 价格样式 */
.price-main {
  margin-bottom: 20px;
}
.price-item {
  margin-bottom: 10px;
  font-size: 16px;
}
.price-item .label {
  color: #666;
  margin-right: 10px;
}
.price-item .value {
  color: #B21E2E;
  font-size: 20px;
  font-weight: 700;
}

/* 操作按钮 */
.action-bar {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.join-auction-btn {
  width: 180px;
  height: 48px;
  background-color: #B21E2E;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.join-auction-btn.btn-disabled,
.join-auction-btn:disabled {
  background-color: #c0c4cc !important;
  cursor: not-allowed !important;
  color: #fff !important;
  border: none !important;
  opacity: 0.7; /* 可选：增加透明度，更明显的禁灰效果 */
}

.join-auction-btn:hover:not(:disabled):not(.btn-disabled) {
  background-color: #9c1a27;
}

.join-auction-btn:hover {
  background-color: #9c1a27;
}
.action-icons {
  display: flex;
  gap: 10px;
}
.icon-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 48px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  color: #666;
  font-size: 12px;
}
.icon-btn i {
  font-size: 18px;
  margin-bottom: 2px;
}

/* 底部价格栏 */
.price-bottom-bar {
  display: flex;
  border-top: 1px solid #eee;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #F6F6F6;
}
.price-bar-item {
  flex: 1;
  text-align: center;
}
.bar-value {
  color: #B21E2E;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 5px;
}
.bar-label {
  font-size: 12px;
  color: #666;
}
.bar-label i {
  font-size: 12px;
  margin-left: 2px;
  cursor: help;
}
.ended-stat-divider {
  width: 1px;
  height: 36px;
  background-color: #e5e5e5;
  flex-shrink: 0;
}

/* 商品详情标签页 */
.product-detail-tab {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
  /* 新增：设置最大高度，可根据需求调整 */
  max-height: 1200px;
  /* 新增：超出高度时垂直滚动 */
  overflow-y: auto;
}
.tab-nav {
  display: flex;
  background-color: #f8f8f8;
  border-bottom: 1px solid #e5e5e5;
}
.tab-item {
  padding: 15px 30px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}
.tab-item.active {
  color: #B21E2E;
  border-bottom-color: #B21E2E;
  background-color: #fff;
  font-weight: 600;
}
.tab-item:hover:not(.active) {
  color: #B21E2E;
  background-color: #fafafa;
}
.tab-content {
  padding: 20px;
  min-height: 400px;
}
.content-item {
  width: 100%;
}

/* 拍品详情样式 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.detail-module {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
.module-title {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}
.module-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
.module-content p {
  margin-bottom: 10px;
}
.module-content img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}
.detail-empty {
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 14px;
}

/* 出价记录样式 */
.record-content {
  padding: 10px 0;
}
.record-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
  font-size: 14px;
}
.record-empty i {
  font-size: 48px;
  margin-bottom: 15px;
}
.record-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.record-table thead th {
  background-color: #f8f8f8;
  padding: 12px 15px;
  text-align: left;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #e5e5e5;
}
.record-table tbody td {
  padding: 12px 15px;
  color: #666;
  border-bottom: 1px solid #eee;
}
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
}
.status-tag.leading {
  background-color: #B21E2E;
  color: #fff;
}
.status-tag.out {
  background-color: #e5e5e5;
  color: #666;
}

/* 竞拍规则样式 */
.rule-content {
  padding: 10px 0;
}
.rule-rich-content {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  padding: 10px 15px;
}
.rule-rich-content h1, .rule-rich-content h2, .rule-rich-content h3, .rule-rich-content h4 {
  color: #333;
  font-weight: 600;
  margin: 15px 0 10px;
}
.rule-rich-content p {
  margin-bottom: 10px;
}
.rule-rich-content ul, .rule-rich-content ol {
  margin: 10px 0 10px 20px;
}
.rule-rich-content li {
  margin-bottom: 5px;
}
.rule-rich-content img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border: 1px solid #eee;
  border-radius: 4px;
}
.rule-empty {
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 14px;
}

/* 右侧店铺信息列（1:1匹配原型） */
.right-side-panel {
  width: 280px;
  /* 新增：与左侧详情页保持一致的最大高度 */
  max-height: 1200px;
  /* 新增：超出高度时垂直滚动 */
  overflow-y: auto;
  /* 可选：添加滚动条样式优化 */
  scrollbar-width: thin;
  scrollbar-color: #ccc #f5f5f5;
}

/* 店铺信息卡片 */
.shop-info-card {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}
.shop-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.shop-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee;
  margin-right: 10px;
  object-fit: cover;
}
.shop-name {
  font-size: 14px;
  color: #333;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.enter-shop-btn {
  width: 60px;
  height: 28px;
  background-color: #d4282d;
  color: #fff;
  border: none;
  border-radius: 2px;
  font-size: 12px;
  cursor: pointer;
}

/* 店铺统计数据 */
.shop-stats {
  display: flex;
  justify-content: space-between;
}
.stat-item {
  text-align: center;
  width: 33%;
}
.stat-value {
  font-size: 16px;
  color: #333;
  font-weight: 700;
  margin-bottom: 4px;
}
.stat-label {
  font-size: 12px;
  color: #999;
}

/* 相关推荐模块 */
.related-recommend {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
}
.recommend-title {
  font-size: 14px;
  color: #000;
  font-weight: 700;
  margin-bottom: 15px;
  padding: 0 10px;
  text-align: center;
  position: relative;
}

.recommend-title::before,
.recommend-title::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 40px);
  height: 1px;
  background-color: #f0f0f0;
}
.recommend-title::before {
  left: 0;
  transform: translateY(-50%);
}
.recommend-title::after {
  right: 0;
  transform: translateY(-50%);
}

.recommend-title .line {
  flex: 1;
  height: 1px;
  background-color: #ccc; /* 横线颜色 */
  max-width: 60px; /* 横线最大宽度，可根据需要调整 */
}
.recommend-title .title-text {
  white-space: nowrap;
  color: #010101;
}
/* 移除原有底部边框 */
.recommend-title {
  padding-bottom: 0;
  border-bottom: none;
}

/* 其他原有样式保持不变 */
.recommend-list {
  list-style: none;
  padding: 0;
  margin: 0;
  /* 新增：防止内部元素撑开容器 */
  overflow: hidden;
}
.recommend-item {
  margin-bottom: 15px;
  cursor: pointer;
}
.recommend-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 8px;
}
.recommend-name {
  font-size: 12px;
  color: #333;
  line-height: 1.4;
  height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 4px;
}
.recommend-price {
  font-size: 14px;
  color: #d4282d;
}
.price-label {
  font-size: 12px;
  color: #999;
  margin-right: 2px;
}
.price-value {
  font-weight: 700;
}

/* 占位样式 */
.placeholder .img-placeholder {
  width: 100%;
  height: 180px;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}
.placeholder .text-placeholder {
  width: 100%;
  height: 28px;
  background-color: #f5f5f5;
  border-radius: 2px;
  margin-bottom: 4px;
}
.placeholder .price-placeholder {
  width: 80px;
  height: 18px;
  background-color: #f5f5f5;
  border-radius: 2px;
}

/* 新增：保证金弹窗样式 */
.pay-modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.modal-header {
  background: #ffe6e8;
  padding: 15px 20px;
  border: 1px solid #f08080; /* 红色边框线 */
  margin-top: 5px; /* 下划线与modal-header之间留少量间距，更美观 */
}
.auction-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
  font-weight: 600;
}
.deposit {
  font-size: 18px;
  color: #B21E2E;
  font-weight: bold;
}

/* 3. 规则说明（新增灰色背景） */
.rule-wrap {
  flex: 1; /* 占满剩余高度 */
  overflow-y: auto; /* 规则内容单独滚动 */
  padding: 15px 0px;
}
.rule-wrap h4 {
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 600;
}
.rule-content {
  max-height: 180px;
  overflow-y: auto;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
  padding: 10px;
  background-color: #f5f5f5; /* 规则说明灰色背景 */
  border-radius: 4px;
  height: 200px;
}

/* 4. 支付方式 */
.pay-method {
  padding: 0 0px 15px;
}
.pay-method h4 {
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 600;
}
.method-icons {
  display: flex;
  align-items: center;
  /* 增大间距：从15px改为20px，可根据需求调整 */
  gap: 50px;
  /* 防止容器宽度不足导致换行 */
  flex-wrap: wrap;
  padding: 5px 0;
}

/* 支付方式图标样式 */
.method-icons > img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  display: block;
  border-radius: 6px;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
  /* 细边框：从2px改为1px，更精致 */
  border: 1px solid #e5e5e5;
  padding: 2px;
}

.method-icons > img.pay-icon-selected {
  /* 细红色边框 */
  border-color: #B21E2E !important;
  border-width: 1px !important;
  /* 浅红背景，和弹窗头部呼应 */
  background-color: #ffe6e8 !important;
  /* 轻微放大：从1.15改为1.08 */
  transform: scale(1.08) !important;
  /* 轻微阴影：缩小扩散半径+降低不透明度 */
  box-shadow: 0 0 4px rgba(178, 30, 46, 0.15) !important;
  z-index: 10;
}

/* 可选：hover未选中状态的样式 */
.method-icons img:not(.pay-icon-selected):hover {
  border-color: #e0e0e0;
  background-color: #fefefe;
  transform: scale(1.05);
}

.method-icons img:hover {
  transform: scale(1.05);
}



/* 5. 协议勾选 + 立即支付（同一行） */
.agreement-pay-wrap {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 两端对齐：左边协议，右边按钮 */
  padding: 15px 0px;
  border-top: 1px solid #eee;
  width: 100%; /* 确保容器宽度100% */
}
.agreement-checkbox {
  font-size: 12px;
  color: #666;
  margin: 0 !important; /* 清除Element默认margin */
  flex: 0 0 auto; /* 不伸缩，保持原有宽度 */
}
.agreement-checkbox a {
  color: #409EFF;
  margin-left: 5px;
}
.pay-btn {
  width: 120px;
  height: 36px;
  border-radius: 4px;
  font-size: 14px;
  flex: 0 0 auto; /* 不伸缩，固定宽度 */
}

/* 固定弹窗高度为800px */
.fixed-height-dialog {
  height: 800px !important;
}

/* 控制弹窗内容区高度，超出滚动 */
.fixed-height-dialog .el-dialog__body {
  height: calc(800px - 60px); /* 减去弹窗头部高度，适配800px总高 */
  padding: 0 !important; /* 清除默认内边距，避免高度溢出 */
  overflow-y: auto; /* 内容超出时滚动 */
}

::v-deep .el-dialog__header{
  border-bottom: 1px solid #eee;
}

::v-deep .el-dialog__body{
  padding: 10px 20px;
}

.agreement-content {
  min-height: 400px !important;
  max-height: 600px !important;
  overflow-y: auto;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

.agreement-content h1,
.agreement-content h2,
.agreement-content h3 {
  margin: 20px 0 10px;
  font-weight: bold;
}
.agreement-content p {
  margin-bottom: 10px;
}


/* 弹窗整体样式 */
::v-deep .balance-password-modal {
  border-radius: 0 !important;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
::v-deep .balance-password-modal .el-dialog__header {
  padding: 10px 20px !important; /* 降低头部高度 */
  border-bottom: 1px solid #e5e5e5;
}
::v-deep .balance-password-modal .el-dialog__title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
::v-deep .balance-password-modal .el-dialog__close {
  color: #999;
}

/* 弹窗内容区 - 降低高度 */
::v-deep .balance-password-modal .el-dialog__body {
  padding: 15px 20px !important;
  height: 80px !important; /* 固定内容区高度，降低整体弹窗高度 */
}
.password-modal-body {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /* 输入框垂直居中 */
}
.input-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
.password-label {
  font-size: 14px;
  color: #333;
  margin-right: 10px;
  width: 80px;
  text-align: right;
}
.password-input {
  width: 300px; /* 输入框加宽 */
  height: 36px;
  border-radius: 2px !important;
  border: 1px solid #e5e5e5;
}
/* 密码眼睛图标 */
.password-eye {
  color: #999;
  cursor: pointer;
  font-size: 16px;
  margin-right: 5px;
}
.password-eye.eye-active {
  color: #333;
}

/* 弹窗底部按钮区 - 灰色背景+按钮靠右 */
::v-deep .balance-password-modal .el-dialog__footer {
  padding: 0 !important; /* 清空默认内边距 */
  margin: 0 !important;
}
.password-modal-footer {
  height: 50px; /* 固定按钮区高度 */
  background-color: #f5f5f5 !important; /* 灰色背景 */
  border-top: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 按钮靠右 */
  padding-right: 20px !important; /* 右侧间距 */
}
.cancel-btn {
  width: 80px;
  height: 36px;
  border-radius: 2px !important;
  background: #fff;
  border: 1px solid #e5e5e5;
  color: #666;
  margin-right: 10px;
}
.confirm-btn {
  width: 80px;
  height: 36px;
  border-radius: 2px !important;
  background: #B21E2E !important; /* 原型红色 */
  border: none !important;
  color: #fff !important;
}


/* 支付成功弹窗样式 - 调整图标样式 */
.pay-success-modal ::v-deep .el-dialog {
  width: 500px !important;
  border-radius: 4px;
}
.pay-success-modal ::v-deep .el-dialog__header {
  border: none;
  padding: 20px 20px 0;
}
.pay-success-modal ::v-deep .el-dialog__body {
  padding: 10px 20px 30px; /* 增加底部内边距，替代按钮区域 */
  text-align: center;
}
.success-content {
  margin-bottom: 0; /* 移除底部间距 */
}

/* 支付成功图标容器（保持居中） */
.success-icon-wrap {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 支付成功图标样式 */
.success-icon {
  width: 60px; /* 图标宽度匹配容器 */
  height: 60px; /* 图标高度匹配容器 */
  object-fit: contain; /* 保持图标比例 */
}

/* 支付成功文案（居中） */
.success-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

/* 订单信息区域 */
.order-info {
  text-align: left;
  font-size: 14px;
  color: #666;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}
.order-info p {
  margin: 10px 0;
  line-height: 1.5;
}
/* 支付金额红色 */
.pay-amount {
  color: #B21E2E;
  font-weight: 600;
}
::v-deep .pay-success-ok .el-dialog__header{
  border: none;
}

/* 出价弹框样式 */
/* 出价弹框自定义样式 */
::v-deep .bid-modal-custom .el-dialog {
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

::v-deep .bid-modal-custom .el-dialog__header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

::v-deep .bid-modal-custom .el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

::v-deep .bid-modal-custom .el-dialog__body {
  padding: 20px 20px 10px;
}

::v-deep .bid-modal-custom .el-dialog__footer {
  padding: 10px 20px 20px;
  border-top: 0;
  text-align: right;
}

/* 弹框内容样式 */
.bid-modal-content {
  text-align: center;
}

/* 当前价区域 */
.current-price-wrap {
  margin-bottom: 20px;
  font-size: 16px;
}

.current-label {
  color: #666;
  margin-right: 5px;
}

.current-value {
  color: #B21E2E;
  font-weight: bold;
  font-size: 18px;
}

/* 价格调整区域 */
.price-adjust-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0; /* 按钮与输入框无间距 */
  margin-bottom: 10px;
}

.adjust-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e5e5;
  background: #EEEEEE;
  cursor: pointer;
  font-size: 20px;
  color: #333;
  padding: 0;
  /* 消除按钮默认样式 */
  outline: none;
  box-shadow: none;
}

.adjust-btn:disabled {
  cursor: not-allowed;
  color: #ccc;
  background-color: #f5f5f5;
}

/* 输入框样式 */
.price-input {
  width: 180px;
  height: 40px;
  text-align: center;
  border-left: 0;
  border-right: 0;
  /* 覆盖element默认样式 */
  ::v-deep .el-input__inner {
    border-radius: 0;
    border-left: 0;
    border-right: 0;
    height: 40px;
    line-height: 40px;
  }
}

/* 底部按钮 */
.bid-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 出价成功弹窗整体容器 */
.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

/* 弹窗渐入动画 */
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 半透明遮罩层 */
.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 原型图遮罩偏浅，调整透明度 */
  pointer-events: auto; /* 点击遮罩可关闭 */
}

/* 图片+文案容器 */
.popup-content {
  position: relative;
  z-index: 1;
  text-align: center;
  transform: scale(0.8);
  animation: scaleIn 0.3s ease forwards;
  /* 适配原型图的图片尺寸比例 */
  max-width: 600px;
}

/* 容器缩放动画 */
@keyframes scaleIn {
  to {
    transform: scale(1);
  }
}

/* 背景图样式 */
.success-img {
  width: 100%; /* 撑满容器，保持原型图比例 */
  height: auto;
  border-radius: 8px; /* 原型图圆角效果 */
  display: block;
}

/* 核心：出价成功文案（1:1还原原型图） */
.success-text {
  /* 绝对定位精准居中 */
  position: absolute;
  top: 72%; /* 基于原型图调整垂直位置（偏下） */
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  /* 文字样式 */
  font-size: 32px; /* 原型图字号 */
  font-weight: bold; /* 加粗 */
  color: #FFF7DE;
  letter-spacing: 2px; /* 字间距（原型图文字略宽） */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 轻微阴影增强立体感 */

  /* 适配性调整 */
  white-space: nowrap; /* 防止文字换行 */
  padding: 0 20px;
}

/* 移动端适配（保持原型比例） */
@media (max-width: 768px) {
  .success-text {
    font-size: 24px;
    letter-spacing: 1px;
    -webkit-text-stroke: 0.5px #D4282D;
  }
}


</style>
