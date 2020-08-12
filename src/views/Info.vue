<template>
  <div class="info">
    <Navigator return="info" />
    <el-container class="contianer">
    <el-aside class="card-aside">
    <!-- 第一框 -->
    <div style="margin-top: 15px;" class="card-one"  label-width="80px">
      <el-avatar :src="this.image_url" :size="80"></el-avatar>
      <h3 class="info-title">{{uname}} </h3>
    </div>
    
    <!-- 第2框 -->
    <div style="margin-top: 15px;"  label-width="80px">
      <el-menu
      :default-active="deactive"
      active-text-color="#ffd04b"
    >
    <!-- background-color="#545c64" -->
      <el-menu-item class="nav-title" index="myinfo" @click="changeinfoflag()" >
        个人信息
      </el-menu-item>
      <el-menu-item class="nav-title" index="mycode" @click="changecodeflag()" >
        账号密码
      </el-menu-item>
      <el-menu-item class="nav-title"  index="myteam" @click="changeteamflag()" >
        团队管理
      </el-menu-item>
    </el-menu>
    </div>
    </el-aside>
    <!-- 第3框 -->
    <el-main>
    <div class="card" label-width="80px" v-if="infoflag==1">
      <h4 class="card-header">个人信息</h4>
      <div class="card-content">
      头像
      <div class="img-box"> 
      <el-upload
        class="avatar-uploader"
        action="http://127.0.0.1:8080/upload"
        :http-request="customUpload"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload">
        <img v-if="image_url" :src="image_url" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      </div>
      用户名{{uname}}
      <br/>
      邮箱{{email}} 

      <div class="radio">
          性别
          <el-radio v-model="sex" label="1">男</el-radio>
          <el-radio v-model="sex" label="0">女</el-radio>
      </div>


        生日
        <el-date-picker
          v-model="birth"
          type="date"
          placeholder="选择日期"
          >
        </el-date-picker>

        <br/>
        联系方式
        <el-input
        placeholder="phonenumber"
        v-model="phonenumber"
        ></el-input>

        <br/>
        所在地
        <el-input
        placeholder="location"
        v-model="location"
        ></el-input>


      <el-button
        type="primary"
        @click="confirm()"
        >保存
      </el-button>
      </div>
    </div>


    <!-- 第4框 -->
    <div class="card" label-width="80px" v-if="codeflag==1">
      <h4 class="card-header">账号密码</h4>
      登录帐号
      {{email}}

      <el-form
        :model="code_form"
        :rules="rules"
        ref="code_form"
      >
      新密码
        <el-form-item prop="passwd1">
          <el-input type="password" v-model="code_form.passwd1"></el-input>
        </el-form-item> 
      确认密码
        <el-form-item prop="passwd2">
          <el-input type="password" v-model="code_form.passwd2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('code_form')">修改密码</el-button>
        </el-form-item>
      </el-form>

    </div>

    

    <!-- 第5框 -->
    <div class="card" label-width="80px" v-if="teamflag==1">
      <h4 class="card-header">团队管理</h4>
    </div>
    </el-main>
    </el-container>
  </div>
</template>


