import service from '@/utils/request'

// @Tags api
// @Summary 分页获取角色列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /api/getApiList [post]
// {
//  page     int
//	pageSize int
// }
export const LLMSummaryKey = (data) => {
    return service({
        url: '/api/v1/langchain_summary',
        method: 'post',
        data
    })
}


export const LLMsearchPdf = (data) =>{
    return service({
        url: '/api/v1/langchain_searchPdf',
        method: 'post',
        data
    })
}


export const GetPdfTextById = (data)=>{
    return service({
        url: '/api/v1/getPdfTextById',
        method: 'post',
        data
    })
}
export const GetPdfTextByUrl=(data)=>{
    return service({
        url: '/api/v1/getPdfTextByUrl',
        method: 'post',
        data
    })
}


export const LLsavePdfFile = (data)=>{
    return service({
        url: '/api/v1/savePdfFile',
        method: 'post',
        data
    })

}


export const langchain_openaiContentCompare = (data)=>{
    return service({
        url: '/api/v1/langchain_openaiContentCompare',
        method: 'post',
        data
    })
}
