// babel.config.js

const isDEV = process.env.BASE_ENV === 'development' // 是否是开发模式
module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        "corejs": 3 // 配置使用core-js使用的版本
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ],
    ['@babel/plugin-proposal-object-rest-spread']
    // isDEV && require.resolve('react-refresh/babel'), // 如果是开发模式,就启动react热更新插件
  ].filter(Boolean) // 过滤空值
}
