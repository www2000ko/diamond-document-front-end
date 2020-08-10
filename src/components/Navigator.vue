<template>
  <div id="navigator">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      active-text-color="#ffd04b"
    >
    <!-- background-color="#545c64" -->
      <el-menu-item index="home" @click="toHome" >
        首页
      </el-menu-item>
      <el-menu-item style="float:right" index="info" @click="toInfo" >
        个人信息
      </el-menu-item>
      <el-menu-item style="float:right" index="signup" @click="toSignup" >
        注册
      </el-menu-item>
      <el-menu-item style="float:right" index="login" @click="toLogin">
        登录
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Navigator",
  props: {
    return: String
  },
  data() {
    return {
      //returnType: this.return === "true" ? true : false,
      activeIndex: this.return,
      // loginflag: this.$root.loginflag,
      // username: this.$root.username
    };
  },
  methods: {
    toHome() {
      this.$router.push({ path: "/home" });
    },
    toSignup() {
      this.$router.push({ path: "/signup" });
    },
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    toInfo() {
      this.$router.push({ path: "/info" });
    }
  }
};
</script>

<style scoped lang="stylus"></style>
