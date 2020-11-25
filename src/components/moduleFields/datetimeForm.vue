<template>
    <form-item-with-help
        ref="formItem"
        :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
        :help-txt="attr.hint"
    >
        <a-month-picker
            v-if="attr.dateType == 'YYYY_MM'"
            v-model="form[attr.apiName]"
            :placeholder="attr.defaultPrompt"
            @change="handleChange"
        />
        <a-date-picker
            v-else
            v-model="form[attr.apiName]"
            :show-time="attr.dateType == 'YYYY_MM_DD_HH_MM_SS'"
            :placeholder="attr.defaultPrompt"
            @change="handleChange"
        />
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";
    import moment from 'moment';
    export default {
        name: "DatetimeForm",
        mixins: [fieldForm],
        computed: {
            rules: function(){
                let {required,title} = this.attr;

                let rules = [this.customRules];

                if(required) {
                    rules.push({ required: true, message: `请输入${title}`, trigger: 'blur' })
                }

                return rules;
            }
        },
        methods: {
            handleChange: function(){
                this.$refs.formItem.$emit('blur')
                this.handleFieldChange();
            }
        }
    }
</script>

<style scoped>

</style>
