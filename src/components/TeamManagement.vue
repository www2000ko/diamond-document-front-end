<template>
    <el-dialog title="团队成员" :visible.sync="listVisible" width="30%" show-close="false" :before-close="handleClose">

      
        <template>
          <el-table
            :data="leader"
            stripe
            style="width: 100%">
            
              <el-table-column label="队长"  width="390">
               
              <template slot-scope="scope">
                <span>{{scope.row.create_user}}</span>
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
                    @click="dismiss(scope.row.member_id)">移除</el-button>
                </template>
              </el-table-column>
           
          </el-table>
        </template>     
      <span slot="footer" class="dialog-footer">
        <el-button @click="eliminate(team_id)">解散团队</el-button>
      </span>
    </el-dialog>
</template>

<script>
import global from "@/components/global.vue";
import axios from "axios";
export default {
    name: 'TeamManagement',
    data(){
      return{
        leader:{},
        allMembers:{},
      };
    },
    mounted(){
        this.$nextTick(()=>{
            this.email=global.userEmail
            this.uid=global.userid
            this.getTeamMemberWithoutLeader()
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