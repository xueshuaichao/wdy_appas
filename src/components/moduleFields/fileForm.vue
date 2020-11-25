<template>
    <a-form-model-item :prop="String(attr.apiName)" :rules="rules">
        <template slot="label">
            {{ attr.title }}
            <form-help v-if="attr.hint" placement="bottom">{{ attr.hint }}</form-help>
        </template>
        <a-upload
            :accept="fileExt.join(',')"
            :show-upload-list="false"
            :multiple="true"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
            :remove="handleRemove"
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
    import fieldForm from "@/mixin/fieldForm";
    import filedFileForm from "@/mixin/fieldFileForm";
    import FormHelp from "@/components/public/formHelp";
    import uploadList from "@/components/public/uploadList";

    export default {
        name: "FileForm",
        components: {
            FormHelp,
            uploadList
        },
        mixins: [fieldForm,filedFileForm],
        data: ()=>{
            return {
                fileExt : [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-powerpoint',
                    'application/pdf','text/plain','.doc','.docx','.ppt','.pptx','.pdf','xls','xlsx','.csv','.txt'
                ]
            }
        },
        created(){
            this.overSizeMsg = `单个文件不允许超过${this.attr.maxFileSize}Mb`;
            this.ossNameSpace = 'file';
        }
    }
</script>

<style scoped>

</style>
