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
                v-model="attr.title" class="from-item"
                :disabled="!isCustom"
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
        <formItemWithHelp
            label="显示格式"
            :rules="[{ required: true, message: '请选择显示格式', trigger: 'blur' }]"
        >
            <a-select v-model="attr.dateType" :disabled="fieldDisabled">
                <a-select-option value="YYYY_MM">年-月</a-select-option>
                <a-select-option value="YYYY_MM_DD">年-月-日</a-select-option>
                <a-select-option value="YYYY_MM_DD_HH_MM_SS">年-月-日 时-分-秒</a-select-option>
            </a-select>
        </formItemWithHelp>
        <a-row class="custom-form-item">
            <a-col :span="8" :offset="5">
                <a-checkbox
                    :checked="!!attr.required"
                    :disabled="!isCustom"
                    @change="checkboxChange('required',$event)"
                >
                    必填
                </a-checkbox>
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
                        field-type="DATETIME"
                        :initial-value="attr.defaultValue.value"
                        :initial-express-type="attr.defaultValue.type"
                        :module-id="moduleId"
                        :field-id="fieldId"
                        :attr="attr"
                        :custom-static-value="staticDefaultValue1"
                        @change="defaultValueChange"
                    >
                        <a-month-picker
                            v-if="attr.dateType == 'YYYY_MM'"
                            slot="staticValue"
                            v-model="staticDefaultValue1"
                            class="width100"
                            @change="defaultValueChange({value: staticDefaultValue1 ? staticDefaultValue1.format('YYYY-MM-DD HH:mm:ss') : staticDefaultValue1})"
                        />
                        <a-date-picker
                            v-else
                            slot="staticValue"
                            v-model="staticDefaultValue1"
                            class="width100"
                            :show-time="attr.dateType == 'YYYY_MM_DD_HH_MM_SS'"
                            @change="defaultValueChange({value: staticDefaultValue1 ? staticDefaultValue1.format('YYYY-MM-DD HH:mm:ss') : staticDefaultValue1})"
                        />
                    </express-editor>
                </a-col>
                <a-col :span="1" class="express-component-in-field-config-help">
                    <form-help :offset-x="-10">{{ FIELD_HELP.DEFAULT_VALUE }}</form-help>
                </a-col>
            </a-row>
        </div>
        <formItemWithHelp label="默认提示" :help-txt="FIELD_HELP.PLACEHOLDER">
            <a-input v-model="attr.defaultPrompt" :disabled="!isCustom" />
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
    import moment from 'moment';

    export default {
        name: "DatetimeConfig",
        mixins: [fieldConfig],
        data: function(){
            return {
                staticDefaultValue: null,
                staticDefaultValue1: null,
            }
        },
        mounted() {
            if (this.attr.defaultValue.type === 1 && this.attr.defaultValue.value) {
                this.staticDefaultValue1 = moment(this.attr.defaultValue.value);
            }
            if (this.attr.defaultValue.type === 2) {
                this.staticDefaultValue = this.attr.defaultValue.value;
            }
        },
        methods: {
            async customValidate() {
                return await this.$refs.defaultValueItem.checkExpress();
            },
            customReset() {
                this.$refs.defaultValueItem.reset();
                this.staticDefaultValue = null;
                this.staticDefaultValue1 = null;
            }
        }

    }
</script>

<style scoped>

</style>
