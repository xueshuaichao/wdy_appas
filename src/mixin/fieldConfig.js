
import _ from "lodash";
import formItemWithHelp from "@/components/public/formItemWithHelp";
import FormHelp from "@/components/public/formHelp";
import expressEditor from "@/components/public/expressEditor";
import TXT from "@/const/txt"
import { checkFieldApiName } from "@/api/module";
import {limitDecimals} from "@/lib/utils.js"


export default {
    props: ["moduleId","fieldId","attr","isUpdate","isCustom"],
    components: {
        formItemWithHelp,
        FormHelp,
        expressEditor
    },
    data: ()=>{
        return {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
            FIELD_HELP: TXT.FIELD_HELP
        }
    },
    computed: {
        fieldDisabled: function(){
            return this.isUpdate || !this.isCustom
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
                    message: '不能取名为id',
                    validator: (rule, value) => {
                        return value != 'id';
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
        maxLengthRules: function(){
            let {minLength} = this.attr;
            let rules = [
                { required: true, message: '请输入最大长度', trigger: 'blur' },
                {
                    validator: (rule,value)=>{
                        if (!value) {
                            return true;
                        }
                        if (!/^[1-9]+[0-9]*$/.test(value)) {
                            rule.message = '请输入正整数';
                            return false;
                        }
                        if (minLength && value <= minLength) {
                            rule.message = '“最大长度”数值必须大于“最小长度”数值';
                            return false;
                        }
                        return true;
                    },
                    trigger: 'blur'
                }
            ];

            return rules;
        },
        minLengthRules: function(){
            let {maxLength} = this.attr;
            let rules = [
                {
                    validator: (rule,value)=>{
                        if (!value) {
                            return true;
                        }
                        if (!/^[1-9]+[0-9]*$/.test(value)) {
                            rule.message = '请输入正整数';
                            return false;
                        }
                        if (maxLength && value >= maxLength) {
                            rule.message = '“最小长度”数值必须小于“最大长度”数值';
                            return false;
                        }
                        return true;
                    },
                    trigger: 'blur'
                }
            ];

            return rules;
        },
        integerRule: function() {
            return {
                message: '请输入正整数',
                validator: (rule,value)=>{
                    if (!value) {
                        return true;
                    }
                    return /^[1-9]+[0-9]*$/.test(value);
                },
                trigger: 'blur'
            }
        }
    },
    methods: {
        limitDecimals,
        customValidate: function(){
            return true;    //各个组件自行实现
        },
        customReset: function(){
            //各组件自行实现
        },
        checkboxChange: function(type,$event){
            this.attr[type] = Number($event.target.checked)
        },
        defaultValueChange: function({type,value}){
            if(type) this.attr.defaultValue.type = type;
            this.attr.defaultValue.value = value;
        }
    }
}
