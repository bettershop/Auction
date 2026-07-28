<template>
  <div id="app">
    <input type="hidden" name="pageTitle" :value="$t('addInvoice.fpgl')" />
    <div class="my—tt">
      <p>{{ sno.length<=0?$t('addInvoice.tjfptt'):$t('addInvoice.kfp') }}</p>
      <el-button class="my-bt" @click="kep_open">{{
        $t('cutInvoice.ggtt')
      }}</el-button>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('cutInvoice.ttlx')">
        <el-input disabled v-model="type"></el-input>
      </el-form-item>
      <el-form-item :label="$t('cutInvoice.gsmc')">
        <el-input disabled v-model="ruleForm.company_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('cutInvoice.gssh')" v-if="type == '企业单位'">
        <el-input disabled v-model="ruleForm.company_tax_number"></el-input>
      </el-form-item>
      <el-form-item :label="$t('cutInvoice.zje')">
        <el-input disabled v-model="z_price">
          <template slot="prefix">{{$LaiKeCommObject.show_symbol}}</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('cutInvoice.dzyx')" prop="email">
        <el-input
          maxlength="20"
          v-model="ruleForm.email"
          :placeholder="$t('cutInvoice.qsrdzyx')"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="bottomBtn">
      <el-button type="danger" @click="submitForm()">{{
        $t('cutInvoice.tj')
      }}</el-button>
    </div>
    <div class="addressMask" v-if="iShow">
      <div style="height: auto; width: 698px">
        <div class="addressMask_title">
          {{ $t('cutInvoice.ggfptt') }}
          <i class="el-icon-close" @click="iShow = false"></i>
        </div>
        <div class="order_kep">
          <div
            class="list"
            v-for="(item, index) of tableList"
            :key="index"
            @click="spist(item)"
            :class="radio == item.id ? 'spist' : ''"
          >
            <div class="div_one">
              <div>
                <div class="div_two">
                  <div class="div_three" v-if="item.is_default == 1">
                    <div>{{ $t('cutInvoice.mr') }}</div>
                  </div>
                  <div class="div_mchname">{{ item.company_name }}</div>
                </div>
                <div style="display: flex">
                  <div class="div_sno">{{ item.company_tax_number }}</div>
                </div>
              </div>
              <div class="tequan_xz">
                <el-radio-group v-model="radio" @change="open(item)">
                  <el-radio :label="item.id">&nbsp;</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
        <div class="addressMask_bottom">
          <div
            class="tt_an1"
            style="font-size: 16px; color: #000000"
            @click="iShow = false"
          >
            {{ $t('cutInvoice.qx') }}
          </div>
          <div class="tt_an2" style="font-size: 16px" @click="sub()">
            {{ $t('cutInvoice.qd') }}
          </div>
        </div>
      </div>
    </div>

    <div class="addressMask" v-if="yuepayFlag">
      <div style="height: auto">
        <div class="addressMask_title">
          {{ $t('cutInvoice.ggfptt') }}
          <i class="el-icon-close" @click="yuepayFlag = false"></i>
        </div>

        <div class="order_Detail">
          <div class="pay_payfs">
            <div class="orderDetail_kep">
              <i class="el-icon-check"></i>
            </div>
            <div class="orderDetail_center_top">
              {{ $t('cutInvoice.kpcg') }}
            </div>
          </div>
        </div>
        <div class="addressMask_bottom">
          <div
            class="div_four"
            style="font-size: 13px"
            @click="toUrl('/my/my/invoiceManagement')"
          >
            {{ $t('cutInvoice.fhfp') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    let validatePass3 = (rule,value,callback) => {
    //
      console.log('8148148148',/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/i.test(value));
      if(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/i.test(value)){
        callback();
      }else{
        callback(new Error(this.$t('cutInvoice.qsrzqddzyx')));
      }
    }
    return {
      id: '',
      email: '', //电子邮箱
      kep: {},
      radio: '',
      tableList: [],
      type: '',
      iShow: false,
      yuepayFlag: false,
      sno: '',
      z_price: '', //总金额
      arr: '',
      pc_user: {},
      ruleForm: {
        type: 1, //抬头类型 1.企业 2.个人
        company_name: '', //公司名称
        company_tax_number: '', //个人抬头
        companyTaxNumber: '' ,//公司税号
        email:"",//email
      },
      rules: {
        email: [{ required: true, message: this.$t('cutInvoice.qsrdzyx'), trigger: 'blur' },
                {validator:validatePass3,trigger: "blur" }
      ]
      }
    }
  },
  mounted () {
    this.$emit('pageTitle', this.$t('addInvoice.fpgl'))
    this.pc_user = this.$cookies.get('pc_user')
    if (this.$route.query.z_price) {
      this.z_price = this.$route.query.z_price
    }
    console.log('168168168',this.$route.query);
    if (this.$route.query.sNo) {
      this.sno = this.$route.query.sNo
    }
    if (this.$route.query.email) {
      this.email = this.$route.query.email
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.axios()
    this.getApi()
  },
  methods: {
    axios () {
      var data = {
        // api: 'app_pc.invoiceHeader.getDefault',
        api:"mall.InvoiceHeader.getDefault",
        access_id: this.pc_user.access_id
      }

      this.$Api.doRequest(data)
        .then(res => {
          console.log('res', res)
          if (res.data.type == 1) {
            this.type = '企业单位'
          } else if (res.data.type == 2) {
            this.type = '个人开票'
          }
          this.ruleForm = res.data
          if(this.email){
            // this.ruleForm.email = this.email
            this.$set(this.ruleForm,'email',this.email)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    kep_open () {
      this.iShow = true
      if (this.tableList != '') {
        this.radio = this.tableList.find(item => item.is_default === 1).id
      }
    },
    toUrl (url) {
      this.$router.push({
        path: url
      })
    },
    //弹窗点击赋值
    open (row) {
      console.log('row', row)
      this.kep = row
    },
    spist (row) {
      this.radio = row.id
      this.kep = row
    },
    sub () {
      this.iShow = false
      if (this.kep.type == 1) {
        this.type = '企业单位'
      } else if (this.kep.type == 2) {
        this.type = '个人开票'
      }
      console.log('this.kep.type', this.kep.type)

      console.log('type', this.type)
      this.ruleForm.company_name = this.kep.company_name
      this.ruleForm.company_tax_number = this.kep.company_tax_number
      this.ruleForm.id = this.kep.id
    },
    getApi () {
      let data = {
        // api: 'app_pc.invoiceHeader.doRequest',
        api:"mall.InvoiceHeader.doRequest",
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data).then(res => {
        this.tableList = res.data.list
        console.log('tableList', this.tableList)
      })
    },
    submitForm () {
      if (this.type == '企业单位') {
        this.ruleForm.type = 1
      } else if (this.type == '个人开票') {
        this.ruleForm.type = 2
      }
      this.$refs[`ruleForm`].validate(async (valid) => {
        if(valid){
          console.log('xxxx',valid);
          var data = {
            // api: 'app_pc.invoiceInfo.applyInvoicing',
            api:"mall.InvoiceInfo.applyInvoicing",

            id: this.id,
            headId: this.ruleForm.id, // 发票抬头id
            type: this.ruleForm.type, //抬头类型 1.企业 2.个人
            companyName: this.ruleForm.company_name, //公司名称(抬头名称)
            companyTaxNumber: this.ruleForm.company_tax_number, //公司税号
            amount: this.z_price,
            sNo: this.sno,
            email: this.ruleForm.email
          }

          this.$Api
            .doRequest(data)
            .then(res => {
              console.log('res', res)
              if (res.code == 200) {
                this.yuepayFlag = true
                this.axios()
              }
            })
            .catch(error => {
              this.$message.error(error.message)
            })
        }else{
          // this.yuepayFlag = true
        }
      })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/cutInvoice.css';
</style>
