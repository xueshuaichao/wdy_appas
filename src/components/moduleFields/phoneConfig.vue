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
                v-model="attr.apiName"
                :disabled="fieldDisabled" class="from-item"
                @blur="$refs.formItem1.$emit('blur')"
            />
        </formItemWithHelp>
        <formItemWithHelp
            label="显示格式"
            validate="phoneType"
            :rules="[{ required: true, message: '请选择显示格式', trigger: 'blur' }]"
        >
            <a-select v-model="attr.phoneType">
                <a-select-option value="MOBILE">
                    手机号
                </a-select-option>
                <a-select-option value="FIXED">
                    座机号
                </a-select-option>
            </a-select>
        </formItemWithHelp>
        <a-row class="custom-form-item">
            <a-col :span="8" :offset="5">
                <a-checkbox :checked="!!attr.required" @change="checkboxChange('required',$event)">必填</a-checkbox>
            </a-col>
            <a-col :span="8">
                <a-checkbox :checked="!!attr.unique" @change="checkboxChange('unique',$event)">不允许重复</a-checkbox>
            </a-col>
        </a-row>
        <maskItem ref="maskItem" type="PHONE" :attr="attr" />
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
                        field-type="PHONE"
                        disable-fn-and-operator
                        :initial-value="attr.defaultValue.value"
                        :initial-express-type="attr.defaultValue.type"
                        :module-id="moduleId"
                        :field-id="fieldId"
                        :attr="attr"
                        :custom-static-value="staticDefaultValue1"
                        @change="defaultValueChange"
                    >
                        <a-input slot="staticValue" v-model="staticDefaultValue1" @change="defaultValueChange({value: staticDefaultValue1})" />
                    </express-editor>
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
    import fieldConfig from '@/mixin/fieldConfig';
    import maskItem from '@/components/public/maskItem'
    export default {
        name: "PhoneConfig",
        components: {
            maskItem,
        },
        mixins: [fieldConfig],
        data: function(){
            return {
                staticDefaultValue: this.attr.defaultValue.type === 2 ? this.attr.defaultValue.value : '',
                staticDefaultValue1: this.attr.defaultValue.type === 1 ? this.attr.defaultValue.value : '',
            }
        },
        methods: {
            staticDefaultValueValidate: function(){
                const { phoneType } = this.attr;
                const type = this.attr.defaultValue.type;
                if (phoneType === 'FIXED' || this.staticDefaultValue1==='' || type === 2) {
                    return true;
                }
                if(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.staticDefaultValue1)){
                    return true;
                }else{
                    this.$refs.defaultValueItem.setStaticValueErr('手机号格式不正确');
                    return false;
                }
            },
            async customValidate() {
                let expressDefaultValueValid = await this.$refs.defaultValueItem.checkExpress();
                let staticDefaultValueValid = this.staticDefaultValueValidate();
                let maskValid = this.$refs.maskItem.validate()
                return expressDefaultValueValid && staticDefaultValueValid && maskValid;
            },
            customReset() {
                this.$refs.defaultValueItem.reset();
                this.staticDefaultValue = '';
                this.staticDefaultValue1 = '';
            }
        }
    }
</script>

<style scoped>

</style>
