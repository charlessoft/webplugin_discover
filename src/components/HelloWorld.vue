<template>
  <div class="hello">
    <h1>{{ props.msg }}</h1>

<!--    {{curpdfId}}-->


    <el-row>
      <el-input
          v-model="txtSelected"
          :rows="8"
          type="textarea"
          placeholder=""
      />
    </el-row>

    <el-row>
      <el-col>
        <el-button style="margin-top:10px" class="long-button" type="primary" :loading-icon="Eleme" :loading="loading" @click="findRelateContent()">探索相关内容</el-button>
<!--        <el-button style="margin-top:10px" class="long-button" type="primary" :loading-icon="Eleme" :loading="loading" @click="testBtn()">推荐相关内容pdf</el-button>-->
      </el-col>
    </el-row>

    <br />

    <div style="margin:10px;display: flex; align-items: center;" v-for="(item, index) in recommendPdflist" :key="index">
      <el-tag>{{index}}:<a :href="item.link" target="_blank">{{ item.title }}</a>
      </el-tag><el-tag @click="discoverBtn(item.link)">探索一下🔥</el-tag>
    </div>
  </div>
</template>
<script setup>
import { defineProps,ref } from 'vue'
import {LLMsearchPdf, LLMSummaryKey, LLsavePdfFile} from "../api/aiApi.js";
import {ElMessage} from "element-plus";
// import {getApiList} from "@/api/aiApi";
const txtSelected = ref('')
const pdfPathId = ref('')
const recommendPdflist = ref([])
const loading = ref(false)
const curpdfId = ref('')
const props = defineProps({
  msg: String,
})

window.Foxit.ReaderApp.addAppListener('onSelectText', (text) => {
  // console.log('onSelectText AppListener triggered!!!!!!', text);
  txtSelected.value = text
});

// const summarPdf = ()=>{
//   if (curpdfId.value!=''){
//
//   }
// }

// txtSelected.value = "hello
const uploadPdfPath = async () =>{
  const doc = await window.Foxit.ReaderApp.getActiveDoc();
  const count = await doc.getPageCount()
  const exportIndex = Array.from({ length: count }, (_, i) => i);

  // console.log(data); // 输出: [0, 1, 2, 3, 4]
  const result = await doc.extractPages(exportIndex);
  const data = new Blob(result, { type: 'application/pdf' });
  LLsavePdfFile(data).then(res=>{
    curpdfId.value=res.data.pdfId
    console.log(res.data.pdfId)
  })
}

const baseurl= (url)=>{
  return window.btoa(url)
}

const discoverBtn = async (link) =>{
  const targetUrl= baseurl(link)
  console.log(curpdfId.value)
  console.log(`http://localhost:8080/#/compare?pdfId=${curpdfId.value}&compareId=${targetUrl}`)

  // window.Foxit.ReaderApp.closeDialog('Compare Text', '54321');
  let timestimp = Date.now()
  window.Foxit.ReaderApp.showDialog(
      'Compare Text',
      timestimp,
      'Compare Text',
      `http://localhost:8080/#/compare?pdfId=${curpdfId.value}&compareId=${targetUrl}`,
      { width: 800, height: 800 },
      'Frame',
      {
        padding: '0',
        margin: '0',
      }
  );

}

const testBtn = async () => {
  const doc = await window.Foxit.ReaderApp.getActiveDoc();
  const count = await doc.getPageCount()
  const exportIndex = Array.from({ length: count }, (_, i) => i);

  // console.log(data); // 输出: [0, 1, 2, 3, 4]
  const result = await doc.extractPages(exportIndex);
  const data = new Blob(result, { type: 'application/pdf' });


}

const findRelateContent = async () => {
  if (txtSelected.value == "") {
    ElMessage.error('请输入/复制文本')
    return
  }
  let data = {
    content: txtSelected.value
  }
  if (curpdfId.value == '') {
    await uploadPdfPath()
  }


  loading.value = true
  LLMSummaryKey(data).then(res => {
    console.log(res)
    console.log('关键字: ' + res['data']['ans'])
    let data = {
      key: res['data']['ans']
    }
    LLMsearchPdf(data).then(res => {
      console.log(res)
      console.log('====搜索的结果====')
      console.log(res['data']['ans'])
      recommendPdflist.value = res['data']['ans']
      loading.value = false
    }).catch(error => {
      console.error('Anerror occur red:', error);
      // 在此处处理错误，例如显示错误消息或执行其他操作
      loading.value = false
    });

  }).catch(error => {
    console.error('An error occurred:', error);
    // 在此处处理错误，例如显示错误消息或执行其他操作
    loading.value = false
  });
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.long-button {
  width: 100%;
}
</style>
