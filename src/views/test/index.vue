<template>
  <div class="list">
    <h3>列表的懒加载</h3>

    <div v-for="(item, index) in list" :key="index">
      <div>{{ item.id }}</div>
    </div>

    <div>
      <button v-if="moreShowBoolen" @click="moreShow">点击查询更多</button>

      <div v-else>已无更多</div>
    </div>
  </div>
</template>

 

<script>
export default {
  data() {
    return {
      list: [],

      moreShowBoolen: false,

      nowPage: 1,
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.$axios.get('http://jsonplaceholder.typicode.com/posts').then(res => {
        if (res.data.length <= 10) {
          // 10条数据一页

          this.list = res.data

          this.moreShowBoolen = false
        } else {
          this.list = res.data.slice(0, 10)

          this.moreShowBoolen = true
        }
      })
    },

    moreShow() {
      // 点击查询更多
      this.$axios.get('http://jsonplaceholder.typicode.com/posts').then(res => {
        this.list = this.list.concat(
          res.data.slice(this.nowPage * 10, (this.nowPage + 1) * 10)
        )

        this.nowPage++

        if (res.data.length >= this.nowPage * 10) {
          this.moreShowBoolen = true
        } else {
          this.moreShowBoolen = false
        }
      })
    },
  },
}
</script>