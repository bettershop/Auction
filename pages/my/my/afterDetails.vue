<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="售后管理" />
    <div class="afterSale_title" v-if="activeIndex == 0 || returnInfor.r_type == 15">
      {{ $t('after_details.title') }}
    </div>

    <ul class="steps" v-if="returnInfor.r_type != 15">
      <li
        v-for="(item, index) of stepsList[type]"
        :key="index"
        :class="{ active: activeIndex >= index }"
      >
        <i v-if="index > 0"></i>
        <div>{{ index + 1 }}</div>
        <span
          :style="type == 2 && index == 3 ? 'right: -65px' : ''"
          :class="{ nowrap: index == 3 }"
          :title="item"
          >{{ item }}</span
        >
      </li>
    </ul>
    <template v-if="activeIndex != 0">
      <div class="statusBox">
        <img
          v-if="
            isTijiao ||
            returnInfor.r_type == 1 ||
            returnInfor.r_type == 4 ||
            returnInfor.r_type == 9 ||
            returnInfor.r_type == 12||
            returnInfor.r_type == 15
          "
          src="~/static/images/success.png"
          alt=""
        />
        <img v-else src="~/static/images/exclamation.png" alt="" />

        <div v-if="isTijiao">
          <p class="statusTitle">
            {{
              type == 0
                ? $t('after_details.state[0]')
                : type == 1
                ? $t('after_details.state[1]')
                : $t('after_details.state[2]')
            }}{{ $t('after_details.long[0]') }}
          </p>

          <div class="statusContent">
            <p>{{ $t('after_details.long[1]') }}</p>
          </div>
        </div>

        <div v-else>
          <p class="statusTitle">
            {{
              returnInfor.r_type == 0
                ? $t('after_details.state[3]')
                : returnInfor.r_type == 1
                ? $t('after_details.state[4]')
                : returnInfor.r_type == 2
                ? $t('after_details.state[5]')
                : returnInfor.r_type == 3
                ? $t('after_details.state[6]')
                : returnInfor.r_type == 4
                ? $t('after_details.state[7]')
                : returnInfor.r_type == 5
                ? $t('after_details.state[8]')
                : returnInfor.r_type == 8
                ? $t('after_details.state[5]')
                : returnInfor.r_type == 9
                ? $t('after_details.state[7]')
                : returnInfor.r_type == 10
                ? $t('after_details.state[5]')
                : returnInfor.r_type == 11
                ? $t('after_details.state[9]')
                : returnInfor.r_type == 12
                ? $t('after_details.state[10]')
                : returnInfor.r_type == 15
                ? $t('after_details.state[7]')
                : ''
            }}
          </p>

          <div class="statusContent">
            <p>
              {{ returnInfor.suggestive_language }}
              <template v-if="returnInfor.r_type == 11">
                {{ $t('after_details.logistics[0]')
                }}{{ returnInfor.express_num }}（{{ returnInfor.express }}）
              </template>
            </p>
            <p v-if="returnInfor.r_type == 3">
              {{ $t('after_details.logistics[1]')
              }}{{ returnInfor.express_num }}（{{ returnInfor.express }}）
            </p>
            <p v-if="returnInfor.r_type == 15">
              {{ $t('after_details.logistics[10]')}}
            </p>
            <p
              v-if="
                returnInfor.r_type == 4 ||
                returnInfor.r_type == 9 ||
                returnInfor.r_type == 12||
                returnInfor.r_type == 15
              "
            >
              {{ returnInfor.audit_time }}
            </p>
          </div>

          <a
            v-if="activeIndex == 2 && type != 0"
            class="statusBtn"
            href="javascript:;"
            @click="getKuaidi"
            >{{ $t('after_details.logistics[2]') }}</a
          >
          <a
            v-if="returnInfor.r_type == 11"
            class="statusBtn"
            href="javascript:;"
            @click="shouhuo"
            >{{ $t('after_details.logistics[3]') }}</a
          >
        </div>
      </div>

      <div class="returnInfor">
        <div class="returnInforTitle">
          {{
            type == 0
              ? $t('after_details.state[0]')
              : type == 1
              ? $t('after_details.state[1]')
              : $t('after_details.state[2]')
          }}{{ $t('after_details.long[2]')}}
        </div>

        <ul class="returnInforData">
          <li>
            <div class="returnInforData_left">
              <span >{{
                $t('after_details.order')
              }}</span
              >{{ $t('after_details.number') }}:
            </div>
            <div class="returnInforData_right">{{ returnInfor.sNo }}</div>
          </li>

          <li>
            <div class="returnInforData_left">
              {{ $t('after_details.tiem') }}
            </div>
            <div class="returnInforData_right">{{ returnInfor.re_time }}</div>
          </li>

          <li v-if="type != 2">
            <div class="returnInforData_left">
              {{ $t('after_details.Refund_amount')  }}
            </div>
            <div class="returnInforData_right">
              {{currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(returnInfor.re_apply_money,exchange_rate) }}
            </div>
          </li>

          <li>
            <div class="returnInforData_left" v-if="type != 2">
              {{ $t('after_details.Refund_instructions') }}
            </div>
            <div class="returnInforData_left" v-else>
              {{ $t('after_details.reason') }}
            </div>
            <div
              class="returnInforData_right"
              style="flex: 1; word-break: break-all; overflow: hidden"
            >
              {{ returnInfor.content  }}
            </div>
          </li>

          <li>
            <div class="returnInforData_left">
              {{ $t('after_details.upload') }}
            </div>
            <div class="returnInforData_right">
              <img
                v-for="(item, index) of returnInfor.re_photo"
                :key="index"
                :src="item"
                alt=""
              />
              <img src="" alt="" style="opacity: 0" />
            </div>
          </li>
        </ul>
      </div>
    </template>

    <div class="afterSale_card_title" v-if="activeIndex == 0">
      {{ $t('after_details.long[3]') }}
    </div>

    <table class="afterPro" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th style="position: relative; width: 20px"></th>
          <th style="width: 450px">{{ $t('after_details.th[0]')}}</th>
          <th>{{ $t('after_details.th[1]') }}</th>
          <th>{{ $t('after_details.th[2]') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loadFlag">
          <td></td>
          <td>
            <div class="afterProDiv">
              <img class="nonavtitle" src="" alt="" />
              <div>
                <p class="nonavtitle" style="display: block; width: 290px"></p>
                <span class="nonavtitle"></span>
              </div>
            </div>
          </td>
          <td>
            <span class="nonavtitle"></span>
          </td>
          <td>
            <span class="nonavtitle"></span>
          </td>
        </tr>
        <tr v-for="(item, index) of return_list" :key="index">
          <td></td>
          <td>
            <div class="afterProDiv">
              <el-image
                class="good-img"
                :src="item.image"
                :preview-src-list="[item.image]"
              >
              </el-image>
              <div>
                <p>{{ item.p_name }}</p>
                <span>{{ item.size }}</span>
              </div>
            </div>
          </td>
          <td>{{item.currency_symbol}}{{ $LaiKeCommObject.getPriceWithExchangeRate(item.p_price,item.exchange_rate) }}</td>
          <td>x{{ item.num }}</td>
        </tr>
      </tbody>
    </table>

    <div class="afterSale_card_title" v-if="activeIndex == 0">
      {{ $t('after_details.long[4]') }}
    </div>

    <div class="afterInfor" v-if="activeIndex == 0 && type !== ''">
      <div v-if="type != 2">
        <div class="afterInfor_left">
          <span class="red">*</span>
          {{ $t('after_details.Refund_amount') }}
        </div>

        <div class="afterInfor_right">
          <el-input
            :placeholder="$t('after_details.placeholder[0]')"
            @keyup.native="afterPrice = oninput(afterPrice, 2)"
            v-model="afterPrice"
          ></el-input>
          {{ $t('after_details.long[5]') }} {{ currency_symbol }} <span class="red bold">{{ $LaiKeCommObject.getPriceWithExchangeRate(max_price,exchange_rate)  }}</span
          >）
        </div>
      </div>

      <div v-if="type != 2">
        <div class="afterInfor_left">
          <span class="red">*</span>
          {{ $t('after_details.Refund_instructions') }}
        </div>

        <div class="afterInfor_right">
          <el-input
            maxlength="200"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="$t('after_details.placeholder[1]')"
            v-model="instructions"
          >
          </el-input>
        </div>
      </div>
      <div v-else>
        <div class="afterInfor_left">
          <span class="red">*</span>
          {{ $t('after_details.reason')  }}
        </div>

        <div class="afterInfor_right">
          <el-input
            maxlength="200"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="$t('after_details.placeholder[2]')"
            v-model="instructions"
          >
          </el-input>
        </div>
      </div>

      <div>
        <div class="afterInfor_left">
          {{ $t('after_details.Upload_voucher') }}
        </div>

        <div
          class="afterInfor_right"
          style="flex-direction: column; align-items: flex-start"
        >
          <div style="display: flex; align-items: center">
            <div class="upImage" style="cursor: default" @click="upfileM">
              <img src="~/static/images/uploadImg.png" alt="" />
              {{ $t('after_details.upload') }}

              <template v-for="(item, index) in files">
                <input
                  @click.stop
                  v-if="index < 3"
                  :style="index < files - 1 ? 'display: none' : ''"
                  :key="index"
                  @change="uploadImage"
                  type="file"
                  accept="image/*"
                  name="uploader-input"
                  class="uploader-file"
                />
              </template>
            </div>
            {{ $t('after_details.long[6]') }}
          </div>

          <div style="display: flex; margin-top: 14px">
            <div
              class="upImageBox"
              v-for="(item, index) of imageArr"
              :key="index"
              @click="deletImage(index)"
            >
              <img :src="item" alt="" />
              <a href="javascript:;">{{ $t('common_button[0]') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="afterDetailsBtn" v-if="activeIndex == 0 && !loadFlag">
      <div @click="saveReturn">{{ $t('after_details.Submit') }}</div>
    </div>

    <div v-if="activeIndex != 0" style="height: 30px"></div>

    <!-- 填写物流信息弹窗 -->
    <div class="mask" v-if="logisticsFlag">
      <div class="logistics">
        <div class="mask_title">
          {{ $t('after_details.logistics[4]') }}
          <i class="el-icon-close" @click="logisticsFlag = false"></i>
        </div>

        <ul class="logistics_content">
          <li>
            <div class="logistics_content_left">
              {{ $t('after_details.logistics[5]') }}
            </div>
            <el-select
              class="flex1"
              v-model="kuaidiName"
              filterable
              allow-create
              default-first-option
              :placeholder="$t('after_details.placeholder[3]')"
            >
              <el-option
                v-for="item in kuaidiOptions"
                :key="item.id"
                :label="item.kuaidi_name"
                :value="item.kuaidi_name"
              >
              </el-option>
            </el-select>
          </li>

          <li>
            <div class="logistics_content_left">
              {{ $t('after_details.logistics[6]') }}
            </div>

            <el-input
              class="flex1"
              v-model="kuaidiNumber"
              :placeholder="$t('after_details.placeholder[4]')"
            ></el-input>
          </li>

          <li>
            <div class="logistics_content_left">
                {{ $t('after_details.logistics[7]') }}
            </div>

            <el-input
              class="flex1"
              v-model="contactName"
              :placeholder="$t('after_details.placeholder[5]')"
            ></el-input>
          </li>

          <li>
            <div class="logistics_content_left">
                {{ $t('after_details.logistics[8]') }}
            </div>

            <el-input
              class="flex1"
              maxlength="11"
              v-model="contactTel"
              :placeholder="$t('after_details.placeholder[6]')"
            ></el-input>
          </li>
        </ul>

        <div class="mask_btnBox">
          <a href="javascript:;" @click="logisticsFlag = false">{{$t('cancel')}}</a>
          <a href="javascript:;" @click="saveKuaidi">{{$t('common_button[1]')}}</a>
        </div>
      </div>
    </div>
    <!-- 填写物流信息弹窗结束 -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      loadFlag: true,
      order_details_id: '',
      activeIndex: 0, // 处于第几个步骤，从0开始
      checkAll: '',
      checkArr: [],
      type: '', //0:退款，1:退货退款，2:退换货

      afterPrice: '', //退款金额
      instructions: '', //退款说明

      files: 1,

      imageArr: [],

      stepsList: [
        ['申请退款', '客服审核', '完成退款'],
        ['申请退款', '客服审核', '寄回商品', '商家收货', '完成退款'],
        [
          '申请退款',
          '客服审核',
          '寄回商品',
          '商家收货并寄出换货商品',
          '确认收货',
          '完成退换'
        ]
      ],

      /* 填写快递信息 */
      logisticsFlag: false,
      kuaidiOptions: [],
      kuaidiName: '',
      kuaidiNumber: '',
      contactName: '',
      contactTel: '',

      max_price: '',
      exchange_rate:1,
      currency_symbol:'￥',
      return_list: [],
      isTijiao: false,
      returnInfor: {},
      goodsId: '',
      wlid: '',
      shid:'',
    }
  },
  mounted () {
    this.$emit('pageTitle', '售后管理')
    this.stepsList = this.$t('after_details.stepsList')
    if (this.$route.query.id) {
      this.order_details_id = this.$route.query.id
    }
    if (this.$route.query.goodsId) {
      this.goodsId = this.$route.query.goodsId
    }
    if (this.$route.query.wlid) {
      this.wlid = this.$route.query.wlid
    }
    if (this.$route.query.shid) {
      this.shid = this.$route.query.shid
    }
    this.pc_user = this.$cookies.get('pc_user')
    if (this.$route.query.type) {
      this.type = this.$route.query.type
      this.getApi()
    } else {
      this.getReturnDetail()
    }
  },
  methods: {
    oninput (num) {
      let val = num;
      const maxReturnAmount = this.$LaiKeCommObject.getPriceWithExchangeRate(this.max_price,this.exchange_rate)  ;

      // 保留合法输入（允许小数点后两位）
      val = val
        .replace(/[^\d.]/g, '')         // 只能输入数字和小数点
        .replace(/^0+(?=\d)/, '')       // 去掉整数部分前面的多余0
        .replace(/^\./, '')             // 第一个字符不能是点
        .replace(/\.{2,}/g, '.')        // 不允许多个点
        .replace('.', '#')              // 临时替换第一个点
        .replace(/\./g, '')             // 移除多余的点
        .replace('#', '.')              // 还原第一个点
        .replace(/^(\d+\.?\d{0,2}).*$/, '$1'); // 最多保留2位小数

      if( val > maxReturnAmount) {
        val = maxReturnAmount ;
      } else if( this.amount < 0 ) {
        //todo 报错提示
        val = 0 ;
      }
      return val;
    },
    shouhuo () {
      let data = {
        api:'mall.Order.exchangeReceipt',

        id: this.shid // 售后id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.getReturnDetail()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    saveKuaidi () {
      if (!this.kuaidiName) {
        this.$message.error(this.$t('after_details.Tips[0]'))
        return
      }
      if (!this.kuaidiNumber) {
        this.$message.error(this.$t('after_details.Tips[1]'))
        return
      }
      if (!this.contactName) {
        this.$message.error(this.$t('after_details.Tips[2]'))
        return
      }
      if (!this.contactTel) {
        this.$message.error(this.$t('after_details.Tips[3]'))
        return
      }

      if (this.contactTel.length < 11) {
        this.$message.error(this.$t('after_details.Tips[4]'))
        return
      }

      let rid = this.wlid || this.shid
      if (!rid && this.return_list.length > 0) {
        rid = this.return_list[0].id
      }

      let data = {
        api:'mall.Order.backSend',

        kdcode: this.kuaidiNumber, // 快递单号
        kdname: this.kuaidiName, // 快递名称
        lxdh: this.contactTel, // 寄件人电话
        lxr: this.contactName, // 寄件人
        id: rid // 售后订单id或订单详情id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.logisticsFlag = false
          this.getReturnDetail()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    saveReturn () {

      this.afterPrice = Number(this.afterPrice/this.exchange_rate).toFixed(2);

      if (this.type != 2) {

        if (!this.afterPrice) {
          this.$message.error(this.$t('after_details.Tips[5]'))
          return
        }

        console.log(this.afterPrice)
        console.log(this.max_price)

        if (Number(this.afterPrice) > Number(this.max_price)) {
          this.$message.error(this.$t('after_details.Tips[6]'))
          return
        }

        if (!this.instructions) {
          this.$message.error(this.$t('after_details.Tips[7]'))
          return
        }
      } else {
        if (!this.instructions) {
          this.$message.error(this.$t('after_details.Tips[8]'))
          return
        }
      }

      let data = {
        api:'mall.Order.applyReturnGoods',

        order_details_id: this.order_details_id, // 订单详情id
        refund_amount: this.max_price, // 退货金额
        explain: this.instructions, // 退货原因
        refund_apply_money:
          this.afterPrice == '' ? this.max_price : this.afterPrice, // 用户申请退款金额
        type: this.type == 0 ? '2' : this.type == 1 ? '1' : '3', // 退货类型 1.退货退款 2.仅退款 3.换货
        apply_return_goods: this.imageArr.join(',') // 评论图片
      }
      this.$Api.doRequest(data)
        .then(res => {
          this.$router.push('/my/my/management')
          // this.isTijiao = true
          // history.pushState(null,"",'?module=my&action=my&m=order&a=afterDetails&id='+this.order_details_id)

          // this.getReturnDetail()
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    deletImage (index) {
      this.imageArr.splice(index, 1)

      $('.uploader-file').eq(index).val('')
      $('.upImage').append($('.uploader-file').eq(index))

      this.files--
    },
    upfileM () {
      if (this.files > 3) {
        this.$message.error(this.$t('after_details.Tips[9]'))
      }
    },
    uploadImage (e) {
      this.files += 1
      var fil = e.target.files

      var data = new FormData()
      data.append('file', fil[0])
      data.append('access_id', this.pc_user.access_id)

      this.$upImg(data)
        .then(res => {
          this.imageArr.push(res.data.url)
        })
        .catch(error => [this.$message.error(error.message)])
    },
    getApi () {
      let data = {
        api:'mall.Order.applyReturnGoodsPage',

        order_details_id: this.order_details_id // 订单详情id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false
          this.currency_symbol = res.data.currency_symbol
          this.exchange_rate = res.data.exchange_rate
          this.max_price = Number(res.data.refund_price).toFixed(2)
          this.return_list = res.data.list
        })
        .catch(error => {
          setTimeout(function () {
            window.history.go(-1)
          }, 1000)

          this.$message.error(error.message)
        })
    },
    getKuaidi () {
      let pid = this.goodsId
      if (!pid && this.return_list.length > 0) {
        pid = this.return_list[0].p_id
      }
      let data = {
        api:'mall.Order.getExpress',

        pid: pid // 商品ID
      }

      this.$Api.doRequest(data).then(res => {
        this.kuaidiOptions = res.data.express
        console.log(this.kuaidiOptions);
        this.logisticsFlag = true
      })
    },
    getReturnDetail () {
      let data = {
        api:'mall.Order.returnDetails',

        orderDetailId: this.order_details_id // 订单详情id
      }

      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false

          this.type = res.data.re_type == 1 ? 1 : res.data.re_type == 2 ? 0 : 2

          if (res.data.re_photo) {
            let i = res.data.re_photo.findIndex(item => {
              return item == ''
            })
            if (i >= 0) {
              res.data.re_photo.splice(i, 1)
            }
          }

          this.currency_symbol = res.data.currency_symbol
          this.exchange_rate = res.data.exchange_rate

          this.returnInfor = res.data
          this.return_list = res.data.list

          this.activeIndex = this.typeSwitch(res.data.re_type, res.data.r_type)
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    typeSwitch (re_type, r_type) {
      r_type = Number(r_type)
      switch (r_type) {
        case 0:
          return 1
          break
        case 1:
          return 2
          break
        case 2:
          return 1
          break
        case 3:
          return 3
          break
        case 4:
          return 4
          break
        case 5:
          return 3
          break
        case 8:
          return 1
          break
        case 9:
          return 2
          break
        case 10:
          return 1
          break
        case 11:
          return 4
          break
        case 12:
          return 5
          break
        case 13:
          return 5
          break
        case 14:
          return 5
          break
        case 15:
          return 5
          break
        default:
          return ''
      }
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/afterDetails.css';
::v-deep .mask{
  z-index: 201;
}
</style>
