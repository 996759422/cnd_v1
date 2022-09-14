<template>
  <div>
    <header>
      <b-navbar toggleable="md" type="dark" class="container">
        <b-navbar-brand to="/topics" class="logo">
          <img src="@/assets/logoWhite.png" alt="" />
        </b-navbar-brand>
        <b-navbar-toggle
          target="nav-collapse"
          style="margin-right: 10px"
        ></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav style="justify-content: end">
          <b-navbar-nav>
            <b-nav-item to="/topics" :active="$route.path === '/topics'"
              >首页</b-nav-item
            >
            <b-nav-item
              v-if="token"
              to="/myTopics"
              :active="$route.path === '/myTopics'"
              >收藏</b-nav-item
            >
            <b-nav-item href="http://cnodejs.org/api">API</b-nav-item>
            <b-nav-item-dropdown
              v-if="token"
              size="sm"
              class="m-1"
              id="dropdown-buttons"
            >
              <template v-slot:button-content>
                <el-badge :value="message" class="item" type="primary">
                </el-badge>
                <el-avatar :size="30" :src="imgUrl"></el-avatar>
              </template>
              <b-dropdown-item @click="toinfo">个人信息</b-dropdown-item>
              <b-dropdown-item @click="$router.push('/message')"
                >消息中心</b-dropdown-item
              >
              <b-dropdown-item @click="clearMessage">清除未读</b-dropdown-item>
              <b-dropdown-item @click="logout">退出登录</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-else to="/login" :active="$route.path === '/login'"
              >登录</b-nav-item
            >
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </header>

    <router-view class="container"></router-view>
    <el-backtop :visibility-height="200"></el-backtop>
    <footer>
      <div class="container">
        <b-row class="img">
          <b-col cols="6" lg="3">
            <router-link to="/topics">
              <img src="@/assets/logoWhite.png" alt="" />
            </router-link>
          </b-col>
          <b-col cols="6" lg="3">
            <a href="http://cnodejs.org/">
              <img src="@/assets/cnodejs_light.svg" alt="" />
            </a>
          </b-col>
          <b-col cols="6" lg="3">
            <a href="https://gitee.com/pelopelo/cnd_v1">
              <img src="@/assets/gitee.svg" alt=""
            /></a>
          </b-col>
          <b-col cols="6" lg="3">
            <a href="https://github.com/996759422">
              <img src="@/assets/github.png" alt=""
            /></a>
          </b-col>
        </b-row>
        <div class="text">
          <a href="https://cnodejs.org/api"
            >接口地址：https://cnodejs.org/api</a
          >
          <a href="http://gitee.com/pelopelo/cnd_v1"
            >项目地址：http://gitee.com/pelopelo/cnd_v1</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { getUser } from '@/api/user'
import { getMessageCount, markAllMessages } from '@/api/message'
export default {
  data() {
    return {
      imgUrl: '',
      token: '',
      loginname: '',
      message: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.token = localStorage.getItem('token')
      this.loginname = localStorage.getItem('username')
      if (this.token) {
        const res = await getUser(localStorage.getItem('username'))
        const messageCount = await getMessageCount({ accesstoken: this.token })
        this.imgUrl = res.data.avatar_url
        this.message = messageCount.data
      }
    },
    toinfo() {
      this.$router.push({
        path: '/userinfo',
        query: { loginname: this.loginname },
      })
    },
    async clearMessage() {
      const res = await markAllMessages({ accesstoken: this.token })
      if (res.marked_msgs.length > 0) {
        this.$message.success('已清除所有未读消息')
        this.init()
      } else {
        this.$message.info('暂无更多未读消息')
      }
    },
    async logout() {
      localStorage.removeItem('token')
      this.$message.success('退出成功')
      if (this.$route.path !== '/topics') {
        this.$router.push('/topics')
      }
      this.init()
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  background-color: #545c64;
  margin-bottom: 20px;
  .logo {
    padding: 0;
    width: 115px;
    height: 45px;
    img {
      width: 100%;
      height: 100%;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
::v-deep .nav-item:nth-child(-n + 3) {
  padding-left: 10px;
}
#dropdown-buttons {
  position: relative;
  .el-avatar {
    margin-right: 10px;
  }
  .el-badge {
    position: absolute;
    top: -5px;
    left: 25px;
  }
}
::v-deep #dropdown-buttons__BV_toggle_ {
  padding: 0 5px;
  display: flex;
  align-items: center;
}
::v-deep ul#dropdown-buttons__BV_toggle_menu_ {
  background-color: #545c64;
  right: 0;
  top: 50px;
  border: none;
  min-width: 88px !important;
  li {
    // min-width: 88px !important;

    // text-align: center;
    a {
      color: #fff;
      // min-width: 88px !important;
    }
    &:hover {
      a {
        color: #409eff;
      }
    }
    &:active {
      a {
        background-color: transparent;
      }
    }
  }
}
footer {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 5vh;
  background-color: #545c64;
  padding-top: 1vw;
  padding-bottom: 1vh;
  .img {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    a {
      margin: 0px 1vw;
      img {
        width: 150px;
        height: 70px;
      }
    }
  }
  .text {
    display: flex;
    flex-direction: column;
    padding-left: 2vw;
    // justify-content: space-between;
    a {
      text-decoration: none;
      color: #fff;
      // font-size: 2vh;
      &:hover {
        color: #409eff;
      }
    }
  }
}
</style>