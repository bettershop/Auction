<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="银行卡" />
    <div class="my-title">
      <p>{{ $t('myBankCard.title') }}</p>
    </div>
    <div class="content">
      <div class="MyBand" v-for="(item, index) in bank_list" :key="index">
        <h2>{{ item.Bank_name }}</h2>
        <p>**** **** **** {{ item.Bank_card_number }}</p>
        <div class="MyBand-Operation">
          <el-button
            class="MyBand-default"
            :disabled="item.is_default == 1"
            :class="{ default: item.is_default == 1 }"
            @click="SetDefault(item.id)"
            >{{
              item.is_default == 1
                ? $t('myBankCard.Default')
                : $t('myBankCard.setDefault')
            }}
          </el-button>
          <div>
            <span class="MyBand-modify" @click="Modify(item, true)">{{ $t('myBankCard.editor')}}</span>
            <span class="MyBand-Unbundling" @click="Unbundling(item.id)">{{ $t('myBankCard.unbind')}}</span>
          </div>
        </div>
      </div>
      <div class="addBand" @click="addband">
        <div>
          <i class="el-icon-circle-plus-outline"></i>
        </div>
        <span>{{ $t('myBankCard.addbrand')}}</span>
      </div>
    </div>
    <div class="my_dialog">
      <el-dialog
        :title="tag"
        :visible.sync="dialogVisible"
        width="40%"
        :open="open"
        :before-close="handleClose"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('myBankCard.brandCard')" prop="BnadCard">
            <el-input
              v-model="ruleForm.BnadCard"
              @blur="_getYhName"
              :placeholder="$t('myBankCard.brandCardPH')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('myBankCard.bank')" prop="Band">
            <el-input
              v-model="ruleForm.Band"
              :placeholder="$t('myBankCard.bankPH')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('myBankCard.branch')" prop="Branch">
            <el-input
              v-model="ruleForm.Branch"
              :placeholder="$t('myBankCard.branchPH')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('myBankCard.cardholder')" prop="name">
            <el-input
              v-model="ruleForm.name"
              :placeholder="$t('myBankCard.cardholderPH')"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-checkbox v-model="checked" class="checkdefault">{{ $t('myBankCard.setDefault')}}</el-checkbox>
        <span slot="footer" class="dialog-footer">
          <el-button class="button-cancel" @click="handleClose">{{ $t('myBankCard.cancel')}}</el-button>
          <el-button
            class="button-determine"
            type="primary"
            @click="submitForm('ruleForm')"
            >{{ $t('myBankCard.save')}}</el-button
          >
        </span>
      </el-dialog>
    </div>

    <div class="Unbundling" v-if="isUnbundling">
      <div class="Unbundling-modal">
        <div class="Unbundling-icon">
          <i class="el-icon-warning"></i>
        </div>
        <h2>{{ $t('myBankCard.untieCard') }}</h2>
        <div class="Unbundling-button">
          <el-button
            class="cancel button-cancel"
            @click="isUnbundling = false"
            >{{ $t('myBankCard.cancel') }}</el-button
          >
          <el-button
            class="determine button-determine"
            type="primary"
            @click="determine"
            >{{ $t('myBankCard.confirm') }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      isUnbundling: false,
      ruleForm: {
        BnadCard: '',
        Band: '',
        Branch: '',
        name: ''
      },
      status: '',
      checked: false,
      bank_list: [],
      id: '', //解绑id
      rules: {},
      tag: '添加银行卡'
    }
  },
  watch: {
    ['ruleForm.BnadCard'] (val) {
      this.$nextTick(() => {
        this.ruleForm.BnadCard = val
          .replace(/\s/g, '')
          .replace(/....(?!$)/g, '$& ')
      })
    }
  },
  mounted () {
    this.$emit('pageTitle', '银行卡')
    this.tag = this.$t('myBankCard.addbrand')
    var validateName = (rule, value, callback) => {
      var name = /^[\u4e00-\u9fa5]{2,8}$/
      if (!name.test(value)) {
        callback(new Error(this.$t('myBankCard.validName')))
      } else {
        callback()
      }
    }
    var validateBandCard = (rule, value, callback) => {
      var patt = /^[1-9]{1}\d{15}|\d{18}$/
      value = value.replace(/\s*/g, '')
      console.log(value.replace(/\s*/g, ''))
      if (value.indexOf('*') > -1) {
        return false
      }
      if (!patt.test(Number.parseInt(value))) {
        callback(new Error(this.$t('myBankCard.validCard')))
      } else {
        callback()
      }
    }

    this.rules = {
      name: [
        {
          // required: true,
          message: this.$t('myBankCard.cardholderPH'),
          trigger: 'blur'
        },
        { validator: validateName, trigger: 'blur' }
      ],
      BnadCard: [
        {
          // required: true,
          message: this.$t('myBankCard.brandCardPH'),
          trigger: 'blur'
        },
        { validator: validateBandCard, trigger: 'blur' }
      ],
      Band: [
        {
          // required: true,
          message: this.$t('myBankCard.bankPH'),
          trigger: 'blur'
        }
      ],
      Branch: [
        {
          // required: true,
          message: this.$t('myBankCard.branchPH'),
          trigger: 'blur'
        }
      ]
    }

    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    _getYhName(){
      let data = {
        api:'pc.store.bank.verificationBank',
        bankCardNumber: this.ruleForm.BnadCard.replace(/\s/g, '')
      }
      this.$Api.doRequest(data).then(res => {
        if(res.code == 200){
          this.ruleForm.Band = res.data?.Bank_name||''
        }
      })
    },
    handleClose() {
      this.ruleForm.BnadCard = ''
      this.ruleForm.Band = ''
      this.ruleForm.Branch = ''
      this.ruleForm.name = ''
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
      this.dialogVisible = false;
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = {
            api:'mall.Bank.addBank',

            language:sessionStorage.getItem('language'),
            Cardholder: this.ruleForm.name, //开户人
            Bank_name: this.ruleForm.Band, //银行名称
            branch: this.ruleForm.Branch, //支行名称
            Bank_card_number: this.ruleForm.BnadCard.replace(/\s*/g, ''), //银行卡号
            is_default: this.checked ? '1' : '0'
          }
          if (this.status == 'modify') {
            data.id = this.id
          }
          this.$Api
            .doRequest(data)
            .then(res => {
              if (res.code == 200) {
                this.$refs.ruleForm.resetFields()
                this.dialogVisible = false
                if (this.status == 'modify') {
                  this.$message.success(this.$t('myBankCard.xgcg'))
                }else{
                  this.$message.success(this.$t('myBankCard.tjcg'))
                }
                this.getApi()
              }
            })
            .catch(error => {
              this.$message.error(error.message)
            })
          console.log(this.ruleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    Unbundling (id) {
      this.id = id
      this.isUnbundling = true
    },
    SetDefault (id) {
      var data = {
        api:'mall.Bank.setDefault',

        bankId: id,
        is_default: 1,
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.getApi()
            this.$message.success(this.$t('myBankCard.szcg'))
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    // element dialog打开的窗口的回调
    open () {
      this.$refs.ruleForm.resetFields()
    },
    addband () {
      this.status = 'add'
      this.dialogVisible = true
      this.tag = this.$t('myBankCard.addbrand')
    },
    Modify (item, value) {
      if (value) {
        this.tag = this.$t('myBankCard.bjyhk')
        console.log(123)
      }
      this.id = item.id
      this.status = 'modify'
      var data = {
        api:'mall.Bank.cardDetail',
        id: item.id,
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            let ruleForm = {
              BnadCard: res.data[0].Bank_card_number,
              Band: res.data[0].Bank_name,
              Branch: res.data[0].branch,
              name: res.data[0].Cardholder
            }
            if (res.data[0].is_default == 1) {
              this.checked = true
            } else {
              this.checked = false
            }
            this.ruleForm = ruleForm
          }

          console.log(res)
        })
        .catch(error => {
          this.$message.error(error.message)
        })

      this.dialogVisible = true
    },
    determine () {
      var data = {
        api:'mall.Bank.delBank',

        id: this.id,
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.$message.success(this.$t('myBankCard.sccg'))
            this.getApi()
            this.isUnbundling = false
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    getApi () {
      var data = {
        // module: 'app_pc',
        // action: 'bank',
        // app: 'bank_list',
        api:'mall.Bank.bankList',
        access_id: this.pc_user.access_id
      }
      this.$Api.doRequest(data)
        .then(res => {
          if (res.code == 200) {
            this.bank_list = res.data
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
.content{
    display: flex;
    flex-wrap: wrap;
    padding: 29px 20px;
}
.MyBand{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 0 0 31%;
    height: 140px;
    border: 1px solid #DDDDDD;
    margin-right: 3%;
    margin-bottom: 20px;
}
.MyBand:hover{
    border: 1px solid #D4282D;
}
.MyBand:nth-child(3n+3){
    margin-right: 0;
}
.MyBand h2{
    padding: 14px 10px;
    font-size: 14px;
    font-weight: bold;
    background: #F6F6F6;
    color: #020202;
}
.MyBand p{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: #020202;
}
.MyBand .MyBand-Operation{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 10px;
}
.MyBand .MyBand-Operation .MyBand-default{
    width: 66px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    background: #E6E6E6;
    font-size: 14px;
    font-weight: 400;
    color: #020202;
}
.MyBand .MyBand-Operation .default{
    background: #D4282D;
    color: #ffffff;
}
.MyBand .MyBand-Operation .MyBand-modify{
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: #888888;
}
.MyBand .MyBand-Operation .MyBand-Unbundling{
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: #888888;
    padding-left: 15px;
}

.addBand{
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    flex: 0 0 31%;
    height: 140px;
    border: 1px solid #DDDDDD;
    cursor: pointer;
}
.addBand div{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #4184E8;
    width: 30px;
    height: 30px;
}
.addBand span{
    padding-top: 10px;
    font-size: 14px;
    font-weight: 400;
    color: #4184E8;
}
.addBand:hover{
    border: 1px solid #D4282D;
}
.addBand:hover div{
    color: #D4282D;
}
.addBand:hover span{
    color: #D4282D;
}


.checkdefault{
    margin-left: 100px;
}
.my_dialog >>>.el-dialog__header{
    border-bottom: 1px solid #E6E6E6;
}

.my_dialog >>> .el-dialog__footer{
    background: #F6F6F6;
    padding: 16px 40px;
}
.my_dialog >>> .el-dialog__footer button{
    width: 112px;
    height: 36px;
}

.Unbundling{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 999;
}
.Unbundling .Unbundling-modal{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 420px;
    height: 200px;
    background: #FFFFFF;
}
.Unbundling .Unbundling-modal .Unbundling-icon{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: #D4282D;
    font-size: 36px;
}
.Unbundling .Unbundling-modal h2{
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #020202;
    padding-top: 15px;
}
.Unbundling .Unbundling-modal .Unbundling-button{
    padding-top: 24px;
}
.Unbundling .Unbundling-modal button{
    width: 112px;
    height: 36px;
}
.MyBand .MyBand-modify:hover{
    color: #D4282D;
}
.MyBand .MyBand-Unbundling:hover{
    color: #D4282D;
}
.MyBand .MyBand-default:hover{
    color: #D4282D;
    border: 1px solid #E6E6E6;
}
.MyBand .default:hover{
    color: #ffffff;
    border: 1px solid #DCDFE6;
}


.my_dialog >>> .el-dialog__title{
    font-weight: bold;
}
.my_dialog >>> .el-dialog__close{
    font-size: 20px;
    font-weight: bold;
    color: #999999;
}
.button-cancel:hover{
    color: #D4282D;
    border: 1px solid #D4282D;
    background: #FFF;
}
.button-determine:hover{
    opacity: 0.8;
    background: rgba(212, 40, 45, 0.8);
    border: 1px solid #D4282D;
}
.my_dialog >>> .button-cancel:hover{
    color: #D4282D;
    border: 1px solid #D4282D;
    background: #FFF;
}
.my_dialog >>> .button-determine:hover{
    opacity: 0.8;
    background: rgba(212, 40, 45, 0.8);
    border: 1px solid #D4282D;
}
.my_dialog >>> .el-dialog__body{
    padding: 50px 40px 50px 10px;
}
.my_dialog >>> .el-dialog__header{
    padding: 20px;
}
.el-input input{
    border-radius: 0;
}
.el-form-item__label{
    color: #020202;
}
</style>
