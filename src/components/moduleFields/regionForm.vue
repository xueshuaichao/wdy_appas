<template>
    <form-item-with-help
        :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
        :help-txt="attr.hint"
    >
        <region-select
            ref="regionSelect"
            :placeholder="attr.defaultPrompt" :initial-data="regionInitalData" :region-type="attr.regionType"
            @change="change"
        />
    </form-item-with-help>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";
    import regionSelect from "@/components/public/regionSelect";

    export default {
        name: "RegionForm",
        components: {
            regionSelect
        },
        mixins: [fieldForm],
        data: function(){
            return {
                regionInitalData: this.form[this.attr.apiName]
            }
        },
        computed: {
            rules: function(){
                let {required,title} = this.attr;
                let rules = [this.customRules];

                if(required) {
                    rules.push({ required: true, message: `请输入${title}`})
                }

                return rules;
            }
        },
        methods: {
            change: function(val,isManual){
                this.form[this.attr.apiName] = val;
                if(isManual) this.handleFieldChange();
            },
            setValue: function(val){
                this.form[this.attr.apiName] = val;
                this.$refs.regionSelect.setValue(val);
            }
        }
    }
</script>

<style scoped>

</style>
