<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="我的收藏" />

    <el-tabs v-model="activeName">

      <el-tab-pane :label="$t('My_collection.tab[0]')" name="1">
        <template v-if="!loadFlag">
		  <div class="new-shouc" v-if="list.length">
			  <div class="new-shouc-caoz">
				  <el-button class="caoz-btn" size="mini" @click="_caoz">{{$t(caoz?'取消管理':'批量操作')}}</el-button>
				  <el-checkbox class="caoz-all" v-model="textChoose" @change="_allChoose" v-if="caoz">全选</el-checkbox>
				  <div class="caoz-quxiao"  v-if="caoz" @click="_quxiaoSc">取消收藏</div>
			  </div>
			  <div class="new-shouc-search">
				  <el-input
					  class="search-input"
					  :placeholder="$t('请输入商品名称')"
					  v-model="searchName"
					  size="mini"
					>
					  <el-button slot="append" @click="_search">{{
						$t('myorder.search')
					  }}</el-button>
					</el-input>
			  </div>
		  </div>
		  <div style="display: flex;flex-wrap: wrap;">
			  <!-- 商品收藏 -->
				<div class="list" v-for="(item, index) of list" :key="index" v-on:mouseover="item.show=true" v-on:mouseleave="item.show=false">
				  <div class="relative">
					<img class="goods-image" :src="item.imgurl" alt="" />
					<div class="xiajia" v-if="item.recycle == 1">
					  <!-- 已过期 -->
					  {{ $t("shoppingCart.ygq") }}
					</div>
					<div class="xiajia" v-if="item.status == 3 && item.recycle != 1">
					  <!-- 已下架 -->
					  {{ $t("My_collection.shelf") }}
					</div>
					<div
					  class="xiajia"
					  v-if="item.num <= 0 && item.recycle != 1 && item.status != 3"
					>
					  <!-- 已过期 -->
					  {{ $t("shoppingCart.ysq") }}
					</div>
					<div class="quxiaoSc" @click="removeCollection(item.id)" v-if="item.show">
						<div>取消收藏</div>
					</div>
				  </div>
				  <div class="list-right">
					<div class="list-right-top">
					  <p class="pointer" @click="toDetail2(item)">
						{{ item.product_title }}
					  </p>
					</div>
					<div class="list-price">
					  {{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice(item.price) }}
					</div>
				  </div>
				  <div class="cao-zuo" v-on:mouseover.stop v-if="caoz">
					   <div @click="_itChoose(item)">
							<img :src="item.choose?choose2:choose1" alt="" />
					   </div>
				  </div>
				</div>
			  <!-- 商品收藏 空状态 -->
				<div v-if="list.length == 0" class="noOrder">
				  <img :src="noOrder" alt="" />
				  <p>{{ $t("My_collection.Tips[0]") }}~</p>
				</div>
		  </div>
        </template>
        <div v-else class="list">
          <img class="goods-image nonavtitle" :src="noOrder" alt="" />
          <div class="list-right">
            <div class="list-right-top">
              <p class="nonavtitle" style="width: 400px"></p>
            </div>
            <div
              class="list-mchName nonavtitle"
              style="display: block; width: 140px"
            ></div>
            <div
              class="list-price nonavtitle"
              style="display: block; width: 82px"
            ></div>
            <el-button class="nonavtitle" type="danger" plain></el-button>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="$t('My_collection.tab[1]')" name="2">
        <template v-if="!loadFlag">
		  <div class="new-shouc" v-if="list.length">
			  <div class="new-shouc-caoz">
				  <el-button class="caoz-btn" size="mini" @click="_caoz">{{$t(caoz?'取消管理':'批量操作')}}</el-button>
				  <el-checkbox class="caoz-all" v-model="textChoose" @change="_allChoose" v-if="caoz">全选</el-checkbox>
				  <div class="caoz-quxiao"  v-if="caoz" @click="_quxiaoSc(1)">取消收藏</div>
			  </div>
			  <div class="new-shouc-search">
				  <el-input
					  class="search-input"
					  :placeholder="$t('请输入店铺名称')"
					  v-model="searchName"
					  size="mini"
					>
					  <el-button slot="append" @click="_search">{{
						$t('myorder.search')
					  }}</el-button>
					</el-input>
			  </div>
		  </div>
		  <!-- 店铺收藏 -->
          <div class="mchlist" v-for="(items, indexs) of list" :key="indexs">
            <div class="mchlist-left">
              <div class="mchlist-left-top" v-on:mouseover="items.show=true" v-on:mouseleave="items.show=false">
                <div class="relative">
                  <img class="mch_logo" :src="items.logo" alt="" />
                  <div class="xiajia" v-if="items.is_open != 1">
                    {{ $t("My_collection.closed") }}
                  </div>
                </div>
                <div class="text">
                  <p>{{ items.mch_name }}</p>
                  <span
                    >{{ items.collection_num
                    }}{{ $t("My_collection.collection") }}</span
                  >
                </div>
				<div class="quxiaoSc" @click="removeCollection(items.id)" v-if="items.show">
					<div>取消收藏</div>
				</div>
              </div>
              <div class="mchlist-left-btn">
                <!-- 进店逛逛 -->
                <el-button type="danger" plain @click="toMch(items)">{{
                  $t("My_collection.Go")
                }}</el-button>
				<!-- 联系店铺 -->
				<!-- <el-button type="danger" plain @click="toMch(items.shopid)">{{
				  $t("联系店铺")
				}}</el-button> -->
              </div>
            </div>
			<div class="cao-zuo" v-on:mouseover.stop v-if="caoz">
				<div @click="_itChoose(items)">
					<img :src="items.choose?choose2:choose1" alt="" />
				</div>
			</div>
