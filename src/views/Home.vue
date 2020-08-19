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
      
      <el-menu-item index="2" @click="tomessage()">
        <i class="el-icon-message"></i>
        <el-badge :value="this.messagenum" class="item" :hidden="this.messagenum==0">收件箱</el-badge>
      </el-menu-item>

      <el-menu-item index="3" @click="torecycle()">
        <i class="el-icon-delete"></i>
        <span slot="title" >回收站</span>
      </el-menu-item>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>团队空间</span>
        </template>
        <el-menu-item-group>
          <el-menu-item @click="createteamVisible=true">
            <template slot="title" >
              <i class="el-icon-plus"></i>
              <span slot="title" >新建团队</span>
            </template>
          </el-menu-item>
          <el-menu-item @click="jointeamVisible=true">
            <i class="el-icon-zoom-in"></i>
            <span slot="title" >加入团队</span>
          </el-menu-item>
          <el-menu-item  v-for="item in allteams" :key="item.id">
            <i v-if="item.create_user_id==userid" class="el-icon-setting"  @click="openList(item.id,item.create_user_id)"></i>
            <i v-if="item.create_user_id!=userid" class="el-icon-s-tools" ></i>
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
            <!-- <div class="files" v-for="item in allfiles" :key="item.id" >
              <div class="box">
                <div @click="tothisdoc(item.doc_id)">{{item.title}}</div>
                创建时间:{{item.create_time}}
                <div @click="openinfo(item.modify_user_email)">上次修改人:{{item.modify_user}}</div>
                上次修改时间:{{item.modify_time}}
                <div @click="openinfo(item.create_user_email)">创建人:{{item.create_user}}</div>
              </div>
            </div> -->

<div class="files" v-for="item in allfiles" :key="item.id" >
                <TeamPermission :TPVisible="TPVisible" :doc_id="item.doc_id"  :team_id="teamid" @closeTeamPermission="closeTeamPermission" />
                <el-popover
                  placement="right-start"
                  title="属性"
                  width="200"
                  trigger="hover"
                  open-delay="800">
                  <el-row style="font-size:12px;text-align:left;">
                  <el-col :span="8"><span>文件名:</span></el-col>
                  <el-col :span="16"><div @click="tothisdoc(item.doc_id)" class="files-value">{{item.title}}</div></el-col>
                  <el-col :span="8"><div>创建人:</div></el-col>
                  <el-col :span="16"><span class="files-value" @click="openinfo(item.create_user_email)">{{item.create_user}}</span></el-col>
                  <el-col :span="8"><span>创建时间:</span></el-col>
                  <el-col :span="16">{{item.create_time}}</el-col>
                  <el-col :span="8"><div>上次修改者:</div></el-col>
                  <el-col :span="16"><span @click="openinfo(item.modify_user_email)" class="files-value">{{item.modify_user}}</span></el-col>
                  <el-col :span="8"><span>修改时间:</span></el-col>
                  <el-col :span="16"><span>{{item.modify_time}}</span></el-col></el-row>
                  <el-row style="text-align:center;">
                  <el-col :span="6"><el-button size="mini" type="text" @click="recycle(item.doc_id)" :disabled="item.create_user_id!=userid">删除</el-button></el-col>
                  <el-col :span="9"><el-button type="text" size="mini" @click="toHistory(item.doc_id)">修改记录</el-button></el-col>
                  <el-col :span="9"><el-button type="text" size="mini" @click="TPVisible=true" :disabled="!(teamid!=0&&pageflag==1)">权限管理</el-button></el-col></el-row>

                  <el-button clas="files" @click="tothisdoc(item.doc_id)" slot="reference" style=" box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 10px"><i style="font-size: 150px;font-weight:lighter;color:gray;" class="el-icon-document"></i><p></p>{{item.title| ellipsis}}</el-button>
                  
                </el-popover>
           </div>





<!-- 信息弹窗 -->
       <Info :infoVisible="infoVisible" :userinfo="userinfo" @closeInfo="closeInfo()"/>
</div>

