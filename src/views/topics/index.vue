<template>
  <div>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      v-title
      :data-title="this.$route.meta.title"
    >
      <el-tab-pane
        v-for="(val, key) in obj"
        :key="val"
        :label="val"
        :name="key"
        :class="{ elview: showview }"
      >
        <topicList :ref="key" @showviewFn="showviewFn"></topicList>
      </el-tab-pane>
    </el-tabs>
    <el-row type="flex" justify="end" align="center" style="position: relative">
      <div class="box">
        <span style="font-size: 13px">{{ curPage }}</span>
      </div>
      <el-pagination
        layout="prev, pager, next, jumper, slot"
        @current-change="pageChange"
        :current-page.sync="curPage"
      >
        <template></template>
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getTopicsList } from '@/api/topics'
import { moment } from '@/filterDate/index'
export default {
  data() {
    return {
      activeName: 'all',
      tabCheck: 'all',
      pageSize: 10,
      page: 1,
      curPage: 1,
      obj: {
        all: '全部',
        ask: '问贴',
        share: '分享',
        job: '招聘',
        good: '精华',
        dev: '测试',
      },
      show: false,
      showview: false,
    }
  },
  methods: {
    async init(tab) {
      this.showview = false
      await getTopicsList({
        page: this.page,
        tab: tab === 'all' ? null : tab,
        limit: this.pageSize,
      })
        .then(res => {
          console.log('res', res)
          res.data.forEach(async item => {
            item.show = true
            item.create_at = moment(item.create_at)
            item.last_reply_at = moment(item.last_reply_at)
            // 主题类型中译英
            for (const key in this.obj) {
              if (item.tab === key) {
                item.tab = this.obj[key]
              }
            }
          })
          this.$refs[tab][0].init(res.data)
          this.$refs[tab][0].closeLoading()
        })
        .catch(err => {
          this.$message.error('网络拥堵，请稍后再试~')
        })
    },
    async handleClick(tab, event) {
      this.tabCheck = tab.name
      this.page = 1
      this.curPage = 1
      await this.init(this.tabCheck)
    },
    async pageChange(val) {
      document.documentElement.scrollTop = 0
      this.$refs[this.tabCheck][0].loading = true
      this.page = val
      this.init(this.tabCheck)
    },
    showviewFn() {
      this.showview = true
    },
  },
  async created() {
    this.init(this.tabCheck)
  },
}
</script>

<style lang="scss" scoped>
.el-tab-pane {
  height: 100vh;
}
.elview {
  height: 100%;
}
.title {
  font-weight: bold;
}
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 142px;
  bottom: 7px;
  width: 30px;
}
</style>