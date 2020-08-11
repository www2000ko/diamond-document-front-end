import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Info from "../views/Info.vue";
import Forget from "../views/Forget.vue";
Vue.use(VueRouter);
const routes = [
  // 单纯的切换，redirect对应的是name
  {
    path: "/",
    redirect: "Home"
  },
  // 先在上方引入Home的vue对象，然后作为组件使用
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/forget",
    name: "Forget",
    component: Forget
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  },
  {
    path: "/info",
    name: "Info",
    component: Info
  }
];

const router = new VueRouter({
  routes
});

export default router;
