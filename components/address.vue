<template>
  <div class="addressMask-box" v-if="visible">
    <div>
      <div class="addressMask_title">
        {{ isEdit ? $t('address.edit') : $t('address.add') }}{{ $t('address.Receiving_address') }}
        <i class="el-icon-close" @click="handleClose"></i>
        </div>

      <div class="addressMask_content">
        <!-- 收货人姓名 -->
        <div class="addressMask_content_item">
          <div>{{ $t('address.consignee2') }}</div>
          <el-input
            type="text"
            maxlength="10"
            v-model="form.addressName"
            class="addressMask_content_item_right"
            :placeholder="$t('address_Tips[3]')"
            clearable
          />
        </div>
        <!-- 手机号码 + 国家区号选择 -->
        <div class="addressMask_content_item">
          <div>{{ $t('address.phone') }}</div>
          <!-- 国家区号选择器 -->
          <div class="phone-input-group">
            <div
              class="country-select-trigger"
              @click="toggleCountrySelect"
              @blur="handleTriggerBlur"
            >
              <img
                :src="selectedCountry.national_flag || chinaImg"
                alt=""
                class="country-flag"
              />
              <span class="country-name">
                {{ selectedCountry.name?.slice(0, 5) || '中国' }}...
              </span>
              <span class="country-code">{{ selectedCountry.code2 || '+86' }}</span>
              <i class="el-icon-arrow-down country-arrow"></i>
            </div>
            <!-- 区号下拉面板 -->
            <div
              class="country-select-panel"
              v-show="isCountrySelectOpen"
              ref="countryPanel"
            >
              <div class="country-search">
                <i class="el-icon-search"></i>
                <input
                  type="text"
                  v-model="countrySearchKey"
                  placeholder="请选择国家/地区"
                  @input="filterCountries"
                  @blur="handlePanelBlur"
                />
              </div>
              <div class="country-list">
                <div
                  class="country-item"
                  v-for="country in filteredCountries"
                  :key="country.code"
                  @mousedown="selectCountry(country)"
                >
                  <img
                    :src="country.national_flag || chinaImg"
                    alt=""
                    class="country-item-flag"
                  />
                  <span class="country-item-name">
                    {{ country.name }} ({{ country.code2 }})
                  </span>
                </div>
              </div>
            </div>
            <!-- 手机号输入框 -->
            <el-input
              type="text"
              v-model="form.addressTel"
              @input="form.addressTel=form.addressTel.replace(/[^\d]/g, '')"
              class="address-tel-input"
              :placeholder="$t('address_Tips[4]')"
              clearable
            />
          </div>
        </div>

        <!-- 所在地区 -->
        <div class="addressMask_content_item" v-if="international">
          <div>{{ $t('address.Location') }}</div>
          <el-cascader
            class="addressMask_content_item_right"
            v-model="form.addressValue"
            :options="addressOptions"
            :placeholder="$t('address_Tips[1]')"
          ></el-cascader>
        </div>

        <!-- 详细地址 -->
        <div class="addressMask_content_item" v-if="international">
          <div>{{ $t('address.Detailed_address') }}</div>
          <el-input
            class="addressMask_content_item_right"
            v-model="form.addressDisc"
            maxlength="50"
            type="textarea"
            :rows="3"
            :placeholder="$t('address_Tips[2]')"
            style="height: 75px"
          />
        </div>

        <!-- 街道地址 -->
        <div class="addressMask_content_item" v-if="!international">
          <div>{{$t('jddz')}}</div>
          <el-input
            maxlength="50"
            type="textarea"
            :rows="3"
            v-model="form.addressDisc"
            style="height: 75px"
            class="addressMask_content_item_right jddz"
            :placeholder="$t('qsrjddz')"
          />
        </div>

        <!-- 所在城市 -->
        <div class="addressMask_content_item" v-if="!international">
          <div>{{$t('szcs')}}</div>
          <el-input
            type="text"
            maxlength="10"
            v-model="form.city"
            class="addressMask_content_item_right"
            :placeholder="$t('qsrszcs')"
            clearable
          />
        </div>

        <!-- 州/省/地区 -->
        <div class="addressMask_content_item" v-if="!international">
        <div>{{$t('zsdq')}}</div>
          <el-input
            type="text"
            maxlength="10"
            v-model="form.province"
            class="addressMask_content_item_right"
            :placeholder="$t('qsrzsdq')"
            clearable
          />
        </div>

        <!-- 邮政编码 -->
        <div class="addressMask_content_item">
          <div>{{$t('yzbm')}}</div>
          <el-input
            type="text"
            maxlength="10"
            v-model="form.zipCode"
            class="addressMask_content_item_right"
            :placeholder="$t('qsryzbm')"
            clearable
          />
        </div>

        <!-- 设置默认地址 -->
        <el-checkbox v-model="form.addressDefault" style="margin-left: 76px">
          {{ $t('address.set_address') }}
        </el-checkbox>
      </div>

      <div class="addressMask_bottom">
        <div class="mask_btnBox_href1" @click="handleClose">{{ $t('cancel') }}</div>
        <div class="mask_btnBox_href2" @click="handleSave">{{ $t('confirm') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddressModal',
  props: {
    // 弹窗显隐
    visible: {
      type: Boolean,
      default: false
    },
    // 是否为编辑模式
    isEdit: {
      type: Boolean,
      default: false
    },
    // 编辑模式下的初始数据
    initForm: {
      type: Object,
      default: () => ({})
    },
    // 省市区地址选项
    addressOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 表单数据
      form: {
        addressValue: '', // 所在地区
        addressDisc: '', // 详细地址
        addressName: '', // 收货人姓名
        addressTel: '', // 手机号
        addressDefault: false, // 是否默认地址
        city: '', // 所在城市
        province: '', // 州/省/地区
        zipCode: '', // 邮政编码
        addrId: '' // 编辑时的地址ID
      },
      // 国家区号相关
      selectedCountry: {
        code2: '86',
        dialCode: '+86',
        national_flag: require('/static/images/china.png'),
        name: '中国'
      },
      countries: [],
      filteredCountries: [],
      countrySearchKey: '',
      isCountrySelectOpen: false,
      chinaImg: require('/static/images/china.png'),
      // 缓存用户信息
      pc_user: {},
      international:false
    }
  },
  watch: {
    // 监听选中国家变化
    selectedCountry:{
      handler(val){
        if(val.code2=='86' || val.code2=='852'){
          this.international=true
        }else{
          this.international=false
        }
      },
      immediate:true,
      deep:true
    },
    // 监听显隐状态，初始化表单
    visible(val) {
      if (val) {
        this.initFormData()
        // 加载国家区号列表
        // this.getItuList()
      } else {
        this.resetForm()
      }
    },
    // 监听初始数据变化（编辑模式）
    initForm: {
      handler(val) {
        if (this.visible && this.isEdit) {
          this.initFormData()
        }
      },
      deep: true
    }
  },
  created() {
    this.getItuList()
  },
  mounted() {
    this.pc_user = this.$cookies.get('pc_user')
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      if (this.isEdit && this.initForm) {
        this.form = {
          addressValue: this.initForm.addressValue || '',
          addressDisc: this.initForm.addressDisc || '',
          addressName: this.initForm.addressName || '',
          addressTel: this.initForm.addressTel || '',
          addressDefault: this.initForm.addressDefault || false,
          city: this.initForm.city || '',
          province: this.initForm.province || '',
          zipCode: this.initForm.zipCode  ,
          addrId: this.initForm.addrId || ''
        }
        console.log(this.initForm)
        if (this.initForm.countryCode) {
          this.selectedCountry = this.countries.find(item => item.code2 == this.initForm.countryCode) || this.selectedCountry
        }
      } else {
        this.resetForm()
      }
    },
    // 重置表单
    resetForm() {
      this.form = {
        addressValue: '',
        addressDisc: '',
        addressName: '',
        addressTel: '',
        addressDefault: false,
        city: '',
        province: '',
        zipCode: '',
        addrId: ''
      }
      const s = this.$storage.get("cpc") || '86'
      this.selectedCountry = this.countries.find(item => item.code2 == s)
      this.countrySearchKey = ''
      this.isCountrySelectOpen = false
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('close')
    },
    // 保存地址
    handleSave() {
      // 表单校验
      if (!this.form.addressDisc) {
        this.$message.error(this.$t('address_Tips[7]'))
        return
      }
      if (!this.form.addressName) {
        this.$message.error(this.$t('address_Tips[8]'))
        return
      }
      if (!this.checkval(this.form.addressName)) {
        this.$message.error(this.$t('address_Tips[9]'))
        return
      }
      if (!this.form.addressTel) {
        this.$message.error(this.$t('address_Tips[10]'))
        return
      }

      // 组装提交数据
      const submitData = {
        address: this.form.addressDisc,
        user_name: this.form.addressName,
        mobile: this.form.addressTel,
        is_default: this.form.addressDefault ? 1 : 0,
        country_code: this.selectedCountry.code2, // 新增：传递国家区号
        city: this.form.city,
        province: this.form.province,
        zip_code: this.form.zipCode,
        country_num: this.selectedCountry.num3,
        cpc: this.selectedCountry.code2,
      }

      const cpcValue = this.selectedCountry.code2;
      console.log("cpcValue",cpcValue)
      if (cpcValue === '86' || cpcValue === '852') {
        submitData.place = this.form.addressValue ? this.form.addressValue.join(',') : '';
      }
      // 编辑模式
      if (this.isEdit) {
        submitData.api = 'mall.Address.upAdds'
        submitData.addr_id = this.form.addrId
      } else {
        submitData.api = 'mall.Address.saveAddress'
      }

      this.$emit('save', submitData)
    },
    // 姓名校验
    checkval(str) {
      const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
      return reg.test(str)
    },
    // ======= 国家区号选择相关方法 =======
    // 切换区号下拉面板
    toggleCountrySelect() {
      this.isCountrySelectOpen = true
      if (this.isCountrySelectOpen) {
        this.countrySearchKey = ''
        this.filteredCountries = [...this.countries]
        this.$nextTick(() => {
          const searchInput = this.$refs.countryPanel?.querySelector('input')
          searchInput?.focus()
        })
      }
    },
    // 触发框失焦关闭面板
    handleTriggerBlur() {
      setTimeout(() => {
        const panel = this.$refs.countryPanel
        if (!panel?.contains(document.activeElement)) {
          this.isCountrySelectOpen = false
        }
      }, 200)
    },
    // 搜索框失焦关闭面板
    handlePanelBlur() {
      this.isCountrySelectOpen = false
    },
    // 过滤国家列表
    filterCountries() {
      const key = this.countrySearchKey.trim().toLowerCase()
      this.filteredCountries = key
        ? this.countries.filter(item =>
            item.name?.toLowerCase().includes(key) ||
            item.code2?.includes(key)
          )
        : [...this.countries]
    },
    // 选择国家
    selectCountry(country) {
      this.selectedCountry = country
      if (this.selectedCountry.code2 == '86' || this.selectedCountry.code2 == '852') {
        this.international = true
      } else {
        this.international = false
      }
      this.isCountrySelectOpen = false
      this.$nextTick(() => {
        document.querySelector('.address-tel-input')?.focus()
      })
    },
    // 获取国家区号列表
    getItuList() {
      if (this.countries.length) return
      this.$Api.doRequest({
        api: 'mall.Login.getItuList',
        keyword: ''
      }).then(res => {
        if (res.code == 200) {
          this.countries = res.data
          this.filteredCountries = res.data
           const s = this.$storage.get("cpc") || '86'
          this.selectedCountry = this.countries.find(item => item.code2 == s)
          console.log(this.selectedCountry ,'this.selectedCountry ')
          if (this.selectedCountry.code2 == '86' || this.selectedCountry.code2 == '852') {
            this.international = true
          } else {
            this.international = false
          }
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    }
  }
}
</script>

<style scoped>
 .jddz /deep/ .el-textarea__inner::placeholder {
  /* 自定义字体样式，按需修改 */
  font-size: 12px;        /* 字体大小 */
  color: #ccc;         /* 字体颜色 */
  font-weight: 700 !important;       /* 字体粗细 */
}
/* 弹窗基础样式 */
.addressMask-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.addressMask-box > div {
  background: #fff;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  padding: 20px;
}
.addressMask_title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addressMask_title i {
  cursor: pointer;
  font-size: 20px;
  color: #999;
}
.addressMask_content {
  margin-bottom: 20px;
}
.addressMask_content_item {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
}
.addressMask_content_item > div:first-child {
  width: 96px;
  line-height: 32px;
  text-align: right;
  padding-right: 10px;
  color: #333;
}
.addressMask_content_item_right {
  flex: 1;
}
.addressMask_bottom {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.mask_btnBox_href1, .mask_btnBox_href2 {
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
}
.mask_btnBox_href1 {
  background: #f5f5f5;
  color: #666;
}
.mask_btnBox_href2 {
  background: #d4282d;
  color: #fff;
}

/* 手机号+区号选择器样式 */
.phone-input-group {
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 40px;
  flex: 1;
  position: relative;
}
.country-select-trigger {
  display: flex;
  align-items: center;
  padding: 0 8px;
  height: 100%;
  cursor: pointer;
  border-right: 1px solid #dcdfe6;
  min-width: 100px;
}
.country-flag {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}
.country-name {
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 4px;
}
.country-code {
  font-size: 12px;
  color: #333;
  margin-right: 4px;
}
.country-arrow {
  font-size: 10px;
  color: #999;
}
.country-select-panel {
  position: absolute;
  top: 40px;
  left: 0;
  width: 200px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  z-index: 9999;
}
.country-search {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
}
.country-search i {
  font-size: 14px;
  color: #999;
  margin-right: 8px;
}
.country-search input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 4px 0;
}
.country-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
}
.country-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}
.country-item:hover {
  background-color: #f5f7fa;
}
.country-item-flag {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}
.country-item-name {
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.address-tel-input {
  flex: 1;
  height: 100%;
  border: none;
  padding: 0 12px;
  outline: none;
  font-size: 14px;
  border-radius: 0;
}
.address-tel-input /deep/ .el-input__inner {
  border: none;
  padding: 0;
  height: 100%;
}
</style>
