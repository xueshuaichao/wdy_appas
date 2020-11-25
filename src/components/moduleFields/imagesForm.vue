<template>
    <a-form-model-item ref="formItemws" :prop="String(attr.apiName)" :rules="rules">
        <template slot="label">
            {{ attr.title }}
            <form-help v-if="attr.hint" placement="bottom">{{ attr.hint }}</form-help>
        </template>
        <a-upload
            list-type="picture-card"
            :accept="fileExt.join(',')"
            :file-list="fileList"
            :multiple="true"
            :before-upload="beforeUpload"
            :custom-request="handleUpload"
            :remove="handleRemove"
        >
            <div v-if="fileList.length < attr.uploadNumber">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                    上传
                </div>
            </div>
        </a-upload>
    </a-form-model-item>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";
    import filedFileForm from "@/mixin/fieldFileForm";
    import formHelp from "@/components/public/formHelp";

    export default {
        name: "ImagesForm",
        components: {
            formHelp
        },
        mixins: [fieldForm,filedFileForm],
        data: ()=>{
            return {
                fileExt : ['image/*']
            }
        },
        created(){
            this.overSizeMsg = `单张图片不允许超过${this.attr.maxFileSize}Mb`;
            this.ossNameSpace = 'img';
        }
    }
</script>

<style scoped>

</style>
