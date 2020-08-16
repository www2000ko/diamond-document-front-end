<template>
    <el-dialog title="团队成员" :visible.sync="listVisible" width="30%" show-close="false">
      <div v-for="item in allMembers" :key="item.id">
          {{item.member_name}}
          <el-button v-if="item.member_id!=uid" @click="dismiss(item.member_id)">移 除</el-button>
          <el-divider></el-divider>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onCancel()">关 闭</el-button>
        <el-button @click="onCancel(),eliminate(team_id)">解散团队</el-button>
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
        allMembers:"",
      };
    },
    mounted(){
        this.$nextTick(()=>{
            this.email=global.email
            this.uid=global.userid
            this.getTeamMember()
   })
        
    },
    props: {
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
                this.getTeamMember()
            }
        }
    },
    methods: {
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