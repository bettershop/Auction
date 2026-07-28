<template>
<div id="app">
	<input type="hidden" name="pageTitle" value="我的钱包">
	<div class="my-title">
		<p>{{ $t('myWallet.title')}}</p>
	</div>

	<div class="my-Wallet" v-if="!loadFlag">
		<p>{{user_money}}</p>
		<span>{{ $t('myWallet.My_balance') }}</span>
		<div>
			<el-button type="danger" @click="toUrl('/my/my/recharge')">{{ $t('myWallet.Recharge') }}</el-button>
			<el-button v-if="pages_status == 0" type="danger" plain @click="toUrl('/my/my/withdrawal')">{{ $t('myWallet.Withdrawal') }}</el-button>
		</div>

		<img src="~/static/images/walletBg.png" alt="">
	</div>

	<div class="my-Wallet" v-else>
		<p>
			<span class="nonavtitle" style="width: 150px;"></span>
		</p>
		<span>{{ $t('myWallet.My_balance2') }}）</span>
		<div>
			<el-button class="nonavtitle"></el-button>
			<el-button class="nonavtitle"></el-button>
		</div>

		<img src="~/static/images/walletBg.png" alt="">
	</div>

	<div class="headings">{{ $t('myWallet.Wallet_details') }}</div>

	<div class="tableBox" v-if="!loadFlag">
    <div class="box-choose">
      <div class="choose-type">
        <div @click="_chooseType(1)" :class="chooseType==1?'active':''">{{$t('myWallet.financialTransactions[0]')}}</div>
        <div @click="_chooseType(2)" :class="chooseType==2?'active':''">{{$t('myWallet.financialTransactions[1]')}}</div>
      </div>
      <div class="choose-time">
        <div @click="typeShow = !typeShow">
          {{$t(typeList[typeIndex].nameKey)}}
          <div class="xlk" v-if="typeShow">
            <div v-for="(item, index) in typeList" :key="item.id" :class="{active1: typeIndex==index}" @click="_typeIndex(index)">
              {{$t(item.nameKey)}}
            </div>
          </div>
        </div>
        <div @click="timeShow = !timeShow">
          {{$t(timeList[timeIndex].nameKey)}}
          <div class="xlk" v-if="timeShow">
            <div v-for="(item, index) in timeList" :key="item.id" :class="{active1: timeIndex==index}" @click="_timeIndex(index)">
              {{$t(item.nameKey)}}
            </div>
          </div>
        </div>
      </div>
    </div>
		<el-table
			header-cell-class-name="thead"
		  :data="tableData1"
	 	  style="width: 100%"
      height="444"
		  row-key="id"
		  lazy
      :header-cell-style="{color: '#999999'}"
		>
		    <el-table-column
		      prop="instructions"
		      :label="(chooseType==1?$t('myWallet.financialTransactions[0]'):$t('myWallet.financialTransactions[1]')) + $t('myWallet.detailed[0]')"
		      width="150">
				<template slot-scope="scope">
					<div style="color:#020202">{{scope.row.instructions}}</div>
				</template>
		    </el-table-column>
		    <el-table-column
		      prop="money"
		      :label="(chooseType==1? $t('myWallet.financialTransactions[0]'):$t('myWallet.financialTransactions[1]')) + $t('myWallet.detailed[1]')"
		    >
				<template slot-scope="scope">
					<div style="color:#020202">{{chooseType==1?'+':'-'}}{{scope.row.money}}</div>
				</template>
		    </el-table-column>
		    <el-table-column
		      prop="add_date"
		      :label="$t('myWallet.detailed[2]')"
			  width="170">
				<template slot-scope="scope">
					<div style="color:#020202">{{scope.row.add_date}}</div>
				</template>
		    </el-table-column>
		  </el-table>
	</div>

	<div class="tableBox" v-else>
		<el-table
			header-cell-class-name="thead"
		    :data="tableData11"
		    style="width: 100%"
			height="444"
		    row-key="id"
			:header-cell-style="{background:'#F6f6f6'}"
		    lazy
		    >
		    <el-table-column
		      prop="instructions"
		      :label="$t('myWallet.detailed[0]')"
		      width="150">
			  <template v-if="loadFlag" slot-scope="scope">
			  	<div class="nonavtitle" style="width: 120px;"></div>
			  </template>
		    </el-table-column>
		    <el-table-column
		      prop="money"
		      :label="$t('myWallet.detailed[1]')"
		      >
			  <template v-if="loadFlag" slot-scope="scope">
			  	<div class="nonavtitle"></div>
			  </template>
		    </el-table-column>
		    <el-table-column
		      prop="time"
		      :label="$t('myWallet.detailed[2]')"
			  width="170">
			  <template v-if="loadFlag" slot-scope="scope">
			  	<div class="nonavtitle" style="width: 160px;"></div>
			  </template>
		    </el-table-column>
		  </el-table>
	</div>

	<div class="paginationBox">
		<el-pagination
		  v-if="total>0"
		  @current-change="changePage"
		  background
		  layout="prev, pager, next"
		  :total="total">
		</el-pagination>
	</div>
