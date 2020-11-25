<template>
    <form-item-with-help
        ref="formItem"
        :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
        :help-txt="attr.hint"
    >
        <a-checkbox-group v-model="form[attr.apiName]" @change="handleFieldChange">
            <a-checkbox v-for="option in filterOptions" :key="option.value" :value="option.value">
                {{ option.label }}
            </a-checkbox>
        </a-checkbox-group>
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";

    export default {
        name: "CheckboxForm",
        mixins: [fieldForm],
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
                return this.attr.optionList.filter((item)=> item.enable)
            }
        }
    }
</script>

<style scoped>

</style>
