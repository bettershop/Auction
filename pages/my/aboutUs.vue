<template>
<div id="app">
	<input type="hidden" name="noIndex" value="1">
	<div class="w">
		<el-row class="tac">
			<!-- 左侧导航条 -->
			<el-col :span="5" style="width: 220px;margin-right: 20px;">
				<el-menu :default-active="type" class="el-menu-vertical-demo" :default-openeds="openeds" @select="selectMenu">
					<el-submenu index="1">
						<template slot="title">
							<span>{{ $t('aboutUs.tab[0]') }}</span>
						</template>
						<el-menu-item index="after_sales_issues">{{$t('aboutUs.tab[1]')}}</el-menu-item>
						<el-menu-item index="payment_issues">{{$t('aboutUs.tab[2]')}}</el-menu-item>
					</el-submenu>
					<el-submenu index="2">
						<template slot="title">
							<span>{{$t('aboutUs.tab[3]')}}</span>
						</template>
						<el-menu-item index="shopping_process">{{$t('aboutUs.tab[4]')}}</el-menu-item>
						<el-menu-item index="payment_method">{{$t('aboutUs.tab[5]')}}</el-menu-item>
					</el-submenu>
					<el-submenu index="3">
						<template slot="title">
							<span>{{$t('aboutUs.tab[6]')}}</span>
						</template>
						<el-menu-item index="return_policy">{{$t('aboutUs.tab[7]')}}</el-menu-item>
						<el-menu-item index="cancellation_order">{{$t('aboutUs.tab[8]')}}</el-menu-item>
						<el-menu-item index="refund_process">{{$t('aboutUs.tab[9]')}}</el-menu-item>
						<el-menu-item index="refund_instructions">{{$t('aboutUs.tab[10]')}}</el-menu-item>
					</el-submenu>
					<el-menu-item index="aboutus">
						<span style="font-size: 16px;">{{$t('aboutUs.tab[11]')}}</span>
					</el-menu-item>
				</el-menu>
			</el-col>
			<!-- 右侧介绍 -->
			<el-col :span="19" style="width:960px;">
				<div class="about-part">
					<div class="about-title">
						<div>{{typeTitle}}</div>
					</div>
					<div class="about-content" v-html="content"></div>
				</div>
			</el-col>
		</el-row>
	</div>
</div>
</template>

<script>
export default {
  layout: 'homeLayout',
  async asyncData ({ app, query }) {
    let pc_user = app.$cookies.get('pc_user')
    let type = query.type
    return {
      pc_user,
      type
    }
  },
  data () {
    return {
			openeds: ['1', '2', '3'],
			content: '',

			type: '',
			typeTitle: ''
    }
  },
  mounted () {
    this.pc_user = this.$cookies.get('pc_user')
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
    this.axios()
  },
  watch:{
			type(val){
				switch(val){
					case 'after_sales_issues':
						this.typeTitle = this.$t('aboutUs.tab[1]')
						break;
					case 'payment_issues':
						this.typeTitle = this.$t('aboutUs.tab[2]')
						break;
					case 'shopping_process':
						this.typeTitle = this.$t('aboutUs.tab[4]')
						break;
					case 'payment_method':
						this.typeTitle = this.$t('aboutUs.tab[5]')
						break;
					case 'return_policy':
						this.typeTitle = this.$t('aboutUs.tab[7]')
						break;
					case 'cancellation_order':
						this.typeTitle = this.$t('aboutUs.tab[8]')
						break;
					case 'refund_process':
						this.typeTitle = this.$t('aboutUs.tab[9]')
						break;
					case 'refund_instructions':
						this.typeTitle = this.$t('aboutUs.tab[10]')
						break;
					default:
						this.typeTitle = this.$t('aboutUs.tab[11]')
				}
			}
		},
		methods: {
			axios() {
				var data = {
					// module: 'app_pc',
					// action: 'user',
					// m: 'about_us',
          api: 'mall.User.aboutUs',

					type: this.type
				}

				this.$Api.doRequest(data).then(res=>{
					this.content = res.data.content?res.data.content:this.$t('aboutUs.Tips')
				})

			},
			selectMenu(type){
				this.$router.push({ path: '/my/aboutUs', query: { type: type } })
			}
		}

}
</script>user_name
<style>
/* 所有aboutUs子页面所需的公共样式 */
.logo-img {
  margin: 18px 0px 0px !important;
  padding-bottom: 18px !important;
}
</style>
<style scoped>
@import '~/assets/css/my/aboutUs.css';
</style>
