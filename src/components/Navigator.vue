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
      <el-menu-item style="float:right" index="break" @click="toBreak">
        茶歇GameBreak
      </el-menu-item>
      <el-menu-item style="float:right" index="info" @click="toInfo" v-if="loginflag==true">
        个人信息
      </el-menu-item>
      <el-menu-item style="float:right" index="dropout" @click="drop" v-if="loginflag"
        >注销</el-menu-item
      >
      <el-menu-item style="float:right" index="signup" @click="toSignup" v-if="loginflag==false">
        注册
      </el-menu-item>
      <el-menu-item style="float:right" index="login" @click="toLogin" v-if="loginflag==false">
        登录
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import global from "@/components/global.vue";
export default {
  name: "Navigator",
  props: {
    return: String
  },
  data() {
    return {
      //returnType: this.return === "true" ? true : false,
      activeIndex: this.return,
      loginflag: global.loginflag,
      // username: this.$root.username
    };
  },
  methods: {
    toHome() {
      this.$router.push({ path: "/home" });
    },
    toBreak() {
      this.$router.push({ path: "/break" });
    },
    toSignup() {
      this.$router.push({ path: "/signup" });
    },
    toLogin() {
      this.$router.push({ path: "/login" });
    },
    toInfo() {
      this.$router.push({ path: "/info" });
    },
    drop(){
      global.username="";
      global.userid=0;
      global.email
      global.loginflag=false;
       global.userEmail="";
      this.toLogin();
    }
  }
};
</script>

<style scoped lang="stylus"></style>
