<template>
  <div
    v-title
    :data-title="this.$route.query.loginname"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <b-row type="flex" justify="space-between">
      <!-- 左边 -->
      <b-col md="12" lg="5">
        <b-row>
          <b-col sm="12" md="6" lg="12">
            <el-card shadow="never">
              <b-row class="userinfo" type="flex" justify="space-between">
                <b-col cols="3" md="4" lg="4" xl="3">
                  <a href="https://cnodejs.org/">
                    <el-image
                      :src="userInfo.avatar_url"
                      :preview="userInfo.avatar_url"
                    >
                    </el-image>
                  </a>
                </b-col>
                <b-col class="info" cols="9" md="8" lg="7" xl="8">
                  <el-row type="flex">
                    <span class="loginname">{{ userInfo.loginname }}</span>
                    <a href="https://github.com/" class="Username"
                      >github：{{ userInfo.githubUsername }}</a
                    >
                    <span class="createtime"
                      >注册日期：{{ userInfo.create_at }}</span
                    >
                  </el-row>
                </b-col>
              </b-row>
            </el-card>
            <el-card
              shadow="never"
              class="send"
              v-if="$route.query.loginname === myLoginname"
            >
              <el-row type="flex" align="middle">
                <el-col>
                  <p class="title">
                    <span class="el-icon-s-order"></span> 发布中心
                  </p>
                </el-col>
                <el-col :span="11">
                  <span class="topicCount">发布数({{ topicCount }})</span>
                </el-col>
              </el-row>
              <p class="comeon">快来成为创作者吧</p>
              <el-button class="el-icon-plus" @click="addFn"
                >发布新主题</el-button
              >
            </el-card>
          </b-col>
          <b-col sm="12" md="6" lg="12">
            <el-card
              shadow="never"
              class="interest"
              v-if="$route.query.loginname === myLoginname"
            >
              <el-row type="flex">
                <el-col class="left" @click.native="$router.push('/myTopics')">
                  <span>收藏</span>
                  <span>{{ collectCount }}</span>
                </el-col>
                <el-col class="right" @click.native="$router.push('/message')">
                  <span>消息</span>
                  <span>{{ messageCount }}</span>
                </el-col>
              </el-row>
            </el-card>
            <ul class="info">
              <li>发布的主题数：{{ topicCount }}</li>
              <li>回复的主题数：{{ replyCount }}</li>
            </ul>
          </b-col>
        </b-row>
      </b-col>
      <!-- 左边 -->
      <!-- 右边 -->
      <b-col md="12" lg="7">
        <el-tabs v-model="activeName">
          <el-tab-pane label="发布" name="first">
            <div v-if="topicCount > 0">
              <recent
                v-for="item in userInfo.recent_topics"
                :key="item.id"
                :data="item"
              ></recent>
              <div class="line">
                <span> —————— 我是有底线的 —————— </span>
              </div>
            </div>
            <el-empty v-else description="暂无更多内容"></el-empty>
          </el-tab-pane>
          <el-tab-pane label="回复" name="second">
            <div v-if="replyCount > 0">
              <recent
                v-for="item in userInfo.recent_replies"
                :key="item.id"
                :data="item"
              ></recent>
              <div class="line">
                <span> —————— 我是有底线的 —————— </span>
              </div>
            </div>
            <el-empty v-else description="暂无更多内容"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </b-col>
      <!-- 右边 -->
    </b-row>
    <new-topic ref="dialog" @init="init"></new-topic>
  </div>
</template>

<script>
import { getUser } from '@/api/user'
import { getMessageCount } from '@/api/message'
import { getCollects } from '@/api/collect'
import { moment, filterYear } from '@/filterDate/index'
import recent from './components/recent.vue'
import NewTopic from './components/newTopic.vue'
const accesstoken = localStorage.getItem('token')

export default {
  data() {
    return {
      userInfo: {},
      username: '',
      myLoginname: '',
      activeName: 'first',
      topicCount: '',
      replyCount: '',
      collectCount: '',
      messageCount: '',
      count: 0,
      loading: true,
    }
  },
  created() {
    this.init()
    this.myLoginname = localStorage.getItem('username')
  },
  watch: {
    '$route.query.loginname': {
      handler: function () {
        this.init()
      },
    },
  },
  methods: {
    async init() {
      this.username = this.$route.query.loginname
      const res = await getUser(this.username)
      for (const key in res.data) {
        if (key === 'create_at') {
          res.data[key] = moment(res.data[key])
        }
        if (key === 'recent_topics' || key==='recent_replies') {
          res.data[key].forEach(async item => {
            item.last_reply_at = moment(item.last_reply_at)
          })
        }
      }
      this.userInfo = res.data
      this.topicCount = this.userInfo.recent_topics.length
      this.replyCount = this.userInfo.recent_replies.length
      if (this.username === this.myLoginname) {
        const { data } = await getCollects(this.username)
        const message = await getMessageCount({ accesstoken })
        this.collectCount = data.length
        this.messageCount = message.data
      }
      this.loading = false
    },
    addFn() {
      this.$refs.dialog.showDialog = true
    },
  },
  components: {
    recent,
    NewTopic,
  },
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
  .userinfo {
    .el-image {
      width: 80px;
    }
    .info {
      .el-row {
        // width: 100%;
        // height: 100%;
        flex-direction: column;
        // justify-content: end;
        .Username,
        .createtime {
          color: #999;
          // font-size: .5vw;
          // margin-top: 1vw;
        }
        .Username {
          text-decoration: none;
          &:hover {
            color: #409eef;
            cursor: pointer;
          }
        }
      }
    }
    .el-col:nth-child(3) {
      .button {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: end;
      }
      a {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        border: 1px solid #409eef;
        border-radius: 5px;
        padding: 0.267vw 1vw;
        color: #409eef;
        font-size: 1vw;
        &:hover {
          background-color: #409eef;
          color: #fff;
        }
      }
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
.el-tabs {
  padding: 0 1vw;
  border-radius: 5px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  .el-tab-pane {
    height: 45vw;
    overflow-y: scroll;
    .line {
      display: flex;
      justify-content: center;
      padding: 10px 0;
      color: #ccc;
    }
  }
}
.send {
  p {
    margin: 0;
  }
  .title {
    font-weight: bold;
    span {
      vertical-align: middle;
      color: #409eef;
      font-size: 30px;
    }
  }
  .topicCount {
    color: #999;
    font-size: 14px;
  }
  .comeon {
    margin: 5px 0;
    color: #999;
  }
  .el-button {
    margin-top: 5px;
    width: 100%;
    color: #409eef;
    border: 1px solid #409eef;
    &:hover {
      color: #fff;
      background-color: #409eef;
    }
  }
}
.interest {
  .el-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
    &:hover {
      cursor: pointer;
      span:nth-child(1) {
        color: #409eef;
      }
    }
    span:nth-child(2) {
      font-weight: bold;
    }
  }
  .left {
    border-right: 1px solid #ccc;
    padding-right: 20px;
  }
  .right {
    padding-left: 20px;
  }
}
ul.info {
  list-style: none;
  border-top: 1px solid #eee;
  padding: 0;
  li {
    padding: 10px 5px;
    border-bottom: 1px solid #eee;
    color: #777;
  }
}
</style>