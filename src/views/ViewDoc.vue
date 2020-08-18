<template>
<div>
	<Navigator return="viewdoc" />
	<Share :dialogFormVisible="showShare" :isCreater="isWriter" 
	:radio="share_permission" :title="title" :doc_id="docid" :input="this.$route.path"
	@ShareConfirm="ShareConfirm" @ShareCancel="ShareCancel"/>
	<div><el-row class="head">

		<el-col :span="1">
		<el-button class="button" type="primary" @click="tohomebutton()" icon="el-icon-s-home" circle></el-button></el-col>

		<el-col :span="7" class="docTitle">
		<!--<el-input style="align: middle">未命名</el-input>-->
		<div v-if="writeflag==1" class="title">
		<div v-if="titleflag==0" @click="titleflag=1" class="normalTitle">
			{{title}}
		</div>
		<el-input
			v-model="title"
			v-if="titleflag==1"
		></el-input>
		</div>

		<div v-if="writeflag==0" class="normalTitle">
		<div>
			{{title}}
		</div>
		</div></el-col>
		<el-col :span="4" class="docTitleBlank" style="border:1px solid white"></el-col>
		<el-col :span="8" style="float:right;">
		<el-button class="button buttonRight" type="info" @click="toHistory(docid)" icon="el-icon-s-order" circle :disabled="writeflag==1"></el-button>
		<el-button class="button buttonRight" type="primary" @click="changewrite()" icon="el-icon-edit" circle :disabled="writeflag==1||!canW||(isEdit&&!selfEdit)"></el-button>
		<el-button class="button buttonRight" type="warning" icon="el-icon-star-on" v-if="likeflag==true" @click="dislike()" :disabled="writeflag==1" circle></el-button>
		<el-button class="button buttonRight" icon="el-icon-star-off" v-if="likeflag==false" @click="addlike()" :disabled="writeflag==1" circle></el-button>
		<el-button class="button buttonRight" type="info" icon="el-icon-chat-line-square" @click="drawer = true,getallcomment()" circle :disabled="writeflag==1"></el-button>
		<el-button class="button buttonRight" type="warning" icon="el-icon-share" @click="showShare=true" :disabled="writeflag==1" circle></el-button>
		<el-button class="button buttonRight" type="danger" @click="recycle()" icon="el-icon-delete" :disabled="!isWriter" circle></el-button>
		<el-button class="button buttonRight" type="success" @click="save()" icon="el-icon-finished" circle :disabled="writeflag==0"></el-button>
		</el-col></el-row>


<History :HistoryVisible="HistoryVisible" :doc_id="dochistory" @closeHistory="closeHistory()"/>
<!-- 评论页面 -->
<el-drawer
  title="评论"
  :visible.sync="drawer"
  :direction="direction">
  <div v-for="item in commentlist" :key="item.id" style="margin-top: 15px;">
  	<el-divider content-position="left"><span style="font-weight:bold;" @click="openinfo(item.comment_user_email)">{{item.comment_user}}</span></el-divider>
    <p style="text-indent:2em;padding:0px 10px 0px 10px;"><span>{{item.content}}</span></p>
    <div style="text-align:right;margin-right:20px;"><i class="el-icon-time"></i>
	<span style="color:gray;">{{item.comment_time}}</span></div>  
	  
	  

  </div><el-divider></el-divider>
  <div style="margin:15px 30px 0px 30px;">
  <el-input placeholder="请输入评论" v-model="comment">
    <el-button slot="append" icon="el-icon-s-promotion" @click="addcomment()"></el-button>
  </el-input>
</div>
</el-drawer>

<Info :infoVisible="infoVisible" :userinfo="userinfo" @closeInfo="closeInfo()"/>

	<div id="md" v-if="writeflag==1">
	      <mavon-editor class="editor" ref=md @imgAdd="$imgAdd" v-model="mdStr" @save="$save"></mavon-editor>
	</div>

	<div id="md2" v-if="writeflag==0">
	<mavon-editor  
	class="md"  
	:value="mdStr"   
	:subfield = "false"  
	:defaultOpen = "'preview'"   
	:toolbarsFlag = "false"  
	:editable="false"   
	:scrollStyle="true"  
	:ishljs = "true"></mavon-editor>
	</div></div>
</div>
</template>

