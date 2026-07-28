<template>
  <div class="logo" str>
  
  </div>
</template>

<script>
export default {
  async fetch() {
    this.pc_user = this.$cookies.get('pc_user') || {}
    var data = {
      api: 'mall.Index.index',
    }
    let res = await this.$Api.doRequest(data)
    this.class_list = res.data.class_list
  },
  data() {
    return {
      loadFlag: true,
      pageTitile: '',
      pageId: '',
      class_list: [],
    }
  },
  computed: {
    // class_list () {
    //   return this.$store.state.layout.arrList.class_list
    // }
  },
  beforeDestroy() {
    this.$root.$off('noIndex')
    this.$root.$off('cid')
    this.$root.$off('home')
  },
  mounted() {
    this.pc_user = this.$cookies.get('pc_user') || {}
    //接收购物车传来的信息，来把pageId制空
    this.$root.$on('noIndex', () => {
      this.pageId = 'noIndex'
    })
    //接收homeList传递的cid
    this.$root.$on('cid', data => {
      this.pageId = data
    })
    //接收主页面传来的信息，来把pageId制空
    this.$root.$on('home', () => {
      this.pageId = ''
    })
    this.loadFlag = false
  },
  methods: {
    navShowClick(cid, pname) {
      this.$router.push({
        path: '/homeList/homeList',
        query: { cid: cid, pname: pname }
      })
    },
    toUrl(url) {
      this.$router.push({
        path: url
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.logo {
  width: 100%;
  background-color: #ffffff;
}
.nav {
  width: 1200px;
  margin: auto;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  /* margin-top: 32px; */
}
.allClass_head,
.allClass_head-two {
  min-width: 232px;
  height: 40px;
  background: #e2041b;
  display: flex;
  justify-content: center;
  line-height: 38px;
}
.allClass_head-two {
  width: 252px;
  min-width: 252px;
  background: #333333;
}
.allClass_head_font,
.allClass_head_font-two {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold-, MicrosoftYaHei-Bold;
  font-weight: normal;
  color: #ffffff;
  width: auto !important;
}
.allClass_head_font-two {
  font-weight: bold;
  font-size: 14px;
  color: #e5d790;
}
.logo span {
  display: inline-block;
  width: 26px;
  height: 26px;
}
.nav .nav-content {
  width: 718px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-content ul::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #c1c1c1;
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}
.nav-content ul::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  height: 50px;
  outline-offset: -1px;
  outline: 1px solid #c1c1c1;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  border-right: 1px solid #c1c1c1;
  border-left: 1px solid #c1c1c1;
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}
.nav-content ul::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}
.nav-content ul {
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  white-space: nowrap;
  overflow-x: auto;
}
.nav-content ul li {
  cursor: pointer;
  user-select: none;
  margin-right: 20px;

  // min-width: 64px;
  font-size: 16px;
  color: #333333;

  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-content ul li.active p {
  color: #e2041b;
}
.nav-content ul li .nav-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  font-family: MicrosoftYaHei-, MicrosoftYaHei;
  /* font-weight: normal; */
  color: #333333;
}
.nav-content ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #d1d1d1;
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}

.nav-content::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  height: 50px;
  outline-offset: -1px;
  outline: 1px solid #fff;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  border-right: 1px solid #fff;
  border-left: 1px solid #fff;
  -webkit-transition: background-color 0.3s ease-in-out;
  transition: background-color 0.3s ease-in-out;
}

.nav-content::-webkit-scrollbar-track {
  background-color: #fff;
}
</style>