</div>
</template>

<script>
export default {
  data () {
    return {
			loadFlag: true,
      tableData1: [],
      tableData11: [{instructions:'',money:'',time:''}],
			page: 0,
			total: '',
			user_money: '',
			pages_status: 0,
			unit: '',
      chooseType: 1,
      typeShow: false,
      typeIndex: 0,//当前选中
      typeList: [
        {nameKey: 'type_myw.all', id: '0'},
        {nameKey: 'type_myw.recharge', id: '1'},
        {nameKey: 'type_myw.refund', id: '2'},
        {nameKey: 'type_myw.commission_in', id: '3'},
        {nameKey: 'type_myw.deposit_return', id: '4'},
        {nameKey: 'type_myw.deposit_withdrawal', id: '12'},
      ],
      timeShow: false,
      timeIndex: 0,//当前选中
      timeList: [
        { nameKey: 'time.last_7_days', id: '7' },
        { nameKey: 'time.last_1_month', id: '30' },
        { nameKey: 'time.last_3_months', id: '90' },
        { nameKey: 'time.last_6_months', id: '183' },
        { nameKey: 'time.last_1_year', id: '365' },
      ],
    }
  },
  mounted () {
    this.$emit('pageTitle', '我的钱包')
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  watch:{
    chooseType(val){
      if(val == 1){
        //收入类型
        let srType = [
          {nameKey: 'type_myw.all', id: '0'},
          {nameKey: 'type_myw.recharge', id: '1'},
          {nameKey: 'type_myw.refund', id: '2'},
          {nameKey: 'type_myw.commission_in', id: '3'},
          {nameKey: 'type_myw.deposit_return', id: '4'},
          {nameKey: 'type_myw.deposit_withdrawal', id: '12'},
        ]
        this.typeList = srType
      }
      if(val == 2){
        //支出类型
        let zcType = [
          { nameKey: 'type_zc.all', id: ' ' },
          { nameKey: 'type_zc.vip_open', id: '5' },
          { nameKey: 'type_zc.vip_renew', id: '6' },
          { nameKey: 'type_zc.order_pay', id: '7' },
          { nameKey: 'type_zc.balance_withdraw', id: '8' },
          { nameKey: 'type_zc.deposit_pay', id: '9' },
          { nameKey: 'type_zc.presale_deposit', id: '10' },
          { nameKey: 'type_zc.shop_deposit', id: '11' }
        ]
        this.typeList = zcType
      }
    }
  },
  methods: {
			changePage(page){
				this.page = page-1
				this.getApi()
			},
			toUrl(url){
        this.$router.push({
          path: url,
        })
			},
			switchType(e){
				 let name=''
				if(e==1||e==2){
                	// 余额充值
					name=this.$t('myWallet.newTypeText[0]')
				}else if(e==3){
					// '活动佣金'
					name=this.$t('myWallet.newTypeText[1]')
				}else if(e==4){
					// '订单退款'
					name=this.$t('myWallet.newTypeText[2]')
				}else if(e==5){
					// '店铺保证金提取'
					name=this.$t('myWallet.newTypeText[3]')
				}else if(e==6){
					// '平台扣款'
					name=this.$t('myWallet.newTypeText[4]')
				}else if(e==7){
					// '订单支付'
					name=this.$t('myWallet.newTypeText[5]')
				}else if(e==8){
					// '参与活动'
					name=this.$t('myWallet.newTypeText[6]')
				}else if(e==9){
					// '充值会员'
					name=this.$t('myWallet.newTypeText[7]')
				}else if(e==10){
					// '店铺保证金支付'
					name=this.$t('myWallet.newTypeText[8]')
				}else if(e==11){
					// '余额提现'
					name=this.$t('myWallet.newTypeText[9]')
				}else if(e==12){
					// '活动退款'
					name=this.$t('myWallet.newTypeText[10]')
				}else if(e==42){
					// 直播佣金转入'
					name=this.$t('myWallet.newTypeText[11]')
				}else if(e==13){
					// '会员续费'
					name=this.$t('myWallet.newTypeText[12]')
				}else if(e==14){
					// '会员续费'
					name=this.$t('myWallet.newTypeText[13]')
				}
				return name
			},

      _chooseType(val){

        this.chooseType = val

        console.log(this.typeList)

        this.getApi()

      },
      _typeIndex(val){
        this.typeIndex = val
        this.getApi()
      },
      _timeIndex(val){
         this.timeIndex = val
        this.getApi()
      },
			getApi(){
				var data = {
          api: 'mall.User.details',
					access_id:this.pc_user.access_id,
					page:this.page+1, // 店铺ID(传空)
          pageSize: 9999999,
				}
        if(this.chooseType != ''){
          data.type = this.chooseType || ''
        }
        if(this.typeIndex>=0){
          data.typeName = this.typeList[this.typeIndex]?.id || ''
        }
        if(this.timeIndex>=0){
          data.day = this.timeList[this.timeIndex]?.id || ''
        }
				this.$Api.doRequest(data).then(res=>{
					this.loadFlag = false

					var data = res.data

					data.list && data.list.filter(item=>{
						item.instructions = this.switchType(item.type)

						// if(item.money>0){
						// 	item.money = (item.type == 1 || item.type == 3 || item.type == 5 || item.type == 13 || item.type == 14 || item.type == 19 || item.type == 20 || item.type == 22 || item.type == 23 || item.type == 24 || item.type == 27 || item.type == 30?'+':'-') + item.money
						// }
					})

					this.unit = data.unit
					this.total = data.total
					this.user_money = data.user_money
					this.tableData1 = data.list
					this.pages_status = data.status
				}).catch(error=>{
					this.loadFlag = false
					this.$message.error(error.message)
				})
			}
        }

}
</script>
<style scoped>
  @import '~/assets/css/my/myWallet.css';
  .box-choose{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 40px;
    box-sizing: border-box;
    background-color: #F6F6F6;
    font-size: 14px;
    color: #020202;
  }
  .box-choose .choose-type{
    display: flex;
  }
  .box-choose .choose-type>div:first-child{
    margin-right: 54px;
  }
  .active{
    color: #D4282D;
    position: relative;
  }
  .active::after{
    position: absolute;
    content: "";
    width: 40px;
    height: 0;
    border-bottom: 2px solid #D4282D;
    left: -5px;
    bottom: -12px;
  }
  .box-choose .choose-time{
    display: flex;
  }
  .box-choose .choose-time>div{
    position: relative;
  }
  .box-choose .choose-time>div:before {
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    bottom: 0;
    right: -15px;
    border-top: solid 5px #D4282D;
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
    border-bottom: solid 5px transparent;
  }
  .box-choose .choose-time>div:first-child{
    margin-right: 54px;
  }
  .xlk{
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #FFFFFF;
    padding: 5px 10px;
    box-sizing: border-box;
    z-index: 999;
    box-shadow: 0px 3px 6px 1px rgba(0,0,0,0.16);
  }
  .xlk:before {
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    top: -10px;
    left: 50%;
    margin-left: -10px;
    border-top: solid 5px transparent;
    border-left: solid 5px transparent;
    border-right: solid 5px transparent;
    border-bottom: solid 5px #FFFFFF;
  }
  .active1{
    color: #D4282D !important;
  }
  .xlk>div{
    color: #999999;
    border-bottom: 1px solid #DDDDDD;
    min-width: 60px;
    text-align: center;
    line-height: 35px;
  }
  .xlk>div:last-child{
    border-bottom: initial !important;
  }
</style>