<!--            <div class="mchlist-right">
			  <div class="shijianbugou">
				  <div class="btn1">
					  <div @click="_type(items, 1)" :style="{color: items.type==1?'#D4282D':''}">热销</div>
					  <div @click="_type(items, 2)" :style="{color: items.type==2?'#D4282D':''}">新品</div>
				  </div>
				  <div  class="btn2"  v-if="items?.list?.length">
					  <div class="btn2-1"><span style="color:#D4282D;">{{items.mcIndex}}</span> / {{items.list.length}}</div>
					  <div class="btn2-2">
						  <div @click="_fenye(items, 'jian')"><img :src="jiantoul" alt=""></div>
						  <div @click="_fenye(items, 'add')"><img :src="jiantour" alt=""></div>
					  </div>
				  </div>
			  </div>
			  <div class="suibianxie" v-if="items?.list?.length">
				  <div
				    class="mchlist-right-item"
				    v-for="(item, index) of items.list[items.mcIndex-1]"
				    :key="index"
				    @click="toDetail(item.id)"
				  >
				    <div class="relative">
				      <img :src="item.imgurl" alt="" />
				      <div class="xiajia" v-if="item.recycle == 1">
				        &lt;!&ndash; 已过期 &ndash;&gt;
				        {{ $t("shoppingCart.ygq") }}
				      </div>
				      <div
				        class="xiajia"
				        v-if="item.status == 3 && item.recycle != 1"
				      >
				        &lt;!&ndash; 已下架 &ndash;&gt;
				        {{ $t("My_collection.shelf") }}
				      </div>
				      <div
				        class="xiajia"
				        v-if="
				          item.num <= 0 && item.recycle != 1 && item.status != 3
				        "
				      >
				        &lt;!&ndash; 已过期 &ndash;&gt;
				        {{ $t("shoppingCart.ysq") }}
				      </div>
				    </div>
				    <p>{{$LaiKeCommObject.show_symbol}}{{ $LaiKeCommObject.formatPrice( item.price) }}</p>
				  </div>
			  </div>
              <div v-else style="margin:0 auto;display: flex;align-items: center;">
				  <img src="~/static/images/noPro.png" alt="" />
				  <span style="color: #888888;">{{items.type==1?'暂无热销':'暂无新品'}}</span>
			  </div>
            </div>-->
          </div>
		  <!-- 店铺收藏 空状态 -->
          <div v-if="list.length == 0" class="noOrder">
            <img :src="noOrder" alt="" />
            <p>{{ $t("My_collection.Tips[1]") }}~</p>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>

    <div class="infoMask" v-if="ysxFlag">
      <div>
        <i
          class="el-icon-warning-outline"
          style="
            color: #d4282d;
            font-size: 36px;
            height: 36px;
            display: flex;
            align-items: center;
          "
        ></i>

        <div class="infoText">
          {{ $t("shoppingCart.spygq") }}
        </div>

        <div class="btnBox">
          <el-button type="danger" @click="ysxFlag = false">{{
            $t("shoppingCart.wzdl")
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadFlag: true,
      pc_user: {},
      activeName: "1",
      list: [],
      noOrder: require("/static/images/no_sc.png"),
	  app_code: require('/static/images/app_code.png'),
	  choose1: require('/static/images/choose1.png'),
	  choose2: require('/static/images/choose2.png'),
	  jiantoul: require('/static/images/jiantoul.png'),
	  jiantour: require('/static/images/jiantour.png'),
      ysxFlag: false,
	  allChoose: false,
	  caoz:false,
	  searchName: '',
	  textChoose: false,
    };
  },
  mounted() {
    this.$emit("pageTitle", "我的收藏");
    this.pc_user = this.$cookies.get("pc_user");
    this.getApi();
  },
  watch: {
    activeName(val) {
		console.log('activeName~',val);
      this.list = []
	  this.allChoose = false
	  this.textChoose = false
	  this.caoz = false
	  this.searchName = ''
      this.loadFlag = true
      this.getApi()
    },
  },
  methods: {
	_type(item, val){
		item.type = val
		item.mcIndex = 1
		if(val == 1){
			item.list = item.rxList
		}
		if(val == 2){
			item.list = item.xpList
		}
	},
	_fenye(item, type){
		if(type == 'jian'){
			if(item.mcIndex>1){
				item.mcIndex--
			}
		}
		if(type == 'add'){
			if(item.mcIndex<item.list.length){
				item.mcIndex++
			}
		}
	},
	_allChoose(){
		this.allChoose = !this.allChoose
		this.list.forEach((item, index)=>{
			item.choose = this.allChoose
		})
	},
	_itChoose(item){
		item.choose = !item.choose
		this.textChoose = this.list.every((item, index)=>{
			return item.choose == true
		})
		this.allChoose = this.textChoose
	},
	_quxiaoSc(npmber = 0){
		let ids = ''
		this.list.forEach((item, index)=>{
			if(item.choose){
				ids += item.id + ','
			}
		})
		console.log('_quxiaoSc~', ids);
		if(ids && ids.length>0){
			this.removeCollection(ids)
		}else{
			if(Number(npmber)){
				this.$message.warning(this.$t('confirmData.qxzdp'));
			}else{
				this.$message.warning(this.$t('confirmData.qxzsp'));
			}
		}
	},
	_search(){
		console.log('_search~', this.searchName);
		this.getApi(this.searchName)
	},
	_caoz(){
		this.caoz = !this.caoz
		if(this.caoz == false){
			this.allChoose = false
			this.textChoose = false
			this.caoz = false
			this.searchName = ''
			this.list.forEach((item, index)=>{
				item.choose = false
			})
		}
	},
    removeCollection(id) {
      this.$confirm(
        this.$t("confirmData.qrxqscm"),
        this.$t("invoiceManagement.ts"),
        {
          confirmButtonText: this.$t("invoiceManagement.qd"),
          cancelButtonText: this.$t("invoiceManagement.qx"),
          type: "warning",
        }
      )
        .then(() => {
          var data = {
            // module: 'app_pc',
            // action: 'addFavorites',
            // m: 'removeFavorites',
            api: "plugin.auction.pcAuction.removeCollection",
            collection: id||'', // 收藏商品id
          };
          this.$Api
            .doRequest(data)
            .then((res) => {
              console.log("res", res);
              if (res.code == "200") {
                this.$message.success(res.message);
                this.getApi();
              }
            })
            .catch((eror) => {
              this.$message.error(eror.message);
            });
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除',
          //   offset: 100
          // })
        });
    },
    getApi(mchNameOrProName) {
      var data = {
        // module: 'app_pc',
        // action: 'addFavorites',
        // m: 'collection',
        api: "plugin.auction.pcAuction.getCollection",
        isAuction:1,//查询竞拍收藏
        type: this.activeName, // 收藏类型 1.商品 2.店铺
		mchNameOrProName: mchNameOrProName||'',
      };

      this.$Api.doRequest(data)
        .then((res) => {
          this.loadFlag = false;
          this.list = res.data.list;
		  this.list.forEach((item, index)=>{
				this.$set(item, 'show', false)
				this.$set(item, 'choose', false)
				this.$set(item, 'type', 1)
				this.$set(item, 'mcIndex', 1)
		  })
		  if(this.activeName == 2){
			  //手搓分页
				for(let a = 0; a< this.list.length; a++){
					let newList = [];
					for (let i = 0; i < this.list[a].list.length; i += 5) {
					    newList.push(this.list[a].list.slice(i, i + 5));
					}
					this.$set(this.list[a], 'rxList', newList)
					//默认显示热销
					this.list[a].list = newList
				}
				for(let a = 0; a< this.list.length; a++){
					let newList = [];
					for (let i = 0; i < this.list[a].xplist.length; i += 5) {
					    newList.push(this.list[a].xplist.slice(i, i + 5));
					}
					this.$set(this.list[a], 'xpList', newList)
				}
			}
        })
        .catch((eror) => {
          this.loadFlag = false;
          this.$message.error(error.message);
        });
    },
    toDetail(id) {
      this.$router.push({ path: "/homedetail/homedetail", query: { id: id } });
    },
    toDetail2(item) {
      if (item.recycle == 1) {
        this.ysxFlag = true;
      } else {
        this.$router.push({
          path: "/homedetail/homedetail",
          query: { id: item.p_id },
        });
      }
    },
    toSimilar(pro_id) {
      this.$router.push({ path: "/my/my/similar", query: { pro_id: pro_id } });
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/my/mycollection.css";
.new-shouc{
	padding: 16px 20px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.new-shouc-search{}
.search-input{
	width: 290px;
}
.new-shouc-caoz{
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	cursor: pointer;
}
.caoz-all{
	margin-right: 36px;
}
.caoz-all:hover{
	color: #D4282D;
}
.caoz-quxiao{
	font-size: 14px;
	color: #666666;
}
.caoz-quxiao:hover{
	color: #D4282D;
}
.caoz-btn{
	background: #F6F6F6;
	margin-right: 24px;
}
</style>