<History :HistoryVisible="HistoryVisible" :doc_id="dochistory" @closeHistory="closeHistory()"/>
<!-- 模版界面 -->

        <el-dialog
          title="提示"
          :visible.sync="modelVisible"
          width="30%">
          <el-carousel :interval="6000" type="card" height="130px">
            <el-carousel-item v-for="item in allforms" :key="item.id" @click.native="changemodelid(item.id)">
              <div style="text-align:center;">
                <template-icon :iconKind="item.id" />
                <span>{{item.title}}<i class="el-icon-circle-check" v-if="modelid-item.id==0" style="color:green;"></i></span>
              </div>
            </el-carousel-item>
          </el-carousel>

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
            <span v-if="messagecontent.type==3"> {{messagecontent.sender_name}}修改了团队"{{messagecontent.team_name}}"中的文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==4"> {{messagecontent.sender_name}}修改了你的个人文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==5"> {{messagecontent.sender_name}}评论了团队"{{messagecontent.team_name}}"中的文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==6"> {{messagecontent.sender_name}}评论了你的个人文档《{{messagecontent.doc_name}}》</span>
            <span v-if="messagecontent.type==7"> {{messagecontent.sender_name}}将你移出了团队"{{messagecontent.team_name}}"</span>
            <span v-if="messagecontent.type==8"> {{messagecontent.sender_name}}接受了加入团队"{{messagecontent.team_name}}"的邀请</span>
            <span v-if="messagecontent.type==9"> {{messagecontent.sender_name}}同意了你加入团队"{{messagecontent.team_name}}"的申请</span>



            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="agree(messagecontent.type,messagecontent.sender_id,messagecontent.team_id)" v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==0)">同 意</el-button>
              <el-button @click="disagree()" v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==0)">拒 绝</el-button>
              <el-button disabled disable v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==1)">已同意</el-button>
              <el-button disabled disable v-if="((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==2)">已拒绝</el-button>
              <el-button type="primary" @click="messageVisible = false,getallmessage()" v-if="!((messagecontent.type==0||messagecontent.type==1)&&messagecontent.status==0)">确 定</el-button>
            </span>
          </el-dialog>


        
      </div>
      <!-- 回收站页面 -->
      <div v-if="pageflag==3">
        
<div class="files" v-for="item in alldeleted" :key="item.id" >
                <el-popover
                  placement="right-start"
                  title="属性"
                  width="200"
                  trigger="hover"
                  open-delay="800">
                  <el-row style="font-size:12px;text-align:left;">
                  <el-col :span="8"><span>文件名:</span></el-col>
                  <el-col :span="16"><div @click="bedeleted(item.doc_id)" class="files-value">{{item.title}}</div></el-col>
                  <el-col :span="8"><div>创建人:</div></el-col>
                  <el-col :span="16"><span class="files-value" @click="openinfo(item.create_user_email)">{{item.create_user}}</span></el-col>
                  <el-col :span="8"><span>创建时间:</span></el-col>
                  <el-col :span="16">{{item.create_time}}</el-col>
                  <el-col :span="8"><div>上次修改者:</div></el-col>
                  <el-col :span="16"><span @click="openinfo(item.modify_user_email)" class="files-value">{{item.modify_user}}</span></el-col>
                  <el-col :span="8"><span>修改时间:</span></el-col>
                  <el-col :span="16"><span>{{item.modify_time}}</span></el-col></el-row>
                  <el-row style="text-align:center;">
                  <el-col :span="6"><el-button size="mini" type="text" @click="opendelete(item.doc_id)">删除</el-button></el-col>
                  <!-- <el-col :span="9"><el-button type="text" size="mini" @click="toHistory(item.doc_id)">修改记录</el-button></el-col> -->
                  <el-col :span="6"><el-button type="text" size="mini" @click="openremove(item.doc_id)">恢复</el-button></el-col></el-row>

                  <el-button clas="files" @click="bedeleted(item.doc_id)" slot="reference" style=" box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);border-radius: 10px"><i style="font-size: 150px;font-weight:lighter;color:gray;" class="el-icon-document"></i><p></p>{{item.title| ellipsis}}</el-button>
                  
                </el-popover>
           </div>






       <!-- <el-row>
            <div class="deletefiles" v-for="item in alldeleted" :key="item.id">
            <div class="box" @click="openremove(item.doc_id)">
              {{item.title}}
                创建时间:{{item.create_time}}
                上次修改人:{{item.modify_user}}
                上次修改时间:{{item.modify_time}}
                创建人:{{item.create_user}}
            </div>
           </div>
        </el-row> -->


      </div>
    </el-col>
    </el-row>



    
<!-- 
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
    </div> -->

