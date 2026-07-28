<template>
  <div class="order-part" id="app">
    <input type="hidden" name="pageTitle" value="我的订单" />
    <div class="my-title">
      <p>{{ $t('orderdetails.title') }}</p>
    </div>
    <div class="order-details">
      <!-- 订单状态 -->
      <div class="order-condition-wrap" v-if="!loadFlag">
        <div class="order-condition" style="align-items: flex-start">
          <div class="order-condition-disc">
            <img v-if="
                order_detail.status == 3 ||
                order_detail.status == 5 ||
                order_detail.status == 12
              " :src="success" alt="" />
            <img v-else :src="exclamation" alt="" />
            <span>{{ $t('orderdetails.Current')
              }}：{{
                order_detail.status == 0
                  ? $t('orderdetails.state[0]')
                  : order_detail.status == 1
                  ? $t('orderdetails.state[1]')
                  : order_detail.status == 2
                  ? $t('orderdetails.state[2]')
                  : order_detail.status == 3
                  ? $t('orderdetails.state[3]')
                  : order_detail.status == 4
                  ? $t('orderdetails.state[4]')
                  : order_detail.status == 5
                  ? $t('orderdetails.state[5]')
                  : order_detail.status == 6
                  ? $t('orderdetails.state[6]')
                  : order_detail.status == 7
                  ? $t('orderdetails.state[7]')
                  : order_detail.status == 12
                  ? $t('orderdetails.state[8]')
                  : ''
              }}</span>
          </div>
          <div style="" class="order-condition-fp mymarg" v-if="order_detail.status == 7">
            <span v-if="!order_detail.omsg.pay_time">{{$t('orderdetails.qxgbcsgb')}}</span>
            <span v-if="order_detail.omsg.pay_time">{{$t('myorder.byhxq')}}</span>
          </div>
          <p v-if="order_detail.status == 0">
            {{ $t('orderdetails.long[0]')
            }}<span>{{ order_detail.countdown }}</span>{{ $t('orderdetails.long[1]') }}
          </p>

          <p v-if="order_detail.status == 4 || order_detail.status == 6">
            {{
              order_detail.status == 4 &&
              cancelGoods != '审核中' &&
              cancelGoods != '审核通过' &&
              cancelGoods != '退货完成' &&
              cancelGoods != '已退款'
                ? $t('orderdetails.state[13]') + cancelGoodsReason
                : order_detail.status == 6 &&
                  order_detail.list &&
                  order_detail.list[0].re_type == 0 &&
                  order_detail.hand_del == 1
                ? $t('orderdetails.state[14]')
                : order_detail.status == 6 &&
                  order_detail.list &&
                  order_detail.list[0].re_type == 0 &&
                  order_detail.hand_del == 0
                ? $t('orderdetails.state[15]')
                : order_detail.status == 7
                ? $t('orderdetails.state[16]')
                : ''
            }}
          </p>
          <div class="order-condition-btn" v-if="order_detail.status == 0">
            <el-button type="danger" @click="toPayment('/my/my/payment',order_detail.id)">{{ $t('orderdetails.button[0]') }}</el-button>
            <el-button plain @click="orderBtn(order_detail.id, 'mall.Order.removeOrder')">{{ $t('orderdetails.button[1]') }}</el-button>
          </div>
          <div class="order-condition-btn" v-else-if="order_detail.status != 7">
            <el-button v-if="order_detail.status == 1" :disabled="order_detail.delivery_status == 1" type="danger" @click="orderBtn(order_detail.id, 'mall.Order.delivery')">{{ $t('orderdetails.button[2]') }}</el-button>
            <el-button v-else-if="
                order_detail.status == 2 &&
                order_detail.sale_type == 0 &&
                order_detail.self_lifting != 1
              " @click="orderBtn(order_detail.id, 'mall.Order.okOrder')" type="danger">{{ $t('orderdetails.button[3]') }}</el-button>
            <el-button v-else-if="order_detail.status == 5" type="danger" @click="toEvaluation('/my/my/evaluationing',order_detail.sNo,'5')">{{ $t('orderdetails.button[4]') }}</el-button>
          </div>
          <div v-if="isInvoice == false" class="order-condition-fp">
            {{ $t('orderdetails.cspbj') }}
          </div>
        </div>
        <div class="app-code">
          <img :src="app_code" alt="" />
          <div>
            <p>{{ $t('orderdetails.long[2]') }}</p>
            <p>{{ $t('orderdetails.long[3]') }}</p>
            <p>{{ $t('orderdetails.long[4]') }}</p>
          </div>
        </div>
      </div>
      <div class="order-condition-wrap" v-else>
        <div class="order-condition" style="align-items: flex-start">
          <div class="order-condition-disc nonavtitle" style="width: 200px"></div>
          <p class="nonavtitle" style="display: block; width: 300px"></p>

          <div class="order-condition-btn">
            <el-button class="nonavtitle" type="danger" style="border: 0">
            </el-button>
          </div>
        </div>
        <div class="app-code">
          <img class="nonavtitle" src="" alt="" />
          <div>
            <p>{{ $t('orderdetails.long[2]') }}</p>
            <p>
              {{
                mchCoupon && mchCoupon.mallName
                  ? `${mchCoupon.mallName}APP`
                  : $t('orderdetails.long[3]')
              }}
            </p>
            <p>{{ $t('orderdetails.long[4]') }}</p>
          </div>
        </div>
      </div>
      <!-- 订单状态 end -->

      <template v-if="!loadFlag">
        <!-- 物流信息 -->
        <div v-show="
            order_detail.logistics.list.length > 0 &&
            order_detail.status > 0
          " class="information-box" v-for="(items, indexs) of order_detail.logistics.list" :key="indexs">
          <p class="box-title" v-if="indexs == 0">
            {{ $t('orderdetails.logistics[0]') }}
          </p>

          <div class="baoguo-title">
            <img src="~/static/images/baoguo.png" />
            {{ $t('orderdetails.logistics[1]') }}{{ indexs + 1 }}
          </div>

          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.logistics[2]')
            }}</label>
            {{ items.kuaidi_name }}
          </div>
          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.logistics[3]')
            }}</label>
            {{ items.courier_num }}
          </div>

          <div class="box-row" style="display: flex">
            <label class="box-label">{{
              $t('orderdetails.logistics[4]')
            }}</label>
            <div v-if="items.list.length > 0" class="setpsBox" :style="{ height: isMore[indexs] ? '' : '105px' }">
              <ul class="setpsLeft">
                <li v-for="(item, index) of items.list" :key="index">
                  {{ item.ftime }}
                </li>
              </ul>
              <ul class="setpsCenter">
                <li v-for="(item, index) of items.list" :key="index"></li>
              </ul>
              <ul class="setpsRight">
                <li v-for="(item, index) of items.list" :key="index">
                  {{ item.context }}
                </li>
              </ul>
            </div>
            <template v-else> {{ $t('orderdetails.logistics[8]') }}~ </template>
          </div>
          <a v-if="items.list.length > 4" class="xsqb" href="javascript:;" @click="isMoreClick(indexs)">
            <template v-if="isMore[indexs]">
              {{ $t('orderdetails.logistics[5]') }}
              <i class="el-icon-arrow-up"></i>
            </template>
            <template v-else>
              {{ $t('orderdetails.logistics[6]') }}
              <i class="el-icon-arrow-down"></i>
            </template>
          </a>
        </div>
        <!-- 物流信息end -->

        <!-- 收货信息 -->
        <div class="information-box">
          <p class="box-title">{{ $t('orderdetails.Receiving_info[0]') }}</p>
          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.Receiving_info[1]')
            }}</label>
            {{ order_detail.name }}
          </div>
          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.Receiving_info[2]')
            }}</label>
            {{ order_detail.mobile }}
          </div>
          <div class="box-row" v-if="order_detail.self_lifting != 1">
            <label class="box-label">{{
              $t('orderdetails.Receiving_info[3]')
            }}</label>
            {{order_detail.omsg.sheng}}{{order_detail.omsg.shi}}{{order_detail.omsg.xian}} {{ order_detail.address }}
          </div>

          <!-- 是否自提 -->
          <div class="box-row" v-else>
            <label class="box-label">{{
              $t('orderdetails.Receiving_info[4]')
            }}</label>
            {{order_detail.omsg.sheng}}{{order_detail.omsg.shi}}{{order_detail.omsg.xian}} {{ order_detail.address }}
          </div>
        </div>
        <!-- 收货信息end -->
        <!-- 订单信息 -->
        <div class="information-box">
          <p class="box-title">{{ $t('orderdetails.order_info[0]') }}</p>
          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.order_info[1]')
            }}</label>
            {{ order_detail.sNo }}
          </div>
          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.logistics[7]')
            }}</label>
            <p>{{ order_detail.remarks }}</p>

          </div>
          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.order_info[2]')
            }}</label>
            <span class="red">{{order_detail.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(order_detail.old_total,order_detail.exchange_rate) }}</span>
            <span v-if="order_detail && order_detail.omsg.pay">({{
                order_detail.omsg.pay == 'wallet_pay'
                  ? $t('orderdetails.order_info[3]')
                  : order_detail.omsg.pay == 'alipay' ||
                    order_detail.omsg.pay == 'alipay_minipay' ||
                    order_detail.omsg.pay == 'tt_alipay' ||
                    order_detail.omsg.pay == 'pc_alipay'
                  ? $t('orderdetails.order_info[4]')
                  : order_detail.omsg.pay == 'paypal' ? 'PayPal': $t('orderdetails.order_info[5]')
              }})</span>
          </div>
          <div class="box-row">
            <label class="box-label">{{
              $t('orderdetails.order_info[6]')
            }}</label>
            {{ order_detail.add_time }}
          </div>
        </div>
        <!-- 订单信息end -->
      </template>

      <template v-else>
        <div class="information-box">
          <p class="box-title nonavtitle"></p>
          <div class="box-row nonavtitle" style="display: block; width: 200px"></div>
          <div class="box-row nonavtitle" style="display: block; width: 230px"></div>
          <div class="box-row nonavtitle" style="display: block; width: 170px"></div>
        </div>
        <div class="information-box">
          <p class="box-title nonavtitle"></p>
          <div class="box-row nonavtitle" style="display: block; width: 200px"></div>
          <div class="box-row nonavtitle" style="display: block; width: 230px"></div>
          <div class="box-row nonavtitle" style="display: block; width: 170px"></div>
        </div>
      </template>

      <!-- 商品信息 -->
      <div class="goods-detail">
        <!-- 商品信息头部 -->
        <div class="select-head" style="padding: 0; background-color: transparent; margin: 0">
          <el-row v-if="
              order_detail.status == 1 ||
              order_detail.status == 2 ||
              order_detail.status == 3 ||
              order_detail.status == 5 ||
              (order_detail.status == 7&&order_detail.omsg.pay_time) ||
              order_detail.status == 12
            ">

            <el-col :span="12">
              <div class="grid-content">{{ $t('orderdetails.th[0]') }}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">{{ $t('orderdetails.th[1]') }}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">{{ $t('orderdetails.th[2]') }}</div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">{{ $t('orderdetails.th[3]') }}</div>
            </el-col>
          </el-row>

          <el-row v-else>
            <el-col :span="14">
              <div class="grid-content">{{ $t('orderdetails.th[0]') }}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content">{{ $t('orderdetails.th[1]') }}</div>
            </el-col>
            <el-col :span="5">
              <div class="grid-content">{{ $t('orderdetails.th[2]') }}</div>
            </el-col>
          </el-row>
        </div>
        <!-- 商品信息头部end -->
        <!-- 店铺订单信息 -->
        <div v-if="!loadFlag">
          <!-- 店铺名称 -->
          <!-- <div class="store-title">
					<p>{{$t('orderdetails.shop[0]')}}{{order_detail.mch_name}}</p>
				</div> -->
          <!-- 订单店铺商品 -->

          <div v-if="
              order_detail.status == 1 ||
              order_detail.status == 2 ||
              order_detail.status == 3 ||
              order_detail.status == 5 ||
              (order_detail.status == 7&&order_detail.omsg.pay_time) ||
              order_detail.status == 12
            " class="store-cart-goods">

            <!-- 订单单条商品 -->
            <template v-for="(item, index) of order_detail.list">
              <!-- <el-row :key="item.id" v-if="item.baoguo_name">
                <el-col :span="24">
                  <div class="goods_kuaidi">
                    {{ item.baoguo_name }}
                    <span>{{ item.kuaidi_name }}&nbsp;&nbsp;&nbsp;&nbsp;{{$t('orderdetails.shop[1]')}}:{{ item.courier_num }}</span>
                  </div>
                </el-col>
              </el-row> -->
              <el-row :key="item.id">
                <el-col :span="24">
                  <div class="goods_kuaidi" style="background:#f6f6f6">
                    {{ item.shop_name }}
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="grid-content1 goodDetail" style="justify-content: flex-start">
                    <el-image class="good-img" :src="item.imgurl" :preview-src-list="[item.imgurl]">
                      <div slot="error">
                        <img class="good-img" style="margin-left: 0;" :src="ErrorImg"></img>
                      </div>
                    </el-image>
                    <div>
                      <p>{{ $t('orderdetails.shop[2]') }}{{ item.p_name }}</p>
                      <span>{{ item.size }}</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="unit grid-content1 priceBox">
                    {{order_detail.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(item.p_price,order_detail.exchange_rate) }}

                    <div v-if="order_detail.otype == 'integral'">+</div>
                    <div v-if="order_detail.otype == 'integral'" class="integral" style="color: #020202">
                      <img src="~/static/images/integral_hei.png" alt="" />
                      {{ order_detail.allow }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="grid-content1 lh120">X{{ item.num }}</div>
                </el-col>
                <el-col :span="4">
                  <!-- <div v-if="(order_detail.status!=1 && order_detail.otype=='GM' && order_detail.otype=='FX') || (order_detail.otype=='FX' && order_detail.status==1) || (order_detail.otype=='integral' && item.p_price) || (order_detail.otype=='JP' && order_detail.status!=1) || (order_detail.otype=='GM')">
									111
									<div v-if="((item.r_status!=4&&item.r_type!=9&&item.r_type!=4&&item.r_type!=12) || (item.r_type==12 && item.exchange_status)) && item.s_type == 0 && item.r_status != 7 && self_lifting == 0" class="grid-content1 lh120" style="cursor: pointer;" @click="toUrl('?module=my&action=my&m=order&a=afterSale&type=0&order_id='+item.id)">
										申请售后
									</div>
									<template v-else>
										<div v-if="order_detail.sale_type != 0" class="grid-content1 lh120" style="cursor: pointer;" @click="toUrl('?module=my&action=my&m=afterSale&a=management&r_sNo=' + item.r_sNo) ">
											查看售后
										</div>
										<div v-else class="grid-content1 lh120">

										</div>
									</template>
								</div> -->
                  <!-- 操作 -->
                  <div>
                    <div v-if="item.refund" class="grid-content1 lh120 cz-box" style="cursor: pointer" @click="toAfter('/my/my/afterSale',item.id,'0')">
                      <p class="cz-button">{{ $t('orderdetails.shop[4]') }}</p>

                    </div>
                    <template v-else>
                      <div v-if="item.refundShowBtn" class="grid-content1 lh120 cz-box" style="cursor: pointer" @click="toManagement('/my/my/management',item.r_sNo)">
                        <p class="cz-button"> {{ $t('orderdetails.shop[5]') }}</p>

                      </div>
                      <div v-else class="grid-content1 lh120"></div>
                    </template>
                  </div>

                  <!-- <div class="grid-content1 lh120"></div> -->

                  <!--
								<div v-if="!(item.r_status!=4&&item.r_type!=9&&item.r_type!=4&&item.r_type!=12) && !(item.r_type==12 && item.exchange_status)" @click="toUrl('?module=my&action=my&m=order&a=afterDetails&id='+item.id)" class="grid-content1 lh120" style="cursor: pointer;" :style="{color: item.r_type==4||item.r_type==9||item.r_type==12?'green':''}">
									{{item.re_type==1?'退货退款':item.re_type==2?'退款':'换货'}}
									:
									{{item.r_type==0?'审核中':item.r_type==1?'审核通过':item.r_type==2?'拒绝':item.r_type==3?'已回寄':item.r_type==4?'成功':item.r_type==5?'拒绝':item.r_type==8?'拒绝':item.r_type==9?'成功':item.r_type==10?'拒绝':item.r_type==11?'换货商品已寄出':'成功'}}
								</div>
 -->
                </el-col>
              </el-row>
            </template>
            <!-- 订单单条商品 end -->
          </div>

          <div v-else class="store-cart-goods">
            <!-- 订单单条商品 -->
            <template v-for="(item, index) of order_detail.list">
              <!-- <el-row :key="item.id" v-if="item.baoguo_name">
							<el-col :span="24">
								<div class="goods_kuaidi">
									{{item.baoguo_name}}
									<span>{{item.kuaidi_name}}&nbsp;&nbsp;&nbsp;&nbsp;运单号:{{item.courier_num}}</span>
								</div>
							</el-col>
						</el-row> -->
              <div class="store-title">
                <p>{{ $t('orderdetails.shop[0]') }}{{ item.shop_name }}</p>
              </div>
              <el-row style="
                  margin-bottom: 10px;
                  border-right: 1px solid #e6e6e6;
                  border-left: 1px solid #e6e6e6;
                ">
                <el-col :span="14">
                  <div class="grid-content1 goodDetail" style="justify-content: flex-start">
                    <el-image class="good-img" :src="item.imgurl" :preview-src-list="[item.imgurl]">
                      <div slot="error">
                        <img class="good-img" style="margin-left: 0;" :src="ErrorImg"></img>
                      </div>
                    </el-image>
                    <div>
                      <p>{{ $t('orderdetails.shop[2]') }}{{ item.p_name }}</p>
                      <!-- <p>{{ $t('orderdetails.shop[0]')] }}{{ item.shop_name }}</p> -->
                      <span>{{ item.size }}</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="unit grid-content1 priceBox">
                    {{order_detail.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(item.p_price,order_detail.exchange_rate) }}

                    <div v-if="order_detail.otype == 'integral'">+</div>
                    <div v-if="order_detail.otype == 'integral'" class="integral" style="color: #020202">
                      <img src="~/static/images/integral_hei.png" alt="" />
                      {{ order_detail.allow }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content1 lh120">X{{ item.num }}</div>
                </el-col>
              </el-row>
            </template>
            <!-- 订单单条商品 end -->
          </div>
          <!-- 订单店铺商品 end -->
        </div>
        <div v-else>
          <!-- 店铺名称 -->
          <div class="store-title" style="display: flex; align-items: center">
            <p class="nonavtitle" style="height: 18px"></p>
          </div>
          <!-- 订单店铺商品 -->
          <div class="store-cart-goods">
            <!-- 订单单条商品 -->
            <el-row>
              <el-col :span="14">
                <div class="grid-content1 goodDetail" style="justify-content: flex-start">
                  <img class="good-img nonavtitle" alt="" />
                  <div>
                    <p class="nonavtitle" style="display: block; width: 200px"></p>
                    <span class="nonavtitle"></span>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="unit grid-content1 lh120 center">
                  <span class="nonavtitle" style="height: 18px"></span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content1 lh120 center">
                  <span class="nonavtitle" style="height: 18px"></span>
                </div>
              </el-col>
            </el-row>
            <!-- 订单单条商品 end -->
          </div>
          <!-- 订单店铺商品 end -->
        </div>
        <!-- 店铺订单信息end -->
        <!-- 订单信息尾部 -->
        <div class="order-detail-bottom" v-if="!loadFlag">
          <div class="bottom-row">
            <label class="bottom-label">{{
              $t('orderdetails.order_end[0]')
            }}</label>
            <span :class="{ w_130: order_detail.otype == 'integral' }" style="
                display: inline-flex;
                align-items: center;
                justify-content: flex-end;
              ">
              {{order_detail.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(order_detail.product_total,order_detail.exchange_rate)}}
              <template v-if="order_detail.otype == 'integral'">
                +&nbsp;
                <img src="~/static/images/integral_hei.png" alt="" style="width: 13px; height: 13px; margin-right: 5px" />
                {{ order_detail.allow }}
              </template>
            </span>
          </div>
          <div class="bottom-row">
            <label class="bottom-label">{{
              $t('orderdetails.order_end[1]')
            }}</label>
            <span :class="{ w_130: order_detail.otype == 'integral' }">{{order_detail.currency_symbol}}{{
                $LaiKeCommObject.getPriceWithExchangeRate((order_detail.old_freight
                  ? Number(order_detail.old_freight).toFixed(2)
                  : 0) ,order_detail.exchange_rate) || 0
              }}</span>
          </div>
          <div class="bottom-row" v-if="
              Number(order_detail.coupon_price) > 0 &&
              !order_detail.discount_type
            ">
            <label class="bottom-label">{{ $t('orderdetails.yhq') }}</label>
            <span :class="{ w_130: order_detail.otype == 'integral' }">{{order_detail.currency_symbol}}{{
                $LaiKeCommObject.getPriceWithExchangeRate((order_detail.coupon_price
                  ? Number(order_detail.coupon_price).toFixed(2)
                  : 0),order_detail.exchange_rate)
              }}</span>
          </div>
          <div class="bottom-row" v-if="
              Number(order_detail.coupon_price) > 0 &&
              order_detail.discount_type
            ">
            <label class="bottom-label">{{
              $t('orderdetails.order_end[2]')
            }}</label>
            <span :class="{ w_130: order_detail.otype == 'integral' }">{{order_detail.currency_symbol}}{{
                $LaiKeCommObject.getPriceWithExchangeRate((
                order_detail.coupon_price
                  ? Number(order_detail.coupon_price).toFixed(2)
                  : 0),order_detail.exchange_rate)
              }}</span>
          </div>
          <div class="bottom-row" v-if="order_detail.discount_type">
            <label class="bottom-label">{{ $t('orderdetails.order_end[3]') }}</label>
            <span :class="{ w_130: order_detail.otype == 'integral' }">{{order_detail.currency_symbol}}{{
                $LaiKeCommObject.getPriceWithExchangeRate((
                order_detail.preferential_amount
                  ? Number(order_detail.preferential_amount).toFixed(2)
                  : 0),order_detail.exchange_rate)
              }}</span>
          </div>
          <!-- 会员优惠 -->
          <div class="bottom-row" v-if="Number(order_detail.omsg.grade_fan)">
            <label class="bottom-label">{{ $t('orderdetails.order_end[4]') }}</label>
            <span :class="{w_130: order_detail.otype == 'integral'}">{{order_detail.currency_symbol}}{{$LaiKeCommObject.getPriceWithExchangeRate((order_detail.omsg.grade_fan?Number(order_detail.omsg.grade_fan).toFixed(2):0),order_detail.exchange_rate)}}</span>
          </div>
          <div class="bottom-row">
            <label class="bottom-label" v-if='order_detail.status==0||(order_detail.status==7&&!order_detail.omsg.pay_time)'>{{$t('payment.Amount_payable')}}：</label>
            <label class="bottom-label" v-else>{{
              $t('orderdetails.order_end[5]')
            }}</label>
            <span :class="{ w_130: order_detail.otype == 'integral' }" class="redb">{{order_detail.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(order_detail.old_total,order_detail.exchange_rate) }}</span>
          </div>
        </div>

        <div class="order-detail-bottom" v-else>
          <div class="bottom-row">
            <span class="nonavtitle" style="width: 160px"></span>
          </div>
          <div class="bottom-row">
            <span class="nonavtitle" style="width: 180px"></span>
          </div>
          <div class="bottom-row">
            <span class="nonavtitle" style="width: 200px"></span>
          </div>
          <div class="bottom-row">
            <span class="nonavtitle" style="width: 220px"></span>
          </div>
        </div>

        <div class="order-detail-btn" v-if="order_detail.status == 0">
          <el-button plain @click="orderBtn(order_detail.id, 'mall.Order.removeOrder')">{{
            $t('orderdetails.button[1]')
          }}</el-button>
          <el-button type="danger" @click="toPayment('/my/my/payment',order_detail.id)">{{ $t('orderdetails.button[0]') }}</el-button>
        </div>

        <div class="order-detail-btn" v-else>
          <el-button plain v-if="
              (order_detail.status == 1 ||
                order_detail.status == 2 ||
                order_detail.status == 3 ||
                order_detail.status == 5 ||
                order_detail.status == 12) &&
              order_detail.sale_type != 2 &&
              self_lifting == 0 &&
              order_detail.allRefund == true &&
              order_detail.list.length > 1
            " @click="toAfter('/my/my/afterSale',order_afterSale_id,'1')">{{ $t('orderdetails.button[5]') }}</el-button>

          <el-button v-if="order_detail.status == 1" :disabled="order_detail.delivery_status == 1" type="danger" @click="orderBtn(order_detail.id, 'mall.Order.delivery')">{{ $t('orderdetails.button[2]') }}</el-button>
          <el-button v-else-if="
              order_detail.status == 2 &&
              order_detail.sale_type == 0 &&
              order_detail.self_lifting != 1
            " @click="orderBtn(order_detail.id, 'mall.Order.okOrder')" type="danger">{{ $t('orderdetails.button[3]') }}</el-button>
          <el-button v-else-if="order_detail.status == 5" type="danger" @click="toEvaluation('/my/my/evaluationing',order_detail.sNo,'5')">{{ $t('orderdetails.button[4]') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ app, query }) {
    let pc_user = app.$cookies.get('pc_user')
    let order_id = query.order_id
    return {
      pc_user,
      order_id
    }
  },
  data() {
    return {
      isInvoice: '',
      loadFlag: true,
      ErrorImg: require('/static/images/default_picture.png'),
      app_code: require('/static/images/app_code.png'),
      exclamation: require('/static/images/exclamation.png'),
      success: require('/static/images/success.png'),
      addresssx: '',
      isMore: [], //是否显示全部物流
      order_id: '',
      order_detail: {},

      order_failure: 1,
      self_lifting: 0,
      order_afterSale_id: [],
      mchCoupon: {}
    }
  },
  mounted() {
    this.$emit('pageTitle', '我的订单')
    this.pc_user = this.$cookies.get('pc_user')
    this.pluginStatus = this.$cookies.get('pluginStatus') || {}
    this.getApi()
  },
  methods: {
    orderBtn(order_id, m) {
      var data = {

        api: m,
        order_id
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
    // 待付款倒计时
    getcountdown(time) {
      var time1 = new Date(time).getTime()
      var time2 = new Date().getTime()

      // 剩余毫秒数
      var time3 = (60 * 60 * 1000 * this.order_failure - (time2 - time1)) / 1000

      if (time3 <= 0) {
        // this.getApi ()
        return this.$t('myorder.Tips[0]')
      }

      var h = parseInt(time3 / 3600)
      var sTime = parseInt(time3 % 3600)
      var m = parseInt(sTime / 60)
      var s = parseInt(sTime % 60)

      setTimeout(() => {
        var order_detail = JSON.parse(JSON.stringify(this.order_detail))

        order_detail.countdown = this.getcountdown(order_detail.add_time)

        this.order_detail = order_detail
      }, 1000)

      if (m < 10) {
        m = '0' + m
      }
      if (s < 10) {
        s = '0' + s
      }

      return (
        h +
        this.$t('myorder.Tips[1]') +
        m +
        this.$t('myorder.Tips[2]') +
        s +
        this.$t('myorder.Tips[3]')
      )
    },
    getApi() {
      var data = {

        api: 'mall.Order.orderDetails',

        order_id: this.order_id // 明细id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false
          this.isInvoice = res.data.isInvoice
          if (res.data.status == 0) {
            this.order_failure = res.data.order_failure

            res.data.countdown = this.getcountdown(res.data.add_time)
          }

          let baoguo_n = 1
          let courier_num = ''
          res.data.list.filter(item => {
            if (courier_num != item.courier_num) {
              courier_num = item.courier_num
              item.baoguo_name = this.$t('orderdetails.Tips[0]') + baoguo_n
              baoguo_n++
            }
          })

          this.order_detail = res.data
          console.log('order_detail', this.order_detail)

          this.order_afterSale_id = this.order_detail.list
            .map(item => {
              if (item.refund == true) {
                return item.id
              }
            })
            .join(',')
          // this.order_detail.mch_name = this.order_detail.list[0].shop_name

          this.cancelGoods = res.data.list[0].prompt
          this.cancelGoodsReason =
            res.data.list[0].r_content || this.$t('orderdetails.Tips[1]')
          this.self_lifting = res.data.self_lifting
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    isMoreClick(index) {
      this.isMore.splice(index, 1, !this.isMore[index])
    },
    toPayment(url, order_id) {
      this.$router.push({
        path: url,
        query: { order_id: order_id }
      })
    },
    toAfter(url, order_id, type) {
      this.$router.push({
        path: url,
        query: { order_id: order_id, type: type }
      })
    },
    toEvaluation(url, sNo, type) {
      this.$router.push({
        path: url,
        query: { sNo: sNo, type: type }
      })
    },
    toManagement(url, r_sNo) {
      this.$router.push({
        path: url,
        query: { r_sNo: r_sNo }
      })
    },
  }
}
</script>
<style scoped>
@import '~/assets/css/my/orderDetails.css';
.el-row {
  border-left: 1px solid #f6f6f6;
  border-right: 1px solid #f6f6f6;
}
.mymarg {
  margin-top: 10px;
}
.cz-box {
  /* cursor: pointer; */
  position: relative;
}
.cz-button {
  position: absolute;
  border: 1px solid;
  width: 100px;
  height: 24px;
  color: #fff;
  line-height: 24px;
  background-color: red;
  cursor: pointer;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
