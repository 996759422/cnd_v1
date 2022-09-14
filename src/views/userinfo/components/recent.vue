<template>
  <div class="recent" @click="openDetail(data.id, data.title)">
    <div class="title">{{ data.title }}</div>
    <b-row type="flex" class="author">
      <b-col cols="2" sm="1">
        <el-avatar :src="data.author.avatar_url"></el-avatar>
      </b-col>
      <b-col>
        <el-row>
          <el-col>{{ data.author.loginname }}</el-col>
          <el-col class="lastreply"
            >最后回复时间：{{ data.last_reply_at }}</el-col
          >
        </el-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    data: { type: Object, required: true },
  },
  methods: {
    openDetail(id, title) {
      console.log('id: ', id)
      const routerUrl = this.$router.resolve({
        path: '/articleDetail',
        query: { id: id, title: title },
      })
      window.open(routerUrl.href, '_blank')
    },
  },
}
</script>

<style lang="scss" scoped>
.recent {
  padding-bottom: 0.5vw;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5vw;
  &:hover {
    cursor: pointer;
    .title {
      color: #409eef;
    }
  }
}
.title {
  width: 100%;
  font-size: 16px;
  /*1. 先强制一行内显示文本*/
  white-space: nowrap; //  （ 默认 normal 自动换行）
  /*2. 超出的部分隐藏*/
  overflow: hidden;
  /*3. 文字用省略号替代超出的部分*/
  text-overflow: ellipsis;
  font-weight: bold;
}
.author {
  margin-top: 0.5vw;
  align-items: center;
  .el-avatar {
    width: 36px;
    height: 36px;
  }
  .lastreply {
    font-size: 0.9vw;
    color: #999;
  }
  // .lastreply{
  //   font-size: 12px;
  // }
}
</style>