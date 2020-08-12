<template>
<div>
	<Navigator return="viewdoc" />
	<div>
		<el-container direction="horizontal">
		<i class="el-icon-s-home" @click="tohome()"></i>

		<div v-if="writeflag==1">
		<div v-if="titleflag==0" @click="titleflag=1">
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
		</div>

		<i class="el-icon-edit" @click="changewrite()"></i>
		<i class="el-icon-star-on"></i>
		<i class="el-icon-star-off"></i>
		<i class="el-icon-share"></i>
		<i class="el-icon-delete" @click="recycle()"></i>
		<i class="el-icon-s-claim" @click="save()"></i>
		</el-container>
	</div>

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
	</div>
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

