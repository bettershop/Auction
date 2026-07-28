<template>
  <div id="app">
    <input type="hidden" name="pageTitle" :value="$t('addInvoice.fpgl')" />
    <div class="my-title">
      <p>{{ $t('addInvoice.tjfptt') }}</p>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('addInvoice.kplx')">
        <el-radio-group v-model="ruleForm.type">
          <el-radio :label="1">{{ $t('addInvoice.qydw') }}</el-radio>
          <el-radio :label="2">{{ $t('addInvoice.grkp') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('addInvoice.gsmc')"
        prop="companyName"
        v-if="ruleForm.type == 1"
      >
        <el-input
          maxlength="30"
          v-model="ruleForm.companyName"
          :placeholder="$t('addInvoice.srgsmc')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('addInvoice.ttmc')"
        prop="ttname"
        v-if="ruleForm.type == 2"
      >
        <el-input
          maxlength="30"
          v-model="ruleForm.ttname"
          :placeholder="$t('addInvoice.qsrttmc')"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="$t('addInvoice.gssh')"
        prop="companyTaxNumber"
        v-if="ruleForm.type == 1"
      >
        <el-input
          maxlength="30"
          v-model="ruleForm.companyTaxNumber"
          :placeholder="$t('addInvoice.qsrsh')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('addInvoice.zcdz')" v-if="ruleForm.type == 1">
        <el-input
          v-model="ruleForm.registerAddress"
          :placeholder="$t('addInvoice.qsrzcdz')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('addInvoice.zcdh')" v-if="ruleForm.type == 1">
        <el-input
          v-model="ruleForm.registerPhone"
          :placeholder="$t('addInvoice.qsrzcdh')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('addInvoice.khyh')" v-if="ruleForm.type == 1">
        <el-input
          v-model="ruleForm.depositBank"
          :placeholder="$t('addInvoice.qsrkhyh')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('addInvoice.yhzh')" v-if="ruleForm.type == 1">
        <el-input
          v-model="ruleForm.bankNumber"
          :placeholder="$t('addInvoice.qsryhzh')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('addInvoice.swmr')">
        <el-switch
          active-value="1"
          inactive-value="0"
          active-color="#d42732"
          v-model="ruleForm.isDefault"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div class="bottomBtn">
      <el-button type="danger" @click="submitForm()">{{
        $t('common_button[1]')
      }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      arr: '',
      pc_user: {},
      ruleForm: {
        type: 1, //抬头类型 1.企业 2.个人
        companyName: '', //公司名称
        ttname: '', //个人抬头
        companyTaxNumber: '', //公司税号
        registerAddress: '', //注册地址
        registerPhone: '', //注册电话
        depositBank: '', //开户银行
        bankNumber: '', //银行卡账号
        isDefault: '1' //是否默认 0.否 1.是
      },
      rules: {
        companyName: [{ required: true, message: ' ', trigger: 'blur' }],
        companyTaxNumber: [{ required: true, message: ' ', trigger: 'blur' }],
        ttname: [{ required: true, message: ' ', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.$emit('pageTitle', this.$t('addInvoice.fpgl'))
    this.pc_user = this.$cookies.get('pc_user')
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getApi()
    }
  },
  methods: {
    getApi () {
      var data = {
        // api: 'app_pc.invoiceHeader.doRequest',
        api:"mall.InvoiceHeader.doRequest",

        id: this.id
      }
      this.$Api.doRequest(data).then(res => {
        this.ruleForm.type = res.data.list[0].type
        this.ruleForm.isDefault = res.data.list[0].is_default.toString()
        if (this.ruleForm.type == 1) {
          this.ruleForm.companyName = res.data.list[0].company_name
          this.ruleForm.companyTaxNumber = res.data.list[0].company_tax_number
          this.ruleForm.registerAddress = res.data.list[0].register_address
          this.ruleForm.registerAddress = res.data.list[0].register_address
          this.ruleForm.registerPhone = res.data.list[0].register_phone
          this.ruleForm.depositBank = res.data.list[0].deposit_bank
          this.ruleForm.bankNumber = res.data.list[0].bank_number
        } else {
          this.ruleForm.ttname = res.data.list[0].company_name
        }
      })
    },
    submitForm () {
      if (this.ruleForm.companyName == '') {
        this.arr = this.ruleForm.ttname
      } else {
        this.arr = this.ruleForm.companyName
      }
      var data = {
        // api: 'app_pc.invoiceHeader.addOrUpdate',
        api:"mall.InvoiceHeader.addOrUpdate",

        //   ...this.ruleForm 暂弃
        id: this.id,
        type: this.ruleForm.type,
        companyName: this.arr,
        companyTaxNumber: this.ruleForm.companyTaxNumber,
        registerAddress: this.ruleForm.registerAddress,
        depositBank: this.ruleForm.depositBank,
        bankNumber: this.ruleForm.bankNumber,
        isDefault: this.ruleForm.isDefault,
        registerPhone: this.ruleForm.registerPhone
      }

      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.$message.success(this.$t('myBankCard.tjcg'))
            setTimeout(() => {
              history.go(-1)
            }, 1000)
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    }
  }
}
</script>
<style scoped>
@import '~/assets/css/my/addInvoice.css';
</style>
