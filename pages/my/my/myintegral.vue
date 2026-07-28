<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的积分" />
    <div class="my-title">
      <p>{{ $t('myintegral.title') }}</p>
    </div>

    <div class="my-Wallet">
      <!-- <p v-if="!loadFlag" style="padding-top: 80px;">{{score}}</p>
		<span>{{$t('myintegral.points')}}</span> -->
      <!-- <p v-else style="padding-top: 80px;">
			<span class="nonavtitle" style="width: 120px;"></span>
		</p> -->
      <div v-if="!loadFlag" class="box1">
        <p class="font1">{{ score }}</p>
        <span class="font2">{{ $t('myintegral.points') }}</span>
      </div>
      <div v-if="!loadFlag" class="box1">
        <p class="font1">{{ lock_score?lock_score:0 }}</p>
        <span class="font2">{{ $t('myintegral.dqdjjf') }}</span>
      </div>
      <p v-if="loadFlag" style="padding-top: 80px">
        <span class="nonavtitle" style="width: 120px"></span>
      </p>
      <img :src="myjfbg" alt="" />
    </div>

    <ul class="tabBox">
      <li :class="{ active: tabIndex == 1 }" @click="tabIndex = 1">
        {{ $t('myintegral.detailed[1]') }}
      </li>
      <li :class="{ active: tabIndex == 2 }" @click="tabIndex = 2">
        {{ $t('myintegral.detailed[2]') }}
      </li>
      <li :class="{ active: tabIndex == 3 }" @click="tabIndex = 3">
        {{ $t('myintegral.expired_details') }}
      </li>
      <li class="delBtn" @click="_del" v-if="tabIndex == 3 && tableData1 && tableData1.length > 0">{{ $t('myintegral.del') }}</li>
    </ul>

    <div class="tableBox" v-if="!loadFlag">
      <el-table header-cell-class-name="thead" :data="tableData1" v-loading="loading" style="width: 100%" height="444" row-key="id" key="tab1" lazy @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" v-if="tabIndex == 3">
        </el-table-column>
        <el-table-column prop="name" :label="$t(tabIndex == 1 ? 'myintegral.get_details' : tabIndex == 2 ? 'myintegral.use_details' : 'myintegral.expired_details' )" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0"> {{ $t('myintegral.nameType[0]')}}</span>
            <span v-if="scope.row.type == 1"> {{ $t('myintegral.nameType[1]')}}</span>
            <span v-if="scope.row.type==2">{{ $t('myintegral.nameType[2]') }}</span>
            <span v-if="scope.row.type==3">{{ $t('myintegral.nameType[3]') }}</span>
            <span v-if="scope.row.type==4">{{ $t('myintegral.nameType[4]') }}</span>
            <span v-if="scope.row.type==5">{{ $t('myintegral.nameType[5]') }}</span>
            <span v-if="scope.row.type==6">{{ $t('myintegral.nameType[6]') }}</span>
            <span v-if="scope.row.type==7">{{ $t('myintegral.nameType[7]') }}</span>
            <span v-if="scope.row.type==8">{{ $t('myintegral.nameType[8]') }}</span>
            <span v-if="scope.row.type==9">{{ $t('myintegral.nameType[9]') }}</span>
            <span v-if="scope.row.type==10">{{ $t('myintegral.nameType[10]') }}</span>
            <span v-if="scope.row.type==11">{{ $t('myintegral.nameType[11]') }}</span>
            <span v-if="scope.row.type==12">{{ $t('myintegral.nameType[12]') }}</span>
            <span v-if="scope.row.type==13">{{ $t('myintegral.nameType[13]') }}</span>
            <span v-if="scope.row.type==14">{{ $t('myintegral.nameType[14]') }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sign_score" :label="$t(tabIndex == 1?'myintegral.get_jf' : tabIndex == 2 ? 'myintegral.use_jf' : 'myintegral.expired_jf' )">
          <template slot-scope="scope">
            <div :style="{
                color: scope.row.sign_score < 0 ? '#999999' : '',
                fontWeight: 'bold'
              }">
              {{ scope.row.sign_score }}
            </div>
          </template>
        </el-table-column>
        <el-table-column class-name="timeBox" prop="sign_time" :label="$t('myintegral.detailed[5]')" width="170">
        </el-table-column>
      </el-table>
    </div>

    <div v-else class="tableBox">
      <el-table header-cell-class-name="thead" :data="tableData11" style="width: 100%" height="444" row-key="id" key="tab2" lazy>
        <el-table-column prop="instructions" :label="$t('myintegral.detailed[3]')" width="95">
          <template v-if="loadFlag" slot-scope="scope">
            <div class="nonavtitle" style="width: 120px"></div>
          </template>
        </el-table-column>
        <el-table-column prop="money" :label="$t('myintegral.detailed[4]')">
          <template v-if="loadFlag" slot-scope="scope">
            <div class="nonavtitle"></div>
          </template>
        </el-table-column>
        <el-table-column prop="time" :label="$t('myintegral.detailed[5]')" width="170">
          <template v-if="loadFlag" slot-scope="scope">
            <div class="nonavtitle" style="width: 160px"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paginationBox">
      <el-pagination v-if="total > 0" :current-page.sync="page1" @current-change="currentChange" :page-size="10" :pager-count="5" background layout="prev, pager, next" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadFlag: true,
      tabIndex: 1,
      page: 0,
      page1: 1,
      myjfbg: require('/static/images/myjfbg.png'),
      tableData1: [],
      tableData11: [{ instructions: '', money: '', time: '' }],
      total: '',
      score: '',
      lock_score: '',
      loading: true,
      delData: [],
    }
  },
  mounted() {
    this.$emit('pageTitle', '我的积分')
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    if (this.pluginStatus.integralPlugin == false) {
      this.$router.push({ path: '/my/my/myLoad' })
    }
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  watch: {
    tabIndex(val) {
      this.page = 0
      this.getApi()
    }
  },
  methods: {
    _del() {
      if (this.delData.length == 0) {
        return this.$message.error('请选择需要删除的信息！')
      }
      this.loading = true
      let ids = ''
      this.delData.forEach((item, index) => {
        ids += item.id + ','
      })
      let data = {
        api: "plugin.integral.MallIntegral.deleteSign",

        ids,
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.loading = false
          this.$message.success(res.message)
          this.getApi()
        })
        .catch(error => {
          this.loadFlag = false
          this.$message.error(error.message)
        })
    },
    handleSelectionChange(val) {
      this.delData = val
    },
    currentChange(page) {
      this.page = page - 1
      this.getApi()
    },
    getApi() {
      this.loading = true
      var data = {
        // module: 'app_pc',
        // action: 'sign',
        // m: 'integral',
        api: "plugin.integral.MallIntegral.integral",

        type: this.tabIndex, // 类型
        page: this.page + 1
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false

          var data = res.data

          data.list &&
            data.list.filter(item => {
              if (item.sign_score > 0) {
                item.sign_score = (item.status ? '+' : '-') + item.sign_score
              }
            })

          if (this.page == 0) {
            this.page1 = 1
          }
          console.log('res', res, data)

          this.total = data.total
          this.score = data.score
          this.lock_score = data.lock_score
          this.tableData1 = data.list
          this.loading = false
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
@import '~/assets/css/my/myintegral.css';
</style>
