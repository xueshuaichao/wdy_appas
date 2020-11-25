<template>
    <a-form-model-item :prop="String(attr.apiName)" :rules="rules">
        <label slot="label">
            {{ attr.title }}
            <form-help v-if="attr.hint" placement="bottom">{{ attr.hint }}</form-help>
        </label>
        <a-upload
            accept="video/*"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
        >
            <a-button :disabled="fileList.length == attr.uploadNumber"><a-icon type="upload" />上传</a-button>
        </a-upload>
        <upload-list
            v-for="item in fileList" :key="item.uid" :file-obj="item"
            @remove="handleRemove"
        />
    </a-form-model-item>
</template>

<script>
    import Host from "@/const/host";
    import fieldForm from "@/mixin/fieldForm";
    import FileObj from "@/lib/fileObj";
    import uploadList from "@/components/public/uploadList";
    import {getUploadVideoToken, refreshUploadVideoToken} from "@/api/aliyun";
    import {upload} from "@/api/business";
    import formHelp from "@/components/public/formHelp";

    export default {
        name: "VideoForm",
        components: {
            formHelp,
            uploadList
        },
        mixins: [fieldForm],
        data: function(){
            return {
                fileList: this.initialData ? this.initialData.map((item)=>{
                    return new FileObj(item.fileName,'done',100,item.id,`${Host.ALI_VIDEO}/${item.objectName}`);
                }) : []
            }
        },
        computed: {
            rules: function(){
                let {required,title} = this.attr;
                let rules = [this.customRules];

                if(required) {
                    rules.push({
                        required: true,
                        message: `${title}必须上传`,
                        trigger: 'submit',
                        validator: ()=> {
                            return this.fileList.length != 0;
                        },
                    })
                }

                return rules;
            }
        },
        created() {
            let self = this;
            // eslint-disable-next-line no-undef
            this.uploader = new AliyunUpload.Vod({
                userId: '252892297133782846',
                // 开始上传
                'onUploadstarted': async function (uploadInfo) {
                    console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                    let uploadAuth,uploadAddress,videoId
                    try {
                        if (uploadInfo.videoId) {
                            let res = await refreshUploadVideoToken(uploadInfo.videoId);
                            uploadAuth = res.uploadAuth;
                            uploadAddress = res.uploadAddress;
                            videoId = uploadInfo.videoId;
                        }
                        else{
                            let res = await getUploadVideoToken("media", uploadInfo.file.name)
                            uploadAuth = res.uploadAuth;
                            uploadAddress = res.uploadAddress;
                            videoId = res.videoId;
                        }
                    } catch (e) {
                        self.$message.error('上传视频失败,获取上传凭证错误');
                        return;
                    }

                    self.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                    self.fileList.push(new FileObj(uploadInfo.file.name,'uploading',0,'','',videoId));
                    self.$emit('validateField',self.attr.apiName);
                },
                // 文件上传成功
                'onUploadSucceed': async function (uploadInfo) {
                    for(let item of self.fileList){
                        if(item.vid == uploadInfo.videoId){
                            try{
                                let extName = item.name.match(/\.([^.]+)$/)
                                let params = {
                                    fileName: item.name,
                                    extName: extName ? extName[1] : '',
                                    size: uploadInfo.file.size,
                                    objectName: uploadInfo.object
                                }

                                let serverId = await upload(params)
                                item.setUploadDone(serverId,`${Host.ALI_VIDEO}/${uploadInfo.object}`)
                                self.form[self.attr.apiName].ADD.push(serverId);
                            } catch (e) {
                                console.error(e.msg || '上传失败')
                            }
                            break;
                        }
                    }
                },
                // 文件上传失败
                'onUploadFailed': function (uploadInfo, code, message) {
                    for(let item of self.fileList){
                        if(item.vid == uploadInfo.videoId){
                            item.status = 'exception';
                            break;
                        }
                    }
                },
                // 文件上传进度，单位：字节
                'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
                    for(let item of self.fileList){
                        if(item.vid == uploadInfo.videoId){
                            item.updateProgress(Math.ceil(loadedPercent * 100));
                            break;
                        }
                    }
                },
                // 上传凭证超时
                'onUploadTokenExpired': async function (uploadInfo) {
                    let uploadAuth;
                    try {
                        let res = await refreshUploadVideoToken(uploadInfo.videoId);
                        uploadAuth = res.uploadAuth;
                    } catch (e) {
                        this.$message.error('上传视频失败,获取上传凭证错误');
                        return;
                    }
                    self.uploader.resumeUploadWithAuth(uploadAuth);
                }
            });
        },
        methods: {
            beforeUpload: function (file) {
                if (file.size > this.attr.maxFileSize * 1024 * 1024) {
                    this.$message.error(`单个视频不允许超过${this.attr.maxFileSize}Mb`)
                    return false
                }
            },
            handleUpload: function ({file}) {
                this.uploader.addFile(file, null, null, null, '{"Vod":{}}');
                this.uploader.startUpload();
            },
            handleRemove: function (fileObj) {
                this.fileList = this.fileList.filter((item) => fileObj.uid != item.uid)
                let index = this.form[this.attr.apiName].ADD.findIndex((serverId) => fileObj.serverId == serverId);
                if (index >= 0) {
                    this.form[this.attr.apiName].ADD.splice(index, 1);
                } else {
                    this.form[this.attr.apiName].DEL.push(fileObj.serverId);
                }
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
