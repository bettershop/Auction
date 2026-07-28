<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="收货地址" />

    <div class="my-title">
      <p>{{ $t('address.Receiving_address') }}</p>
      <div @click="openAddModal">
        {{ $t('address.add_address') }}
        <i class="el-icon-plus"></i>
      </div>
    </div>

    <!-- 地址列表 -->
    <template v-if="!loadFlag && list.length">
      <div class="list" v-for="(item, index) of list" :key="index">
        <div class="list-left">
          <div>
            <span :style="$t('cancel') == 'cancel' ? 'letter-spacing:0;' : ''">
              {{ $t('address.consignee') }}：{{ item.name }}
            </span>
          </div>
          <div style="margin-top: 8px;">
            {{ $t('address.Receiving_address') }}：
            {{
              item.cpc === '86' || item.cpc === '852'
                ? `${item.sheng} ${item.city} ${item.quyu} ${item.address}`
                : `${item.address} ${item.city} ${item.sheng}`
            }}
          </div>
          <span>{{ $t('address.number')}}：{{ item.tel }}</span>
        </div>
        <div class="list-right">
          <div>
            <!-- 修改地址 -->
            <el-link @click.stop="openEditModal(index)" class="t-change"
                     :underline="false">
              {{ $t('address.modify') }}
            </el-link>
            <!-- 删除地址 -->
            <el-link @click.stop="delAdds(index)" class="t-change"
                     style="margin-left: 5px;"
                     :underline="false">
              &nbsp;{{ $t('common_button[0]') }}
            </el-link>
          </div>
          <!-- 默认地址 -->
          <div
            class="t-default"
            v-if="item.is_default == 1"
          >
            &nbsp;{{ $t('address.Default_address') }}
          </div>
          <!-- 设置默认 -->

          <div
            class="t-setDefault"
            @click="setDefault(index)"
            v-else
          >
            {{ $t('address.Set_default') }}
          </div>
        </div>
      </div>
    </template>

    <!-- 空数据提示 -->
    <div v-if="!loadFlag && !list.length" class="noOrder">
      <img :src="noOrder" alt="" />
      <p>{{ $t('address_Tips[0]') }}~</p>
    </div>

    <!-- 引入地址弹窗组件 -->
    <AddressModal
      :visible="modalVisible"
      :is-edit="isEditModal"
      :init-form="currentForm"
      :address-options="addressOptions"
      @close="closeModal"
      @save="handleSaveAddress"
    />
  </div>
</template>

<script>
import AddressModal from '../../../components/address.vue'

export default {
  components: {
    AddressModal
  },
  data () {
    return {
      loadFlag: true,
      pc_user: {},
      list: [],
      // 弹窗相关
      modalVisible: false,
      isEditModal: false,
      currentForm: {},
      // 地址选项
      addressOptions: [],
      noOrder: require('/static/images/no_address.png')
    }
  },
  mounted () {
    this.$emit('pageTitle', '收货地址')
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
    this.getAddressJson()
  },
  methods: {
    // 打开新增弹窗
    openAddModal() {
      this.isEditModal = false
      this.currentForm = {}
      this.modalVisible = true
    },
    // 打开编辑弹窗
    openEditModal(index) {
      const item = this.list[index]
      // 获取地址详情（原有逻辑）
      this.$Api.doRequest({
        api: 'mall.Address.upAddsindex',
        addrId: item.id
      }).then(res => {
        if (res.code == 200) {
          // 组装编辑表单数据
          this.currentForm = {
            addressValue: [res.data.province, res.data.city_id, res.data.county],
            addressDisc: res.data.address.address,
            addressName: res.data.address.name,
            addressTel: res.data.address.tel,
            addressDefault: res.data.address.is_default == 1,
            streetAddress: res.data.address.street_address || '',
            city: res.data.address.city || '',
            province: res.data.address.province || '',
            addrId: res.data.address.id,
            province:res.data.address.sheng,
            zipCode:res.data.address.code,
            countryCode: res.data.address.country_code || res.data.address.cpc || 'CN' // 区号（需后端返回）
          }
          this.isEditModal = true
          this.modalVisible = true
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    // 关闭弹窗
    closeModal() {
      this.modalVisible = false
    },
    // 保存地址（组件回调）
    handleSaveAddress(submitData) {
      // 补充公共参数
      submitData.access_id = this.pc_user.access_id
      submitData.language = this.$cookies.get('currentLang')

      this.$Api.doRequest(submitData).then(res => {
        if (res.code == 200) {
          this.$message.success(this.$t('address_Tips[11]'))
          this.modalVisible = false
          // 处理返回的地址列表
          if (res.data && res.data.length) {
            res.data.filter(item => {
              item.tel = item.tel.substr(0, 3) + '****' + item.tel.substr(7, 11)
            })
            this.list = res.data
          }
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    /*
      删除地址
    */
    delAdds (index) {
      this.$confirm(
        this.$t('delAddress'),
        this.$t('invoiceManagement.ts'),
        {
          confirmButtonText: this.$t('invoiceManagement.qd'),
          cancelButtonText: this.$t('invoiceManagement.qx'),
          type: 'warning'
        }
      ).then(() => {
        this.$Api.doRequest({
          api: 'mall.Address.delAdds',
          addr_id: this.list[index].id
        }).then(res => {
          if (res.code == 200) {
            this.$message.success(this.$t('home_Tips[0]'))
            this.list = res.data
          }
        }).catch(error => {
          this.$message.error(error.message)
        })
      })
    },
    /*
      设为默认地址
    */
    setDefault (index) {
      if (this.list[index].is_default == 1) return
      this.$Api.doRequest({
        api: 'mall.Address.setDefault',
        addr_id: this.list[index].id
      }).then(res => {
        if (res.code == 200) {
          this.list = res.data
          this.$message.success(this.$t('address_Tips[5]'))
        }
      }).catch(error => {
        this.$message.error(error.message)
      })
    },
    /*
      查询地址列表
    */
    getApi () {
      this.$Api.doRequest({
        api: 'mall.Address.index',
        access_id: this.pc_user.access_id,
        language: this.$cookies.get('currentLang')
      }).then(res => {
        if (res.code == 200) {
          this.loadFlag = false
          let adds = res.data.adds || []
          if (adds.length > 0) {
            // 手机号脱敏
            adds.filter(item => {
              item.tel = item.tel.substr(0, 3) + '****' + item.tel.substr(7, 11)
            })
            // 默认地址置顶
            const defaultIndex = adds.findIndex(item => item.is_default == 1)
            if (defaultIndex != -1) {
              const defaultItem = adds[defaultIndex]
              adds.splice(defaultIndex, 1)
              adds.unshift(defaultItem)
            }
          }
          this.list = adds
        }
      }).catch(error => {
        this.loadFlag = false
        this.$message.error(error.message)
      })
    },
    /*
      获取省市区地址
    */
    getAddressJson () {
      this.$Api.doRequest({
        api: 'mall.Address.addressManagement',
        access_id: this.pc_user.access_id,
        language: this.$cookies.get('currentLang')
      }).then(res => {
        this.addressOptions = res.data
      })
    }
  }
}
</script>

<style scoped>
@import '~/assets/css/my/myaddress.css';

/* 空数据样式 */
.noOrder {
  text-align: center;
  padding: 50px 0;
  color: #999;
}
.noOrder img {
  width: 100px;
  margin-bottom: 10px;
}
</style>
