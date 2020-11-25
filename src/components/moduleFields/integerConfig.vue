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
            label="最大值"
            validate="maxValue"
            :rules="maxValueRule"
        >
            <a-input-number
                v-model="attr.maxValue" :formatter="limitInteger"
                :parser="limitInteger" class="width100"
                @blur="handleMaxValueBlur"
            />
        </formItemWithHelp>
        <formItemWithHelp
            ref="formItem3"
            label="最小值"
            validate="minValue"
            :rules="minValueRule"
        >
            <a-input-number
                v-model="attr.minValue" :formatter="limitInteger"
                :parser="limitInteger" class="width100"
                @blur="handleMinValueBlur"
            />
        </formItemWithHelp>
        <a-row class="custom-form-item">
            <a-col :span="8" :offset="5">
                <a-checkbox :checked="!!attr.required" @change="checkboxChange('required',$event)">必填</a-checkbox>
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
                        field-type="INTEGER"
                        :initial-value="attr.defaultValue.value"
                        :initial-express-type="attr.defaultValue.type"
                        :module-id="moduleId"
                        :field-id="fieldId"
                        :attr="attr"
                        :custom-static-value="staticDefaultValue1"
                        @change="defaultValueChange"
                    >
                        <a-input-number
                            slot="staticValue"
                            v-model="staticDefaultValue1"
                            :formatter="limitInteger"
                            :parser="limitInteger"
                            class="width100"
                            @change="defaultValueChange({value: staticDefaultValue1})"
                        />
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
    import fieldConfig from '@/mixin/fieldConfig'
    import {limitInteger} from "@/lib/utils.js"

    export default {
        name: "TextConfig",
        mixins: [fieldConfig],
        data() {
            return {
                // staticDefaultValue: this.attr.defaultValue.value
                staticDefaultValue: this.attr.defaultValue.type === 2 ? this.attr.defaultValue.value : '',
                staticDefaultValue1: this.attr.defaultValue.type === 1 ? this.attr.defaultValue.value : '',
            }
        },
        computed: {
            maxValueRule: function(){
                let {minValue} = this.attr;
                let rules = [
                    {
                        validator: (rule,value)=>{
                            if (!value) {
                                return true;
                            }

                            if (!/^([0-9]+|-[1-9])[0-9]*$/.test(value)) {
                                rule.message = '请输入整数';
                                return false;
                            }
                            if (minValue && value <= minValue) {
                                rule.message = '最大值的数值要大于最小值的数值';
                                return false;
                            }
                            return true;
                        },
                        trigger: 'blur'
                    }
                ];

                return rules;
            },
            minValueRule: function(){
                let {maxValue} = this.attr;
                let rules = [
                    {
                        validator: (rule,value)=>{
                            if (!value) {
                                return true;
                            }

                            if (!/^([0-9]+|-[1-9])[0-9]*$/.test(value)) {
                                rule.message = '请输入整数';
                                return false;
                            }
                            if (maxValue && value >= maxValue) {
                                rule.message = '最小值的数值要小于最大值的数值';
                                return false;
                            }
                            return true;
                        },
                        trigger: 'blur'
                    }
                ];

                return rules;
            }
        },
        methods: {
            limitInteger,
            handleMaxValueBlur() {
                if (this.attr.minValue) {
                    this.$refs.form.validateField(['minValue', 'maxValue']);
                } else {
                    this.$refs.form.validateField(['minValue']);
                }
            },
            handleMinValueBlur() {
                if (this.attr.maxValue) {
                    this.$refs.form.validateField(['minValue', 'maxValue']);
                } else {
                    this.$refs.form.validateField(['minValue']);
                }
            },
            staticDefaultValueValidate: function(){
                let {minValue, maxValue} = this.attr;
                let staticDefaultValue = this.staticDefaultValue;

                if (staticDefaultValue===null || staticDefaultValue==='') {
                    return true;
                }

                if (!/^([0-9]+|-[1-9])[0-9]*$/.test(staticDefaultValue)) {
                    this.$refs.defaultValueItem.setStaticValueErr('默认值必须为整数');
                    return false;
                }
                if (minValue && staticDefaultValue < minValue) {
                    this.$refs.defaultValueItem.setStaticValueErr('默认值不得小于最小值');
                    return false;
                }
                if (maxValue && staticDefaultValue > maxValue) {
                    this.$refs.defaultValueItem.setStaticValueErr('默认值不得大于最大值');
                    return false;
                }
                return true;
            },
            async customValidate() {
                let expressDefaultValueValid = await this.$refs.defaultValueItem.checkExpress();
                // let staticDefaultValueValid = this.staticDefaultValueValidate();
                return expressDefaultValueValid;
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
