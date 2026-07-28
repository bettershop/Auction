<template>
  <div v-if="isKeFuShow">
    <div class="kefu">
      <div class="pageBox" @click="isKeFuShow = !isKeFuShow">
        <div class="pageBox_kf" @click.stop>
          <!-- 店铺列表 -->
          <div class="kf_left" @click="showBQ = false">
            <div class="left_title">{{$t('xxlb')}}</div>
            <div class="left_input">
              <img :src="searchImg" />
              <input type="text" :placeholder="$t('sszjlxr')" v-model="mchName" />
            </div>
            <div class="left_list">
              <template v-for="(item, index) in userlist">
                <div class="list_item" :class="{ list_item_active: isActive == index }" :key="index" @click="_getKF(item, index)">
                  <div class="item_img"><img :src="item.headimgurl" /></div>
                  <div class="item_content">
                    <div class="content_title">{{ item.name }}</div>
                  </div>
                  <div class="item_end">
                    <div class="end_time">{{ item.addTime }}</div>
                    <div class="end_num" v-if="item.no_read_num > 0">
                      <span>{{ item.no_read_num <= 99 ? item.no_read_num : '+99' }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <!-- 聊天信息框 -->
          <div class="kf_right" @click="showBQ = false">
            <div class="right_title">
              <div class="title_name">
                <template v-if="userlist.length">{{ userlist[isActive].user_name }}</template>
              </div>
              <div class="title_del">
                <i class="el-icon-close" @click="isKeFuShow = false;$emit('close')"></i>
              </div>
            </div>
            <div class="right_message">
              <template v-for="(item, index) in arrlist">
                <div class="message_mch" v-if="item.is_mch_send" :key="index">
                  <div class="mch_content ">
                    <div class="kefu_content_img" v-if="item.content && item.content.text && (item.content.text.startsWith('http://') || item.content.text.startsWith('https://'))">
                      <a :href="item.content.text" target="_blank"><img :src="item.content.text" alt="点击查看大图" /></a>
                    </div>
                    <div class="kefu_content_text" v-else>{{ item.content.text }}</div>
                  </div>
                </div>
                <div class="message_user" v-if="item.is_mch_send == 0" :key="index">
                  <div class="user_content">
                    <div class="kefu_content_img" v-if="item.content && item.content.text && (item.content.text.startsWith('http://') || item.content.text.startsWith('https://'))">
                      <a :href="item.content.text" target="_blank"><img :src="item.content.text" alt="点击查看大图" /></a>
                    </div>
                    <div class="kefu_content_text" v-else>{{ item.content.text }}</div>
<!--                    <div v-else-if="item.content.order&&item.content.order.orderId">
                      <div>
                        <div class="title">我要咨询这件商品</div>
                        <div class="goods-info">
                          <div><img :src="item.content.order.imgUrl " @error="handleErrorImg" /></div>
                          <div class="message">
                            <div class="product">{{ item.content.order.orderName }}</div>
                            <div class="price">&yen;{{ Number(item.content.order.price ||0).toFixed(2) }}</div>
                            <div> 共{{ item.content.order.num }}件商品</div>
                          </div>
                        </div>
                        <div class="product box">订单编号 {{ item.content.order.orderNo }}</div>
                        <div class="box">创建时间 {{ item.content.order.addTime }}</div>
                        <div class="controls-but">
                          <div @click="emitToUrl(`/my/my/orderDetails?order_id=${item.content.order?.orderId}`)">查看订单</div>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.content.pro && item.content.pro.product_title ">
                      <div>
                        <div class="product-goods-info">
                          <div class="information">
                            <div><img class="img" :src="item.content.pro.imgUrl ||item.content.pro.imgurl || ErrorImg" /></div>
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
                                <div @click="emitToUrl(`/homedetail/homedetail?id=${item.content.pro?.id}&ClassName=首页`)" class="go-buy">去购买</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>-->
<!--                    <div class="kefu_content_text" v-else-if="item.content.text && item.orderMsg">{{ item.content.text}}</div>-->
                  </div>
                  <img :src="item.img" />
                </div>
              </template>
            </div>
            <div class="right_img">
              <div class="img_bq" @click.stop="showBQ = true">
                <img :src="bqUrl" />
                <div class="BQlist" v-if="showBQ">
                  <span v-for="(item, index) in emojiData" :key="index" @click.stop="_chooceBQ(item)">
                    {{ item }}
                  </span>
                </div>
              </div>
              <div class="img_tp">
                <input type="file" name="upimg" id="upimg" @change="_chooceImg" accept="image/*" />
                <img :src="tpUrl" />
              </div>
            </div>
            <div class="right_input">
              <div class="kefu_input">
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
  </div>
</template>

<script>
import emoji from '@/assets/mixins/emoji.js'
export default {
  name: 'CustomerService',
  props: {
    pc_user: { type: Object, required: true }, // 用户信息凭证
    currentMchId: { type: [String, Number], required: true }, // 当前店铺ID 只读不修改
    currentUserId: { type: [String, Number], required: true }, // 当前用户ID
    ErrorImg: { type: String, required: true }, // 图片加载失败兜底图
  },
  data() {
    return {
      // ========== 仅新增：本地变量接收props的currentMchId，所有修改都用这个变量 ==========
      localMchId: this.currentMchId,
      // ========== 以下所有原有变量 一字未改 ==========
      isSpace: 0, //空格键是否被按下
      isEnter: 0, //enter键是否被按下
      urlType: '', //根据配置的url判断项目类型：java/php
      isKeFuShow: false, //是否显示客服弹窗
      isActive: 0, //选择第几个客服
      showBQ: false, //显示表情列表
      mchName: '', //搜索的店铺
      emojiData: [], //表情列表
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
      timer: null, // 心跳定时器
    }
  },
  watch: {
    isKeFuShow(val) {
      if (!val) {
        this.isActive = 0
        this.mchName = ''
      }
    },
    mchName(val) {
      console.log('正在搜索店铺-》', val);
      this.isActive = 0
      this._getMchList()
    },
    // ========== 仅新增：监听父组件传值变化，同步更新本地变量 ==========
    currentMchId(newVal) {
      this.localMchId = newVal
    }
  },
  mounted() {
    this.emojiData = emoji
    if (process.env.VUE_APP_LKT_KEFU_URL == 'wss://tp.dev.laiketui.net/wss/') {
      this.urlType = 'PHP'
    } else {
      this.urlType = 'JAVA'
    }
  },
  beforeDestroy() {
    if (this.socketTask) {
      this.socketTask.close()
      this.socketTask = null
    }
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    openKefu() {
      console.log('✅ 客服组件openKefu方法执行了！');
      this.$nextTick(() => {
        this.isKeFuShow = true;
      })
      this.isKeFuShow = true
      console.log('isKeFuShow', this.isKeFuShow);
      this._getMchList()
      this.connectSocket()
    },
    handleErrorImg(e) {
      e.target.src = this.ErrorImg
    },
    emitToUrl(url) {
      this.$emit('toUrl', url)
    },
    _listenerKeyup(event) {
      const keyCode = event.keyCode || event.which;
      if (keyCode == 13) { this.isEnter = 0 }
      if (keyCode == 32) { this.isSpace = 0 }
    },
    _listenerKeydown(event) {
      const keyCode = event.keyCode || event.which;
      if (keyCode == 13) { this.isEnter = 1 }
      if (keyCode == 32) { this.isSpace = 1 }
      if (this.isSpace == 1 && this.isEnter == 1) {
        console.log('空格+Enter 键被按下！--》执行换行')
      } else if (this.isEnter == 1) {
        console.log('Enter 键被按下！--》发送消息')
        this._handleChange()
        event.preventDefault();
      }
    },
    _getKF(item, index) {
      this.isActive = index
      let leftList = document.querySelector('.left_list')
      let isScrollTop = (leftList.scrollHeight / 12) * index
      leftList.scrollTop = isScrollTop
      // ========== 修改点：替换为 localMchId ==========
      this.localMchId = item.mch_id
      this.userlistindex = index
      this.userlist[this.userlistindex].no_read_num = 0
      this._newlist()
    },
    _chooceBQ(item) {
      this.input_content = this.input_content.concat(item)
      this.$refs.elInput.focus()
    },
    _chooceImg() {
      var upname = document.getElementById('upimg').value
      if (!upname.includes('GIF') && !upname.includes('gif') && !upname.includes('JPG') && !upname.includes('jpg') && !upname.includes('JPEG') && !upname.includes('jpeg') && !upname.includes('BMP') && !upname.includes('bmp') && !upname.includes('PNG') && !upname.includes('png')) {
        this.$message.error(this.$t('myinfor.Tips[3]'))
        return
      }
      var reads = new FileReader()
      let f = document.getElementById('upimg').files[0]
      reads.readAsDataURL(f)
      var data = new FormData()
      data.append('file', document.getElementById('upimg').files[0])
      data.append('access_id', this.pc_user.access_id)
      this.$upImg(data)
        .then(res => {
          if (res.code == 200) {
            this.img_list = res.data.url
            this._handleChange()
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    async _getMchList() {
      let data = {
        api: 'mall.Msg.user_mchList',
        userId: this.currentUserId,
        mchId: this.localMchId,
        mchName: this.mchName,
      }
      if (this.mchName) data.mchId = ''
      this.$Api.doRequest(data)
        .then(res => {
          if (res.data.list && res.data.list.length > 0) {
            this.userlist = res.data.list
            this.userlist.forEach((v, i) => {
              try { v.content = JSON.parse(v.content) } catch (error) { v.content = { text: v.content } }
            })
            // ========== 修改点：替换为 localMchId ==========
            this.localMchId = this.userlist.length > 0 ? this.userlist[0].mch_id : this.localMchId
            if (this.localMchId) this.userlist[0].no_read_num = 0
            this.userlist.forEach((item, index) => { this.$set(item, 'user_name', item.name) })
            this._newlist()
          } else { this.userlist = [] }
        })
        .catch(error => { this.$message.error(error.message) })
    },
    _newlist() {
      let data = {
        api: 'mall.Msg.getMessageList',
        userId: this.currentUserId,
        // ========== 修改点：替换为 localMchId ==========
        mchId: this.localMchId,
        type: this.type,
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.arrlist = res.data.list;
            this.arrlist.forEach((v, i) => {
              try { v.content = JSON.parse(v.content) } catch (error) { v.content = { text: v.content } }
            })
            this.$nextTick(() => { this._scrollTop(".right_message"); });
          }
        })
        .catch(error => { this.$message.error(error.message) })
    },
    _handleChange() {
      // 内容为空 不发送
      if (!this.input_content && !this.img_list) return

      let sendData = {};
      let isImgMsg = !!this.img_list; // 判断是否是图片消息 ✅

      // ========== ✅ 1. 组装请求接口的参数 不变 ==========
      let data = {
        api: 'mall.Msg.addMessage',
        send_id: this.currentUserId,
        receive_id: this.localMchId,
        content: this.input_content ? this.input_content : '',
        is_mch_send: this.type,
        img_list: this.img_list,
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            let newData = {}
            newData.nike_name = this.pc_user.user_name
            newData.img = this.pc_user.headimgurl
            newData.is_mch_send = this.type

            // ========== ✅ 核心修复 图片消息/文本消息 分开处理 ✅ ==========
            if (isImgMsg) {
              // 【图片消息】直接赋值纯图片链接，匹配你的图片渲染DOM
              newData.content = this.img_list;
            } else {
              // 【文本消息】原有逻辑不变
              newData.content = { text: this.input_content }
            }

            // 追加到聊天列表，立刻显示
            this.arrlist.push(newData)

            if (this.urlType == 'PHP') this.sendSocketMessage(res.data[0]).then()
            // 清空输入框和图片路径
            this.input_content = ''
            this.img_list = ''
            this._newlist();
            document.getElementById('upimg').value = ''
            this.$nextTick(() => { this._scrollTop('.right_message') })
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    _scrollTop(className) {
      setTimeout(() => {
        let leftList = document.querySelector(className)
        let isScrollTop = leftList.scrollHeight
        leftList.scrollTop = isScrollTop
      }, 100)
    },
    connectSocket() {
      // ========== 修改点：替换为 localMchId ==========
      if (this.localMchId == '' || !this.localMchId) return
      let wsurl = ''
      if (this.urlType == 'PHP') {
        wsurl = process.env.VUE_APP_LKT_KEFU_URL
      } else {
        let storType = process.env.VUE_APP_STORE_TYPE
        wsurl = process.env.VUE_APP_LKT_KEFU_URL + this.currentUserId + '/' + this.currentUserId + '/' + storType
      }
      let that = this
      this.socketTask = new WebSocket(wsurl)
      this.socketTask.onopen = res => {
        console.log('WebSocket连接已打开！')
        that.heart()
      }
      this.socketTask.onmessage = res => {
        let data = JSON.parse(res.data)
        console.log('监听到websocket返回数据--》', data)
        if (data.client_key) {
          let storType = process.env.VUE_APP_STORE_TYPE
          let msg = { type: 'login',is_mch_send: '0',send_id: that.currentUserId,client_key: data.client_key,source: storType }
          that.sendSocketMessage(msg).then()
        }
        // ========== 修改点：替换为 localMchId ==========
        if (!that.localMchId || that.localMchId == '') {
          if (data.mch_id) that.localMchId = data.mch_id
          else if (data.send_id) that.localMchId = data.send_id
        }
        if (data.mch_id) {
          let found = false
          for (var i = 0; i < that.userlist.length; i++) {
            let tmpUserid = that.userlist[i].mch_id
            if (data.mch_id == tmpUserid) { that.userlist[i] = data; found = true; break }
            // ========== 修改点：替换为 localMchId ==========
            if (that.localMchId == tmpUserid) that.userlist[i].no_read_num = 0
          }
          if (!found) that.userlist.push(data)
          that.userlist.splice(0, 0)
        } else {
          setTimeout(() => {
            if (that.userlist.length == 1) that.localMchId = that.userlist[0].mch_id
            // ========== 修改点：替换为 localMchId ==========
            if (that.localMchId && data.send_id && data.send_id == that.localMchId) {
              that.arrlist.push(data)
              this.$nextTick(() => { this._scrollTop('.right_message') })
            }
            for (var i = 0; i < that.userlist.length; i++) {
              let tmpUserid = that.userlist[i].mch_id
              // ========== 修改点：替换为 localMchId ==========
              if (that.localMchId == tmpUserid) that.userlist[i].no_read_num = 0
            }
            that.userlist.splice(0, 0)
          }, 100)
        }
        that.userlist.forEach((item, index) => { that.$set(item, 'user_name', item.name) })
        that.$forceUpdate()
      }
      this.socketTask.onerror = res => {
        console.log('WebSocket连接打开失败，请检查！', res)
        that.reconnect()
      }
      this.socketTask.onclose = e => {
        console.log('WebSocket连接关闭！', e)
        clearInterval(that.timer)
        if (this.isKeFuShow) {
          this.$message.success(this.$t('homedetail.csjwtq'));
          setTimeout(() => { this.isKeFuShow = false }, 3000)
        }
      }
    },
    reconnect() {
      console.log('进入断线重连...')
      this.socketTask = null
      // ========== 修改点：替换为 localMchId ==========
      if (this.localMchId) this.connectSocket(this.localMchId)
    },
    sendSocketMessage(msg) {
      let that = this
      msg = JSON.stringify(msg)
      console.log('发送消息-->msg', msg);
      return new Promise((reslove, reject) => { that.socketTask.send(msg); })
    },
    heart() {
      clearInterval(this.timer);
      let that = this;
      this.timer = '';
      let msg = { "type": "heartbeat", }
      this.timer = setInterval(() => { that.sendSocketMessage(msg).then() }, 55000)
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/homedetail/kefu.css';
</style>
