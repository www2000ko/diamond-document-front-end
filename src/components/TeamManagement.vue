<template>
  <div>
    <el-dialog title="团队成员" :visible.sync="listVisible" width="30%" show-close="false" @open="open()"  :before-close="handleClose">

      
        <template>
          <el-table
            :data="leader"
            stripe
            style="width: 100%"
            :before-close="handleClose">>
            
              <el-table-column label="队长"  width="280">
               
              <template slot-scope="scope">
                <span>{{scope.row.create_user}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button 
                size="mini"
                type="primary"
                @click="inviteVisibletrue">邀请</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="allMembers"
            stripe
            style="width: 100%">
            
              <el-table-column label="队员列表"  width="280">
               
              <template slot-scope="scope">
                <span>{{scope.row.member_name}}</span>
              </template>
               </el-table-column>
              <el-table-column label="操作" width="110">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="dismiss_confirm(scope.row.member_id)">移除</el-button>
                </template>
              </el-table-column>
           
          </el-table>
        </template>     
      <span slot="footer" class="dialog-footer">
        <el-button @click="eliminate_confirm(team_id)">解散团队</el-button>
      </span>
    </el-dialog>
    <Invite :inviteVisible="inviteVisible" :team_id="team_id" @InviteClose="InviteClose"></Invite>
    </div>
</template>

<script>
import global from "@/components/global.vue";
import axios from "axios";
import Invite from "@/components/Invite.vue";
export default {
    name: 'TeamManagement',
    components: {
      Invite,
    },
    data(){
      return{
        leader:{},
        allMembers:{},
        inviteVisible:false,
      };
    },
    mounted(){
        this.$nextTick(()=>{
            this.email=global.userEmail
            this.uid=global.userid
   })
        
    },
    props: {
      create_user: {
        type: Number,
        default:0
      },
      listVisible:{
        type:Boolean,
        default:false
      },
      team_id: {
        type: Number,
        default:0
      },
      email:{
        type: String,
        default:null
      },
      uid:{
        type: Number,
        default:0
      }
    },
    watch: {
        listVisible: {
            deep: true,  // 深度监听
            handler() {
                this.getTeamMemberWithoutLeader()
            }
        }
    },
    methods: {
      open(){
          this.getTeamMemberWithoutLeader()
      },
      inviteVisibletrue(){
        this.inviteVisible=true
      },
      InviteClose(){
        this.inviteVisible=false
      },
      eliminate_confirm(team_id){
        this.$confirm('此操作将永久解散团队, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.eliminate(team_id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解散'
          });          
        });
      },
      eliminate(team_id){
      var that = this;
      axios
        .post("http://175.24.53.216:8080/eliminate", {
          email: that.email,
          id:team_id,
        })
        .then(function(response) {
          console.log(response.data.msg);
          that.$message({
              message: '解散成功',
              type: 'success'
            });
          that.onCancel()
          
        })
        .catch(function(error) {
          alert(error);
        });
    },
      handleClose(done) {
        this.inviteVisible=false
        this.allMembers={};
        this.$emit('TeamManagementCancel');
        done()
      },
      getTeamLeader(){
          var that = this;
          axios
            .post("http://175.24.53.216:8080/getTeamLeader", {
              id:that.team_id
            })
            .then(function(response) {
              //that.$set()
              that.leader=response.data.list;
            })
            .catch(function(error) {
              alert(error);
            });
        },
        dismiss_confirm(member_id){
          this.$confirm('此操作将移除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dismiss(member_id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消移除'
          });          
        });
        },
      dismiss(member_id){
      var that = this;
      axios
        .post("http://175.24.53.216:8080/dismiss", {
          email: that.email,
          id:that.team_id,
          target:member_id
        })
        .then(function(response) {
          console.log(response.data.msg);
          that.$message({
              message: '移除成功',
              type: 'success'
            });
            that.getTeamMemberWithoutLeader(that.team_id)
        })
        .catch(function(error) {
          alert(error);
        });
    },
      getTeamMemberWithoutLeader(){
          var that = this;
          axios
            .post("http://175.24.53.216:8080/getTeamMemberWithoutLeader", {
              email: that.email,
              id:that.team_id
            })
            .then(function(response) {
              //that.$set()
              that.allMembers=response.data;
              that.getTeamLeader()
            })
            .catch(function(error) {
              alert(error);
            });
        },
        getTeamMember(){
          var that = this;
          axios
            .post("http://175.24.53.216:8080/getTeamMember", {
              email: that.email,
              id:that.team_id
            })
            .then(function(response) {
              //that.$set()
              that.allMembers=response.data;
            })
            .catch(function(error) {
              alert(error);
            });
        },
      onCancel(){
        this.$emit('TeamManagementCancel');
      }
    }
}
</script>