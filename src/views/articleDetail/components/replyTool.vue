<template>
  <el-card shadow="never" class="reply">
    <el-row type="flex" justify="space-evenly">
      <el-input
        v-model="myReply"
        placeholder="请输入您的评论"
        @keyup.native.enter="reply"
        ref="input"
      ></el-input>
      <el-button class="el-icon-chat-square" type="primary" @click="reply">
        <span>发布评论</span>
      </el-button>
    </el-row>
  </el-card>
</template>

<script>
import { replyTopicById } from '@/api/replices'
const accesstoken = localStorage.getItem('token')

export default {
  props: ['replyId'],
  data() {
    return { myReply: '', id: '' }
  },
  created() {
    this.id = this.$route.query.id
    if (this.replyId) {
      this.myReply = `@${this.replyId} `
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  },
  methods: {
    async reply() {
      await replyTopicById({
        accesstoken,
        content: this.myReply,
        id: this.id,
      })
      this.myReply = ''
      this.$message.success("评论成功！")
      this.$emit('closeReply')
      this.$emit('init')
    },
  },
}
</script>

<style lang="scss" scoped>
.reply {
  margin-bottom: 10px;
  .el-input {
    width: 100%;
  }
  .el-button {
    span {
      padding-left: 0.533vw;
    }
  }
}
</style>