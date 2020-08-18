<template>
  <el-dialog title="团队权限" :visible.sync="TPVisible" :center="true" :show-close="false" :close-on-click-modal="false" @opened="opened()">
    <template>
            <el-table
              :data="tableData"
              stripe
              >
              <el-table-column
                prop="name"
                label="团队成员"
                sortable width="180px">
              </el-table-column>
              
              <el-table-column label="权限设置">
              <template slot-scope="scope">
                <el-radio-group v-model="scope.row.permission" :disabled="!isCreater">
    	            <el-radio :label="1">只读</el-radio>
    	            <el-radio :label="3">读写</el-radio>
    	            <el-radio :label="5">只读+评论</el-radio>
		            <el-radio :label="7">读写+评论</el-radio>
  	            </el-radio-group>
              </template>
            </el-table-column>
            </el-table>
          </template>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="onConfirm" :disabled="!isCreater">保 存</el-button>
    <el-button @click="onCancel">取 消</el-button>
  </div>
</el-dialog>
</template>


<script>
import axios from "axios";
import global from "@/components/global.vue";
export default {
    data(){
      return{
        tableData:{},
        create_user:0,
        isCreater:false
      };
    },
    mounted (){
      this.$nextTick(()=>{
             this.getinfo();
             this.getLeader();
   })
 },
    name: 'TeamPermission',
    props: {
      title: {
        type: String,
        default:"文 件 名"
      },
      TPVisible:{
        type:Boolean,
        default:false
      },
      doc_id: {
        type: Number,
        default:0
      },
      team_id: {
        type: Number,
        default:0
      }
    },
    methods: {
        getinfo(){
            var that=this;
            axios
          .post("http://175.24.53.216:8080/get_team_permission", {//127.0.0.1:8080
          team_id:Number(that.team_id),
          doc_id:Number(that.doc_id)
          })
          .then(function(response) {
            console.log(response.data);
            that.tableData=response.data;
          })
          .catch(function(error) {
            alert(error);
          });
        },
        getLeader(){
            var that=this;
            axios
          .post("http://175.24.53.216:8080/getTeamLeader", {//127.0.0.1:8080
          id:Number(that.team_id),
          doc_id:Number(that.doc_id)
          })
          .then(function(response) {
            console.log(response.data.list[0]);
            that.create_user=response.data.list[0].create_user_id;
            if(global.userid==that.create_user){
                that.isCreater=true;
            }
          })
          .catch(function(error) {
            alert(error);
          });
        },
      opened(){
        console.log(this.radio);
        this.getinfo();
        this.getLeader();
      },
      onConfirm(){
        var that=this;
        axios
          .post("http://175.24.53.216:8080/set_team_permission", {//127.0.0.1:8080
          team_id:Number(that.team_id),
          doc_id:Number(that.doc_id),
          data:that.tableData
          })
          .then(function(response) {
            console.log(response.data);
          })
          .catch(function(error) {
            alert(error);
          });
          this.$emit('closeTeamPermission');
      },
      onCancel(){
        this.$emit('closeTeamPermission');
      }
    }
}
</script>
