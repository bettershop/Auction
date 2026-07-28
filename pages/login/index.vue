<template>
  <div class="login-container">
    <!-- 其他登录表单元素 -->
    
    <el-form-item label="手机号">
      <div class="phone-input-wrapper">
        <select 
          v-model="selectedCountry" 
          @change="handleCountryChange"
          style="width: 100px; margin-right: 10px; border: 1px solid #dcdfe6; border-radius: 4px 0 0 4px; padding: 8px; background-color: white;"
        >
          <option value="" disabled>请选择国家/地区</option>
          <option
            v-for="country in countries"
            :key="country.code"
            :value="country.code"
          >
            <span style="display: flex; align-items: center;">
              <img :src="country.flag" alt="" style="width: 16px; height: 16px; margin-right: 8px;" />
              {{ country.name }} ({{ country.dialCode }})
            </span>
          </option>
        </select>
        
        <input
          type="text"
          v-model="phoneNumber"
          placeholder="请输入手机号"
          style="flex: 1; border: 1px solid #dcdfe6; border-radius: 0 4px 4px 0; padding: 8px; background-color: white;"
        />
      </div>
    </el-form-item>
    
    <!-- 其他登录表单元素 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCountry: 'CN',
      phoneNumber: '',
      countries: [
        { code: 'CN', name: '中国', dialCode: '+86', flag: 'https://example.com/flags/cn.png', disabled: false },
        { code: 'US', name: '美国', dialCode: '+1', flag: 'https://example.com/flags/us.png', disabled: false },
        { code: 'JP', name: '日本', dialCode: '+81', flag: 'https://example.com/flags/jp.png', disabled: false },
        { code: 'KR', name: '韩国', dialCode: '+82', flag: 'https://example.com/flags/kr.png', disabled: false },
        { code: 'SG', name: '新加坡', dialCode: '+65', flag: 'https://example.com/flags/sg.png', disabled: false },
        { code: 'AU', name: '澳大利亚', dialCode: '+61', flag: 'https://example.com/flags/au.png', disabled: false },
        { code: 'CA', name: '加拿大', dialCode: '+1', flag: 'https://example.com/flags/ca.png', disabled: false },
        { code: 'DE', name: '德国', dialCode: '+49', flag: 'https://example.com/flags/de.png', disabled: false },
        { code: 'FR', name: '法国', dialCode: '+33', flag: 'https://example.com/flags/fr.png', disabled: false },
        { code: 'GB', name: '英国', dialCode: '+44', flag: 'https://example.com/flags/gb.png', disabled: false }
      ]
    }
  },
  methods: {
    handleCountryChange(value) {
      // 当国家选择改变时触发
      console.log('Selected country:', value)
    }
  }
}
</script>

<style scoped>
.phone-input-wrapper {
  display: flex;
  align-items: center;
}

.phone-input-wrapper input {
  border-radius: 4px;
}
</style>