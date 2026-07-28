<template>
  <div id="app">
    <div
      class="border"
      style="width: 100%; height: 1px; margin-bottom: 20px; background: #e6e6e6"
    ></div>

    <div class="Mch">
      <el-breadcrumb
        v-if="searchName && !loadFlag"
        separator-class="el-icon-arrow-right"
      >
        <el-breadcrumb-item>{{ $t('home.home_page') }}</el-breadcrumb-item>
        <el-breadcrumb-item>
          {{ $t('mchList.gjz') }}"{{ searchName }}"
          <span
            >{{ $t('mchList.gssddp') }}<span class="red">{{ Mch_Count }}</span
            >{{ $t('mchList.ge') }}</span
          >
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="MyShop" v-if="Mch_List.length > 0 && !loadFlag">
        <ul>
          <li v-for="(item, index) in Mch_List">
            <div class="MyShop_LiLeft">
              <img :src="item.head_img" alt="" @error="handleErrorImg"/>
              <div class="MyShop_LiLeft_Info">
                <div class="MyShop_Name">
                  <h2>{{ item.name }}</h2>
                  <p>
                    {{ $t('mchList.szd') }}{{ item.sheng }}{{ item.shi }}
                  </p>
                </div>
                <div class="MyShop_Info">
                  <span
                    >{{ item.collectionNum }}{{ $t('mchList.rsc') }}</span
                  >
                  <div>|</div>
                  <span>{{ item.pro_num }}{{ $t('mchList.jzssp') }}</span>
                </div>
              </div>
            </div>
            <div class="MyShop_LiRight">
              <button class="MyShop_Go" @click="goMch(item.id)">
                {{ $t('mchList.jdgg') }} >>
              </button>
              <div @click="Collection(index, item)">
                <button class="MyShop_Collection2" v-if="item.is_collect == 1">
                  <img
                    src="~/static/images/To_stars.png"
                    class="To_stars"
                    alt=""
                  />
                  {{ $t('mchList.ysc') }}
                </button>
                <button class="MyShop_Collection" v-else>
                  <img
                    src="~/static/images/Not_stars.png"
                    class="Not_stars"
                    alt=""
                  />
                  <img
                    src="~/static/images/hover_stars.png"
                    class="hover_stars"
                    alt=""
                  />
                  {{ $t('mchList.scdp') }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="Mch" v-if="loadFlag" style="display: block">
      <!-- <div class="nonavtitle"></div>> -->
      <el-breadcrumb v-if="searchName" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><div class="nonavtitle"></div></el-breadcrumb-item>
        <el-breadcrumb-item>
          <div class="nonavtitle"></div>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="MyShop">
        <ul>
          <li v-for="i in 7">
            <div class="MyShop_LiLeft">
              <div style="width: 80px; height: 80px" class="nonavtitle"></div>
              <div class="MyShop_LiLeft_Info">
                <div class="MyShop_Name">
                  <h2 class="nonavtitle"><span class="nonavtitle"></span></h2>
                  <p>
                    <span class="nonavtitle"></span
                    ><span class="nonavtitle"></span>
                  </p>
                </div>
                <div class="MyShop_Info">
                  <span><span class="nonavtitle"></span></span>
                  <div>|</div>
                  <span><span class="nonavtitle"></span></span>
                </div>
              </div>
            </div>
            <div class="nonavtitle">
              <div class="nonavtitle"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="my-main" v-if="Mch_List.length == 0 && !loadFlag">
      <ul v-if="!loadFlag">
        <li class="relative" v-for="(item, index) of Mch_List" :key="index">
          <div class="proDown" v-if="item.status == 3" style="top: 40px">
            {{ $t('homList.shelf') }}
          </div>
          <img :src="item.imgurl" alt="" />
          <div class="proMch">
            <img :src="item.logo" alt="" />
            {{ item.mch_name }}
          </div>
          <p>{{ item.product_title }}</p>
          <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
        </li>
        <li class="noPro" v-if="Mch_List.length == 0">
          <img src="~/static/images/noPro.png" alt="" />
          <p>{{ $t('homList.noPros[0]') }}</p>
          <p>{{ $t('homList.noPros[1]') }}</p>
        </li>
      </ul>
      <ul v-else>
        <li>
          <div class="nonavtitle" style="width: 286px; height: 286px"></div>
          <p class="nonavtitle" style="display: block"></p>
          <span
            class="nonavtitle"
            style="
              display: block;
              margin-left: auto;
              margin-right: auto;
              width: 100px;
            "
          ></span>
        </li>
      </ul>
    </div>
    <div
        v-if="Mch_Count > 0"
        class="paginationBox"
      >
        <el-pagination
          :page-size="10"
          :current-page.sync="page"
          @current-change="currentChange"
          background
          layout="prev, pager, next"
          :total="Mch_Count"
        >
        </el-pagination>
      </div>
  </div>
</template>

<script>
import ErrorImg from '@/static/images/default_picture.png'
export default {
  layout: 'homeLayout',
  async asyncData ({ app, query, $Api }) {
    let pc_user = app.$cookies.get('pc_user')
    let searchName = query.searchName

      var data = {
        api:'mall.Index.search',

        keyword: searchName, // 关键字
        page: 1, //  加载次数
        searchType: 2,
        pageSize: 10
      }
    let res = await $Api.doRequest(data)
    return {
      pc_user,
      Mch_Count: res.data.total,
      Mch_List: res.data.list,
      loadFlag: false,
    }
  },
  data () {
    return {
      loadFlag: true,
      searchName: '',
      page: 1, //  加载次数
      Mch_List: [],
      Mch_Count: 0
    }
  },
  mounted () {
    if (this.$route.query.searchName) {
      this.searchName = this.$route.query.searchName
    }
    this.getApi()
  },
  methods: {
    handleErrorImg (e) {
      e.target.src = ErrorImg
    },
    goMch (id) {
      this.$router.push({
        path: '/mch/mch',
        query: { id: id }
      })
    },
    toUrl (item) {
      this.$router.push({
        path: '/homedetail/homedetail',
        query: { id: item.id, ClassName: '3' }
      })
    },
    Collection (index, item) {
      let data = {
        api:'mch.mall.Mch.collectionShop',

        shopId: item.id // 店铺ID
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.$message.success(res.message)
          this.getApi()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    currentChange (e) {
      this.page = e
      this.getApi()
    },
    getApi () {
      var data = {
        api:'mall.Index.search',

        keyword: this.searchName, // 关键字
        page: this.page, //  加载次数
        searchType: 2,
        pageSize: 10
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false
          var arr = res.data.list
          this.Mch_List = arr
          this.Mch_Count = res.data.total
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/homeList/mchList.css';
</style>
