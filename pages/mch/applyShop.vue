<template>
  <div id="applyContainer">
    <div class="applyContent">
      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[0]") }}
        </div>
        <div class="apply_row_right">
          <el-input
            maxlength="14"
            :placeholder="$t('applyShop.placeholder[0]')"
            @blur="blurName"
            v-model="form.name"
          ></el-input>
        </div>
      </div>

      <div class="apply_row">
        <div class="apply_row_left">
          <!-- <span class="must">*</span> -->
          {{ $t("applyShop.label[1]") }}
        </div>
        <div class="apply_row_right">
          <el-input
            maxlength="50"
            type="textarea"
            :placeholder="$t('applyShop.placeholder[1]')"
            v-model="form.shop_information"
          ></el-input>
        </div>
      </div>
      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[13]") }}
        </div>
        <div class="apply_row_right">
          <el-select
            style="width: 100%; line-height: 36px"
            v-model="form.cid"
            :placeholder="$t('applyShop.placeholder[8]')"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[2]") }}
        </div>
        <div class="apply_row_right">
          <el-input
            maxlength="50"
            :placeholder="$t('applyShop.placeholder[2]')"
            v-model="form.shop_range"
          ></el-input>
        </div>
      </div>

      <div class="apply_hr"></div>

      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[3]") }}
        </div>
        <div class="apply_row_right">
          <el-input
            maxlength="10"
            :placeholder="$t('applyShop.placeholder[3]')"
            v-model="form.realname"
          ></el-input>
        </div>
      </div>
      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[4]") }}
        </div>
        <div class="apply_row_right">
          <el-input
            :placeholder="$t('applyShop.placeholder[4]')"
            v-model="form.ID_number"
          ></el-input>
        </div>
      </div>
      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[5]") }}
        </div>
        <div class="apply_row_right">
          <el-input
            type="number"
            :placeholder="$t('applyShop.placeholder[5]')"
            v-model="form.tel"
          ></el-input>
        </div>
      </div>
      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[6]") }}
        </div>
        <div class="apply_row_right">
          <el-cascader
            class="addressMask_content_item_right"
            v-model="form.city_all"
            @change="aaa($event)"
            :options="addressOptions"
            :placeholder="$t('applyShop.placeholder[6]')"
            style="width: 100%; line-height: 36px"
          ></el-cascader>
        </div>
      </div>

      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[7]") }}
        </div>
        <div class="apply_row_right">
          <el-input
            maxlength="50"
            type="textarea"
            v-model="form.address"
            :placeholder="$t('applyShop.placeholder[7]')"
          ></el-input>
        </div>
      </div>

      <div class="apply_hr"></div>

      <div class="apply_row">
        <div class="apply_row_left">
          <span class="must"></span>
          {{ $t("applyShop.label[10]") }}
        </div>
        <div class="apply_row_right">
          <el-radio-group v-model="form.shop_nature" @change="shopChange()">
            <el-radio :label="0">{{ $t("applyShop.radio[0]") }}</el-radio>
            <el-radio :label="1">{{ $t("applyShop.radio[1]") }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="apply_row" v-show="form.shop_nature == 0">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[11]") }}
        </div>
        <div class="apply_row_right">
          <div class="box_f">
            <div class="upImage" style="cursor: default">
              <img src="~/static/images/uploadImg.png" alt="" />
              {{ $t("applyShop.label[9]") }}

              <input
                @click.stop
                @change="uploadImage1"
                type="file"
                accept="image/*"
                name="uploader-input"
                class="uploader-file1"
              />
            </div>
            {{ $t("applyShop.Tips[0]") }}
          </div>
          <div style="display: flex; margin-top: 14px" v-if="img1">
            <div class="upImageBox" @click="deletImage1()">
              <img :src="img1" alt="" />
              <a v-if="img1" href="javascript:;">{{
                $t("common_button[0]")
              }}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="apply_row" v-show="form.shop_nature == 0">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[12]") }}
        </div>
        <div class="apply_row_right">
          <div class="box_f">
            <div class="upImage" style="cursor: default">
              <img src="~/static/images/uploadImg.png" alt="" />
              {{ $t("applyShop.label[9]") }}

              <input
                @click.stop
                @change="uploadImage2"
                type="file"
                accept="image/*"
                name="uploader-input"
                class="uploader-file2"
              />
            </div>
            {{ $t("applyShop.Tips[0]") }}
          </div>
          <div style="display: flex; margin-top: 14px" v-if="img2">
            <div class="upImageBox" @click="deletImage2()">
              <img :src="img2" alt="" />
              <a v-if="img2" href="javascript:;">{{
                $t("common_button[0]")
              }}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="apply_row" v-show="form.shop_nature == 1">
        <div class="apply_row_left">
          <span class="must">*</span>
          {{ $t("applyShop.label[8]") }}
        </div>
        <div class="apply_row_right">
          <div class="box_f">
            <div class="upImage" style="cursor: default">
              <img src="~/static/images/uploadImg.png" alt="" />
              {{ $t("applyShop.label[9]") }}

              <input
                @click.stop
                @change="uploadImage3"
                type="file"
                accept="image/*"
                name="uploader-input"
                class="uploader-file3"
              />
            </div>
            {{ $t("applyShop.Tips[0]") }}
          </div>
          <div style="display: flex; margin-top: 14px" v-if="img3">
            <div class="upImageBox" @click="deletImage3()">
              <img :src="img3" alt="" />
              <a v-if="img3" href="javascript:;">{{
                $t("common_button[0]")
              }}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="apply_row">
        <div class="apply_row_left"></div>
        <div class="apply_row_right">
          <!-- <div
              style="display: flex; margin-top: 14px"
              v-if="form.businessLicense"
            >
              <div class="upImageBox" @click="deletImage()">
                <img :src="form.businessLicense" alt="" />
                <a v-if="form.businessLicense" href="javascript:;">{{ $t('common_button[0]') }}</a>
              </div>
          </div> -->
          <div style="display: flex">
            <el-checkbox v-model="isSee" style="margin-right: 0px">
              {{ $t("applyShop.Tips[1]") }}
            </el-checkbox>
            <a
              @click="agreementFlag = true"
              href="javascript:;"
              style="color: #4184e8; font-size: 14px"
              >《{{
                AgreementName ? AgreementName : $t("applyShop.Tips[2]")
              }}》</a
            >
          </div>
        </div>
      </div>
      <div class="apply_row" style="margin-top: 40px">
        <div class="apply_row_left"></div>
        <div class="apply_row_right">
          <el-button type="danger" @click="saveOk">{{
            $t("applyShop.Move")
          }}</el-button>
        </div>
      </div>

      <div class="mask" v-if="agreementFlag">
        <div class="agreementContent">
          <div class="mask_title">
            {{ AgreementName ? AgreementName : $t("applyShop.Tips[2]") }}
            <i class="el-icon-close" @click="agreementFlag = false"></i>
          </div>

          <div class="agreementContent_item" v-html="AgreementContent"></div>
        </div>
      </div>
    </div>

    <div class="mask" v-if="succseFlag">
      <div class="succseMask">
        <i class="el-icon-success"></i>
        <p>{{ $t("applyShop.Tips[3]") }}</p>
        <span>{{ $t("applyShop.Tips[4]") }}</span>
        <div>
          <el-button type="danger" @click="succseClick">{{
            $t("applyShop.I_know")
          }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tesseract from "tesseract.js";
export default {
  layout: "homeLayout",
  async asyncData({ app, query, $Api }) {
    let pc_user = app.$cookies.get("pc_user");
    let edit = query.edit;
    let data1 = {
      // module: 'app_pc',
      // action: 'address',
      // m: 'AddressManagement',
      api: "mall.Address.addressManagement",

    };
    let data2 = {
      api: "mch.mall.Mch.agreement",

    };
    let [res1, res2] = await Promise.all([
      $Api.doRequest(data1),
      $Api.doRequest(data2),
    ]);
    return {
      pc_user,
      edit,
      addressOptions: res1.data,
      AgreementContent: res2.data.agreement,
      AgreementName: res2.data.name,
    };
  },
  data() {
    return {
      pc_user: {},
      addressOptions: [],
      agreementFlag: false,
      isSee: false,
      AgreementName: "",
      AgreementContent: "",
      form: {
        id: "0",
        name: "",
        cid: "",
        shop_information: "",
        shop_range: "",
        realname: "",
        ID_number: "",
        tel: "",
        city_all: "",
        address: "",
        shop_nature: 0,
        // businessLicense: ''
      },
      options: [],
      succseFlag: false,
      img1: "", //身份证正面
      img2: "", //身份证反面
      img3: "", //营业执照
    };
  },
  watch: {
    "form.tel"(newValue, oldValue) {
      if (newValue.length > 11) {
        let tel = this.form.tel.substr(0, 11);
        this.$set(this.form, "tel", tel);
      }
    },
    img2(newValue, oldValue) {
      if (newValue) {
        // 身份证有效期 验证
        Tesseract.recognize(
          newValue,
          "chi_sim" // 语言 中文
          // {
          //   logger: (info) => console.log(info), // 可选的日志
          // }
        )
          .then(({ data: { text } }) => {
            try {
              const derTiemg = new Date().getTime();
              const regex =
                /(\d{4}(\.|\s)?\d{2}(\.|\s)?\d{2})-(\d{4}(\.|\s)?\d{2}(\.|\s)?\d{2})/;
              console.log(match);
              const match = text.match(regex).filter((v) => v != ".");
              if (match) {
                console.log(match[2]);
                const endTime = new Date(match[2]).getTime();
                if (derTiemg > endTime) {
                  // 身份证有效期 超出当前时间
                  this.$message.error(this.$t("applyShop.sfzgq"));
                }
              } else {
                // 无效图片 识别不到身份证有效期
                this.$message.error(this.$t("applyShop.wxqscsfzfm"));
              }
            } catch (error) {
              console.error(error);
              this.$message.error(this.$t("applyShop.wxqscsfzfm"));
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
  },
  beforeDestroy() {
    this.$root.$emit("iShow_true");
  },
  async mounted() {
    this.$root.$emit("iShow_false");
    this.pc_user = this.$cookies.get("pc_user");
    // this.getAddress()
    // this.getAgreement()
    await this.getClass();
    if (this.$route.query.edit == 1) {
      this.getApi();
    }
  },
  methods: {
    aaa(row) {
      console.log("row", row);
    },
    async getClass() {
      let data = {
        // module: 'app',
        // action: 'index',
        // m: 'mchClass',
        api: "mch.mall.Mch.mchClass",

      };
      await this.$Api.doRequest(data).then((res) => {
        if (res.code == "200") {
          this.options = res.data.list;
        }
      });
    },
    getApi() {
      let data = {
        api: "mch.mall.Mch.continueApply",

      };

      this.$Api.doRequest(data)
        .then((res) => {
          console.log("res", res);
          let arr = res.data.list;
          this.form.id = arr.id;
          this.form.name = arr.name;
          this.form.cid = arr.cid;

          this.form.shop_information = arr.shop_information;
          this.form.shop_range = arr.shop_range;
          this.form.realname = arr.realname;
          this.form.ID_number = arr.id_number;
          this.form.tel = arr.tel;
          let city_all = [];

          if (this.options && this.options.length > 0) {
            this.form.cid =
              this.options
                .map((v) => v.id)
                .findIndex((v) => v == this.form.cid) < 0
                ? this.options[0].id
                : this.form.cid;
          }

          this.addressOptions.filter((items) => {
            if (items.label == arr.sheng) {
              city_all.push(items.value);

              items.children.filter((item) => {
                if (item.label == arr.shi) {
                  city_all.push(item.value);

                  item.children.filter((it) => {
                    if (it.label == arr.xian) {
                      city_all.push(it.value);
                    }
                  });
                }
              });
            }
          });
          this.form.city_all = city_all;
          this.form.address = arr.address;
          this.form.shop_nature = Number(arr.shop_nature);
          // this.form.businessLicense = arr.business_license
          if (this.form.shop_nature == 0) {
            var imgList = res.data.imgUrls.split(",");
            this.img1 = imgList[0];
            this.img2 = imgList[1];
          } else {
            this.img3 = res.data.imgUrls;
          }
          this.isSee = true;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    succseClick() {
      this.succseFlag = false;
      this.$router.push({ path: "/" });
    },
    getAgreement() {
      let data = {
        api: "mch.mall.Mch.agreement",

      };

      this.$Api.doRequest(data).then((res) => {
        this.AgreementContent = res.data.agreement;
        this.AgreementName = res.data.name;
      });
    },
    getAddress() {
      let data = {
        // module: 'app_pc',
        // action: 'address',
        // m: 'AddressManagement',
        api: "mall.Address.addressManagement",

      };

      this.$Api.doRequest(data).then((res) => {
        this.addressOptions = res.data;
      });
    },
    blurName(e) {
      let name = e.target.value;
      if (name) {
        let data = {
          api: "mch.mall.Mch.verifyStoreName",

          name: name, // 店铺名称
        };

        this.$Api
          .doRequest(data)
          .then((res) => {})
          .catch((error) => {});
      }
    },
    uploadImage1(e) {
      var fil = e.target.files;

      var data = new FormData();
      data.append("file", fil[0]);
      data.append("access_id", this.pc_user.access_id);

      this.$upImg(data)
        .then((res) => {
          this.$set(this, "img1", res.data.url);
        })
        .catch((error) => {
          console.log("uploadImage1", error);
        });
    },
    deletImage1() {
      $(".uploader-file1").val("");
      this.img1 = "";
    },
    uploadImage2(e) {
      var fil = e.target.files;

      var data = new FormData();
      data.append("file", fil[0]);
      data.append("access_id", this.pc_user.access_id);

      this.$upImg(data)
        .then((res) => {
          this.$set(this, "img2", res.data.url);
          console.log("img2", this.img2);
        })
        .catch((error) => [this.$message.error(error.message)]);
    },
    deletImage2() {
      $(".uploader-file2").val("");
      this.img2 = "";
    },
    uploadImage3(e) {
      var fil = e.target.files;

      var data = new FormData();
      data.append("file", fil[0]);
      data.append("access_id", this.pc_user.access_id);

      this.$upImg(data)
        .then((res) => {
          this.$set(this, "img3", res.data.url);
          console.log("img3", this.img3);
        })
        .catch((error) => [this.$message.error(error.message)]);
    },
    deletImage3() {
      $(".uploader-file3").val("");
      this.img3 = "";
    },
    shopChange() {
      this.deletImage1();
      this.deletImage2();
      this.deletImage3();
    },
    /*
				匹配非特殊字符
			 */
    checkval(str) {
      var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    saveOk() {
      if (!this.form.name) {
        this.$message.error(this.$t("applyShop.Tips[5]"));
        return;
      }
      if (!this.checkval(this.form.name)) {
        this.$message.error(this.$t("applyShop.Tips[6]"));
        return;
      }
      // if (!this.form.shop_information) {
      //   this.$message.error(this.$t('applyShop.Tips[7]'))
      //   return
      // }
      if (!this.form.cid) {
        this.$message.error(this.$t("applyShop.placeholder[8]"));
        return;
      }
      if (!this.form.shop_range) {
        this.$message.error(this.$t("applyShop.Tips[8]"));
        return;
      }
      if (!this.form.realname) {
        this.$message.error(this.$t("applyShop.Tips[9]"));
        return;
      }
      if (!this.checkval(this.form.realname)) {
        this.$message.error(this.$t("applyShop.Tips[10]"));
        return;
      }
      if (!this.form.ID_number) {
        this.$message.error(this.$t("applyShop.Tips[11]"));
        return;
      }
      if (!this.form.tel) {
        this.$message.error(this.$t("applyShop.Tips[12]"));
        return;
      }

      var reg = /^\d{1,}$/;
      var pattern = new RegExp(reg);

      if (!pattern.test(this.form.tel) || this.form.tel.length < 11) {
        this.$message.error(this.$t("applyShop.Tips[13]"));
        return;
      }

      if (!this.form.city_all) {
        this.$message.error(this.$t("applyShop.Tips[14]"));
        return;
      }
      if (!this.form.address) {
        this.$message.error(this.$t("applyShop.Tips[15]"));
        return;
      }

      if (!this.isSee) {
        this.$message.error(this.$t("applyShop.Tips[16]"));
        return;
      }
      if (this.form.shop_nature == 0) {
        if (this.img1 == "") {
          this.$message({
            message: this.$t("applyShop.qscsfzzm"),
            type: "error",
            offset: 102,
          });
          return;
        }
        if (this.img2 == "") {
          this.$message({
            message: this.$t("applyShop.qscsfzfm"),
            type: "error",
            offset: 102,
          });
          return;
        }
      } else {
        if (this.img3 == "") {
          this.$message({
            message: this.$t("applyShop.qscyyzz"),
            type: "error",
            offset: 102,
          });
          return;
        }
      }
      if (this.form.shop_nature == 1) {
        var imgUrls = this.img3;
      } else if (this.form.shop_nature == 0) {
        var imgUrls = this.img1 + "," + this.img2;
      }
      let data = {
        api: "mch.mall.Mch.apply",

        imgUrls: imgUrls,
        ...this.form,
      };

      let city_all = [];
      this.addressOptions.filter((items) => {
        if (items.value == this.form.city_all[0]) {
          city_all.push(items.label);

          items.children.filter((item) => {
            if (item.value == this.form.city_all[1]) {
              city_all.push(item.label);

              item.children.filter((it) => {
                if (it.value == this.form.city_all[2]) {
                  city_all.push(it.label);
                }
              });
            }
          });
        }
      });

      data.city_all = city_all.join("-");

      this.$Api.doRequest(data)
        .then((res) => {
          if (res.code == "200") {
            this.succseFlag = true;
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
  },
};
</script>
<style scoped>
@import "~/assets/css/mch/applyShop.css";
</style>
