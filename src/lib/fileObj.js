import { nanoid } from 'nanoid'

export default class FileObj{
    constructor(name,status,percent=0,serverId='',url='',vid='') {
        const STATUS = ['done','uploading','error']

        if(!name) {
            throw new Error('生成fileObj失败：缺少name');
        }

        if(!STATUS.includes(status)){
            throw new Error(`生成fileObj失败：非法的status: ${status}`);
        }

        this.uid = nanoid();
        this.name = name;
        this.status = status;
        this.percent = percent;
        this.serverId = serverId;
        this.url = url;
        this.vid = vid
    }

    updateProgress(percent){
        this.percent = percent;
    }

    setUploadDone(serverId,url){
        this.status = 'done';
        this.progress = 100;
        this.serverId = serverId;
        this.url = url;
    }

    setUploadError(){
        this.status = 'error';
    }
}
