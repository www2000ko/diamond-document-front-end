<template>
<header>
<el-container direction="horizontal">
	<el-button id="back-button" type="primary" icon="el-icon-arrow-left">Back</el-button>

	<el-header id="site" height="50px">
		<div class="nav-navbar-header">
		{{sitename}}</div>
	</el-header>

	<el-button-group id="button-group">
		<el-button type="primary" icon="el-icon-edit"></el-button>
		<el-button type="primary" icon="el-icon-star-off"></el-button>
		<el-button type="primary" icon="el-icon-share"></el-button>
		<el-button type="primary" icon="el-icon-delete"></el-button>
	</el-button-group>
</el-container>
</header>
</template>

<script>
export default {
	name:'DocHeader',
	data () {
		return {
			sitename:"Diamond Document",
		}
	},
	props:[],
	methods:{

	}
}
</script>

<style scoped>

a {
	text-decoration:none;
	color:black;
}

.nav-navbar-header {
	font-family:sans-serif;
	color:black;
	font-size:40px;
}
header {
	background-color:#c0c0c0;
	padding:10px,10px,10px,10px;
	height:100px;
}
#back-button{
	margin-top:25px;
}
#button-group{
	margin-top:25px;
}
#site{
	margin-top:20px;
}
</style>