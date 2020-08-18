<template>
  <div class="login">
    <Navigator return="login" />
      <el-form ref="login_form" :model="login_form" :rules="rules" label-width="80px" class="login-box">
      <h3 class="login-title">要登录了</h3>
      <el-form-item label="账号" prop="email">  
      <el-input
        placeholder="email"
        v-model="login_form.email"
        class="input-with-select"
      ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
      <el-input
        type="password"
        placeholder="password"
        v-model="login_form.password"
        class="input-with-select"
      ></el-input>
      </el-form-item>
        <el-button class="submitBtn" type="primary" @click="submitForm('login_form')">登录</el-button>
        <br>
        <el-button style="display:block;margin:0 auto" v-if="showrepassword==true" @click="toRepassword">
          忘记密码？
        </el-button>
        </el-form>
        
  </div>
</template>

<script>
import axios from "axios";
import Navigator from "@/components/Navigator.vue";
import global from "@/components/global.vue";
import jwt_decode from 'jwt-decode';
export default {
  name: "Login",
  components: {
    Navigator
  },
  data() {
    return {
      login_form:{
        email: "",
        password: ""
      },
      showrepassword: false,
      rules:{
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ]
      },
    };
  },
  created()
  {
    this.showrepassword=false
    global.loginflag=false
  },
  methods: {
    toRepassword(){
      this.$router.push({ path: "/Forget" });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
      var that = this;
      axios
        .post("http://175.24.53.216:8080/login", that.login_form)
        .then(function(response) {
          if (response.data.msg == "login success") {
            const decoded = jwt_decode(response.data.token);            
            console.log(decoded);            
            global.loginflag = true;            
            global.userName = decoded.name;            
            global.userid = decoded.id;            
            global.avatar=decoded.avater;        
            global.userEmail = decoded.email;     
            that.$store.commit('setToken',response.data.token);
            that.$message({
					type: 'success',
					message: '登录成功!'
				});
            //alert(Navigator.username );
            //this.forceUpdate();
            //this.$root.username = that.uname;
            //this.$root.loginflag = true;
            that.$router.push({
              path: "/home"
            });
          }
          else if(response.data.msg == "login fail")
          {
            that.$message({
					type: 'danger',
					message: '登录失败!'
				});
            that.showrepassword=true;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
    }
  }
};
</script>

<style scoped>
.login-box {
    border: 1px solid #DCDFE6;
    width: 350px;
    margin: 180px auto;
    padding: 35px 35px 15px 0px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }

.login-title {
    text-align: center;
    margin: 0 auto 40px auto;
    padding: 0px 0px 0px 10px;
    color: #303133;
  }

.submitBtn {
      display:block;
      text-align: center;
      margin: 0px auto;
      background-color: transparent;
      color: #39f;
      width: 200px;
    }
</style>
