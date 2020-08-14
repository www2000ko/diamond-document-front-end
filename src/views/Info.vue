<template>
  <div class="info">
    <div class="Navbar"><Navigator return="info" /></div>
    <el-container class="contianer">
    <el-aside class="card-aside">
    <!-- 第一框 -->
    <div style="margin-top: 15px;" class="card-one"  label-width="80px">
      <el-avatar :src="this.image_url" :size="80" class="sidebar-avatar"></el-avatar>
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
      <el-row>
      <el-col :span=6 class="prototype prototype-avatar">
      <span style="display: table-cell;
                  vertical-align: middle;
                  text-align: center;">头像</span>
      </el-col>
      <el-col :span=18 class="cont prototype-cont">
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
      </el-col>
      <el-col :span=6 class="prototype">
      用户名
      </el-col>
      <el-col :span=18 class="cont">
      {{uname}}
      </el-col>
      <el-col :span=6 class="prototype">
      邮箱
      </el-col>
      <el-col :span=18 class="cont">
      {{email}} 
      </el-col>
      <el-col :span=6 class="prototype">
          性别
      </el-col>
      <el-col :span=18 class="cont">
          <el-radio v-model="sex" label="1">男</el-radio>
          <el-radio v-model="sex" label="0">女</el-radio>
      </el-col>
      <el-col :span=6 class="prototype">
        生日
      </el-col>
      <el-col :span=18 class="cont">
        <el-date-picker
          v-model="birth"
          type="date"
          placeholder="选择日期"
          >
        </el-date-picker>
      </el-col>
      <el-col :span=6 class="prototype">
        联系方式
      </el-col>
      <el-col :span=18 class="cont">
        <el-input
        placeholder="telephone number"
        v-model="phonenumber"
        ></el-input>
      </el-col>
      <el-col :span=6 class="prototype">
        所在地
      </el-col>
      <el-col :span=18 class="cont">
        <el-input
        placeholder="location"
        v-model="location"
        ></el-input>
      </el-col>
      </el-row>
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
      <el-row>
      <el-col :span=6 class="prototype card4prototypes">
      登录帐号
      </el-col>
      <el-col :span=18 class="cont">
      {{email}}
      </el-col></el-row>
      <el-row>
      <el-form
        :model="code_form"
        :rules="rules"
        ref="code_form"
      >
      <el-col :span=6 class="prototype card4prototypes">
      新密码</el-col>
      <el-col :span=18 class="cont card4input">
        <el-form-item prop="passwd1">
          <el-input type="password" v-model="code_form.passwd1"></el-input>
        </el-form-item></el-col>
      <el-col :span=6 class="prototype card4prototypes">
      确认密码</el-col>
      <el-col :span=18 class="cont card4input">
        <el-form-item prop="passwd2">
          <el-input type="password" v-model="code_form.passwd2"></el-input>
        </el-form-item></el-col>
      <el-col :span=6 style="border:2px solid white;"></el-col>
      <el-col :span=18>  
        <el-form-item>
          <el-button type="primary" @click="submitForm('code_form')">修改密码</el-button>
        </el-form-item></el-col>
      </el-form></el-row>

    </div>

    

    <!-- 第5框 -->
    <div class="card" label-width="80px" v-if="teamflag==1">
      <h4 class="card-header">团队管理</h4>
      <div >
        <div v-for="item in allteams" :key="item.id">
          <h5>{{item.name}}</h5>
          id：{{item.id}}
          创建日期:{{item.create_time}} 
          创建人:{{item.create_user}}
          团队人数：{{item.number}}
          <el-button v-if="item.create_user_id==uid" @click="openList(item.id)">管 理</el-button>
          <el-button v-if="item.create_user_id!=uid" @click="quitTeam(item.id)">退 出</el-button>
          <el-divider></el-divider>
        </div>
      </div>
    </div>
