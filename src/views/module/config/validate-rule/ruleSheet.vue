<template>
    <a-form-model
    
        ref="form" layout="horizontal" :model="attr"
        
        class="custom-form" :label-col="labelCol" :wrapper-col="wrapperCol"
    >
        <formItemWithHelp
            ref="formItem"
            label="规则名称"
            validate="name"
            class="ant-form-item-required"
            :rules="[{ required: true, message: '请输入规则名称', trigger: 'blur' }]"
        >
            <a-input v-model.trim="attr.name" class="from-item" @blur="$refs.formItem.$emit('blur')" />
        </formItemWithHelp>
        <formItemWithHelp
            ref="formItem1"
            label="API名称"
            validate="apiName"
            :help-txt="FIELD_HELP.API_NAME"
            :rules="apiNameRules"
        >
            <a-input
                v-model="attr.apiName" :disabled="isUpdate" class="from-item"
                @blur="$refs.formItem1.$emit('blur')"
            />
        </formItemWithHelp>
        <formItemWithHelp label="描述">
            <a-textarea v-model="attr.description" class="custom-textarea" />
        </formItemWithHelp>

        <div class="custom-form-item">
            <a-row>
                <a-col :span="5" class="ant-form-item-label ant-form-item-required">
                    <label>校验条件</label>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="23" class="express-component-in-field-config">
                    <expressEditor
                        ref="defaultValueItem"
                        express-purpose="validate"
                        :initial-value="attr.content"
                        :initial-express-type="2"
                        :module-id="moduleId"
                        @change="validateValueChange"
                    />
                </a-col>
            </a-row>
        </div>

        <div class="custom-form-item">
            <a-row>
                <a-col :span="5" class="ant-form-item-label ant-form-item-required">
                    <label>错误信息</label>
                </a-col>
            </a-row>
            <a-row style="margin-bottom:5px;">
                <a-col :span="20" offset="2">
                    <p class="error-info">当满足以上校验条件，即公式结果返回true时，显示以下错误信息</p>
                </a-col>
            </a-row>

            <a-row>
                <a-col :span="23" class="express-component-in-field-config">
                    <a-textarea 
                        v-model="attr.hint" 
                        class="custom-textarea" 
                        :class="{'custom-err-item': toMaskAlert}"
                        @blur="handleErrMsgBlur"
                    />
                </a-col>
            </a-row>
            <a-row>
                <a-col :offset="2">
                    <div v-show="toMaskerrMsg" class="custom-err-msg" style="line-height: 22px;margin-top: 5px">
                        {{ toMaskerrMsg }}
                    </div>
                </a-col>
            </a-row>
        </div>
        <formItemWithHelp
            validate="displayMode"
            label="错误提示位置" :help-txt="FIELD_HELP.ERROR_INFO_POSITION"
            :rules="[{ required: true, message: '请选择错误提示位置', trigger: 'blur' }]"
        >
            <a-radio-group v-model="attr.displayMode">
                <a-radio value="POPUP">页首提示</a-radio>
                <a-radio value="FIELD">字段</a-radio>
            </a-radio-group>
        </formItemWithHelp>
        <formItemWithHelp
            v-if="attr.displayMode === 'FIELD'"
            validate="displayApiName"
            class="hide-required"
            label=" " :colon="false"
            :rules="[{ required: true, message: '请选择字段', trigger: 'blur' }]"
        >
            <a-select
                v-model="attr.displayApiName"
                placeholder="请选择字段"
            >
                <a-select-option
                    v-for="option in operator1"
                    :key="option.id" :value="option.apiName"
                >
                    {{ option.title }}
                </a-select-option>
            </a-select>
        </formItemWithHelp>
    </a-form-model>
</template>

<script>
    import formItemWithHelp from "@/components/public/formItemWithHelp";
    import expressEditor from '@/components/public/expressEditor.vue';
    import TXT from "@/const/txt"
    import { checkFieldApiName } from "@/api/module";

    export default {
        name: "RuleSheet",
        components: {
            formItemWithHelp,
            expressEditor,
        },
        props: ["moduleId","attr","isUpdate"],
        data: ()=>{
            return {
                labelCol: { span: 5 },
                wrapperCol: { span: 18 },
                FIELD_HELP: TXT.FIELD_HELP,
                toMaskAlert: false,
                toMaskerrMsg: '',
            }
        },
        computed: {
            operator1: function(){
                let filterList = this.$store.state.module.fieldList.filter((item)=>item.fieldSource == 1)
                return filterList.map((item)=>{
                    return {
                        id: item.id,
                        title: item.attr.title,
                        apiName: item.apiName
                    }
                })
            },
            apiNameRules: function(){
                let rules = [
                    { required: true, message: '请输入API名称', trigger: 'blur' },
                    {
                        message: '8-30位字符，只能包含大小写字母、数字、下划线，不能以下划线开头和结尾',
                        validator: (rule, value) => {
                            return value.length >= 8 && value.length <= 30 && !/[^0-9a-zA-Z_]/.test(value) && !value.startsWith('_') && !value.endsWith('_')
                        },
                        trigger: 'blur'
                    },
                    {
                        asyncValidator: (rule,value)=>{
                            return new Promise( (resolve, reject) => {
                                if(this.isUpdate){
                                    resolve();
                                    return;
                                }

                                checkFieldApiName(this.moduleId,value).then((flag)=>{
                                    if(flag){
                                        resolve();
                                    } else {
                                        reject('API名称重复');
                                    }
                                }).catch(()=>resolve())
                            })
                        }
                    }
                ];

                return rules;
            },


        },
        watch: {
            'attr.displayMode'(newValue) {
                if (newValue === 'POPUP') {
                    this.attr.displayApiName = undefined;
                }
            }
        },
        mounted() {
            
        },
        methods: {
            validateValueChange({value}) {
                this.attr.content = value;
            },
            async customValidate() {
                const flag1 = await this.$refs.defaultValueItem.checkExpress();
                const flag2 = await this.handleErrMsgBlur();
                return flag1 && flag2;
            },
            customReset(expressType) {
                this.$refs.defaultValueItem.reset(expressType)
            },
            handleErrMsgBlur() {
                const { hint } = this.attr;
                if (!hint) {
                    this.toMaskAlert = true;
                    this.toMaskerrMsg = '错误信息不能为空'
                    return false;
                }
                this.toMaskAlert = false;
                this.toMaskerrMsg = ''
                return true;
            }
        }
    }
</script>

<style lang="less">
@import '../../../../less/variables.less';
.error-info{
    font-size: 13px;
    color: @modalFontColor45;
}


</style>
