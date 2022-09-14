import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '@/utils/element.js'
import '@/style/index.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// 文本复制功能
import VueClipBoard from 'vue-clipboard2'
Vue.use(VueClipBoard)

import topicList from '@/components/topicList'
import EditorBar from "@/components/QuillEditor";
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
//兄弟组件传值
Vue.prototype.$bus = new Vue()


Vue.component('EditorBar', EditorBar)
Vue.component('topicList', topicList)

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})

// router.beforeEach((to, from, next) => {
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   next()
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
