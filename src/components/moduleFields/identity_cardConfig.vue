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
        <a-row class="custom-form-item">
            <a-col :span="8" :offset="5">
                <a-checkbox :checked="!!attr.required" @change="checkboxChange('required',$event)">必填</a-checkbox>
            </a-col>
            <a-col :span="8">
                <a-checkbox
                    :checked="!!attr.unique"
                    @change="checkboxChange('unique',$event)"
                >
                    不允许重复
                </a-checkbox>
            </a-col>
        </a-row>
        <maskItem ref="maskItem" type="CARD" :attr="attr" />
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
                        field-type="IDENTITY_CARD"
                        disable-fn-and-operator
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
    import maskItem from '@/components/public/maskItem'
    export default {
        name: "IdentityCardConfig",
        components: {
            maskItem
        },
        mixins: [fieldConfig],
        methods: {
            staticDefaultValueValidate: function(){
                if(this.attr.defaultValue.type == 2) return true

                if (this.attr.defaultValue.value==='') {
                    return true;
                }
                if(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.attr.defaultValue.value)){
                    return true;
                }else{
                    this.$refs.defaultValueItem.setStaticValueErr('身份证号格式不正确');
                    return false;
                }
            },
            customValidate: async function(){
                let expressDefaultValueValid = await this.$refs.defaultValueItem.checkExpress();
                let staticDefaultValueValid = this.staticDefaultValueValidate();
                let maskValid = this.$refs.maskItem.validate()
                return expressDefaultValueValid && staticDefaultValueValid && maskValid;
            },
            customReset() {
                this.$refs.defaultValueItem.reset();
            }
        }
    }
</script>

<style scoped>

</style>