<script>
import axios from "axios";
import global from "@/components/global.vue";
import Navigator from "@/components/Navigator.vue";
import jwt_decode from 'jwt-decode';
import Share from '@/components/Share.vue';
import Info from '@/components/Info.vue';
import History from '@/components/History.vue';
export default {
	name:'ViewDoc',
	props:[],
	components:{Navigator,
				Share,
				Info,
				History},
	data(){
	  return {
		comment:"",
		likeflag:false,
		docid:0,
		teamid:0,
		email:"临时邮箱",
		writeflag:0,
		titleflag:0,
		title:"未命名",
		mdStr:"",
		drawer: false,
		direction: 'rtl',
		commentlist: {},
		dochistory:0,
		HistoryVisible:false,
		userinfo:{},
		infoVisible:false,
		showShare:false,
		isWriter:false,
		canR:false,
		canW:false,
		canC:false,
		create_user:0,
		create_time:"",
		modify_user:0,
		modify_time:"",
		share_permission:0,
		isEdit:false,
		selfEdit:false

	  }
		
	},
	mounted(){
	  if(localStorage.getItem('token')!=null){
      const decoded = jwt_decode(localStorage.getItem('token'));
      console.log(decoded);
      global.loginflag=true;
      global.userName=decoded.name;
      global.userEmail=decoded.email;
      global.avatar=decoded.avatar;
      global.userid=decoded.id;
	}
	
		this.writeflag = this.$route.query.kind;
		this.docid = this.$route.query.docid;
		this.email = global.userEmail;
		this.getdoc();
		this.check_edit();
		this.get_self_permission();
		this.getlike();
		if(this.writeflag==1)
		{
			this.changewrite();
			this.check_edit();
		}
	},
	methods:{
		tohomebutton()
		{
			if(this.selfEdit||this.writeflag==1)
			{
				this.$alert('确定放弃未保存内容？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
						type: 'warning'
						}).then(() => {
							this.tohome()
						}).catch(() => {
						});
			}
			else
			{
				this.tohome()
			}
			
		},
		closeHistory(){      this.HistoryVisible = false    },
    toHistory(a){      this.HistoryVisible = true,    this.dochistory=a},
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
		getallcomment(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/get_comment", {
			id:Number(that.docid),
			})
			.then(function(response) {
			   that.commentlist=response.data
			})
			.catch(function(error) {
			alert(error);
			});
		},
		addcomment(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/comment", {
			id:Number(that.docid),
			email: that.email,
			content:that.comment
			})
			.then(function(response) {
				console.log(response.data.msg)
				that.$message({
					type: 'success',
					message: '评论成功!'
				});
			  that.comment=""
			  that.getallcomment()
			})
			.catch(function(error) {
			alert(error);
			});
		},
		addlike(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/like_doc", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
				console.log(response.data.msg)
				that.$message({
					type: 'success',
					message: '关注成功!'
				});
			  that.likeflag=true
			})
			.catch(function(error) {
			alert(error);
			});
		},
		dislike(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/dislike_doc", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
			  console.log(response.data.msg)
				that.$message({
					type: 'success',
					message: '已取消关注!'
				});
			  that.likeflag=false
			})
			.catch(function(error) {
			alert(error);
			});
		},
		getlike(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/check_favorite_doc", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
			  if(response.data.flag==1)
			  {
				that.likeflag=true
			  }
			})
			.catch(function(error) {
			alert(error);
			});
		},
		getdoc(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/get_doc", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
				if(response.data.code!=200){
					that.$alert('权限不足,即将返回首页', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    center: true
                  }).then(() => {
                    that.$router.push({ path: "/Home" });
                  })
				}
			  that.canR=true;
			  that.title=response.data.title;
			  that.mdStr=response.data.content;
			  that.create_user=response.data.create_user;
			  that.create_time=response.data.create_time;
			  that.modify_user=response.data.modify_user;
			  that.modify_time=response.data.modify_time;
			  if(response.teamid!=null){
				  that.teamid=response.data.team_id;
			  }
			  else{
				  that.teamid=0;
			  }
			  console.log(response.data.permission);
			  that.share_permission=response.data.permission;
			
			  if(that.create_user==global.userid){
				  that.isWriter=true;
			  }
			})
			.catch(function(error) {
			alert(error);
			});
		},
		check_edit(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/check_edit", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
				if(response.data.flag==2){
					that.isEdit=true;
					that.selfEdit=true;
					that.$notify({
                      title: '提示',
                      message: '正在编辑文件，请及时保存',
					  position: 'top-left',
					  duration: 0
                    });
				}
				else if(response.data.flag==1){
					that.isEdit=true;
					that.selfEdit=false;
					that.$notify({
                      title: '警告',
                      message: response.data.edit_user+'正在编辑文件，无法编辑',
					  position: 'top-left',
					  duration: 0,
					  type: 'warning'
                    });
				}
			})
			.catch(function(error) {
			alert(error);
			});
		},
		get_self_permission(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/get_self_permission", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
				if(response.data.code!=200){
					that.$message.error('获取权限失败');
				}
				else{
					console.log("self permission:"+response.data.permission);
					if((response.data.permission&0x02)!=0){
						that.canW=true;
					}
					else{
						that.canW=false;
					}
					if((response.data.permission&0x04)!=0){
						that.canC=true;
					}
					else{
						that.canC=false;
					}
					console.log("can Write:"+that.canW);
					console.log("can Comment:"+that.canC);
					if(that.writeflag==1&&!that.canW){
					    that.$alert('权限不足,即将返回首页', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        center: true
                      }).then(() => {
                        that.$router.push({ path: "/Home" });
                      })
				    }
					if(that.writeflag==1&&that.isEdit&&!that.selfEdit){
					that.$alert('正在被编辑,即将进行浏览', {
                    	confirmButtonText: '确定',
                    	type: 'warning',
                    	center: true
                  	}).then(() => {
                    	that.$router.push({
                			name: "Viewdoc",
                			query: { kind: 0,docid: that.docid }
            			});
                  	})
					}
				}
			})
			.catch(function(error) {
			alert(error);
			});
		},
		changewrite(){
			this.writeflag=1;
			var that=this;
			axios
			.post("http://175.24.53.216:8080/edit_doc", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
			console.log(response.data.msg);
			that.$message({
					type: 'success',
					message: '正在编辑文档'
				});
			})
			.catch(function(error) {
			alert(error);
			});
		},
		tohome(){
			this.$router.push({ path: "/home" });
		},
		recycle(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/recycle", {
			id:that.docid,
			email: that.email,
			})
			.then(function(response) {
			console.log(response.data.msg);
			that.$message({
					type: 'danger',
					message: '已删除文档!'
				});
			that.tohome();
			})
			.catch(function(error) {
			alert(error);
			});
		},
        $imgAdd(pos, $file){
          var that=this;
           var formdata = new FormData();
           formdata.append('userid',that.userid);
           formdata.append('file', $file);
           axios
          .post("http://175.24.53.216:8080/upload", formdata)
          .then(function(response) {
            that.$refs.md.$img2Url(pos,response.data.url);
          })
          .catch(function(error) {
            alert(error);
          });
      },
      $save(){
        if(this.title.length==0){
        this.$message("请填写标题");
        return;
      }
        var that = this;
        axios
        .post("http://175.24.53.216:8080/modify_doc", {
		  doc_id:Number(that.docid),
          team_id: that.teamid,
          content: that.mdStr,
          title: that.title,
          email: that.email,
        })
        .then(function(response) {
		  console.log(response.data.msg);
			that.$message({
					type: 'success',
					message: '修改已保存!'
				});
		  that.writeflag=0;
		  that.getdoc();
		that.check_edit();
		that.get_self_permission();
		that.getlike();
		if(that.writeflag==1)
		{
			that.changewrite();
			that.check_edit();
		}
        })
        .catch(function(error) {
          alert(error);
        });
	  },
	  save(){
        if(this.title.length==0){
        alert("请填写标题");
        return;
      }
        var that = this;
        axios
        .post("http://175.24.53.216:8080/modify_doc", {
		  doc_id:Number(that.docid),
          team_id: that.teamid,
          content: that.mdStr,
          title: that.title,
          email: that.email,
        })
        .then(function(response) {
		  console.log(response.data.msg);
			that.$message({
					type: 'success',
					message: '修改已保存!'
				});
		  that.writeflag=0
		  that.getdoc();
		that.check_edit();
		that.get_self_permission();
		that.getlike();
		if(that.writeflag==1)
		{
			that.changewrite();
			that.check_edit();
		}
        })
        .catch(function(error) {
          alert(error);
        });
	  },
	  ShareConfirm(val){
		this.showShare=false;
		this.share_permission=val;
	  },
	  ShareCancel(){
		  this.showShare=false;
		  console.log(this.showShare);
	  }
  }
}
</script>

<style scoped>
 .docTitleBlank{
    border:1px solid white;
    font-size:200%;
 }
 .button {
	 margin: 5px;
 }
 .docTitle{
	 margin: 5px;
	 margin-left: 20px;
 }
 .title{
 }
 .head{
 	height:70px;
 	margin-top:20px;
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
  .normalTitle{
	  margin-left:5px;
	  margin-top:10px;
  }
</style>
