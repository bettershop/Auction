<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的收藏" />

    <div class="my-title">
      <p>{{ $t('similar.title') }}</p>
    </div>

    <div v-if="!loadFlag" class="similar-top">
      <img
        class="pointer"
        :src="product.imgurl"
        @click="toDetail(product.id)"
        alt=""
      />

      <div>
        <div class="similar-top-top pointer" @click="toDetail(product.id)">
          {{ product.product_title }}
        </div>
        <div class="similar-top-mchName">
          {{ $t('similar.shop') }}{{ product.mch_name }}
        </div>
        <div class="similar-top-price">
          {{$LaiKeCommObject.show_symbol}}{{ product.price }}
          <span>{{$LaiKeCommObject.show_symbol}}{{ product.yprice }}</span>
        </div>
        <el-button type="danger" plain disabled>
          <i class="el-icon-star-on"></i>
          {{ $t('similar.Already_collected') }}
        </el-button>
      </div>
    </div>

    <div v-else class="similar-top">
      <img class="nonavtitle" src="" alt="" />

      <div>
        <div class="similar-top-top nonavtitle" style="width: 470px"></div>
        <div
          class="similar-top-mchName nonavtitle"
          style="width: 126px; display: block"
        ></div>
        <div class="similar-top-price nonavtitle" style="width: 82px"></div>
        <el-button type="danger" plain disabled>
          <i class="el-icon-star-on"></i>
          {{ $t('similar.Already_collected') }}
        </el-button>
      </div>
    </div>

    <div class="similar-content">
      <div class="similar-content-title">{{ $t('similar.Similar_goods') }}</div>

      <ul class="similar-content-list" v-if="!loadFlag">
        <li
          v-for="(item, index) of list"
          :key="index"
          @click="toDetail(item.id)"
        >
          <img :src="item.imgurl" alt="" />
          <p>{{ item.product_title }}</p>
          <span>{{$LaiKeCommObject.show_symbol}}{{ item.price }}</span>
        </li>
      </ul>

      <ul class="similar-content-list" v-else>
        <li style="background-color: #ffffff">
          <img class="nonavtitle" src="" alt="" />
          <p>
            <span class="nonavtitle" style="width: 80%; margin: 0"></span>
          </p>
          <span
            class="nonavtitle"
            style="
              display: block;
              width: 70px;
              margin-left: auto;
              margin-right: auto;
            "
          ></span>
        </li>
      </ul>

      <div class="paginationBox">
        <el-pagination
          v-if="total > 0"
          @current-change="currentChange"
          :page-size="8"
          :pager-count="5"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loadFlag: true,
      pc_user: {},
      pro_id: '',

      product: {},
      list: [],
      page: 1,
      total: ''
    }
  },
  mounted () {
    this.$emit('pageTitle', '我的收藏')
    if (this.$route.query.pro_id) {
      this.pro_id = this.$route.query.pro_id
    }
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    currentChange (page) {
      this.page = page
      this.getApi()
    },
    getApi () {
      var data = {
        // module: 'app_pc',
        // action: 'addFavorites',
        // m: 'similar',
        api: 'mall.AddFavorites.similar',

        pro_id: this.pro_id, // 商品id
        page: this.page
      }

      this.$Api.doRequest(data)
        .then(res => {
          if(res.code == '200'){
            this.total = res.data.total
            if(res.data.product.length > 0){
              this.product = res.data.product?.[0]
            }
            this.list = res.data.list
            this.loadFlag = false
          }
        })
        .catch(error => {
          this.loadFlag = false
          this.$message.error(error.message)
        })
    },
    toDetail (id) {
      this.$router.push({ path: '/homedetail/homedetail', query: { id: id } })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/similar.css';
</style>
