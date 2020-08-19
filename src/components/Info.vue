<template>
    <el-dialog
            title="用户信息"
            :visible.sync="infoVisible"
            width="30%"
            @open="opened"
            @close="onCancel">
            <el-row class="InfoDialog">
            <el-col class="sidebar-avatar"><img :src="userinfo.avatar" class="avatar"></el-col>
            <el-col class="sidebar-name">{{userinfo.name}}</el-col>
            <el-col class="prototype" :span="10">邮箱</el-col>
            <el-tooltip class="email-detail" effect="dark" :content="userinfo.email" placement="top-start">
            <el-col class="value" :span="14">{{userinfo.email}}</el-col></el-tooltip>
            <el-col class="prototype" :span="10">性别</el-col>
            <el-col class="value" :span="14" v-if="userinfo.gender==1">男</el-col>
            <el-col class="value" :span="14" v-else>女</el-col>
            <el-col class="prototype" :span="10">联系电话</el-col>
            <el-col class="value" :span="14">{{userinfo.phone}}</el-col>
            <el-col class="prototype" :span="10">生日</el-col>
            <el-col class="value" :span="14">{{userinfo.birthday}}</el-col>
            <el-col class="prototype" :span="10">地址</el-col>
            <el-col class="value" :span="14">{{userinfo.address}}</el-col>
            </el-row>
    </el-dialog>
</template>


<script>
export default {
    data(){
      return{
      };
    },
    mounted (){
      this.$nextTick(()=>{
          this.opened()
   })
 },
    name: 'Info',
    props: {
        infoVisible:{
        type:Boolean,
        default:false
      },
      userinfo: {
      }
    },
    methods: {
      opened(){
          console.log(this.userinfo)
      },
      onCancel(){
        this.$emit('closeInfo');
      }
    }
}
</script>

<style scoped>
.sidebar-avatar,.sidebar-name{
    text-align: center;
    margin-bottom: 20px;
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
  .avatar {
    border: 1px solid #DCDFE6;
    width:100px;
    height:100px;
    border-radius: 50%;
    background-color:#CCFFCC;
  }
</style>