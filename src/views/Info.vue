<template>
  <div class="info">
    <Navigator return="info" />
    <!-- 第一框 -->
    <div style="margin-top: 15px;" class="info-box" label-width="80px">
      <el-avatar :src="this.image_url" :size="80"></el-avatar>
      <h3 class="info-title">{{uname}} </h3>
    </div>
    <!-- 第2框 -->
    <div style="margin-top: 15px;" class="info-box" label-width="80px">
      <el-menu
      :default-active="deactive"
      active-text-color="#ffd04b"
    >
    <!-- background-color="#545c64" -->
      <el-menu-item index="myinfo" @click="changeinfoflag()" >
        个人信息
      </el-menu-item>
      <el-menu-item index="mycode" @click="changecodeflag()" >
        账号密码
      </el-menu-item>
      <el-menu-item  index="myteam" @click="changeteamflag()" >
        团队管理
      </el-menu-item>
    </el-menu>
    </div>
    <!-- 第3框 -->
    <div style="margin-top: 15px;" class="info-box" label-width="80px" v-if="infoflag==1">
      个人信息
      头像
      <div class="img-box"> 
      <el-upload
        class="avatar-uploader"
        action="http://127.0.0.1:5000/uploadavatar"
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
          v-model="value1"
          type="date"
          placeholder="选择日期">
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


    <!-- 第4框 -->
    <div style="margin-top: 15px;" class="info-box" label-width="80px" v-if="codeflag==1">
      登录帐号
      {{email}}

      登录密码

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
    <div style="margin-top: 15px;" class="info-box" label-width="80px" v-if="teamflag==1">

    </div>

  </div>
</template>


<script>
// @ is an alias to /src
import axios from "axios";
import Navigator from "@/components/Navigator.vue";
import global from "@/components/global.vue";
import jwt_decode from 'jwt-decode';
export default {
  name: "Info",
  components: {
    Navigator
  },
  created() {
    if(this.$store.getters.getToken){
      const decoded = jwt_decode(this.$store.getters.getToken);
      console.log(decoded);
      global.loginflag=true;
      global.username=decoded.name;
      global.avatar=decoded.avatar;
      global.userid=decoded.id;
    }
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
      value1: '',
      deactive:"myinfo",
      infoflag:1,
      codeflag:0,
      teamflag:0,
      sex:"1",
      uname: "临时用户",
      email: "临时邮箱",
      image_url:'',
    };
  },
  mounted(){
    this.uname = global.username
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
    gethisblogs() {
      var that = this;
      axios
        .post("http://127.0.0.1:5000/allhisblog", {
          username: that.uname
        })
        .then(function(response) {
          that.hisblogs=response
        })
        .catch(function(error) {
          alert(error);
        });
    },
    getinfo(){
      var that = this;
      axios
        .post("http://127.0.0.1:5000/getinfo", {
          username: that.uname,
        })
        .then(function(response) {
          //that.$set()
          that.email=response.data.email;
          that.info_form.age=response.data.old;
          that.sex=String(response.data.sex);
          that.fansnum=response.data.fansnum;
          that.follownum=response.data.follownum;
        })
        .catch(function(error) {
          alert(error);
        });
    },
    confirm() {
      var that = this;
        axios
          .post("http://127.0.0.1:5000/info", {
            username: that.uname,
            age: that.info_form.age,
            sex: that.sex,
            avatar:that.image_url
          })
          .then(function(res) {
            alert("修改成功！");
            that.$store.commit('setToken',JSON.stringify(res.data.token));
            that.tomyinfo();
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
        .post("http://127.0.0.1:5000/uploadavatar", param)
        .then(function(res) {
          that.image_url=res.data.image_url;
          console.log(res.data.image_url);
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
</style>
