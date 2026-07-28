<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的订单" />
    <div class="evaluation_title">{{ $t('evaluation.title') }}</div>

    <div class="evaluation_content">
      <div>
        <ul class="evaluation_content_top">
          <li>{{ $t('evaluation.shop_info') }}</li>
          <li>{{ $t('evaluation.title') }}</li>
        </ul>

        <el-collapse accordion @change="collapseclick($event)"  v-model="activeCollapse">

          <el-collapse-item
            v-for="(items, indexs) of comment_list"
            :key="indexs"
            :name="indexs"
          >
            <template slot="title"  >
              <div class="pro_infor" >
                <img :src="items.commodityIcon" />
                <div>
                  <p>{{ items.product_title }}</p>
                  <span>{{ items.size }}</span>
                </div>
              </div>

              <div
                class="pro_evaluation"
                v-if="type == 5 && items.comments_type == 1"
              >
                {{ $t('evaluation.state[0]') }}
              </div>

              <div
                class="pro_evaluation"
                v-if="type == 5 && items.comments_type == 2"
              >
                {{ $t('evaluation.state[1]') }}
              </div>

              <div
                class="pro_evaluation"
                v-if="type == 5 && items.comments_type == 3"
              >
                {{ $t('evaluation.state[2]') }}
              </div>
            </template>
            <div
              v-if="type == 5 && items.comments_type == 1"
              class="pro_evaluation_content"
              style="padding-top: 25px"
            >
              <div
                class="pro_evaluation_content_left"
                style="line-height: 20px"
              >
                <span class="red">*</span>{{ $t('evaluation.Product_rating') }}
              </div>
              <el-rate
                v-model="score[indexs]"
                void-color="#B8B8B8"
                :colors="['#D4282D', '#D4282D', '#D4282D']"
              ></el-rate>
            </div>

            <div class="pro_evaluation_content" v-if="items.comments_type != 1">
                <div
                  class="pro_evaluation_content_left"
                  style="line-height: 20px"
                >{{ $t('evaluation.Product_rating') }}
                </div>
                <el-rate
                  v-model="evaluatelist[0].CommentType"
                  disabled
                  void-color="#B8B8B8"
                  :colors="['#D4282D', '#D4282D', '#D4282D']"
                ></el-rate>

            </div>
            <!-- 已评价-商品首次评价 -->
            <div class="pro_evaluation_content" style="padding-bottom: 20px;" v-if="items.comments_type == 3">

              <div class="pro_evaluation_content_left">
                {{ $t('evaluation.Commodity_evaluation') }}
              </div>
              <div class="pro_evaluation_content_left_box" v-if="evaluatelist.length>0">
                <div class="pro_evaluation_content_left_box_txt">{{evaluatelist[0].content}}</div>
                <!-- <img v-for=""/> -->
                  <div
                    class="upImageBox"

                  >
                   <!-- <img v-for="(item, index) of evaluatelist[0].images"
                    :key="index" :src="item.url" alt="" /> -->
                    <template v-for="(item, index) of evaluatelist[0].images">
                      <el-image
                        :key="index"
                        :src="item.url"
                        :preview-src-list="[item.url]"
                      >
                      </el-image>
                    </template>
                  </div>
              </div>
            </div>
            <!-- 已评价-商品首次评价 -->
            <div class="pro_evaluation_content" style="padding-bottom: 20px;" v-if="items.comments_type == 2">

              <div class="pro_evaluation_content_left">
                {{ $t('evaluation.Commodity_evaluation') }}
              </div>
              <div class="pro_evaluation_content_left_box" v-if="evaluatelist.length>0">
                <div class="pro_evaluation_content_left_box_txt">{{evaluatelist[0].content}}</div>
                <!-- <img v-for=""/> -->
                  <div
                    class="upImageBox"

                  >
                 <!--  <img  v-for="(item, index) of evaluatelist[0].images"
                    :key="index" :src="item.url" alt="" /> -->
                    <template v-for="(item, index) of evaluatelist[0].images">
                     <el-image
                        :key="index"
                        :src="item.url"
                        :preview-src-list="[item.url]"
                      >
                      </el-image>
                    </template>
                  </div>
              </div>
            </div>
            <!-- 追加评论展示 -->
            <div class="pro_evaluation_content" style="padding-bottom: 20px;" v-if="items.comments_type == 3">

              <div class="pro_evaluation_content_left" style="width: 86px;">
                {{ $t('evaluation.state[1]') }}
              </div>
              <div class="pro_evaluation_content_left_box" v-if="evaluatelist.length>0">
                <div class="pro_evaluation_content_left_box_txt" style="width: 750px;">{{evaluatelist[0].review}}</div>
                <!-- <img v-for=""/> -->
                  <div
                    class="upImageBox"

                  >
                    <!-- <img v-for="(item, index) of evaluatelist[0].review_images"
                    :key="index" :src="item.url" alt="" /> -->
                    <template v-for="(item, index) of evaluatelist[0].review_images">
                      <el-image
                        :key="index"
                        :src="item"
                        :preview-src-list="[item]"
                      >
                      </el-image>
                    </template>
                  </div>
              </div>
            </div>
            <!-- 已评价-追加评价 -->
            <div class="pro_evaluation_content" v-if="items.comments_type == 2">

              <div class="pro_evaluation_content_left">
                <span class="red">*</span
                >{{ $t('evaluation.state[1]') }}
              </div>
              <el-input
                type="textarea"
                :rows="2"
                :placeholder="$t('evaluation.placeholder')"
                v-model="score_textarea[indexs]"
              >
              </el-input>
            </div>
            <div class="pro_evaluation_content" v-if="items.comments_type == 1">

              <div class="pro_evaluation_content_left">
                <span class="red">*</span
                >{{ $t('evaluation.Commodity_evaluation') }}
              </div>
              <el-input
                type="textarea"
                :rows="2"
                :placeholder="$t('evaluation.placeholder')"
                v-model="score_textarea[indexs]"
              >
              </el-input>
            </div>

            <div class="pro_evaluation_content" v-if="items.comments_type != 3">
              <div class="pro_evaluation_content_left">
                <span class="red" style="opacity: 0">*</span>
                {{ $t('evaluation.logn[0]') }}{{ $t('evaluation.logn[1]') }}
              </div>
              <div>
                <div style="display: flex; align-items: center">
                  <div
                    class="upImage"
                    style="cursor: default"
                    @click="upfileM(indexs)"
                  >
                    <img src="~/static/images/uploadImg.png" alt="" />
                    {{ $t('evaluation.logn[2]') }}

                    <template v-for="(item, index) in files[indexs]">
                      <input
                        @click.stop
                        v-if="index < 6"
                        :style="
                          index < files[indexs] - 1 ? 'display: none' : ''
                        "
                        :key="index"
                        @change="uploadImage"
                        type="file"
                        accept="image/*"
                        name="uploader-input"
                        class="uploader-file"
                      />
                    </template>
                  </div>
                  {{ $t('evaluation.logn[3]') }}
                </div>
                <div style="display: flex; margin-top: 14px">
                  <div
                    class="upImageBox"
                    v-for="(item, index) of imageArr[indexs]"
                    :key="index"
                    @click="deletImage(indexs, index)"
                  >
                    <img :src="item" alt="" />
                    <a href="javascript:;">{{ $t('common_button[0]') }}</a>
                  </div>
                  <!-- <template v-for="(item, index) of imageArr[indexs]">
                   <el-image
                      :key="index"
                      :src="item.url"
                      :preview-src-list="[item.url]"
                    >
                    </el-image>
                  </template> -->
                </div>
              </div>
            </div>

            <div class="pro_evaluation_btn" v-if="items.comments_type != 3">
              <el-checkbox v-if="items.comments_type == 1" v-model="is_anonymoust[indexs]">{{
                $t('evaluation.logn[4]')
              }}</el-checkbox>
              <span v-else></span>
              <el-button size="small" type="danger" @click="saveOk(indexs)">{{
                $t('evaluation.logn[5]')
              }}</el-button>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <div class="mask" v-if="successFlag">
      <div class="maskSuccess">
        <i class="el-icon-close" @click="successFlag = false"></i>

        <img src="~/static/images/success_h.png" />

        <p>{{ $t('evaluation.logn[6]') }}</p>

        <span
          >{{ $t('evaluation.logn[7]') }}{{ successTime }}S{{
            $t('evaluation.logn[8]')
          }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ app, query }) {
    let pc_user = app.$cookies.get('pc_user')
    console.log('query', query)
    return {
      pc_user,
      type: query.type,
      sNo: query.sNo
    }
  },
  data () {
    return {
      sNo: '',
      evaluatelist:[{CommentType:0}],
      type: '',
      activeCollapse: '',

      imageArr: [],

      score: [], //商品评分

      score_textarea: [], //商品评价

      files: [],

      is_anonymoust: [],

      successFlag: false,
      successTime: 3,
      successInterval: '',
      value_rate: 0,
      comment_list: [],
      colors: ['#D4282D', '#D4282D', '#D4282D']
    }
  },
  mounted () {
    this.$emit('pageTitle', '我的订单')
    // 获取链接参数
    // var arr = location.search.replace('?', '').split('&')
    // var option = {}
    // arr.filter(item => {
    //   option[item.split('=')[0]] = item.split('=')[1]
    // })

    // this.sNo = option.sNo
    // this.type = option.type == '0' ? '' : option.type

    this.getApi()
  },
  watch: {
    successFlag (val) {
      if (!val) {
        clearInterval(this.successInterval)

        if (this.comment_list.length > 1) {
          this.getApi()
        } else {
          this.$router.push({ path: '/my/my/myOrder' })
        }
      }
    }
  },
  methods: {
    collapseclick(e){
      if(e.toString()==""){
        return
      }
      let data = {
        api:'mall.Order.getCommentsInfo',

        orderDetailId:this.comment_list[e].id,
        goodsId:this.comment_list[e].goodsId,
        accessId: this.pc_user.access_id,
      }
      this.$Api.doRequest(data)
        .then(res => {
            if(res.code==200 && res.data && res.data.list){
              this.evaluatelist = res.data.list
            }
        })
        .catch(error => {
          console.log(error)
          this.$message.error(error.message)
        })
    },
    getApi () {
      let data = {
        api:'mall.Product.comment',

        sNo: this.sNo, // 订单号
        type: this.type // 类型(品，评论传空，追评传5)
      }

      this.imageArr = []
      this.score = []
      this.score_textarea = []
      this.files = []
      this.is_anonymoust = []

      this.$Api.doRequest(data)
        .then(res => {
          res.data.commentList &&
            res.data.commentList.filter(item => {
              this.imageArr.push([])
              this.score.push(undefined)
              this.score_textarea.push('')
              this.files.push(1)
              this.is_anonymoust.push(false)
            })

          this.comment_list = res.data.commentList
        })
        .catch(error => {
          console.log(error)
          this.$message.error(error.message)
        })
    },
    openSuccess () {
      this.successFlag = true

      this.successTime = 3

      clearInterval(this.successInterval)

      this.successInterval = setInterval(() => {
        this.successTime--

        if (this.successTime <= 0) {
          clearInterval(this.successInterval)
          this.successFlag = false

          if (this.comment_list.length > 1) {
            this.getApi()
          } else {
            this.$router.push({ path: '/my/my/myOrder' })
          }
        }
      }, 1000)

    },
    saveOk (indexs) {
      if (this.score[indexs] == 0) {
        this.$message.error(this.$t('evaluation.Tips[0]'))
        return
      }

      if (!this.score_textarea[indexs]) {
        this.$message.error(this.$t('evaluation.Tips[1]'))
        return
      }

      let data

      let items = this.comment_list[indexs]
      if (items.comments_type == 1) {
        data = {
          api:'mall.Product.addComment',

          anonymous: this.is_anonymoust[indexs] ? 1 : 0,
          orderDetailsId: this.comment_list[indexs].id,
          start: this.score[indexs],
          comment: this.score_textarea[indexs], // 内容
          goodsId: this.comment_list[indexs].commodityId, // 产品id
          attributeId: this.comment_list[indexs].sid, // 属性id
          imgUrls: this.imageArr[indexs].join(','), // 评论图片(有图片就传图片路径，用逗号隔开)
          isReview: false //是否追评
        }
      } else if (items.comments_type == 2) {
        data = {
          api:'mall.Product.addComment',

          anonymous: this.is_anonymoust[indexs] ? 1 : 0,
          orderDetailsId: this.comment_list[indexs].id,
          start: this.score[indexs],
          comment: this.score_textarea[indexs], // 内容
          goodsId: this.comment_list[indexs].commodityId, // 产品id
          attributeId: this.comment_list[indexs].sid, // 属性id
          imgUrls: this.imageArr[indexs].join(','), // 评论图片(有图片就传图片路径，用逗号隔开)
          isReview: true //是否追评
        }
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.collapseclick(indexs)
          this.openSuccess()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },

    toAfter (type) {
      this.$router.push({ path: '/my/my/afterDetails', query: { type: type } })
    },

    deletImage (indexs, index) {
      this.imageArr[indexs].splice(index, 1)

      $('.el-collapse-item').eq(indexs).find('.uploader-file').eq(index).val('')
      $('.el-collapse-item')
        .eq(indexs)
        .find('.upImage')
        .append(
          $('.el-collapse-item').eq(indexs).find('.uploader-file').eq(index)
        )

      this.files[indexs]--
    },

    upfileM (indexs) {
      if (this.files[indexs] > 6) {
        this.$message.error(this.$t('evaluation.Tips[2]'))
      }
    },

    uploadImage (e) {
      var indexs = $(e.target).parents('.el-collapse-item').index()

      this.files[indexs] = this.files[indexs] + 1
      var fil = e.target.files

      var data = new FormData()
      data.append('file', fil[0])
      data.append('access_id', this.pc_user.access_id)
      this.$upImg(data)
        .then(res => {
          this.imageArr[indexs].push(res.data.url)
        })
        .catch(error => [this.$message.error(error.message)])
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/evaluationing.css';
</style>
