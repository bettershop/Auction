<template>
  <div id="app" ref="apps" style="margin: 0 auto; width: 1200px">
    <template v-if="!isOverdue">
      <!-- homeitem start -->
      <div style="width: 1200px; margin: 20px auto">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }" v-if="!ClassName">
            {{ $t('homedetail.title') }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/' }" v-else>{{ ClassName }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="pro_detail.name">{{
            pro_detail.name
          }}</el-breadcrumb-item>
          <el-breadcrumb-item v-else class="nonavtitle" style="width: 100px"></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="homeitem">
        <div class="homeleft relative">
          <!-- {{checkImageI}} -->
          <div class="relative" :class="video != '' && checkImageI == 0 ? 'imgbox2' : 'imgbox'" @mousemove="seeImg" v-if="pro_detail.name">
            <div style="width: 100%; height: 100%; position: relative" v-if="video != '' && checkImageI == 0">
              <video controls="controls" width="100%" height="100%" :src="video" ref="video" @play="videoIsPlay = true" @pause="videoIsPlay = false" @ended="videoIsPlay = false" loop>
                {{ $t('homedetail.bzcbfsp') }}
              </video>
              <img class="bofang_bt" @click="changeVideoStatus()" v-show="!videoIsPlay" src="../../static/images/bofang.png" />
            </div>
            <img v-else :src="checkImageI < 0 ? Pic : pro_detail.img_arr[checkImageI]" alt="" @error="handleErrorImg" />
            <div v-if="video == '' || (video != '' && checkImageI != 0)" class="imgSlider" :style="{ top: sliderTop + 'px', left: sliderLeft + 'px' }"></div>

            <div class="imgSeeBox">
              <img :src="checkImageI < 0 ? Pic : pro_detail.img_arr[checkImageI]" alt="" :style="{ top: sliderTop1 + 'px', left: sliderLeft1 + 'px' }" @error="handleErrorImg" />
            </div>
            <div class="proDown proDown_one" v-if="pro_detail.recycle == 1 || pro_detail.recycle == '1'">
              <!-- 已过期 -->
              {{ $t('shoppingCart.ygq') }}
            </div>
            <div class="proDown proDown_one" v-if="
                (pro_detail.status == 3 || pro_detail.status == '3') &&
                (pro_detail.recycle != 1 || pro_detail.recycle != '1')
              ">
              <!-- 已下架 -->
              {{ $t('homedetail.shelf') }}
            </div>
            <div v-if="
                !haveSkuBean &&
                iShow == false &&
                (pro_detail.num <= 0 || pro_detail.num <= '0') &&
                (pro_detail.recycle != 1 || pro_detail.recycle != '1') &&
                (pro_detail.status != 3 || pro_detail.status != '3')
              " id="emptyKC" class="proDown proDown_one">
              <!-- 已售罄 -->
              {{ $t('homedetail.empty') }}
            </div>
            <div v-if="
                haveSkuBean &&
                (pro_detail.num != 0 || pro_detail.num != '0') &&
                (pro_detail.recycle != 1 || pro_detail.recycle != '1') &&
                (pro_detail.status != 3 || pro_detail.status != '3') &&
                (shop_list.is_open != 1 || shop_list.is_open != '1')
              " class="proDown proDown_one">
              <!-- 已打烊 -->
              {{ $t('shoppingCart.ydy') }}
            </div>
          </div>
          <div class="imgbox" v-else>
            <div class="nonavtitle" style="width: 100%; height: 100%"></div>
          </div>

          <div class="hometab">
            <div class="tableft" @click="imgBtnClick(0)">
              <img src="~/static/images/jianrou_l.png" alt="" />
            </div>
            <ul id="outDiv" v-if="pro_detail.name">
              <li v-for="(item, index) of pro_detail.img_arr" :key="index" :class="{ active: checkImageI == index }" @click="checkImageI = index">
                <div style="width: 100%; height: 100%" v-if="video != '' && index == 0">
                  <video width="100%" height="100%" :src="item">
                    {{ $t('homedetail.bzcbfsp') }}
                  </video>
                </div>
                <img v-else :src="item" alt="" @error="handleErrorImg" />
              </li>

              <li style="min-width: 1px; width: 1px; border: 0"></li>
            </ul>

            <ul id="outDiv" v-else>
              <li>
                <div class="nonavtitle" style="width: 100%; height: 100%"></div>
              </li>

              <li style="min-width: 1px; width: 1px; border: 0"></li>
            </ul>

            <div class="tabright" @click="imgBtnClick(1)">
              <img src="~/static/images/jiantou_r.png" alt="" />
            </div>
          </div>
        </div>
        <div class="homeright">
          <div class="detailtitle">
            <span v-if="xp != ''">{{ xp }}</span>
            <span v-if="rx != ''" style="background-color: #d4282d">{{
              rx
            }}</span>
            <span v-if="tj != ''" style="background-color: #d4282d">{{
              tj
            }}</span>
            <span v-if="!pro_detail.name" class="nonavtitle" style="min-width: 38px; width: 38px"></span>
            <h2 v-if="pro_detail.name">{{ pro_detail.name }}</h2>
            <h2 v-else class="nonavtitle" style="width: 150px"></h2>
          </div>
          <div v-if="pro_detail.name" class="detail-neirong">
            {{ pro_detail.subtitle }}
          </div>
          <div v-else class="detail-neirong nonavtitle"></div>
          <div v-if="pro_detail.name" class="jiage">
            <p class="jg" v-if="kep == false">
              <span>{{ $t('homedetail.price') }}</span>
              <span class="money">{{$LaiKeCommObject.show_symbol}} {{ $LaiKeCommObject.formatPrice(pro_detail.price) }}
              </span>
            </p>
            <p class="jg" v-if="kep != false"></p>
            <div v-if="kep != false">
              <span class="three">{{ $t('homedetail.price') }}</span>
              <span class="one">{{$LaiKeCommObject.show_symbol}}</span><span class="wenzi">{{
                $LaiKeCommObject.formatPrice( vipPrice ? vipPrice : pro_detail.vipPrice)
              }}</span>
              <span class="two" v-if="price">{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(pro_detail.price) }} </span>
            </div>
            <!-- </p> -->
            <p class="yh" v-if="coupon_str.length > 0 && pluginStatus.couponPlugin == true">
              <span>{{ $t('homedetail.Collect_coupons') }}</span>
              <span v-if="index<=2" v-for="(item, index) of coupon_str" :key="index" class="lq_icon" @click="pointBtn(item)" style="cursor: pointer">{{ item.limit }}</span>
              <span v-if="coupon_str.length >= 3" @click="openClick" style="color: #888888; cursor: pointer">{{ $t('homedetail.more') }}>></span>
            </p>
          </div>

          <div v-else class="jiage" style="background-color: #ffffff">
            <p class="jg">
              <span>{{ $t('homedetail.price') }}</span>
              <span class="money nonavtitle"></span>
            </p>
            <p class="yh">
              <span>{{ $t('homedetail.preferential') }}</span>
              <span class="yh-text nonavtitle"></span>
            </p>
          </div>

          <template v-if="
              sku_list.result && !sku_list.result['undefined'] && kep != false
            ">
            <div class="yanse" v-for="(item, key) in sku_list.result" :key="key" v-if="key != 'vipPrice'">
              <span>{{ key }}</span>
              <div class="yanse-item">
                <el-row>
                  <el-button v-for="(value, index) in item" :key="index" :class="{ active: value.active }" size="small" plain :disabled="value.disabled" @click="handleActive(key, value)">
                    {{ value.name }}
                  </el-button>
                </el-row>
              </div>
            </div>
          </template>

          <template v-if="
              sku_list.result && !sku_list.result['undefined'] && kep == false
            ">
            <div class="yanse" v-for="(item, key) in sku_list.result" :key="key">
              <!-- {{sku_list.result}} -->
              <span>{{ key }}</span>
              <div class="yanse-item">
                <el-row>
                  <el-button v-for="(value, index) in item" :key="index" :class="{ active: value.active }" size="small" plain :disabled="value.disabled" @click="handleActive(key, value)">
                    {{ value.name }}
                  </el-button>
                </el-row>
              </div>
            </div>
          </template>
          <div class="shuliang">
            <span class="shuliang-number">{{ $t('homedetail.num') }}</span>
            <el-input-number size="small" v-model="num" class="number" :min="1" :max="count" :precision="0">
            </el-input-number>
          </div>
          <div class="hr"></div>
          <div class="end">
            <el-button v-if="ClassName != '会员商品'" type="danger" :disabled="
                pro_detail.status == 3 ||
                pro_detail.status == '3' ||
                shop_list.is_open != 1 ||
                shop_list.is_open != '1'
              " class="join" @click="addCard">
              {{ $t('homedetail.addcart') }}</el-button>
            <el-button type="danger" :disabled="
                pro_detail.status == 3 ||
                pro_detail.status == '3' ||
                shop_list.is_open != 1 ||
                shop_list.is_open != '1' ||
                !this.haveSkuBean
              " plain class="goumai" @click="toBuy">
              {{ $t('homedetail.toBuy') }}</el-button>

            <div @click="collection(0)" v-if="collection_status == 0" class="shoucang" @mousemove="mouseSou = true" @mouseout="mouseSou = false">
              <img :src="mouseSou ? soucang_h : soucang" alt="" />
              <span>{{ $t('homedetail.collection') }}</span>
            </div>
            <div @click="collection(1)" v-else class="shoucang" @mousemove="mouseSou = true" @mouseout="mouseSou = false" :style="
                $t('homedetail.title') == 'Home'
                  ? 'width: auto;padding: 0 5px;border-color: #D4282D;'
                  : 'border-color: #D4282D;'
              ">
              <img :src="mouseSou ? soucang_h : soucang_red" alt="" />
              <span style="color: #d4282d">{{
                $t('homedetail.Already_collected')
              }}</span>
            </div>
            <div @click="_kefu" class="shoucang" style="margin-left: 8px" @mousemove="mouseSou1 = true" @mouseout="mouseSou1 = false">
              <img :src="mouseSou1 ? kefu : kefu_h" alt="" />
              <span>{{ $t('kefu') }}</span>
            </div>
          </div>

          <div class="shareBox" v-if="0">
            <div>{{ $t('homedetail.share') }}</div>
            <img @click="shareCode" :src="mouseWx ? wxImg_h : wxImg" alt="" @mousemove="mouseWx = true" @mouseout="mouseWx = false" />
            <img @click="shareCode" :src="mousePyq ? pyq_h : pyq" alt="" @mousemove="mousePyq = true" @mouseout="mousePyq = false" />
          </div>
        </div>
      </div>
      <!-- homeitem end -->

      <!-- d-main start -->
      <div class="d-main">
        <div class="d-main-left">
          <div style="margin-bottom: 24px; height: 393px; position: relative" v-if="proVideo">
            <video controls="controls" width="100%" height="393px" :src="proVideo" ref="video2" @play="videoIsPlay2 = true" @pause="videoIsPlay2 = false" @ended="videoIsPlay2 = false" loop>
              {{ $t('homedetail.bzcbfsp') }}
            </video>
            <img class="bofang_bt" @click="changeVideoStatus2()" v-show="!videoIsPlay2" src="~/static/images/bofang.png" />
          </div>
          <div class="d-main-left-title">
            <div :class="{ active: tabIndex == idx }" @click="tabChange(itm, idx)" v-for="(itm, idx) in pro_conten">
              {{ itm.name }}
            </div>
            <div :class="{ active: tabIndex == 'evaluate' }" @click="tabIndex = 'evaluate'">
              {{ $t('homedetail.product[1]')
              }}<span v-if="comments_num !== ''">（{{ comments_num }}）</span>
            </div>
          </div>
          <div class="d-main-left-content relative" v-if="tabIndex != 'evaluate'">
            <div v-html="proContent"></div>
          </div>
          <template v-if="tabIndex == 'evaluate'">
            <div class="d-main-left-comment">
              <ul>
                <li :class="{ active: commentType == 0 }" @click="commentType = 0">
                  {{ $t('homedetail.product[2]') }}({{ comments_num }})
                </li>
                <li :class="{ active: commentType == 1 }" @click="commentType = 1">
                  {{ $t('homedetail.product[3]') }}({{ comments_image }})
                </li>
                <li :class="{ active: commentType == 2 }" @click="commentType = 2">
                  {{ $t('homedetail.product[4]') }}({{ comments_zhui }})
                </li>
              </ul>
            </div>

            <div class="commentBox" v-for="(items, indexs) of comments_list" :key="indexs">
              <div class="commentBox_left">
                <img :src="items.headimgurl" alt="" />
                <div>{{ items.user_name }}</div>
              </div>
              <div class="commentBox_right">
                <div class="comment_pj">
                  <img v-for="(item, index) of items.CommentType" :key="index" src="~/static/images/pj.png" alt="" />
                </div>

                <div class="comment_context">
                  {{ items.content }}
                </div>

                <div class="comment_image">
                  <template v-for="(item, index) of items.images">
                    <el-image v-if="item.url" :key="index" :src="item.url" :preview-src-list="[item.url]">
                    </el-image>
                  </template>
                </div>

                <div class="comment_attr">
                  {{ items.attribute_str }} {{ items.add_time }}
                </div>
                <div class="comment_box" v-if="items.replyAdmin">
                  <div class="comment_store">{{ $t('homedetail.sjhf') }}：</div>
                  <div class="comment_store">{{ items.replyAdmin }}</div>
                </div>
                <div class="afterReview" v-if="items.review">
                  <div class="review_item">
                    <p>
                      [{{ $t('homedetail.product[5]') }}{{ items.review_day
                      }}{{ $t('homedetail.product[6]') }}]
                    </p>
                    <div>{{ items.review }}</div>
                    <div class="review_item_img">
                      <template v-for="(item, index) of items.review_images">
                        <el-image v-if="item.url" :key="index" class="img" :src="item.url" :preview-src-list="[item.url]">
                        </el-image>
                      </template>
                    </div>
                  </div>
                </div>
                <div class="huifu_box" @click="
                    toEva(items.id, items.CommentType, pro_id, items.replyNum)
                  ">
                  <div class="huifu_div">
                    <img src="~/static/images/huifu.png" width="16" height="16" />
                  </div>
                  <div>
                    <span class="huifu_font">{{ items.replyNum }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="paginationBox">
              <el-pagination v-if="pagination_total && pagination_total > 0" :current-page.sync="page1" :page-size="20" @current-change="changePage" background layout="prev, pager, next" :total="pagination_total">
              </el-pagination>
            </div>
          </template>
        </div>
        <div class="d-main-right">
          <div class="d-main-right-nav">
            <div class="nav-item">
              <img :src="shop_list.shop_logo" alt="" class="d-user" style="background-color: #eeeeee" />
              <span v-if="pro_detail.name">{{ shop_list.shop_name }}</span>
              <span v-else class="nonavtitle"></span>

              <el-button type="danger" plain class="goumai" @click="goMch(shop_list.shop_id)">
                {{ $t('homedetail.goMch') }}</el-button>
            </div>
            <ul>
              <li>
                <div v-if="pro_detail.name">
                  {{ shop_list.quantity_on_sale }}
                </div>
                <div v-else class="nonavtitle"></div>
                <span>{{ $t('homedetail.sale') }}</span>
              </li>
              <li>
                <div v-if="pro_detail.name">{{ shop_list.quantity_sold }}</div>
                <div v-else class="nonavtitle"></div>
                <span>{{ $t('homedetail.Sold') }}</span>
              </li>
              <li>
                <div v-if="pro_detail.name">{{ shop_list.collection_num }}</div>
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
            <ul v-if="pro_detail.name">
              <li v-for="(item, index) of related_recommendations" :key="item.id" @click="toDetail(item.id)">
                <img :src="item.imgurl" alt="" @error="handleErrorImg" />
                <p>{{ item.product_title }}</p>
                <span>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}</span>
              </li>
            </ul>

            <ul v-else>
              <li>
                <div class="nonavtitle" style="width: 252px; height: 252px"></div>
                <p class="nonavtitle" style="
                    display: block;
                    width: 80%;
                    margin-left: auto;
                    margin-right: auto;
                  "></p>
                <span class="nonavtitle"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- d-main end -->
    </template>

    <div v-else class="homeitem isOverdue">
      <img src="~/static/images/isOverdue.png" alt="" />
      <p>{{ $t('homedetail.long[0]') }}~</p>
      <el-button type="danger" class="join" style="width: 112px; height: 40px" @click="toUrl('/')">
        {{ $t('homedetail.Go') }}</el-button>
    </div>

    <!-- 分享二维码 -->
    <div class="mask" v-if="shareFlag" @click="shareFlag = false">
      <div class="codeMask">
        <div id="qrcode">
          <img :src="sharingSettings.H5Url" width="150" height="150" />
        </div>
        <p style="padding: 0 10px; word-break: break-all">
          {{ sharingSettings.textExplain }}
        </p>
      </div>
    </div>

    <!-- 领取优惠券弹窗 -->
    <div class="mask" v-if="lqFlag">
      <div class="coupon_mask">
        <div class="coupon_mask_title">
          {{ $t('homedetail.Collect_coupons') }}
          <i class="el-icon-close" @click="lqFlag = false"></i>
        </div>
        <ul class="coupon_mask_content">
          <li v-for="(item, index) of coupon_list" :key="index">
            <div class="coupon_mask_content_data">
              <div class="coupon_mask_top">
                <template v-if="item.activity_type == 2">
                  {{$LaiKeCommObject.show_symbol}} <span class="price">{{ $LaiKeCommObject.formatPrice(item.money) }}</span>
                </template>
                <template v-else-if="item.activity_type == 3">
                  <span class="price">{{ Number(item.discount) }}</span>
                  {{ $t('homedetail.long[2]') }}
                </template>
                <span class="maxprice">{{ item.limit }}</span>
              </div>
              <p>{{ item.coupon_name }}</p>
              <span>{{ item.expirationDate }}</span>
            </div>
            <div v-if="item.point" @click="pointBtn(item)" :style="{
                cursor:
                  item.point_type != 1 && item.point_type != 2
                    ? 'default'
                    : ''
              }" class="coupon_mask_btn">
              {{ item.point }}
            </div>

            <img v-if="item.point_type == 1" class="lq_ylq" src="~/static/images/lq_ylq.png" alt="" />
          </li>
        </ul>
      </div>
    </div>

    <!-- 客服 -->
    <template v-if="isKeFuShow">
      <div class="kefu">
        <div class="pageBox" @click="isKeFuShow = !isKeFuShow">
          <div class="pageBox_kf" @click.stop>
            <!-- 店铺列表 -->
            <div class="kf_left" @click="showBQ = false">
              <!-- 消息列表 -->
              <div class="left_title">{{$t('xxlb')}}</div>
              <!-- 搜索最近联系人 -->
              <div class="left_input">
                <img :src="searchImg" />
                <input type="text" :placeholder="$t('sszjlxr')" v-model="mchName" />
              </div>
              <!-- 店铺列表 -->
              <div class="left_list">
                <template v-for="(item, index) in userlist">
                  <div class="list_item" :class="{ list_item_active: isActive == index }" :key="index" @click="_getKF(item, index)">
                    <div class="item_img">
                      <img :src="item.headimgurl" />
                    </div>
                    <div class="item_content">
                      <div class="content_title">{{ item.user_name }}</div>
                      <div class="content_message" v-if="item.content.text">{{ item.content.text }}</div>
                    </div>
                    <div class="item_end">
                      <div class="end_time">{{ item.addTime }}</div>
                      <div class="end_num" v-if="item.no_read_num > 0">
                        <span>{{
                          item.no_read_num <= 99 ? item.no_read_num : '+99'
                        }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <!-- 聊天信息框 -->
            <div class="kf_right" @click="showBQ = false">
              <!-- 店铺名称、关闭 -->
              <div class="right_title">
                <div class="title_name">
                  <template v-if="userlist.length">
                    {{ userlist[isActive].user_name }}
                  </template>
                </div>
                <div class="title_del">
                  <i class="el-icon-close" @click="isKeFuShow = !isKeFuShow"></i>
                </div>
              </div>
              <!-- 聊天内容 -->
              <div class="right_message">
                <template v-for="(item, index) in arrlist">
                  <!-- 店铺发送的消息 -->
                  <div class="message_mch" v-if="item.is_mch_send">
                    <div class="mch_content ">
                      <!-- 发送图片消息 -->
                      <div class="kefu_content_img" v-if="
                          item.content &&
                          item.content.length > 4 &&
                          item.content.slice(0, 4) == 'http'
                        ">
                        <a :href="item.content" target="_blank">
                          <img :src="item.content" alt="点击查看大图" />
                        </a>
                      </div>
                      <!-- 发送文字消息 -->
                      <div class="kefu_content_text" v-else>
                        {{ item.content.text }}
                      </div>
                    </div>
                  </div>
                  <!-- 用户发送的消息 -->

                  <div class="message_user" v-if="item.is_mch_send == 0">
                    <div class="user_content">
                      <!-- 发送图片消息 -->
                      <div class="kefu_content_img" v-if="
                          item.content &&
                          item.content.length > 4 &&
                          item.content.slice(0, 4) == 'http'
                        ">
                        <a :href="item.content" target="_blank">
                          <img :src="item.content" alt="点击查看大图" />
                        </a>
                      </div>
                      <!-- 订单 -->
                      <div v-else-if="item.content.order&&item.content.order.orderId">
                        <div>
                          <div class="title">我要咨询这件商品</div>
                          <div class="goods-info">
                            <div>
                              <img :src="item.content.order.imgUrl " @error="handleErrorImg" />
                            </div>
                            <div class="message">
                              <div class="product">{{ item.content.order.orderName }}</div>
                              <div class="price">&yen;{{ Number(item.content.order.price ||0).toFixed(2) }}</div>
                              <div> 共{{ item.content.order.num }}件商品</div>
                            </div>
                          </div>
                          <div class="product box" style=" width: 150px;">订单编号 {{ item.content.order.orderNo }}</div>
                          <div class="box">创建时间 {{ item.content.order.addTime }}</div>
                          <div class="controls-but">
                            <div @click="toUrl('/my/my/orderDetails?order_id=' + item.content.order?.orderId)">查看订单</div>
                          </div>
                        </div>
                      </div>
                      <!-- 商品 -->
                      <div v-if="item.content.pro && item.content.pro.product_title ">
                        <div>
                          <div class="product-goods-info">
                            <div class="information">
                              <div>
                                <img class="img" :src="item.content.pro.imgUrl ||item.content.pro.imgurl || ErrorImg" />
                              </div>
                              <div class="temporarily-info">
                                <div class="">
                                  <div class="product-name temporarily-name">{{item.content.pro.product_title}} </div>
                                  <div style="display: flex;align-items: end;">
                                    <div class="">
                                      <div class="product-price">&yen;{{ Number(item.content.pro.price || 0 ).toFixed(2)}}</div>
                                      <div class=" ">共{{item.content.pro.payPeople ||0}}人付款</div>
                                    </div>
                                  </div>
                                </div>
                                <div class="product-but ">
                                  <!-- 去购买 -->
                                  <div @click="toUrl(`/homedetail/homedetail?id=${item.content.pro?.id}&ClassName=首页`)" class="go-buy">
                                    去购买
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      <!-- 发送文字消息 -->
                      <div class="kefu_content_text" v-if="item.content.text && !item.orderMsg">
                        {{ item.content.text}}
                      </div>

                    </div>
                    <img :src="item.img" />
                  </div>
                </template>
              </div>
              <!-- 表情、图片 -->
              <div class="right_img">
                <div class="img_bq" @click.stop="showBQ = true">
                  <img :src="bqUrl" />
                  <div class="BQlist" v-if="showBQ">
                    <span v-for="(item, index) in emojiData" @click.stop="_chooceBQ(item)">
                      {{ item }}
                    </span>
                  </div>
                </div>
                <div class="img_tp">
                  <input type="file" name="upimg" id="upimg" @change="_chooceImg" accept="image/*" />
                  <img :src="tpUrl" />
                </div>
              </div>
              <!-- 输入框 -->
              <div class="right_input">
                <div class="kefu_input">
                  <!-- <textarea v-model="input_content"></textarea> -->
                  <el-input ref="elInput" type="textarea" resize="none" maxlength="140" :placeholder="$t('qsrlr')" v-model="input_content" @keydown.native="_listenerKeydown" @keyup.native="_listenerKeyup">
                  </el-input>
                </div>
                <div class="kefu_buttom" @click="_handleChange">
                  <div>{{ $t('faso') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import QRCode from 'qrcode-generator'
import emoji from '@/assets/mixins/emoji.js'
export default {
  layout: 'homeLayout',
  async asyncData({
    app,
    query,
    redirect,
    $Api
  }) {
    let pc_user = app.$cookies.get('pc_user')
    let pro_id = query.id
    let ClassName = query.ClassName
    var data = {
      api: 'mall.Product.index',
      access_id: pc_user ? pc_user.access_id : '',
      pro_id: pro_id // 商品ID
    }
    let res = await $Api.doRequest(data)
    var coupon_str = []
    if (res.data.coupon_status) {
      coupon_str = res.data.coupon_str
    }
    if (res.data.pro.price) {
      res.data.pro.price = res.data.pro.price + ''
      if (res.data.pro.price && res.data.pro.price.includes('-')) {
        res.data.pro.price =
          Number(res.data.pro.price.split('-')[0]).toFixed(2) +
          '-' +
          Number(res.data.pro.price.split('-')[1]).toFixed(2)
      } else {
        res.data.pro.price = Number(res.data.pro.price).toFixed(2)
      }
    }
    res.data.pro.content = res.data.pro.content
      .replace(
        /src/g,
        "style='max-width:100%!important;height: auto!important;' src"
      )
      .replace(/<table/g, `<table style="width:100%!important;"`)
    if (res.data.pro.img_arr.length > 5) {
      res.data.pro.img_arr.length = 5
    }
    return {
      pc_user: pc_user,
      pro_id,
      ClassName,
      coupon_str: coupon_str,
      skuBeanList: res.data.attribute_list,
      kep: res.data.attribute_list?.[0].vipPrice ?? false,
      vipPrice: res.data.attribute_list?.[0].vipPrice ?? '',
      shop_list: res.data.shop_list,
      related_recommendations: res.data.related_recommendations,
      pro_detail: res.data.pro,
      video: res.data.pro.video,
      proVideo: res.data.pro.proVideo,
      // price: res.data.pro.price,
      comments_num: res.data.commentsTotal,
      collection_status: res.data.collection_status,
      collection_id: res.data.collection_id,
      title: res.data.pro.name,
      sharingSettings: res.data.sharingSettings
    }
  },
  head() {
    return {
      title: this.title,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.title
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: this.title
      }
      ]
    }
  },
  data() {
    return {
      kep: '',
      vipPrice: '',
      vipSource: 0, //0普通 ，1是会员
      pluginStatus: {},
      pc_user: {},
      pro_id: '',
      checkImageI: 0,
      checkImgeUrl: '',
      num: '',
      price: '',
      pro_conten: [],
      kefu: require('/static/images/kefu_b.png'),
      kefu_h: require('/static/home-img/kefu_h.png'),
      soucang: require('/static/images/soucang.png'),
      soucang_h: require('/static/images/soucang_h.png'),
      soucang_red: require('/static/images/soucang_red.png'),
      wxImg: require('/static/images/wx.png'),
      wxImg_h: require('/static/images/wx_h.png'),
      pyq: require('/static/images/pyq.png'),
      pyq_h: require('/static/images/pyq_h.png'),
      mouseSou: false,
      mouseSou1: false,
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
      video: '',
      proVideo: '',
      videoIsPlay: false,
      videoIsPlay2: false,
      jsNum: 0,
      title: '',
      iShow: true,
      sharingSettings: {},
      proContent: '',
      //客服开始
      isSpace: 0, //空格键是否被按下
      isEnter: 0, //enter键是否被按下
      urlType: '', //根据配置的url判断项目类型：java/php
      isKeFuShow: false, //是否显示客服弹窗
      isActive: 0, //选择第几个客服
      showBQ: false, //显示表情列表
      mchName: '', //搜索的店铺
      emojiData: [], //表情列表
      currentUserId: '', //当前用户id
      currentMchId: '', //当前店铺id 如有则会把此店铺排到第一位
      userlist: [], //客服店铺列表
      userlistindex: 0, //当前店铺下标
      type: 0, //0是用户，1是店铺
      arrlist: [], //聊天内容列表
      img_list: [], //发送图片
      input_content: '', //发送的内容
      socketTask: '', //WebSocket上下文
      searchImg: require('/static/home-img/head_ss.png'),
      bqUrl: require('/static/home-img/biaoqing.png'),
      tpUrl: require('/static/home-img/xiangce.png'),
      //客服结束
      ErrorIMG: process.env.VUE_APP_LKT_ROOT_IMG_URL + "/pic/images/icon/Default_picture.png",
    }
  },

  watch: {
    tabIndex(val) {
      if (val == 'evaluate') {
        this.getcomment()
      }
    },
    commentType(val) {
      this.page1 = 1

      this.pagination_total =
        val == 0 ?
          this.comments_num :
          val == 1 ?
            this.comments_image :
            this.comments_zhui

      this.getcomment()
    },
    isKeFuShow(val) {
      if (!val) {
        this.isActive = 0
        this.mchName = ''
      }
    },
    mchName(val) {
      console.log('正在搜索店铺-》', val);
      this.isActive = 0 //搜索的时候默认下标为0 选择第一条
      this._getMchList()
    },
  },
  mounted() {
    const qrcode = document.getElementById('qr-goods')
    qrcode.style.display = 'block'
    //根据配置的url判断项目类型：java/php
    if (process.env.VUE_APP_LKT_KEFU_URL == 'wss://tp.dev.laiketui.net/wss/') {
      this.urlType = 'PHP'
    } else {
      this.urlType = 'JAVA'
    }
    this.emojiData = emoji
    if (this.$route.query.id) {
      this.pro_id = this.$route.query.id
    }
    this.pc_user = this.$cookies.get('pc_user')
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    if (this.$route.query.ClassName) {
      if (this.$route.query.ClassName == 1) {
        this.ClassName = this.$t('homedetail.rxtj')
        this.vipSource = 0
      } else if (this.$route.query.ClassName == 2) {
        this.ClassName = this.$t('homedetail.xprm')
        this.vipSource = 0
      } else if (this.$route.query.ClassName == 3) {
        this.ClassName = '会员商品'
        this.vipSource = 1
      } else if (this.$route.query.ClassName) {
        this.ClassName = this.$route.query.ClassName
        this.vipSource = 0
      }
    }
    this.getApi()
    this.queryGoodsUrl()

  },
  beforeDestroy() {
    const qrcode = document.getElementById('qr-goods')
    qrcode.style.display = 'none'
  },
  methods: {
    // 获取商品分享二维码
    async queryGoodsUrl() {
      const qrcode = document.getElementById('qrcode')
      const xiazai = document.getElementById('xiazai')

      const qr = QRCode(0, 'H'); // 0 是版本，'H' 是纠错级别
      qr.addData(`${process.env.VUE_APP_LKT_H5_DEFURL}pagesC/goods/goodsDetailed?toback=true&pro_id=${this.pro_id}`);
      qr.make();
      const qrcodeHtml = qr.createImgTag(4); // 4 是缩放因子
      qrcode.innerHTML = qrcodeHtml;
      // 设置图像宽度
      const img = qrcode.querySelector('img');
      img.width = 136; // 设置所需的宽度

      xiazai.innerHTML = qrcodeHtml;

      const img1 = xiazai.querySelector('img');
      img1.width = 30; // 设置所需的宽度

    },
    handleErrorImg(e) {
      console.log('商品详情破图xxx', e);
      e.target.src = this.ErrorIMG
    },
    /**
     * 客服开始
     */
    //监听按下键盘，初始化值
    _listenerKeyup(event) {
      const keyCode = event.keyCode || event.which;
      if (keyCode == 13) { this.isEnter = 0 }
      if (keyCode == 32) { this.isSpace = 0 }
    },
    //监听松开键盘，发送消息
    _listenerKeydown(event) {
      const keyCode = event.keyCode || event.which;
      if (keyCode == 13) { this.isEnter = 1 }
      if (keyCode == 32) { this.isSpace = 1 }
      if (this.isSpace == 1 && this.isEnter == 1) {
        console.log('空格+Enter 键被按下！--》执行换行')
      } else if (this.isEnter == 1) {
        console.log('Enter 键被按下！--》发送消息')
        //发送消息方法
        this._handleChange()
        //默认按enter会有换行效果，所以这里使用  event.preventDefault();阻止默认事件，可根据自己的项目需求进行修改
        event.preventDefault();
      }
    },
    //客服显示弹窗
    _kefu() {
      this.isKeFuShow = !this.isKeFuShow
      if (this.isKeFuShow) {
        //获取当前店铺id、用户id
        this.currentMchId = this.shop_list.shop_id
        this.currentUserId = this.$cookies.get('userId')
        //获取店铺客服列表
        this._getMchList()
        //连接 websocket
        this.connectSocket()
      }
    },
    //点击切换店铺
    _getKF(item, index) {
      //当前选择的客服下标
      this.isActive = index
      //滚动效果
      let leftList = document.querySelector('.left_list')
      let isScrollTop = (leftList.scrollHeight / 12) * index
      leftList.scrollTop = isScrollTop
      //获取当前店铺id
      this.currentMchId = item.mch_id
      //更新当前店铺数据，标记已读
      this.userlistindex = index
      this.userlist[this.userlistindex].no_read_num = 0
      //获取 当前店铺的聊天记录
      this._newlist()
    },
    //选择表情
    _chooceBQ(item) {
      this.input_content = this.input_content.concat(item)
      this.$refs.elInput.focus()
    },
    //选择图片
    _chooceImg() {
      var upname = document.getElementById('upimg').value
      if (
        !upname.includes('GIF') &&
        !upname.includes('gif') &&
        !upname.includes('JPG') &&
        !upname.includes('jpg') &&
        !upname.includes('JPEG') &&
        !upname.includes('jpeg') &&
        !upname.includes('BMP') &&
        !upname.includes('bmp') &&
        !upname.includes('PNG') &&
        !upname.includes('png')
      ) {
        this.$message.error(this.$t('myinfor.Tips[3]'))
        return
      }
      //选择图片
      var reads = new FileReader()
      let f = document.getElementById('upimg').files[0]
      reads.readAsDataURL(f)
      reads.onload = e => {
        //console.log('选择图片，本地虚拟路径', e.target.result)
      }
      //上传图片
      var data = new FormData()
      data.append('file', document.getElementById('upimg').files[0])
      data.append('access_id', this.pc_user.access_id)
      this.$upImg(data)
        .then(res => {
          if (res.code == 200) {
            this.img_list = res.data.url
            //发送图片
            this._handleChange()
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    //获取 店铺列表
    async _getMchList() {
      let data = {
        api: 'mall.Msg.user_mchList',
        userId: this.currentUserId, //当前用户id
        mchId: this.currentMchId, //当前店铺id 如有则会把此店铺排到第一位

        mchName: this.mchName, //搜索的店铺名称
      }
      //搜索店铺的时候 不要传当前店铺id
      if (this.mchName) {
        data.mchId = ''
      }
      this.$Api
        .doRequest(data)
        .then(res => {
          if (res.data.list && res.data.list.length > 0) {
            //店铺列表
            this.userlist = res.data.list
            this.userlist.forEach((v, i) => {
              try {
                v.content = JSON.parse(v.content)
              } catch (error) {
                // 兼容旧数据 字符串
                v.content = { text: v.content }
              }
            })

            //与第一个店铺聊天
            this.currentMchId = this.userlist.length > 0 ? this.userlist[0].mch_id : this.currentMchId
            //当前店铺id消息 全部已读
            if (this.currentMchId) {
              this.userlist[0].no_read_num = 0
            }
            //转换参数名
            this.userlist.forEach((item, index) => {
              this.$set(item, 'user_name', item.name)
            })
            //获取 当前店铺的聊天记录
            this._newlist()
          } else {
            //测试说 搜索不到就显示空
            this.userlist = []
            console.log('获取店铺列表->', res)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    //获取 当前店铺的聊天记录
    _newlist() {
      let data = {
        // api: 'app.msg.getMessageList',
        api: 'mall.Msg.getMessageList',
        userId: this.currentUserId,
        mchId: this.currentMchId,
        type: this.type,
        access_id: this.pc_user.access_id
      }
      this.$Api
        .doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.arrlist = res.data.list;
            this.arrlist.forEach((v, i) => {
              try {
                v.content = JSON.parse(v.content)
              } catch (error) {
                // 兼容旧数据 字符串
                v.content = { text: v.content }
              }
            })
            console.log('获取当前用户的聊天记录->', res.data.list)
            //客服弹窗显示时 切换店铺显示该店铺最新消息
            this.$nextTick(() => {
              this._scrollTop(".right_message");
            });
          } else {
            console.log("获取当前用户的聊天记录->", res);
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    //发送消息
    _handleChange() {
      if (!this.input_content && !this.img_list) {
        console.log('不能发送空')
      } else {
        let data = {
          // api: 'app.msg.addMessage',
          api: 'mall.Msg.addMessage',
          send_id: this.currentUserId, //发送方id
          receive_id: this.currentMchId, //接收方id
          content: this.input_content ? this.input_content : '', //发送内容
          is_mch_send: this.type, //0用户 1店铺
          img_list: this.img_list, //发送图片传值
          access_id: this.pc_user.access_id
        }
        this.$Api
          .doRequest(data)
          .then(res => {
            if (res.code == 200) {
              //发送出去的消息，显示在记录中
              let newData = {}
              newData.nike_name = this.pc_user.user_name
              newData.img = this.pc_user.headimgurl
              newData.content = this.input_content ? this.input_content : this.img_list
              newData.is_mch_send = this.type
              this.arrlist.push(newData)
              if (this.urlType == 'PHP') {
                //上传服务器
                this.sendSocketMessage(res.data[0]).then()
              } else {
                //调用WebSocket send()发送信息的方法
                //this.socketTask.send(JSON.stringify(newData))
              }
              //初始化输入框
              this.input_content = ''
              this.img_list = ''
              this._newlist();
              document.getElementById('upimg').value = ''
              //聊天内容 自动滚动到底部
              this.$nextTick(() => {
                this._scrollTop('.right_message')
              })
            } else {
              console.log('发送消息->', res)
            }
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      }
    },
    //聊天内容 自动滚动到底部
    _scrollTop(className) {
      setTimeout(() => {
        let leftList = document.querySelector(className)
        let isScrollTop = leftList.scrollHeight
        leftList.scrollTop = isScrollTop
      }, 100)
    },
    //websocket 开始
    //连接
    connectSocket() {
      //当前店铺id 不能为空
      if (this.currentMchId == '' || !this.currentMchId) {
        return
      }

      //websocket请求地址(区分JAVA与PHP)
      let wsurl = ''
      if (this.urlType == 'PHP') {
        wsurl = process.env.VUE_APP_LKT_KEFU_URL
        console.log('websocket请求地址->PHP', wsurl)
      } else {
        let storType = process.env.VUE_APP_STORE_TYPE
        wsurl = process.env.VUE_APP_LKT_KEFU_URL + this.currentUserId + '/' + this.currentUserId + '/' + storType
        console.log('websocket请求地址->JAVA', wsurl)
      }

      let that = this
      //获取websocket 上下文
      this.socketTask = new WebSocket(wsurl)
      console.log('websocket上下文->', this.socketTask)

      //监听WebSocket连接
      this.socketTask.onopen = res => {
        console.log('WebSocket连接已打开！')
        //that.heart()
      }
      //监听WebSocket返回数据
      this.socketTask.onmessage = res => {
        //初始化data
        let data = {}
        data = JSON.parse(res.data)
        console.log('监听到websocket返回数据--》', data)

        //PHP通过此方式传值 用户ID
        if (data.client_key) {
          let storType = process.env.VUE_APP_STORE_TYPE
          let msg = {
            type: 'login',//消息类型
            is_mch_send: '0',//是否店铺发送，用户发送0 店铺发送1
            send_id: that.currentUserId,//发送方id
            client_key: data.client_key,//client_key
            source: storType,//stor_type
          }
          that.sendSocketMessage(msg).then()
        }

        //获取 当前数据的店铺id/发送者id
        if (!that.currentMchId || that.currentMchId == '') {
          if (data.mch_id) {
            that.currentMchId = data.mch_id
          } else if (data.send_id) {
            that.currentMchId = data.send_id
          }
        }

        //如果data.mch_id存在，即有新增用户与我方聊天
        if (data.mch_id) {
          let found = false
          for (var i = 0; i < that.userlist.length; i++) {
            let tmpUserid = that.userlist[i].mch_id
            //如果店铺列表中【存在】当前店铺id，更新当前店铺数据
            if (data.mch_id == tmpUserid) {
              //更新用户数据
              that.userlist[i] = data
              found = true
              break
            }
            //如果当前店铺id == 发送方ID，则标记已读
            if (that.currentMchId == tmpUserid) {
              that.userlist[i].no_read_num = 0
            }
          }
          //如果店铺列表中【不存在】当前店铺id，则新增店铺
          if (!found) {
            that.userlist.push(data)
          }
          //强制更新数组
          that.userlist.splice(0, 0)
        } else {
          //这里加一个防止串台的判断
          setTimeout(() => {
            //如果当前店铺列表只存在一个，获取当前店铺id
            if (that.userlist.length == 1) {
              that.currentMchId = that.userlist[0].mch_id
            }
            //如果当前店铺id == 发送方ID，获取聊天内容
            if (
              that.currentMchId &&
              data.send_id &&
              data.send_id == that.currentMchId
            ) {
              that.arrlist.push(data)
              //聊天内容 自动滚动到底部
              this.$nextTick(() => {
                this._scrollTop('.right_message')
              })
            }
            //如果当前店铺id == 发送方ID，则标记已读
            for (var i = 0; i < that.userlist.length; i++) {
              let tmpUserid = that.userlist[i].mch_id
              if (that.currentMchId == tmpUserid) {
                that.userlist[i].no_read_num = 0
              }
            }
            //强制更新数组
            that.userlist.splice(0, 0)
          }, 100)
        }
        //更新店铺列表
        that.userlist = that.userlist
        //转换参数名
        that.userlist.forEach((item, index) => {
          that.$set(item, 'user_name', item.name)
        })
        //迫使组件实例重新渲染
        that.$forceUpdate()
      }

      this.socketTask.onerror = res => {
        console.log('WebSocket连接打开失败，请检查！', res)
        //进入重新连接
        that.reconnect()
      }

      // 监听连接关闭 -
      this.socketTask.onclose = e => {
        console.log('WebSocket连接关闭！', e)
        //clearInterval(that.timer)
        //that.timer = ''
        //客服弹窗未关闭才执行，已关闭不需要提示
        if (this.isKeFuShow) {
          this.$message.success(this.$t('homedetail.csjwtq'));
          setTimeout(() => {
            //关闭客服弹窗
            this.isKeFuShow = false
          }, 3000)
        }
      }
    },
    //进入重新连接
    reconnect() {
      console.log('进入断线重连...')
      this.socketTask = null
      if (this.currentMchId) {
        this.connectSocket(this.currentMchId)
      }
    },
    //发送消息
    sendSocketMessage(msg) {
      let that = this
      msg = JSON.stringify(msg)
      console.log('发送消息-->msg', msg);
      return new Promise((reslove, reject) => {
        that.socketTask.send(msg);
      })
    },
    //心跳
    heart() {
      clearInterval(this.timer);
      let that = this;
      this.timer = '';
      let msg = {
        "type": "heartbeat",
      }
      this.timer = setInterval(() => {
        that.sendSocketMessage(msg).then()
      }, 55000)
    },
    //websocket 结束
    /**
     * 客服结束
     */
    changeVideoStatus() {
      const video = this.$refs.video
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    changeVideoStatus2() {
      const video = this.$refs.video2
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    pointBtn(item) {
      if (item.point == '立即领取' || item.point == '领取') {
        var data = {
          api: 'plugin.coupon.MallCoupon.receive',

          id: item.id // 活动id
        }

        this.$Api
          .doRequest(data)
          .then(res => {
            if (res.code == 200) {
              this.$message.success(this.$t('homedetail.Tips[0]'))
            }
            this.lqClick()
          })
          .catch(error => {
            this.$message.error(error.message)
          })
      } else if (item.point == '立即使用') {
        this.$router.push({
          path: '/mch/mch',
          query: {
            id: mch_id
          }
        })
      }
    },
    openClick() {
      this.lqClick()
      this.lqFlag = true
    },
    toUrl(url) {
      this.$router.push({
        path: url
      })
    },
    lqClick() {
      let data = {
        api: 'plugin.coupon.MallCoupon.proCoupon',

        goodsId: this.pro_id // 商品ID
      }

      this.$Api
        .doRequest(data)
        .then(res => {
          this.coupon_list = res.data.list
          this.getCouStr()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    getCouStr() {
      var data = {
        api: 'mall.Product.index',

        pro_id: this.pro_id, // 商品ID
        vipSource: this.vipSource
      }
      this.$Api.doRequest(data).then(res => {
        this.coupon_str = res.data.coupon_str
      })
    },
    seeImg(e) {
      if (this.video != '' && this.checkImageI == 0) {
        return
      }
      let x = e.pageX - $('.imgbox').offset().left
      let y = e.pageY - $('.imgbox').offset().top

      let left, top

      if (x < 100) {
        left = 0
      } else if (x > 380) {
        left = 280
      } else {
        left = x - 100
      }

      if (y < 100) {
        top = 0
      } else if (y > 380) {
        top = 280
      } else {
        top = y - 100
      }

      this.sliderTop = top
      this.sliderLeft = left

      if (-2 * top < -480) {
        this.sliderTop1 = -480
      } else {
        this.sliderTop1 = -2 * top
      }

      if (-2 * left < -480) {
        this.sliderLeft1 = -480
      } else {
        this.sliderLeft1 = -2 * left
      }
    },
    shareCode() {
      this.shareFlag = true
      // setTimeout(() => {
      //   var qrcode = new QRCode(document.getElementById('qrcode'), {
      //     width: 150,
      //     height: 150
      //   })

      //   let url =
      //     process.env.VUE_APP_LKT_H5_DEFURL +
      //     'pages/goods/goodsDetailed?productId=' +
      //     this.pro_id

      //   qrcode.makeCode(url)
      // }, 10)
    },
    /*
         ——————sku核心算法 开始——————
     */
    powerset(arr) {
      let ps = [
        []
      ]
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0, len = ps.length; j < len; j++) {
          ps.push(ps[j].concat(arr[i]))
        }
      }

      return ps
    },

    /**
     * 初始化数据
     * @return
     */
    initData(isCart) {
      this.result = {}
      this.keys = this.getAllKeys() //arrKeys["颜色", "尺码", "型号"]

      for (let i = 0; i < this.keys.length; i++) {
        this.highKeys[this.keys[i]] = false //所有的都为false
      }

      this.sku_list = this.combineAttr(this.skuBeanList, this.keys)
      this.buildResult(this.sku_list.items)
      this.updateStatus(this.getSelectedItem(), true)

      // 初始筛选出库存为0的属性
      let filterObj = {}
      for (let i in this.result) {
        if (!i.includes(',') && this.result[i].skus.Stock == 0) {
          filterObj[i] = this.result[i]
        }
      }

      for (let i in this.sku_list.result) {
        for (let k in this.sku_list.result[i]) {
          for (let j in filterObj) {
            if (k == j) {
              this.sku_list.result[i][k].disabled = true
            }
          }
        }
      }

      // 筛选结束

      if (
        !this.sku_list.result['undefined'] &&
        this.haveSkuBean == '' &&
        !isCart
      ) {
        let price = 0
        let sku = ''
        for (let i = 0; i < this.sku_list.items.length; i++) {
          let stock = Number(this.sku_list.items[i].Stock)

          if (stock > 0 && price == 0) {
            price = Number(this.sku_list.items[i].price)
            sku = this.sku_list.items[i]
          } else if (
            stock > 0 &&
            price > Number(this.sku_list.items[i].price)
          ) {
            price = Number(this.sku_list.items[i].price)
            sku = this.sku_list.items[i]
          }
        }

        if (sku != '') {
          this.initSeleted(sku.sku)
        }
      }

      this.showResult()
    },

    /**
     * 正常属性点击
     */
    handleNormalClick(key, value) {
      let list = JSON.parse(JSON.stringify(this.sku_list))

      for (let i in list.result[key]) {
        if (i != value.name) {
          list.result[key][i].active = false
        } else {
          list.result[key][i].active = true
        }
      }

      this.sku_list = list
    },

    /**
     * 无效属性点击
     */
    handleDisableClick(key, value) {
      this.sku_list.result[key][value.name]['disabled'] = false
      // 清空高亮行的已选属性状态（因为更新的时候默认会跳过已选状态）
      for (let i in this.sku_list.result) {
        if (i != key) {
          for (let x in this.sku_list.result[i]) {
            this.sku_list.result[i][x].active = false
          }
        }
      }

      this.updateStatus(this.getSelectedItem())
    },

    /**
     * 高亮行
     */
    highAttributes: function () {
      for (let key in this.sku_list.result) {
        this.highKeys[key] = true
        for (let attr in this.sku_list.result[key]) {
          if (this.sku_list.result[key][attr].active === true) {
            this.highKeys[key] = false
            break
          }
        }
      }
    },

    /**
     * 点击事件处理
     * @param  key   点击的行
     * @param  value 点击的按钮的数据
     */
    handleActive: function (key, value) {
      if (this.haveSkuBean) {
        if (value.disabled === true) {
          uni.showToast({
            title: this.$t('homedetail.Tips[1]'),
            icon: 'none'
          })
          return
        }

        if (value.active == true) {
          return false
        }

        this.handleNormalClick(key, value)
        if (value.disabled === true) {
          this.handleDisableClick(key, value)
        }
        this.updateStatus(this.getSelectedItem())
        this.highAttributes()
        this.showResult()
      }
    },

    /**
     * 计算属性
     * @param  {[type]} data [description]
     * @param  {[type]} keys [description]
     * @return {[type]}      [description]
     */
    combineAttr(data, keys) {
      let allKeys = []
      let result = {}

      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let values = []

        for (let j = 0; j < keys.length; j++) {
          let key = keys[j]
          if (!result[key]) {
            result[key] = {}
          }

          if (!result[key][item[key]]) {
            if (i == 0) {
              result[key][item[key]] = {
                name: item[key],
                active: false,
                disabled: item['Stock'] > 0 ? false : true
              }
            } else {
              result[key][item[key]] = {
                name: item[key],
                active: false,
                disabled: item['Stock'] > 0 ? false : true
              }
            }
          }

          values.push(item[key])
        }

        allKeys.push({
          path: values.join(this.spliter),
          sku: item['SkuID'],
          price: item['Price'],
          Pic: item['Pic'],
          Stock: item['Stock']
        })
      }

      return {
        result: result,
        items: allKeys
      }
    },

    isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    },

    /**
     * 获取所有属性
     * @return {[type]} [description]
     */
    getAllKeys() {
      let arrKeys = []
      for (let attribute in this.skuBeanList[0]) {
        if (!this.skuBeanList[0].hasOwnProperty(attribute)) {
          continue
        }

        if (
          attribute !== this.skuName &&
          attribute !== this.skuName1 &&
          attribute !== this.skuName2 &&
          attribute !== this.skuName3
        ) {
          arrKeys.push(attribute)
        }
      }

      if (arrKeys.length == 0) {
        arrKeys = ['undefined']
        this.skuBeanList[0]['undefined'] = 'undefined'
      }
      return arrKeys
    },

    getAttruites(arr) {
      let result = []
      for (let i = 0; i < arr.length; i++) {
        result.push(arr[i].path)
      }

      return result
    },

    /**
     * 生成所有子集是否可选、库存状态 map
     */
    buildResult(items) {
      let allKeys = this.getAttruites(items)

      let attr = {}
      //价格 , 库存, 图片 赋值
      for (let i = 0; i < allKeys.length; i++) {
        let curr = allKeys[i]
        let sku = items[i].sku
        let Pic = items[i].Pic
        let price = items[i].price
        let Stock = items[i].Stock
        let values = curr.split(this.spliter)
        let allSets = this.powerset(values)

        // 每个组合的子集
        for (let j = 0; j < allSets.length; j++) {
          let set = allSets[j]
          let key = set.join(this.spliter)
          if (key && !this.result[key]) {
            this.result[key] = {
              skus: {
                sku,
                Pic,
                price,
                Stock
              }
            }

            if (
              (!key.includes(',') && !attr[key]) ||
              (key.includes(',') &&
                key.split(',').length < allKeys[i].split(',').length)
            ) {
              attr[key] = {
                skus: {
                  sku,
                  Pic,
                  price,
                  Stock
                }
              }
            }
          }
        }
      }

      for (let i in attr) {
        attr[i].skus.Stock = 0
        for (let k in this.result) {
          if (
            i != k &&
            k.split(',').length == allKeys[0].split(',').length &&
            k.includes(i)
          ) {
            attr[i].skus.Stock += Number(this.result[k].skus.Stock)
          } else if (k.split(',').length == allKeys[0].split(',').length) {
            let flag = []

            k.split(',').filter(item => {
              i.split(',').filter(it => {
                if (item == it) {
                  flag.push(true)
                }
              })
            })

            if (flag.length == i.split(',').length) {
              attr[i].skus.Stock += Number(this.result[k].skus.Stock)
            }
          }
        }
      }

      Object.assign(this.result, attr)
    },

    /**
     * 获取选中的信息
     * @return Array
     */
    getSelectedItem() {
      console.log('this.sku_list.result', this.sku_list.result);

      let result = []
      for (let attr in this.sku_list.result) {
        let attributeName = ''
        for (let attribute in this.sku_list.result[attr]) {
          if (this.sku_list.result[attr][attribute].active === true) {
            attributeName = attribute
          }
        }
        if (attributeName.length > 0) {
          result.push(attributeName)
        }
      }

      return result
    },

    /**
     * 更新所有属性状态
     */
    updateStatus(selected, type) {
      for (let i = 0; i < this.keys.length; i++) {
        let key = this.keys[i],
          data = this.sku_list.result[key],
          hasActive = !!selected[i],
          copy = selected.slice()

        for (let j in data) {
          let item = data[j]['name']
          if (selected[i] == item) {
            continue
          }

          copy[i] = item
          let curr = this.trimSpliter(copy.join(this.spliter), this.spliter)

          if (type) {
            this.sku_list.result[key][j]['disabled'] = this.result[curr] ?
              false :
              true
          } else {
            this.sku_list.result[key][j]['disabled'] =
              this.result[curr].skus.Stock > 0 ? false : true
          }
        }
      }
    },

    trimSpliter(str, spliter) {
      let reLeft = new RegExp('^' + spliter + '+', 'g')
      let reRight = new RegExp(spliter + '+$', 'g')
      let reSpliter = new RegExp(spliter + '+', 'g')
      return str
        .replace(reLeft, '')
        .replace(reRight, '')
        .replace(reSpliter, spliter)
    },

    /**
     * 初始化选中
     * @param  mixed|Int|String SkuID 需要选中的SkuID
     * @return {[type]}       [description]
     */
    initSeleted(a) {
      for (let i in this.skuBeanList) {
        if (this.skuBeanList[i][this.skuName] == a) {
          for (let x in this.skuBeanList[i]) {
            if (
              x !== this.skuName &&
              x !== this.skuName1 &&
              x !== this.skuName2 &&
              x !== this.skuName3
            ) {
              this.sku_list.result[x][this.skuBeanList[i][x]].active = true
            }
          }
          break
        }
      }

      this.updateStatus(this.getSelectedItem())
      this.highAttributes()
      this.showResult()
    },

    /**
     * 显示选中的信息
     * @return
     */
    showResult() {
      //
      let result = this.getSelectedItem()
      let s = []
      for (let i = 0; i < result.length; i++) {
        let item = result[i]
        if (!!item) {
          s.push(item)
        }
      }

      if (s.length > 0) {
        this.count = this.result[s.join(this.spliter)].skus.Stock
      }

      if (s.length == this.keys.length) {
        let curr = this.result[s.join(this.spliter)]
        if (curr) {
          this.SkuID = curr.skus.sku
          this.Pic = curr.skus.Pic
          this.price = curr.skus.price
          this.count = Number(curr.skus.Stock)

          if (Number(this.num) > Number(this.count)) {
            this.num = Number(this.count)
          }
        }
        ++this.jsNum
        if (this.jsNum > 2) {
          this.checkImageI = -1
        }
        this.haveSkuBean = {
          name: s.join(this.spliter),
          cid: curr.skus.sku,
          skus: curr.skus
        }
      } else {
        this.haveSkuBean = ''
      }
    },
    /*
         ——————sku核心算法 结束——————
    */

    /*
      收藏
     */
    collection(type) {
      var data = {
        // module: 'app_pc',
        // action: 'addFavorites',
        // m: 'index',
        api: 'mall.AddFavorites.index',

        pro_id: this.pro_id, // 商品ID
        type: 1
      }

      if (type == 1) {
        //data.m = 'removeFavorites'
        data.api = 'mall.AddFavorites.removeFavorites'
        data.collection = this.collection_id
      }
      // let re = this.getSelectedItem();
      this.$Api
        .doRequest(data)
        .then(res => {
          if (res.code == '200') {
            // this.$message.success(res.message)
            if (type == 1) {
              this.$message.success(this.$t('mch.qxsc'))
              this.collection_status = 0
            } else {
              this.$message.success(this.$t('mch.sccg'))
              this.collection_status = 1
            }

            this.getData()
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },

    getData() {
      var data = {
        api: 'mall.Product.index',

        pro_id: this.pro_id // 商品ID
      }

      this.$Api.doRequest(data).then(res => {
        this.pc_user.access_id = res.data.access_id
        this.$cookies.set('pc_user', this.pc_user)
        if (res.data.coupon_status) {
          this.coupon_str = res.data.coupon_str
        }

        this.skuBeanList = res.data.attribute_list
        this.proVideo = res.data.pro.proVideo
        this.video = res.data.pro.video
        this.shop_list = res.data.shop_list
        this.related_recommendations = res.data.related_recommendations
        res.data.pro.price = res.data.pro.price + ''
        // if (res.data.pro.price && res.data.pro.price.includes('-')) {
        //   res.data.pro.price = getData
        //   Number(res.data.pro.price.split('-')[0]).toFixed(2) +
        //     '-' +
        //     Number(res.data.pro.price.split('-')[1]).toFixed(2)
        // } else {
        //   res.data.pro.price = Number(res.data.pro.price).toFixed(2)
        // }

        // if (res.data.pro.s_type && res.data.pro.s_type.includes(1)) {
        //   this.xp = this.$t('homedetail.Tips[5]')
        // }
        // if (res.data.pro.s_type && res.data.pro.s_type.includes(2)) {
        //   this.rx = this.$t('homedetail.Tips[6]')
        // }
        // if (res.data.pro.s_type && res.data.pro.s_type.includes(3)) {
        //   this.tj = this.$t('homedetail.Tips[7]')
        // }


        document.title = res.data.pro.name

        res.data.pro.content = res.data.pro.content
          .replace(
            /src/g,
            "style='max-width:100%!important;height: auto!important;' src"
          )
          .replace(/<table/g, `<table style="width:100%!important;"`)

        if (res.data.pro.img_arr.length > 5) {
          res.data.pro.img_arr.length = 5
        }
        this.pro_detail = res.data.pro

        // this.price = res.data.pro.price

        this.comments_num = res.data.commentsTotal

        this.collection_status = res.data.collection_status
        this.collection_id = res.data.collection_id

        if (this.pagination_total === undefined) {
          this.pagination_total = res.data.commentsTotal
        }
        this.iShow = false
      })
    },
    tabChange(row, index) {
      this.tabIndex = index
      this.proContent = row.content
      const ul = document.querySelector('.d-main-left-title')
      let isMouseDown = false
      ul.addEventListener('mousedown', e => {
        isMouseDown = true
      })
      ul.addEventListener('mousemove', e => {
        if (isMouseDown) {
          ul.scrollBy(-e.movementX, 0)
        }
      })
      ul.addEventListener('mouseup', e => {
        isMouseDown = false
      })
    },
    /*
      跳转商品详情
     */
    toDetail(id) {
      this.$router.push({
        path: '/homedetail/homedetail',
        query: {
          id: id
        }
      })
    },
    toEva(id, item, pro_id, replyNum) {
      this.$router.push({
        path: '/homedetail/evaluationdetails',
        query: {
          ClassName: '',
          id: id,
          CommentType: item,
          store_id: pro_id,
          replyNum: replyNum
        }
      })
    },
    /*
      立即购买
     */
    toBuy() {
      if (this.sku_list.result['undefined']) {
        this.haveSkuBean = {
          cid: this.sku_list.items[0].sku,
          skus: this.sku_list.items[0]
        }
      }

      if (!this.haveSkuBean) {
        this.$message.error(this.$t('homedetail.Tips[2]'))
        return
      }

      var product = []
      product.push({
        pid: this.pro_id
      })
      product.push({
        cid: this.haveSkuBean.cid
      })
      product.push({
        num: this.num
      })
      product = JSON.stringify(product)
      var encodeData = window.btoa(product) //编码
      var data = {
        api: 'mall.Product.immediatelyCart',

        product
      }

      this.$Api
        .doRequest(data)
        .then(res => {
          if (res.code == '200') {
            this.$router.push({
              path: '/pay/payDetails',
              query: {
                product: encodeData,
                vipSource: this.vipSource
              }
            })
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
      加入购物车
     */
    addCard() {
      if (this.sku_list.result['undefined']) {
        this.haveSkuBean = {
          cid: this.sku_list.items[0].sku,
          skus: this.sku_list.items[0]
        }
      }

      if (!this.haveSkuBean) {
        this.$message.error(this.$t('homedetail.Tips[2]'))
        return
      }

      var data = {
        api: 'mall.Product.addCart',

        pro_id: this.pro_id, // 商品ID
        num: this.num, // 数量
        attribute_id: this.haveSkuBean.cid // 属性ID
      }

      this.$Api
        .doRequest(data)
        .then(res => {
          if (res.code == '200') {
            this.pc_user.access_id = res.data.access_id
            this.$cookies.set('pc_user', this.pc_user)
            this.$message.success(this.$t('homedetail.Tips[3]'))
            this.$root.$emit('shoppingCart')
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    /*
      翻页
     */
    changePage(page) {
      page = page - 1
      if (page == 0) {
        this.getcomment()
        return
      }

      var data = {
        api: 'mall.Product.loadGetcomment',

        pid: this.pro_id, // 商品ID
        type: this.commentType, // 0.全部 1.有图 2.有追评
        page // 加载次数
      }

      this.$Api.doRequest(data).then(res => {
        res.data.list &&
          res.data.list.filter(item => {
            item.CommentType = Number(item.CommentType)
          })

        this.comments_list = res.data.list
      })
    },
    getcomment() {
      var data = {
        api: 'mall.Product.getcomment',

        pid: this.pro_id, // 商品ID
        type: this.commentType == 1 ?
          4 :
          this.commentType == 2 ?
            5 :
            this.commentType
      }

      this.$Api.doRequest(data).then(res => {
        this.comments_image = res.data.comments_image
        this.comments_zhui = res.data.comments_zhui

        res.data.commentsList &&
          res.data.commentsList.filter(item => {
            item.CommentType = Number(item.CommentType)
          })

        this.comments_list = res.data.commentsList
      })
    },
    imgBtnClick(type) {
      if (type == 0 && this.checkImageI > 0) {
        this.checkImageI--
      } else if (
        type == 1 &&
        this.checkImageI < this.pro_detail.img_arr.length - 1
      ) {
        this.checkImageI++
      }
    },

    goMch(id) {
      this.$router.push({
        path: '/mch/mch',
        query: {
          id: id
        }
      })
    },

    getApi() {
      var data = {
        // module: 'app_pc',
        // action: 'product',
        // m: 'index',
        api: 'mall.Product.index',

        pro_id: this.pro_id, // 商品ID
        vipSource: this.vipSource
      }

      this.$Api
        .doRequest(data)
        .then(res => {
          this.pc_user.access_id = res.data.access_id
          this.$cookies.set('pc_user', this.pc_user)
          if (res.data.coupon_status) {
            this.coupon_str = res.data.coupon_str
          }
          this.skuBeanList = res.data.attribute_list
          this.kep = this.skuBeanList?.[0].vipPrice ?? false
          this.vipPrice = this.skuBeanList[0]?.vipPrice ?? ''

          this.shop_list = res.data.shop_list
          this.related_recommendations = res.data.related_recommendations
          // if (res.data.pro.price) {
          //   res.data.pro.price = res.data.pro.price + ''
          //   if (res.data.pro.price && res.data.pro.price.includes('-')) {
          //     res.data.pro.price =
          //       Number(res.data.pro.price.split('-')[0]).toFixed(2) +
          //       '-' +
          //       Number(res.data.pro.price.split('-')[1]).toFixed(2)
          //   } else {
          //     res.data.pro.price = Number(res.data.pro.price).toFixed(2)
          //   }
          // }

          if (res.data.pro.s_type && res.data.pro.s_type.includes(1)) {
            this.xp = this.$t('homedetail.Tips[5]')
          }
          if (res.data.pro.s_type && res.data.pro.s_type.includes(2)) {
            this.rx = this.$t('homedetail.Tips[6]')
          }
          if (res.data.pro.s_type && res.data.pro.s_type.includes(3)) {
            this.tj = this.$t('homedetail.Tips[7]')
          }

          document.title = res.data.pro.name
          // 页面图标
          setTimeout(() => {
            let links = $('link')
            let mchCoupon = this.$storage.get('mchCoupon')
            for (let i = 0; i < links.length; i++) {
              let link = $(links[i])
              let rel = link[0].rel
              rel = rel.toLowerCase()
              if (rel.indexOf('icon') > -1) {
                link[0].href =
                  mchCoupon && mchCoupon ? mchCoupon.mallIcon : '/favicon.ico'
                break
              }
            }
          }, 100)

          res.data.pro.content = res.data.pro.content
            .replace(
              /src/g,
              "style='max-width:100%!important;height: auto!important;' src"
            )
            .replace(/<table/g, `<table style="width:100%!important;"`)

          if (res.data.pro.img_arr.length > 5) {
            res.data.pro.img_arr.length = 5
          }
          this.pro_detail = res.data.pro
          this.pro_conten = JSON.parse(res.data.pro.content)
          if (this.pro_conten.length > 0) {
            this.proContent = this.pro_conten[0].content
          } else {
            this.pro_conten = [{
              name: this.$t('homedetail.spjs'),
              content: this.$t('homedetail.zwspjs')
            }]
            this.proContent = this.$t('homedetail.zwspjs')
          }
          this.video = res.data.pro.video
          this.proVideo = res.data.pro.proVideo
          // this.price = res.data.pro.price
          this.comments_num = res.data.commentsTotal

          this.collection_status = res.data.collection_status
          this.collection_id = res.data.collection_id

          if (this.pagination_total === undefined) {
            this.pagination_total = res.data.commentsTotal
          }
          this.iShow = false
          this.sharingSettings = res.data.sharingSettings
          this.initData()
        })
        .catch(error => {
          if (error.message == '未知错误') {
            this.isOverdue = true
            this.$message.error(this.$t('homedetail.Tips[4]'))
          }
        })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/homedetail/homedetail.css';
@import '~/assets/css/homedetail/kefu.css';
.title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 10px;
}
.goods-info {
  display: flex;
}

.goods-info img {
  width: 70px;
  margin-right: 4px;
}
.goods-info .message div {
  margin-bottom: 5px;
}
.goods-info .price {
  color: #000;
  font-size: 16px;
  font-weight: 800;
}
.controls-but {
  display: flex;
  justify-content: end;
}
.controls-but div {
  cursor: pointer;
  background-color: #fecaca;
  color: #fa5f5f;
  margin: 5px;
  padding: 2px 10px;
  border-radius: 10px;
}
.product {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 130px;
}
.box {
  margin-top: 5px;
}
.img {
  border-radius: 5px;
  width: 70px;
  height: 70px;
}
.information {
  display: flex;
}
.temporarily-info {
  margin-left: 16px;
}
.temporarily-name {
  margin-bottom: 10px;
}
.product-but {
  display: flex;
  justify-content: end;
  margin-top: 12px;
}
.go-buy {
  cursor: pointer;
  background-color: #fecaca;
  color: #fa5f5f;
  margin: 10px;
  padding: 4px 20px;
  border-radius: 20px;
  background: linear-gradient(to right, #eeb12e, #f8574f);
  color: #fff !important;
  margin: 0px !important;
  margin-left: 50px !important;
}
.product-price {
  color: #000;
  font-size: 16px;
  font-weight: 800;
}
</style>

