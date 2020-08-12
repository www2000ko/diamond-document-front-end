<template>
<div id="Doc-block">
	<div id="textarea">
	{{contents}}</div>
</div>
</template>

<script>
export default {
	name:'Doc',
	props:['contents']
}
</script>

<style scoped>
#textarea{
    width: 800px; 
    min-height: 200px; 
    max-height: 300px;
    _height: 120px; 
    margin-left: auto; 
    margin-right: auto; 
    padding: 3px; 
    outline: 0; 
    border: 1px solid #a0b3d6; 
    font-size: 12px; 
    line-height: 24px;
    padding: 5px 10px 10px 10px;
    word-wrap: break-word;
    overflow-x: hidden;
    overflow-y: auto;
 
    border-color: rgba(160,160,160,160);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(160,160,160,160);
}
</style>