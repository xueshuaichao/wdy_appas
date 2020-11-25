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
        name: "EmailForm",
        mixins: [fieldForm],
        computed: {
            rules: function(){
                let {required,maxLength,minLength,title} = this.attr;
                let rules = [
                    this.customRules,
                    {
                        message: `邮箱格式不正确`,
                        trigger: 'blur',
                        validator: function(rule, value){
                            if (!value) {
                                return true;
                            }
                            return /^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(value)
                        }
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
