<template>
  <div class="order-part" id="app">
    <input type="hidden" name="pageTitle" value="我的消息" />
    <div class="my-title">
      <p>{{ $t("message.title") }}</p>
    </div>

    <div>
      <div class="message-title">
        <p>{{ title }}</p>
        <span>{{ time }}</span>
      </div>

      <div class="message-content" v-html="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pc_user: {},
      id: "",
      title: "",
      time: "",
      content: "",
    };
  },
  mounted() {
    this.$emit("pageTitle", "我的消息");
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
    }
    this.pc_user = this.$cookies.get("pc_user");
    this.getApi();
  },
  methods: {
    getApi() {
      var data = {
        // module: 'app_pc',
        // action: 'message',
        // m: 'oneindex',
        api: "mall.Message.oneindex",

        id: this.id,
      };

      this.$Api.doRequest(data)
        .then((res) => {
          var data = res.data.message ? res.data.message[0] : {};

          this.title = data.title;
          this.time = data.time;
          this.content = data.content;
          // 更新组件数据
          this.$root.$emit('shoppingCart')
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/my/messageDetail.css";
</style>
