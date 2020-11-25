<template>
    <a-form-model-item ref="name" :label="label" :rules="rules" :prop="validate" :colon="colon">
        <a-row :gutter="8" type="flex" align="middle">
            <a-col :span="23">
                <slot/>
            </a-col>
            <a-col v-if="helpTxt" :span="1">
                <formHelp :offset-x="helpOffsetX" ><div v-html="format(helpTxt)"></div></formHelp>
            </a-col>
        </a-row>
    </a-form-model-item>
</template>

<script>
    import formHelp from "@/components/public/formHelp";

    export default {
        name: "FormItemWithHelp",
        components: {
            formHelp
        },
        props: {
            label: String,
            validate: String,
            helpTxt: {
                type: String,
                default: ''
            },
            helpOffsetX: {
                type: Number,
                default: -12
            },
            rules: {
                type: Array,
                default: ()=>[]
            },
            colon: {
                type: Boolean,
                default: true
            },
        },
        mounted() {
            this.$on("blur", ()=> {
                this.$refs.name.onFieldBlur()
            });
        },
        methods: {
            format(value) {
                const newvalue = value.replace(/\n/g,"<br/>")
                return newvalue;
            }
        }
    }
</script>

<style scoped>

</style>
