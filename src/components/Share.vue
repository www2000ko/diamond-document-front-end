<template>
  <el-dialog title="分享" :visible.sync="dialogFormVisible" :center="false" :show-close="false" :close-on-click-modal="false" @opened="opened()">
    <div slot="title">
      分享
    <el-divider></el-divider>
    <div class="file">
        <label v-text="title"></label>
      <el-button @click="share_func" style="margin-left:78%;" :disabled="!isCreater">{{this.text}}</el-button>
    </div>
    <el-form :model="form" v-show="isShare" class="form">
      <el-form-item label="链接:" :label-width="formLabelWidth">
		    <el-input placeholder="请输入内容" v-model="input">
          <template slot="prepend">Http://</template>
        </el-input>
      </el-form-item>
        <div class="box"> 
		      <div  id="qrcode" ref="qrcode" style="float:right">
          </div>
          <el-form-item label="权 限:" :label-width="formLabelWidth" >
            <el-radio-group v-model="select" :disabled="!isCreater">
    	        <el-radio :label="1">只读</el-radio>
    	        <el-radio :label="3">读写</el-radio>
    	        <el-radio :label="5">只读+评论</el-radio>
		          <el-radio :label="7">读写+评论</el-radio>
  	        </el-radio-group>
          </el-form-item>
        </div>
    </el-form>
    </div>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="onConfirm" :disabled="!isCreater">保 存</el-button>
    <el-button @click="onCancel">取 消</el-button>
  </div>
</el-dialog>
</template>


<script>
import global from "@/components/global.vue";
import QRCode from 'qrcodejs2';
import axios from "axios";
export default {
    data(){
      return{
        formLabelWidth:"50px",
        isShare:false,
        select:3
      };
    },
    mounted (){
      this.$nextTick(()=>{
             this.qrcode();
             if(this.radio==0){
               this.isShare=false;
               //this.radio=3;
               this.select=3;
             }
             else{
               this.isShare=true;
               this.select=this.radio;
             }
             if(this.isShare){
                 this.text="关闭分享";
             }
             else{
               this.text="开启分享";
             }
             console.log(this.dialogFormVisible);
             console.log(this.doc_id);
             console.log(this.isCreater);
             console.log(this.radio);
   })
 },
    name: 'Share',
    props: {
      title: {
        type: String,
        default:"文 件 名"
      },
      dialogFormVisible:{
        type:Boolean,
        default:false
      },
      doc_id: {
        type: Number,
        default:0
      },
      input: {
        type: String,
        default:""
      },
      text: {
        type: String,
        default:"开启分享"
      },
      isCreater:{
        type:Boolean,
        required:true
      },
      radio:{
        type:Number,
        default:3
      }
    },
    methods: {
      share_func(){
        this.isShare=!this.isShare;
        if(this.isShare){
            this.text="关闭分享";
        }
        else{
          this.text="开启分享";
        }
      },
      opened(){
        console.log(this.radio);
        if(this.radio==0){
               this.isShare=false;
               //this.radio=3;
               this.select=3;
             }
             else{
               this.isShare=true;
               this.select=this.radio;
             }
             if(this.isShare){
                 this.text="关闭分享";
             }
             else{
               this.text="开启分享";
             }
             console.log(this.dialogFormVisible);
             console.log(this.doc_id);
             console.log(this.isCreater);
             console.log(this.radio);
      },
      qrcode () {
        var canvas = this.$refs.qrcode;
             new QRCode(canvas, {
                 text:this.input, 
                 width:100,
                 height:100,
                 colorDark : "#666",   //二维码颜色
                 colorLight : "#ffffff"   //二维码背景色
       })
      },
      maskHandle(){
          if(this.maskHide){
              console.log(2222)
              this.$emit('input',false)
          }
      },
      onConfirm(){
        var that=this;
        var permission=0;
        if(this.isShare){
          permission=this.select;
        }
        axios
          .post("http://175.24.53.216:8080/share_doc", {//127.0.0.1:8080
          email:global.userEmail,
          permission:permission,
          doc_id:Number(that.doc_id)
          })
          .then(function(response) {
            console.log(response.data);
          })
          .catch(function(error) {
            alert(error);
          });
        this.$emit('ShareConfirm',permission);
      },
      onCancel(){
        this.$emit('ShareCancel');
        console
      }
    }
}
</script>

<style scoped>
.el-dialog__header {
  border-bottom: 1px solid #f4f4f4;
}
.file{
    padding: 20px 10px;
    border-radius: 3px;
    background-color: #efefef;
}
.form{
  margin: 10px 0;
}
.box{
  border: 1px solid #d0d0d0;
  padding: 10px;
}
</style>>