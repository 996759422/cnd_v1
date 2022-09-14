<template>
  <div>
    <el-dialog
      title="新建主题"
      :visible="showDialog"
      width="65%"
      @close="handleClose"
    >
      <el-form ref="form" :model="topic" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="topic.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <EditorBar
            ref="richText"
            :value="topic.content"
            @input="topic.content = $event"
          ></EditorBar>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addTopic } from '@/api/topics'
const accesstoken = localStorage.getItem('token')
export default {
  data() {
    return {
      topic: {
        title: '',
        content: '',
      },
      showDialog: false,
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      },
    }
  },
  methods: {
    handleClose() {
      this.topic = {
        title: '',
        content: '',
      }
      this.$refs.form.resetFields()
      this.showDialog = false
    },
    async submitFn() {
      await this.$refs.form.validate()
      await addTopic({ ...this.topic, accesstoken, tab: 'dev' })
      this.handleClose()
      this.$message.success('发布成功！')
      this.$emit('init')
    },
  },
}
</script>

<style lang="scss" scoped>
</style>