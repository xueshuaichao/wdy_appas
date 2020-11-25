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
        <a-row class="custom-check-box-group">
            <a-col :span="8" :offset="5">
                <a-checkbox :checked="!!attr.required" @change="checkboxChange('required',$event)">必填</a-checkbox>
            </a-col>
        </a-row>
        <formItemWithHelp label="显示格式" validate="regionType" :rules="[{required: true}]">
            <a-select v-model="attr.regionType" :disabled="fieldDisabled">
                <a-select-option :value="1">省</a-select-option>
                <a-select-option :value="2">省-市</a-select-option>
                <a-select-option :value="3">省-市-区</a-select-option>
            </a-select>
        </formItemWithHelp>
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
                        field-type="REGION"
                        disable-fn-and-operator
                        :initial-value="attr.defaultValue.value"
                        :initial-express-type="attr.defaultValue.type"
                        :module-id="moduleId"
                        :field-id="fieldId"
                        :attr="attr"
                        :custom-static-value="staticDefaultValue"
                        @change="defaultValueChange"
                    >
                        <region-select
                            slot="staticValue" :initial-data="initialRegionData" :region-type="attr.regionType"
                            @change="changeDefault"
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
    import fieldConfig from "@/mixin/fieldConfig";
    import regionSelect from "@/components/public/regionSelect";

    export default {
        name: "RegionConfig",
        components: {
            regionSelect
        },
        mixins: [fieldConfig],
        data: function(){
            return {
                initialRegionData: this.attr.defaultValue.type == 1? this.attr.defaultValue.value : '',
                staticDefaultValue: '',
            }
        },
        methods: {
            changeDefault: function(val){
                this.staticDefaultValue = val;
                this.attr.defaultValue.value = val;
            },
            async customValidate() {
                return await this.$refs.defaultValueItem.checkExpress();
            },
            customReset() {
                this.staticDefaultValue = '';
                this.$refs.defaultValueItem.reset();
            }
        }
    }
</script>

<style scoped>

</style>