<el-dialog
   title="创建团队"
   :visible.sync="createteamVisible"
   width="40%"
   :before-close="handleClose">

             <el-form ref="createTeam_form" :model="createTeam_form" :rules="rules" label-width="80px" >
               <el-form-item label="团队名称" prop="team_name">  
                 <el-input
                 placeholder="请输入团队名称"
                 v-model="createTeam_form.team_name"
                 ></el-input>
               </el-form-item>
             </el-form>
   <span slot="footer" class="dialog-footer">
     <el-button @click="createteamVisible = false,createTeam_form.team_name=''">取 消</el-button>
     <el-button type="primary" @click="submitCreateForm('createTeam_form'),createteamVisible = false">确 定</el-button>
   </span>
 </el-dialog>


 <el-dialog
   title="搜索团队"
   :visible.sync="jointeamVisible"
   width="40%"
   :before-close="handleClose">
         <el-form ref="searchTeam_form" :model="searchTeam_form" :rules="rules" >
                     <el-form-item prop="team_name">  
                       <el-input
                       placeholder="team name"
                       v-model="searchTeam_form.team_name"
                       class="input-with-select"
                       >
                       <el-button slot="append" icon="el-icon-search" @click="submitSearchForm('searchTeam_form')"></el-button>
                       </el-input>
                     </el-form-item>
         </el-form>

       <template>
         <el-table
           :data="searchteams"
           stripe="true"
           style="width: 100%">
           <el-table-column
             prop="team_name"
             label="团队名"
             width="140">
           </el-table-column>
           <el-table-column
             prop="id"
             label="团队id"
             width="100">
           </el-table-column>
           <el-table-column
             prop="create_user_name"
             label="创建人"
             width="140">
           </el-table-column>
           <el-table-column label="操作" width="140">
             <template slot-scope="anapply">
               <el-button
                 size="mini"
                 @click="applyjoin(anapply.row.id)"
                 >申请加入</el-button>
             </template>
           </el-table-column>
         </el-table>
       </template>

 </el-dialog>
    <TeamManagement :listVisible="listVisible" :team_id="teamid" :create_user="create_user" v-on:TeamManagementCancel="TeamManagementCancel"></TeamManagement>
  </div>
</template>


