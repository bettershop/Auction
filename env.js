// 默认配置（可通过环境变量覆盖）
// 使用方式:
// JAVA_STORE_ID=101 npm run java:prod
// PHP_STORE_ID=202 npm run php:prod
const DEFAULT_JAVA_STORE_ID = '7'
const DEFAULT_PHP_STORE_ID = '7'
const DEFAULT_STORE_TYPE = '6'

const JAVA_PORT = 8090
const PHP_PORT = 9089

function resolveStoreId(runtime) {
  if (runtime === 'php') {
    return process.env.PHP_STORE_ID || process.env.STORE_ID || process.env.VUE_APP_LKT_STORE_ID || DEFAULT_PHP_STORE_ID
  }

  return process.env.JAVA_STORE_ID || process.env.STORE_ID || process.env.VUE_APP_LKT_STORE_ID || DEFAULT_JAVA_STORE_ID
}

function resolveStoreType() {
  return process.env.STORE_TYPE || process.env.VUE_APP_STORE_TYPE || DEFAULT_STORE_TYPE
}

function buildCommonUri(storeId, storeType) {
  return `?store_id=${storeId}&store_type=${storeType}`
}

function createEnvConfig({
  runtime,
  nodeEnv,
  publicPath,
  mchDefUrl,
  h5DefUrl,
  rootImgUrl,
  kefuUrl,
  baseApi,
  port,
  rootUrlBase
}) {
  const storeId = resolveStoreId(runtime)
  const storeType = resolveStoreType()
  const commonUri = buildCommonUri(storeId, storeType)

  return {
    NODE_ENV: nodeEnv,
    VUE_APP_LKT_STORE_ID: storeId,
    VUE_APP_STORE_TYPE: storeType,
    PUBLIC_PATH: publicPath,
    VUE_APP_LKT_MCH_DEFURL: mchDefUrl,
    VUE_APP_LKT_H5_DEFURL: h5DefUrl,
    VUE_APP_LKT_ROOT_IMG_URL: rootImgUrl,
    VUE_APP_LKT_KEFU_URL: kefuUrl,
    VUE_APP_BASE_API: baseApi,
    PROT: port,
    LKT_ROOT_URL: `${rootUrlBase}${commonUri}`
  }
}

module.exports = {
  //////////////////////////////////////////////
  // JAVA 环境
  //////////////////////////////////////////////
  java_dev_production: createEnvConfig({
    runtime: 'java',
    nodeEnv: 'java_dev_production',
    publicPath: '',
    mchDefUrl: 'https://java.pc.houjiemeishi.com/#/login',
    h5DefUrl: 'https://java.houjiemeishi.com/#/',
    rootImgUrl: 'https://java.houjiemeishi.com/',
    kefuUrl: 'wss://java.houjiemeishi.com/wss/onlineMessage/',
    baseApi: 'https://java.houjiemeishi.com/gw',
    port: JAVA_PORT,
    rootUrlBase: 'https://java.houjiemeishi.com/gw'
  }),

  java_prod_production: createEnvConfig({
    runtime: 'java',
    nodeEnv: 'java_prod_production',
    publicPath: '',
    mchDefUrl: 'https://java.pc.houjiemeishi.com/#/login',
    h5DefUrl: 'https://java.houjiemeishi.com/#/',
    rootImgUrl: 'https://java.houjiemeishi.com/',
    kefuUrl: 'wss://java.houjiemeishi.com/wss/onlineMessage/',
    baseApi: 'https://java.houjiemeishi.com/gw',
    port: JAVA_PORT,
    rootUrlBase: 'https://java.houjiemeishi.com/gw'
  }),

  //////////////////////////////////////////////
  // PHP 环境
  //////////////////////////////////////////////
  php_dev_production: createEnvConfig({
    runtime: 'php',
    nodeEnv: 'php_dev_production',
    publicPath: '',
    mchDefUrl: 'https://tp.dev.laiketui.net/mch/#/login',
    h5DefUrl: 'https://tp.dev.laiketui.net/H5/#/',
    rootImgUrl: 'https://tp.dev.laiketui.net/',
    kefuUrl: 'wss://tp.dev.laiketui.net/wss/',
    baseApi: 'https://tp.dev.laiketui.net',
    port: PHP_PORT,
    rootUrlBase: '/api'
  }),

  php_prod_production: createEnvConfig({
    runtime: 'php',
    nodeEnv: 'php_prod_production',
    publicPath: '/auction',
    mchDefUrl: 'https://tp.dev.laiketui.net/mch/#/login',
    h5DefUrl: 'https://tp.dev.laiketui.net/H5/#/',
    rootImgUrl: 'https://tp.dev.laiketui.net/',
    kefuUrl: 'wss://tp.dev.laiketui.net/wss/',
    baseApi: 'https://tp.dev.laiketui.net',
    port: PHP_PORT,
    rootUrlBase: 'https://tp.dev.laiketui.net'
  })
}
