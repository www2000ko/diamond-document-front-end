<template>
    <el-dialog title="修改记录" :visible.sync="HistoryVisible" :center="true"  @opened="opened()" @close="onCancel()">
    <template>
            <el-table
              :data="History"
              stripe
              >
                <el-table-column
                    prop="modify_user"
                    label="用户名"
                    sortable
                    width="160px">
                </el-table-column>
              
                <el-table-column 
                    prop="modify_user_email"
                    label="邮箱"
                    sortable>
                </el-table-column>

                <el-table-column 
                    prop="modify_time"
                    label="修改时间"
                    sortable>
                </el-table-column>
            </el-table>
        </template>
    </el-dialog>
</template>


<script>
import axios from "axios";
export default {
    data(){
      return{
          History:{}
      };
    },
    mounted (){
      this.$nextTick(()=>{
          this.opened()
   })
 },
    name: 'History',
    props: {
      HistoryVisible:{
        type:Boolean,
        default:false
      },
      doc_id: {
        type: Number,
        default:0
      }
    },
    methods: {
      opened(){
          var that=this;
            axios
          .post("http://175.24.53.216:8080/get_modify_history", {//175.24.53.216
          id:Number(that.doc_id)
          })
          .then(function(response) {
            if(response.data.code==200){
                that.History=response.data.list;
                console.log(that.History)
            }
          })
          .catch(function(error) {
            alert(error);
          });
      },
      onCancel(){
        this.$emit('closeHistory');
      }
    }
}
</script>
