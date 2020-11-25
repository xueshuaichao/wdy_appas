<template>
    <form-item-with-help
        ref="formItem"
        :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
        :help-txt="attr.hint"
    >
        <a-select
            v-model="form[attr.apiName]" mode="multiple" :placeholder="attr.defaultPrompt"
            :show-arrow="true"
            @change="handleFieldChange"
        >
            <a-select-option
                v-for="option in filterOptions"
                :key="option.value" :value="option.value"
            >
                {{ option.label }}
            </a-select-option>
        </a-select>
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";
    import {getSeleteTemplateOptions} from '@/api/business';

    export default {
        name: "DropdownCheckboxForm",
        mixins: [fieldForm],
        data: ()=>{
            return {
                optionList: []
            }
        },
        computed: {
            rules: function(){
                let {required,title} = this.attr;
                let rules = [this.customRules];

                if(required) {
                    rules.push({ required: true, message: `请输入${title}`, trigger: 'blur' })
                }

                return rules;
            },
            filterOptions: function(){
                return this.optionList.filter((item)=> item.enable)
            }
        },
        async mounted() {
            let {optionsType,templateId,optionList} = this.attr;

            if(optionsType == 'custom'){
                this.optionList = optionList;
            }else{
                try{
                    let res = await getSeleteTemplateOptions(templateId);
                    this.optionList = res;
                }catch (e) {
                    this.$message.error('获取选项数据失败');
                }
            }
        }
    }
</script>

<style scoped>

</style>
