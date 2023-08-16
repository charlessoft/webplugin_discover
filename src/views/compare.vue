<template>
<div >


  <el-row :gutter="10">
    <el-col :span="12">
      <el-text>源文档:</el-text>
      <el-input
          v-model="leftContent"
          :autosize="{ minRows: 20, maxRows: 20 }"
          type="textarea"
          placeholder=""
      />
    </el-col>

    <el-col :span="12">
      <el-text>目标文档:</el-text>
      <el-input
          :loading="loading"
          v-model="rightContent"
          :autosize="{ minRows: 20, maxRows: 20 }"
          type="textarea"
          placeholder=""
      />
    </el-col>
  </el-row>

  <el-form style="margin-top: 10px">
    <el-form-item label="问题:" label-width="80px">
<!--      <div class="input-button-wrapper">-->
      <el-row style="width: 100%" :gutter="10">
        <el-col :span="22">
          <el-input v-model="question"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button :loading="loading" @click="btnCompare()">
            <el-icon><Promotion /></el-icon>

          </el-button>
        </el-col>
      </el-row>




<!--      </div>-->
<!--      <el-input v-model="question"></el-input><el-button>xx</el-button>-->
    </el-form-item>

    <el-form-item label="状态:" label-width="80px" >

        <el-tag style="width: 100%">{{message}}</el-tag>

    </el-form-item>

    <el-form-item label="结果:" label-width="80px">
<!--      <el-text >{{compareResult}}</el-text>-->
      <v-md-preview :text="compareResult"></v-md-preview>
    </el-form-item>
  </el-form>
<!--  <el-form>-->
<!--    <el-form-item label="">-->
<!--      <el-row :gutter="10">-->
<!--        <el-col :span="12">-->
<!--          <el-text>左侧文章:</el-text>-->
<!--          <el-input-->
<!--              v-model="leftContent"-->
<!--              :autosize="{ minRows: 20, maxRows: 20 }"-->
<!--              type="textarea"-->
<!--              placeholder=""-->
<!--          />-->
<!--        </el-col>-->

<!--        <el-col :span="12">-->
<!--          <el-text>右侧文章:</el-text>-->
<!--          <el-input-->
<!--              :loading="loading"-->
<!--              v-model="rightContent"-->
<!--              :autosize="{ minRows: 20, maxRows: 20 }"-->
<!--              type="textarea"-->
<!--              placeholder=""-->
<!--          />-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--    </el-form-item>-->
<!--  </el-form>-->

</div>
</template>

<script setup>
import { ref, onMounted ,onActivated} from "vue";
import { useRoute } from 'vue-router';
import {GetPdfTextById, GetPdfTextByUrl, langchain_openaiContentCompare} from "../api/aiApi";
const srcPdfId = ref('')
const destPdfurl = ref('')
const leftContent = ref('');
const rightContent = ref('');
const question = ref('这两篇文章有什么异同点?')
const loading = ref(false)
const compareResult = ref('')
const message=ref('')


const btnCompare = ()=>{
  // getPdfText(srcPdfId.value,destPdfurl.value);
  let data={
    'left':leftContent.value,
    'rigth':rightContent.value,
    'question':question.value
  }
  message.value = '正在处理...'
  loading.value = true
  langchain_openaiContentCompare(data).then(res=>{
    compareResult.value=res.data.answer
    loading.value = false
    message.value = ''
  }).catch(err=>{
    loading.value = false
    console.log(err)
    message.value = ''
  })

}
// const uploadPdfPath = async () =>{
const getPdfText = async (pdfId, destPdfUrl) => {
  message.value = '正在获取左侧文章内容'
  let ret  = await GetPdfTextById({'pdfId': pdfId})
  leftContent.value = ret.data.text
  message.value = '正在获取右侧文章内容'
  ret  = await GetPdfTextByUrl({'url': destPdfUrl})
  rightContent.value = ret.data.text
  message.value = ''

}

 const getUrlParams=()=> {
   const route = useRoute();
   srcPdfId.value = route.query.pdfId;
   destPdfurl.value = window.atob(route.query.compareId);
   console.log(srcPdfId.value)
   console.log(destPdfurl.value)
}

onMounted(async () => {
  console.log(window.location)
  console.log('Component has been mounted');
  getUrlParams();

  message.value ='正在获取pdf文本'
  await getPdfText(srcPdfId.value,destPdfurl.value);



});

</script>

<style scoped>
.input-button-wrapper {
  display: flex;
  align-items: center;
}
</style>
