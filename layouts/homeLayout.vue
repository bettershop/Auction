<template>
  <div>
    <Header></Header>
    <HeaderNavbar />
    <Title v-if="is_return()"></Title>
    <nuxt :key="$route.fullPath" />
    <Body></Body>
    <Footer></Footer>
    <client-only>
      <CookieConsent />
    </client-only>
    <!-- 公告内容 -->
    <div class="mask" v-if="showVersion && versionUpdate">
      <div class="mask-content">
        <div class="margin-left">
          <img src="../static/images/bg_1314.png" class="mask_bg" alt="" />
        </div>
        <div class="margin-right">
          <h1>{{ systemMsgTitle }}</h1>
          <div class="title-content">
            <h2>公告内容</h2>
            <div class="content">
              <p v-html="content"></p>
            </div>
          </div>
          <div
            style="
              width: 312px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              color: #2891ff;
            "
          >
            <el-checkbox v-model="checked">不再提醒</el-checkbox>
            <el-button
              @click="closeVersion"
              style="width: 113px; background-color: #2891ff; color: #fff"
              >我知道了</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import HeaderNavbar from '~/pages/auction/auction-nav.vue'
import Header from "@/components/pageHeader.vue";
import Footer from "@/components/pageFooter.vue";
import Title from "@/components/homeHeader.vue";
import Body from "@/components/navRight.vue";
export default {
  components: {
    Header,
    Footer,
    Title,
    HeaderNavbar,
    Body,
  },
  data() {
    return {
      iShow: true,
      showVersion: true,
      checked: false,
      // versionUpdate:false,
      // content:'xxxxx',
    };
  },
  computed: {
    versionUpdate() {
      return this.$cookies.get("versionUpdate");
    },
    content() {
      return this.$storage.get("laike_pcMall_uaerInfo")?.systemMsg;
    },
    systemMsgTitle() {
      return this.$storage.get("laike_pcMall_uaerInfo")?.systemMsgTitle;
    },
  },
  watch: {
    $route: {
      handler(){
        // console.log('我一定会回来的80808082');
        this.handleGetTell()
      },
      immediate : true
    },

  },
  beforeDestroy() {},
  created() {
  },
  mounted() {
    console.log("xxxxxxxx", document.title);
    // document.title = '123456'
    // 页面图标
    let links = $("link");
    let mchCoupon = this.$storage.get("mchCoupon");

    for (let i = 0; i < links.length; i++) {
      let link = $(links[i]);
      let rel = link[0].rel;
      rel = rel.toLowerCase();
      if (rel.indexOf("icon") > -1) {
        link[0].href =
          mchCoupon && mchCoupon ? mchCoupon.mallIcon : "/favicon.ico";
        break;
      }
    }

    console.log("进来咯");
  },
  methods: {
    handleGetTell() {
      var data = {
        api: "mall.User.getUserTell",
      };
      this.$Api.doRequest(data).then(res=>{
        if(res.code==4003){
          this.$storage.set("maintain_text",res.data);
        }
      })
    },
    closeVersion() {
      this.showVersion = false;
      if (this.checked) {
        console.log("调用接口");
        this.pc_user = this.$cookies.get("pc_user") ?? {};
        let data = {
          api: "mall.User.markToRead",
          tell_id: this.$storage.get("laike_pcMall_uaerInfo").tell_id,

        };
        this.$Api.doRequest(data);
      }
      this.$cookies.remove("versionUpdate");
    },
    is_return() {
      //通过截取来判断是否属于个人中心的页面或者申请店铺的页面a，是的话 就隐藏Title组件
      //还有关于我们的底部页面，目前已弃用，改为动态的了
      var url = this.$route.path.slice(0, 3);
      if (url == "/my" || this.$route.path == "/mch/applyShop") return false;
      return true;
    },
  },
};
</script>

<style lang="scss">
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  // display: block;
  // .el-checkbox__input.is-checked .el-checkbox__inner{
  //   background-color: #2891ff;
  //   border-color: #2891ff;
  // }
  // .el-checkbox__input.is-focus .el-checkbox__inner{
  //   background-color: #2891ff;
  //   border-color: #2891ff;
  // }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #2891ff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #2891ff;
    border-color: #2891ff;
  }
  .el-checkbox__inner:hover {
    border-color: #2891ff !important;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #2891ff !important;
  }
  .mask-content {
    display: flex;
    top: 50% !important;
    background: none;
    width: 1140px;
    height: auto !important;
    margin: 0 auto;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 12px;
    .margin-left {
      width: 667px;
      height: 636px;
      padding: 0;
      // background-color: pink;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        margin: 0;
      }
    }
    .margin-right {
      flex: 1;
      background-color: #fff;
      padding-left: 75px;
      border-radius: 0 12px 12px 0;
      h1 {
        margin-top: 85px;
        // text-align: center;
        color: #333333;
        font-size: 32px;
      }
      .title-content {
        height: 350px;
        width: 322px;
        padding-top: 56px;
        margin-bottom: 40px;

        .content {
          height: 267px;
          overflow-y: scroll;
          p > p > img {
            width: 100% !important;
            // object-fit: cover;
          }
        }
        h2 {
          font-size: 18px;
          margin-bottom: 12px;
          color: #333;
        }
        p {
          color: #666;
          font-size: 16px;
          word-wrap: break-word;
        }
      }
    }
  }
}
</style>
