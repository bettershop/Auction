import Api from '@/api/http.js';
import Vue from 'vue'

export default (context, inject) => {

  // 获取一些常用对象
  const { app, store, redirect, $axios } = context
  // 初始化 API 实例
  const api = Api($axios);

  const cookie = app.$cookies;

  /**
   * 用户和商城的货币信息 响应式数据结构
   */
  const currencyInfos = Vue.observable({

    //用户货币信息
    userCurrency: {},
    u_symbol: '￥',
    u_code: 'CNY',
    u_rate: 1,

    //商城货币信息
    storeCurrency: {},
    s_symbol: '￥',
    s_code: 'CNY',
    s_rate: 1,

    //商城用户访问时展示的货币信息
    currentCurrency: {},
    show_symbol: '￥',
    show_code: 'CNY',
    show_rate: 1,


    /**
     * 根据当前是否登录返回当前界面需要展示的货币信息对象
     * @param islogin
     * @returns {null}
     */
    setCurrentCurrencyInfo: function (item) {
      item = item || cookie.get("selectCurrency") || cookie.get("currency") || cookie.get("storeCurrency");
      console.log(item);
      if (!item) {
        console.log("item为空.");
        console.log(item);
        return;
      }

      cookie.set("selectCurrency", item);
      this.currentCurrency = item
      const user = cookie.get("pc_user");
      if (user && Object.keys(user).length > 1) {
        this.setUserCurrency(item);
      }
      this.show_symbol = item.currency_symbol;
      this.show_rate = item.exchange_rate;
      this.show_code = item.currency_code;
    },

    setUserCurrency: function (userCurrency) {
      if (userCurrency) {
        this.userCurrency = userCurrency;
        this.setUsymbole(userCurrency.currency_symbol);
        this.setUrate(userCurrency.exchange_rate);
        this.setUcode(userCurrency.currency_code);
        cookie.set("currency", userCurrency);
      }
    },

    setStoreCurrency: function (storeCurrency) {
      if (storeCurrency) {
        this.storeCurrency = storeCurrency;
        this.setSsymbole(storeCurrency.currency_symbol);
        this.setSrate(storeCurrency.exchange_rate);
        this.setScode(storeCurrency.currency_code);
        cookie.set("storeCurrency", storeCurrency);
      }
    },

    getStoreCurrency: function () {
      return this.storeCurrency;
    },

    getUserCurrency: function () {
      return this.userCurrency;
    },

    setUsymbole: function (u_symbol) {
      this.u_symbol = u_symbol;
    },

    getUsymbole: function () {
      return this.u_symbol;
    },

    setSsymbole: function (s_symbol) {
      this.s_symbol = s_symbol;
    },

    getSsymbole: function () {
      return this.s_symbol;
    },

    setUcode: function (u_code) {
      this.u_code = u_code;
    },

    getUcode: function () {
      return this.u_code;
    },

    setScode: function (s_code) {
      this.s_code = s_code;
    },

    getScode: function () {
      return this.s_code;
    },

    setUrate: function (u_rate) {
      this.u_rate = u_rate;
    },

    getUrate: function () {
      return this.u_rate;
    },

    setSrate: function (s_rate) {
      this.s_rate = s_rate;
    },

    getSrate: function () {
      return this.s_rate;
    },

    /**
     * 获取商城默认货币
     */
    getDefaultCurrencys: async function () {
      let data = {
        api: "app.common.getStoreDefaultCurrency"
      }
      try {
        //1、商城货币信息获取和处理
        const response = await api.doRequest(data);
        //可以控制是否继续进行下面的操作
        const storeCurrency = response.data.data || [];
        this.setStoreCurrency(storeCurrency);

        let currentCurrency = cookie.get("selectCurrency");

        if (!currentCurrency) {
          this.setCurrentCurrencyInfo(storeCurrency);
        } else {
          this.show_symbol = currentCurrency.currency_symbol;
          this.show_rate = currentCurrency.exchange_rate;
          this.show_code = currentCurrency.currency_code;
        }

        //2、TODO 如果用户登录了可以在这里处理用户的货币逻辑

      } catch (error) {
        console.error('获取商城默认货币失败:', error);
        return null;
      }
    },

    /**
     * 计算价格(商品相关的价格计算)
     */
    formatPrice: function (basePrice) {
      if (!basePrice) {
        return
      }
      const rate = this.show_rate || 1;
      return (basePrice * rate).toFixed(2);
    },

    /**
     * 计算价格(订单场景计算价格)
     */
    getPriceWithExchangeRate: function (basePrice, exchange_rate) {
      if (!basePrice) {
        return
      }
      if (!exchange_rate) {
        exchange_rate = 1;
      }
      let formattedPrice = (basePrice * exchange_rate).toFixed(2);
      return formattedPrice;
    },

    /**
     *  【余额】场景计算价格：基础货币向买家当前选择的货币转换
     */
    storeCurrency2UserCurrencyPrice: function (basePrice) {
      if (!basePrice) {
        return
      }
      let formattedPrice = (basePrice / this.u_rate).toFixed(2);
      return formattedPrice;
    }

  })

  inject('LaiKeCommObject', currencyInfos)
}
