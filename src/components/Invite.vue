<template>
    <el-dialog
   title="邀请成员"
   :visible.sync="inviteVisible"
   width="40%"
   show-close="false"
   :before-close="handleClose">
         <el-form ref="searchUser_form" :model="searchUser_form" :rules="rules" >
                     <el-form-item prop="user_name">  
                       <el-input
                       placeholder="用户名或邮箱"
                       v-model="searchUser_form.user_name"
                       class="input-with-select"
                       >
                       <el-button slot="append" icon="el-icon-search" @click="submitSearchForm('searchUser_form')"></el-button>
                       </el-input>
                     </el-form-item>
         </el-form>

       <template>
         <el-table
           :data="searchUsers"
           stripe="true"
           style="width: 100%">
           <el-table-column
             prop="name"
             label="用户名"
             width="160">
           </el-table-column>
           <el-table-column
             prop="email"
             label="邮箱地址"
             width="230">
           </el-table-column>
           <el-table-column label="操作" width="140">
             <template slot-scope="anapply">
               <el-button
                 size="mini"
                 type="primary"
                 @click="invite(anapply.row.id)"
                 >发送邀请</el-button>
             </template>
           </el-table-column>
         </el-table>
       </template>

 </el-dialog>
</template>

<script>
import global from "@/components/global.vue";
import axios from "axios";
export default {
    name: 'Invite',
    data(){
      return{
        leader:{},
        allMembers:{},
        searchUser_form:{},
        searchUsers:{},
        rules:{
            team_name:[
            { required: true, message: '请输入用户名称或邮箱', trigger: 'blur' },
            ],
        },
      };
    },
    mounted(){
        this.$nextTick(()=>{
            this.email=global.userEmail
            this.uid=global.userid
   })
        
    },
    props: {
      inviteVisible:{
        type:Boolean,
        default:false
      },
      team_id: {
        type: Number,
        default:0
      },
    },
    methods: {
      invite(target){
            var that = this;
        axios
            .post("http://175.24.53.216:8080/invite", {
            team_id: that.team_id,
            email: that.email,
            target:target,
        })
        .then(function(response) {
          console.log(response.data.msg);
          if(response.data.code==200){
            that.$message({
              message: '邀请发送成功',
              type: 'success'
            });
          }
          else if(response.data.code==402){
            that.$message({
              message: '用户已在队伍中',
            });
          }
        })
        .catch(function(error) {
          alert(error);
        });
      },
      submitSearchForm(formName) {
        this.$refs[formName].validate((valid) => {
        if (valid) {
        var that = this;
        axios
        // here
        .post("http://175.24.53.216:8080/searchUser", that.searchUser_form)//175.24.53.216:8080 127.0.0.1:8080
        .then(function(response) {
          that.searchUsers=response.data;
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
      handleClose(done) {
        this.leader={},
        this.allMembers={},
        this.searchUser_form={},
        this.searchUsers={},
        this.$emit('InviteClose');
        done()
      },
  
    }
}
</script>