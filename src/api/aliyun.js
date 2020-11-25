
import request from "@/lib/request";
import Host from "@/const/host";

/*
    获取oss上传凭证
 */
export function getOssToken(){
    return request.request('/cmc/aliOss/sts',{
        method: 'post',
        baseURL: Host.TEST,
    });
}

/*
    获取上传视频凭证
 */
export function getUploadVideoToken(title,fileName){
    return request.get('/cmc/aliVod/getUploadVideoParam',{
        baseURL: Host.TEST,
        params: {
            title,
            fileName
        }
    })
}

/*
    刷新上传视频凭证
 */
export function refreshUploadVideoToken(videoId){
    return request.get('/cmc/aliVod/refreshUploadVideoParam',{
        baseURL: Host.TEST,
        params: {
            videoId
        }
    })
}
