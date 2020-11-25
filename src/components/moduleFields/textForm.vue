<template>
    <form-item-with-help
        ref="formItem"
        :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
        :help-txt="attr.hint"
    >
        <a-input
            v-model="form[attr.apiName]"
            :placeholder="attr.defaultPrompt"
            @blur="$refs.formItem.$emit('blur')"
            @change="handleFieldChange"
        />
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";

    export default {
        name: "TextForm",
        mixins: [fieldForm],
        computed: {
            rules: function(){
                let {required,maxLength,minLength,title} = this.attr;
                let rules = [
                    this.customRules,
                    {
                        validator: (rule,value)=>{
                            if (!value) {
                                return true;
                            }
                            if (minLength && value.length < minLength) {
                                rule.message = `请输入大于等于${minLength}个字符`;
                                return false;
                            }
                            if (maxLength && value.length > maxLength) {
                                rule.message = `请输入小于等于${maxLength}个字符`;
                                return false;
                            }
                            return true;
                        },
                        trigger: 'blur'
                    },
                    { min: minLength, max: maxLength, message: `请输入${minLength}-${maxLength}个字符`, trigger: 'blur' }
                ];

                if(required) {
                    rules.push({ required: true, message: `请输入${title}`, trigger: 'blur' })
                }

                return rules;
            }
        },
        created() {
        }
    }
</script>

<style scoped>

</style>
