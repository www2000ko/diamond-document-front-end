<template>
  <div class="home">
    <Navigator return="home" />
    <el-row :span="10">
      <!-- 左侧导航栏 -->
    <el-col :span="5">
     <el-menu
      default-active="1"
      class="el-menu-vertical-demo">

      <el-menu-item index="1" @click="tomyzone()">
        <i class="el-icon-menu"></i>
        <span slot="title" >工作台</span>
      </el-menu-item>
      
      <el-menu-item index="2" @click="pageflag=2" :disabled="teamid!=0">
        <i class="el-icon-message"></i>
        <span slot="title" >收件箱</span>
      </el-menu-item>

      <el-menu-item index="3" @click="torecycle()" :disabled="teamid!=0">
        <i class="el-icon-delete"></i>
        <span slot="title" >回收站</span>
      </el-menu-item>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>团队空间</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="toggleModalCreate">
            <template slot="title" >
              <i class="el-icon-plus"></i>
              <span slot="title" >新建团队</span>
            </template>
          </el-menu-item>
          <el-menu-item @click="toggleModalJoin">
            <i class="el-icon-zoom-in"></i>
            <span slot="title" >加入团队</span>
          </el-menu-item>
          <el-menu-item  v-for="item in allteams" :key="item.id">
            <i :v-if="item.create_user==userid" class="el-icon-s-tools"></i>
            <i :v-if="item.create_user!=userid" class="el-icon-tools"></i>
              <span slot="title" @click="toTeamSpace(item.id)">{{item.name}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="19">
      <!-- 工作台页面 -->
      
      <div v-if="pageflag==1">
        <!-- 上方分类 -->
        <el-row>
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1"  v-if="teamid!=0">团队文档</el-menu-item>
          <el-menu-item index="1" @click="changesearchkind(1)" v-if="teamid==0">最近使用</el-menu-item>
          <el-menu-item index="2" @click="changesearchkind(2)" v-if="teamid==0">我创建的</el-menu-item>
          <el-menu-item index="3" @click="changesearchkind(3)" v-if="teamid==0">我的收藏</el-menu-item>
          <el-menu-item index="4" style="float:right" @click="createdoc()">新建文档</el-menu-item>
          <el-menu-item index="5" style="float:right" @click="modelVisible = true,this.modelid=0">按模版新建</el-menu-item>
        </el-menu>
        </el-row>
        <!-- 下方内容 -->
            <div class="files" v-for="item in allfiles" :key="item.id" >
              <div class="box">
                <div @click="tothisdoc(item.doc_id)">{{item.title}}</div>
                创建时间:{{item.create_time}}
                <div @click="openinfo(item.modify_user_email)">上次修改人:{{item.modify_user}}</div>
                上次修改时间:{{item.modify_time}}
                <div @click="openinfo(item.create_user_email)">创建人:{{item.create_user}}</div>
              </div>
           </div>
<!-- 信息弹窗 -->
          <el-dialog
            title="用户信息"
            :visible.sync="infoVisible"
            width="30%">
            <span>{{userinfo.name}}</span>
            <span>{{userinfo.email}}</span>
            <span>{{userinfo.avatar}}</span>
            <span>{{userinfo.gender}}</span>
            <span>{{userinfo.phone}}</span>
            <span>{{userinfo.birthday}}</span>
            <span>{{userinfo.address}}</span>
          </el-dialog>
      </div>
<!-- 模版界面 -->

        <el-dialog
          title="提示"
          :visible.sync="modelVisible"
          width="30%">
          <div v-for="item in allforms" :key="item.id" @click="changemodelid(item.id)">
              {{item.title}}
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modelVisible = false,changemodelid(0)">取 消</el-button>
            <el-button type="primary" @click="usethismodel()" :disabled="this.modelid===0?true:false">确 定</el-button>
          </span>
        </el-dialog>



      <!-- 收件箱页面 -->
      <div v-if="pageflag==2">
        hi2
      </div>
      <!-- 回收站页面 -->
      <div v-if="pageflag==3">
       <el-row>
            <div class="deletefiles" v-for="item in alldeleted" :key="item.id">
            <div class="box" @click="openremove(item.doc_id)">
              {{item.title}}
                创建时间:{{item.create_time}}
                上次修改人:{{item.modify_user}}
                上次修改时间:{{item.modify_time}}
                创建人:{{item.create_user}}
            </div>
           </div>
        </el-row>


      </div>
    </el-col>
    </el-row>



    

      <div v-if="showCreateModal">
      <div class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h3>新建团队</h3>
          </div>
          <div class="modal-body">
            <el-form ref="createTeam_form" :model="createTeam_form" :rules="rules" label-width="80px" >
              <el-form-item label="团队名称" prop="team_name">  
                <el-input
                placeholder="team name"
                v-model="createTeam_form.team_name"
                class="input-with-select"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-confirm" @click="submitCreateForm('createTeam_form'),closemeCreate()">确认</button>
            <button type="button" class="btn-close" @click="closemeCreate">关闭</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showJoinModal">
      <div class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h3>加入团队</h3>
          </div>
          <div class="modal-body">
            <el-form ref="searchTeam_form" :model="searchTeam_form" :rules="rules" label-width="80px" >
              <el-form-item label="团队名称" prop="team_name">  
                <el-input
                placeholder="team name"
                v-model="searchTeam_form.team_name"
                class="input-with-select"
                >
                </el-input>
              </el-form-item>
              <button type="button" class="btn-confirm" @click="submitSearchForm('searchTeam_form')" style="float: right;">确认</button>
            </el-form>
            
          </div>
          <div class="modal-footer">
            <div class="team" v-for="item in searchteams" :key="item.id">
              <div style="border-bottom: 1px solid #DCDFE6;">
                 <span>{{item.team_name}}</span>
                 <span>id:{{item.id}}</span>
                 <span>创建人:{{item.create_user_name}}</span>
                 <button type="button" class="btn-request" style="float: right;">申请加入</button>
              </div>
              <br>
            </div>
            <button type="button" class="btn-close" @click="closemeJoin" style="float: right;">关闭</button>
          </div>
        </div>
      </div>
    </div>

  </div>





  
</template>


<script>
// @ is an alias to /src
import Navigator from "@/components/Navigator.vue";
import global from "@/components/global.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    Navigator
  },
  data() {
    return {
      modelVisible:false,
      modelid:0,
      teamid:0,
      userid:0,
      recycleflag:false,
      infoVisible:false,
      email:"临时邮箱",
      searchkind:1,
      pageflag:1,
      allfiles:{},
      alldeleted:{},
      allteams:{},
      searchteams:{},
      userinfo:{},
      allforms:{
        "1":{"id":1,"title":"笔记"},
        "2":{"id":2,"title":"代码"},
        "3":{"id":3,"title":"列表"}
      },
      showCreateModal:false,
      showJoinModal:false,
      createTeam_form:{
        email: "",
        team_name:""
      },
      searchTeam_form:{
        team_name:"",
      },
      rules:{
        team_name:[
          { required: true, message: '请输入团队名称', trigger: 'blur' },
          { max: 15, message: '长度不能大于 15 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  created()
  {
    this.userid=global.userid
    this.email=global.userEmail
    this.search()
    this.modelid=0
    this.myteam()
    if(global.userid==0){
      this.$router.push({ path: "/login" });
    }
  },
  methods: {
    myteam(){
      var that = this;
        axios
        // here
          .post("http://175.24.53.216:8080/myTeam", {//127.0.0.1:8080
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
    getinfo(byemail){
      var that = this;
      axios
        .post("http://175.24.53.216:8080/getinfo", {
          email: byemail,
        })
        .then(function(response) {
          //that.$set()
          that.userinfo=response.data
        })
        .catch(function(error) {
          alert(error);
        });
    },
    openinfo(infouseremail)
    {
      this.infoVisible = true,
      this.getinfo(infouseremail)
    },
    usethismodel()
    {
      var that = this;
          axios
        .post("http://175.24.53.216:8080/get_model_content", {
          id: that.modelid,
        })
        .then(function(response) {
              axios
              .post("http://175.24.53.216:8080/save_new_doc", {
                team_id: Number(that.teamid),
                content: response.data.content,
                title: response.data.title,
                email: that.email,
              })
              .then(function(response) {
                that.$router.push({
                name: "Viewdoc",
                params: {
                kind: 1,
                docid: response.data.doc_id,
              }
            });
              })
              .catch(function(error) {
                alert(error);
              });
        })
        .catch(function(error) {
          alert(error);
        });
    },
    changemodelid(id)
    {
      this.modelid=id
    },
    openremove(docid) {
      this.$confirm('是否恢复本文档?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var that = this;
        axios
      .post("http://175.24.53.216:8080/recover", {
        id: docid,
        email: that.email,
      })
      .then(function(response) {
        if(response.data.msg!="recover success")
        {
          alert("error")
        }
      })
      .catch(function(error) {
        alert(error);
      });
      this.changesearchkind(4)
        this.$message({
          type: 'success',
          message: '恢复成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        });          
      });
    },
    tomyzone()
    {
      this.pageflag=1;
      this.teamid=0;
      this.search()
    },
    torecycle()
    {
      this.pageflag=3;
      this.changesearchkind(4)
    },
    tothisdoc(docid)
    {
      alert(docid)
      this.$router.push({
        name: "Viewdoc",
        params: {
          kind: 0,
          docid: docid,
        },
      })
    },
    toTeamSpace(id){
      this.pageflag=1;
      this.teamid=id;
      this.searchTeamfile();
      console.log(this.teamid) 
    },
    submitCreateForm(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
      var that = this;
      that.createTeam_form.email=global.userEmail;
      axios
      // here
        .post("http://175.24.53.216:8080/buildteam", that.createTeam_form)//175.24.53.216:8080 127.0.0.1:8080
        .then(function(response) {
          alert(response.data.msg);
          that.myteam()
        })
        .catch(function(error) {
          alert(error);
          console.log(error);
        });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    submitSearchForm(formName) {
      this.$refs[formName].validate((valid) => {
      if (valid) {
      var that = this;
      that.createTeam_form.email=global.userEmail;
      axios
      // here
        .post("http://175.24.53.216:8080/searchTeam", that.searchTeam_form)//175.24.53.216:8080 127.0.0.1:8080
        .then(function(response) {
          that.searchteams=response.data;
        })
        .catch(function(error) {
          alert(error);
          console.log(error);
        });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    toggleModalCreate:function(){
      this.showCreateModal = !this.showCreateModal;
    },
    closemeCreate:function(){
      this.showCreateModal = !this.showCreateModal;
    },
    toggleModalJoin:function(){
      this.showJoinModal = !this.showJoinModal;
      console.log(this.showJoinModal)
    },
    closemeJoin:function(){
      this.showJoinModal = !this.showJoinModal;
    },
    createdoc()
    {
      var that = this;
          axios
          .post("http://127.0.0.1:8080/save_new_doc", {
            team_id: Number(that.teamid),
            content: "",
            title: "未命名",
            email: that.email,
          })
          .then(function(response) {
            that.$router.push({
            name: "Viewdoc",
            params: {
            kind: 1,
            docid: response.data.doc_id,
          }
        });
          })
          .catch(function(error) {
            alert(error);
          });
    },
    createdocbymodle(title,content)
    {
      var that = this;
          axios
          .post("http://175.24.53.216:8080/save_new_doc", {
            team_id: Number(that.teamid),
            content: content,
            title: title,
            email: that.email,
          })
          .then(function(response) {
            that.$router.push({
            name: "Viewdoc",
            params: {
            kind: 1,
            docid: response.data.doc_id,
          }
        });
          })
          .catch(function(error) {
            alert(error);
          });
    },
    changesearchkind(aint)
     {
      this.searchkind=aint,
      this.search()
     },
    getformcontent(thisid)
    {
         var that = this;
         axios
           .post("http://175.24.53.216:8080/get_model_content", {
             id:thisid
           })
           .then(function(response) {
               that.createdocbymodle(response.data.title,response.data.content);
           })
           .catch(function(error) {
             alert(error);
           });
    },
    search() {
      var that = this;
        axios
          .post("http://175.24.53.216:8080/home", {
            id: that.userid,
            kind: that.searchkind
          })
          .then(function(response) {
            if(that.searchkind==4)
            {
              that.alldeleted=response.data;
            }
            else
            {
              that.allfiles=response.data;
              //alert(that.allfiles)
            }
            
          })
          .catch(function(error) {
            alert(error);
          });
    },
    searchTeamfile() {
      var that = this;
        axios
          .post("http://175.24.53.216:8080/get_team_doc", {
            id: that.teamid,
          })
          .then(function(response) {
              that.allfiles=response.data;
          })
          .catch(function(error) {
            alert(error);
          });
    },
  }
};
</script>
<style scoped>
.each {
  width: 30%;
  border: 1px solid black;
  margin: 5px;
  cursor: pointer;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.box { 
    border: 1px solid #DCDFE6;
    padding: 10px 35px 15px 35px;
    float:left;
    margin: 5px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 5px #909399;
    opacity: 1;
    width:20%
  }
  .art-more {
		height: 40px;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
	}
  .art-more .view {
		color: #aaa;
	}
	h5{
		font-size: 18px;
	}
	.pagination {
		background-color: #F9F9F9;
  }
  .name{
    margin-top:10px ;
    margin-left: 5px;
  }
  .art-time {
		margin-right: 20px;
  }
  .art-title {
		border-left: 3px solid #409EFF;
		padding-left: 5px;
		cursor: pointer;
	}
	
	.art-title:hover {
		padding-left: 10px;
		color: #409EFF;
	}
  .name{
    margin-top:10px ;
    margin-left: 5px;
    cursor: pointer;
  }
  .name:hover{
    padding-left: 10px;
		color: #409EFF;
  }
  
</style>

<style>
.modal-backdrop { 
    position: fixed; 
    top: 0; 
    right: 0; 
    bottom: 0; 
    left: 0; 
    background-color: rgba(0,0,0,.3); 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    overflow:auto;
}
.modal { 
    background-color: #fff; 
    box-shadow: 2px 2px 20px 1px; 
    overflow:auto;
    display: flex; 
    flex-direction: column;
    border-radius: 16px;
    width: 700px;
} 
.modal-header { 
    border-bottom: 1px solid #eee; 
    color: #313131; 
    justify-content: space-between;
    padding: 15px; 
    display: flex; 
} 
.modal-footer { 
    border-top: 1px solid #eee; 
    padding: 15px; 
} 
.modal-body { 
    position: relative; 
    padding: 20px 10px; 
}
.btn-close, .btn-confirm {    
    border-radius: 8px;
    margin-left:16px;
    width:56px;
    height: 36px;
    border:none;
    cursor: pointer;
}
.btn-close {
    color: #313131;
    background-color:transparent;
}
.btn-confirm {
    color: #fff; 
    background-color: #2d8cf0;
}
.btn-request {
    color: #fff; 
    border-radius: 8px;
    margin-left:16px;
    height: 36px;
    border:none;
    cursor: pointer;
    width:70;
    background-color: #2d8cf0;
}
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