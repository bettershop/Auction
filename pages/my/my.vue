<template>
  <div class="bgcolor">
    <div id="myApp">
      <input type="hidden" name="page" :value="$t('pageTitile[0]')" />
      <div class="w">
        <el-row type="flex" :gutter="0" class="tac" style="padding-bottom: 60px">
          <!-- 左侧导航条 -->
          <el-col style="width: 220px">
            <el-menu class="el-menu-vertical-demo" :default-active="defaultActive" active-text-color="#D4282D" style="height: 100%" router>
              <el-menu-item-group class="border-none">
                <template slot="title">{{ $t('my.tab[0]') }}</template>
                <el-menu-item index="/my/my/myOrder">{{
                  $t('my.tab[1]')
                }}</el-menu-item>
                <!-- <el-menu-item index="group/groupOrder" disabled>我的拼团</el-menu-item>
							<el-menu-item index="noPages1" disabled>我的砍价</el-menu-item>
							<el-menu-item index="noPages2" disabled>我的竞拍</el-menu-item>
							<el-menu-item index="noPages3" disabled>我的抽奖</el-menu-item>
							<el-menu-item index="noPages4" disabled>分销中心</el-menu-item>
							<el-menu-item index="noPages5" disabled>邀请好友</el-menu-item> -->
                <el-menu-item index="/my/my/management">{{
                  $t('my.tab[2]')
                }}</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <template slot="title">{{ $t('my.tab[3]') }}</template>
<!--                <el-menu-item index="/my/my/mycoupon">{{
                  $t('my.tab[4]')
                }}</el-menu-item>-->
                <el-menu-item index="/my/my/myWallet">{{
                  $t('my.tab[5]')
                }}</el-menu-item>
                <el-menu-item v-show="pluginStatus && pluginStatus.integralPlugin == true" index="/my/my/myintegral">{{
                  $t('my.tab[6]')
                }}</el-menu-item>
                <el-menu-item index="/my/my/myBankCard">{{
                  $t('my.bankCard')
                }}</el-menu-item>
                <el-menu-item index="/my/my/memberCenter" v-show="pluginStatus && pluginStatus.memberPlugin == true">{{ $t('my.hyzx') }}</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group class="pb46">
                <template slot="title">{{ $t('my.tab[7]') }}</template>
                <el-menu-item index="/my/my/invoiceManagement">{{
                  $t('my.fpgl')
                }}</el-menu-item>
                <el-menu-item index="/my/my/message">{{
                  $t('my.tab[8]')
                }}</el-menu-item>
                <el-menu-item index="/my/my/mycollection">{{
                  $t('my.tab[9]')
                }}</el-menu-item>
                <el-menu-item index="/my/my/myaddress">{{
                  $t('my.tab[10]')
                }}</el-menu-item>
                <el-menu-item index="/my/my/myinfor">{{
                  $t('my.tab[11]')
                }}</el-menu-item>
                <el-menu-item index="/my/my/security">{{
                  $t('my.tab[12]')
                }}</el-menu-item>
              </el-menu-item-group>
            </el-menu>
          </el-col>
          <!-- 右侧 -->
          <el-col id="myLoad" class="myLoad">
            <nuxt-child keep-alive @pageTitle="selectMenu" />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'homeLayout',
  async asyncData({ app, query }) {
    let pc_user = app.$cookies.get('pc_user')
    console.log('query', query)
    let action = query.action
    let module = query.module

    // }
    return {
      pc_user,
      action,
      module
    }
  },

  data() {
    return {
      loading1: false,
      defaultActive: '', //当前激活菜单的 index
      parameter: '',
      pluginStatus: {}
    }
  },
  mounted() {
    // $('#myLoad').load('/my/my.vue', () => {
    //   var pageTitle = $('[name="pageTitle"]').val()
    //   console.log('pageTitle', pageTitle)

    //   this.getDefaultIndex(pageTitle)
    // })
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
  },
  methods: {
    selectMenu(row) {
      this.getDefaultIndex(row)
    },
    getDefaultIndex(pageTitle) {
      switch (pageTitle) {
        case '我的订单':
          this.defaultActive = '/my/my/myOrder'
          break
        case '我的拼团':
          this.defaultActive = 'group/groupOrder'
          break
        case '我的砍价':
          break
        case '我的竞拍':
          break
        case '我的抽奖':
          break
        case '分销中心':
          break
        case '邀请好友':
          break
        case '售后管理':
          this.defaultActive = '/my/my/management'
          break
        case '优惠券':
          this.defaultActive = '/my/my/mycoupon'
          break
        case '我的钱包':
          this.defaultActive = '/my/my/myWallet'
          break
        case '会员中心':
          this.defaultActive = '/my/my/memberCenter'
          break
        case '我的积分':
          this.defaultActive = '/my/my/myintegral'
          break
        case '银行卡':
          this.defaultActive = '/my/my/myBankCard'
          break
        case '我的消息':
          this.defaultActive = '/my/my/message'
          break
        case '我的收藏':
          this.defaultActive = '/my/my/mycollection'
          break
        case '收货地址':
          this.defaultActive = '/my/my/myaddress'
          break
        case '个人资料':
          this.defaultActive = '/my/my/myinfor'
          break
        case '发票管理':
          this.defaultActive = '/my/my/invoiceManagement'
          break
        case '账号安全':
          this.defaultActive = '/my/my/security'
          break
      }
    }
  }
}
</script>
<style>
/* 所有my子页面所需的公共样式 */
.logo-img {
  margin: 18px 0px 0px !important;
  padding-bottom: 18px !important;
}
.noOrder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 600px;
}
.noOrder p {
  font-size: 16px;
  line-height: 16px;
  color: #888888;
  margin-top: 20px;
}
.el-table .cell {
  text-align: center;
  font-size: 14px;
}
.my-title {
  padding: 17px 0;
  border-bottom: 1px solid #e6e6e6;
}
.my-title p {
  color: #020202;
  font-size: 16px;
  font-weight: bold;
  margin-left: 16px;
}
.red {
  color: #d4282d !important;
}
</style>
<style scoped>
@import '~/assets/css/my/my.css';
</style>
