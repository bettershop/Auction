<template>
  <div id="app">
    <input type="hidden" name="pageTitle" :value="$t('addInvoice.fpgl')" />
    <!-- 我的订单tabs -->
    <div class="tab_app">
      <div>
        <div>
          {{ $t('headerManagement.fpttg') }}
        </div>
      </div>
      <div style="padding-right: 20px">
        <el-button
          v-if="tableList.length > 0"
          class="tt_an"
          @click="toUrl('/my/my/addInvoice')"
          >{{ $t('headerManagement.tjfpt') }}</el-button
        >
      </div>
    </div>
    <div v-if="tableList.length > 0">
      <template>
        <div class="list" v-for="(item, index) of tableList" :key="index">
          <div class="div_one">
            <div>
              <div class="div_two">
                <div class="div_three" v-if="item.is_default == 1">
                  <div>{{ $t('headerManagement.mr') }}</div>
                </div>
                <div class="div_mchname">{{ item.company_name }}</div>
              </div>
              <div style="display: flex">
                <div class="div_sno">{{ item.company_tax_number }}</div>
              </div>
            </div>
            <div class="an_div">
              <el-button
                class="fp_an"
                @click="goUrl('/my/my/addInvoice', item.id)"
                >{{ $t('headerManagement.bj') }}</el-button
              >
              <el-button class="fp_an1" @click="cut(item)">{{
                $t('headerManagement.sc')
              }}</el-button>
            </div>
          </div>
        </div>

        <div v-if="tableList.length < 0" class="noOrder">
          <img :src="noOrder" alt="" />
          <p>{{ $t('headerManagement.nihmy') }}~</p>
        </div>
      </template>
    </div>
    <div v-if="tableList.length < 0">
      <div class="no_one">
        <div class="no_tt">{{ $t('headerManagement.nmytj') }}</div>
        <div>
          <el-button class="tt_an" @click="toUrl('/my/my/addInvoice')">{{
            $t('headerManagement.tjfpt')
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tabIndex: 0,
      tableList: [],
      loadFlag: true,
      order_list: [],
      pc_user: {}
    }
  },
  mounted () {
    this.$emit('pageTitle', this.$t('addInvoice.fpgl'))
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    getApi () {
      let data = {
        // api: 'app_pc.invoiceHeader.doRequest',
        api:"mall.InvoiceHeader.doRequest",
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data).then(res => {
        this.loadFlag = false
        this.tableList = res.data.list
      })
    },
    //删除抬头信息
    cut (row) {
      this.$confirm(
        this.$t('headerManagement.qdsc'),
        this.$t('headerManagement.ts'),
        {
          confirmButtonText: this.$t('headerManagement.qd'),
          cancelButtonText: this.$t('headerManagement.qx'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$Api
            .getList({
              // api: 'app_pc.invoiceHeader.del',
              api:"mall.InvoiceHeader.del",

              ids: row.id
            })
            .then(res => {
              if (res.code == 200) {
                this.getApi()
                this.$message({
                  type: 'success',
                  message: this.$t('headerManagement.sccg'),
                  // offset: 100
                })
              }
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除',
          //   offset: 100
          // })
        })
    },
    toUrl (url) {
      this.$router.push({
        path: url
      })
    },
    goUrl (url, id) {
      this.$router.push({ path: url, query: { id: id } })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/headerManagement.css';
</style>
