<template>
  <div
    v-title
    :data-title="this.$route.meta.title"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <b-row type="flex" justify="space-between">
      <b-col md="12" lg="5">
        <el-card shadow="never" class="send">
          <el-row type="flex" align="middle">
            <el-col>
              <p class="title">
                <span class="el-icon-s-comment"></span> 消息中心
              </p>
            </el-col>
          </el-row>
          <p class="comeon">消息太多怎么办？试试一键清除吧！</p>
          <el-button @click="clearMessage">清除未读</el-button>
        </el-card>

        <b-row>
          <b-col cols="6" lg="12">
            <el-card shadow="never" class="interest">
              <el-row type="flex">
                <el-col class="left" @click.native="openUserInfo(loginname)">
                  <span>回复</span>
                  <span>{{ replyCount }}</span>
                </el-col>
                <el-col class="right" @click.native="$router.push('/myTopics')">
                  <span>收藏</span>
                  <span>{{ collectCount }}</span>
                </el-col>
              </el-row>
            </el-card>
          </b-col>
          <b-col cols="6" lg="12">
            <ul class="info">
              <li>未读数：{{ hasNoread }}</li>
              <li>已读数：{{ hasRead }}</li>
            </ul>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="12" lg="7">
        <el-tabs v-model="activeName">
          <el-tab-pane label="未读" name="first">
            <div v-if="hasNoread > 0">
              <read-message
                v-for="item in messageData.hasnot_read_messages"
                :key="item.id"
                :data="item"
                @init="init"
              ></read-message>
              <div class="line">
                <span> —————— 我是有底线的 —————— </span>
              </div>
            </div>
            <el-empty v-else description="暂无更多内容"></el-empty>
          </el-tab-pane>
          <el-tab-pane label="已读" name="second">
            <div v-if="hasRead > 0">
              <read-message
                v-for="item in messageData.has_read_messages"
                :key="item.id"
                :data="item"
              ></read-message>
              <div class="line">
                <span> —————— 我是有底线的 —————— </span>
              </div>
            </div>
            <el-empty v-else description="暂无更多内容"></el-empty>
          </el-tab-pane>
        </el-tabs>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { getMessages, markAllMessages } from '@/api/message'
import { getUser } from '@/api/user'
import { moment } from '@/filterDate/index'
import { getCollects } from '@/api/collect'
import readMessage from './components/readMessage.vue'

const accesstoken = localStorage.getItem('token')
export default {
  components: { readMessage },
  data() {
    return {
      messageData: {},
      loginname: '',
      activeName: 'first',
      hasRead: 0,
      hasNoread: 0,
      replyCount: 0,
      collectCount: 0,
      loading: true,
    }
  },
  methods: {},
  async created() {
    this.init()
    this.loginname = localStorage.getItem('username')
  },
  methods: {
    async init() {
      const { data } = await getMessages({ accesstoken })
      const reply = await getUser(this.loginname)
      const collect = await getCollects(this.loginname)
      for (const key in data) {
        data[key].forEach(async item => {
          item.reply.create_at = await moment(item.reply.create_at)
        })
      }
      this.messageData = data
      this.hasNoread = this.messageData.hasnot_read_messages.length
      this.hasRead = this.messageData.has_read_messages.length
      this.replyCount = reply.data.recent_replies.length
      this.collectCount = collect.data.length
      this.loading = false
      this.$parent.init()
    },
    openUserInfo(name) {
      this.$router.push({
        path: '/userinfo',
        query: { loginname: name },
      })
    },
    async clearMessage() {
      const res = await markAllMessages({ accesstoken })
      if (res.marked_msgs.length > 0) {
        this.$message.success('已清除所有未读消息')
        this.$emit('init')
      } else {
        this.$message.info('暂无更多未读消息')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
}
.send {
  p {
    margin: 0;
  }
  .title {
    font-weight: bold;
    margin-bottom: 5px;
    span {
      vertical-align: middle;
      color: #409eef;
      font-size: 28px;
    }
  }
  .topicCount {
    color: #999;
  }
  .comeon {
    color: #999;
    padding: 10px 0;
  }
  .el-button {
    margin-top: 0.5vw;
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
    padding: 1vw 0.5vw;
    border-bottom: 1px solid #eee;
    color: #777;
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
    height: 500px;
    overflow-y: scroll;
    .line {
      display: flex;
      justify-content: center;
      padding: 10px 0;
      color: #ccc;
    }
  }
}
</style>