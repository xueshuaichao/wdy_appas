
import {getOssClient} from "@/lib/utils";
import {generateOssPath} from "@/lib/field";
import FileObj from "@/lib/fileObj";
import {upload} from "@/api/business";
import Host from "@/const/host";

export default {
    data: function () {
        return {
            fileList: this.initialData ? this.initialData.map((item)=>{
                return new FileObj(item.fileName,'done',100,item.id,`${Host.OSS}/${item.objectName}`)
            }) : [],
            fileExt : []
        }
    },
    computed: {
        rules: function(){
            let {required,title} = this.attr;
            let rules = [this.customRules];

            if(required) {
                rules.push({
                    required: true,
                    message: `请上传${title}`,
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
        //以下属性在实例中扩展
        this.overSizeMsg = `单个文件不允许超过${this.attr.maxFileSize}Mb`;
        this.ossNameSpace = 'file';
    },
    methods: {
        beforeUpload: function (file) {
            if (file.size > this.attr.maxFileSize * 1024 * 1024) {
                this.$message.error(this.overSizeMsg)
                return false
            }
        },
        handleUpload: async function ({file}) {
            let oss = await getOssClient();
            let fileName = file.name;
            let fileObj = new FileObj(fileName,'uploading',0);
            this.fileList.push(fileObj);
            try {
                let filePath = generateOssPath(fileName, this.ossNameSpace);

                let result = await oss.multipartUpload(filePath, file,{
                    progress: function (p) {
                        fileObj.updateProgress(p * 100);
                    }
                });

                let extName = fileName.match(/\.([^.]+)$/)
                let params = {
                    fileName: fileName,
                    extName: extName ? extName[1] : '',
                    size: file.size,
                    objectName: result.name
                }

                let serverId = await upload(params);

                fileObj.setUploadDone(serverId,`${Host.OSS}/${result.name}`);

                this.form[this.attr.apiName].ADD.push(serverId);
                this.$emit('validateField',this.attr.apiName);

            } catch (e) {
                console.error(e.msg || '上传失败')
                fileObj.setUploadError();
            }
        },
        handleRemove: function (file) {
            this.fileList = this.fileList.filter((item) => file.uid != item.uid)
            let index = this.form[this.attr.apiName].ADD.findIndex((serverId) => file.serverId == serverId);
            if (index >= 0) {
                this.form[this.attr.apiName].ADD.splice(index, 1);
            } else {
                this.form[this.attr.apiName].DEL.push(file.serverId)
            }
        }
    }
}
