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
        name: "IdentityCardForm",
        mixins: [fieldForm],
        computed: {
            rules: function(){
                let {required,title} = this.attr;

                let rules = [
                    this.customRules,
                    {
                        message: `身份证号格式不正确`,
                        trigger: 'blur',
                        validator: function(rule, value){
                            if (!value) {
                                return true;
                            }
                            return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)
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
