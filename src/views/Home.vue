<template>
  <div class="home">
    <Navigator return="home" />
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
    };
  },
  created()
  {

  },
  methods: {
   
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