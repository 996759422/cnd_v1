<template>
  <div class="content" :class="{ elview: showview }">
    <topicList
      :topicArray="topicArray"
      ref="loading"
      @showviewFn="showviewFn"
    ></topicList>
  </div>
</template>

<script>
import { getCollects } from '@/api/collect'
import { moment } from '@/filterDate/index'
const loginname = localStorage.getItem('username')
const obj = {
  ask: '问贴',
  share: '分享',
  job: '招聘',
  good: '精华',
  dev: '测试',
}
export default {
  data() {
    return {
      topicArray: [],
      showview: false,
    }
  },
  created() {
    this.getCollectsList()
  },
  methods: {
    async getCollectsList() {
      const res = await getCollects(loginname)
      res.data.forEach(async item => {
        item.show = true
        item.create_at = await moment(item.create_at)
        item.last_reply_at = await moment(item.last_reply_at)
        // 主题类型中译英
        for (const key in obj) {
          if (item.tab === key) {
            item.tab = obj[key]
          }
        }
      })
      // this.topicArray = res.data
      this.$refs.loading.closeLoading()
      this.$refs.loading.init(res.data)
    },
    showviewFn() {
      this.showview = true
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  height: 100vh;
}
.elview {
  height: 100%;
}
</style>>