<template>
  <div class="forget">
    <Navigator return="forget" />
    <div>
      <el-form
        :model="rep_form"
        :rules="rules"
        ref="rep_form"
        label-width="100px"
        class="box"
      >
      <h3 class="box-title">找回密码</h3>
        <el-form-item label="注册邮箱" prop="email">
          <el-input v-model="rep_form.email"></el-input>
        </el-form-item>
        <el-form-item> 
        <el-button class="button" type="primary" :disabled="send_status" @click="verify">{{send_message}}</el-button>
        </el-form-item> 
        <el-form-item  label="验证码" prop="code">
          <el-input v-model="rep_form.code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="submitBtn" type="primary" @click="forgetpassword()">重置密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import Navigator from "@/components/Navigator.vue";
import jwt_decode from 'jwt-decode';
export default {
  name: "Forget",
  components: {
    Navigator
  },
  created() {
    if(localStorage.getItem('token')){
      const decoded = jwt_decode(localStorage.getItem('token'));
      console.log(decoded);
      global.loginflag=true;
      global.userName=decoded.name;
      global.userEmail=decoded.email;
      global.avatar=decoded.avatar;
      global.userid=decoded.id;
    }
  },
  data() {
      var checkcode = (rule, value, callback) => {
        if (value !== this.code) {
          callback(new Error('验证码错误'));
        } else {
          callback();
        }
      };
    return {
      rep_form:{
        email: "",
        code:""
      },
      rules:{
        email:[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        code:[
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: checkcode, trigger: 'change'  }
        ]
      },
      send_status:false,
      send_message:"获取验证码",
      code:-1
    };
  },
  methods: {
    forgetpassword() {
      var that = this;
      axios
        .post("http://175.24.53.216:8080/forgetpassword", {
          email: that.rep_form.email
        })
        .then(function(response) {
          alert(response.data.message);
          if (response.data.message == "reset password success")
            that.$router.push({ path: "/login" });
        })
        .catch(function(error) {
          alert(error);
        });
    },
    verify(){
      var that=this;
      that.code=Math.floor(Math.random() * (999999 - 100000) + 100000);
      axios
        .post("http://175.24.53.216:8080/verification", {
          type: "2",
          email: that.rep_form.email,
          code:String(that.code)
        })
        .then(function(response) {
          if (response.data.msg == "send email success")
            that.send_status=true;
            that.send_message="已发送";
        })
        .catch(function(error) {
          alert(error);
        });
    },
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
  }
};
</script>

<style scoped>
.box-title {
    text-align: center;
    margin: 0 auto 0px auto;
    padding: 0px 0px 0px 10px;
    color: #303133;
  }
.box { 
    border: 1px solid #DCDFE6;
    width: 350px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }
.submitBtn {
      display:block;
      margin:0 auto;
      background-color: transparent;
      color: #39f;
      width: 200px;
    }
.button{
  display:block;
  margin:0 auto;
}
</style>