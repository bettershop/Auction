<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="会员中心" />
    <div class="vip_bjtimg">
      <div class="my-vip">
        <p class="vip_center">{{ $t('memberCenter.hyzx') }}</p>
      </div>

      <div class="my_infor">
        <div>
          <div style="display: flex">
            <div class="pay_tx">
              <img class="my_img" :src="userInfo.headimgurl" />
            </div>
            <div class="my_kep">
              <div style="display: flex">
                <div class="my_name">{{ userInfo.user_name }}</div>
                <div v-if="pluginStatus.isVip == false">
                  <img class="pay_three" src="~/static/home-img/huise.png" />
                </div>
                <div v-if="pluginStatus.isVip == true">
                  <img class="pay_three" src="~/static/home-img/huiyuan.png" />
                </div>
              </div>
              <div class="my_kt">
                <div v-if="pluginStatus.isVip == true">
                  {{ $t('memberCenter.dqsj') }}：{{ userInfo.grade_end }}
                </div>
                <div v-if="pluginStatus.isVip == false">
                  {{ $t('memberCenter.ktvip') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <el-button class="kt_vip" @click="ktVip()">
            <span v-if="pluginStatus.isVip == false">{{
              $t('memberCenter.kthy')
            }}</span>
            <span v-if="pluginStatus.isVip == true">{{
              $t('memberCenter.xfhy')
            }}</span>
          </el-button>
        </div>
      </div>
    </div>
    <div class="pay_vip">
      <div>{{ $t('memberCenter.hyqy') }}</div>
      <div class="pay_kiv">
        <div class="pay_app" v-for="(item, index) in memberEquity">
          <div class="zk_pay">
            <div>
              <div class="pay_equityName">{{ item.equityName }}</div>
              <div class="pay_englishName">{{ item.englishName }}</div>
            </div>
            <div>
              <img class="pay_icon" :src="item.icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="headings">{{ $t('memberCenter.gmjl') }}</div>

    <div class="tableBox" v-if="!loadFlag">
      <el-table header-cell-class-name="thead" :data="tableData" style="width: 100%" height="444" row-key="id" lazy>
        <template slot="empty">
          <div class="empty">
            <img :src="noOrder" alt="" />
            <p style="color: #414658">{{$t('zdata.zwsj') }}</p>
          </div>
        </template>
        <el-table-column prop="trade_no" :label="$t('memberCenter.ddbh')" width="200px">
        </el-table-column>
        <el-table-column prop="memberTypeDesc" :label="$t('memberCenter.ktfs')">
        </el-table-column>
        <el-table-column prop="payTypeDesc" :label="$t('memberCenter.zffs')">
        </el-table-column>
        <el-table-column prop="amount" :label="$t('memberCenter.zfje')">
          <template slot-scope="scope"> {{$LaiKeCommObject.show_symbol}}{{ scope.row.amount }} </template>
        </el-table-column>
        <el-table-column prop="add_date" :label="$t('memberCenter.dqsj')">
          <template slot-scope="scope">
            {{ scope.row.endTime.slice(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column prop="addtime" :label="$t('memberCenter.zfsj')" width="200px">
        </el-table-column>
      </el-table>
    </div>
    <!-- 实际上后端没有返回total -->
    <div class="paginationBox">
      <el-pagination v-if="total > 0" @current-change="changePage" background layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pluginStatus: {},
      memberEquity: [],
      userInfo: [],
      loadFlag: true,
      tableData: [],
      page: 0,
      total: '',
      user_money: '',
      pages_status: 0,
      unit: '',
      noOrder: require('/static/images/no_order.png'),
    }
  },
  beforeDestroy() {
    this.$root.$off("newDataVip");
  },
  mounted() {
    this.$emit('pageTitle', '会员中心')
    this.pc_user = this.$cookies.get('pc_user')
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    if (this.pluginStatus.memberPlugin == false) {
      this.$router.push({ path: '/my/my/myLoad' })
    }
    this.getApi()
    this.$root.$on("newDataVip", () => {
      console.log('15151555155515551555', this.$cookies.get('pluginStatus'));
      this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    });
  },
  methods: {
    ktVip() {
      this.$root.$emit('vip')
    },
    changePage(page) {
      this.page = page - 1
      this.getApi()
    },
    getApi() {
      var data = {
        // api: 'app_pc.member.memberCenter',
        api: 'plugin.member.MallMember.memberCenter',

        page: this.page + 1
      }

      this.$Api.doRequest(data)
        .then(res => {
          console.log('res', res);

          this.loadFlag = false
          this.userInfo = res.data.userInfo
          this.memberEquity = res.data.memberEquity
          this.tableData = res.data.buyRecord
          var data = res.data
          this.unit = data.unit
          this.total = data.total
          this.user_money = data.user_money
          this.tableData1 = data.list
          this.pages_status = data.status
        })
        .catch(error => {
          this.loadFlag = false
          this.$message.error(error.message)
        })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/memberCenter.css';
</style>
