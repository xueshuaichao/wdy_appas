<template>
    <a-form-model
        ref="form" layout="horizontal" :model="attr"
        class="custom-form" :label-col="labelCol" :wrapper-col="wrapperCol"
    >
        <formItemWithHelp
            ref="formItem"
            label="字段名称"
            validate="title"
            :rules="[{ required: true, message: '请输入字段名称', trigger: 'blur' }]"
        >
            <a-input v-model="attr.title" class="from-item" @blur="$refs.formItem.$emit('blur')" />
        </formItemWithHelp>
        <formItemWithHelp
            ref="formItem1"
            label="API名称"
            validate="apiName"
            :help-txt="FIELD_HELP.API_NAME"
            :rules="apiNameRules"
        >
            <a-input
                v-model="attr.apiName" :disabled="fieldDisabled" class="from-item"
                @blur="$refs.formItem1.$emit('blur')"
            />
        </formItemWithHelp>
        <formItemWithHelp
            ref="formItem2"
            label="允许上传个数"
            validate="uploadNumber"
            :rules="[
                { required: true, message: '请输入允许上传图片数', trigger: 'blur' },
                integerRule]"
        >
            <a-input-number
                v-model="attr.uploadNumber"
                :formatter="limitDecimals"
                :parser="limitDecimals" :min="1" class="width100"
                @blur="$refs.formItem2.$emit('blur')"
            />
        </formItemWithHelp>
        <formItemWithHelp
            ref="formItem3"
            label="最大尺寸Mb"
            validate="maxFileSize"
            help-txt="单张图片不能超过50Mb"
            :rules="[
                { required: true, message: '请输入最大图片尺寸', trigger: 'blur' },
                integerRule
            ]"
        >
            <a-input-number
                v-model="attr.maxFileSize"
                :formatter="limitDecimals"
                :parser="limitDecimals" :min="1" :max="50"
                class="width100"
                @blur="$refs.formItem3.$emit('blur')"
            />
        </formItemWithHelp>
        <a-row class="custom-form-item">
            <a-col :span="8" :offset="5">
                <a-checkbox :checked="!!attr.required" @change="checkboxChange('required',$event)">必填</a-checkbox>
            </a-col>
        </a-row>
        <formItemWithHelp label="帮助文本" :help-txt="FIELD_HELP.HELP_TEXT">
            <a-textarea v-model="attr.hint" class="custom-textarea" />
        </formItemWithHelp>
        <formItemWithHelp label="字段描述" :help-txt="FIELD_HELP.DESC">
            <a-textarea v-model="attr.description" class="custom-textarea" />
        </formItemWithHelp>
    </a-form-model>
</template>

<script>
    import fieldConfig from '@/mixin/fieldConfig'

    export default {
        name: "ImagesConfig",
        mixins: [fieldConfig],
    }
</script>

<style scoped>

</style>
