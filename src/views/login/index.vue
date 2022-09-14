<template>
  <div class="login">
    <el-form
      label-position="left"
      label-width="80px"
      :model="formData"
      :rules="rules"
      ref="form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="Token" prop="token">
        <el-input v-model="formData.token" placeholder="请输入Token" />
      </el-form-item>
      <el-row type="flex" justify="end">
        <a href="https://cnodejs.org/signin" class="register">点击注册</a>
      </el-row>
      <el-row>
        <el-button type="primary" @click="commitFn">点击登录</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUser } from '@/api/user'
export default {
  data() {
    return {
      formData: {
        // username: 'itcastWsy',
        username: '',
        // token: 'd406f179-44a2-4bfa-b7ca-ae9e4c42cc87',
        token: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        token: [
          { required: true, message: '请输入用户Token', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    async commitFn() {
      await this.$refs.form.validate()
      await getUser(this.formData.username)
      this.$message.success('登陆成功')
      localStorage.setItem('username', this.formData.username)
      localStorage.setItem('token', this.formData.token)
      this.$router.push('/topics')
    },
  },
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url('@/assets/bg.png');
  .el-form {
    padding: 30px;
    border-radius: 10px;
    border: 1px solid #000;
    background: #fff;
    .el-row {
      margin-top: 10px;
      .el-button {
        display: block;
        width: 100%;
      }
    }
    .tips {
      color: #ccc;
      font-size: 14px;
    }
  }
}
.register {
  text-decoration: none;
  color: #409eff;
  &:hover {
    text-decoration: underline;
  }
}
</style>