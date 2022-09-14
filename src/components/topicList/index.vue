<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-background="rgba(255, 255, 255, 1)"
    class="view"
  >
    <el-empty
      v-if="topicArray.length === 0"
      description="当前页面无更多内容"
      style="padding: 120px 0"
    ></el-empty>
    <el-card
      v-for="item in topicArray"
      :key="item.id"
      class="box-card"
      :class="{ collose: item.show }"
    >
      <div slot="header" class="clearfix">
        <div class="author">
          <el-avatar
            :size="30"
            :src="item.author.avatar_url"
            @click.native="openUserInfo(item.author.loginname)"
          ></el-avatar>
          <span class="create">发布于：{{ item.create_at }}</span>
          <el-tag size="small" style="margin-left: 10px">{{ item.tab }}</el-tag>
        </div>
        <el-row>
          <span class="title" @click="openDetail(item.id, item.title)">{{
            item.title
          }}</span>
        </el-row>
      </div>
      <div class="content" v-html="item.content" :ref="item.id"></div>
      <el-row type="flex" justify="space-between" align="center" class="footer">
        <el-col>
          <b-row type="flex" justify="start" width="100%" class="count">
            <b-col cols="3" sm="2" class="el-icon-view">
              <span class="click" @click="openDetail(item.id, item.title)">
                {{ item.visit_count }}
              </span>
            </b-col>
            <b-col cols="3" sm="2" class="el-icon-chat-dot-round">
              <span class="click" @click="openDetail(item.id, item.title)">
                {{ item.reply_count }}
              </span>
            </b-col>
            <b-col>
              <span class="time"> 最后回复：{{ item.last_reply_at }} </span>
            </b-col>
          </b-row>
        </el-col>
        <el-col :span="1" v-if="item.button">
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="expansion(item)"
            >{{ item.show === false ? '查看更多' : '收起' }}</el-button
          >
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      loading: true,
      topicArray: [],
    }
  },
  methods: {
    async init(data) {
      if (data.length === 0) {
        this.loading = false
      }
      this.topicArray = data
      let scroll = 70
      this.$nextTick(() => {
        this.topicArray.forEach(element => {
          this.$refs[element.id][0].scroll = scroll
          scroll += 180
          if (this.$refs[element.id][0].scrollHeight > 100) {
            element.button = true
            element.show = false
          }
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
      })
    },
    expansion(item) {
      item.show = !item.show
      if (item.show === false)
        document.documentElement.scrollTop = this.$refs[item.id][0].scroll
    },
    closeLoading() {
      this.$emit('showviewFn')
    },
    openDetail(id, title) {
      const routerUrl = this.$router.resolve({
        path: '/articleDetail',
        query: { id: id, title: title },
      })
      // 在新的标签页中打开页面
      window.open(routerUrl.href, '_blank')
    },
    openUserInfo(name) {
      console.log('name: ', name)
      this.$router.push({
        path: '/userinfo',
        query: { loginname: name },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.view {
  height: 100%;
}
.content {
  // height: 10vh;
  ::v-deep img {
    width: 20vw;
    object-fit: fill;
  }
  ::v-deep p {
    margin: 0;
  }
}

.box-card {
  position: relative;
  margin-bottom: 10px;
  padding-bottom: 30px;
  height: 210px;
  // transition: 0.5s;
  ::v-deep .el-card__header {
    padding: 10px;
    .clearfix {
      // width: 10vw;
      .author {
        display: flex;
        align-items: center;
        &:hover {
          .el-avatar {
            cursor: pointer;
          }
        }
        .create {
          // font-size: 1vw;
          margin-left: 5px;
          color: #999;
        }
        .el-tag {
          // font-size: 1vw;
          // margin-left: 1vw;
          vertical-align: baseline;
        }
      }

      .title {
        display: block;
        // font-size: 1.5vw;
        font-weight: 700;
        text-decoration: none;
        color: #000;
        width: 100%;
        white-space: nowrap; //  （ 默认 normal 自动换行）
        /*2. 超出的部分隐藏*/
        overflow: hidden;
        /*3. 文字用省略号替代超出的部分*/
        text-overflow: ellipsis;
        &:hover {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
  }
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0.5vw 1vw;
    box-shadow: 0 0 16px -10px;
    background-color: #fff;
    .count {
      align-items: center;
      color: #999;
      font-size: 14px;
      .click {
        margin-left: 5px;
        color: #999;
        text-decoration: none;
        &:hover {
          color: #333;
          cursor: pointer;
        }
      }
    }
  }
}
@media screen and (max-width: 576px) {
  .box-card {
    height: 235px;
  }
}
// 动态样式
.collose {
  height: 100%;
  ::v-deep img {
    transition: 0.5s;
    width: 100%;
    object-fit: fill;
  }
  ::v-deep p {
    width: 100%;
  }
}
</style>