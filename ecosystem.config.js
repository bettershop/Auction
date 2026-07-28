module.exports = {
    apps: [
      {
        name: 'nuxt-pcsc', // 这个name就是pm2启动时需要的name
        exec_mode: 'cluster',
        instances: '1', // Or a number of instances
        script: './node_modules/nuxt/bin/nuxt.js',
        args: 'start',
      },
    ],
  }