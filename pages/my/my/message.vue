<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的消息" />
    <div class="my-title">
      <p>{{ $t('message.title2') }}</p>
    </div>

    <div v-if="!loadFlag">
      <div class="list" v-for="(item, index) of list" :key="index">
        <!-- <img class="list-img" src="~/static/images/login_home.png" alt=""> -->

        <div class="list-content">
          <div class="list-content_top">
            <p> <p class="unread"><p class="dian" v-if="item.type !=2" >·</p><p class='wei-du' v-if="item.type !=2">【{{$t('message.wd')}}】</p>【{{ $t('message.system') }}】{{ item.title }}</p>
            <i class="el-icon-delete" @click="delMessage(item.id)"></i>
          </div>
          <div class="list-content_center">
            {{ item.content }}
          </div>
          <div class="list-content_bottom">
            <el-link
              type="success"
              @click="toUrl('/my/my/messageDetail', item.id)"
              >{{ $t('message.look_info') }}></el-link
            >

            <span>{{ item.time }}</span>
          </div>
        </div>
      </div>
      <div v-if="list.length == 0" class="noOrder">
        <img :src="noOrder" alt="" />
        <p>{{ $t('message.Tips[0]') }}~</p>
      </div>

      <div class="paginationBox">
        <el-pagination
          v-if="total > 0"
          :current-page.sync="page"
          @current-change="currentChange"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <div v-else>
      <div class="list">
        <div class="list-content">
          <div class="list-content_top">
            <p class="nonavtitle" style="width: 300px"></p>
          </div>
          <div class="list-content_center nonavtitle" style="width: 80%"></div>
          <div class="list-content_bottom">
            <el-link type="success">{{ $t('message.look_info') }}></el-link>

            <span class="nonavtitle" style="width: 140px"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pc_user: {},
      page: 1,
      total: '',
      list: [],
      noOrder: require('/static/images/nomeaasge.png'),

      loadFlag: true
    }
  },
  mounted () {
    this.$emit('pageTitle', '我的消息')
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    delMessage (id) {
      var data = {
        // module: 'app_pc',
        // action: 'message',
        // m: 'del',
        api:"mall.Message.del",

        id
      }
      this.$confirm(
        this.$t('invoiceManagement.qrysccxxm'),
        this.$t('invoiceManagement.ts'),
        {
          confirmButtonText: this.$t('invoiceManagement.qd'),
          cancelButtonText: this.$t('invoiceManagement.qx'),
          type: 'warning'
        }
      ).then(() => {

      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(this.$t('message.Tips[1]'))
          this.page = 1
          this.getApi()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
      })
    },
    currentChange (page) {
      this.page = page
      this.getApi()
    },
    getApi () {
      let user = this.$cookies.get('pc_user')

      // if(!user || Object.keys(user).length > 0 ){
      //   return;
      // }
      var data = {
        api:"mall.Message.index",
        page: this.page
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false
          this.total = Number(res.data.total)
          this.list = res.data.message
          this.list.forEach(v=>{
            if(v.time){
              const date = new Date(v.time);
              // 获取所需的日期和时间部分
              const year = date.getUTCFullYear();
              const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 月份从0开始
              const day = String(date.getUTCDate()).padStart(2, '0');
              const hours = String(date.getUTCHours() + 4).padStart(2, '0'); // 增加4小时
              const minutes = String(date.getUTCMinutes()).padStart(2, '0');
              const seconds = String(date.getUTCSeconds()).padStart(2, '0');

              // 格式化为目标字符串
              const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

              this.$set(v,'time',formattedDate)
            }
          })
          // 更新组件数据
          this.$root.$emit('shoppingCart')
        })
        .catch(error => {
          this.loadFlag = false
          this.$message.error(error.message)
        })
    },
    toUrl (url, id) {
      this.$router.push({
        path: url,
        query: { id: id }
      })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/message.css';
.dian{
	color: red !important;
    font-size: 66px !important;
}
.wei-du{
  color: red !important;
  line-height: 24px !important
}
.el-icon-delete{
	margin-left: auto;
}
</style>
