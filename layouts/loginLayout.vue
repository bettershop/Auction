<template>
  <div class="container">
    <v-header :public-data="loginData" />
    <Nuxt style="flex: 1" />
    <v-footer :public-data="loginData" />
    <client-only>
      <CookieConsent />
    </client-only>
  </div>
</template>

<script>
import vHeader from "~/components/loginHeader.vue";
import vFooter from "~/components/loginFooter.vue";
export default {
  components: {
    vHeader,
    vFooter,
  },
  data() {
    return {
      loginData: {},
    };
  },
  created() {
  },
  mounted() {},
  watch: {
    $route: {
      handler(){
        // console.log('我一定会回来的80808082');
        this.handleGetTell()
      },
      immediate : true
    },

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
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
