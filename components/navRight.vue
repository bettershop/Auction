<template>
  <div id="navApp" class="r-nav">
    <ul>
      <!-- 联系客服 -->
      <!-- <li class="qr-kefu" @click="customer">
			<div class="qr-kefuImg"></div>
			<span>{{ $t('navright[0]') }}</span>
		</li> -->

      <li class="qr-goods" id="qr-goods" style="display: none;">
        <div class="xiazai" id="xiazai"></div>
        <span>{{ $t('navright[4]') }}</span>
        <div class="qr-img">
          <!-- <img src="~/static/images/app_code.png" alt=""> -->
          <div id="qrcode"></div>
        </div>
      </li>

      <li class="qr-app">
        <div class="xiazai"></div>
        <span>{{ $t('navright[1]') }}</span>
        <div class="qr-img">
          <!-- <img src="~/static/images/app_code.png" alt=""> -->
          <img :src="appList.APPUrl" alt="">
          <p>{{ appList.APPExplain }}</p>
        </div>
      </li>
      <li class="toUp" @click="toUp">
        <div class="toUpImg"></div>
        <span>{{ $t('navright[3]') }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  id: 'navApp',
  data() {
    return {
      appList: {},
    }
  },
  props: {
    publicData: {}
  },
  mounted() {
    this.appList = this.$storage.get('appList') || {}
    this.goodsUrl = this.$cookies.get('goodsUrl') || {}
  },
  methods: {
   toUp() {
          // 先清除可能存在的动画帧，避免多次点击叠加
      let scrollTimer = null;
      
      const smoothscroll = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // 终止条件：滚动到顶部
        if (scrollTop <= 0) {
          cancelAnimationFrame(scrollTimer);
          return;
        }
        // 计算每次滚动的距离（减速效果）
        const step = Math.floor(-scrollTop / 8);
        window.scrollBy(0, step);
        scrollTimer = requestAnimationFrame(smoothscroll);
      };
      
      // 执行滚动
      smoothscroll();
      
      // 额外：组件销毁时清除定时器，防止内存泄漏
      this.$once('hook:beforeDestroy', () => {
        cancelAnimationFrame(scrollTimer);
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.r-nav {
  position: fixed;
  bottom: 150px;
  right: 90px;
  width: 82px;
  height: auto;
  margin: auto;
  box-shadow: 0px 1px 14px 0px rgba(0, 0, 0, 0.12);
  z-index: 222;
  background-color: #ffffff;
}
.r-nav ul li {
  width: 100%;
  height: 70px;
  margin: auto;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
}
.qr-kefu .qr-kefuImg {
  background-image: url('~static/home-img/kefu.png');
}
.r-nav ul li span {
  display: block;
  margin: -10px auto;
  font-size: 14px;
  color: #666666;
}
.r-nav li:nth-child(2) {
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
.r-nav ul li .toUpImg,
.r-nav ul li .xiazai,
.qr-kefuImg {
  display: block;
  width: 23px;
  height: 23px;
  margin: 15px auto;
}
.qr-app .xiazai {
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url('~/static/home-img/xiazai.png');
}
.qr-img {
  display: none;
  position: absolute;
  top: 69px;
  left: -145px;
  width: 136px;
  height: 154px;
  border: 1px solid rgba(230, 230, 230, 1);
  background-color: #ffffff;
  padding-top: 20px;
}
#xiazai img {
  width: 30px !important;
}
.qr-img img {
  display: block;
  width: 100px !important;
  height: 100px !important;
  margin: auto;
  background-color: #fff;
}
.toUp .toUpImg {
  background-image: url('~/static/home-img/dingbu.png');
}
.toUp .toUpImg,
.qr-kefu .qr-kefuImg {
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
}
.r-nav ul li:hover > span {
  color: #d4282d;
}
.qr-kefu:hover .qr-kefuImg {
  background-image: url('~/static/home-img/kefu_h.png');
}
.qr-app:hover .xiazai {
  background-image: url('~/static/home-img/xiazai_red.png');
}
.toUp:hover .toUpImg {
  background-image: url('~/static/home-img/dingbu_h.png');
}
.qr-app:hover > .qr-img {
  display: block;
}
.qr-goods:hover > .qr-img {
  display: block;
}
.qr-img p {
  font-size: 12px;
  color: #454545;
  margin-top: 10px;
}
</style>
