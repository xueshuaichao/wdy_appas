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
            <a-input
                v-model="attr.title" :disabled="fieldDisabled" class="from-item"
                @blur="$refs.formItem.$emit('blur')"
            />
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
        <a-row class="custom-form-item">
            <a-col :span="8" :offset="5">
                <a-checkbox :disabled="fieldDisabled" :checked="!!attr.required" @change="checkboxChange('required',$event)">必填</a-checkbox>
            </a-col>
        </a-row>
        <formItemWithHelp label="默认值" :help-txt="FIELD_HELP.DEFAULT_VALUE">
            <a-input v-model="attr.defaultValues" :disabled="fieldDisabled" />
        </formItemWithHelp>
        <formItemWithHelp label="默认提示" :help-txt="FIELD_HELP.PLACEHOLDER">
            <a-input v-model="attr.defaultPrompt" :disabled="fieldDisabled" />
        </formItemWithHelp>
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
        name: "ClerkRadioConfig",
        mixins: [fieldConfig]
    }
</script>

<style scoped>

</style>
