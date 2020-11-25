import formItemWithHelp from "@/components/public/formItemWithHelp";
import {Observer,EVENT_NAME} from "@/lib/observer";

export default {
    props: ["form","attr","initialData",'isDepended','isUpdate'],
    components: {
        formItemWithHelp
    },
    data: function(){
        return {
            errValidateMsg: ''
        }
    },
    created(){
        //曲线救国，用于设置antd表单错误状态
        this.customRules = {
            validator: (rule)=>{
                if(this.errValidateMsg){
                    rule.message = this.errValidateMsg;
                    return false;
                }else{
                    rule.message = '';
                    return true;
                }
            }
        }
    },
    methods: {
        handleFieldChange:function(){
            if(this.isUpdate) return;
            
            let defaultValue = this.attr.defaultValue;
            if(defaultValue.type == 2 && defaultValue.referFields.length){
                Observer.emit(EVENT_NAME.FIELD_CLEAR_DEPENDENCE,this.attr.apiName);
            }

            if(this.isDepended){
                clearTimeout(this.defaultValueComputedTime);
                this.defaultValueComputedTime = setTimeout(()=>{
                    Observer.emit(EVENT_NAME.FIELD_DEFAULT_VALUE_COMPUTE);
                },500)
            }
        },
        setValidateErrorMsg: function(msg){
            this.errValidateMsg = msg;
            this.$emit('validateField',this.attr.apiName);
            this.errValidateMsg = '';
        }
    }
}
