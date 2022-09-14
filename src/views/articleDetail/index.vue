<template>
  <div
    v-title
    :data-title="this.$route.query.title"
    v-loading="loading"
    element-loading-text="拼命加载中"
    :class="{ showLoading: loading }"
  >
    <div class="view">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">{{ articleInfo.title }}</span>
        </div>

        <el-row type="flex" justify="space-between">
          <el-col>
            <el-row type="flex" justify="start">
              <div class="block">
                <el-avatar
                  :size="50"
                  :src="authorInfo.avatar_url"
                  @click.native="openUserInfo(authorInfo.loginname)"
                ></el-avatar>
              </div>
              <div>
                <span class="authorName">{{ authorInfo.loginname }}</span>
              </div>
            </el-row>
          </el-col>
        </el-row>
        <div v-html="articleInfo.content" class="articleContent"></div>
        <el-row type="flex" justify="start" align="center" class="count">
          <div class="el-icon-view">
            <span>{{ articleInfo.visit_count }}</span>
          </div>
          <div class="el-icon-chat-dot-round">
            <span>{{ articleInfo.reply_count }}</span>
          </div>
          <div
            class="el-icon-star-on"
            :class="{ collest: isCollect }"
            @click="collectTopic(articleInfo.id)"
          >
            <span>收藏</span>
          </div>
          <div>
            <span> 最后评论：{{ articleInfo.last_reply_at }} </span>
          </div>
        </el-row>
        <replyTool @init="init"></replyTool>
        <el-card shadow="never" class="reply">
          <div slot="header" class="clearfix">
            <span class="title">{{ replycount }}条评论</span>
          </div>
          <replyCount
            v-for="item in articleInfo.replies"
            :key="item.id"
            :replies="item"
            @init="init"
          ></replyCount>
        </el-card>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getTopicById } from '@/api/topics'
import { collectTopicById, deCollectTopicById } from '@/api/collect'
import replyCount from './components/replyCount.vue'
import replyTool from './components/replyTool.vue'
import { moment } from '@/filterDate/index'
const token = localStorage.getItem('token')
export default {
  components: {
    replyCount,
    replyTool,
  },
  data() {
    return {
      imgUrl: '',
      authorName: '',
      articleInfo: {},
      authorInfo: {},
      replycount: 0,
      isCollect: false,
      id: '',
      loading: true,
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.id = this.$route.query.id
      const info = await getTopicById({ id: this.id, accesstoken: token })
      info.data.last_reply_at = await moment(info.data.last_reply_at)
      info.data.replies.forEach(async item => {
        item.create_at = await moment(item.create_at)
      })
      this.articleInfo = info.data
      this.isCollect = this.articleInfo.is_collect
      this.authorInfo = this.articleInfo.author
      this.replycount = this.articleInfo.replies.length
      this.loading = false
      this.articleInfo.replies.forEach(item => {
        this.filterContent(item.content)
      })
    },
    async collectTopic(id) {
      if (this.isCollect === false) {
        await collectTopicById({ topic_id: id, accesstoken: token })
        this.$message.success('收藏成功')
      } else {
        await deCollectTopicById({ topic_id: id, accesstoken: token })
        this.$message.info('取消收藏成功')
      }
      this.isCollect = !this.isCollect
      this.init()
    },
    openUserInfo(name) {
      this.$router.push({
        path: '/userinfo',
        query: { loginname: name },
      })
    },
    // 过滤富文本的内容   暂定
    filterContent(content) {
      content = content.replace(/(\n)/g, '')
      content = content.replace(/(\t)/g, '')
      content = content.replace(/(\r)/g, '')
      content = content.replace(/<\/?[^>]*>/g, '')
      content = content.replace(/\s*/g, '')
      console.log('content: ', content)
    },
  },
}
</script>

<style lang="scss" scoped>
.view {
  .box-card {
    .title {
      font-weight: bold;
    }
    .articleContent {
      ::v-deep img {
        width: 100%;
      }
    }
    .block {
      padding-right: 1.2vw;
      padding-bottom: 1.2vw;
      &:hover {
        .el-avatar {
          cursor: pointer;
        }
      }
    }
  }
}
.showLoading {
  height: 800px;
}
.count {
  color: #999;
  font-size: 14px;
  margin-bottom: 1.333vw;
  div {
    display: flex;
    align-items: center;
    margin-right: 5%;
    span {
      margin-left: 5px;
    }
  }
  .el-icon-star-on {
    &:hover {
      color: #409eff;
      cursor: pointer;
    }
  }
  .collest {
    color: #409eff;
  }
}
</style>