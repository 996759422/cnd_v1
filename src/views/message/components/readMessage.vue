<template>
  <div
    class="message"
    @click="openDetail(data.topic.id, data.topic.title, data.id)"
  >
    <div class="replyTime">{{ data.reply.create_at }}</div>
    <el-row type="flex" class="author" align="center">
      <el-col :span="3">
        <el-avatar :src="data.author.avatar_url"></el-avatar>
      </el-col>
      <el-col>
        <el-row class="box" align="center ">
          <el-col class="text">
            <span class="loginname">{{ data.author.loginname }}</span>
            评论了你的文章
            <span class="title">{{ data.topic.title }} </span>
          </el-col>
          <el-col class="replycontent">
            <div v-html="data.reply.content"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
const accesstoken = localStorage.getItem('token')
import { markOneMessage } from '@/api/message'
export default {
  props: {
    data: { type: Object, required: true },
  },
  methods: {
    async openDetail(id, title, markid) {
      await markOneMessage({ msg_id: markid, accesstoken })
      this.$emit('init')
      //resolve保持原页面不跳转
      const routerUrl = this.$router.resolve({
        path: '/articleDetail',
        query: { id: id, title: title },
      })
      // 在新的标签页中打开页面
      window.open(routerUrl.href, '_blank')
    },
    
  },
}
</script>

<style lang="scss" scoped>
a {
  color: #000;
  text-decoration: none;
}
.message {
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
  &:hover {
    cursor: pointer;
    .el-col:nth-child(2) .title,
    .el-col:nth-child(2) .loginname {
      color: #409eef;
    }
  }
}
.author {
  margin-top: 5px;
  .el-avatar {
    width: 40px;
  }
  .el-col:nth-child(2) {
    .loginname,
    .title {
      color: #999;
    }
    .text,
    .replycontent {
      max-width: 300px;
      /*1. 先强制一行内显示文本*/
      white-space: nowrap; //  （ 默认 normal 自动换行）
      /*2. 超出的部分隐藏*/
      overflow: hidden;
      /*3. 文字用省略号替代超出的部分*/
      text-overflow: ellipsis;
      // font-weight: bold;
      // font-size: 20px;
    }
    .replycontent ::v-deep p {
      // font-size: 1.2vw;
      margin: 0;
    }
  }
  .box{
    align-items: center;
  }
}
</style>