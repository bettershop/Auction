<template>
  <div id="app" ref="apps" style="margin: 0 auto; width: 1200px">
    <template v-if="!isOverdue">
      <div style="width: 1200px; margin: 20px auto">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" v-if="!ClassName">
            {{ $t('homedetail.title') }}</el-breadcrumb-item
          >
          <el-breadcrumb-item :to="{ path: '/' }" v-else
            >{{ ClassName }}
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-if="storeInfoList.product_title"
            :to="{ path: '/' }"
            onclick="history.go(-1)"
            >{{ storeInfoList.product_title }}</el-breadcrumb-item
          >
          <el-breadcrumb-item
            v-else
            class="nonavtitle"
            style="width: 100px"
          ></el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('homedetail.pj') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="d-main">
        <div class="d-main-left" v-if="storeInfoList.product_title">
          <template>
            <div class="commentBox">
              <div class="commentBox_left">
                <img :src="storeInfoList.headimgurl" alt="" />
                <div>{{ storeInfoList.user_name }}</div>
              </div>
              <div class="commentBox_right">
                <div class="comment_pj">
                  <img
                    v-for="(item, index) of CommentType"
                    :key="index"
                    src="~/static/images/pj.png"
                    alt=""
                  />
                </div>
                <div class="comment_context">
                  {{ storeInfoList.content }}
                </div>
                <div class="comment_image">
                  <template v-for="(item, index) of commentImgList">
                    <el-image
                      :key="index"
                      :src="item"
                      :preview-src-list="[item]"
                    >
                    </el-image>
                  </template>
                </div>
                <div class="comment_attr">
                  {{ storeInfoList.size }} {{ storeInfoList.addTime }}
                </div>
                <div class="comment_box" v-if="storeInfoList.replyAdmin">
                  <div class="comment_store">{{ $t('homedetail.sjhf') }}：</div>
                  <div class="comment_store">
                    {{ storeInfoList.replyAdmin }}
                  </div>
                </div>
                <div class="afterReview" v-if="storeInfoList.review">
                  <div class="review_item">
                    <p>
                      [{{ $t('homedetail.product[5]')
                      }}{{ storeInfoList.reviewDay
                      }}{{ $t('homedetail.product[6]') }}]
                    </p>
                    <div>{{ storeInfoList.review }}</div>
                    <div class="review_item_img">
                      <template
                        v-for="(item, index) of storeInfoList.review_images"
                      >
                        <el-image
                          v-if="item.url"
                          :key="index"
                          class="img"
                          :src="item.url"
                          :preview-src-list="[item.url]"
                        >
                        </el-image>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="huifu-input-box">
                  <el-input
                    type="textarea"
                    :rows="4"
                    :placeholder="
                      $t('homedetail.hf') + storeInfoList.user_name ?? ''
                    "
                    v-model="textarea"
                    resize="none"
                  >
                  </el-input>
                  <div class="bt_box">
                    <el-button
                      @click="submit(textarea, 1)"
                      type="danger"
                      class="bt_tj"
                      >{{ $t('homedetail.tj') }}</el-button
                    >
                  </div>
                </div>
                <div class="reply_box">
                  <div class="reply_box_head">
                    <span
                      >{{ replyList.length }}{{ $t('homedetail.thf') }}</span
                    >
                  </div>
                  <div v-for="(iten, index) in replyList" :key="index">
                    <div class="info">
                      <div class="name">
                        <div class="shaco_right">
                          <img :src="iten.headimgurl" width="30" height="30" />
                        </div>
                        <div>
                          <div style="line-height: 16px">
                            <span class="font1">{{ iten.replyName }}</span>
                          </div>
                          <div>
                            <span
                              class="font2"
                              @click="revert(iten, index)"
                              style="cursor: pointer"
                              >{{ iten.content }}</span
                            >
                            <div class="rever_box">
                              <div
                                v-for="(itec, indx) in iten.children"
                                :key="indx"
                                class="rever_info"
                              >
                                <div class="box2">
                                  <div class="box3">
                                    <div>
                                      <img
                                        :src="itec.headimgurl"
                                        width="30"
                                        height="30"
                                      />
                                    </div>
                                    <div>
                                      <span class="font2">{{
                                        itec.replyName
                                      }}</span>
                                    </div>
                                  </div>
                                  <div>
                                    <span class="font3">{{
                                      itec.dateTime
                                    }}</span>
                                  </div>
                                </div>
                                <!-- @click="revert(itec,index)" -->
                                <div class="sut">
                                  <span class="font2"
                                    >{{ $t('homedetail.hf') }}
                                  </span>
                                  <span class="font1"
                                    >@{{ iten.replyName }}：{{
                                      itec.content
                                    }}</span
                                  >
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="time">
                        <div class="first">
                          <span class="font3">{{ iten.addTime }}</span>
                        </div>
                        <div class="second">
                          <span class="font4" @click="revert(iten, index)">{{
                            $t('homedetail.hf')
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      class="huifu-input-box"
                      v-if="input_index == index"
                      style="margin-top: 0"
                    >
                      <el-input
                        type="textarea"
                        :rows="4"
                        :placeholder="$t('homedetail.hf') + iten_name"
                        v-model="textarea2"
                        resize="none"
                      >
                      </el-input>
                      <div class="bt_box">
                        <el-button
                          @click="submit(textarea2, 2)"
                          type="danger"
                          class="bt_tj"
                          >{{ $t('homedetail.tj') }}
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="d-main-left" v-else>
          <template>
            <div class="commentBox">
              <div class="commentBox_left nonavtitle">
                <div></div>
              </div>
              <div class="commentBox_right nonavtitle">
                <div class="comment_pj nonavtitle"></div>

                <div class="comment_context nonavtitle"></div>

                <div class="comment_image nonavtitle"></div>

                <div class="comment_attr nonavtitle">
                  <span class="nonavtitle"></span>
                </div>
                <div class="comment_box" v-if="storeInfoList.replyAdmin != ''">
                  <div class="comment_store">
                    <span class="nonavtitle"></span>
                  </div>
                  <div class="comment_store">
                    <span class="nonavtitle"></span>
                  </div>
                </div>
                <div class="afterReview" v-if="storeInfoList.review">
                  <div class="review_item">
                    <p>
                      [{{ $t('homedetail.product[5]')
                      }}<span class="nonavtitle"></span
                      >{{ $t('homedetail.product[6]') }}]
                    </p>
                    <div><span class="nonavtitle"></span></div>
                    <div class="review_item_img">
                      <span class="nonavtitle"></span>
                    </div>
                  </div>
                </div>
                <div class="huifu-input-box">
                  <span class="nonavtitle"
                    ><span class="nonavtitle"></span
                  ></span>
                  <div class="bt_box">
                    <span class="nonavtitle"></span>
                  </div>
                </div>
                <div class="reply_box">
                  <div class="reply_box_head">
                    <span><span class="nonavtitle"></span></span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div
            class="commentBox_right nonavtitle"
            style="margin-top: 20px; margin-left: 120px"
          >
            <div class="comment_pj nonavtitle"></div>

            <div class="comment_context nonavtitle"></div>

            <div class="comment_image nonavtitle"></div>

            <div class="comment_attr nonavtitle">
              <span class="nonavtitle"></span>
            </div>
            <div class="comment_box" v-if="storeInfoList.replyAdmin != ''">
              <div class="comment_store"><span class="nonavtitle"></span></div>
              <div class="comment_store"><span class="nonavtitle"></span></div>
            </div>
            <div class="afterReview" v-if="storeInfoList.review">
              <div class="review_item">
                <p>
                  [{{ $t('homedetail.product[5]')
                  }}<span class="nonavtitle"></span
                  >{{ $t('homedetail.product[6]') }}]
                </p>
                <div><span class="nonavtitle"></span></div>
                <div class="review_item_img">
                  <span class="nonavtitle"></span>
                </div>
              </div>
            </div>
            <div class="huifu-input-box">
              <span class="nonavtitle"><span class="nonavtitle"></span></span>
              <div class="bt_box">
                <span class="nonavtitle"></span>
              </div>
            </div>
            <div class="reply_box">
              <div class="reply_box_head">
                <span><span class="nonavtitle"></span></span>
              </div>
            </div>
          </div>
        </div>
        <div class="store_box">
          <div class="store_info">
            <div class="store-title">
              <i class="left_i"></i>
              {{ $t('homedetail.spxx') }}
              <i class="right_i"></i>
            </div>
            <ul
              v-if="storeInfoList.product_title"
              @click="toDetail(storeInfoList.goodsId)"
            >
              <li>
                <img class="store-img" :src="storeInfoList.imgurl" alt="" />
                <div class="box">
                  <div class="shaco">
                    <div class="font">{{ $t('homedetail.spmc') }}：</div>
                    <div class="font2">
                      {{ storeInfoList.product_title }}
                    </div>
                  </div>
                  <div class="shaco">
                    <div class="font">{{ $t('homedetail.pjdf') }}：</div>
                    <div>
                      <img
                        class="red-xx"
                        v-for="(item, index) of CommentType"
                        :key="index"
                        src="~/static/images/pj.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="shaco">
                    <div class="font">{{ $t('homedetail.pls') }}：</div>
                    <div class="font">
                      {{ replyNum }}{{ $t('homedetail.tiao') }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-else>
              <li>
                <div
                  class="nonavtitle"
                  style="width: 100%; height: 195px"
                ></div>
                <div class="box">
                  <div class="nonavtitle shaco" style="width: 100%"></div>
                  <div class="nonavtitle shaco" style="width: 100%"></div>
                  <div class="nonavtitle shaco" style="width: 100%"></div>
                </div>
                <p
                  class="nonavtitle"
                  style="
                    display: block;
                    width: 80%;
                    margin-left: auto;
                    margin-right: auto;
                  "
                ></p>
                <span class="nonavtitle"></span>
              </li>
            </ul>
          </div>
          <div class="d-main-right-nav">
            <div class="nav-item">
              <img
                :src="shop_list?.shop_logo"
                alt=""
                class="d-user"
                style="background-color: #eeeeee"
              />
              <span v-if="storeInfoList.product_title">{{
                shop_list?.shop_name
              }}</span>
              <span v-else class="nonavtitle"></span>

              <el-button
                type="danger"
                plain
                class="goumai"
                @click="goMch(shop_list.shop_id)"
              >
                {{ $t('homedetail.goMch') }}</el-button
              >
            </div>
            <ul>
              <li>
                <div v-if="storeInfoList.product_title">
                  {{ shop_list?.quantity_on_sale }}
                </div>
                <div v-else class="nonavtitle"></div>
                <span>{{ $t('homedetail.sale') }}</span>
              </li>
              <li>
                <div v-if="storeInfoList.product_title">
                  {{ shop_list?.quantity_sold }}
                </div>
                <div v-else class="nonavtitle"></div>
                <span>{{ $t('homedetail.Sold') }}</span>
              </li>
              <li>
                <div v-if="storeInfoList.product_title">
                  {{ shop_list?.collection_num }}
                </div>
                <div v-else class="nonavtitle"></div>
                <span>{{ $t('homedetail.people') }}</span>
              </li>
            </ul>
          </div>
          <div class="d-detail">
            <div class="tuijian">
              <i class="left_i"></i>
              {{ $t('homedetail.recommend') }}
              <i class="right_i"></i>
            </div>
            <ul v-if="storeInfoList.product_title">
              <li
                v-for="(item, index) of related_recommendations"
                :key="item.id"
                @click="toDetail(item.id)"
              >
                <img :src="item.imgurl" alt="" />
                <p>{{ item.product_title }}</p>
                <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
              </li>
            </ul>

            <ul v-else>
              <li>
                <div
                  class="nonavtitle"
                  style="width: 252px; height: 252px"
                ></div>
                <p
                  class="nonavtitle"
                  style="
                    display: block;
                    width: 80%;
                    margin-left: auto;
                    margin-right: auto;
                  "
                ></p>
                <span class="nonavtitle"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="homeitem isOverdue">
      <img src="~/static/images/isOverdue.png" alt="" />
      <p>{{ $t('homedetail.long[0]') }}~</p>
      <nuxt-link to="/">
        <el-button
          type="danger"
          class="join"
          style="width: 112px; height: 40px"
        >
          {{ $t('homedetail.Go') }}</el-button
        >
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'homeLayout',
  async asyncData ({ app, query, $Api }) {
    let pc_user = app.$cookies.get('pc_user')
    let pro_id = query.id
    let store_id = query.store_id
    let ClassName = query.ClassName
    var data1 = {
      api: 'mall.Product.index',

      pro_id: store_id // 商品ID
    }
    var data2 = {
      api: 'mall.Product.getCommentDetail',

      commentId: pro_id
    }
    var data3 = {
      api: 'mall.Product.getCommentReplyList',

      commentId: pro_id
    }
    //   let res = await $Api.doRequest(data)
    let [res1, res2, res3] = await Promise.all([
      $Api.doRequest(data1),
      $Api.doRequest(data2),
      $Api.doRequest(data3)
    ])
    // pc_user.access_id = res1.data.access_id
    return {
      pc_user: pc_user,
      pro_id,
      ClassName,
      shop_list: res1.data.shop_list,
      related_recommendations: res1.data.related_recommendations,
      storeInfoList: res2.data.detailInfo,
      commentImgList: res2.data.commentImgList,
      replyList: res3.data.list,
      isOverdue: false
    }
  },
  data () {
    return {
      kep: '',
      vipPrice: '',
      vipSource: 0, //0普通 ，1是会员
      pc_user: {},
      pro_id: '',
      checkImageI: 0,
      checkImgeUrl: '',
      num: '',
      price: '',
      soucang: require('/static/images/soucang.png'),
      soucang_h: require('/static/images/soucang_h.png'),
      soucang_red: require('/static/images/soucang_red.png'),

      mouseSou: false,
      mouseWx: false,
      mousePyq: false,
      tabIndex: 0,

      attrList: [], //商品有哪些属性
      skuBeanList: [], //商品各属性的个数
      shop_list: {}, //商品所属店铺
      related_recommendations: [], //相关推荐
      pro_detail: {},
      comments_num: '',
      commentType: 0,
      comments_image: '',
      comments_zhui: '',
      comments_list: [],
      haveSkuBean: '',
      count: 1, //商品数量

      collection_status: '',
      collection_id: '',
      xp: '',
      rx: '',
      tj: '',
      page1: 1,
      pagination_total: undefined,

      highKeys: {},
      skuName: 'SkuID',
      skuName1: 'Price',
      skuName2: 'Pic',
      skuName3: 'Stock',
      spliter: ',',
      sku_list: {},
      result: {},

      shareFlag: false,

      sliderLeft: '',
      sliderLeft1: '',
      sliderTop: '',
      sliderTop1: '',

      coupon_str: [],
      lqFlag: false,
      coupon_list: [],
      ClassName: '',
      isOverdue: false,
      replyList: [],
      input_index: -1,
      storeInfoList: [],
      commentImgList: [],
      CommentType: '',
      textarea: '',
      textarea2: '',
      store_id: '',
      iten_name: '',
      itec_name: '',
      sid: '',
      replyNum: ''
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.pro_id = this.$route.query.id
    }
    if (this.$route.query.CommentType) {
      this.CommentType = Number(this.$route.query.CommentType)
    }
    if (this.$route.query.store_id) {
      this.store_id = this.$route.query.store_id
    }
    if (this.$route.query.replyNum) {
      this.replyNum = this.$route.query.replyNum
    }
    if (this.$route.query.ClassName) {
      this.replyClassNameNum = this.$route.query.ClassName
    }
    // this.getData()
    // this.getStoreInfo()
    // this.getReplyList()
  },
  methods: {
    getStoreInfo () {
      var data = {
        api: 'mall.Product.getCommentDetail',

        commentId: this.pro_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.storeInfoList = res.data.detailInfo
          this.commentImgList = res.data.commentImgList
          this.isOverdue = false
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    getReplyList () {
      var data = {
        api: 'mall.Product.getCommentReplyList',

        commentId: this.pro_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.replyList = res.data.list
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    submit (row, index, arr1, arr2) {
      if (index == 1) {
        this.sid = ''
      }
      var data = {
        api: 'mall.Product.sendComment',

        commentId: this.pro_id,
        text: row,
        sid: this.sid ?? ''
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.textarea = ''
            this.textarea2 = ''
            this.input_index = -1
            this.$message.success('回复成功')
            this.getStoreInfo()
            this.getReplyList()
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    revert (item, index) {
      this.iten_name = item.replyName
      this.sid = item.id
      if (this.input_index == index) {
        this.input_index = -1
      } else {
        this.input_index = index
      }
    },
    getData () {
      var data = {
        api: 'mall.Product.index',

        pro_id: this.store_id // 商品ID
      }

      this.$Api.doRequest(data).then(res => {
        this.pc_user.access_id = res.data.access_id
        this.shop_list = res.data.shop_list
        this.related_recommendations = res.data.related_recommendations
      })
    },

    /*
				跳转商品详情
			 */
    toDetail (id) {
      this.$router.push({ path: '/homedetail/homedetail', query: { id: id } })
    },

    goMch (id) {
      this.$router.push({ path: '/mch/mch', query: { id: id } })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/homedetail/evaluationdetails.css';
</style>
