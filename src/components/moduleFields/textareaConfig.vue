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
            label="最大长度"
            validate="maxLength"
            :rules="maxLengthRules"
        >
            <a-input-number
                v-model="attr.maxLength" :formatter="limitDecimals"
                :parser="limitDecimals"
                class="width100"
                :min="1"
                @blur="handleMaxLengthBlur"
            />
        </formItemWithHelp>
        <formItemWithHelp
            ref="formItem3" validate="minLength" label="最小长度"
            :rules="minLengthRules"
        >
            <a-input-number
                v-model="attr.minLength"
                :formatter="limitDecimals"
                :parser="limitDecimals"
                :min="1"
                class="width100"
                @blur="handleMinLengthBlur"
            />
        </formItemWithHelp>
        <a-row class="custom-form-item">
            <a-col :span="8" :offset="5">
                <a-checkbox :checked="!!attr.required" @change="checkboxChange('required',$event)">必填</a-checkbox>
            </a-col>
            <a-col :span="8">
                <a-checkbox :checked="!!attr.unique" @change="checkboxChange('unique',$event)">不允许重复</a-checkbox>
            </a-col>
        </a-row>
        <div class="custom-form-item">
            <a-row>
                <a-col :span="5" class="ant-form-item-label">
                    <label>默认值</label>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="23" class="express-component-in-field-config">
                    <express-editor
                        ref="defaultValueItem"
                        express-purpose="defaultValue"
                        field-type="TEXTAREA"
                        :initial-value="attr.defaultValue.value"
                        :initial-express-type="attr.defaultValue.type"
                        :module-id="moduleId"
                        :field-id="fieldId"
                        :attr="attr"
                        @change="defaultValueChange"
                    />
                </a-col>
                <a-col :span="1" class="express-component-in-field-config-help">
                    <form-help :offset-x="-10">{{ FIELD_HELP.DEFAULT_VALUE }}</form-help>
                </a-col>
            </a-row>
        </div>
        <formItemWithHelp label="默认提示" :help-txt="FIELD_HELP.PLACEHOLDER">
            <a-input v-model="attr.defaultPrompt" />
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
        name: "TextConfig",
        mixins: [fieldConfig],
        methods: {
            handleMaxLengthBlur() {
                this.$refs.form.validateField(['minLength', 'maxLength']);
            },
            handleMinLengthBlur() {
                if (this.attr.maxLength) {
                    this.$refs.form.validateField(['minLength', 'maxLength']);
                } else {
                    this.$refs.form.validateField(['minLength']);
                }
            },
            async customValidate() {
                return await this.$refs.defaultValueItem.checkExpress();
            },
            customReset() {
                this.$refs.defaultValueItem.reset();
            }
        }
    }
</script>

<style scoped>

</style>
