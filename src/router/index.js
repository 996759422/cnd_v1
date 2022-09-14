import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/topics'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index.vue'),
    children: [

      { path: '/topics', name: 'topics', component: () => import('@/views/topics/index.vue'), meta: { title: '博客网CND_v1' } },
      { path: '/myTopics', component: () => import('@/views/myTopics/index.vue') },
      { path: '/articleDetail', name: 'articleDetail', component: () => import('@/views/articleDetail/index.vue'), },
      { path: '/message', name: 'message', component: () => import('@/views/message/index.vue'), meta: { title: '消息中心' } },
      { path: '/userinfo', name: 'userinfo', component: () => import('@/views/userinfo/index.vue') },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/404',
    component: () => import('@/views/404')
  },
  {
    path: '*',
    redirect: '/404'
  },
  { path: '/test', name: '首页', component: () => import('@/views/test/index.vue') },

]

const router = new VueRouter({
  routes
})

const topicArr = ["/articleDetail", "/myTopics", '/userinfo']
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("token")
  if (!token && topicArr.indexOf(to.path) != -1) {
    Message.error("登录获取更多信息")
    next("/login")
  } else {
    next()
  }
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if (to.fullPath == "/login") {
    if (token) {
      next({
        path: from.fullPath
      });
    } else {
      next();
    }
  }
})

// 解决重复跳转同一个路由报错问题
// 重新下载路由也能解决这个问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
