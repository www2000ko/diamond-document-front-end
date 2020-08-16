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
      
      <el-menu-item index="2" @click="tomessage()" :disabled="teamid!=0">
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
            <i :v-if="item.create_user==userid" class="el-icon-s-tools" @click="listVisible=true"></i>
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
            <el-row class="InfoDialog">
            <el-col class="sidebar-avatar"><el-avatar :src="userinfo.avatar" :size="100"></el-avatar></el-col>
            <el-col class="sidebar-name">{{userinfo.name}}</el-col>
            <el-col class="prototype" :span="6">邮箱</el-col>
            <el-tooltip class="email-detail" effect="dark" :content="userinfo.email" placement="top-start">
            <el-col class="value" :span="18">{{userinfo.email}}</el-col></el-tooltip>
            <el-col class="prototype" :span="6">性别</el-col>
            <el-col class="value" :span="18" v-if="userinfo.gender==1">男</el-col>
            <el-col class="value" :span="18" v-else>女</el-col>
            <el-col class="prototype" :span="6">联系电话</el-col>
            <el-col class="value" :span="18">{{userinfo.phone}}</el-col>
            <el-col class="prototype" :span="6">生日</el-col>
            <el-col class="value" :span="18">{{userinfo.birthday}}</el-col>
            <el-col class="prototype" :span="6">地址</el-col>
            <el-col class="value" :span="18">{{userinfo.address}}</el-col>
            </el-row>
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

        <template>
            <el-table
              :data="tableData"
              style="width: 100%"
              stripe
              :default-sort = "{prop: 'send_time', order: 'descending'}"
              >
              <el-table-column
                prop="sender_name"
                label="发件人"
                sortable
                width="100">
              </el-table-column>
              <el-table-column
                prop="send_time"
                label="时间"
                sortable
                width="240">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                sortable
                width="240">
                 <template slot-scope="scope">
                <el-tag
                  type="warning" v-if="scope.row.status==0">未读</el-tag>
                  <el-tag v-if="scope.row.status!=0">已读</el-tag>
                 </template>
              </el-table-column>
              <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleShow(scope.$index, scope.row)">查看</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
            </el-table>
          </template>
<!-- 查看信息 -->
          <el-dialog
            title="查看消息"
            :visible.sync="messageVisible"
            width="30%"
            :show-close="false"
            :close-on-click-modal="false"
            >
            <span>发件人：{{messagecontent.sender_name}}</span><br/>
            <span>发送时间：{{messagecontent.send_time}}</span><br/>
            <span v-if="messagecontent.type==0"> {{messagecontent.sender_name}}邀请你加入团队"{{messagecontent.team_name}}"</span>
            <span v-if="messagecontent.type==1"> {{messagecontent.sender_name}}申请加入你的团队"{{messagecontent.team_name}}"</span>
            <span v-if="messagecontent.type==2"> {{messagecontent.sender_name}}退出了你的团队"{{messagecontent.team_name}}"</span>
            <span v-if="messagecontent.type==3"> {{messagecontent.sender_name}}修改了你的团队"{{messagecontent.team_name}}"中的文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==4"> {{messagecontent.sender_name}}修改了你的个人文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==5"> {{messagecontent.sender_name}}评论了你的团队"{{messagecontent.team_name}}"中的文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==6"> {{messagecontent.sender_name}}评论了你的个人文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==7"> </span>



            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="agree()" v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==0)">同 意</el-button>
              <el-button @click="disagree()" v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==0)">拒 绝</el-button>
              <el-button disable v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==1)">已同意</el-button>
              <el-button disable v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==2)">已拒绝</el-button>
              <el-button type="primary" @click="messageVisible = false,closemessage" v-if="!((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==0)">确 定</el-button>
            </span>
          </el-dialog>


        
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
    <TeamManagement :listVisible="listVisible" :team_id="teamid" v-on:TeamManagementCancel="listVisible=false"></TeamManagement>
  </div>
</template>


