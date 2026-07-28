<template>
  <div>
    <div class="imgage">
      <img
        src="../../static/images/notmy_data.png"
        style="width: 820px; height: 450px"
        alt=""
      />
    </div>
    <h1>{{ systemMsgTitle }}</h1>
    <div class="content">
      <p v-html="content"></p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Maintain",
  props: {},
  computed: {
    // content() {
    //   if (this.$cookies.get("maintain_text")) {
    //     return this.$cookies.get("maintain_text").data
    //       ? this.$cookies.get("maintain_text").data.systemMsg
    //       : "";
    //   } else {
    //     return "";
    //   }
    // },
    // systemMsgTitle() {
    //   if (this.$cookies.get("maintain_text")) {
    //     return this.$cookies.get("maintain_text").data
    //       ? this.$cookies.get("maintain_text").data.systemMsgTitle
    //       : "";
    //   } else {
    //     return "";
    //   }
    // },
  },
  data() {
    return {
      content:"",
      systemMsgTitle:""
    };
  },
  //   computed: {},
  watch: {},
  created() {
    this.handleGetTell();
  },
  mounted() {},
  methods: {
    handleGetTell() {
      var data = {
        api: "mall.User.getUserTell",
      };
      this.$Api.doRequest(data).then((res) => {
        console.log(res);
        if (res.code == 200) {
          if (res.data.systemMsgType != 1) {
            this.$router.push({
              path: "/",
            });
          }
        } else {
          // this.$cookies.set("maintain_text", res.data);
          this.systemMsgTitle = res.data?.data?.systemMsgTitle
          this.content = res.data?.data?.systemMsg
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.imgage {
  display: flex;
  justify-content: center;
  padding-top: 100px;
}
h1 {
  font-size: 32px;
  color: #414658;
  font-weight: 500;
  margin-top: 64px;
  margin-bottom: 32px;
  text-align: center;
}

.content {
  width: 880px;
  height: 118px;
  margin: 0 auto;
  overflow-y: scroll;
  overflow-x: hidden;
  word-wrap: break-word;
  word-break: break-all;
  padding-right: 20px;
  p {
    // width: 100%;
    width: 880px;
    word-wrap: break-word;
    word-break: break-all;
  }
}
</style>
