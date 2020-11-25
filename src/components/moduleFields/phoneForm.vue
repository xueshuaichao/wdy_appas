<template>
    <form-item-with-help
        ref="formItem1"
        :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
        :help-txt="attr.hint"
    >
        <a-input
            v-model="form[attr.apiName]"
            :placeholder="attr.defaultPrompt"
            @blur="$refs.formItem1.$emit('blur')"
            @change="handleFieldChange"
        />
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";
    export default {
        name: "PhoneForm",
        mixins: [fieldForm],
        computed: {
            rules: function(){
                let {required,title, phoneType} = this.attr;
                let rules = [this.customRules];

                if(required) {
                    rules.push({ required: true, message: `请输入${title}`, trigger: 'blur' })
                }
                if(phoneType === 'MOBILE') {
                    rules.push({
                        message: `手机号格式不正确`,
                        trigger: 'blur',
                        validator: function(rule, value){
                            if (!value) {
                                return true;
                            }
                            return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(value)
                        }
                    })
                }
                return rules;
            }
        },
    }
</script>

<style scoped>

</style>
