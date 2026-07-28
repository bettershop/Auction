<template>
  <div id="app">
    <input type="hidden" name="pageTitle" value="个人资料" />

    <div class="my-title">
      <p>{{ $t('myinfor.title') }}</p>
    </div>

    <ul v-if="!loadFlag" class="infor">
      <li>
        <div class="infor-left">{{ $t('myinfor.user_avatars') }}</div>
        <div class="headBox">
          <img :src="user.headimgurl" alt="" />
          <span @click="inforMaskFlag = true">{{ $t('myinfor.edit_avatars') }}</span>
        </div>
      </li>
      <li>
        <div
          class="infor-left"
          :style="$t('cancel') == 'cancel' ? 'letter-spacing:0;' : 'letter-spacing: 13px;'"
          style="width: 76px; padding-right: 0"
        >
          {{ $t('myinfor.nickname') }}
        </div>
        <div class="infor-right">
          <el-input v-model="user.user_name" maxlength="8" :placeholder="$t('myinfor.placeholder[0]')"></el-input>
        </div>
      </li>
      <li style="margin: 30px 0">
        <div
          class="infor-left"
          :style="$t('cancel') == 'cancel' ? 'letter-spacing:0;' : 'letter-spacing: 13px;'"
          style="width: 76px; padding-right: 0"
        >
          {{ $t('myinfor.sex') }}
        </div>
        <div class="infor-right">
          <el-radio-group v-model="sex">
            <el-radio :label="1">{{ $t('myinfor.radio[0]') }}</el-radio>
            <el-radio :label="2">{{ $t('myinfor.radio[1]') }}</el-radio>
            <el-radio :label="0">{{ $t('myinfor.radio[2]') }}</el-radio>
          </el-radio-group>
        </div>
      </li>
      <li style="margin: 30px 0">
        <div class="infor-left">{{ $t('myinfor.phone') }}</div>
        <div class="infor-right">
          {{ user.mobile }}
          <div class="disc">
            （{{ $t('myinfor.Tips[0]') }}
            <el-link @click="toUrl('/my/my/security')">{{ $t('myinfor.Account_security') }}</el-link>
            ）
          </div>
        </div>
      </li>
      <li>
        <div class="infor-left">{{ $t('myinfor.birth') }}</div>
        <div class="infor-right">
          <el-date-picker
            :disabled="user.birthday && user.is_default_birthday != 1 ? true : false"
            value-format="yyyy-MM-dd"
            v-model="user.birthday"
            type="date"
            :picker-options="pickerOptions"
            :placeholder="$t('myinfor.placeholder[1]')"
          ></el-date-picker>
        </div>
        <div class="disc">（{{ $t('myinfor.Tips[5]') }}）</div>
      </li>
    </ul>
    <ul v-else class="infor">
      <li>
        <div class="infor-left">{{ $t('myinfor.user_avatars') }}</div>
        <div class="headBox">
          <img class="nonavtitle" src="" alt="" />
        </div>
      </li>
      <li>
        <div class="infor-left" style="letter-spacing: 13px; width: 76px; padding-right: 0">{{ $t('myinfor.nickname') }}</div>
        <div class="infor-right nonavtitle" style="width: 160px; height: 40px"></div>
      </li>
      <li style="margin: 30px 0">
        <div class="infor-left" style="letter-spacing: 13px; width: 76px; padding-right: 0">{{ $t('myinfor.sex') }}</div>
        <div class="infor-right">
          <div class="nonavtitle" style="margin-right: 20px"></div>
          <div class="nonavtitle"></div>
        </div>
      </li>
      <li style="margin: 30px 0">
        <div class="infor-left">{{ $t('myinfor.phone') }}</div>
        <div class="infor-right">
          <span class="nonavtitle" style="width: 105px"></span>
          <div class="disc">
            （{{ $t('myinfor.Tips[0]') }}
            <el-link @click="toUrl('/my/my/security')">{{ $t('myinfor.Account_security') }}</el-link>
            ）
          </div>
        </div>
      </li>
      <li>
        <div class="infor-left">{{ $t('myinfor.birth') }}</div>
        <div class="infor-right nonavtitle" style="width: 160px; height: 40px"></div>
      </li>
    </ul>

    <div class="bottomBtn">
      <el-button type="danger" @click="saveOk">{{ $t('common_button[1]') }}</el-button>
    </div>

    <!-- 编辑头像 -->
    <div class="mask" v-if="inforMaskFlag">
      <div class="inforMask">
        <div class="mask_title">
          {{ $t('myinfor.set_avatars') }}
          <i class="el-icon-close" @click="inforMaskFlag = false; upimgUrl = ''"></i>
        </div>
        <div class="inforMask_content">
          <el-button :style="{ display: upimgUrl ? 'none' : '' }">
            <i class="el-icon-plus"></i>
            {{ $t('myinfor.click') }}
            <input type="file" name="upimg" id="upimg" @change="upimg" accept="image/*" />
          </el-button>
          <div class="upimgdiv" v-if="upimgUrl">
            <img :src="upimgUrl" alt="" />
            <i class="el-icon-close" @click="removeUpimg"></i>
          </div>
          <p>{{ $t('myinfor.Tips[1]') }}</p>
        </div>
        <div class="mask_btnBox">
          <a href="javascript:;" @click="inforMaskFlag = false; upimgUrl = ''">{{ $t('cancel') }}</a>
          <a href="javascript:;" @click="saveImg">{{ $t('common_button[1]') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > Date.now() - 8.64e6
        }
      },
      loadFlag: true,
      pc_user: {},
      zhanghao: '',
      sex: undefined,
      birthday: '',
      shengArr: [],
      shiArr: [],
      xianArr: [],
      inforMaskFlag: false,
      user: {},
      upimgUrl: '',
      cacheFile: null // 唯一的文件流存储源，必用这个
    }
  },
  mounted() {
    this.$emit('pageTitle', '个人资料')
    this.pc_user = this.$cookies.get('pc_user')
    this.getApi()
  },
  methods: {
    removeUpimg() {
      this.upimgUrl = ''
      this.cacheFile = null // 清空预览图时，同步清空文件缓存，符合用户操作逻辑
    },
    saveImg() {
      console.log("saveImg", this.cacheFile); // 此时打印能看到完整的文件对象，不再是空
      // ========== 核心改动1：只校验缓存的文件，不再校验upimgUrl ==========
      if (!this.cacheFile) {
        this.$message.error(this.$t('myinfor.Tips[2]'))
        return
      }
      var data = new FormData()
      // ========== 核心改动2：直接用缓存的文件，彻底抛弃DOM获取，百分百有值 ==========
      data.append('file', this.cacheFile)
      data.append('access_id', this.pc_user.access_id)

      this.$upImg(data)
        .then(res => {
          if (res.code == 200) {
            this.$set(this.user, 'headimgurl', res.data.url)
            this.$message.success(this.$t('myinfor.Tips[4]'))
            this.inforMaskFlag = false
            this.upimgUrl = ''
            this.cacheFile = null // 上传成功后清空缓存
          }
        })
        .catch(error => {
          this.$message.error(error.message)
        })
    },
    upimg(e) {
      console.log("upimg!!!!!!!!!!!!")
      // ========== 核心改动3：100%从事件对象e拿文件，这是唯一可靠的方式 ==========
      const file = e.target.files[0];
      // 无文件直接返回
      if (!file) return;

      // 保留你原有的所有文件格式校验逻辑，一行没改，完全兼容你的业务
      var upname = file.name;
      if (
        !upname.includes('JPG') && !upname.includes('jpg') &&
        !upname.includes('JPEG') && !upname.includes('jpeg') &&
        !upname.includes('BMP') && !upname.includes('bmp') &&
        !upname.includes('PNG') && !upname.includes('png')
      ) {
        this.$message.error(this.$t('myinfor.Tips[3]'))
        return;
      }

      // ========== 核心改动4：立刻把文件存入缓存，一步到位，无任何丢失可能 ==========
      this.cacheFile = file;

      console.log("cacheFile")

      // 保留你原有的预览逻辑，不变
      var reads = new FileReader()
      reads.readAsDataURL(file)
      reads.onload = e => {
        this.upimgUrl = e.target.result
      }
    },
    getApi() {
      var data = {
        api: 'mall.User.personalResources',
        access_id: this.pc_user.access_id
      }
      data.language = this.$cookies.get('currentLang')
      this.$Api.doRequest(data)
        .then(res => {
          this.loadFlag = false
          this.sex = res.data.sex ? Number(res.data.sex) : 0
          this.user = res.data
        })
        .catch(error => {
          this.loadFlag = false
          this.$message.error(error.message)
        })
    },
    toUrl(url) {
      this.$router.push(url)
    },
    saveOk() {
      var data = {
        api: 'mall.User.setPersonalResources',
        headimgurl: this.user.headimgurl,
        userName: this.user.user_name,
        sex: this.sex,
        birthday: this.user.birthday
      }
      data.language = this.$cookies.get('currentLang')
      this.$Api.doRequest(data).then(res => {
        if (res.code == 200) {
          this.$message.success(this.$t('myinfor.Tips[4]'))
          this.getApi()
        } else {
          this.$message.error(res.msg || this.$t('myinfor.Tips[操作失败]'))
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
@import '@/assets/css/my/myinfor.css';
</style>
