<template>
    <form-item-with-help
        ref="formItem"
        :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
        :help-txt="attr.hint"
    >
        <a-textarea
            v-model="form[attr.apiName]"
            class="custom-textarea"
            :placeholder="attr.defaultPrompt"
            @blur="$refs.formItem.$emit('blur')"
            @change="handleFieldChange"
        />
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";

    export default {
        name: "TextareaForm",
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
                                if (maxLength) {
                                    rule.message = `请输入${minLength}-${maxLength}个字符`;
                                } else {
                                    rule.message = `请输入不小于${minLength}个字符`;
                                }
                                return false;
                            }
                            if (maxLength && value.length > maxLength) {
                                if (minLength) {
                                    rule.message = `请输入${minLength}-${maxLength}个字符`;
                                } else {
                                    rule.message = `请输入不大于${maxLength}个字符`;
                                }
                                return false;
                            }

                            return true;
                        },
                        trigger: 'blur'
                    }
                ];

                if(required) {
                    rules.push({ required: true, message: `请输入${title}`, trigger: 'blur' })
                }

                return rules;
            }
        }
    }
</script>

<style scoped>

</style>
