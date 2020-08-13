<template>
<div>
	<Navigator return="viewdoc" />
	<div class="blank" style="height:20px"></div>
	<div><el-row class="head">

		<el-col :span="1">
		<el-button class="button" @click="tohome()" icon="el-icon-s-home"></el-button></el-col>

		<el-col :span="7" class="docTitle">
		<!--<el-input style="align: middle">未命名</el-input>-->
		<div v-if="writeflag==1" class="title">
		<div v-if="titleflag==0" @click="titleflag=1" class="title">
			{{title}}
		</div>
		<el-input
			v-model="title"
			v-if="titleflag==1"
		></el-input>
		</div>

		<div v-if="writeflag==0">
		<div>
			{{title}}
		</div>
		</div></el-col>
		<el-col :span="4" class="docTitleBlank" style="border:1px solid white"></el-col>
		<el-col :span="8" style="float:right;">
		<el-button class="button buttonRight" @click="changewrite()" icon="el-icon-edit"></el-button>
		<el-button class="button buttonRight" icon="el-icon-star-on"></el-button>
		<el-button class="button buttonRight" icon="el-icon-star-off"></el-button>
		<el-button class="button buttonRight" icon="el-icon-share"></el-button>
		<el-button class="button buttonRight" @click="recycle()" icon="el-icon-delete"></el-button>
		<el-button class="button buttonRight" @click="save()" icon="el-icon-s-claim"></el-button>
		</el-col></el-row>

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
export default {
	name:'ViewDoc',
	props:[],
	components:{Navigator},
	data(){
	  return {
		docid:0,
		teamid:0,
		email:"临时邮箱",
		writeflag:0,
		titleflag:0,
		title:"未命名",
		mdStr:""
	  }

		
	},
	created(){
		this.writeflag = this.$route.params.kind;
		this.docid = this.$route.params.docid;
		this.email = global.userEmail;
		this.getdoc();
	},
	methods:{
		getdoc(){
			var that = this;
			axios
			.post("http://175.24.53.216:8080/get_doc", {
			id:Number(that.docid),
			email: that.email,
			})
			.then(function(response) {
			  that.title=response.data.title
			  that.mdStr=response.data.content
			})
			.catch(function(error) {
			alert(error);
			});
		},
		changewrite(){
			this.writeflag=1
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
			alert(response.data.msg);
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
		  doc_id:that.docid,
          team_id: that.teamid,
          content: that.mdStr,
          title: that.title,
          email: that.email,
        })
        .then(function(response) {
          that.$message(response.data.msg);
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
		  doc_id:that.docid,
          team_id: that.teamid,
          content: that.mdStr,
          title: that.title,
          email: that.email,
        })
        .then(function(response) {
          alert(response.data.msg);
        })
        .catch(function(error) {
          alert(error);
        });
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

	 text-align:center;
 }
 .title{
	 text-align:center;
 }
 el-row {
 	align:middle;
 }
 .head{
 	height:70px;
 	magin-top:200px;
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
</style>