<!-- 团队人员管理 -->
    <el-dialog
          title="团队成员"
          :visible.sync="listVisible"
          width="30%">
          <div v-for="item in allMembers" :key="item.id">
              {{item.member_name}}
              <el-divider></el-divider>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="listVisible = false">关 闭</el-button>
            <el-button @click="listVisible = false,eliminate(team_id)">解散团队</el-button>
          </span>
    </el-dialog>

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
    this.email = global.userEmail
    this.uid=global.userid
    this.myteam();
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
      team_id:0,
      passwd1:"",
      passwd2:"",
      allteams:"",
      allMembers:"",
      location:'',
      phonenumber:'',
      birth: '',
      deactive:"myinfo",
      infoflag:1,
      codeflag:0,
      teamflag:0,
      sex:"1",
      uname: "临时用户",
      uid:0,
      email: "临时邮箱",
      image_url:"临时路径",
      listVisible:false,
    };
  },
  mounted(){
    this.email = global.userEmail
    this.uname = global.userName
    this.getinfo();
  },
  methods: {
    eliminate(team_id){
      var that = this;
      axios
        .post("http://127.0.0.1:8080/eliminate", {
          email: that.email,
          id:team_id,
        })
        .then(function(response) {
          console.log(response.data.msg);
          that.$message({
              message: '解散成功',
              type: 'success'
            });
            that.myteam()
        })
        .catch(function(error) {
          alert(error);
        });
    },
    getTeamMember(team_id){
      var that = this;
      axios
        .post("http://127.0.0.1:8080/getTeamMember", {
          email: that.email,
          id:team_id

        })
        .then(function(response) {
          //that.$set()
          that.allMembers=response.data;
        })
        .catch(function(error) {
          alert(error);
        });
    },
    openList(id)
    {
      this.listVisible = true,
      this.team_id=id;
      this.getTeamMember(id)
    },
    quitTeam(taemid){
      var that = this;
        axios
        // here
          .post("http://127.0.0.1:8080/quitteam", {//127.0.0.1:8080
            id:taemid,
            email: that.email,
          })
          .then(function(response) {
            that.$message({
              message: '退出成功',
              type: 'success'
            });
            that.myteam()
            console.log(response.data.msg);
          })
          .catch(function(error) {
            alert(error);
          });
    },
    myteam(){
      var that = this;
        axios
        // here
          .post("http://127.0.0.1:8080/myTeam", {//127.0.0.1:8080
            email: that.email,
          })
          .then(function(response) {
            that.allteams=response.data;
            console.log(that.allteams);
          })
          .catch(function(error) {
            alert(error);
          });
    },
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
    border: 1px solid #DCDFE6;
    width:120px;
    height:120px;
    border-radius: 50%;
    background-color:#CCFFCC;
  }
  .img-box {
    /* //border: 1px solid #DCDFE6; */
    width: 178px;
    margin: 10px auto;
    padding: 0px 0px 0px 0px;
    /* //border-radius: 50%; */
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
  }
  .prototype {
    float:left;
    text-align:left;
    /* //background-color:#CCCCFF; */
    height:50px;
    margin-bottom: 10px;
    font-weight:bold;
    color:gray;
  }
  .cont {
    /* //border:1px solid gray;
    //border-radius: 5px; */
    float:right;
    height:50px;
    text-align:left;
    margin-bottom: 10px;
  }
  .prototype-avatar {
    height:130px;
  }
  .prototype-cont {
    height:130px;
  }
  .card4prototypes{
    text-indent: 1em;
  }
  .card4input{
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
  .info-title {
    text-align: center;
    margin-top: 30px;
    margin-right:70px;
    padding: 0px 0px 0px 20px;
    color: #303133;
    float:right;
    font-size:large;
    /* //background-color:black; */
  }
  .radio{
    display:block;
    margin: 0px auto;
  }
  
  .card-header{padding:10px 15px 10px 5px;margin-left:10px;font-size:20px;line-height:30px;border-bottom:1px solid rgba(0,0,0,.12)}

  .card-content{padding:10px 15px 10px 5px;margin-left:10px;
    text-align:center;
    padding: 35px 35px 15px 0px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
  .card-box{
    border-bottom:1px solid rgba(0,0,0,.12);
  }
  .card-aside {
    margin-top:32px;
  }
  .sidebar-avatar{
    background-color:#FFCCFF;
  }
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
    margin-top:20px;
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