<script>
// @ is an alias to /src
import Navigator from "@/components/Navigator.vue";
import global from "@/components/global.vue";
import axios from "axios";
import jwt_decode from 'jwt-decode';
import TeamManagement from "@/components/TeamManagement.vue";
import TemplateIcon from "@/components/TemplateIcon.vue"
import TeamPermission from "@/components/TeamPermission.vue"
import Info from "@/components/Info.vue"
import History from "@/components/History.vue"
import Encrypt from "@/components/Encrypt.js"
export default {
  name: "Home",
  components: {
    Navigator,
    TeamManagement,
    TemplateIcon,
    Info,
    History,
    TeamPermission
  },
  data() {
    return {
      tableData: {},
      createteamVisible:false,
      jointeamVisible:false,
      listVisible:false,
      modelVisible:false,
      messageVisible:false,
      messagecontent:{},
      modelid:0,
      teamid:0,
      messagenum:0,
      userid:0,
      create_user:0,
      dochistory:0,
      HistoryVisible:false,
      recycleflag:false,
      infoVisible:false,
      TPVisible:false,
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
    if(localStorage.getItem('token')){
      const decoded = jwt_decode(localStorage.getItem('token'));
      console.log(decoded);
      global.loginflag=true;
      global.userName=decoded.name;
      global.userEmail=decoded.email;
      global.avatar=decoded.avatar;
      global.userid=decoded.id;
    }
    this.userid=global.userid
    this.email=global.userEmail
    this.modelid=0
    if(global.userid==0){
      this.$router.push({ path: "/login" });
    }
    else{
      this.search()
      this.myteam()
      this.getallmessage()
    }
  },
  filters: {
    // 当标题字数超出时，超出部分显示’...‘。此处限制超出8位即触发隐藏效果
    ellipsis (value) {
        if (!value) return ''
        if (value.length > 8) {
            return value.slice(0, 8) + '...'
        }
        return value
    }
  },
  methods: {
    recycle(docid){
			this.$confirm('此操作将删除该文档, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
			var that = this;
			axios
			.post("http://175.24.53.216:8080/recycle", {
			id:docid,
			email: that.email,
			})
			.then(function(response) {
			console.log(response.data.msg);
			that.$message({
					type: 'success',
					message: '删除成功!'
				});
			that.changesearchkind(1);
			})
			.catch(function(error) {
			alert(error);
			});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
			
		},
    bedeleted(docid)
    {
      this.$confirm('该文档已被删除, 请先恢复', '提示', {
          confirmButtonText: '恢复',
          cancelButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.openremove(docid)
          
        }).catch(() => {
      
        });
        this.changesearchkind(4)
    },
    opendelete(docid){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
                var that = this;
                        axios
                        // here
                          .post("http://175.24.53.216:8080/delete", {//127.0.0.1:8080
                          id:docid,
                          email:that.email
                          })
                          .then(function(response) {
                            if(response.data.code==200)
                            {
                              that.$message({
                                type: 'success',
                                message: '删除成功!'
                              });
                            }

                            else 
                            {
                              that.$message({
                              type: 'warning',
                              message: '删除失败!'
                            });
                            }
                            that.changesearchkind(4)
                          })
                          .catch(function(error) {
                            alert(error);
                          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    TeamManagementCancel(){
      this.listVisible=false
      this.myteam()
    },
    closeTeamPermission(){
      this.TPVisible=false;
    },
    closeHistory(){      this.HistoryVisible = false    },
    toHistory(a){      this.HistoryVisible = true,    this.dochistory=a},
     applyjoin(id){
         var that = this;
         axios
         // here
           .post("http://175.24.53.216:8080/apply", {//127.0.0.1:8080
           team_id:id,
           email:that.email
           })
           .then(function(response) {
             console.log(response.data);
             if(response.data.code==200)
             {
               that.$message({
               type: 'success',
               message: '申请成功!'
             });
             }
             else if(response.data.code==402)
             {
               that.$message({
               type: 'warning',
               message: '你已在队伍中!'
             });
             }
             
           })
           .catch(function(error) {
             alert(error);
           });
     },
     handleClose(done) {
         this.searchteams="";
         this.searchTeam_form.team_name="";
         this.createTeam_form.team_name="";
         done();

       },
    openList(id,create_user)
    {
      this.teamid=id;
      this.create_user=create_user;
      this.listVisible = true;
    },
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
            that.$message({
                               type: 'success',
                               message: '已拒绝申请!'
                         })
           })
          .catch(function(error) {
            alert(error);
          });
    },
    agree(type,userid,teamid)
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
            if(type==1)
            {
              axios
                        .post("http://175.24.53.216:8080/jointeam", {//127.0.0.1:8080
                        team_id:teamid,
                        id:userid,
                        msg:0
                        })
                        .then(function(response) {
                          console.log(response.data);
                          that.messagecontent.status=1 
                                      if(response.data.code==200)
                                      {
                                        that.$message({
                                          type: 'success',
                                          message: '已同意申请!'
                                        })
                                      }
                                
                                    else if(response.data.code==402)
                                    {
                                      that.$message({
                                          type: 'warning',
                                          message: '对方已在队伍中!'
                                      })
                                    }
                        })
                        .catch(function(error) {
                          alert(error);
                        });
            }
              else if(type==2)
            {
              axios
                        .post("http://175.24.53.216:8080/jointeam", {//127.0.0.1:8080
                        team_id:teamid,
                        id:userid,
                        msg:userid
                        })
                        .then(function(response) {
                          console.log(response.data);
                          that.messagecontent.status=1 
                                      if(response.data.code==200)
                                      {
                                        that.$message({
                                          type: 'success',
                                          message: '已接收邀请!'
                                        })
                                      }
                                
                                    else if(response.data.code==402)
                                    {
                                      that.$message({
                                          type: 'warning',
                                          message: '你已在队伍中!'
                                      })
                                    }
                        })
                        .catch(function(error) {
                          alert(error);
                        });
            }
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
         var that=this
         axios
           .post("http://175.24.53.216:8080/delete_message", {//127.0.0.1:8080
             id: row.id,
           })
           .then(function(response) {
             console.log(response)
             that.$message({
               type: 'success',
               message: '删除成功!'
             });
             that.getallmessage()
           })
           .catch(function(error) {
             alert(error);
           });
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
            var tmp=0;
            for(var i=0;i<response.data.length;i++){
              if(response.data[i].status==0)
              {
                tmp++;
              }
            }
            that.messagenum=tmp
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
          if(that.userinfo.phone==null){that.userinfo.phone="暂无"} 
          if(that.userinfo.address==null){that.userinfo.address="暂无"}        
          if(that.userinfo.birthday==null){that.userinfo.birthday="暂无"}
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
    closeInfo(){      this.infoVisible = false    },
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
                query: { kind: Encrypt.encrypt(1),docid: Encrypt.encrypt(response.data.doc_id) }
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
                  console.log(response.data)
                  that.changesearchkind(4)
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
               query: { kind: Encrypt.encrypt(0),docid: Encrypt.encrypt(docid) }
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
          console.log(response.data)
         that.$message({
             type: 'success',
             message: '创建成功!'
         })
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
    createdoc()
    {
      var that = this;
          axios
          .post("http://175.24.53.216:8080/save_new_doc", {
            team_id: that.teamid,
            content: "",
            title: "未命名",
            email: that.email,
          })
          .then(function(response) {
            that.$router.push({
            name: "Viewdoc",
            query: { kind: Encrypt.encrypt(1),docid: Encrypt.encrypt(response.data.doc_id) }
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
            query: { kind: Encrypt.encrypt(1), docid: Encrypt.encrypt(response.data.doc_id) }
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
  .files {
    border: 0px solid #DCDFE6;
    padding: 10px 10px 15px 10px;
    float:left;
    margin: 10px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 0px #909399;
    opacity: 1;
    width:170px;
    height:200px;
    text-align: center;
  }
  .files-value:hover {
    text-decoration:underline;
    font-weight: bold;
    cursor: pointer;
  }
  .sidebar-name{
    color:black;
    font-size: 20px;
  }
  .prototype,.value{
    margin-bottom: 20px;
  }
  .prototype{
    text-align: center;
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