<template>
  <div class="home">
    <Navigator return="home" />
    <el-row :span="10">
      <!-- 左侧导航栏 -->
    <el-col :span="5">
     <el-menu
      default-active="1"
      class="el-menu-vertical-demo">

      <el-menu-item index="1" @click="pageflag=1">
        <i class="el-icon-menu"></i>
        <span slot="title" >工作台</span>
      </el-menu-item>
      
      <el-menu-item index="2" @click="pageflag=2">
        <i class="el-icon-message"></i>
        <span slot="title" >收件箱</span>
      </el-menu-item>

      <el-menu-item index="3" @click="pageflag=3">
        <i class="el-icon-delete"></i>
        <span slot="title" >回收站</span>
      </el-menu-item>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>团队空间</span>
        </template>
        <el-menu-item-group>
          <el-menu-item  v-for="item in allteams.data" :key="item.id">

          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="19">
      <!-- 工作台页面 -->
      
      <div v-if="pageflag==1">
        <!-- 上方分类 -->
        <el-row>
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1" @click="changesearchkind(1)">最近使用</el-menu-item>
          <el-menu-item index="2" @click="changesearchkind(2)">我创建的</el-menu-item>
          <el-menu-item index="3" @click="changesearchkind(3)">我的收藏</el-menu-item>
          <el-menu-item index="4" style="float:right">新建文档</el-menu-item>
          <el-menu-item index="5" style="float:right">按模版新建</el-menu-item>
        </el-menu>
        </el-row>
        <!-- 下方内容 -->
        <el-row>
            <div class="files" v-for="item in allfiles.data" :key="item.id">
            <div class="afile">
              
            </div>
           </div>
          
        </el-row>

      </div>
      <!-- 收件箱页面 -->
      <div v-if="pageflag==2">
        hi2
      </div>
      <!-- 回收站页面 -->
      <div v-if="pageflag==3">
       <el-row>
            <div class="deletefiles" v-for="item in alldeleted.data" :key="item.id">
            <div class="deletefile">
              
            </div>
           </div>
        </el-row>
      </div>


    </el-col>


    </el-row>
  </div>





  
</template>

<script>
// @ is an alias to /src
import Navigator from "@/components/Navigator.vue";

export default {
  name: "Home",
  components: {
    Navigator
  },
  data() {
    return {
      searchkind:1,
      pageflag:1,
      allfiles:{},
      alldeleted:{},
      allteams:{}
    };
  },
  created()
  {

  },
  methods: {
   changesearchkind(aint)
   {
    this.searchkind=aint
   }
  }
};
</script>

<style scoped>
.each {
  width: 30%;
  border: 1px solid black;
  margin: 5px;
  cursor: pointer;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.box { 
  border: 1px solid #DCDFE6;
  margin: 10px auto;
  padding: 10px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 5px #909399;
  opacity: 1
}
.art-more {
	height: 40px;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
}
.art-more .view {
	color: #aaa;
}
h5{
	font-size: 18px;
}
.pagination {
	background-color: #F9F9F9;
}
.name{
  margin-top:10px ;
  margin-left: 5px;
}
.art-time {
	margin-right: 20px;
}
.art-title {
	border-left: 3px solid #409EFF;
	padding-left: 5px;
	cursor: pointer;
}
.art-title:hover {
	padding-left: 10px;
	color: #409EFF;
}
.name{
  margin-top:10px ;
  margin-left: 5px;
  cursor: pointer;
}
.name:hover{
  padding-left: 10px;
	color: #409EFF;
}
</style>