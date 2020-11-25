<template>
    <form-item-with-help
        ref="formItem"
        :label="attr.title" :validate="String(attr.apiName)"
        :rules="rules"
        :help-txt="attr.hint"
    >
        <a-input-number
            v-model="form[attr.apiName]"
            class="width100"
            :placeholder="attr.defaultPrompt"
            @blur="$refs.formItem.$emit('blur')"
            @change="handleFieldChange"
        />

        <!--        <a-input-->
        <!--            v-model="form[attr.apiName]"-->
        <!--            class="width100"-->
        <!--            :placeholder="attr.defaultPrompt"-->
        <!--            @blur="$refs.formItem.$emit('blur')"-->
        <!--            @change="handleFieldChange"-->
        <!--        />-->
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";
    export default {
        name: "TextareaForm",
        mixins: [fieldForm],
        computed: {
            rules: function(){
                let {required,title, minValue,maxValue} = this.attr;
                let rules = [
                    this.customRules,
                    {
                        validator: (rule,value)=>{
                            if (!value) {
                                return true;
                            }
                            if (!/^([0-9]+|-[1-9])[0-9]*$/.test(value)) {
                                rule.message = '请输入整数';
                                return false;
                            }
                            if (minValue && value < minValue) {
                                if (maxValue) {
                                    rule.message = `请输入${minValue}-${maxValue}之间的整数`;
                                } else {
                                    rule.message = `请输入大于等于${minValue}的整数`;
                                }
                                return false;
                            }
                            if (maxValue && value > maxValue) {
                                if (minValue) {
                                    rule.message = `请输入${minValue}-${maxValue}之间的整数`;
                                } else {
                                    rule.message = `请输入小于等于${maxValue}的整数`;
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