<script>
// @ is an alias to /src
import Navigator from "@/components/Navigator.vue";
import global from "@/components/global.vue";
import axios from "axios";
import jwt_decode from 'jwt-decode';
import TeamManagement from "@/components/TeamManagement.vue";
export default {
  name: "Home",
  components: {
    Navigator,
    TeamManagement
  },
  data() {
    return {
      tableData: {},
      listVisible:false,
      modelVisible:false,
      messageVisible:false,
      messagecontent:{},
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
        "3":{"id":3,"title":"列表"},
        "4":{"id":4,"title":"公式"}
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
    if(this.$store.getters.getToken){
      const decoded = jwt_decode(this.$store.getters.getToken);
      console.log(decoded);
      global.loginflag=true;
      global.userName=decoded.name;
      global.userEmail=decoded.email;
      global.avatar=decoded.avatar;
      global.userid=decoded.id;
    }
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
    disagree()
    {
        var that = this;
        axios
        // here
          .post("http://175.24.53.216:8080/read_message", {//127.0.0.1:8080
          status:2,
          id:that.messagecontent.id
          })
          .then(function(response) {
            console.log(response.data);
            that.messagecontent.status=2
          })
          .catch(function(error) {
            alert(error);
          });
    },
    agree()
    {
        var that = this;
        axios
        // here
          .post("http://175.24.53.216:8080/read_message", {//127.0.0.1:8080
          status:1,
          id:that.messagecontent.id
          })
          .then(function(response) {
            console.log(response.data);
            that.messagecontent.status=1
          })
          .catch(function(error) {
            alert(error);
          });
    },
    readthismessage()
    {
        var that = this;
        axios
        // here
          .post("http://175.24.53.216:8080/read_message", {//127.0.0.1:8080
          status:1,
          id:that.messagecontent.id
          })
          .then(function(response) {
            console.log(response.data);
            that.messagecontent.status=1
            that.getallmessage()
          })
          .catch(function(error) {
            alert(error);
          });
    },
    handleShow(index, row) {
        this.messagecontent=row
        if(this.messagecontent.type!=0&&this.messagecontent.type!=1)
        {
          this.readthismessage()
        }
        this.messageVisible=true
      },
      handleDelete(index, row) {
        alert(index);
        alert(row);
        alert(row.sender_name);
      },
    getallmessage(){
      var that = this;
        axios
        // here
          .post("http://175.24.53.216:8080/get_message", {//127.0.0.1:8080
            token: localStorage.getItem('token'),
          })
          .then(function(response) {
            that.tableData=response.data;
          })
          .catch(function(error) {
            alert(error);
          });
    },
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
                query: { kind: 1,docid: response.data.doc_id }
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
        that.$message({
          type: 'success',
          message: '恢复成功!'
        });
        that.changesearchkind(4)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消恢复'
        });          
      });
    },
    tomessage()
    {
      this.pageflag=2;
      this.teamid=0;
      this.getallmessage()
    },
    tomyzone()
    {
      this.pageflag=1;
      this.teamid=0;
      this.changesearchkind(1)
    },
    torecycle()
    {
      this.pageflag=3;
      this.changesearchkind(4)
    },
    tothisdoc(docid)
    {
      this.$router.push({
               name:"Viewdoc",
               query: { kind: 0,docid: docid }
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
          .post("http://175.24.53.216:8080/save_new_doc", {
            team_id: Number(that.teamid),
            content: "",
            title: "未命名",
            email: that.email,
          })
          .then(function(response) {
            that.$router.push({
            name: "Viewdoc",
            query: { kind: 1,docid: response.data.doc_id }
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
            query: { kind: 1, docid: response.data.doc_id }
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
.boxName:hover,.boxAuthor:hover{
  font-size: 15px;
  font-weight: bold;
  text-decoration:underline;
  cursor:pointer;
  }
  .sidebar-avatar,.sidebar-name{
    text-align: center;
    margin-bottom: 20px;
  }
  .sidebar-name{
    color:black;
    font-size: 20px;
  }
  .prototype,.value{
    margin-bottom: 20px;
    /* &:last-child {
      margin-bottom: 0;
    } */
  }
  .value{
    color:black;
  }
  .template-item:hover{
    font-size: 15px;
    font-weight: bold;
    text-decoration:underline;
    cursor:pointer;
  }
  .template-item:visited{
    border:1px solid black;
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