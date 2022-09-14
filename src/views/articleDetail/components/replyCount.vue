<template>
  <div>
    <el-row type="flex" class="reply">
      <el-col
        :span="1"
        @click.native="openUserInfo(replies.author.loginname)"
        class="avatarImg"
      >
        <el-avatar :size="25" :src="replies.author.avatar_url"></el-avatar>
      </el-col>
      <el-col>
        <el-row type="flex" justify="space-between" class="top">
          <el-col
            class="loginName"
            @click.native="openUserInfo(replies.author.loginname)"
            >{{ replies.author.loginname }}</el-col
          >
          <el-col class="tools">
            <el-row type="flex" justify="end">
              <el-dropdown trigger="click">
                <i class="el-icon-arrow-down el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="replyTo(replies.author.loginname)"
                    icon="el-icon-edit"
                    >回复</el-dropdown-item
                  >
                  <el-dropdown-item
                    @click.native="copy(replies.content)"
                    icon="el-icon-circle-plus"
                    >复制</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between" class="middle">
          <el-col class="content">
            <div v-html="replies.content" id="copy-qb"></div>
          </el-col>
        </el-row>
        <!-- $listeners事件可以让孙子组件调用爷爷组件 -->
        <replyTool
          v-if="showReplyTool"
          :replyId="replyId"
          @closeReply="closeReply"
          v-on="$listeners"
        ></replyTool>
        <el-row type="flex" justify="space-between" class="bottom">
          <el-col class="replyTime">{{ replies.create_at }}</el-col>
          <el-col class="goodd">
            <el-row type="flex" justify="end">
              <span
                class="el-icon-s-flag"
                @click="goodReply(replies.id)"
                :class="{ goodReply: replies.is_uped }"
              >
                <span>赞</span>
              </span>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { goodReplyById } from '@/api/replices'
import Clipboard from 'clipboard'
import replyTool from './replyTool.vue'
const token = localStorage.getItem('token')
export default {
  components: {
    replyTool,
  },
  props: {
    replies: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { showReplyTool: false, replyId: '' }
  },
  methods: {
    replayImgShow(e) {
      if (e.target.tagName === 'P') {
        console.log(111)
        const btnCopy = new Clipboard('p')
        this.copyValue = 'hello world'
      }
    },
    copy(text) {
      this.$copyText(text).then(
        e => {
          this.$message.success('复制成功')
          console.log(e)
        },
        e => {
          this.$message.error('该浏览器不支持自动复制,请手动复制！')
        }
      )
    },
    async goodReply(id) {
      console.log('id: ', id)
      const res = await goodReplyById({ id: id, accesstoken: token })
      if (res.action === 'up') {
        this.$message.success('点赞成功')
      } else {
        this.$message.info('取消点赞成功')
      }
      this.$emit('init')
    },
    replyTo(id) {
      console.log('id: ', id)
      this.replyId = id
      this.showReplyTool = !this.showReplyTool
    },
    closeReply() {
      this.showReplyTool = false
    },
    openUserInfo(name) {
      this.$router.push({
        path: '/userinfo',
        query: { loginname: name },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.reply {
  padding-bottom: 0.8vw;
  .avatarImg {
    &:hover {
      cursor: pointer;
    }
  }
  .top {
    .loginName {
      font-weight: bold;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .middle {
    .content {
      ::v-deep img {
        width: 20vw;
      }
      ::v-deep a {
        text-decoration: none;
        color: dodgerblue;
      }
    }
  }
  .bottom {
    color: #999;
    .goodd {
      .el-icon-s-flag {
        span {
          padding-left: 0.267vw;
        }
        &:hover {
          cursor: pointer;
        }
      }
      .goodReply {
        color: #409eff;
      }
    }
  }
  .el-popover {
    p {
      font-size: 3.2vw;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>