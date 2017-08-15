/* eslint no-multiple-empty-lines: ["error", { "max": 99, "maxEOF": 1 }] */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   template: '<App/>',
//   components: { App }
// });
//


// import Vue from 'vue'
import App from './App.vue'
// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export default function createApp (context) {
  const app = new Vue({
    router,
    // 根实例简单的渲染应用程序组件。
    render: function (createElement) {
      return createElement(App)
    }
  })

  return {app, router}
}