<script>
// @ is an alias to /src
import axios from "axios";
import Navigator from "@/components/Navigator.vue";
import global from "@/components/global.vue";
export default {
  name: "Info",
  components: {
    Navigator
  },
  created() {

  },
  data() {
    var checkpassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请重复输入密码'));
        } else if (value !== this.code_form.passwd1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      code_form:{
        passwd1: "",
        passwd2: "",
      },
      rules:{
        passwd1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' }
          ],
        passwd2: [
            { required: true, message: '请重复输入密码', trigger: 'blur' },
            { min: 5, max: 15, message: '长度在 5 到 15 个字符', trigger: 'blur' },
            { validator: checkpassword, trigger: 'blur' }
          ]
      },
      passwd1:"",
      passwd2:"",
      location:'',
      phonenumber:'',
      birth: '',
      deactive:"myinfo",
      infoflag:1,
      codeflag:0,
      teamflag:0,
      sex:"1",
      uname: "临时用户",
      email: "临时邮箱",
      image_url:"临时路径",
    };
  },
  mounted(){
    this.email = global.userEmail
    this.uname = global.userName
    this.getinfo();
  },
  methods: {
    changeinfoflag() {
      (this.infoflag = 1), (this.codeflag = 0), (this.teamflag = 0);
    },
    changecodeflag() {
      (this.infoflag = 0), (this.codeflag = 1), (this.teamflag = 0);
    },
    changeteamflag() {
      (this.infoflag = 0), (this.codeflag = 0), (this.teamflag = 1);
    },
    getinfo(){
      var that = this;
      axios
        .post("http://127.0.0.1:8080/getinfo", {
          email: that.email,
        })
        .then(function(response) {
          //that.$set()
          that.uname=response.data.name;
          that.email=response.data.email;
          that.sex=String(response.data.gender);
          that.image_url=response.data.avatar;
          that.phonenumber=response.data.phone;
          that.birth=response.data.birthday;
          that.location=response.data.address;
        })
        .catch(function(error) {
          alert(error);
        });
    },
    submitForm() {
      var that = this;
        axios
          .post("http://127.0.0.1:8080/changepassword", {
            email: that.email,
            new_password: that.code_form.passwd1,
          })
          .then(function(response) {
            if (response.data.msg == "change password success") {
              alert("修改成功！");
            }
            else
            {
              alert("修改失败！");
            }
          })
          .catch(function(error) {
            alert(error);
          });
      },
    confirm() {
      var that = this;
        axios
          .post("http://127.0.0.1:8080/info", {
            email: that.email,
            name: that.uname,
            avatar: String(that.image_url),
            gender: Number(that.sex),
            phone: that.phonenumber,
            birthday: that.birth,
            address: that.location
          })
          .then(function(res) {
            alert("修改成功！");
            that.$store.commit('setToken',JSON.stringify(res.data.token));
          })
          .catch(function(error) {
            alert(error);
          });
      },
    handleAvatarSuccess(response,file) {
       console.log("111")
        //this.image_url=response.data.image_url;
        //this.upload_url=response.data.image_url;
        //console.log(this.upload_url); 
        console.log(URL.createObjectURL(file.raw));
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      customUpload(fileobj){
        const isJPG = fileobj.file.type === 'image/jpeg';
        const isLt2M = fileobj.file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');return;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');return;
        }
        let param=new FormData;
        param.append('file',fileobj.file);
        var that= this;
        axios
        .post("http://127.0.0.1:8080/upload",param)
        .then(function(res) {
          that.image_url=res.data.url;
          global.avatar=res.data.url;
          console.log(res.data.url);
        })
        .catch(function(error) {
          alert(error);
        });
    },
      
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    margin:0 auto;
  }
  .avatar {
    width: 178px;
    height: 178px;
  }
  .info-box {
    border: 1px solid #DCDFE6;
    width: 60%;
    margin: 180px auto;
    text-align:center;
    padding: 35px 35px 15px 0px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }
  .img-box {
    border: 1px solid #DCDFE6;
    width: 178px;
    margin: 10px auto;
    padding: 0px 0px 0px 0px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
  }
  .info-title {
    text-align: center;
    margin: 0 auto;
    padding: 0px 0px 0px 10px;
    color: #303133;
  }
  .radio{
    display:block;
    margin: 0px auto;
  }
  
  .card-header{padding:10px 15px 10px 5px;margin-left:10px;font-size:20px;line-height:30px;border-bottom:1px solid rgba(0,0,0,.12)}
  .card-content{padding:10px 15px 10px 5px;margin-left:10px;
    text-align:center;
    padding: 35px 35px 15px 0px;}
  .card-one{
    padding:10px 15px 10px 5px;
    font-size: 14px;
    color: #383838;
    line-height: 20px;
    box-sizing: border-box;
    border: 0;
    box-shadow: rgba(0,0,0,.0470588) 0 2px 3px 0;
    -webkit-border-radius: 2px;
    background: #FFF;
    margin-bottom: 20px;
    transition: all .3s;
    transition-delay: .1s;
    opacity: 1;
    transform: translate3d(0,0,0) scale(1);
  }
  .contianer{
    -webkit-tap-highlight-color: transparent;
    font-size: 14px;
    color: #383838;
    line-height: 20px;
    box-sizing: border-box;
    margin-right: auto;
    margin-left: auto;
    padding-left: 10px;
    padding-right: 10px;
    max-width: 980px;
    width: 100%;
  }
  .card {
    background-color: #fff;
    border: 0;
    border-radius: 2px;
    -webkit-box-shadow: rgba(0,0,0,.0470588) 0 2px 3px 0;
    box-shadow: rgba(0,0,0,.0470588) 0 2px 3px 0;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
  }
  .nav-title{
    -webkit-tap-highlight-color: transparent;
    line-height: 20px;
    list-style: none;
    cursor: pointer;
    font-size: 18px;
    color: grey;
    box-sizing: border-box;
    padding:10px 15px 10px 5px;
  }
</style>
